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

### 1. Install everything (frontend + backend)

```bash
npm install
npm run server:install
```

### 2. Configure API keys

```bash
cp server/.env.example server/.env
# then edit server/.env and fill in:
#   OPENAI_API_KEY            (required)
#   REDDIT_CLIENT_ID/SECRET   (recommended — avoids 403 from public Reddit endpoints)
#   REDDIT_USERNAME/PASSWORD  (recommended — same reason)
#   REDDIT_USER_AGENT         (any descriptive string, ideally with your reddit handle)
```

How to get Reddit credentials:
1. Go to https://www.reddit.com/prefs/apps
2. Click "are you a developer? create an app..."
3. Pick **script**, set the redirect URI to `http://localhost`, save
4. Use the **client ID** (under the app name) and **client secret**

### 3. Run frontend + backend together

```bash
npm run dev:all
```

That starts:
- Frontend at http://localhost:5173
- Backend  at http://localhost:3001 (proxied via `/api` from the frontend)

You can also run them separately: `npm run dev` (frontend) and `npm run server` (backend).

### 4. First-time setup inside the app

1. Open http://localhost:5173
2. Go to **Company Profile** and fill it out — this is the context every LLM call uses.
3. Go to **Listen** and click **Add subreddit** to add a few target subreddits.
4. Click **Ingest now** in the toolbar. The backend will:
   - Pull recent posts from each subreddit
   - Generate a strategic insight per subreddit (LLM)
   - Triage every new post against your profile (LLM)
   - For high-signal posts, draft a suggested reply (LLM)
5. Switch to **Respond to Posts**, **Strategy**, and **Generate Posts** to use the analyzed data.

### Other scripts

| Command | What it does |
|---|---|
| `npm run dev` | Frontend only |
| `npm run server` | Backend only (with watch) |
| `npm run server:ingest -- r/SaaS r/RevOps` | Run an ingest from the CLI (no UI) |
| `npm run typecheck` | Typecheck frontend |
| `npm run server:typecheck` | Typecheck backend |
| `npm run build` | Production build (frontend) |

## Stack

**Frontend**
- React 18 + TypeScript (strict)
- Vite (with `/api` proxy → backend)
- Tailwind CSS (custom `brand` indigo palette)
- React Router v6
- lucide-react icons

**Backend** (`server/`)
- Node 20+ + Express + TypeScript (strict, ESM, `tsx` for dev)
- SQLite via `better-sqlite3` (file at `server/data/app.db`)
- OpenAI SDK with `response_format: json_schema` for structured outputs
- Reddit access:
  - **Read**: official OAuth (`grant_type=password`, "script" app) when credentials are set,
    falls back to public `https://www.reddit.com/r/<sub>/<sort>.json` — be aware these
    are heavily rate-limited and may 403 from datacenter IPs.
  - **Write/posting**: not implemented yet — read-only first pass.
- Zod for env + request validation
- Single-file, no auth, no users (single-tenant prototype)

## Folder structure

```
src/                      # frontend
  components/
    layout/               Sidebar, TopBar, DashboardShell, PageHeader
    ui/                   Card, Button, Badge, ScoreBadge, RiskIndicator,
                          Input/Textarea, Tag, StateMessage, IngestButton
    company/              CompanyForm
    listen/               SubredditCard
    respond/              OpportunityCard
    generate/             GeneratedPostCard
    strategy/             KarmaPanel
  data/                   mock data — kept for reference, no longer imported by pages
  pages/                  Dashboard, CompanyProfile, Listen, RespondToPosts,
                          GeneratePosts, Strategy, Settings
  store/                  companyStore (Context + API + localStorage cache)
  types/                  company, reddit, strategy
  utils/                  scoring + copy helpers
  lib/                    api (typed fetch client), useFetch (tiny hook)
  App.tsx, main.tsx, index.css

server/                   # backend
  src/
    db/                   better-sqlite3 client + schema + migrations + repos
    reddit/               Reddit client (OAuth or public JSON fallback)
    llm/                  OpenAI client + structured-output prompts
                          (subredditInsight, opportunity, postDraft, strategy)
    pipeline/             ingestion orchestrator (scrape → triage → reply → store)
    routes/               Express routers (/company, /subreddits, /opportunities,
                          /drafts, /strategy, /ingest)
    cli/                  manual ingest entrypoint
    types.ts              shared with frontend (kept in sync by hand)
    env.ts                zod-validated env
    index.ts              Express bootstrap
  data/                   sqlite db lives here (gitignored)
  .env.example            all configurable knobs
```

## API surface

All endpoints live under `/api` and return JSON.

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Server status + which models are configured + reddit OAuth state |
| GET | `/company` | Get company profile |
| PUT | `/company` | Save company profile (partial allowed) |
| GET | `/subreddits` | List analyzed subreddits with their insight |
| GET | `/subreddits/configured` | Just the list of names being watched |
| POST | `/subreddits` | `{ name }` — start watching a subreddit |
| PATCH | `/subreddits/:name` | `{ enabled }` |
| DELETE | `/subreddits/:name` | Stop watching |
| GET | `/subreddits/search?q=…` | Reddit's subreddit search (proxied) |
| GET | `/opportunities` | Ranked reply opportunities |
| PATCH | `/opportunities/:id/status` | `{ status: pending\|applied\|skipped\|saved }` |
| POST | `/opportunities/:id/regenerate` | Re-triage + re-draft the reply |
| GET | `/drafts` | List generated post drafts |
| POST | `/drafts` | `{ subreddit, postType? }` — generate a new draft |
| PATCH | `/drafts/:id` | `{ approved }` |
| GET | `/strategy?refresh=1` | LLM-generated weekly playbook (cached 30min) |
| POST | `/ingest` | Kick off an ingest (returns 202 immediately) |
| POST | `/ingest/sync` | Run an ingest and wait for the summary |
| GET | `/ingest/status` | Latest ingest run + whether one is running |

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

## What's still on the to-do list

The current backend is **read-only** — it ingests, analyzes, drafts, but never posts back to Reddit. The natural next steps:

**Reddit posting (write scope).** Add a separate OAuth flow with the `submit` and `vote` scopes for the actual posting account. Wire the `Apply` buttons in Respond and Generate to call a new `POST /api/reddit/submit` endpoint. Always require explicit human click — that's what the "Human approval enforced" badge in the top bar promises.

**Karma awareness from live account.** The `KarmaPanel` and per-subreddit `karmaRequirement` fields exist; wire them to the connected account's actual karma so "Ready to post" / "Comment first" is data-driven.

**Scheduled ingestion.** Right now ingestion is on-demand. Add a cron-like scheduler (node-cron) so the database stays warm without manual triggers.

**Auth / multi-tenancy.** This is a single-user prototype; the company profile lives in row id=1. To support multiple workspaces, add Clerk/Supabase Auth and a `workspace_id` foreign key on every table.

**Notifications.** Slack/email for high-fit opportunities — see the connection slots on Settings.

**Better Reddit access.** When the public JSON endpoint 403s and you don't have script-app credentials, the backend currently surfaces the error. A future option: integrate a paid scraping API (Apify / SocialGrep) as a third tier.

## Notes for whoever extends this

- Every score (audience fit, lead potential, spam risk) is a 0–100 number rendered through `src/utils/scoring.ts`. Keep that scale.
- Every recommendation should answer five questions in the UI: **what we found, why it matters, what we recommend, risk level, user action.** All cards already follow this shape — match it for new ones.
- Anything that gets posted externally must go through a card with an explicit Apply button. No silent network calls.
- The product should refuse, not just warn, on requests that involve impersonation, fake reviews, or astroturfing.

## License

This is a hackathon scaffold. Use it however you like.
