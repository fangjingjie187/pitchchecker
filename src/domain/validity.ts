import { ITEMS } from '@/data/items';
import { VALIDITY } from '@/config/scoring.config';
import type { AnswerValue, AssessmentItem, ModuleKey, ValidityFlag } from '@/types';
import { countAnswered, scoreNumericItem } from './scale';

/**
 * 作答有效性检验（前端可检验的部分）。
 *
 * 边界：这些只是"作答过程是否可疑"的提示，**不能据此判定作答无效**。
 * 所有结果以 ValidityFlag 形式进入报告的"结果可信度提示"，措辞必须温和。
 *
 * 阈值全部来自 config/scoring.config.ts 的 VALIDITY，可按需调整。
 */

function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

export interface ValidityInput {
  module: ModuleKey;
  answers: Record<string, AnswerValue>;
  /** 累计作答时长（ms） */
  durationMs?: number;
  items?: AssessmentItem[];
}

export function checkValidity({ module, answers, durationMs, items }: ValidityInput): ValidityFlag[] {
  const list = items ?? ITEMS[module] ?? [];
  const flags: ValidityFlag[] = [];
  const scoredItems = list.filter((item) => !item.excludeFromScoring);
  const answered = countAnswered(list, answers);

  // 1) 未完成
  if (answered < scoredItems.length) {
    flags.push({
      code: 'incomplete',
      level: 'warn',
      message: `还有 ${scoredItems.length - answered} 题没作答，结果会不够完整。`,
    });
  }

  // 2) 作答过快
  if (durationMs && durationMs > 0 && answered > 0) {
    const perItem = durationMs / answered;
    if (perItem < VALIDITY.minMsPerItem) {
      flags.push({
        code: 'tooFast',
        level: 'warn',
        message: '这一模块的作答速度偏快，可以回想一下是不是有些题目是随手选的。',
      });
    }
  }

  // 3) 直线作答（同一取值占比过高）
  const numericValues: number[] = [];
  for (const item of scoredItems) {
    const raw = answers[item.id];
    if (raw === undefined) continue;
    const score = scoreNumericItem(item, raw);
    if (score !== null) numericValues.push(score);
  }
  if (numericValues.length >= VALIDITY.minItemsForStraightLine) {
    const frequency = new Map<number, number>();
    for (const value of numericValues) {
      frequency.set(value, (frequency.get(value) ?? 0) + 1);
    }
    const maxRatio = Math.max(...frequency.values()) / numericValues.length;
    if (maxRatio >= VALIDITY.straightLineRatio) {
      flags.push({
        code: 'straightLine',
        level: 'warn',
        message: '很多题选了同一个选项，结果可能没有完全反映你的真实想法。',
      });
    }
  }

  // 4) 配对题不一致
  for (const item of list) {
    if (!item.pairId) continue;
    const a = answers[item.id];
    const b = answers[item.pairId];
    if (typeof a !== 'number' || typeof b !== 'number') continue;
    // 反向题方向不同，比较前先归一化到同一方向
    const scoreA = scoreNumericItem(item, a);
    const target = list.find((entry) => entry.id === item.pairId);
    const scoreB = target ? scoreNumericItem(target, b) : null;
    if (scoreA === null || scoreB === null) continue;
    const diffOnFivePoint = Math.abs(scoreA - scoreB) / 25; // 0–100 尺度下每档 25 分
    if (diffOnFivePoint > VALIDITY.pairMaxDiff) {
      flags.push({
        code: 'inconsistentPair',
        level: 'warn',
        message: `第 ${item.id} 与 ${item.pairId} 是同一件事的两种说法，你的两次作答差得比较多。`,
      });
    }
  }

  // 5) 区分度不足
  if (numericValues.length >= VALIDITY.minItemsForVariance) {
    if (stdDev(numericValues) < VALIDITY.minStdDev) {
      flags.push({
        code: 'lowVariance',
        level: 'warn',
        message: '各题之间的差异很小，可以尝试重新看一遍题干再确认。',
      });
    }
  }

  return flags;
}

/** 综合可信度描述（用于报告顶部提示） */
export function describeConfidence(flags: ValidityFlag[]): string {
  if (flags.length === 0) {
    return '作答完整，未见明显的作答模式异常，结果可作为参考。';
  }
  const warns = flags.filter((flag) => flag.level === 'warn');
  const errors = flags.filter((flag) => flag.level === 'error');
  if (errors.length > 0) {
    return '有部分题目未作答或作答模式异常，结果仅供参考，建议补全或重测后再看。';
  }
  return `有 ${warns.length} 处提示需要留意：${warns.map((flag) => flag.message).join(' ')}`;
}
