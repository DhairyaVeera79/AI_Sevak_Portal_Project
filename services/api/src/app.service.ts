import {
  ForbiddenException,
  Inject,
  Injectable,
  Optional,
  UnauthorizedException,
} from '@nestjs/common';
import { RoleLevel } from '@prisma/client';
import { randomUUID } from 'crypto';
import { HealthPayload, PORTAL_DATA_SOURCE } from './data/portal-data-source';
import type { PortalDataSource } from './data/portal-data-source';
import { PrismaService } from './prisma/prisma.service';

type UserRole = 'C1' | 'C2' | 'C3' | 'C4' | 'ADMIN';

interface SessionPayload {
  sid?: string;
  giId: string;
  role: UserRole;
  iat: number;
}

export interface SessionUser {
  userId?: string;
  giId: string;
  role: UserRole;
}

const roleWeight: Record<UserRole, number> = {
  C4: 1,
  C3: 2,
  C2: 3,
  C1: 4,
  ADMIN: 5,
};

const prismaRoleMap: Record<UserRole, RoleLevel> = {
  C1: RoleLevel.C1,
  C2: RoleLevel.C2,
  C3: RoleLevel.C3,
  C4: RoleLevel.C4,
  ADMIN: RoleLevel.ADMIN,
};

const userRoleMap: Record<RoleLevel, UserRole> = {
  C1: 'C1',
  C2: 'C2',
  C3: 'C3',
  C4: 'C4',
  ADMIN: 'ADMIN',
};

@Injectable()
export class AppService {
  constructor(
    @Inject(PORTAL_DATA_SOURCE)
    private readonly dataSource: PortalDataSource,
    @Optional() private readonly prismaService?: PrismaService,
  ) {}

  getHealth(): HealthPayload {
    return {
      status: 'ok',
      service: 'ai-sevak-portal-api',
      timestamp: new Date().toISOString(),
      dataSourceMode: process.env.DATA_SOURCE_MODE ?? 'mock',
    };
  }

  getSevas() {
    return this.dataSource.getSevas();
  }

  getDashboardMetrics() {
    return this.dataSource.getDashboardMetrics();
  }

  getImpactStories() {
    return this.dataSource.getImpactStories();
  }

  async login(giId: string, password: string) {
    const normalizedGiId = giId.trim().toUpperCase();
    const role = this.deriveRoleFromGiId(normalizedGiId);
    const accepted = password.trim().length >= 4;

    if (!accepted) {
      await this.createAuditEventIfPossible({
        actorGiId: normalizedGiId,
        action: 'auth.login',
        status: 'denied',
        metadataJson: { reason: 'short_password_mock_policy' },
      });
      return {
        giId: normalizedGiId,
        role,
        sessionToken: '',
        expiresInSeconds: 60 * 60 * 24,
        authMode: 'mock-v1',
        accepted,
      };
    }

    const sessionTokenId = randomUUID();
    const expiresInSeconds = 60 * 60 * 24;
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

    const persistedUser = await this.persistUserIfPossible(
      normalizedGiId,
      role,
    );
    await this.persistSessionIfPossible(
      persistedUser?.userId,
      role,
      sessionTokenId,
      expiresAt,
    );

    const sessionPayload: SessionPayload = {
      sid: sessionTokenId,
      giId: normalizedGiId,
      role,
      iat: Date.now(),
    };

    const sessionToken = Buffer.from(
      JSON.stringify(sessionPayload),
      'utf-8',
    ).toString('base64url');

    const response = {
      giId: normalizedGiId,
      role,
      sessionToken,
      expiresInSeconds,
      authMode: 'mock-v1',
      accepted,
    };

    await this.createAuditEventIfPossible({
      actorUserId: persistedUser?.userId,
      actorGiId: normalizedGiId,
      action: 'auth.login',
      status: 'success',
      metadataJson: {
        role,
        sessionTokenId,
        authMode: response.authMode,
      },
    });

    return response;
  }

  async getCurrentUserFromToken(
    sessionToken: string | undefined,
  ): Promise<SessionUser | null> {
    if (!sessionToken) {
      return null;
    }

    try {
      const decoded = JSON.parse(
        Buffer.from(sessionToken, 'base64url').toString('utf-8'),
      ) as SessionPayload;

      if (!decoded.giId || !decoded.role) {
        return null;
      }

      if (decoded.sid && this.hasDatabaseConnection()) {
        try {
          const session = await this.prismaService!.session.findUnique({
            where: { sessionTokenId: decoded.sid },
            include: { user: true },
          });

          if (!session || session.revokedAt || session.expiresAt < new Date()) {
            return null;
          }

          return {
            userId: session.userId,
            giId: session.user.giId,
            role: userRoleMap[session.role],
          };
        } catch {
          return null;
        }
      }

      return {
        giId: decoded.giId,
        role: decoded.role,
      };
    } catch {
      return null;
    }
  }

  async requireRole(sessionToken: string | undefined, minRole: UserRole) {
    const user = await this.getCurrentUserFromToken(sessionToken);
    if (!user) {
      await this.createAuditEventIfPossible({
        action: 'authz.check',
        status: 'denied',
        metadataJson: { reason: 'missing_or_invalid_session', minRole },
      });
      throw new UnauthorizedException('No active session');
    }

    if (roleWeight[user.role] < roleWeight[minRole]) {
      await this.createAuditEventIfPossible({
        actorUserId: user.userId,
        actorGiId: user.giId,
        action: 'authz.check',
        status: 'denied',
        metadataJson: {
          reason: 'insufficient_role',
          currentRole: user.role,
          minRole,
        },
      });
      throw new ForbiddenException(
        `Insufficient role. Required ${minRole} or above.`,
      );
    }

    return user;
  }

  async getRecentAuditEvents(limit = 20) {
    if (!this.hasDatabaseConnection()) {
      return [];
    }

    try {
      return await this.prismaService!.auditEvent.findMany({
        orderBy: { createdAt: 'desc' },
        take: Math.min(Math.max(limit, 1), 100),
      });
    } catch {
      return [];
    }
  }

  private async persistUserIfPossible(giId: string, role: UserRole) {
    if (!this.hasDatabaseConnection()) {
      return null;
    }

    try {
      const user = await this.prismaService!.user.upsert({
        where: { giId },
        update: {
          role: prismaRoleMap[role],
          displayName: giId,
        },
        create: {
          giId,
          role: prismaRoleMap[role],
          displayName: giId,
        },
      });
      return { userId: user.id };
    } catch {
      return null;
    }
  }

  private async persistSessionIfPossible(
    userId: string | undefined,
    role: UserRole,
    sessionTokenId: string,
    expiresAt: Date,
  ) {
    if (!userId || !this.hasDatabaseConnection()) {
      return;
    }

    try {
      await this.prismaService!.session.create({
        data: {
          userId,
          role: prismaRoleMap[role],
          sessionTokenId,
          expiresAt,
          authMode: 'mock-v1',
        },
      });
    } catch {
      return;
    }
  }

  private async createAuditEventIfPossible(params: {
    actorUserId?: string;
    actorGiId?: string;
    action: string;
    target?: string;
    status: string;
    metadataJson?: object;
  }) {
    if (!this.hasDatabaseConnection()) {
      return;
    }

    try {
      await this.prismaService!.auditEvent.create({
        data: {
          actorUserId: params.actorUserId,
          actorGiId: params.actorGiId,
          action: params.action,
          target: params.target,
          status: params.status,
          metadataJson: params.metadataJson,
        },
      });
    } catch {
      return;
    }
  }

  private hasDatabaseConnection() {
    return Boolean(process.env.DATABASE_URL && this.prismaService);
  }

  private deriveRoleFromGiId(giId: string): UserRole {
    if (giId.startsWith('ADMIN-')) {
      return 'ADMIN';
    }
    if (giId.startsWith('C1-')) {
      return 'C1';
    }
    if (giId.startsWith('C2-')) {
      return 'C2';
    }
    if (giId.startsWith('C3-')) {
      return 'C3';
    }
    return 'C4';
  }
}
