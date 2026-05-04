import { NavLink } from 'react-router-dom';
import { Headphones, MessageSquareReply, PenLine } from 'lucide-react';
import { classNames } from '@/utils/copy';

const TABS = [
  { to: '/listen', label: 'Listen', icon: Headphones },
  { to: '/respond', label: 'Respond to Posts', icon: MessageSquareReply },
  { to: '/generate', label: 'Generate Posts', icon: PenLine },
];

export function StreamTabs() {
  return (
    <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-100 px-2">
      {TABS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            classNames(
              'relative flex items-center gap-2 rounded-t-lg px-3.5 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'text-brand-700 after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:rounded-full after:bg-brand-600'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
            )
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </div>
  );
}
