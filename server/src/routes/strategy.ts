import { Router } from 'express';
import {
  getCompanyProfile,
  listOpportunities,
  listSubredditInsights,
} from '../db/repos.js';
import { generateStrategy } from '../llm/strategy.js';
import type { StrategySnapshot } from '../strategyTypes.js';

const router = Router();

let cached: { at: number; data: StrategySnapshot } | null = null;
const TTL_MS = 1000 * 60 * 30;

function defaultKarma(): StrategySnapshot['karma'] {
  return {
    total: 0,
    postKarma: 0,
    commentKarma: 0,
    accountAgeMonths: 0,
    trustLevel: 'new',
  };
}

router.get('/', async (req, res) => {
  const force = req.query.refresh === '1';
  if (!force && cached && Date.now() - cached.at < TTL_MS) {
    res.json(cached.data);
    return;
  }

  const profile = getCompanyProfile();
  const insights = listSubredditInsights();
  const opportunities = listOpportunities(50);

  if (!profile.companyName || !insights.length) {
    res.json({
      bestSubreddits: [],
      topPains: [],
      topReplyOpportunities: [],
      postingPlan: [],
      weeklyActions: [],
      karma: defaultKarma(),
      thingsToAvoid: [],
      contentThemes: [],
    } satisfies StrategySnapshot);
    return;
  }

  try {
    const llm = await generateStrategy(profile, insights, opportunities);
    const data: StrategySnapshot = {
      ...llm,
      topReplyOpportunities: opportunities
        .slice(0, 5)
        .map((o) => ({
          id: o.id,
          subreddit: o.subreddit,
          postTitle: o.postTitle,
          leadPotential: o.leadPotential,
        })),
      karma: defaultKarma(),
    };
    cached = { at: Date.now(), data };
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: (err as Error).message });
  }
});

export default router;
