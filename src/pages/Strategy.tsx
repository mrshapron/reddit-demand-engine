import {
  Compass,
  TrendingUp,
  AlertTriangle,
  Target,
  ListChecks,
  XCircle,
  Lightbulb,
  Calendar,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ScoreBadge, ScoreBar } from '@/components/ui/ScoreBadge';
import { KarmaPanel } from '@/components/strategy/KarmaPanel';
import { mockStrategy } from '@/data/mockStrategy';

const PRIORITY_TONE: Record<'low' | 'medium' | 'high', 'neutral' | 'caution' | 'warn'> = {
  low: 'neutral',
  medium: 'caution',
  high: 'warn',
};

const TYPE_TONE: Record<'comment' | 'post' | 'lurk' | 'karma' | 'avoid', 'good' | 'brand' | 'caution' | 'info' | 'warn'> = {
  comment: 'good',
  post: 'brand',
  lurk: 'caution',
  karma: 'info',
  avoid: 'warn',
};

export function Strategy() {
  const s = mockStrategy;
  return (
    <>
      <PageHeader
        eyebrow="Strategy"
        title="Your Reddit playbook this week"
        description="A weekly view of where to listen, where to comment, where to post — and what to skip."
        actions={
          <Badge tone="brand">
            <Compass className="h-3 w-3" /> Updated for this week
          </Badge>
        }
      />

      <KarmaPanel karma={s.karma} />

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-brand-600" /> Posting plan
            </CardTitle>
            <CardDescription>Comments build karma; karma earns the right to post.</CardDescription>
          </CardHeader>
          <CardBody>
            <ol className="space-y-3">
              {s.postingPlan.map((p) => (
                <li key={p.day} className="flex items-start gap-3">
                  <div className="flex h-7 w-12 shrink-0 items-center justify-center rounded-md bg-brand-50 text-xs font-semibold text-brand-700">
                    {p.day}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-slate-900">{p.action}</div>
                    <div className="text-xs text-slate-500">{p.why}</div>
                  </div>
                  {p.subreddit && <Badge tone="brand">{p.subreddit}</Badge>}
                </li>
              ))}
            </ol>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-brand-600" /> Best subreddits this week
            </CardTitle>
          </CardHeader>
          <CardBody>
            <ul className="space-y-3">
              {s.bestSubreddits.map((b) => (
                <li key={b.name} className="rounded-lg border border-slate-100 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900">{b.name}</span>
                    <ScoreBadge label="" score={b.score} compact />
                  </div>
                  <ScoreBar score={b.score} className="mt-2" />
                  <p className="mt-1.5 text-xs text-slate-600">{b.reason}</p>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Target className="h-4 w-4 text-rose-500" /> Top customer pains
            </CardTitle>
            <CardDescription>Pain frequency across watched subreddits this week.</CardDescription>
          </CardHeader>
          <CardBody>
            <ul className="space-y-2.5">
              {s.topPains.map((p) => (
                <li key={p.pain} className="rounded-lg border border-slate-100 bg-slate-100 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium text-slate-900">{p.pain}</div>
                    <Badge tone="warn">{p.mentions} mentions</Badge>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {p.subreddits.map((r) => (
                      <span
                        key={r}
                        className="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-700"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-emerald-600" /> Top reply opportunities
            </CardTitle>
          </CardHeader>
          <CardBody>
            <ul className="space-y-2.5">
              {s.topReplyOpportunities.map((o) => (
                <li
                  key={o.id}
                  className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-100 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-brand-700">{o.subreddit}</div>
                    <div className="line-clamp-2 text-sm font-medium text-slate-900">
                      {o.postTitle}
                    </div>
                  </div>
                  <ScoreBadge label="Lead" score={o.leadPotential} />
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-brand-600" /> Suggested weekly actions
            </CardTitle>
          </CardHeader>
          <CardBody>
            <ul className="space-y-2.5">
              {s.weeklyActions.map((a) => (
                <li key={a.id} className="rounded-lg border border-slate-100 bg-slate-100 p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-slate-900">{a.title}</span>
                    <Badge tone={TYPE_TONE[a.type]}>{a.type}</Badge>
                    <Badge tone={PRIORITY_TONE[a.priority]}>{a.priority}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{a.description}</p>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <XCircle className="h-4 w-4 text-rose-500" /> What to avoid this week
            </CardTitle>
          </CardHeader>
          <CardBody>
            <ul className="space-y-2 text-sm">
              {s.thingsToAvoid.map((t) => (
                <li
                  key={t}
                  className="flex items-start gap-2 rounded-lg border border-rose-100 bg-rose-50/40 p-2.5 text-rose-800"
                >
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" /> Content themes to test
          </CardTitle>
          <CardDescription>What to lean into next, with the reasoning behind it.</CardDescription>
        </CardHeader>
        <CardBody>
          <div className="grid gap-3 md:grid-cols-2">
            {s.contentThemes.map((t) => (
              <div key={t.theme} className="rounded-lg border border-slate-200 bg-slate-100 p-3">
                <div className="font-medium text-slate-900">{t.theme}</div>
                <div className="mt-0.5 text-sm text-slate-600">{t.reason}</div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </>
  );
}
