import { LikertScale } from '@/components/ui/LikertScale';
import { Slider } from '@/components/ui/Slider';
import { ForcedChoiceGroup } from './ForcedChoiceGroup';
import { OpenInput } from './OpenInput';
import type { AnswerValue, AssessmentItem } from '@/types';

export interface QuestionCardProps {
  item: AssessmentItem;
  /** 作答指导语：兴趣问"喜欢程度"，能力问"有多大信心" */
  prompt: string;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
  /** 量表端点锚定词 */
  scaleLabels: string[];
  index: number;
  total: number;
}

/**
 * 单题卡片。
 * 题型由 item.type 决定：likert5 / slider100 / forcedChoice / open。
 * 键盘可达性：量表支持 1–5 直接作答，迫选与开放题使用原生控件。
 */
export function QuestionCard({
  item,
  prompt,
  value,
  onChange,
  scaleLabels,
  index,
  total,
}: QuestionCardProps) {
  return (
    <div className="surface p-5 sm:p-7">
      <div className="mb-1 text-xs font-medium text-brand-600">
        第 {index + 1} 题 / 共 {total} 题
      </div>

      <h2 className="text-lg font-semibold leading-relaxed text-ink-900 sm:text-xl">
        {item.text}
      </h2>
      {item.subText ? <p className="mt-2 text-sm text-muted">{item.subText}</p> : null}

      <div className="mt-6">
        {/* F5：指导语按题型分发。题目级 prompt（如开放题）覆盖模块级 prompt */}
        <p className="mb-3 text-sm font-medium text-ink-700">{item.prompt ?? prompt}</p>

        {item.type === 'likert5' ? (
          <LikertScale
            value={typeof value === 'number' ? value : null}
            onChange={onChange}
            labels={scaleLabels}
            ariaLabel={`第 ${index + 1} 题：${item.text}`}
          />
        ) : null}

        {item.type === 'slider100' ? (
          <Slider
            value={typeof value === 'number' ? value : null}
            onChange={onChange}
            min={0}
            max={100}
            step={10}
            labels={[scaleLabels[0] ?? '0', scaleLabels[scaleLabels.length - 1] ?? '100']}
            ariaLabel={`第 ${index + 1} 题：${item.text}`}
          />
        ) : null}

        {item.type === 'forcedChoice' ? (
          <ForcedChoiceGroup
            options={item.options}
            value={typeof value === 'string' ? value : null}
            onChange={onChange}
            ariaLabel={`第 ${index + 1} 题：${item.text}`}
          />
        ) : null}

        {item.type === 'open' ? (
          <OpenInput
            value={typeof value === 'string' ? value : ''}
            onChange={onChange}
            placeholder={item.placeholder}
            maxLength={item.maxLength ?? 200}
            ariaLabel={`第 ${index + 1} 题：${item.text}`}
          />
        ) : null}
      </div>
    </div>
  );
}
