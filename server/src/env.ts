import 'dotenv/config';
import { z } from 'zod';

const Schema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_PATH: z.string().default('./data/app.db'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),

  LLM_PROVIDER: z.enum(['openai', 'anthropic']).default('anthropic'),

  OPENAI_API_KEY: z.string().optional().default(''),
  OPENAI_MODEL_FAST: z.string().default('gpt-4o-mini'),
  OPENAI_MODEL_SMART: z.string().default('gpt-4o'),

  ANTHROPIC_API_KEY: z.string().optional().default(''),
  ANTHROPIC_MODEL_FAST: z.string().default('claude-haiku-4-5'),
  ANTHROPIC_MODEL_SMART: z.string().default('claude-sonnet-4-5'),

  REDDIT_USER_AGENT: z
    .string()
    .default('reddit-demand-engine/0.1 (by u/anonymous)'),
  REDDIT_CLIENT_ID: z.string().optional().default(''),
  REDDIT_CLIENT_SECRET: z.string().optional().default(''),
  REDDIT_USERNAME: z.string().optional().default(''),
  REDDIT_PASSWORD: z.string().optional().default(''),

  INGEST_POSTS_PER_SUBREDDIT: z.coerce.number().int().positive().default(25),
  INGEST_MAX_LLM_CALLS: z.coerce.number().int().positive().default(60),
});

const parsed = Schema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment configuration:');
  for (const issue of parsed.error.issues) {
    console.error(`  ${issue.path.join('.')}: ${issue.message}`);
  }
  process.exit(1);
}

export const env = parsed.data;

// Cross-field validation: the chosen provider must have its key configured.
if (env.LLM_PROVIDER === 'openai' && !env.OPENAI_API_KEY) {
  console.error('LLM_PROVIDER=openai but OPENAI_API_KEY is empty.');
  process.exit(1);
}
if (env.LLM_PROVIDER === 'anthropic' && !env.ANTHROPIC_API_KEY) {
  console.error('LLM_PROVIDER=anthropic but ANTHROPIC_API_KEY is empty.');
  process.exit(1);
}

export const redditOauthEnabled = Boolean(
  env.REDDIT_CLIENT_ID &&
    env.REDDIT_CLIENT_SECRET &&
    env.REDDIT_USERNAME &&
    env.REDDIT_PASSWORD,
);
