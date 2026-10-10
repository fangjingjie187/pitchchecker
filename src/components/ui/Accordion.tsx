import { useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export function Accordion({
  title,
  subtitle,
  defaultOpen = false,
  children,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={cn('overflow-hidden rounded-xl2 border border-brand-100 bg-paper', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-brand-50/60"
      >
        <span>
          <span className="block font-medium text-ink-900">{title}</span>
          {subtitle ? <span className="mt-0.5 block text-xs text-muted">{subtitle}</span> : null}
        </span>
        <span
          aria-hidden
          className={cn('shrink-0 text-brand-500 transition-transform', open && 'rotate-180')}
        >
          ▾
        </span>
      </button>
      {open ? <div className="border-t border-brand-100 px-4 py-4">{children}</div> : null}
    </div>
  );
}
