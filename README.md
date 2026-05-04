# Reddit Demand Engine

**Reddit Demand Engine helps companies find real customer conversations on Reddit, reply helpfully, and plan Reddit-native posts without looking spammy.**

The product is built around one simple rule:

> Listen first. Respond second. Post third.

It helps a company use Reddit as a listening engine, conversation engine, and demand generation engine while respecting subreddit rules and community norms.

## The Problem

Reddit has high-intent customer pain, but companies usually fail there because they:

- Post overly promotional content.
- Do not understand subreddit rules.
- Reply with generic AI or marketing language.
- Miss real buying signals inside conversations.
- Damage trust by acting like advertisers instead of community members.

## The Solution

Reddit Demand Engine helps companies participate in Reddit more responsibly:

**Listening Engine**  
Find relevant subreddits, customer pain points, common questions, competitor mentions, and community rules.

**Conversation Engine**  
Find posts worth replying to and generate helpful, human, non-salesy replies with risk warnings.

**Demand Engine**  
Generate educational Reddit-native posts and schedule them safely over time instead of posting everything at once.

## Main Product Flow

### Dashboard

Quick overview of the company Reddit strategy:

- Subreddits surfaced
- Reply opportunities
- Drafted posts
- Highest-leverage actions
- Weekly plan
- Drafts waiting for review

### Company Profile

The source of truth for all recommendations.

It defines:

- Company
- Product
- Ideal customer profile
- Customer pains
- Competitors
- Tone
- Positioning
- Things to avoid

### Listen

Understand communities before engaging.

The Listen page shows:

- Relevant subreddits
- Audience fit
- Lead potential
- Spam and promotion risk
- Common questions
- Repeated pains
- Competitor mentions
- Customer language
- Community rules
- Recommended action, such as lurk first, comment first, or safe for educational posts

### Respond to Posts

Find Reddit posts worth replying to.

Each opportunity explains:

- What the post is about
- Why it is relevant
- Detected intent
- Lead potential
- Spam risk
- Suggested reply
- Reply strategy
- Whether the product should be mentioned

The app does not auto-post. A human must review and approve every action.

### Generate Posts

Create Reddit-native post drafts.

Good formats include:

- Lessons learned
- Research summaries
- Checklists
- Honest questions
- Case studies
- Personal experience posts

The app avoids direct sales posts like "check out my product."

### Scheduler

Plan approved posts for future publishing.

The scheduler shows:

- Future post queue
- Planned posting time
- Subreddit
- Post type
- Spam risk
- Promotion tolerance
- CTA guidance
- Safety notes

Today this is a local scheduling queue. The next step is connecting it to Reddit OAuth and posting APIs so approved scheduled posts can publish automatically.

### Strategy

A weekly Reddit playbook.

It shows:

- Best subreddits this week
- Top customer pains
- Top reply opportunities
- Suggested weekly actions
- What to avoid
- Content themes to test
- Karma and trust recommendations

## Safety Principles

The product is designed to protect the company from looking spammy.

- Listen before posting.
- Commenting is usually safer than posting.
- Never auto-post without approval.
- Never pretend to be a fake customer.
- Avoid direct promotion unless appropriate.
- Always explain why something is recommended.
- Warn the user when something may look promotional.
- Respect subreddit rules and norms.

## Presentation Cheat Sheet

A short PDF cheat sheet is available at:

```text
docs/Reddit-Demand-Engine-Cheat-Sheet.pdf
```

To regenerate it:

```bash
node scripts/generate-cheat-sheet.mjs
```

## Run Locally

Install dependencies:

```bash
npm install
npm run server:install
```

Configure backend credentials:

```bash
cp server/.env.example server/.env
```

Then edit `server/.env` and add:

```text
OPENAI_API_KEY
REDDIT_CLIENT_ID
REDDIT_CLIENT_SECRET
REDDIT_USERNAME
REDDIT_PASSWORD
REDDIT_USER_AGENT
```

Run frontend and backend together:

```bash
npm run dev:all
```

Local URLs:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:3001
```

You can also run them separately:

```bash
npm run dev
npm run server
```

## Useful Commands

```bash
npm run typecheck
npm run build
npm run server:typecheck
npm run server:ingest -- r/SaaS r/RevOps
```

## Tech Stack

**Frontend**

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- lucide-react

**Backend**

- Node.js
- Express
- TypeScript
- SQLite
- OpenAI structured outputs
- Reddit read API integration

## Next Steps

- Deploy the Claude API on Vercel and set `ANTHROPIC_API_KEY` there.
- Add `VITE_CLAUDE_API_BASE_URL` as a GitHub repo variable so GitHub Pages can call the Vercel API.
- Connect full Reddit OAuth for posting permissions.
- Store scheduled posts and tracking data in the backend database.
- Add automated scheduled publishing after human approval.
- Track real post comments, replies, engagement, and karma.
- Add team authentication and multi-workspace support.
- Add notifications for high-intent reply opportunities.

## Claude API For The Hosted Demo

GitHub Pages is static and cannot safely store an AI API key. Claude generation is handled through Vercel serverless functions in:

```text
api/claude/generate-draft.js
api/claude/regenerate-reply.js
```

Set this secret in Vercel:

```text
ANTHROPIC_API_KEY
```

Then set this GitHub repository variable:

```text
VITE_CLAUDE_API_BASE_URL=https://your-vercel-project.vercel.app
```

Without `VITE_CLAUDE_API_BASE_URL`, the GitHub Pages app falls back to local mock generation.

## Core Message

This is not a generic AI writing tool.

It is a Reddit-native demand generation assistant built around trust, community rules, human approval, and useful participation.
