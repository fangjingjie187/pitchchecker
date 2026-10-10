import { cn } from '@/utils/cn';

export function ProgressBar({
  value,
  max = 100,
  label,
  className,
  tone = 'brand',
}: {
  /** 当前值 */
  value: number;
  max?: number;
  label?: string;
  className?: string;
  tone?: 'brand' | 'coral';
}) {
  const ratio = max === 0 ? 0 : Math.min(1, Math.max(0, value / max));
  return (
    <div className={cn('w-full', className)}>
      {label ? (
        <div className="mb-1 flex items-center justify-between text-xs text-muted">
          <span>{label}</span>
          <span>{Math.round(ratio * 100)}%</span>
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuenow={Math.round(ratio * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? '进度'}
        className="h-2 w-full overflow-hidden rounded-full bg-brand-100"
      >
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-500',
            tone === 'brand' ? 'bg-brand-500' : 'bg-coral-500',
          )}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </div>
  );
}

export function ProgressRing({
  value,
  size = 72,
  stroke = 7,
  children,
}: {
  /** 0–100 */
  value: number;
  size?: number;
  stroke?: number;
  children?: React.ReactNode;
}) {
  const ratio = Math.min(1, Math.max(0, value / 100));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`进度 ${Math.round(ratio * 100)}%`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#DCEEF8" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#0EA5E9"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - ratio)}
          style={{ transition: 'stroke-dashoffset .6s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-brand-700">
        {children ?? `${Math.round(ratio * 100)}%`}
      </div>
    </div>
  );
}
