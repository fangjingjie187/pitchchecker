import { useMemo } from 'react';
import { cn } from '@/utils/cn';

export interface LikertScaleProps {
  /** 1–5，未作答为 null */
  value: number | null;
  onChange: (value: number) => void;
  labels: string[];
  /** 题号，用于 aria-label */
  ariaLabel?: string;
  disabled?: boolean;
}

/**
 * 5 点量表。
 * 无障碍：容器为 radiogroup，支持键盘 1–5 直接作答，方向键切换选项。
 */
export function LikertScale({ value, onChange, labels, ariaLabel, disabled }: LikertScaleProps) {
  const points = useMemo(() => labels.map((label, index) => ({ value: index + 1, label })), [labels]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (/^[1-5]$/.test(event.key)) {
      event.preventDefault();
      onChange(Number(event.key));
      return;
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      onChange(Math.min(5, (value ?? 0) + 1));
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      onChange(Math.max(1, (value ?? 6) - 1));
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel ?? '请选择符合程度'}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={disabled ? undefined : handleKeyDown}
      className={cn('flex flex-col gap-2 outline-none', disabled && 'pointer-events-none opacity-60')}
    >
      <div className="flex gap-2">
        {points.map((point) => {
          const active = value === point.value;
          return (
            <button
              key={point.value}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={`${point.value} ${point.label}`}
              disabled={disabled}
              onClick={() => onChange(point.value)}
              className={cn(
                'flex-1 rounded-xl border px-2 py-3 text-sm font-medium transition-all',
                'focus-visible:ring-2 focus-visible:ring-brand-400',
                active
                  ? 'border-brand-500 bg-brand-500 text-white shadow-card'
                  : 'border-brand-200 bg-paper text-ink-600 hover:border-brand-300 hover:bg-brand-50',
              )}
            >
              <span className="block text-center text-base font-semibold">{point.value}</span>
            </button>
          );
        })}
      </div>
      <div className="flex justify-between px-1 text-xs text-muted">
        {points.map((point) => (
          <span key={point.value} className={cn('flex-1 text-center', value === point.value && 'text-brand-700')}>
            {point.label}
          </span>
        ))}
      </div>
      <p className="mt-1 text-xs text-ink-400">小提示：也可以直接按键盘上的 1–5 键作答。</p>
    </div>
  );
}
