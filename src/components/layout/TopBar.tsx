import { Search, Bell, ShieldCheck } from 'lucide-react';
import { useCompanyProfile } from '@/store/companyStore';

export function TopBar() {
  const { profile, isComplete } = useCompanyProfile();
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-slate-200 bg-slate-100/90 px-6 backdrop-blur lg:px-8">
      <div className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search subreddits, posts, opportunities…"
          className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 lg:inline-flex">
          <ShieldCheck className="h-3.5 w-3.5" />
          Human-approval mode
        </div>
        <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-brand-500" />
        </button>
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-[11px] font-semibold uppercase text-brand-700">
            {(profile.companyName || 'A').slice(0, 2)}
          </div>
          <div className="hidden leading-tight md:block">
            <div className="text-xs font-semibold text-slate-900">
              {profile.companyName || 'Untitled company'}
            </div>
            <div className="text-[11px] text-slate-500">
              {isComplete ? 'profile complete' : 'profile incomplete'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
