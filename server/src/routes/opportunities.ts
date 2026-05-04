import { Router } from 'express';
import { z } from 'zod';
import {
  getCompanyProfile,
  listOpportunities,
  setOpportunityStatus,
} from '../db/repos.js';
import { generateReply, triagePost } from '../llm/opportunity.js';
import { db } from '../db/client.js';
import type { RawRedditPost } from '../types.js';

const router = Router();

router.get('/', (req, res) => {
  const limit = Math.min(200, Number(req.query.limit ?? 50));
  res.json(listOpportunities(limit));
});

const StatusSchema = z.object({
  status: z.enum(['pending', 'applied', 'skipped', 'saved']),
});
router.patch('/:id/status', (req, res) => {
  const parsed = StatusSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const updated = setOpportunityStatus(req.params.id, parsed.data.status);
  if (!updated) {
    res.status(404).json({ error: 'opportunity not found' });
    return;
  }
  res.json(updated);
});

router.post('/:id/regenerate', async (req, res) => {
  const opRow = db
    .prepare('SELECT post_id FROM opportunities WHERE id = ?')
    .get(req.params.id) as { post_id: string } | undefined;
  if (!opRow) {
    res.status(404).json({ error: 'opportunity not found' });
    return;
  }
  const postRow = db
    .prepare('SELECT raw_json FROM reddit_posts WHERE id = ?')
    .get(opRow.post_id) as { raw_json: string } | undefined;
  if (!postRow) {
    res.status(404).json({ error: 'underlying post not found' });
    return;
  }
  const post = JSON.parse(postRow.raw_json) as RawRedditPost;
  const profile = getCompanyProfile();
  try {
    const triage = await triagePost(post, profile);
    const reply = await generateReply(post, profile, triage);
    res.json({ triage, reply });
  } catch (err) {
    res.status(502).json({ error: (err as Error).message });
  }
});

export default router;
