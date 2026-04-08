import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PORTAL_DATA_SOURCE } from './data/portal-data-source';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: PORTAL_DATA_SOURCE,
          useValue: {
            getSevas: jest.fn().mockReturnValue([]),
            getDashboardMetrics: jest.fn().mockReturnValue({
              activeSevas: 0,
              activeVolunteers: 0,
              pendingApprovals: 0,
              onboardingCompletion: '0%',
              weeklyLogsSubmitted: 0,
              storiesReadyForReview: 0,
            }),
            getImpactStories: jest.fn().mockReturnValue([]),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should return status ok', () => {
      const health = appController.getHealth();
      expect(health.status).toBe('ok');
    });
  });
});
