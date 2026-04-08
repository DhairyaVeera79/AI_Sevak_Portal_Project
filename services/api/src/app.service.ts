import { Inject, Injectable } from '@nestjs/common';
import { HealthPayload, PORTAL_DATA_SOURCE } from './data/portal-data-source';
import type { PortalDataSource } from './data/portal-data-source';

type UserRole = 'C1' | 'C2' | 'C3' | 'C4' | 'ADMIN';

interface SessionPayload {
  giId: string;
  role: UserRole;
  iat: number;
}

@Injectable()
export class AppService {
  constructor(
    @Inject(PORTAL_DATA_SOURCE)
    private readonly dataSource: PortalDataSource,
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

  login(giId: string, password: string) {
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

    return {
      giId: normalizedGiId,
      role,
      sessionToken,
      expiresInSeconds: 60 * 60 * 24,
      authMode: 'mock-v1',
      accepted: password.trim().length >= 4,
    };
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
