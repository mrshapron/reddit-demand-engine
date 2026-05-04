import { Award } from 'lucide-react';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { KarmaProfile } from '@/types/strategy';

const TRUST_TONE: Record<KarmaProfile['trustLevel'], 'neutral' | 'caution' | 'brand' | 'good'> = {
  new: 'caution',
  building: 'brand',
  trusted: 'good',
  established: 'good',
};

export function KarmaPanel({ karma }: { karma: KarmaProfile }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="inline-flex items-center gap-2">
            <Award className="h-4 w-4 text-brand-600" /> Account trust
          </CardTitle>
          <Badge tone={TRUST_TONE[karma.trustLevel]}>{karma.trustLevel}</Badge>
        </div>
      </CardHeader>
      <CardBody className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Total karma" value={karma.total} />
        <Stat label="Post karma" value={karma.postKarma} />
        <Stat label="Comment karma" value={karma.commentKarma} />
        <Stat label="Account age" value={`${karma.accountAgeMonths}mo`} />
      </CardBody>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-100 p-3">
      <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-0.5 text-lg font-semibold tabular-nums text-slate-900">{value}</div>
    </div>
  );
}
