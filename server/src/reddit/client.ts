import { env, redditOauthEnabled } from '../env.js';
import type { RawRedditPost } from '../types.js';

const OAUTH_BASE = 'https://oauth.reddit.com';
const PUBLIC_BASE = 'https://www.reddit.com';

interface OAuthToken {
  accessToken: string;
  expiresAt: number;
}

let cachedToken: OAuthToken | null = null;

async function getOauthToken(): Promise<string | null> {
  if (!redditOauthEnabled) return null;
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.accessToken;
  }

  const auth = Buffer.from(
    `${env.REDDIT_CLIENT_ID}:${env.REDDIT_CLIENT_SECRET}`,
  ).toString('base64');

  const body = new URLSearchParams({
    grant_type: 'password',
    username: env.REDDIT_USERNAME,
    password: env.REDDIT_PASSWORD,
  });

  const res = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'User-Agent': env.REDDIT_USER_AGENT,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Reddit OAuth token request failed (${res.status}): ${text}`,
    );
  }

  const json = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };

  cachedToken = {
    accessToken: json.access_token,
    expiresAt: Date.now() + json.expires_in * 1000,
  };
  return cachedToken.accessToken;
}

async function redditFetch(pathWithQuery: string): Promise<unknown> {
  const token = await getOauthToken();
  const base = token ? OAUTH_BASE : PUBLIC_BASE;
  const url = token
    ? `${base}${pathWithQuery}`
    : `${base}${pathWithQuery}${pathWithQuery.includes('?') ? '&' : '?'}raw_json=1`;

  const headers: Record<string, string> = {
    'User-Agent': env.REDDIT_USER_AGENT,
    Accept: 'application/json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { headers });

  if (res.status === 429) {
    throw new Error('Reddit rate-limited the request (HTTP 429).');
  }
  if (res.status === 403) {
    throw new Error(
      'Reddit returned 403 (likely blocked unauthenticated request). Add Reddit OAuth credentials to .env.',
    );
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Reddit fetch ${url} failed (${res.status}): ${text}`);
  }
  return res.json();
}

interface ListingChild {
  kind: string;
  data: Record<string, unknown>;
}

interface Listing {
  kind: 'Listing';
  data: { children: ListingChild[] };
}

function pickPost(child: ListingChild): RawRedditPost | null {
  if (child.kind !== 't3') return null;
  const d = child.data;
  const id = String(d.id ?? '');
  if (!id) return null;
  return {
    id,
    subreddit: `r/${String(d.subreddit ?? '')}`,
    title: String(d.title ?? ''),
    selftext: String(d.selftext ?? ''),
    url: String(d.url ?? ''),
    permalink: `https://www.reddit.com${String(d.permalink ?? '')}`,
    author: `u/${String(d.author ?? 'unknown')}`,
    score: Number(d.score ?? 0),
    num_comments: Number(d.num_comments ?? 0),
    created_utc: Number(d.created_utc ?? Date.now() / 1000),
  };
}

export async function fetchSubredditPosts(
  subreddit: string,
  options: { limit?: number; sort?: 'new' | 'hot' | 'top'; t?: string } = {},
): Promise<RawRedditPost[]> {
  const { limit = env.INGEST_POSTS_PER_SUBREDDIT, sort = 'new', t } = options;
  const cleanName = subreddit.replace(/^r\//, '').replace(/^\/+|\/+$/g, '');
  const params = new URLSearchParams({ limit: String(limit) });
  if (sort === 'top' && t) params.set('t', t);

  const path = `/r/${cleanName}/${sort}.json?${params.toString()}`;
  const data = (await redditFetch(path)) as Listing;
  const children = data?.data?.children ?? [];
  return children.map(pickPost).filter((p): p is RawRedditPost => p !== null);
}

export interface SubredditAbout {
  name: string;
  members: number;
  description: string;
  publicDescription: string;
  rules: string[];
}

export async function fetchSubredditAbout(subreddit: string): Promise<SubredditAbout> {
  const cleanName = subreddit.replace(/^r\//, '').replace(/^\/+|\/+$/g, '');
  const [aboutRes, rulesRes] = await Promise.all([
    redditFetch(`/r/${cleanName}/about.json`) as Promise<{
      data: Record<string, unknown>;
    }>,
    redditFetch(`/r/${cleanName}/about/rules.json`) as Promise<{
      rules?: { short_name: string; description?: string }[];
    }>,
  ]);

  const data = aboutRes.data ?? {};
  const rules = (rulesRes.rules ?? []).map((r) =>
    r.description ? `${r.short_name}: ${r.description}` : r.short_name,
  );

  return {
    name: `r/${cleanName}`,
    members: Number(data.subscribers ?? 0),
    description: String(data.description ?? data.public_description ?? ''),
    publicDescription: String(data.public_description ?? ''),
    rules,
  };
}

export async function searchSubreddits(query: string, limit = 10): Promise<
  { name: string; members: number; description: string }[]
> {
  const params = new URLSearchParams({
    q: query,
    limit: String(limit),
    type: 'sr',
    include_over_18: 'off',
  });
  const data = (await redditFetch(
    `/subreddits/search.json?${params.toString()}`,
  )) as Listing;
  const children = data?.data?.children ?? [];
  return children
    .filter((c) => c.kind === 't5')
    .map((c) => {
      const d = c.data;
      return {
        name: `r/${String(d.display_name ?? '')}`,
        members: Number(d.subscribers ?? 0),
        description: String(d.public_description ?? ''),
      };
    })
    .filter((s) => s.name !== 'r/');
}
