import type { StrategySnapshot } from '@/types/strategy';

export const mockStrategy: StrategySnapshot = {
  bestSubreddits: [
    {
      name: 'r/RevOps',
      reason: 'Highest audience fit (96). 11 high-intent posts this week.',
      score: 96,
    },
    {
      name: 'r/SaaS',
      reason: 'Wide reach + medium promo tolerance. Good for educational long-form.',
      score: 84,
    },
    {
      name: 'r/CustomerSuccess',
      reason: 'Detractor + handoff posts trending. Comment-first to build karma.',
      score: 81,
    },
  ],
  topPains: [
    { pain: 'Silent Zap failures', mentions: 32, subreddits: ['r/RevOps', 'r/SaaS', 'r/salesforce'] },
    { pain: 'Tool sprawl across 8+ apps', mentions: 28, subreddits: ['r/SaaS', 'r/RevOps'] },
    { pain: 'No audit trail / SOC 2 prep', mentions: 19, subreddits: ['r/RevOps', 'r/salesforce'] },
    { pain: 'Founder-as-ops, no engineering', mentions: 17, subreddits: ['r/SaaS', 'r/startups'] },
    { pain: 'Workato/Tray priced out at <100 ppl', mentions: 14, subreddits: ['r/SaaS', 'r/RevOps'] },
  ],
  topReplyOpportunities: [
    {
      id: 'op-3',
      subreddit: 'r/RevOps',
      postTitle: 'Zapier just silently dropped 400 lead-routing tasks for a week',
      leadPotential: 91,
    },
    {
      id: 'op-1',
      subreddit: 'r/RevOps',
      postTitle: 'We have 184 Zaps and I think we have a problem',
      leadPotential: 94,
    },
    {
      id: 'op-2',
      subreddit: 'r/SaaS',
      postTitle: 'Closed-won → onboarding handoff without engineering?',
      leadPotential: 86,
    },
  ],
  postingPlan: [
    {
      day: 'Mon',
      action: 'Reply to 3 high-intent posts in r/RevOps',
      subreddit: 'r/RevOps',
      why: 'Build comment karma before posting. Highest-fit subreddit.',
    },
    {
      day: 'Tue',
      action: 'Reply to 2 posts in r/CustomerSuccess',
      subreddit: 'r/CustomerSuccess',
      why: 'Comment-first sub. Establish presence before publishing checklist.',
    },
    {
      day: 'Wed',
      action: 'Publish "5 lessons from migrating 142 Zaps"',
      subreddit: 'r/RevOps',
      why: 'Mid-week posts here perform best. AMA format earns long-tail engagement.',
    },
    {
      day: 'Thu',
      action: 'Engage in comments on Wed post + reply to 2 r/SaaS threads',
      why: 'Maintain visibility. Comments matter as much as the post.',
    },
    {
      day: 'Fri',
      action: 'Publish "How we cut workflow incidents 78%" if Wed post lands well',
      subreddit: 'r/RevOps',
      why: 'Compounding effect — second post in week reaches the same audience warm.',
    },
  ],
  weeklyActions: [
    {
      id: 'wa-1',
      title: 'Respond to 5 high-intent posts before publishing your first post',
      description:
        'Reddit weighs commenting history heavily. 5 useful, on-topic comments in target subreddits before any top-level post.',
      priority: 'high',
      type: 'comment',
    },
    {
      id: 'wa-2',
      title: 'Avoid direct links in r/startups',
      description:
        'r/startups removes links aggressively. Save educational long-form for r/SaaS instead.',
      priority: 'high',
      type: 'avoid',
    },
    {
      id: 'wa-3',
      title: 'Use educational posts in r/SaaS',
      description:
        'r/SaaS rewards research-summary and lessons-learned formats. Avoid "best tool for X" framing.',
      priority: 'medium',
      type: 'post',
    },
    {
      id: 'wa-4',
      title: 'Build comment karma in r/salesforce before any post',
      description:
        'Strict moderation. Need ~5 substantive comments and 50+ comment karma before a top-level post is safe.',
      priority: 'medium',
      type: 'karma',
    },
    {
      id: 'wa-5',
      title: 'Lurk r/RevOps mod-pinned threads for 3 days',
      description:
        'Mod-pinned threads tell you what\'s on-topic this week. Match your content to those signals.',
      priority: 'low',
      type: 'lurk',
    },
  ],
  karma: {
    total: 412,
    postKarma: 84,
    commentKarma: 328,
    accountAgeMonths: 7,
    trustLevel: 'building',
  },
  thingsToAvoid: [
    'Direct product links anywhere in the first 3 comments of a thread',
    'Naming the product in r/salesforce or r/startups',
    'Posting "best Zapier alternative" — it reads as marketing in every sub',
    'Replying with the same template across multiple threads',
    'Using "game-changer", "10x", "leverage", "synergy", or "best in class"',
  ],
  contentThemes: [
    {
      theme: 'Migration stories with specific numbers',
      reason: 'Practitioners trust numbers. "78% incident reduction" outperforms "improved reliability".',
    },
    {
      theme: 'Heartbeat monitoring + silent failure tactics',
      reason: 'High-pain, high-engagement topic. Works in r/RevOps, r/SaaS, r/salesforce.',
    },
    {
      theme: 'When to leave Zapier (non-judgmental framing)',
      reason: 'Reframes the buying question without bashing the alternative. Disarms readers.',
    },
    {
      theme: 'SOC 2 evidence collection workflows',
      reason: 'Audit-trail pain spikes during SOC 2 prep. Targets a specific high-intent moment.',
    },
  ],
};
