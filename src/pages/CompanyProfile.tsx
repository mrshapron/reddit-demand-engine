import { PageHeader } from '@/components/layout/PageHeader';
import { CompanyForm } from '@/components/company/CompanyForm';

export function CompanyProfile() {
  return (
    <>
      <PageHeader
        eyebrow="Foundation"
        title="Company profile"
        description="The richer this is, the better every reply, post, and recommendation gets. Plain language beats marketing copy here."
      />
      <CompanyForm />
    </>
  );
}
