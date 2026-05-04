import { Link } from 'react-router-dom';
import {
  Headphones,
  MessageSquareReply,
  PenLine,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Compass,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import { useFetch } from '@/lib/useFetch';
import { api } from '@/lib/api';
import { useCompanyProfile } from '@/store/companyStore';
import { intentLabel } from '@/utils/scoring';
import { PRINCIPLES } from '@/utils/copy';
import { IngestButton } from '@/components/ui/IngestButton';
import { REDDIT_LINK_PROPS, subredditUrl } from '@/lib/reddit';
import { ExternalLink } from 'lucide-react';

export function Dashboard() {
  const { profile, isComplete } = useCompanyProfile();
  const subs = useFetch(() => api.listSubreddits(), []);
  const ops = useFetch(() => api.listOpportunities(50), []);
  const drafts = useFetch(() => api.listDrafts(), []);
  const strategy = useFetch(() => api.getStrategy(), []);

  const subList = subs.data ?? [];
  const opsList = ops.data ?? [];
  const draftsList = drafts.data ?? [];
  const planList = strategy.data?.postingPlan ?? [];

  const topSr = [...subList].sort((a, b) => b.audienceFit - a.audienceFit).slice(0, 3);
  const topOps = [...opsList]
    .sort((a, b) => b.leadPotential - a.leadPotential)
    .slice(0, 6);
  const topPosts = draftsList.slice(0, 2);

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title={`Hey, ${profile.companyName || 'there'} 👋`}
        description="Your Reddit demand engine — listen first, respond second, post third."
        actions={
          <>
            <Link
              to="/company"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-3.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              {isComplete ? 'Edit profile' : 'Complete profile'}
            </Link>
            <IngestButton
              size="md"
              label="Ingest now"
              onDone={() => {
                void subs.refetch();
                void ops.refetch();
                void strategy.refetch();
              }}
            />
            <Link
              to="/respond"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
            >
              Find reply opportunities
            </Link>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Stat
          icon={<Headphones className="h-4 w-4" />}
          label="Subreddits surfaced"
          value={subList.length}
          to="/listen"
        />
        <Stat
          icon={<MessageSquareReply className="h-4 w-4" />}
          label="Reply opportunities"
          value={opsList.length}
          to="/respond"
          accent
        />
        <Stat
          icon={<PenLine className="h-4 w-4" />}
          label="Drafted posts"
          value={draftsList.length}
          to="/generate"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="inline-flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-brand-600" /> Highest-leverage actions this week
                </CardTitle>
                <CardDescription>
                  Reply first, post second. Comments earn the karma that lets posts land.
                </CardDescription>
              </div>
              <Link to="/strategy" className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline">
                Full strategy <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </CardHeader>
          <CardBody>
            {topOps.length === 0 ? (
              <p className="text-sm text-slate-500">
                No opportunities yet — add subreddits on the Listen page and run an ingest.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {topOps.map((op) => (
                  <li key={op.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                      <MessageSquareReply className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={subredditUrl(op.subreddit)}
                          {...REDDIT_LINK_PROPS}
                          className="text-xs font-semibold text-brand-700 hover:underline"
                        >
                          {op.subreddit}
                        </a>
                        <Badge tone="info">{intentLabel(op.intent)}</Badge>
                      </div>
                      <a
                        href={op.postUrl}
                        {...REDDIT_LINK_PROPS}
                        className="mt-0.5 block truncate text-sm font-medium text-slate-900 hover:text-brand-700 hover:underline"
                      >
                        {op.postTitle}
                        <ExternalLink className="ml-1 inline h-3 w-3 -translate-y-0.5 text-slate-400" />
                      </a>
                      <div className="mt-0.5 line-clamp-1 text-xs text-slate-500">{op.whyRelevant}</div>
                    </div>
                    <ScoreBadge label="Lead" score={op.leadPotential} />
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Compass className="h-4 w-4 text-brand-600" /> This week's plan
            </CardTitle>
          </CardHeader>
          <CardBody>
            {planList.length === 0 ? (
              <p className="text-sm text-slate-500">Generated after your first ingest.</p>
            ) : (
              <ol className="space-y-4 text-sm">
                {planList.map((p, i) => (
                  <li key={`${p.day}-${i}`} className="flex items-start gap-3">
                    <div className="flex h-6 w-10 shrink-0 items-center justify-center rounded-md bg-slate-100 text-[11px] font-semibold text-slate-700">
                      {p.day}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-slate-900">{p.action}</div>
                        {i === 0 && <Badge tone="brand">today</Badge>}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500">{p.why}</div>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="inline-flex items-center gap-2">
                <Headphones className="h-4 w-4 text-brand-600" /> Top subreddits to watch
              </CardTitle>
              <Link to="/listen" className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline">
                Listen <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </CardHeader>
          <CardBody>
            {topSr.length === 0 ? (
              <p className="text-sm text-slate-500">No analyzed subreddits yet.</p>
            ) : (
              <ul className="space-y-3">
                {topSr.map((s) => (
                  <li key={s.name} className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-100 p-3">
                    <div className="min-w-0 flex-1">
                      <a
                        href={subredditUrl(s.name)}
                        {...REDDIT_LINK_PROPS}
                        className="inline-flex items-center gap-1 font-medium text-slate-900 hover:text-brand-700 hover:underline"
                      >
                        {s.name}
                        <ExternalLink className="h-3 w-3 text-slate-400" />
                      </a>
                      <div className="line-clamp-2 text-xs text-slate-500">{s.whyRelevant}</div>
                    </div>
                    <ScoreBadge label="Fit" score={s.audienceFit} />
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-600" /> Drafts waiting on review
              </CardTitle>
              <Link to="/generate" className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline">
                Drafts <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </CardHeader>
          <CardBody>
            {topPosts.length === 0 ? (
              <p className="text-sm text-slate-500">No drafts yet — generate one from the Generate Posts page.</p>
            ) : (
              <ul className="space-y-3">
                {topPosts.map((p) => (
                  <li key={p.id} className="rounded-lg border border-slate-100 bg-slate-100 p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-brand-700">{p.subreddit}</span>
                      <Badge tone="brand">{p.postType.replace(/_/g, ' ')}</Badge>
                    </div>
                    <div className="mt-1 line-clamp-2 text-sm font-medium text-slate-900">{p.title}</div>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" /> What this product won't do
          </CardTitle>
          <CardDescription>
            We surface what's worth doing. We never auto-post, and we refuse to help with deceptive promotion.
          </CardDescription>
        </CardHeader>
        <CardBody>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="rounded-lg border border-slate-200 bg-slate-100 p-3">
                <div className="text-xs font-semibold text-slate-900">{p.title}</div>
                <div className="mt-0.5 text-xs text-slate-600">{p.body}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            <AlertTriangle className="h-3.5 w-3.5" />
            Anything that reads as a press release, fake testimonial, or astroturf will be flagged before you can post.
          </div>
        </CardBody>
      </Card>
    </>
  );
}

function Stat({
  icon,
  label,
  value,
  to,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  to: string;
  accent?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`group rounded-xl border px-4 py-3 text-center transition-colors ${
        accent
          ? 'border-brand-200 bg-brand-50/40 hover:bg-brand-50'
          : 'border-slate-200 bg-slate-100 hover:border-brand-200'
      }`}
    >
      <div className="relative flex items-center justify-center">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
          accent ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-700'
        }`}>
          {icon}
        </div>
        <ArrowUpRight className="absolute right-0 h-4 w-4 text-slate-400 transition-colors group-hover:text-brand-600" />
      </div>
      <div className="mt-2 text-xl font-semibold tabular-nums text-slate-900">{value}</div>
      <div className="mt-0.5 text-xs font-medium text-slate-500">{label}</div>
    </Link>
  );
}
