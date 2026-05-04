# Reddit Demand Engine

Listen first. Respond second. Post third.

A web app that helps companies use Reddit as a listening engine, conversation engine, and demand-generation engine — without spamming communities.

The product never auto-posts. It surfaces what's worth doing, explains why, and warns when something looks promotional. A human always approves before anything goes out.

## What's in the box

Seven screens, all polished, all backed by realistic mock data for a workflow-automation company (Acme SaaS, a Zapier alternative for ops teams):

- **Dashboard** — overview, weekly plan, top opportunities, principles
- **Company Profile** — full ICP/positioning/tone/avoid-list form, persisted to `localStorage`
- **Listen** — recommended subreddits with audience fit, lead potential, promotion tolerance, recommended action, common questions, repeated pains, customer language, competitor mentions, content angles, rules
- **Respond to Posts** — ranked Reddit posts with detected intent, lead potential, spam risk, suggested reply, reply strategy, warnings; per-card Apply / Edit / Skip / Save / Regenerate
- **Generate Posts** — Reddit-native post drafts (lessons, research, checklist, question, case study, personal experience) with title, body, why-it-matters, why-it-fits, customer pain targeted, recommended CTA, and rewrite suggestions
- **Strategy** — weekly playbook: best subreddits, top pains, top reply opportunities, posting plan, weekly actions, karma/trust profile, things to avoid, content themes
- **Settings** — locked-on safety guardrails, connection slots (Reddit OAuth, Slack, Notion/Linear), LLM provider, storage notes

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173.

Other scripts: `npm run build` (production build), `npm run preview` (preview the prod build), `npm run typecheck`.

## Stack

- React 18 + TypeScript (strict)
- Vite
- Tailwind CSS (custom `brand` indigo palette)
- React Router v6
- lucide-react icons
- React Context + `localStorage` for company profile state

## Folder structure

```
src/
  components/
    layout/         Sidebar, TopBar, DashboardShell, PageHeader
    ui/             Card, Button, Badge, ScoreBadge, RiskIndicator, Input/Textarea, Tag
    company/        CompanyForm
    listen/         SubredditCard
    respond/        OpportunityCard
    generate/       GeneratedPostCard
    strategy/       KarmaPanel
  data/             mockCompanyProfile, mockSubreddits, mockRedditPosts,
                    mockGeneratedPosts, mockStrategy
  pages/            Dashboard, CompanyProfile, Listen, RespondToPosts,
                    GeneratePosts, Strategy, Settings
  store/            companyStore (Context + localStorage)
  types/            company, reddit, strategy
  utils/            scoring (color/label helpers), copy (classNames + principles)
  App.tsx, main.tsx, index.css
```

## Product principles (enforced in the UI)

1. Reddit users hate obvious marketing.
2. Every subreddit has different rules.
3. Listen before posting.
4. Commenting is usually safer than posting.
5. Helpful, specific, human replies beat sales copy.
6. The app should protect the company from looking spammy.
7. Never pretend to be a fake customer.
8. Never recommend deceptive promotion.
9. Always explain why an action is recommended.
10. Always require human approval before any external action.

These are surfaced as locked toggles on the Settings page, principle cards on the Dashboard, and per-action warning banners across Respond and Generate.

## What to wire up next

The frontend is intentionally a clean shell over a mock data layer. The natural connection points:

**Reddit data ingestion.** Replace `src/data/mockSubreddits.ts` and `src/data/mockRedditPosts.ts` with a server-side service that:
- Pulls posts from target subreddits via the Reddit API (PRAW or the official OAuth-secured endpoints)
- Runs intent classification (recommendation / pain / alternative / how-to)
- Scores each post against the company profile (audience fit, lead potential, spam risk)
- Caches results and exposes them via a typed API

**LLM generation.** Replace the static `suggestedReply`, `replyStrategy`, and post bodies with calls to your LLM of choice (Anthropic, OpenAI, etc.). The interfaces in `src/types/reddit.ts` are already shaped for this. The reply prompt should take the full company profile as context and follow the same "no fake customer, no astroturf, no banned phrases" rules already encoded in the warning banners.

**Real backend for the company profile.** Swap the body of `src/store/companyStore.tsx` from `localStorage` to fetch calls. The interface is already a Provider/hook, so consumers don't change.

**Authentication.** No auth in this prototype. Drop in Clerk, Auth.js, Supabase Auth, or your own — the `DashboardShell` is a single layout to wrap.

**Reddit OAuth (post on approval).** Two scopes: read-only for ingestion, submit-only for the Apply button on the Respond and Generate pages. Submit must always require an explicit human click — that's what the "Human approval enforced" badge in the top bar promises.

**Karma awareness.** The `KarmaPanel` and per-subreddit `karmaRequirement` fields are already there; wire them to the live karma of the connected account so the "Ready to post" / "Comment first" decision is data-driven.

**Notifications.** Slack/email notifications for high-fit opportunities — see the Connection slots on Settings.

## Notes for whoever extends this

- Every score (audience fit, lead potential, spam risk) is a 0–100 number rendered through `src/utils/scoring.ts`. Keep that scale.
- Every recommendation should answer five questions in the UI: **what we found, why it matters, what we recommend, risk level, user action.** All cards already follow this shape — match it for new ones.
- Anything that gets posted externally must go through a card with an explicit Apply button. No silent network calls.
- The product should refuse, not just warn, on requests that involve impersonation, fake reviews, or astroturfing.

## License

This is a hackathon scaffold. Use it however you like.
