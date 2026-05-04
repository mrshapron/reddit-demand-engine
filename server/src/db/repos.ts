import crypto from 'node:crypto';
import { db } from './client.js';
import {
  EMPTY_PROFILE,
  type CompanyProfile,
  type GeneratedPostDraft,
  type RawRedditPost,
  type RedditOpportunity,
  type SubredditInsight,
} from '../types.js';

// ─── Company profile ───────────────────────────────────────────────

export function getCompanyProfile(): CompanyProfile {
  const row = db
    .prepare('SELECT data FROM company_profile WHERE id = 1')
    .get() as { data: string } | undefined;
  if (!row) return EMPTY_PROFILE;
  return { ...EMPTY_PROFILE, ...(JSON.parse(row.data) as Partial<CompanyProfile>) };
}

export function saveCompanyProfile(profile: CompanyProfile) {
  const data = JSON.stringify(profile);
  db.prepare(
    `INSERT INTO company_profile (id, data, updated_at)
     VALUES (1, ?, datetime('now'))
     ON CONFLICT(id) DO UPDATE SET data=excluded.data, updated_at=datetime('now')`,
  ).run(data);
}

export function profileHash(profile: CompanyProfile): string {
  return crypto
    .createHash('sha1')
    .update(JSON.stringify(profile))
    .digest('hex')
    .slice(0, 12);
}

// ─── Subreddits ────────────────────────────────────────────────────

export function listSubredditNames(): string[] {
  const rows = db
    .prepare(
      'SELECT name FROM subreddits WHERE enabled = 1 ORDER BY created_at ASC',
    )
    .all() as { name: string }[];
  return rows.map((r) => r.name);
}

export function upsertSubreddit(name: string, members: number, description: string) {
  db.prepare(
    `INSERT INTO subreddits (name, members, description)
     VALUES (?, ?, ?)
     ON CONFLICT(name) DO UPDATE SET members=excluded.members, description=excluded.description`,
  ).run(name, members, description);
}

export function setSubredditEnabled(name: string, enabled: boolean) {
  db.prepare('UPDATE subreddits SET enabled = ? WHERE name = ?').run(
    enabled ? 1 : 0,
    name,
  );
}

export function deleteSubreddit(name: string) {
  db.prepare('DELETE FROM subreddits WHERE name = ?').run(name);
}

export function saveSubredditInsight(insight: SubredditInsight) {
  db.prepare(
    `INSERT INTO subreddits (name, members, description, insight_json, insight_generated_at)
     VALUES (?, ?, ?, ?, datetime('now'))
     ON CONFLICT(name) DO UPDATE SET
       members=excluded.members,
       description=excluded.description,
       insight_json=excluded.insight_json,
       insight_generated_at=datetime('now')`,
  ).run(
    insight.name,
    insight.members,
    insight.description,
    JSON.stringify(insight),
  );
}

export function listSubredditInsights(): SubredditInsight[] {
  const rows = db
    .prepare(
      `SELECT insight_json FROM subreddits
       WHERE insight_json IS NOT NULL AND enabled = 1
       ORDER BY datetime(insight_generated_at) DESC`,
    )
    .all() as { insight_json: string }[];
  return rows.map((r) => JSON.parse(r.insight_json) as SubredditInsight);
}

// ─── Reddit posts ──────────────────────────────────────────────────

export function upsertRedditPost(post: RawRedditPost) {
  db.prepare(
    `INSERT INTO reddit_posts
       (id, subreddit, title, snippet, body, url, author, upvotes, num_comments, posted_at, raw_json)
     VALUES (@id, @subreddit, @title, @snippet, @body, @url, @author, @upvotes, @num_comments, @posted_at, @raw_json)
     ON CONFLICT(id) DO UPDATE SET
       upvotes=excluded.upvotes,
       num_comments=excluded.num_comments`,
  ).run({
    id: post.id,
    subreddit: post.subreddit,
    title: post.title,
    snippet: post.selftext.slice(0, 600),
    body: post.selftext,
    url: post.permalink,
    author: post.author,
    upvotes: post.score,
    num_comments: post.num_comments,
    posted_at: new Date(post.created_utc * 1000).toISOString(),
    raw_json: JSON.stringify(post),
  });
}

export function postExists(id: string): boolean {
  const row = db
    .prepare('SELECT 1 FROM reddit_posts WHERE id = ?')
    .get(id) as Record<string, unknown> | undefined;
  return Boolean(row);
}

export function postHasOpportunity(id: string): boolean {
  const row = db
    .prepare('SELECT 1 FROM opportunities WHERE post_id = ?')
    .get(id) as Record<string, unknown> | undefined;
  return Boolean(row);
}

export function listUnanalyzedPosts(subreddit: string, limit = 100): RawRedditPost[] {
  const rows = db
    .prepare(
      `SELECT raw_json FROM reddit_posts p
        WHERE p.subreddit = ?
          AND NOT EXISTS (SELECT 1 FROM opportunities o WHERE o.post_id = p.id)
        ORDER BY datetime(p.posted_at) DESC
        LIMIT ?`,
    )
    .all(subreddit, limit) as { raw_json: string }[];
  return rows.map((r) => JSON.parse(r.raw_json) as RawRedditPost);
}

// ─── Opportunities ─────────────────────────────────────────────────

export function saveOpportunity(
  op: RedditOpportunity,
  postId: string,
  hash: string,
) {
  db.prepare(
    `INSERT INTO opportunities
       (id, post_id, subreddit, data, lead_potential, spam_risk, status, company_profile_hash)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(post_id) DO UPDATE SET
       data=excluded.data,
       lead_potential=excluded.lead_potential,
       spam_risk=excluded.spam_risk,
       company_profile_hash=excluded.company_profile_hash`,
  ).run(
    op.id,
    postId,
    op.subreddit,
    JSON.stringify(op),
    op.leadPotential,
    op.spamRisk,
    op.status ?? 'pending',
    hash,
  );
}

export function listOpportunities(limit = 50): RedditOpportunity[] {
  const rows = db
    .prepare(
      `SELECT data FROM opportunities
       ORDER BY lead_potential DESC, datetime(created_at) DESC
       LIMIT ?`,
    )
    .all(limit) as { data: string }[];
  return rows.map((r) => JSON.parse(r.data) as RedditOpportunity);
}

export function setOpportunityStatus(
  id: string,
  status: NonNullable<RedditOpportunity['status']>,
) {
  const row = db
    .prepare('SELECT data FROM opportunities WHERE id = ?')
    .get(id) as { data: string } | undefined;
  if (!row) return null;
  const op = JSON.parse(row.data) as RedditOpportunity;
  op.status = status;
  db.prepare(
    'UPDATE opportunities SET data = ?, status = ? WHERE id = ?',
  ).run(JSON.stringify(op), status, id);
  return op;
}

// ─── Drafts ────────────────────────────────────────────────────────

export function saveDraft(draft: GeneratedPostDraft, hash: string) {
  db.prepare(
    `INSERT INTO generated_drafts (id, subreddit, data, company_profile_hash, approved)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(
    draft.id,
    draft.subreddit,
    JSON.stringify(draft),
    hash,
    draft.approved ? 1 : 0,
  );
}

export function listDrafts(limit = 20): GeneratedPostDraft[] {
  const rows = db
    .prepare(
      `SELECT data FROM generated_drafts ORDER BY datetime(created_at) DESC LIMIT ?`,
    )
    .all(limit) as { data: string }[];
  return rows.map((r) => JSON.parse(r.data) as GeneratedPostDraft);
}

export function setDraftApproved(id: string, approved: boolean) {
  const row = db
    .prepare('SELECT data FROM generated_drafts WHERE id = ?')
    .get(id) as { data: string } | undefined;
  if (!row) return null;
  const draft = JSON.parse(row.data) as GeneratedPostDraft;
  draft.approved = approved;
  db.prepare(
    'UPDATE generated_drafts SET data = ?, approved = ? WHERE id = ?',
  ).run(JSON.stringify(draft), approved ? 1 : 0, id);
  return draft;
}

// ─── Ingest runs ───────────────────────────────────────────────────

export function startIngestRun(): number {
  const result = db
    .prepare('INSERT INTO ingest_runs DEFAULT VALUES')
    .run();
  return Number(result.lastInsertRowid);
}

export function finishIngestRun(
  id: number,
  stats: {
    subredditsScraped: number;
    postsFetched: number;
    opportunitiesCreated: number;
    llmCalls: number;
    error?: string;
  },
) {
  db.prepare(
    `UPDATE ingest_runs
       SET finished_at = datetime('now'),
           subreddits_scraped = ?,
           posts_fetched = ?,
           opportunities_created = ?,
           llm_calls = ?,
           error = ?
     WHERE id = ?`,
  ).run(
    stats.subredditsScraped,
    stats.postsFetched,
    stats.opportunitiesCreated,
    stats.llmCalls,
    stats.error ?? null,
    id,
  );
}

export function getLatestIngestRun() {
  return db
    .prepare(
      'SELECT * FROM ingest_runs ORDER BY datetime(started_at) DESC LIMIT 1',
    )
    .get() as
    | {
        id: number;
        started_at: string;
        finished_at: string | null;
        subreddits_scraped: number;
        posts_fetched: number;
        opportunities_created: number;
        llm_calls: number;
        error: string | null;
      }
    | undefined;
}
