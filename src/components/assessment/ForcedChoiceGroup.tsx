import { cn } from '@/utils/cn';

/** 三选一迫选题：用原生 radio 语义，天然支持键盘 */
export function ForcedChoiceGroup({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { id: string; label: string }[];
  value: string | null;
  onChange: (value: string) => void;
  ariaLabel: string;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="flex flex-col gap-2">
      {options.map((option) => {
        const active = value === option.id;
        return (
          <label
            key={option.id}
            className={cn(
              'flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors',
              active
                ? 'border-brand-500 bg-brand-50'
                : 'border-brand-200 bg-paper hover:border-brand-300 hover:bg-brand-50/60',
            )}
          >
            <input
              type="radio"
              name={ariaLabel}
              checked={active}
              onChange={() => onChange(option.id)}
              className="h-4 w-4 accent-brand-600"
            />
            <span className={cn('text-sm', active ? 'font-medium text-brand-800' : 'text-ink-700')}>
              {option.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}
