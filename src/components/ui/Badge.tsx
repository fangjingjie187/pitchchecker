import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export type BadgeTone = 'brand' | 'coral' | 'neutral' | 'success' | 'warning';

const TONES: Record<BadgeTone, string> = {
  brand: 'bg-brand-50 text-brand-700 border-brand-200',
  coral: 'bg-coral-50 text-coral-700 border-coral-200',
  neutral: 'bg-mist-deep text-ink-600 border-brand-100',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
};

export function Badge({
  tone = 'brand',
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
