import type { CompanyProfile } from '@/types/company';
import { mockCompanyProfile } from '@/data/mockCompanyProfile';
import { mockGeneratedPosts } from '@/data/mockGeneratedPosts';
import { mockRedditOpportunities } from '@/data/mockRedditPosts';
import { mockStrategy } from '@/data/mockStrategy';
import { mockSubreddits } from '@/data/mockSubreddits';
import type {
  GeneratedPostDraft,
  RedditOpportunity,
  SubredditInsight,
} from '@/types/reddit';
import type { StrategySnapshot } from '@/types/strategy';

const BASE = '/api';
const IS_STATIC_DEMO = import.meta.env.BASE_URL !== '/';
const PROFILE_STORAGE_KEY = 'rde:companyProfile:v2';
const CONFIGURED_SUBREDDITS_KEY = 'rde:configuredSubreddits:v1';

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* noop */
  }
}

function staticDelay<T>(value: T): Promise<T> {
  return Promise.resolve(value);
}

const staticApi = {
  health: () =>
    staticDelay<HealthResponse>({
      ok: true,
      redditOauth: false,
      models: { fast: 'static-demo', smart: 'static-demo' },
    }),

  getCompany: () =>
    staticDelay<CompanyProfile>(readJson(PROFILE_STORAGE_KEY, mockCompanyProfile)),
  saveCompany: (profile: Partial<CompanyProfile>) => {
    const next = { ...readJson(PROFILE_STORAGE_KEY, mockCompanyProfile), ...profile };
    writeJson(PROFILE_STORAGE_KEY, next);
    return staticDelay<CompanyProfile>(next);
  },

  listSubreddits: () => staticDelay<SubredditInsight[]>(mockSubreddits),
  listConfiguredSubreddits: () =>
    staticDelay<string[]>(
      readJson(
        CONFIGURED_SUBREDDITS_KEY,
        mockSubreddits.slice(0, 3).map((subreddit) => subreddit.name),
      ),
    ),
  searchSubreddits: (q: string, limit = 10) => {
    const normalized = q.trim().replace(/^r\//i, '').toLowerCase();
    const matches = mockSubreddits
      .filter((subreddit) => subreddit.name.toLowerCase().includes(normalized))
      .slice(0, limit)
      .map((subreddit) => ({
        name: subreddit.name,
        members: subreddit.members,
        description: subreddit.description,
      }));
    return staticDelay(matches);
  },
  addSubreddit: (name: string) => {
    const current = readJson<string[]>(CONFIGURED_SUBREDDITS_KEY, []);
    const next = current.includes(name) ? current : [...current, name];
    writeJson(CONFIGURED_SUBREDDITS_KEY, next);
    const match = mockSubreddits.find((subreddit) => subreddit.name === name);
    return staticDelay({ ok: true, name, members: match?.members ?? 0 });
  },
  setSubredditEnabled: (_name: string, _enabled: boolean) => staticDelay({ ok: true }),
  removeSubreddit: (name: string) => {
    const current = readJson<string[]>(CONFIGURED_SUBREDDITS_KEY, []);
    writeJson(
      CONFIGURED_SUBREDDITS_KEY,
      current.filter((item) => item !== name),
    );
    return staticDelay({ ok: true });
  },

  listOpportunities: (limit = 50) =>
    staticDelay<RedditOpportunity[]>(mockRedditOpportunities.slice(0, limit)),
  setOpportunityStatus: (
    id: string,
    status: 'pending' | 'applied' | 'skipped' | 'saved',
  ) => {
    const opportunity = mockRedditOpportunities.find((item) => item.id === id) ?? mockRedditOpportunities[0]!;
    return staticDelay<RedditOpportunity>({ ...opportunity, status });
  },
  regenerateReply: (_id: string) =>
    staticDelay({
      triage: {},
      reply: {
        suggestedReply: 'Static demo reply regenerated locally. Connect the backend for live LLM generation.',
        replyStrategy: 'Keep the response helpful, specific, and non-promotional.',
      },
    }),

  listDrafts: () => staticDelay<GeneratedPostDraft[]>(mockGeneratedPosts),
  generateDraft: (subreddit: string, postType?: GeneratedPostDraft['postType']) => {
    const base =
      mockGeneratedPosts.find((draft) => draft.postType === postType) ?? mockGeneratedPosts[0]!;
    return staticDelay<GeneratedPostDraft>({
      ...base,
      id: `static-${Date.now()}`,
      subreddit,
      postType: postType ?? base.postType,
    });
  },
  setDraftApproved: (id: string, approved: boolean) => {
    const draft = mockGeneratedPosts.find((item) => item.id === id) ?? mockGeneratedPosts[0]!;
    return staticDelay<GeneratedPostDraft>({ ...draft, approved });
  },

  getStrategy: (_refresh = false) => staticDelay<StrategySnapshot>(mockStrategy),
  startIngest: (_body?: { subreddits?: string[]; postsPerSubreddit?: number }) =>
    staticDelay({ ok: true, message: 'Static demo mode: ingest is simulated.' }),
  ingestSync: (_body?: { subreddits?: string[]; postsPerSubreddit?: number }) =>
    staticDelay<IngestSummary>({
      runId: Date.now(),
      subredditsScraped: mockSubreddits.length,
      postsFetched: mockRedditOpportunities.length,
      newPosts: mockRedditOpportunities.length,
      opportunitiesCreated: mockRedditOpportunities.length,
      llmCalls: 0,
      errors: [],
      durationMs: 0,
    }),
  ingestStatus: () => staticDelay<IngestStatus>({ running: false, latest: null }),
};

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

export const api = IS_STATIC_DEMO ? staticApi : {
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
