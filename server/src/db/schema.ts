import { db } from './client.js';

const CURRENT_VERSION = 1;

const STATEMENTS = [
  // v1: initial schema
  `CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER PRIMARY KEY,
    applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,

  `CREATE TABLE IF NOT EXISTS company_profile (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    data TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,

  `CREATE TABLE IF NOT EXISTS subreddits (
    name TEXT PRIMARY KEY,
    members INTEGER,
    description TEXT,
    insight_json TEXT,
    insight_generated_at TEXT,
    enabled INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,

  `CREATE TABLE IF NOT EXISTS reddit_posts (
    id TEXT PRIMARY KEY,
    subreddit TEXT NOT NULL,
    title TEXT NOT NULL,
    snippet TEXT,
    body TEXT,
    url TEXT NOT NULL,
    author TEXT NOT NULL,
    upvotes INTEGER NOT NULL DEFAULT 0,
    num_comments INTEGER NOT NULL DEFAULT 0,
    posted_at TEXT NOT NULL,
    raw_json TEXT NOT NULL,
    fetched_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,

  `CREATE INDEX IF NOT EXISTS idx_reddit_posts_subreddit
    ON reddit_posts(subreddit);`,

  `CREATE INDEX IF NOT EXISTS idx_reddit_posts_posted_at
    ON reddit_posts(posted_at DESC);`,

  `CREATE TABLE IF NOT EXISTS opportunities (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL UNIQUE,
    subreddit TEXT NOT NULL,
    data TEXT NOT NULL,
    lead_potential INTEGER NOT NULL DEFAULT 0,
    spam_risk INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending',
    company_profile_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES reddit_posts(id) ON DELETE CASCADE
  );`,

  `CREATE INDEX IF NOT EXISTS idx_opportunities_lead_potential
    ON opportunities(lead_potential DESC);`,

  `CREATE TABLE IF NOT EXISTS generated_drafts (
    id TEXT PRIMARY KEY,
    subreddit TEXT NOT NULL,
    data TEXT NOT NULL,
    company_profile_hash TEXT NOT NULL,
    approved INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,

  `CREATE TABLE IF NOT EXISTS ingest_runs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    finished_at TEXT,
    subreddits_scraped INTEGER NOT NULL DEFAULT 0,
    posts_fetched INTEGER NOT NULL DEFAULT 0,
    opportunities_created INTEGER NOT NULL DEFAULT 0,
    llm_calls INTEGER NOT NULL DEFAULT 0,
    error TEXT
  );`,
];

export function migrate() {
  db.exec('BEGIN');
  try {
    for (const stmt of STATEMENTS) {
      db.exec(stmt);
    }
    const row = db
      .prepare('SELECT MAX(version) as v FROM schema_version')
      .get() as { v: number | null };
    if ((row.v ?? 0) < CURRENT_VERSION) {
      db.prepare('INSERT INTO schema_version (version) VALUES (?)').run(
        CURRENT_VERSION,
      );
    }
    db.exec('COMMIT');
    console.log(`[db] migrated to v${CURRENT_VERSION} at ${db.name}`);
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}
