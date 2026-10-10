import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/Progress';
import type { ModuleMeta } from '@/types';
import { cn } from '@/utils/cn';

export interface ModuleCardProps {
  meta: ModuleMeta;
  answered: number;
  completed: boolean;
  onStart: () => void;
  /** 清空后重新开始作答 */
  onRestart?: () => void;
}

export function ModuleCard({ meta, answered, completed, onStart, onRestart }: ModuleCardProps) {
  const total = meta.itemCount;
  const started = answered > 0;

  return (
    <div
      className={cn(
        'surface flex flex-col p-5 transition-shadow',
        completed ? 'border-brand-200' : 'hover:shadow-card-hover',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-ink-900">{meta.title}</h3>
          <p className="mt-0.5 text-xs text-muted">{meta.subtitle}</p>
        </div>
        <Badge tone={meta.priority === 'P0' ? 'brand' : meta.priority === 'P1' ? 'coral' : 'neutral'}>
          {meta.priority}
        </Badge>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-ink-600">{meta.theory}</p>

      <div className="mt-4">
        <ProgressBar
          value={answered}
          max={total}
          label={completed ? '已完成' : started ? '进行中' : '未开始'}
          tone={completed ? 'brand' : 'coral'}
        />
      </div>

      <p className="mt-2 text-[11px] text-ink-400">
        {total} 题 · 约 {meta.estimatedMinutes} 分钟
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button size="sm" variant={completed ? 'outline' : 'primary'} onClick={onStart}>
          {completed ? '查看小结' : started ? '继续作答' : '开始'}
        </Button>
        {started && onRestart ? (
          <Button size="sm" variant="ghost" onClick={onRestart}>
            {completed ? '重新作答' : '清空重做'}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
