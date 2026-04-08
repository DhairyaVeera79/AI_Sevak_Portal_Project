import { Injectable } from '@nestjs/common';
import {
  DashboardMetrics,
  ImpactStory,
  PortalDataSource,
  Seva,
} from './portal-data-source';

@Injectable()
export class MockPortalDataSourceService implements PortalDataSource {
  getSevas(): Seva[] {
    return [
      {
        id: 'SEVA-101',
        title: 'Education Support - Dharampur Batch',
        mode: 'open',
        skillTags: ['teaching', 'content', 'coordination'],
        hoursPerWeek: 4,
        seatsLeft: 8,
        aiMatchScore: 91,
      },
      {
        id: 'SEVA-102',
        title: 'Humanitarian Care Logistics',
        mode: 'approval',
        skillTags: ['operations', 'vendor-coordination'],
        hoursPerWeek: 6,
        seatsLeft: 3,
        aiMatchScore: 84,
      },
      {
        id: 'SEVA-103',
        title: 'Community Welfare Data & Reporting',
        mode: 'approval',
        skillTags: ['analysis', 'excel', 'documentation'],
        hoursPerWeek: 5,
        seatsLeft: 6,
        aiMatchScore: 88,
      },
    ];
  }

  getDashboardMetrics(): DashboardMetrics {
    return {
      activeSevas: 12,
      activeVolunteers: 186,
      pendingApprovals: 14,
      onboardingCompletion: '82%',
      weeklyLogsSubmitted: 94,
      storiesReadyForReview: 11,
    };
  }

  getImpactStories(): ImpactStory[] {
    return [
      {
        id: 'STORY-1',
        sevaId: 'SEVA-101',
        title: 'Learning Continuity Restored for 120 Students',
        stage: 'reviewed',
        summary:
          'Volunteer-led evening sessions and learning kits supported continuity for students with high absentee risk.',
      },
      {
        id: 'STORY-2',
        sevaId: 'SEVA-102',
        title: 'Relief Distribution Streamlined Across 3 Locations',
        stage: 'moderation',
        summary:
          'Daily logs and route tracking improved handoff clarity, reducing missed deliveries and duplicate effort.',
      },
      {
        id: 'STORY-3',
        sevaId: 'SEVA-103',
        title: 'Volunteer Reporting Improved Data Completeness',
        stage: 'draft',
        summary:
          'Standardized log templates improved weekly reporting consistency and reduced missing update gaps.',
      },
    ];
  }
}
