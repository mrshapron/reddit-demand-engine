import type { CompanyProfile, GeneratedPostDraft, SubredditInsight } from '../types.js';
import { MODEL_SMART, bumpCallCount, runJson } from './client.js';
import { companyContext, PRINCIPLES } from './prompts.js';

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    postType: {
      type: 'string',
      enum: [
        'lessons_learned',
        'question',
        'case_study',
        'checklist',
        'research_summary',
        'personal_experience',
      ],
    },
    title: { type: 'string' },
    body: { type: 'string' },
    whyImportant: { type: 'string' },
    whyFitsSubreddit: { type: 'string' },
    customerPainTargeted: { type: 'string' },
    recommendedCta: { type: 'string' },
    spamRisk: { type: 'integer', minimum: 0, maximum: 100 },
    redditNativeRewriteSuggestions: {
      type: 'array',
      items: { type: 'string' },
      minItems: 0,
      maxItems: 6,
    },
    warnings: { type: 'array', items: { type: 'string' } },
  },
  required: [
    'postType',
    'title',
    'body',
    'whyImportant',
    'whyFitsSubreddit',
    'customerPainTargeted',
    'recommendedCta',
    'spamRisk',
    'redditNativeRewriteSuggestions',
    'warnings',
  ],
} as const;

interface DraftResult {
  postType: GeneratedPostDraft['postType'];
  title: string;
  body: string;
  whyImportant: string;
  whyFitsSubreddit: string;
  customerPainTargeted: string;
  recommendedCta: string;
  spamRisk: number;
  redditNativeRewriteSuggestions: string[];
  warnings: string[];
}

export async function generatePostDraft(
  insight: SubredditInsight,
  profile: CompanyProfile,
  postType?: GeneratedPostDraft['postType'],
): Promise<GeneratedPostDraft> {
  const user = `${PRINCIPLES}

Company profile:
${companyContext(profile)}

Subreddit: ${insight.name} (${insight.members.toLocaleString()} members)
Description: ${insight.description}
Promotion tolerance: ${insight.promotionTolerance}
Audience fit: ${insight.audienceFit}
Repeated pains in this sub: ${insight.repeatedPains.join('; ')}
Common questions: ${insight.commonQuestions.join('; ')}
Customer language: ${insight.customerLanguage.join('; ')}
Content angles that work: ${insight.contentAngles.join('; ')}
Subreddit rules:
${insight.rules.map((r) => `- ${r}`).join('\n') || '(none)'}

Write a Reddit-native post draft this company could publish in this subreddit.
${postType ? `Use postType="${postType}".` : 'Pick the postType that fits best.'}
Hard constraints:
- No marketing voice. No bullet-vomit. Read like a real human practitioner.
- Title should be plain and curious, not promotional.
- Body should give real, specific value. If sharing a case study, anonymize.
- recommendedCta is what the company should write at the end (e.g. "ask for the OP's
  current setup", "no CTA", "soft offer to DM"). It is NOT marketing copy.
- spamRisk is your honest 0-100 estimate of how likely mods/users see this as promo.`;

  const result = await runJson<DraftResult>({
    model: MODEL_SMART,
    temperature: 0.8,
    system:
      'You ghost-write Reddit posts for a B2B SaaS company. You write like a peer, not marketing. Helpful first, brand-safe always.',
    user,
    schema: { name: 'post_draft', schema: SCHEMA as Record<string, unknown> },
    parse: (raw) => raw as DraftResult,
  });
  bumpCallCount();

  return {
    id: `draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    subreddit: insight.name,
    subredditDescription: insight.description,
    audienceFit: insight.audienceFit,
    leadPotential: insight.leadPotential,
    promotionTolerance: insight.promotionTolerance,
    postType: result.postType ?? 'lessons_learned',
    title: result.title ?? '',
    body: result.body ?? '',
    whyImportant: result.whyImportant ?? '',
    whyFitsSubreddit: result.whyFitsSubreddit ?? '',
    customerPainTargeted: result.customerPainTargeted ?? '',
    recommendedCta: result.recommendedCta ?? '',
    spamRisk: typeof result.spamRisk === 'number' ? result.spamRisk : 0,
    redditNativeRewriteSuggestions: Array.isArray(result.redditNativeRewriteSuggestions)
      ? result.redditNativeRewriteSuggestions
      : [],
    warnings: Array.isArray(result.warnings) ? result.warnings : [],
    approved: false,
  };
}
