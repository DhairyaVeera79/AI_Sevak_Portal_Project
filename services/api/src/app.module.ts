import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MockPortalDataSourceService } from './data/mock-portal-data-source.service';
import { OrgPortalDataSourceService } from './data/org-portal-data-source.service';
import { PORTAL_DATA_SOURCE } from './data/portal-data-source';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AppController],
  providers: [
    AppService,
    MockPortalDataSourceService,
    OrgPortalDataSourceService,
    {
      provide: PORTAL_DATA_SOURCE,
      useFactory: (
        mockDataSource: MockPortalDataSourceService,
        orgDataSource: OrgPortalDataSourceService,
      ) => {
        const mode = (process.env.DATA_SOURCE_MODE ?? 'mock').toLowerCase();
        if (mode === 'org') {
          return orgDataSource;
        }
        return mockDataSource;
      },
      inject: [MockPortalDataSourceService, OrgPortalDataSourceService],
    },
  ],
})
export class AppModule {}
