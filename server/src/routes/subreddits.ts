import { Router } from 'express';
import { z } from 'zod';
import {
  deleteSubreddit,
  listSubredditInsights,
  listSubredditNames,
  setSubredditEnabled,
  upsertSubreddit,
} from '../db/repos.js';
import { fetchSubredditAbout, searchSubreddits } from '../reddit/client.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(listSubredditInsights());
});

router.get('/configured', (_req, res) => {
  res.json(listSubredditNames());
});

const AddSchema = z.object({ name: z.string().min(2) });
router.post('/', async (req, res) => {
  const parsed = AddSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const about = await fetchSubredditAbout(parsed.data.name);
    upsertSubreddit(about.name, about.members, about.publicDescription || about.description);
    res.json({ ok: true, name: about.name, members: about.members });
  } catch (err) {
    res.status(502).json({ error: (err as Error).message });
  }
});

const ToggleSchema = z.object({ enabled: z.boolean() });
router.patch('/:name', (req, res) => {
  const parsed = ToggleSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const decoded = decodeURIComponent(req.params.name);
  setSubredditEnabled(decoded, parsed.data.enabled);
  res.json({ ok: true });
});

router.delete('/:name', (req, res) => {
  const decoded = decodeURIComponent(req.params.name);
  deleteSubreddit(decoded);
  res.json({ ok: true });
});

router.get('/search', async (req, res) => {
  const q = String(req.query.q ?? '').trim();
  if (!q) {
    res.status(400).json({ error: 'q is required' });
    return;
  }
  try {
    res.json(await searchSubreddits(q, Number(req.query.limit ?? 10)));
  } catch (err) {
    res.status(502).json({ error: (err as Error).message });
  }
});

export default router;
