import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

/** 轻量文字提示：hover / focus 显示（CSS 实现，无定位库依赖） */
export function Tooltip({
  content,
  children,
  className,
}: {
  content: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn('group relative inline-flex', className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 rounded-lg',
          'bg-ink-900 px-3 py-2 text-xs leading-relaxed text-white opacity-0 shadow-card transition-opacity',
          'group-hover:opacity-100 group-focus-within:opacity-100',
        )}
      >
        {content}
      </span>
    </span>
  );
}
