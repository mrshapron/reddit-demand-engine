import { CompanyProfileSummary } from '@/components/company/CompanyProfileSummary';
import { StreamTabs } from './StreamTabs';
import { RightRail } from './RightRail';

interface StreamLayoutProps {
  /** Title rendered above the list (e.g. "Reddit opportunities found for you"). */
  heading?: React.ReactNode;
  /** Sub-heading rendered under the title. */
  subheading?: React.ReactNode;
  /** Content above the right rail (the main feed). */
  children: React.ReactNode;
  /** Right-aligned controls beside the heading (filters, refresh etc.). */
  toolbar?: React.ReactNode;
}

export function StreamLayout({ heading, subheading, children, toolbar }: StreamLayoutProps) {
  return (
    <div className="flex gap-6">
      <div className="min-w-0 flex-1 space-y-4">
        <CompanyProfileSummary />

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-card">
          <StreamTabs />
          <div className="px-5 py-5">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                {heading && <h2 className="text-base font-semibold text-slate-900">{heading}</h2>}
                {subheading && <p className="mt-0.5 text-sm text-slate-500">{subheading}</p>}
              </div>
              {toolbar && <div className="flex items-center gap-2">{toolbar}</div>}
            </div>
            <div className="space-y-4">{children}</div>
          </div>
        </div>
      </div>

      <RightRail />
    </div>
  );
}
