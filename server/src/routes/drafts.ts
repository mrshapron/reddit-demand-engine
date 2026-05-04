import { Router } from 'express';
import { z } from 'zod';
import {
  getCompanyProfile,
  listDrafts,
  listSubredditInsights,
  profileHash,
  saveDraft,
  setDraftApproved,
} from '../db/repos.js';
import { generatePostDraft } from '../llm/postDraft.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(listDrafts(50));
});

const GenerateSchema = z.object({
  subreddit: z.string().min(2),
  postType: z
    .enum([
      'lessons_learned',
      'question',
      'case_study',
      'checklist',
      'research_summary',
      'personal_experience',
    ])
    .optional(),
});
router.post('/', async (req, res) => {
  const parsed = GenerateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const insight = listSubredditInsights().find(
    (i) => i.name === parsed.data.subreddit,
  );
  if (!insight) {
    res
      .status(404)
      .json({ error: `No insight for ${parsed.data.subreddit}. Run an ingest first.` });
    return;
  }
  const profile = getCompanyProfile();
  if (!profile.companyName) {
    res
      .status(400)
      .json({ error: 'Company profile is empty. Save it on the Company Profile page.' });
    return;
  }
  try {
    const draft = await generatePostDraft(insight, profile, parsed.data.postType);
    saveDraft(draft, profileHash(profile));
    res.json(draft);
  } catch (err) {
    res.status(502).json({ error: (err as Error).message });
  }
});

const ApproveSchema = z.object({ approved: z.boolean() });
router.patch('/:id', (req, res) => {
  const parsed = ApproveSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const updated = setDraftApproved(req.params.id, parsed.data.approved);
  if (!updated) {
    res.status(404).json({ error: 'draft not found' });
    return;
  }
  res.json(updated);
});

export default router;
