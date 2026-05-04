import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { env } from '../env.js';

// ─── SDK clients (lazy) ────────────────────────────────────────────

const openai = env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: env.OPENAI_API_KEY, maxRetries: 0 })
  : null;

const anthropic = env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 0 })
  : null;

// ─── Model resolution per provider ─────────────────────────────────

export const MODEL_FAST =
  env.LLM_PROVIDER === 'anthropic' ? env.ANTHROPIC_MODEL_FAST : env.OPENAI_MODEL_FAST;

export const MODEL_SMART =
  env.LLM_PROVIDER === 'anthropic' ? env.ANTHROPIC_MODEL_SMART : env.OPENAI_MODEL_SMART;

export const PROVIDER = env.LLM_PROVIDER;

// ─── Fatal-error detection ─────────────────────────────────────────

/** Account-level fatal error that should abort the entire ingest. */
export class FatalLlmError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FatalLlmError';
  }
}

function detectFatal(message: string): FatalLlmError | null {
  const lower = message.toLowerCase();
  if (
    lower.includes('insufficient_quota') ||
    lower.includes('exceeded your current quota') ||
    lower.includes('credit balance is too low') ||
    lower.includes('credit_balance_too_low') ||
    lower.includes('incorrect api key') ||
    lower.includes('invalid api key') ||
    lower.includes('invalid x-api-key') ||
    lower.includes('authentication_error') ||
    lower.includes('account is not active')
  ) {
    return new FatalLlmError(message);
  }
  return null;
}

// ─── Public runJson API ────────────────────────────────────────────

interface RunOptions<T> {
  model: string;
  system: string;
  user: string;
  schema: {
    name: string;
    schema: Record<string, unknown>;
  };
  parse: (raw: unknown) => T;
  temperature?: number;
}

export async function runJson<T>(opts: RunOptions<T>): Promise<T> {
  try {
    const raw =
      env.LLM_PROVIDER === 'anthropic'
        ? await runAnthropic(opts)
        : await runOpenAI(opts);
    return opts.parse(raw);
  } catch (err) {
    const message = (err as Error).message ?? String(err);
    const fatal = detectFatal(message);
    if (fatal) throw fatal;
    throw err;
  }
}

// ─── OpenAI (json_schema response format) ──────────────────────────

async function runOpenAI<T>(opts: RunOptions<T>): Promise<unknown> {
  void (null as unknown as T);
  if (!openai) throw new Error('OPENAI_API_KEY missing');
  const completion = await openai.chat.completions.create({
    model: opts.model,
    temperature: opts.temperature ?? 0.4,
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: opts.schema.name,
        strict: true,
        schema: opts.schema.schema,
      },
    },
    messages: [
      { role: 'system', content: opts.system },
      { role: 'user', content: opts.user },
    ],
  });
  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error('OpenAI returned an empty response');
  try {
    return JSON.parse(content);
  } catch {
    throw new Error(`OpenAI returned non-JSON response: ${content}`);
  }
}

// ─── Anthropic (forced tool-use → structured JSON) ─────────────────

async function runAnthropic<T>(opts: RunOptions<T>): Promise<unknown> {
  void (null as unknown as T);
  if (!anthropic) throw new Error('ANTHROPIC_API_KEY missing');

  // Anthropic's tool input_schema accepts standard JSON Schema objects.
  // We force the model to call our single 'submit' tool, then read the
  // structured input it produced.
  const message = await anthropic.messages.create({
    model: opts.model,
    max_tokens: 4096,
    temperature: opts.temperature ?? 0.4,
    system: opts.system,
    messages: [{ role: 'user', content: opts.user }],
    tools: [
      {
        name: 'submit',
        description: `Return the structured ${opts.schema.name} response.`,
        input_schema: opts.schema.schema as Anthropic.Tool.InputSchema,
      },
    ],
    tool_choice: { type: 'tool', name: 'submit' },
  });

  const toolUse = message.content.find(
    (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use',
  );
  if (!toolUse) {
    throw new Error('Anthropic did not return a tool_use block');
  }
  return toolUse.input;
}

// ─── Call counter (per ingest run) ─────────────────────────────────

let llmCallCount = 0;
export function bumpCallCount(n = 1) {
  llmCallCount += n;
  return llmCallCount;
}
export function getCallCount() {
  return llmCallCount;
}
export function resetCallCount() {
  llmCallCount = 0;
}
