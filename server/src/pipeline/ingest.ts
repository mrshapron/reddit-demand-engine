import {
  fetchSubredditAbout,
  fetchSubredditPosts,
} from '../reddit/client.js';
import {
  finishIngestRun,
  getCompanyProfile,
  listSubredditNames,
  listUnanalyzedPosts,
  postExists,
  postHasOpportunity,
  profileHash,
  saveOpportunity,
  saveSubredditInsight,
  startIngestRun,
  upsertRedditPost,
} from '../db/repos.js';
import {
  buildOpportunity,
  generateReply,
  triagePost,
} from '../llm/opportunity.js';
import { generateSubredditInsight } from '../llm/subredditInsight.js';
import { FatalLlmError, resetCallCount, getCallCount } from '../llm/client.js';
import { env } from '../env.js';
import type { CompanyProfile } from '../types.js';

interface IngestOptions {
  subreddits?: string[];
  postsPerSubreddit?: number;
  maxLlmCalls?: number;
  refreshInsights?: boolean;
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

export async function runIngest(options: IngestOptions = {}): Promise<IngestSummary> {
  const started = Date.now();
  const runId = startIngestRun();
  resetCallCount();

  const subreddits = options.subreddits?.length
    ? options.subreddits
    : listSubredditNames();
  const profile = getCompanyProfile();
  const hash = profileHash(profile);
  const maxLlm = options.maxLlmCalls ?? env.INGEST_MAX_LLM_CALLS;
  const perSub = options.postsPerSubreddit ?? env.INGEST_POSTS_PER_SUBREDDIT;

  const summary: IngestSummary = {
    runId,
    subredditsScraped: 0,
    postsFetched: 0,
    newPosts: 0,
    opportunitiesCreated: 0,
    llmCalls: 0,
    errors: [],
    durationMs: 0,
  };

  if (!subreddits.length) {
    summary.errors.push({
      message:
        'No subreddits configured. Add some via POST /api/subreddits or the Listen page.',
    });
    finalize(runId, summary, started);
    return summary;
  }

  if (!profile.companyName) {
    summary.errors.push({
      message:
        'Company profile is empty. Save it via the Company Profile page first.',
    });
    finalize(runId, summary, started);
    return summary;
  }

  let fatalAbort: FatalLlmError | null = null;

  outer: for (const sub of subreddits) {
    if (fatalAbort) break;
    if (getCallCount() >= maxLlm) break;

    // 1. Scrape (best-effort). On failure we still try to analyze the backlog.
    let about: Awaited<ReturnType<typeof fetchSubredditAbout>> | null = null;
    let posts: Awaited<ReturnType<typeof fetchSubredditPosts>> = [];
    try {
      [about, posts] = await Promise.all([
        fetchSubredditAbout(sub),
        fetchSubredditPosts(sub, { limit: perSub, sort: 'new' }),
      ]);
      summary.subredditsScraped += 1;
      summary.postsFetched += posts.length;

      for (const p of posts) {
        const isNew = !postExists(p.id);
        upsertRedditPost(p);
        if (isNew) summary.newPosts += 1;
      }
    } catch (err) {
      summary.errors.push({
        subreddit: sub,
        message: `scrape: ${(err as Error).message}`,
      });
    }

    // 2. Subreddit insight — only if we got fresh data this run.
    if (about && (options.refreshInsights ?? true) && getCallCount() < maxLlm) {
      try {
        const insight = await generateSubredditInsight(about, posts, profile);
        saveSubredditInsight(insight);
      } catch (err) {
        if (err instanceof FatalLlmError) {
          fatalAbort = err;
          break outer;
        }
        summary.errors.push({
          subreddit: sub,
          message: `subreddit-insight: ${(err as Error).message}`,
        });
      }
    }

    // 3. Build analyze queue (just-scraped + backlog), deduped.
    const seen = new Set<string>();
    const toAnalyze = [];
    for (const p of posts) {
      if (!postHasOpportunity(p.id) && !seen.has(p.id)) {
        seen.add(p.id);
        toAnalyze.push(p);
      }
    }
    for (const p of listUnanalyzedPosts(sub, 200)) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        toAnalyze.push(p);
      }
    }

    // 4. Triage + reply.
    for (const post of toAnalyze) {
      if (getCallCount() >= maxLlm) break;
      try {
        const triage = await triagePost(post, profile);
        if (triage.intent === 'not_relevant' || triage.leadPotential < 35) {
          continue;
        }
        if (getCallCount() >= maxLlm) break;
        const reply = await generateReply(post, profile, triage);
        const op = buildOpportunity(`op-${post.id}`, post, triage, reply);
        saveOpportunity(op, post.id, hash);
        summary.opportunitiesCreated += 1;
      } catch (err) {
        if (err instanceof FatalLlmError) {
          fatalAbort = err;
          break outer;
        }
        summary.errors.push({
          postId: post.id,
          message: `analyze-post: ${(err as Error).message}`,
        });
      }
    }
  }

  if (fatalAbort) {
    summary.errors.unshift({
      message: `Aborted: ${fatalAbort.message}`,
    });
  }

  finalize(runId, summary, started);
  return summary;
}

function finalize(runId: number, summary: IngestSummary, started: number) {
  summary.llmCalls = getCallCount();
  summary.durationMs = Date.now() - started;
  finishIngestRun(runId, {
    subredditsScraped: summary.subredditsScraped,
    postsFetched: summary.postsFetched,
    opportunitiesCreated: summary.opportunitiesCreated,
    llmCalls: summary.llmCalls,
    error: summary.errors.length
      ? summary.errors
          .map((e) => [e.subreddit, e.postId, e.message].filter(Boolean).join(' | '))
          .join('\n')
      : undefined,
  });
}

export type { CompanyProfile };
