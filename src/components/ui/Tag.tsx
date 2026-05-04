import { classNames } from '@/utils/copy';

export function Tag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={classNames(
        'inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700',
        className,
      )}
    >
      {children}
    </span>
  );
}
