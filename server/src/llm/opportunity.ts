import type {
  CompanyProfile,
  LevelLabel,
  RawRedditPost,
  RedditOpportunity,
} from '../types.js';
import { MODEL_FAST, MODEL_SMART, bumpCallCount, runJson } from './client.js';
import { companyContext, PRINCIPLES } from './prompts.js';

const TRIAGE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    intent: {
      type: 'string',
      enum: [
        'asking_recommendation',
        'pain_frustration',
        'looking_for_alternative',
        'asking_how_to_solve',
        'not_relevant',
      ],
    },
    intentStrength: { type: 'string', enum: ['high', 'medium', 'low'] },
    leadPotential: { type: 'integer', minimum: 0, maximum: 100 },
    spamRisk: { type: 'integer', minimum: 0, maximum: 100 },
    productMention: {
      type: 'string',
      enum: ['do_not_mention', 'mention_softly', 'safe_to_mention'],
    },
    whyRelevant: { type: 'string' },
    whyRelevantBullets: {
      type: 'array',
      items: { type: 'string' },
      minItems: 0,
      maxItems: 6,
    },
  },
  required: [
    'intent',
    'intentStrength',
    'leadPotential',
    'spamRisk',
    'productMention',
    'whyRelevant',
    'whyRelevantBullets',
  ],
} as const;

interface TriageResult {
  intent:
    | 'asking_recommendation'
    | 'pain_frustration'
    | 'looking_for_alternative'
    | 'asking_how_to_solve'
    | 'not_relevant';
  intentStrength: 'high' | 'medium' | 'low';
  leadPotential: number;
  spamRisk: number;
  productMention: 'do_not_mention' | 'mention_softly' | 'safe_to_mention';
  whyRelevant: string;
  whyRelevantBullets: string[];
}

const REPLY_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    suggestedReply: { type: 'string' },
    replyStrategy: { type: 'string' },
    shouldMentionProduct: { type: 'boolean' },
    warnings: { type: 'array', items: { type: 'string' } },
  },
  required: ['suggestedReply', 'replyStrategy', 'shouldMentionProduct', 'warnings'],
} as const;

interface ReplyResult {
  suggestedReply: string;
  replyStrategy: string;
  shouldMentionProduct: boolean;
  warnings: string[];
}

function levelLabel(score: number): LevelLabel {
  if (score >= 70) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
}

function postSummary(post: RawRedditPost): string {
  const body = post.selftext.slice(0, 1200);
  return [
    `Subreddit: ${post.subreddit}`,
    `Title: ${post.title}`,
    `Author: ${post.author} | Upvotes: ${post.score} | Comments: ${post.num_comments}`,
    `Body:\n${body}`,
  ].join('\n');
}

export async function triagePost(
  post: RawRedditPost,
  profile: CompanyProfile,
): Promise<TriageResult> {
  const user = `${PRINCIPLES}

Company profile:
${companyContext(profile)}

Post to evaluate:
${postSummary(post)}

Score this post for THIS company. If it is not relevant at all, set intent="not_relevant"
and leadPotential below 25. Be conservative — most posts should score low.`;

  const result = await runJson<TriageResult>({
    model: MODEL_FAST,
    temperature: 0.2,
    system:
      'You triage Reddit posts as commercial opportunities for a B2B SaaS company. Be ruthless and honest — most posts are not opportunities.',
    user,
    schema: { name: 'post_triage', schema: TRIAGE_SCHEMA as Record<string, unknown> },
    parse: (raw) => raw as TriageResult,
  });
  bumpCallCount();
  return result;
}

export async function generateReply(
  post: RawRedditPost,
  profile: CompanyProfile,
  triage: TriageResult,
): Promise<ReplyResult> {
  const user = `${PRINCIPLES}

Company profile:
${companyContext(profile)}

Post:
${postSummary(post)}

Detected: intent=${triage.intent} strength=${triage.intentStrength} leadPotential=${triage.leadPotential}
Suggested product-mention level: ${triage.productMention}

Write a reply that:
- Sounds like a real practitioner with relevant experience.
- Gives 2-4 specific, actionable points the OP can use even WITHOUT our product.
- Follows the product-mention level above. If "do_not_mention", say nothing about us, but you may
  end with "happy to DM" only if the OP explicitly asked for tools.
- Never names competitors negatively.
- Plain prose, short paragraphs, no headers, no marketing voice.

Also produce:
- replyStrategy: 1-2 sentences explaining the approach.
- shouldMentionProduct: true ONLY if mention level is "safe_to_mention".
- warnings: any concrete risks (mod removal, off-topic, promotional tone, low karma needed).`;

  const result = await runJson<ReplyResult>({
    model: MODEL_SMART,
    temperature: 0.7,
    system:
      'You write Reddit replies on behalf of a B2B SaaS company. You sound like a peer practitioner, not marketing.',
    user,
    schema: { name: 'reply', schema: REPLY_SCHEMA as Record<string, unknown> },
    parse: (raw) => raw as ReplyResult,
  });
  bumpCallCount();
  return result;
}

export function buildOpportunity(
  id: string,
  post: RawRedditPost,
  triage: TriageResult,
  reply: ReplyResult,
): RedditOpportunity {
  // Anthropic's tool-use schema is guidance, not strict enforcement, so any
  // field can be missing or wrongly typed. Defensive defaults below mean the
  // frontend never sees an undefined value where it expects a string/array.
  const leadPotential = clamp(triage.leadPotential, 0, 100);
  const spamRisk = clamp(triage.spamRisk, 0, 100);
  return {
    id,
    subreddit: post.subreddit,
    postTitle: post.title,
    postSnippet: post.selftext.slice(0, 600),
    postUrl: post.permalink,
    author: post.author,
    upvotes: post.score,
    comments: post.num_comments,
    postedAt: new Date(post.created_utc * 1000).toISOString(),
    intent:
      triage.intent && triage.intent !== 'not_relevant'
        ? triage.intent
        : 'asking_recommendation',
    intentStrength: triage.intentStrength ?? 'low',
    leadPotential,
    leadPotentialLabel: levelLabel(leadPotential),
    spamRisk,
    spamRiskLabel: levelLabel(spamRisk),
    whyRelevant: triage.whyRelevant ?? '',
    whyRelevantBullets: Array.isArray(triage.whyRelevantBullets)
      ? triage.whyRelevantBullets
      : [],
    suggestedReply: reply.suggestedReply ?? '',
    replyStrategy: reply.replyStrategy ?? '',
    shouldMentionProduct: Boolean(reply.shouldMentionProduct),
    productMention: triage.productMention ?? 'do_not_mention',
    warnings: Array.isArray(reply.warnings) ? reply.warnings : [],
    status: 'pending',
  };
}

function clamp(n: number | undefined | null, min: number, max: number): number {
  const v = typeof n === 'number' && Number.isFinite(n) ? n : min;
  return Math.max(min, Math.min(max, v));
}

export type { TriageResult, ReplyResult };
