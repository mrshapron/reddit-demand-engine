import type { RedditOpportunity } from '@/types/reddit';

export const mockRedditOpportunities: RedditOpportunity[] = [
  {
    id: 'op-1',
    subreddit: 'r/RevOps',
    postTitle: 'We have 184 Zaps and I think we have a problem. What did you migrate to?',
    postSnippet:
      'I joined as Head of RevOps 4 months ago. The previous team built 184 Zaps across 6 Zapier accounts. At least 3 break per week and we have no audit trail. Engineering refuses to own them. We tried Workato but it priced out at $48k/yr. What did you actually migrate to?',
    postUrl: 'https://reddit.com/r/RevOps/example/zap-184',
    author: 'u/ops_lead_22',
    upvotes: 142,
    comments: 38,
    postedAt: '2026-05-03T14:22:00Z',
    intent: 'looking_for_alternative',
    intentStrength: 'high',
    leadPotential: 94,
    leadPotentialLabel: 'High',
    spamRisk: 22,
    spamRiskLabel: 'Low',
    productMention: 'do_not_mention',
    whyRelevantBullets: [
      '184 Zaps + audit trail pain',
      'Priced out of Workato at $48k/yr',
      'RevOps lead = exact ICP',
    ],
    whyRelevant:
      'Textbook ICP: RevOps lead, 100+ Zaps, audit trail pain, priced out of Workato. This is who Acme Workflow Cloud is built for.',
    suggestedReply:
      'We had basically the same situation last year — inherited ~140 Zaps, no audit trail, engineering team that didn\'t want to own glue work. A few things that actually helped, in order of impact:\n\n1. Before migrating anything, we ran a 2-week audit. ~30% of Zaps were dead or duplicates. Killing them first saved real money and made the migration scope half the size.\n\n2. We grouped the remaining ~100 by business owner (CS, Sales, Finance) and migrated by owner, not by complexity. That way each owner saw their stuff working end-to-end before we touched the next group.\n\n3. The thing that actually fixed the audit-trail problem wasn\'t the new tool — it was forcing every workflow to have a named owner, a description, and a "what does this do in plain English" field. We did that even on the Zaps we kept.\n\nOn the tool side: we ended up on a workflow platform that has version history and approvals built in (happy to DM the name, not trying to plug). Workato was also out of budget for us. The deciding factor was that an ops person could actually debug a failed run without asking engineering.',
    replyStrategy:
      'Lead with shared experience, not the product. Give 3 specific, useful tactics that work even without our tool. Mention "happy to DM" only at the end. Do not name Acme in the public reply.',
    shouldMentionProduct: false,
    warnings: [
      'Do not mention product yet — top-level promotion will be removed by mods',
      'Better to answer as helpful advice and let the user opt into a DM',
    ],
  },
  {
    id: 'op-2',
    subreddit: 'r/SaaS',
    postTitle: 'How are you handling closed-won → onboarding handoff without engineering?',
    postSnippet:
      'We\'re a 32-person SaaS, no dedicated ops. Every closed-won deal turns into a Slack DM scramble between AE, CSM, and finance. Half the time the CSM doesn\'t know the deal closed for 2 days. We tried HubSpot workflows, they\'re too rigid. Zapier works but breaks weekly. What are you actually using?',
    postUrl: 'https://reddit.com/r/SaaS/example/handoff',
    author: 'u/saas_founder_jl',
    upvotes: 87,
    comments: 24,
    postedAt: '2026-05-04T08:11:00Z',
    intent: 'asking_recommendation',
    intentStrength: 'high',
    leadPotential: 86,
    leadPotentialLabel: 'High',
    spamRisk: 35,
    spamRiskLabel: 'Low',
    productMention: 'mention_softly',
    whyRelevantBullets: [
      'Founder-led ops, no engineering',
      'Closed-won handoff = your use case',
      'Zapier breaking weekly',
    ],
    whyRelevant:
      'Textbook closed-won handoff problem — one of your stated example use cases. Founder-led ops, no engineering, Zapier breaking. Exact pain point Acme solves.',
    suggestedReply:
      'Ran into this exact thing at our last company (~40 people, no ops hire). Three things that made the biggest difference, before anything tool-related:\n\n• Define the handoff as a checklist, not a vibe. We wrote down the 7 fields a CSM needs to start onboarding (account owner, contract value, integrations promised in the deal, kickoff timeline, etc.). Half the chaos was that "handoff" meant something different to AE and CSM.\n\n• Make the hand-off async by default. We forced AEs to fill the checklist in HubSpot before the deal went to closed-won. No checklist, no closed-won. Sounds harsh, took 2 weeks to enforce, then it just worked.\n\n• Then automate. Once the data is structured, the automation is trivial — closed-won fires a workflow, posts the checklist + a kickoff link in a dedicated Slack channel, creates the project in Notion, pings finance for invoicing. We use a workflow tool that has approvals and retries (Zapier kept breaking on us too); happy to DM if useful.\n\nThe non-obvious part: the checklist is 80% of the win. The tool is the easy part once you have it.',
    replyStrategy:
      'Frame as practitioner advice. Give the structural fix (checklist + async) before any tool talk. Tool is mentioned only as a one-liner with a soft DM CTA. No link.',
    shouldMentionProduct: false,
    warnings: ['This subreddit dislikes promotion — keep tool reference soft and at the end'],
  },
  {
    id: 'op-3',
    subreddit: 'r/RevOps',
    postTitle: 'Zapier just silently dropped 400 lead-routing tasks for a week. How do I sleep at night?',
    postSnippet:
      'Discovered today that a Zap that routes inbound leads to AEs has been silently failing for 8 days. ~400 leads went into the void. No alert, no email, nothing. Found it because an AE asked why his queue was empty. I am losing my mind. How are you monitoring this stuff?',
    postUrl: 'https://reddit.com/r/RevOps/example/zap-silent',
    author: 'u/revops_panic',
    upvotes: 318,
    comments: 71,
    postedAt: '2026-05-02T19:45:00Z',
    intent: 'pain_frustration',
    intentStrength: 'high',
    leadPotential: 91,
    leadPotentialLabel: 'High',
    spamRisk: 25,
    spamRiskLabel: 'Low',
    productMention: 'do_not_mention',
    whyRelevantBullets: [
      'Silent Zap failure = your pain #1',
      '318 upvotes = high visibility',
      'Mods watching — advice-first only',
    ],
    whyRelevant:
      'Pure pain post. The "silent Zap failure" pattern is one of your three named pain points. Strong intent, lots of engagement. Best move is empathy + monitoring tactics, not a pitch.',
    suggestedReply:
      'This one hurts. We had a lead-routing Zap fail silently for 11 days before anyone noticed — same energy.\n\nWhat actually helped (these work on any tool, not just Zapier):\n\n1. Heartbeat-style monitoring. We added a "synthetic" lead that flows through every critical workflow once an hour. If it doesn\'t come out the other side, PagerDuty fires. This is the single most important thing we did. Took maybe 2 hours to set up.\n\n2. Treat workflow failures like prod incidents. Anything that touches revenue gets a runbook, an owner, and a Slack channel where alerts land. If it fires into nobody\'s DM, nobody sees it.\n\n3. We eventually moved off Zapier for the revenue-critical stuff because the failure modes were too quiet — picked something with retries, version history, and proper run history. If you want the shortlist we evaluated, happy to DM. Not pitching anything, just have notes.\n\nThe heartbeat alone will catch 80% of the silent failures. Do that this week.',
    replyStrategy:
      'Empathy first. Give one tactical fix they can do this week (heartbeat). Mention tool migration only as point 3 with a soft DM offer. Never name Acme in public.',
    shouldMentionProduct: false,
    warnings: [
      'High-engagement post — many eyes, including mods. Keep it advice-first.',
      'Do not link any product. Soft DM offer only.',
    ],
  },
  {
    id: 'op-4',
    subreddit: 'r/CustomerSuccess',
    postTitle: 'Detractor → CS playbook automation — what does your stack look like?',
    postSnippet:
      'CS lead at a Series B. We get ~40 NPS responses a week, ~6 detractors. Currently a CSM manually triages each one in a spreadsheet. We want to automate: detractor response → ticket → CSM alert → 7-day follow-up. What are people actually using? HubSpot workflows feel too clunky.',
    postUrl: 'https://reddit.com/r/CustomerSuccess/example/detractor',
    author: 'u/cs_lead_nb',
    upvotes: 64,
    comments: 19,
    postedAt: '2026-05-03T22:08:00Z',
    intent: 'asking_recommendation',
    intentStrength: 'high',
    leadPotential: 79,
    leadPotentialLabel: 'High',
    spamRisk: 30,
    spamRiskLabel: 'Low',
    productMention: 'mention_softly',
    whyRelevantBullets: [
      'CS leader = ICP persona',
      'Detractor → playbook = your use case',
      'HubSpot workflow ceiling reached',
    ],
    whyRelevant:
      'Detractor → CS playbook is one of your stated example use cases. Customer Success lead is in your ICP. Strong fit.',
    suggestedReply:
      'We built almost exactly this last quarter. The shape that worked:\n\nNPS response → if score ≤6 → create ticket in your CS tool, post in #cs-detractors Slack with the customer health context, assign to the named CSM (not the team), schedule a 7-day check-in task automatically.\n\nA few things we got wrong the first time:\n\n• Don\'t use a shared channel without @-mentioning the CSM by name. Detractor alerts get ignored in noisy channels.\n\n• The 7-day follow-up should be a calendar event, not a task. Tasks rot. Calendar events get done.\n\n• Tag detractor source on the ticket (onboarding, billing, product gap). Two months in, you\'ll want to slice this and HubSpot won\'t make it easy.\n\nFor tooling — HubSpot workflows really do hit a wall on this. We use a separate workflow tool that handles the multi-step + scheduling part and writes back to HubSpot. Happy to DM the setup, no pitch.',
    replyStrategy:
      'Lead with the actual workflow shape (most useful). Three concrete lessons from doing it. Tool mention is one line, soft DM at the end.',
    shouldMentionProduct: false,
    warnings: ['Comment-first subreddit — make sure you have karma here before posting top-level'],
  },
  {
    id: 'op-5',
    subreddit: 'r/salesforce',
    postTitle: 'Where do you draw the line between Flow, Apex, and an external workflow tool?',
    postSnippet:
      'Solo admin at a 90-person SaaS. Every time I push logic into Flow, it gets gnarly. Every time I push it to Apex, our one engineer hates me. We have Zapier for the simple stuff. Where is the line for you?',
    postUrl: 'https://reddit.com/r/salesforce/example/flow-line',
    author: 'u/sfdc_solo',
    upvotes: 102,
    comments: 41,
    postedAt: '2026-05-01T16:30:00Z',
    intent: 'asking_how_to_solve',
    intentStrength: 'medium',
    leadPotential: 73,
    leadPotentialLabel: 'Medium',
    spamRisk: 40,
    spamRiskLabel: 'Low',
    productMention: 'do_not_mention',
    whyRelevantBullets: [
      'Solo admin doubling as ops',
      'Where to put workflow logic',
      'Strict mods — educational only',
    ],
    whyRelevant:
      'Solo SFDC admin doubling as ops — exact persona. Direct question about where to put workflow logic. Educational answer fits, but be careful — sub is strict on promo.',
    suggestedReply:
      'My rule of thumb after running this for a few years:\n\n• Flow: anything single-object, deterministic, and unlikely to change. CRUD-y stuff.\n\n• Apex: anything Flow can\'t do, AND that an engineer is actually willing to own. The trap is admins writing "just a little Apex" that becomes the engineer\'s problem when it breaks at 2am.\n\n• External workflow tool: anything multi-system, anything that needs human approval, anything that should retry, and anything that should have an audit trail an auditor can read. SOC 2 evidence collection is the canonical one.\n\nThe non-obvious part: don\'t pick the tool first. Write the workflow on a whiteboard, including failure modes and who gets paged. Then the tool choice is usually obvious.',
    replyStrategy:
      'Pure educational answer. No tool name, no DM offer. r/salesforce is strict — comment karma play, build trust first, no promotional content at all.',
    shouldMentionProduct: false,
    warnings: [
      'This subreddit dislikes promotion — answer as helpful advice only',
      'Do not mention product or DM offer in this comment',
    ],
  },
  {
    id: 'op-6',
    subreddit: 'r/SaaS',
    postTitle: 'Best Zapier alternative in 2026? Going through the list and tired.',
    postSnippet:
      'Looking for a Zapier alternative. Tried Make (too DIY), Workato (too expensive), n8n (interesting but self-hosted is a no-go). Anyone using something that actually works for a 60-person SaaS?',
    postUrl: 'https://reddit.com/r/SaaS/example/zap-alt',
    author: 'u/saas_ops_22',
    upvotes: 56,
    comments: 33,
    postedAt: '2026-05-04T11:15:00Z',
    intent: 'looking_for_alternative',
    intentStrength: 'medium',
    leadPotential: 81,
    leadPotentialLabel: 'High',
    spamRisk: 62,
    spamRiskLabel: 'Medium',
    productMention: 'do_not_mention',
    whyRelevantBullets: [
      'Direct competitive comparison',
      'Vendor pile-on risk is high',
      'Differentiate by NOT pitching',
    ],
    whyRelevant:
      'Direct competitive comparison post. High intent, but high spam risk because every vendor in the space will pile on. Reply must feel like a practitioner, not a vendor.',
    suggestedReply:
      'Fair tour of the options. A few real-world notes from running ops at a 50-person SaaS that went through this:\n\n• Make → great until you have 30+ scenarios, then debugging gets brutal.\n\n• Workato → fine if you can swing $40k+ and have a full-time ops person to own it.\n\n• n8n → self-hosted is a real cost, but their cloud is fine for small stacks. The UI is showing its age.\n\n• Pipedream → underrated for code-first folks; overkill if your team isn\'t engineering-leaning.\n\nThe deciding criteria for us ended up being: (a) does it have version history, (b) can a non-engineer debug a failed run without me, (c) does it survive a SOC 2 audit. About half the tools in this space fail (b).\n\nWe ended up on a smaller workflow tool that nailed (b) for us — happy to DM the name, mods don\'t love vendor drops in this thread.',
    replyStrategy:
      'High spam risk thread — every vendor will name themselves. We do not. Give honest tradeoffs on the listed tools, then a soft DM offer. Lean into the criteria framing — that\'s memorable.',
    shouldMentionProduct: false,
    warnings: [
      'High spam risk — rewrite before posting if reply leans promotional',
      'Many vendors will pile on; differentiation is being the one who doesn\'t pitch',
    ],
  },
];
