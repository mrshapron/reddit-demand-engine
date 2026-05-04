import { Trophy, ShieldCheck, AlertCircle, Target, BookOpen, Lightbulb, Info, ArrowRight, Check } from 'lucide-react';
import { mockRightRail } from '@/data/mockWorkspace';
import type { RightRailData } from '@/types/workspace';

export function RightRail({ data = mockRightRail }: { data?: RightRailData }) {
  return (
    <aside className="hidden w-72 shrink-0 space-y-4 lg:block">
      <BestSubreddits items={data.bestSubreddits} />
      <KarmaCard data={data.karma} />
      <SpamRiskCard data={data.spamRisk} />
      <NextActionCard data={data.nextAction} />
      <CommunityRulesCard rules={data.communityRules} />
      <ProTipCard title={data.proTip.title} body={data.proTip.body} />
    </aside>
  );
}

function RailCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-100 shadow-card">
      <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
          {icon}
          {title}
        </div>
        <Info className="h-3.5 w-3.5 text-slate-300" />
      </div>
      <div className="px-4 pb-4 pt-1">{children}</div>
    </div>
  );
}

function BestSubreddits({ items }: { items: RightRailData['bestSubreddits'] }) {
  return (
    <RailCard title="Best subreddits this week" icon={<Trophy className="h-4 w-4 text-amber-500" />}>
      <ul className="space-y-2.5">
        {items.map((s) => (
          <li key={s.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-semibold text-white">
                r/
              </div>
              <span className="text-sm text-slate-800">{s.name}</span>
            </div>
            <span className="text-sm font-medium tabular-nums text-emerald-600">{s.score}</span>
          </li>
        ))}
      </ul>
      <button className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline">
        View full report <ArrowRight className="h-3 w-3" />
      </button>
    </RailCard>
  );
}

function KarmaCard({ data }: { data: RightRailData['karma'] }) {
  return (
    <RailCard title="Karma & Trust" icon={<ShieldCheck className="h-4 w-4 text-brand-600" />}>
      <ul className="space-y-2 text-sm">
        <Row label="Post Karma" value={data.postKarma.toLocaleString()} />
        <Row label="Comment Karma" value={data.commentKarma.toLocaleString()} />
        <Row label="Subreddit Eligibility" value={<span className="text-emerald-600">{data.subredditEligibility}</span>} />
        <Row label="Status" value={<span className="text-amber-600">{data.status}</span>} />
      </ul>
      <button className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline">
        View details <ArrowRight className="h-3 w-3" />
      </button>
    </RailCard>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <li className="flex items-center justify-between">
      <span className="text-slate-600">{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </li>
  );
}

function SpamRiskCard({ data }: { data: RightRailData['spamRisk'] }) {
  const tone =
    data.level === 'Low' ? 'text-emerald-700' : data.level === 'Medium' ? 'text-amber-700' : 'text-rose-700';
  const fill =
    data.level === 'Low' ? 'bg-emerald-500' : data.level === 'Medium' ? 'bg-amber-500' : 'bg-rose-500';
  return (
    <RailCard title="Spam Risk" icon={<AlertCircle className="h-4 w-4 text-emerald-600" />}>
      <div className="flex items-baseline justify-between">
        <span className={`text-sm font-semibold ${tone}`}>{data.level} risk</span>
        <span className="text-sm tabular-nums text-slate-500">
          <span className="font-medium text-slate-900">{data.score}</span>/100
        </span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-slate-100">
        <div className={`h-1.5 rounded-full ${fill}`} style={{ width: `${data.score}%` }} />
      </div>
      <p className="mt-2.5 text-xs leading-relaxed text-slate-600">{data.message}</p>
    </RailCard>
  );
}

function NextActionCard({ data }: { data: RightRailData['nextAction'] }) {
  const pct = Math.round((data.progressDone / data.progressTotal) * 100);
  return (
    <RailCard title="Recommended next action" icon={<Target className="h-4 w-4 text-brand-600" />}>
      <div className="rounded-lg border border-brand-200 bg-brand-50 px-3 py-2.5">
        <p className="text-sm font-medium leading-relaxed text-brand-800">{data.title}</p>
      </div>
      <p className="mt-2.5 text-xs text-slate-600">{data.caption}</p>
      <div className="mt-2 flex items-center gap-2">
        <div className="h-1.5 flex-1 rounded-full bg-slate-100">
          <div className="h-1.5 rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[11px] font-medium tabular-nums text-slate-500">
          {data.progressDone}/{data.progressTotal}
        </span>
      </div>
    </RailCard>
  );
}

function CommunityRulesCard({ rules }: { rules: RightRailData['communityRules'] }) {
  return (
    <RailCard title="Community rules reminder" icon={<BookOpen className="h-4 w-4 text-brand-600" />}>
      <ul className="space-y-2 text-sm">
        {rules.map((r) => (
          <li key={r.text} className="flex items-center gap-2">
            <span className={`flex h-4 w-4 items-center justify-center rounded-full ${r.ok ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
              <Check className="h-3 w-3" />
            </span>
            <span className="text-slate-700">{r.text}</span>
          </li>
        ))}
      </ul>
      <button className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline">
        View Reddit Content Policy <ArrowRight className="h-3 w-3" />
      </button>
    </RailCard>
  );
}

function ProTipCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-brand-200 bg-brand-50/60 px-4 py-3.5">
      <div className="inline-flex items-center gap-2 text-sm font-semibold text-brand-800">
        <Lightbulb className="h-4 w-4 text-amber-500" />
        {title}
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-brand-900/80">{body}</p>
      <button className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:underline">
        Learn best practices <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  );
}
