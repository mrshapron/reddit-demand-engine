import type { CompanyProfile, RedditOpportunity, SubredditInsight } from '../types.js';
import { MODEL_SMART, bumpCallCount, runJson } from './client.js';
import { companyContext, PRINCIPLES } from './prompts.js';

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    bestSubreddits: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          name: { type: 'string' },
          reason: { type: 'string' },
          score: { type: 'integer', minimum: 0, maximum: 100 },
        },
        required: ['name', 'reason', 'score'],
      },
    },
    topPains: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          pain: { type: 'string' },
          mentions: { type: 'integer', minimum: 0 },
          subreddits: { type: 'array', items: { type: 'string' } },
        },
        required: ['pain', 'mentions', 'subreddits'],
      },
    },
    postingPlan: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          day: { type: 'string' },
          action: { type: 'string' },
          subreddit: { type: 'string' },
          why: { type: 'string' },
        },
        required: ['day', 'action', 'subreddit', 'why'],
      },
    },
    weeklyActions: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          priority: { type: 'string', enum: ['low', 'medium', 'high'] },
          type: {
            type: 'string',
            enum: ['comment', 'post', 'lurk', 'karma', 'avoid'],
          },
        },
        required: ['id', 'title', 'description', 'priority', 'type'],
      },
    },
    thingsToAvoid: { type: 'array', items: { type: 'string' } },
    contentThemes: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          theme: { type: 'string' },
          reason: { type: 'string' },
        },
        required: ['theme', 'reason'],
      },
    },
  },
  required: [
    'bestSubreddits',
    'topPains',
    'postingPlan',
    'weeklyActions',
    'thingsToAvoid',
    'contentThemes',
  ],
} as const;

interface StrategyLlmResult {
  bestSubreddits: { name: string; reason: string; score: number }[];
  topPains: { pain: string; mentions: number; subreddits: string[] }[];
  postingPlan: { day: string; action: string; subreddit: string; why: string }[];
  weeklyActions: {
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    type: 'comment' | 'post' | 'lurk' | 'karma' | 'avoid';
  }[];
  thingsToAvoid: string[];
  contentThemes: { theme: string; reason: string }[];
}

export async function generateStrategy(
  profile: CompanyProfile,
  insights: SubredditInsight[],
  opportunities: RedditOpportunity[],
): Promise<StrategyLlmResult> {
  const insightSummary = insights
    .map((i) =>
      [
        `${i.name} (members=${i.members}, audienceFit=${i.audienceFit}, leadPotential=${i.leadPotential}, promoTolerance=${i.promotionTolerance})`,
        `  pains: ${i.repeatedPains.slice(0, 6).join('; ')}`,
        `  questions: ${i.commonQuestions.slice(0, 4).join('; ')}`,
      ].join('\n'),
    )
    .join('\n');

  const opSummary = opportunities
    .slice(0, 25)
    .map(
      (o) =>
        `${o.subreddit} | leadPotential=${o.leadPotential} | ${o.intent} | ${o.postTitle.slice(0, 100)}`,
    )
    .join('\n');

  const user = `${PRINCIPLES}

Company profile:
${companyContext(profile)}

Subreddit insights:
${insightSummary || '(none yet)'}

Recent high-signal opportunities:
${opSummary || '(none yet)'}

Produce a weekly Reddit playbook for THIS company. Use only the data above — no inventions.
- bestSubreddits: 3-5 ranked picks. Score = your blended audienceFit/leadPotential. Reason should
  cite specifics from the data.
- topPains: 4-6 pains aggregated across subs, with rough mention counts based on what you see.
- postingPlan: 5-day plan (Mon-Fri). Front-load commenting; 1-2 educational posts mid/late week.
- weeklyActions: 3-6 concrete to-dos. Use unique ids "wa-1", "wa-2", ...
- thingsToAvoid: subreddit-specific tactical guardrails.
- contentThemes: themes that fit the company AND the subreddits' tone.`;

  const result = await runJson<StrategyLlmResult>({
    model: MODEL_SMART,
    temperature: 0.5,
    system:
      'You are a Reddit GTM strategist. Output is concrete, conservative, data-grounded.',
    user,
    schema: { name: 'strategy', schema: SCHEMA as Record<string, unknown> },
    parse: (raw) => raw as StrategyLlmResult,
  });
  bumpCallCount();
  return result;
}
