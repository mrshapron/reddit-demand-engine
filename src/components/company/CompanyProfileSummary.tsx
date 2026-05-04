import { Building2, Pencil, Globe, Sparkles, Target, ListChecks, Users, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCompanyProfile } from '@/store/companyStore';

export function CompanyProfileSummary() {
  const { profile } = useCompanyProfile();

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-100 shadow-card">
      <div className="flex items-center justify-between gap-3 px-5 pb-3 pt-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <div className="text-base font-semibold text-slate-900">Company Profile Summary</div>
            <div className="text-xs text-slate-500">Your business context that powers Enso AI recommendations.</div>
          </div>
        </div>
        <Link
          to="/company"
          className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-brand-600 px-3 text-xs font-semibold text-white shadow-sm hover:bg-brand-700"
        >
          Save Profile
        </Link>
      </div>

      <div className="grid gap-4 px-5 pb-5 pt-1 sm:grid-cols-2 lg:grid-cols-3">
        <Field icon={<Building2 className="h-3.5 w-3.5" />} label="Company name">
          {profile.companyName || '—'}
        </Field>
        <Field icon={<Globe className="h-3.5 w-3.5" />} label="Website" mono>
          {profile.website?.replace(/^https?:\/\//, '') || '—'}
        </Field>
        <Field icon={<Sparkles className="h-3.5 w-3.5" />} label="What we do">
          Workflow automation for B2B teams
        </Field>
        <Field icon={<Users className="h-3.5 w-3.5" />} label="Ideal customers">
          SaaS ops teams, RevOps leaders
        </Field>
        <Field icon={<Target className="h-3.5 w-3.5" />} label="Problem solved">
          Manual approvals, repetitive work, tool sprawl
        </Field>
        <Field icon={<ListChecks className="h-3.5 w-3.5" />} label="Competitors">
          Zapier, Make, Workato
        </Field>
        <Field icon={<MessageCircle className="h-3.5 w-3.5" />} label="Tone">
          Helpful, human, not salesy
        </Field>
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  children,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/40 px-3 py-2.5">
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
          <span className="text-slate-400">{icon}</span>
          {label}
        </div>
        <Link to="/company" className="text-slate-300 hover:text-slate-500" aria-label={`Edit ${label}`}>
          <Pencil className="h-3 w-3" />
        </Link>
      </div>
      <div className={`mt-1 truncate text-sm ${mono ? 'font-mono text-brand-700' : 'text-slate-900'}`}>
        {children}
      </div>
    </div>
  );
}
