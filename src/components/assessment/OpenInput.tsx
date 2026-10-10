export function OpenInput({
  value,
  onChange,
  placeholder,
  maxLength,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength: number;
  ariaLabel: string;
}) {
  return (
    <div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value.slice(0, maxLength))}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={4}
        aria-label={ariaLabel}
        className="w-full resize-y rounded-xl border border-brand-200 bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-brand-400"
      />
      <div className="mt-1 text-right text-xs text-ink-400">
        {value.length} / {maxLength}
      </div>
      <p className="mt-2 text-xs text-muted">这一题不计分，只会用在你的生涯故事里。</p>
    </div>
  );
}
