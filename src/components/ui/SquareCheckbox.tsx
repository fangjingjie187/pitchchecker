import { cn } from '@/utils/cn';

/**
 * 方形勾选框（22px，rounded-sm）。
 * 未选中 = 灰边框空心；选中 = 品牌青蓝填充 + 白色对勾。
 * 整个标签行可点击切换；键盘空格可切换（原生 button + role=checkbox 语义）；
 * 焦点环完整（focus-visible 青色光环）。
 */
export function SquareCheckbox({
  checked,
  onChange,
  label,
  description,
  disabled,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}) {
  return (
    <label className={cn('flex items-start gap-3', disabled ? 'opacity-60' : 'cursor-pointer')}>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-sm border-2 transition-colors',
          'focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30',
          checked
            ? 'border-brand-500 bg-brand-500'
            : 'border-ink-400/50 bg-paper hover:border-brand-400',
        )}
      >
        {checked ? (
          <svg
            aria-hidden
            viewBox="0 0 16 16"
            className="h-3.5 w-3.5 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2.5 8.5l3.5 3.5 7.5-8" />
          </svg>
        ) : null}
      </button>
      <span className="text-sm">
        <span className="block font-medium text-ink-800">{label}</span>
        {description ? <span className="mt-0.5 block text-xs text-muted">{description}</span> : null}
      </span>
    </label>
  );
}
