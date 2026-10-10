import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface TabItem {
  key: string;
  label: ReactNode;
  badge?: ReactNode;
}

export function Tabs({
  items,
  active,
  onChange,
  className,
}: {
  items: TabItem[];
  active: string;
  onChange: (key: string) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn('flex gap-1 overflow-x-auto rounded-xl bg-mist-deep p-1', className)}
    >
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          role="tab"
          aria-selected={active === item.key}
          onClick={() => onChange(item.key)}
          className={cn(
            'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            active === item.key
              ? 'bg-paper text-brand-700 shadow-card'
              : 'text-ink-500 hover:text-brand-700',
          )}
        >
          {item.label}
          {item.badge}
        </button>
      ))}
    </div>
  );
}
