import { ProgressBar } from '@/components/ui/Progress';
import { cn } from '@/utils/cn';

export function ItemProgress({
  current,
  total,
  className,
}: {
  /** 当前题序（从 1 开始） */
  current: number;
  total: number;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <span className="shrink-0 text-sm font-medium text-brand-700">
        第 {current} / {total} 题
      </span>
      <ProgressBar value={current} max={total} className="flex-1" />
    </div>
  );
}
