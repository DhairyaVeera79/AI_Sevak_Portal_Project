export type SevaMode = 'open' | 'approval';

export interface Seva {
  id: string;
  title: string;
  mode: SevaMode;
  skillTags: string[];
  hoursPerWeek: number;
  seatsLeft: number;
  aiMatchScore: number;
}

export interface DashboardMetrics {
  activeSevas: number;
  activeVolunteers: number;
  pendingApprovals: number;
  onboardingCompletion: string;
  weeklyLogsSubmitted: number;
  storiesReadyForReview: number;
}

export interface ImpactStory {
  id: string;
  sevaId: string;
  title: string;
  stage: 'reviewed' | 'moderation' | 'draft';
  summary: string;
}

export interface HealthPayload {
  status: 'ok';
  service: string;
  timestamp: string;
  dataSourceMode: string;
}

export interface PortalDataSource {
  getSevas(): Seva[];
  getDashboardMetrics(): DashboardMetrics;
  getImpactStories(): ImpactStory[];
}

export const PORTAL_DATA_SOURCE = Symbol('PORTAL_DATA_SOURCE');
