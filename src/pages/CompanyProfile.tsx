import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { CompanyForm } from '@/components/company/CompanyForm';

export function CompanyProfile() {
  return (
    <>
      <PageHeader
        eyebrow="Foundation"
        title="Company profile"
        description="The richer this is, the better every reply, post, and recommendation gets. Plain language beats marketing copy here."
        actions={
          <Link
            to="/onboarding"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-3.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            <Sparkles className="h-3.5 w-3.5" /> Use guided setup
          </Link>
        }
      />
      <CompanyForm />
    </>
  );
}
