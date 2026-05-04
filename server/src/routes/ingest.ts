import { Router } from 'express';
import { z } from 'zod';
import { runIngest } from '../pipeline/ingest.js';
import { getLatestIngestRun } from '../db/repos.js';

const router = Router();

const RunSchema = z.object({
  subreddits: z.array(z.string()).optional(),
  postsPerSubreddit: z.number().int().positive().max(100).optional(),
  refreshInsights: z.boolean().optional(),
});

let runningPromise: Promise<unknown> | null = null;

router.post('/', async (req, res) => {
  const parsed = RunSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  if (runningPromise) {
    res.status(409).json({ error: 'An ingest is already running.' });
    return;
  }
  runningPromise = runIngest(parsed.data)
    .catch((err) => {
      console.error('[ingest] run failed', err);
    })
    .finally(() => {
      runningPromise = null;
    });

  res.status(202).json({ ok: true, message: 'Ingest started' });
});

router.post('/sync', async (req, res) => {
  const parsed = RunSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const summary = await runIngest(parsed.data);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.get('/status', (_req, res) => {
  res.json({
    running: Boolean(runningPromise),
    latest: getLatestIngestRun() ?? null,
  });
});

export default router;
