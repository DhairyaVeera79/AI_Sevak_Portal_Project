import 'server-only';

import { cookies } from 'next/headers';

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

export type LogItem = {
  id: string;
  sevaId: string;
  actorGiId: string;
  title: string;
  summary: string;
  stage: 'draft' | 'moderation' | 'reviewed';
  createdAt: string;
  updatedAt: string;
};

export type ExpenseItem = {
  id: string;
  sevaId: string;
  category: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3002';

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('ai_sevak_session')?.value;

    const response = await fetch(`${API_BASE_URL}${path}`, {
      cache: 'no-store',
      headers: sessionToken
        ? {
            'x-session-token': sessionToken,
          }
        : undefined,
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

async function mutateJson<T>(
  path: string,
  method: 'PATCH' | 'POST',
  body?: object,
): Promise<T | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('ai_sevak_session')?.value;

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      cache: 'no-store',
      headers: {
        'content-type': 'application/json',
        ...(sessionToken
          ? {
              'x-session-token': sessionToken,
            }
          : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
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

export async function getLogs(stage?: LogItem['stage']): Promise<LogItem[]> {
  const fallback: LogItem[] = [
    {
      id: 'LOG-101',
      sevaId: 'SEVA-101',
      actorGiId: 'C4-DEMO',
      title: 'Learning Kit Distribution Completed',
      summary:
        'Volunteers completed doorstep distribution and captured attendance evidence for 75 students.',
      stage: 'moderation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'LOG-102',
      sevaId: 'SEVA-102',
      actorGiId: 'C3-DEMO',
      title: 'Healthcare Camp Follow-up',
      summary:
        'Post-camp medicine follow-up calls completed with documented beneficiary response summaries.',
      stage: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const query = stage ? `?stage=${stage}` : '';
  return (await fetchJson<LogItem[]>(`/v1/logs${query}`)) ?? fallback;
}

export async function updateLogStage(
  id: string,
  stage: LogItem['stage'],
): Promise<boolean> {
  const result = await mutateJson<{ id: string }>(`/v1/logs/${id}/stage`, 'PATCH', {
    stage,
  });
  return Boolean(result?.id);
}

export async function getExpenses(): Promise<ExpenseItem[]> {
  const fallback: ExpenseItem[] = [
    {
      id: 'EXP-101',
      sevaId: 'SEVA-101',
      category: 'Teaching supplies',
      amount: 3450,
      status: 'REVIEWED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'EXP-102',
      sevaId: 'SEVA-102',
      category: 'Travel reimbursement',
      amount: 1200,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  return (await fetchJson<ExpenseItem[]>('/v1/expenses')) ?? fallback;
}
