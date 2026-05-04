import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Headphones,
  MessageSquareReply,
  PenLine,
  Compass,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { classNames } from '@/utils/copy';
import { mockWorkspace } from '@/data/mockWorkspace';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: false },
  { to: '/company', label: 'Company Profile', icon: Building2 },
  { to: '/listen', label: 'Listen', icon: Headphones },
  { to: '/respond', label: 'Respond to Posts', icon: MessageSquareReply },
  { to: '/generate', label: 'Generate Posts', icon: PenLine },
  { to: '/strategy', label: 'Strategy', icon: Compass },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const w = mockWorkspace;
  const usedPct = Math.min(100, Math.round((w.creditsUsed / w.creditsTotal) * 100));

  return (
    <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-slate-100 md:flex md:flex-col">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5">
        <img
          src="/app-icon.png"
          alt="Enso AI"
          className="h-10 w-10 shrink-0 rounded-full bg-slate-200 object-cover shadow-sm"
        />
        <div className="leading-tight">
          <div className="text-base font-semibold text-slate-900">Enso AI</div>
          <div className="text-[11px] font-medium text-slate-500">Reddit Demand Engine</div>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              classNames(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              )
            }
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="space-y-3 border-t border-slate-100 p-4">
        <button className="flex w-full items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-left transition-colors hover:bg-slate-50">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-600 text-[11px] font-semibold uppercase text-white">
            {w.workspaceShort}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-sm font-semibold text-slate-900">{w.workspaceName}</div>
            <div className="text-[11px] text-slate-500">Workspace</div>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>

        <div className="rounded-lg bg-slate-50 px-3 py-3">
          <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Plan</div>
          <div className="mt-0.5 text-sm font-semibold text-slate-900">{w.planName}</div>
          <div className="text-[11px] text-slate-500">Resets in {w.resetsInDays} days</div>
          <div className="mt-2 h-1.5 rounded-full bg-slate-200">
            <div
              className="h-1.5 rounded-full bg-brand-500"
              style={{ width: `${usedPct}%` }}
            />
          </div>
          <div className="mt-1 text-[11px] tabular-nums text-slate-600">
            {w.creditsUsed.toLocaleString()} / {w.creditsTotal.toLocaleString()} credits used
          </div>
          <button className="mt-2 w-full rounded-md border border-slate-200 bg-slate-100 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
            View billing
          </button>
        </div>
      </div>
    </aside>
  );
}
