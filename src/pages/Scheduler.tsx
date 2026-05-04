import { CalendarDays, Clock, Send, ShieldCheck } from 'lucide-react';
import { StreamLayout } from '@/components/layout/StreamLayout';
import { ScheduledPostCard } from '@/components/scheduler/ScheduledPostCard';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { useScheduledPosts } from '@/store/schedulerStore';

export function Scheduler() {
  const scheduledPosts = useScheduledPosts();
  const scheduledCount = scheduledPosts.filter((post) => post.status === 'scheduled').length;
  const reviewCount = scheduledPosts.filter((post) => post.status === 'needs_final_review').length;
  const apiReadyCount = scheduledPosts.filter((post) => post.status === 'ready_for_reddit_api').length;

  return (
    <StreamLayout
      heading="Scheduler — future posts queue"
      subheading="Plan approved Reddit posts across future time slots so you do not upload everything together. Today this is a local queue; next step is Reddit API auto-publishing."
      toolbar={<Badge tone="brand">{scheduledPosts.length} posts in queue</Badge>}
    >
      <div className="mb-5 grid gap-3 md:grid-cols-4">
        <Metric icon={CalendarDays} label="Queue size" value={scheduledPosts.length} />
        <Metric icon={Clock} label="Scheduled" value={scheduledCount} />
        <Metric icon={ShieldCheck} label="Needs review" value={reviewCount} />
        <Metric icon={Send} label="API-ready later" value={apiReadyCount} />
      </div>

      <Card className="mb-5">
        <CardHeader>
          <CardTitle>How the scheduler works</CardTitle>
          <p className="mt-1 text-sm text-slate-600">
            When you approve or schedule a generated post, it appears here with a planned time,
            risk checks, safety notes, and final review status.
          </p>
        </CardHeader>
        <CardBody>
          <div className="grid gap-3 md:grid-cols-3">
            <Step label="1. Approve" body="A human approves the Reddit-native draft." />
            <Step label="2. Schedule" body="The post is placed into a future publishing slot." />
            <Step label="3. Connect Reddit" body="Later, OAuth + API publishing can post it automatically." />
          </div>
        </CardBody>
      </Card>

      <div className="space-y-4">
        {scheduledPosts.map((post) => (
          <ScheduledPostCard key={post.id} post={post} />
        ))}
      </div>
    </StreamLayout>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-100 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{value}</div>
        </div>
        <div className="rounded-lg bg-brand-50 p-2 text-brand-700">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

function Step({ label, body }: { label: string; body: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
      <div className="text-sm font-semibold text-slate-900">{label}</div>
      <div className="mt-1 text-sm text-slate-600">{body}</div>
    </div>
  );
}
