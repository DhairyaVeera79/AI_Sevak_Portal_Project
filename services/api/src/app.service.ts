import {
  ForbiddenException,
  Inject,
  Injectable,
  Optional,
  UnauthorizedException,
} from '@nestjs/common';
import { RoleLevel } from '@prisma/client';
import { HealthPayload, PORTAL_DATA_SOURCE } from './data/portal-data-source';
import type { PortalDataSource } from './data/portal-data-source';
import { PrismaService } from './prisma/prisma.service';

type UserRole = 'C1' | 'C2' | 'C3' | 'C4' | 'ADMIN';

interface SessionPayload {
  giId: string;
  role: UserRole;
  iat: number;
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

    const sessionPayload: SessionPayload = {
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
      expiresInSeconds: 60 * 60 * 24,
      authMode: 'mock-v1',
      accepted: password.trim().length >= 4,
    };

    if (response.accepted) {
      await this.persistUserIfPossible(normalizedGiId, role);
    }

    return response;
  }

  getCurrentUserFromToken(sessionToken: string | undefined) {
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

      return {
        giId: decoded.giId,
        role: decoded.role,
      };
    } catch {
      return null;
    }
  }

  requireRole(sessionToken: string | undefined, minRole: UserRole) {
    const user = this.getCurrentUserFromToken(sessionToken);
    if (!user) {
      throw new UnauthorizedException('No active session');
    }

    if (roleWeight[user.role] < roleWeight[minRole]) {
      throw new ForbiddenException(
        `Insufficient role. Required ${minRole} or above.`,
      );
    }

    return user;
  }

  private async persistUserIfPossible(giId: string, role: UserRole) {
    if (!process.env.DATABASE_URL || !this.prismaService) {
      return;
    }

    try {
      await this.prismaService.user.upsert({
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
    } catch {
      return;
    }
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
