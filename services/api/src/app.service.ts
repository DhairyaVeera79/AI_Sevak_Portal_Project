import {
  ForbiddenException,
  Inject,
  Injectable,
  Optional,
  UnauthorizedException,
} from '@nestjs/common';
import { ExpenseStatus, RoleLevel } from '@prisma/client';
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

export interface ExpenseRecord {
  id: string;
  sevaId: string;
  userId?: string;
  actorGiId: string;
  category: string;
  amount: number;
  status: ExpenseStatus;
  attachmentUrl?: string;
  createdAt: string;
  updatedAt: string;
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
  private readonly mockExpenses: ExpenseRecord[] = [
    {
      id: 'EXP-101',
      sevaId: 'SEVA-101',
      userId: undefined,
      actorGiId: 'C3-DEMO',
      category: 'Teaching supplies',
      amount: 3450,
      status: ExpenseStatus.REVIEWED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'EXP-102',
      sevaId: 'SEVA-102',
      userId: undefined,
      actorGiId: 'C4-DEMO',
      category: 'Travel reimbursement',
      amount: 1200,
      status: ExpenseStatus.SUBMITTED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

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

  getModerationQueue() {
    const stories = this.dataSource.getImpactStories();
    return stories.filter(
      (story) => story.stage === 'moderation' || story.stage === 'draft',
    );
  }

  async listExpenses(user: SessionUser) {
    if (this.hasDatabaseConnection()) {
      try {
        const whereClause =
          roleWeight[user.role] >= roleWeight.C3 || !user.userId
            ? {}
            : { userId: user.userId };

        const rows = await this.prismaService!.expense.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          take: 100,
        });

        return rows.map((row) => ({
          id: row.id,
          sevaId: row.sevaId,
          category: row.category,
          amount: Number(row.amount),
          status: row.status,
          attachmentUrl: row.attachmentUrl ?? undefined,
          createdAt: row.createdAt.toISOString(),
          updatedAt: row.updatedAt.toISOString(),
          actorGiId: user.giId,
          userId: row.userId,
        }));
      } catch {
        return this.filterMockExpensesByRole(user);
      }
    }

    return this.filterMockExpensesByRole(user);
  }

  async createExpense(
    user: SessionUser,
    payload: {
      category: string;
      amount: number;
      sevaId: string;
      attachmentUrl?: string;
    },
  ) {
    const normalized = {
      category: payload.category.trim(),
      amount: payload.amount,
      sevaId: payload.sevaId.trim(),
      attachmentUrl: payload.attachmentUrl?.trim() || undefined,
    };

    if (this.hasDatabaseConnection() && user.userId) {
      try {
        const created = await this.prismaService!.expense.create({
          data: {
            sevaId: normalized.sevaId,
            userId: user.userId,
            category: normalized.category,
            amount: normalized.amount,
            status: ExpenseStatus.SUBMITTED,
            attachmentUrl: normalized.attachmentUrl,
          },
        });

        await this.createAuditEventIfPossible({
          actorUserId: user.userId,
          actorGiId: user.giId,
          action: 'expense.create',
          status: 'success',
          target: created.id,
          metadataJson: {
            sevaId: created.sevaId,
            category: created.category,
            amount: Number(created.amount),
          },
        });

        return {
          id: created.id,
          sevaId: created.sevaId,
          category: created.category,
          amount: Number(created.amount),
          status: created.status,
          attachmentUrl: created.attachmentUrl ?? undefined,
          createdAt: created.createdAt.toISOString(),
          updatedAt: created.updatedAt.toISOString(),
        };
      } catch {
        return this.createMockExpense(user, normalized);
      }
    }

    return this.createMockExpense(user, normalized);
  }

  async updateExpenseStatus(
    user: SessionUser,
    expenseId: string,
    status: ExpenseStatus,
  ) {
    if (this.hasDatabaseConnection()) {
      try {
        const updated = await this.prismaService!.expense.update({
          where: { id: expenseId },
          data: { status },
        });

        await this.createAuditEventIfPossible({
          actorUserId: user.userId,
          actorGiId: user.giId,
          action: 'expense.status.update',
          status: 'success',
          target: expenseId,
          metadataJson: {
            newStatus: status,
          },
        });

        return {
          id: updated.id,
          status: updated.status,
          updatedAt: updated.updatedAt.toISOString(),
        };
      } catch {
        return this.updateMockExpenseStatus(user, expenseId, status);
      }
    }

    return this.updateMockExpenseStatus(user, expenseId, status);
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
      const decoded = this.parseSessionToken(sessionToken);

      if (!decoded) {
        return null;
      }

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

  async logout(sessionToken: string | undefined) {
    const decoded = this.parseSessionToken(sessionToken);

    if (!decoded) {
      return { loggedOut: false, reason: 'invalid_or_missing_session' };
    }

    if (decoded.sid && this.hasDatabaseConnection()) {
      try {
        await this.prismaService!.session.updateMany({
          where: {
            sessionTokenId: decoded.sid,
            revokedAt: null,
          },
          data: {
            revokedAt: new Date(),
          },
        });
      } catch {
        return { loggedOut: false, reason: 'revoke_failed' };
      }
    }

    await this.createAuditEventIfPossible({
      actorGiId: decoded.giId,
      action: 'auth.logout',
      status: 'success',
      metadataJson: {
        sid: decoded.sid,
      },
    });

    return { loggedOut: true };
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

  private filterMockExpensesByRole(user: SessionUser) {
    if (roleWeight[user.role] >= roleWeight.C3) {
      return this.mockExpenses;
    }

    return this.mockExpenses.filter((entry) => entry.actorGiId === user.giId);
  }

  private createMockExpense(
    user: SessionUser,
    payload: {
      category: string;
      amount: number;
      sevaId: string;
      attachmentUrl?: string;
    },
  ) {
    const now = new Date().toISOString();
    const entry: ExpenseRecord = {
      id: `EXP-${Math.floor(Math.random() * 100000)}`,
      sevaId: payload.sevaId,
      userId: user.userId,
      actorGiId: user.giId,
      category: payload.category,
      amount: payload.amount,
      status: ExpenseStatus.SUBMITTED,
      attachmentUrl: payload.attachmentUrl,
      createdAt: now,
      updatedAt: now,
    };
    this.mockExpenses.unshift(entry);
    return entry;
  }

  private updateMockExpenseStatus(
    user: SessionUser,
    expenseId: string,
    status: ExpenseStatus,
  ) {
    const index = this.mockExpenses.findIndex((item) => item.id === expenseId);
    if (index < 0) {
      throw new UnauthorizedException('Expense not found');
    }

    const updated = {
      ...this.mockExpenses[index],
      status,
      updatedAt: new Date().toISOString(),
    };

    this.mockExpenses[index] = updated;

    void this.createAuditEventIfPossible({
      actorUserId: user.userId,
      actorGiId: user.giId,
      action: 'expense.status.update',
      status: 'success',
      target: expenseId,
      metadataJson: {
        newStatus: status,
        source: 'mock',
      },
    });

    return {
      id: updated.id,
      status: updated.status,
      updatedAt: updated.updatedAt,
    };
  }

  private parseSessionToken(
    sessionToken: string | undefined,
  ): SessionPayload | null {
    if (!sessionToken) {
      return null;
    }

    try {
      return JSON.parse(
        Buffer.from(sessionToken, 'base64url').toString('utf-8'),
      ) as SessionPayload;
    } catch {
      return null;
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
