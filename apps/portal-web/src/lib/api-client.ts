export type Seva = {
  id: string;
  title: string;
  mode: 'open' | 'approval';
  skillTags: string[];
  hoursPerWeek: number;
  seatsLeft: number;
  aiMatchScore: number;
};

export type DashboardMetrics = {
  activeSevas: number;
  activeVolunteers: number;
  pendingApprovals: number;
  onboardingCompletion: string;
  weeklyLogsSubmitted: number;
  storiesReadyForReview: number;
};

export type ImpactStory = {
  id: string;
  sevaId: string;
  title: string;
  stage: 'reviewed' | 'moderation' | 'draft';
  summary: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3002';

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      return null;
    }
    const payload = (await response.json()) as T;
    return payload;
  } catch {
    return null;
  }
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const fallback: DashboardMetrics = {
    activeSevas: 12,
    activeVolunteers: 186,
    pendingApprovals: 14,
    onboardingCompletion: '82%',
    weeklyLogsSubmitted: 94,
    storiesReadyForReview: 11,
  };
  return (await fetchJson<DashboardMetrics>('/v1/dashboard-metrics')) ?? fallback;
}

export async function getSevas(): Promise<Seva[]> {
  const fallback: Seva[] = [
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
  ];
  return (await fetchJson<Seva[]>('/v1/sevas')) ?? fallback;
}

export async function getImpactStories(): Promise<ImpactStory[]> {
  const fallback: ImpactStory[] = [
    {
      id: 'STORY-1',
      sevaId: 'SEVA-101',
      title: 'Learning Continuity Restored for 120 Students',
      stage: 'reviewed',
      summary:
        'Volunteer-led evening sessions and learning kits supported continuity for students with high absentee risk.',
    },
  ];
  return (await fetchJson<ImpactStory[]>('/v1/impact-stories')) ?? fallback;
}
