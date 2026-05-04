import type { CompanyProfile, SubredditInsight } from '../types.js';
import type { SubredditAbout } from '../reddit/client.js';
import type { RawRedditPost } from '../types.js';
import { MODEL_FAST, bumpCallCount, runJson } from './client.js';
import { companyContext, PRINCIPLES } from './prompts.js';

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    whyRelevant: { type: 'string' },
    audienceFit: { type: 'integer', minimum: 0, maximum: 100 },
    leadPotential: { type: 'integer', minimum: 0, maximum: 100 },
    promotionTolerance: { type: 'string', enum: ['none', 'low', 'medium', 'high'] },
    spamRisk: { type: 'integer', minimum: 0, maximum: 100 },
    recommendedAction: {
      type: 'string',
      enum: [
        'lurk_first',
        'comment_before_posting',
        'safe_for_educational_posts',
        'avoid_direct_promotion',
        'ready_to_post',
      ],
    },
    commonQuestions: { type: 'array', items: { type: 'string' } },
    repeatedPains: { type: 'array', items: { type: 'string' } },
    competitorMentions: { type: 'array', items: { type: 'string' } },
    customerLanguage: { type: 'array', items: { type: 'string' } },
    contentAngles: { type: 'array', items: { type: 'string' } },
    karmaRequirement: { type: 'string', enum: ['none', 'low', 'medium', 'high'] },
  },
  required: [
    'whyRelevant',
    'audienceFit',
    'leadPotential',
    'promotionTolerance',
    'spamRisk',
    'recommendedAction',
    'commonQuestions',
    'repeatedPains',
    'competitorMentions',
    'customerLanguage',
    'contentAngles',
    'karmaRequirement',
  ],
} as const;

interface LlmResponse {
  whyRelevant: string;
  audienceFit: number;
  leadPotential: number;
  promotionTolerance: SubredditInsight['promotionTolerance'];
  spamRisk: number;
  recommendedAction: SubredditInsight['recommendedAction'];
  commonQuestions: string[];
  repeatedPains: string[];
  competitorMentions: string[];
  customerLanguage: string[];
  contentAngles: string[];
  karmaRequirement: SubredditInsight['karmaRequirement'];
}

export async function generateSubredditInsight(
  about: SubredditAbout,
  recentPosts: RawRedditPost[],
  profile: CompanyProfile,
): Promise<SubredditInsight> {
  const sampleTitles = recentPosts.slice(0, 30).map((p) => `- ${p.title}`).join('\n');

  const user = `${PRINCIPLES}

Company profile:
${companyContext(profile)}

Subreddit: ${about.name}
Members: ${about.members}
Public description: ${about.publicDescription || about.description}

Sample of recent post titles (most-recent ${recentPosts.length}):
${sampleTitles}

Subreddit rules:
${about.rules.map((r) => `- ${r}`).join('\n') || '(none surfaced)'}

Produce a strategic insight for this subreddit, scored against THIS company. Be specific to the
sample posts and rules. Do not invent rules. Only include competitor mentions you actually see.`;

  const result = await runJson<LlmResponse>({
    model: MODEL_FAST,
    system:
      'You are a Reddit community strategist for a B2B SaaS company. Be concrete, conservative, and honest about risk.',
    user,
    schema: { name: 'subreddit_insight', schema: SCHEMA as Record<string, unknown> },
    parse: (raw) => raw as LlmResponse,
  });
  bumpCallCount();

  return {
    name: about.name,
    description: about.publicDescription || about.description.slice(0, 280),
    members: about.members,
    rules: about.rules,
    whyRelevant: result.whyRelevant ?? '',
    audienceFit: clamp(result.audienceFit, 0, 100),
    leadPotential: clamp(result.leadPotential, 0, 100),
    promotionTolerance: result.promotionTolerance ?? 'low',
    spamRisk: clamp(result.spamRisk, 0, 100),
    recommendedAction: result.recommendedAction ?? 'lurk_first',
    commonQuestions: arr(result.commonQuestions),
    repeatedPains: arr(result.repeatedPains),
    competitorMentions: arr(result.competitorMentions),
    customerLanguage: arr(result.customerLanguage),
    contentAngles: arr(result.contentAngles),
    karmaRequirement: result.karmaRequirement ?? 'low',
  };
}

function arr<T>(v: T[] | undefined | null): T[] {
  return Array.isArray(v) ? v : [];
}

function clamp(n: number | undefined | null, min: number, max: number): number {
  const v = typeof n === 'number' && Number.isFinite(n) ? n : min;
  return Math.max(min, Math.min(max, v));
}
