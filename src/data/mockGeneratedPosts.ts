import type { GeneratedPostDraft } from '@/types/reddit';

export const mockGeneratedPosts: GeneratedPostDraft[] = [
  {
    id: 'gp-1',
    subreddit: 'r/RevOps',
    subredditDescription: 'RevOps practitioners — your highest-fit audience.',
    audienceFit: 96,
    leadPotential: 88,
    promotionTolerance: 'low',
    postType: 'lessons_learned',
    title: '5 lessons from migrating 142 Zaps to a real workflow engine (no plug, just notes)',
    body: `Background: I run RevOps at a Series B SaaS. Last year we inherited 142 Zaps across 4 Zapier accounts. Took ~3 months to migrate. Here's what I'd tell past me.

1. Audit before you migrate. ~30% of our Zaps were dead, duplicate, or owned by people who'd left. Killing them first cut migration scope in half and saved real budget.

2. Migrate by business owner, not by complexity. Each owner saw their stuff working end-to-end before we touched the next group. Way easier to debug than a horizontal "all the Stripe Zaps first" approach.

3. Force every workflow to have an owner, a description, and a "what does this do in plain English" field — even on the Zaps you keep. The audit trail problem is 60% process, 40% tooling.

4. Add a heartbeat. Synthetic test record once an hour through every revenue-critical workflow. PagerDuty if it doesn't come out the other side. This catches the silent failures Zapier won't tell you about.

5. The deciding criterion for the new tool was: can a non-engineer debug a failed run without me? About half the tools we evaluated failed this. Pick on that, not feature lists.

Workflow incidents dropped ~78% in the quarter after we finished. AMA if useful.`,
    whyImportant:
      'High-signal post on the central pain. Establishes you as a practitioner, not a vendor. Earns comment karma in the most valuable subreddit.',
    whyFitsSubreddit:
      'r/RevOps loves long-form lessons-learned posts from practitioners. Audit + migration is a perpetual topic. No product mention keeps it within the rules.',
    customerPainTargeted:
      'Tool sprawl, silent Zap failures, no audit trail, and the migration question that dozens of RevOps leads ask every month.',
    recommendedCta:
      'AMA in comments. Optional: "Happy to share the audit template, DM if useful." Never link.',
    spamRisk: 22,
    redditNativeRewriteSuggestions: [
      'Open with a one-line context, not a credential drop',
      'Use "we" / "I", never "our team" or "leveraged"',
      'Cut any sentence that sounds like a press release',
      'End with AMA, not a CTA',
    ],
    warnings: [
      'Do not link the product anywhere in the post',
      'If a commenter asks for tools, name 3 alternatives + ours, not just ours',
    ],
  },
  {
    id: 'gp-2',
    subreddit: 'r/SaaS',
    subredditDescription: 'Founders and operators at SaaS companies.',
    audienceFit: 84,
    leadPotential: 72,
    promotionTolerance: 'medium',
    postType: 'research_summary',
    title: 'I read 100 r/SaaS posts about automation — here\'s what people actually struggle with',
    body: `I went through ~100 posts in this sub from the last 6 months tagged with "automation", "Zapier", "ops", or "tools". A few patterns showed up over and over:

The pains, ranked by frequency:

• Silent failures (32 posts). "Discovered today that a Zap has been failing for a week."
• Tool sprawl (28 posts). "We have 8 tools and nothing talks to each other."
• No audit trail (19 posts). Usually triggered by a SOC 2 prep or a near-miss.
• Founder-as-ops (17 posts). "I'm the founder, the AE, and the ops person."
• Pricing cliff (14 posts). "Workato wanted $40k, we're 30 people."

The asks, ranked by frequency:

• "What's a Zapier alternative that actually works?" (24 posts)
• "How do you handle closed-won → onboarding handoff?" (18 posts)
• "How do you monitor automations that fail silently?" (15 posts)
• "What's your stack for NPS detractor → CS workflow?" (11 posts)

What people actually picked, when they reported back:

• Stayed on Zapier with a heartbeat monitor — 22%
• Moved to Make — 14%
• Moved to a smaller workflow tool with version history — 19%
• Self-hosted n8n — 8%
• Built it themselves on AWS — 6%
• Never reported back — 31%

A few non-obvious takeaways:

1. The "Workato is too expensive" complaint is so common that anyone selling to <100-person SaaS should price under $1k/mo or lose the segment.
2. The audit-trail pain is downstream of SOC 2. If you're pre-SOC 2, you don't notice it. After, it's the #1 ask.
3. Most "Zapier broke" complaints are actually monitoring complaints — Zapier did surface the error, nobody was watching.

Curious what other patterns people have seen. Would be happy to share the raw post list if useful.`,
    whyImportant:
      'Research-summary posts perform extremely well in r/SaaS — they\'re shareable, quotable, and earn long tail comment karma. Doubles as content for your blog.',
    whyFitsSubreddit:
      'r/SaaS rewards data + practitioner takes. The "I analyzed 100 posts" format has worked here before. Light enough on tool talk to stay within self-promo rules.',
    customerPainTargeted:
      'All five core pains. The post itself is a soft positioning piece — it teaches the reader to evaluate tools the way Acme wants to be evaluated.',
    recommendedCta:
      'Offer the raw post list in comments. No link in the body.',
    spamRisk: 30,
    redditNativeRewriteSuggestions: [
      'Keep the numbers honest — round, don\'t inflate',
      'Cut any line that sounds like a marketing claim',
      'Add one self-deprecating line about your methodology',
    ],
    warnings: [
      'Do not link to your blog version of this — Reddit-native only',
      'If asked which tool you use, name 2-3 honestly, including yours, with one-line tradeoffs',
    ],
  },
  {
    id: 'gp-3',
    subreddit: 'r/CustomerSuccess',
    subredditDescription: 'CS leaders, ops, and ICs.',
    audienceFit: 81,
    leadPotential: 74,
    promotionTolerance: 'low',
    postType: 'checklist',
    title: 'A practical checklist for closed-won → onboarding handoff (the boring one that actually works)',
    body: `Posting this because I\'ve seen four versions of this question this month. This is the version that worked at my last two companies (~40 and ~120 people).

Before any tooling, define the handoff data contract. The 7 fields a CSM needs to start onboarding:

• Account owner (CSM by name, not "the CS team")
• Contract value + term
• Integrations promised in the deal
• Kickoff timeline expectation set in sales
• Named exec sponsor on the customer side
• Top 1 success metric the customer cares about
• Anything weird the AE wants to flag

If those 7 fields are not filled in, the deal does not move to closed-won. This is the unpopular part. It works.

Then automate (any tool — pick what you have):

• Closed-won fires the workflow
• Post the checklist + kickoff link in #cs-onboarding, @-mentioning the named CSM
• Create the Notion (or whatever) project from a template
• Schedule the kickoff calendar event, don\'t leave it as a task
• Trigger a 14-day check-in on the calendar
• Write the handoff snapshot back to your CRM so it\'s searchable later

What we got wrong the first 3 times:

1. Used a shared Slack channel without @-mentioning the named CSM. Detractor alerts and handoffs both die in noisy channels.
2. Made the 14-day check-in a task instead of a calendar event. Tasks rot.
3. Didn\'t version the handoff template. After 6 months we had no idea what changed when.

Happy to share the actual template if useful.`,
    whyImportant:
      'Checklists earn long-tail traffic and bookmarks. Establishes Acme as the "ops practitioner" voice in r/CustomerSuccess.',
    whyFitsSubreddit:
      'r/CustomerSuccess is practitioner-heavy and dislikes vendor pitches. A specific, opinionated checklist is exactly the kind of post that gets pinned in comments.',
    customerPainTargeted:
      'Closed-won handoff (a stated example use case), CS handoff drift, lost context.',
    recommendedCta: 'Offer the template in comments. No link.',
    spamRisk: 18,
    redditNativeRewriteSuggestions: [
      'Cut the phrase "best practice" entirely',
      'Use specific numbers (40, 120 people, 14-day) — they read true',
      'End with "happy to share", not "DM me"',
    ],
    warnings: ['Avoid mentioning the product even if asked — direct people to the template'],
  },
  {
    id: 'gp-4',
    subreddit: 'r/SaaS',
    subredditDescription: 'Founders and operators at SaaS companies.',
    audienceFit: 78,
    leadPotential: 64,
    promotionTolerance: 'medium',
    postType: 'question',
    title: 'How are you handling silent automation failures? (genuinely asking, we just got burned)',
    body: `We just discovered an automation that\'s been failing silently for 8 days. ~400 leads went into the void. No alert, no email, nothing. Found it because an AE asked why his queue was empty.

I\'m sure I\'m not the only one. How are you actually monitoring this stuff?

What I\'ve seen so far:

• Zapier\'s built-in error notifications — get lost in inbox noise
• A Slack channel just for automation errors — gets muted within a week
• Heartbeat monitoring (synthetic record once an hour) — works but tedious to set up
• PagerDuty for revenue-critical flows only — what we\'re building toward

Curious if anyone has something better. Especially the "what do you alert on, and to whom" part — the alerting design matters more than the tool.`,
    whyImportant:
      'Question posts earn higher engagement than statement posts in r/SaaS. Positions you as a peer asking, not a vendor selling.',
    whyFitsSubreddit:
      'r/SaaS rewards genuine questions with a clear context. The format invites founders and ops people to share — which is the audience you want to be seen by.',
    customerPainTargeted: 'Silent Zap failures and the monitoring gap.',
    recommendedCta:
      'No CTA needed. Engage in comments and learn what people are actually doing.',
    spamRisk: 16,
    redditNativeRewriteSuggestions: [
      'Genuinely ask — don\'t lead the witness toward a specific answer',
      'Don\'t mention any vendor in the body, including yours',
      'Reply to commenters with specifics, not generic thanks',
    ],
    warnings: ['If a commenter asks what you use, answer honestly with 2-3 options and tradeoffs'],
  },
  {
    id: 'gp-5',
    subreddit: 'r/RevOps',
    subredditDescription: 'RevOps practitioners.',
    audienceFit: 92,
    leadPotential: 80,
    promotionTolerance: 'low',
    postType: 'case_study',
    title: 'How we cut workflow incidents 78% in one quarter (no vendor pitch, just what we changed)',
    body: `Posting our actual numbers because I find vague "we improved X" posts useless.

Q1 baseline: ~14 workflow incidents per month, mostly silent. Average time to detection: 4.2 days.

Q2 result: ~3 incidents per month. Average time to detection: 11 minutes.

What we changed, in priority order:

1. Heartbeat monitoring on every revenue-critical workflow. Synthetic record every 30 minutes. PagerDuty if it doesn\'t round-trip. Took 2 days to build. Caught 6 of the next 8 incidents.

2. Forced every workflow to have a named owner and a runbook. If you can\'t name the owner, the workflow gets paused. Painful for 2 weeks, then quiet.

3. Moved revenue-critical flows off the no-code tool we were on, onto a workflow platform with version history and proper retries. Kept the no-code tool for low-stakes stuff. The split mattered more than the choice of tool.

4. Stopped firing alerts into shared channels. Every alert now @-mentions a named human. If nobody owns it, it doesn\'t get an alert.

5. Postmortems for every incident, even the small ones. Not blameful — just a 1-pager: what broke, who noticed, how long, what we changed. Compounded over the quarter.

Things that didn\'t help: switching tools alone (without #1 and #2, the new tool would have failed silently too). Buying a "monitoring suite" with a dashboard nobody looked at.

Happy to share the runbook template and the heartbeat code if useful. No pitch.`,
    whyImportant:
      'Case studies with real numbers are catnip in r/RevOps. The structure (priority order + what didn\'t work) is exactly the format that gets pinned.',
    whyFitsSubreddit:
      'r/RevOps loves specific numbers and ordered priorities. Calling out "what didn\'t help" earns trust. No product mention keeps it within rules.',
    customerPainTargeted: 'All three core pains: silent failures, no audit, ownership gaps.',
    recommendedCta:
      'Offer the runbook template + heartbeat code in comments. No link.',
    spamRisk: 24,
    redditNativeRewriteSuggestions: [
      'Keep the numbers exact — 78%, 11 minutes, 14 → 3',
      'Don\'t name the workflow platform unless asked',
      'End with "no pitch" — it\'s the unfakeable signal',
    ],
    warnings: [
      'If asked which platform, name 2-3 honestly, including yours, one line each',
      'Do not link to a case study page on your site — Reddit-native only',
    ],
  },
  {
    id: 'gp-6',
    subreddit: 'r/nocode',
    subredditDescription: 'No-code builders and tinkerers.',
    audienceFit: 58,
    leadPotential: 40,
    promotionTolerance: 'medium',
    postType: 'personal_experience',
    title: 'Signs you\'ve outgrown Zapier (a non-judgmental list)',
    body: `Wrote this for a friend running ops at a 30-person SaaS who asked "am I crazy or has Zapier stopped scaling?" Sharing it here because I keep getting the same question.

You probably haven\'t outgrown Zapier if:

• You have <30 active Zaps
• None of them touch revenue or compliance data
• Failures cost you minutes, not hours
• You\'re not doing approvals or multi-step branching

You probably have outgrown Zapier if:

• You have 80+ active Zaps and at least 3 break per week
• You\'ve had a silent failure cost you real money
• Auditors have asked "who changed this Zap and when" and you couldn\'t answer
• You\'re building approval flows in Slack DMs because Zapier can\'t do them well
• Your "ops person" is a Zapier subscription with a person attached

Middle ground (most people are here):

• Keep Zapier for the simple, low-stakes stuff
• Move revenue-critical and compliance-critical flows somewhere with version history, approvals, and proper retries
• Don\'t do a big-bang migration

Not a knock on Zapier. It\'s a great tool, used in the wrong place at the wrong scale, like every tool.`,
    whyImportant:
      'r/nocode is a feeder community. People graduating from Zapier are exactly your buyers in 6 months.',
    whyFitsSubreddit:
      'Non-judgmental tone fits the no-code community. Doesn\'t bash Zapier, just reframes the choice. Self-promo flair recommended.',
    customerPainTargeted: 'Zapier-at-scale pain, the "should we move" question.',
    recommendedCta: 'No CTA. Earn comment karma here for later posts.',
    spamRisk: 28,
    redditNativeRewriteSuggestions: [
      'Keep the "not a knock on Zapier" line — it disarms readers',
      'Don\'t turn this into a "you need a real tool" pitch',
      'Mark with self-promo flair if you mention the product anywhere',
    ],
    warnings: ['Do not name the product in the post body'],
  },
];
