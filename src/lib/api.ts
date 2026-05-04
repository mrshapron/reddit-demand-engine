import type { CompanyProfile } from '@/types/company';
import type {
  GeneratedPostDraft,
  RedditOpportunity,
  SubredditInsight,
} from '@/types/reddit';
import type { StrategySnapshot } from '@/types/strategy';

const BASE = '/api';

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    let detail = '';
    try {
      const body = await res.json();
      detail = body?.error ? JSON.stringify(body.error) : '';
    } catch {
      /* ignore */
    }
    throw new Error(`HTTP ${res.status} ${res.statusText}${detail ? ` — ${detail}` : ''}`);
  }
  return res.json() as Promise<T>;
}

export interface HealthResponse {
  ok: boolean;
  redditOauth: boolean;
  models: { fast: string; smart: string };
}

export interface IngestSummary {
  runId: number;
  subredditsScraped: number;
  postsFetched: number;
  newPosts: number;
  opportunitiesCreated: number;
  llmCalls: number;
  errors: { subreddit?: string; postId?: string; message: string }[];
  durationMs: number;
}

export interface IngestStatus {
  running: boolean;
  latest: {
    id: number;
    started_at: string;
    finished_at: string | null;
    subreddits_scraped: number;
    posts_fetched: number;
    opportunities_created: number;
    llm_calls: number;
    error: string | null;
  } | null;
}

export const api = {
  health: () => http<HealthResponse>('/health'),

  getCompany: () => http<CompanyProfile>('/company'),
  saveCompany: (profile: Partial<CompanyProfile>) =>
    http<CompanyProfile>('/company', {
      method: 'PUT',
      body: JSON.stringify(profile),
    }),

  listSubreddits: () => http<SubredditInsight[]>('/subreddits'),
  listConfiguredSubreddits: () => http<string[]>('/subreddits/configured'),
  searchSubreddits: (q: string, limit = 10) =>
    http<{ name: string; members: number; description: string }[]>(
      `/subreddits/search?q=${encodeURIComponent(q)}&limit=${limit}`,
    ),
  addSubreddit: (name: string) =>
    http<{ ok: boolean; name: string; members: number }>('/subreddits', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),
  setSubredditEnabled: (name: string, enabled: boolean) =>
    http<{ ok: boolean }>(`/subreddits/${encodeURIComponent(name)}`, {
      method: 'PATCH',
      body: JSON.stringify({ enabled }),
    }),
  removeSubreddit: (name: string) =>
    http<{ ok: boolean }>(`/subreddits/${encodeURIComponent(name)}`, {
      method: 'DELETE',
    }),

  listOpportunities: (limit = 50) =>
    http<RedditOpportunity[]>(`/opportunities?limit=${limit}`),
  setOpportunityStatus: (
    id: string,
    status: 'pending' | 'applied' | 'skipped' | 'saved',
  ) =>
    http<RedditOpportunity>(`/opportunities/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  regenerateReply: (id: string) =>
    http<{ triage: unknown; reply: { suggestedReply: string; replyStrategy: string } }>(
      `/opportunities/${id}/regenerate`,
      { method: 'POST' },
    ),

  listDrafts: () => http<GeneratedPostDraft[]>('/drafts'),
  generateDraft: (subreddit: string, postType?: GeneratedPostDraft['postType']) =>
    http<GeneratedPostDraft>('/drafts', {
      method: 'POST',
      body: JSON.stringify({ subreddit, postType }),
    }),
  setDraftApproved: (id: string, approved: boolean) =>
    http<GeneratedPostDraft>(`/drafts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ approved }),
    }),

  getStrategy: (refresh = false) =>
    http<StrategySnapshot>(`/strategy${refresh ? '?refresh=1' : ''}`),

  startIngest: (body?: { subreddits?: string[]; postsPerSubreddit?: number }) =>
    http<{ ok: boolean; message: string }>('/ingest', {
      method: 'POST',
      body: JSON.stringify(body ?? {}),
    }),
  ingestSync: (body?: { subreddits?: string[]; postsPerSubreddit?: number }) =>
    http<IngestSummary>('/ingest/sync', {
      method: 'POST',
      body: JSON.stringify(body ?? {}),
    }),
  ingestStatus: () => http<IngestStatus>('/ingest/status'),
};
