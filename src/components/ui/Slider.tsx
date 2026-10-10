import type { CSSProperties } from 'react';
import { useId } from 'react';
import { cn } from '@/utils/cn';

export interface SliderProps {
  /** 当前值；未作答为 null */
  value: number | null;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** 两端文字锚定 */
  labels?: [string, string];
  ariaLabel?: string;
  disabled?: boolean;
  /** 未作答时滑块停在中间位置，视觉上表示"未选择" */
  showValue?: boolean;
}

/**
 * 0–100、10 分一档的信心度滑条（Bandura 自我效能量表规范）。
 *
 * D2 等高法重写：
 *  · 原生 <input type="range">，track 与 thumb 等高（均 20px）→ 圆心天然贴轨道中心线，
 *    无任何 margin / calc 修正（样式见 index.css 的 .cc-slider）；
 *  · 已填充进度由 JS 按值更新 --slider-pct，track 用居中 linear-gradient 绘制细线；
 *  · 键盘方向键 / Home / End 为原生行为，无障碍属性照旧。
 */
export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 10,
  labels,
  ariaLabel,
  disabled,
  showValue = true,
}: SliderProps) {
  const id = useId();
  const answered = value !== null;
  const display = answered ? value : Math.round((min + max) / 2);
  /** 已填充进度百分比；未作答不显示填充 */
  const pct = answered ? ((value! - min) / (max - min)) * 100 : 0;

  const sliderStyle = {
    '--slider-pct': `${pct}%`,
  } as CSSProperties;

  return (
    <div className={cn('w-full', disabled && 'pointer-events-none opacity-60')}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-muted">{labels?.[0] ?? min}</span>
        {showValue ? (
          <span
            className={cn(
              'rounded-full px-3 py-1 text-sm font-semibold',
              answered ? 'bg-brand-50 text-brand-700' : 'bg-mist-deep text-ink-400',
            )}
          >
            {answered ? `${value}` : '未选择'}
          </span>
        ) : null}
        <span className="text-xs text-muted">{labels?.[1] ?? max}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={display}
        disabled={disabled}
        aria-label={ariaLabel ?? '请拖动选择'}
        aria-valuetext={answered ? `${value}` : '未选择'}
        data-unanswered={answered ? undefined : 'true'}
        onChange={(event) => onChange(Number(event.target.value))}
        className="cc-slider"
        style={sliderStyle}
      />
      <div className="mt-2 flex justify-between px-1 text-[11px] text-ink-400">
        {[0, 25, 50, 75, 100].map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>
    </div>
  );
}
