import { Injectable, Logger } from '@nestjs/common';
import {
  DashboardMetrics,
  ImpactStory,
  PortalDataSource,
  Seva,
} from './portal-data-source';

@Injectable()
export class OrgPortalDataSourceService implements PortalDataSource {
  private readonly logger = new Logger(OrgPortalDataSourceService.name);

  private raiseNotConfiguredError(methodName: string): never {
    this.logger.error(
      `ORG datasource called for ${methodName} but credentials/integration are not configured.`,
    );
    throw new Error(
      'ORG datasource is not configured yet. Set credentials and provider integration before enabling DATA_SOURCE_MODE=org.',
    );
  }

  getSevas(): Seva[] {
    this.raiseNotConfiguredError('getSevas');
  }

  getDashboardMetrics(): DashboardMetrics {
    this.raiseNotConfiguredError('getDashboardMetrics');
  }

  getImpactStories(): ImpactStory[] {
    this.raiseNotConfiguredError('getImpactStories');
  }
}
