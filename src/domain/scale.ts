import { ITEMS } from '@/data/items';
import { VALUE_SCORING, ABILITY_SLIDER } from '@/config/scoring.config';
import type { AnswerValue, AssessmentItem, GradeBand, ModuleKey } from '@/types';

/**
 * 通用计分：把原始作答换算成各维度 0–100 的分数。
 *
 * 换算规则：
 *  · likert5   ：(作答值 − 1) / 4 × 100；反向题先翻转（6 − x）
 *  · slider100 ：作答值本身即 0–100；反向题翻转（100 − x）
 *                内部量化为 1–10 时用 toInternalScale（Bandura 自我效能标尺）
 *  · forcedChoice：按"被选中次数 / 该维度在迫选题中出现次数 × 100"计分（见 VALUE_SCORING）
 *  · open      ：一律不计分（excludeFromScoring）
 */

export interface DimensionStat {
  key: string;
  /** 0–100 */
  mean: number;
  /** 参与计分的条目数（迫选题按出现次数计） */
  count: number;
}

/** 0–100 滑条 → 内部 1–10 量化（0→1，100→10，保持 11 级分辨率） */
export function toInternalScale(value: number, max = ABILITY_SLIDER.max): number {
  return 1 + (value / max) * 9;
}

/** 单题分值（0–100）；返回 null 表示该题不参与计分或作答无效 */
export function scoreNumericItem(item: AssessmentItem, value: AnswerValue): number | null {
  if (item.excludeFromScoring) return null;
  if (typeof value !== 'number') return null;
  if (item.type === 'likert5') {
    const flipped = item.reverse ? 6 - value : value;
    if (flipped < 1 || flipped > 5) return null;
    return ((flipped - 1) / 4) * 100;
  }
  if (item.type === 'slider100') {
    const flipped = item.reverse ? 100 - value : value;
    if (flipped < 0 || flipped > 100) return null;
    return flipped;
  }
  return null;
}

/** 迫选题：返回该选项所属维度 */
export function resolveForcedChoiceDimension(
  item: AssessmentItem,
  optionId: AnswerValue,
): string | null {
  if (item.type !== 'forcedChoice') return null;
  const option = item.options.find((entry) => entry.id === optionId);
  return option?.dimension ?? null;
}

interface Accumulator {
  sum: number;
  count: number;
}

export function computeDimensionStats(
  module: ModuleKey,
  answers: Record<string, AnswerValue>,
  gradeBand?: GradeBand,
): DimensionStat[] {
  const items = gradeBand
    ? ITEMS[module].filter((item) => !item.gradeBands || item.gradeBands.includes(gradeBand))
    : ITEMS[module];

  const rating: Record<string, Accumulator> = {};
  const fcAppear: Record<string, number> = {};
  const fcHit: Record<string, number> = {};

  const bump = (map: Record<string, Accumulator>, key: string, value: number) => {
    map[key] = map[key] ?? { sum: 0, count: 0 };
    map[key].sum += value;
    map[key].count += 1;
  };

  for (const item of items) {
    if (item.type === 'forcedChoice') {
      for (const option of item.options) {
        fcAppear[option.dimension] = (fcAppear[option.dimension] ?? 0) + 1;
      }
      const raw = answers[item.id];
      if (raw === undefined) continue;
      const dimension = resolveForcedChoiceDimension(item, raw);
      if (dimension) fcHit[dimension] = (fcHit[dimension] ?? 0) + 1;
      continue;
    }

    const raw = answers[item.id];
    if (raw === undefined) continue;
    const score = scoreNumericItem(item, raw);
    if (score === null) continue;
    bump(rating, item.dimension, score);
  }

  const keys = new Set<string>([
    ...Object.keys(rating),
    ...Object.keys(fcAppear),
  ]);

  const stats: DimensionStat[] = [];
  for (const key of keys) {
    const r = rating[key];
    const appear = fcAppear[key] ?? 0;
    const f = appear > 0 ? ((fcHit[key] ?? 0) / appear) * 100 : null;
    const p = r && r.count > 0 ? r.sum / r.count : null;

    let mean: number;
    let count: number;
    if (p !== null && f !== null) {
      mean = p * VALUE_SCORING.ratingWeight + f * VALUE_SCORING.forcedChoiceWeight;
      count = r!.count + appear;
    } else if (p !== null) {
      mean = p;
      count = r!.count;
    } else if (f !== null) {
      mean = f;
      count = appear;
    } else {
      continue;
    }
    stats.push({ key, mean: Math.round(mean * 10) / 10, count });
  }

  return stats.sort((a, b) => b.mean - a.mean);
}

/** 取分数最高 / 最低的维度 */
export function topDimension(stats: DimensionStat[]): DimensionStat | null {
  return stats.length > 0 ? stats[0] : null;
}

export function lowestDimension(stats: DimensionStat[]): DimensionStat | null {
  return stats.length > 0 ? stats[stats.length - 1] : null;
}

/**
 * 已作答的条目数（用于判断模块是否完整、以及有效性检验）。
 * 开放题允许留空：只要出现过作答动作（key 存在）即视为已处理。
 */
export function countAnswered(items: AssessmentItem[], answers: Record<string, AnswerValue>): number {
  return items.filter((item) => {
    const raw = answers[item.id];
    if (raw === undefined) return false;
    if (item.type === 'open') return true;
    if (typeof raw === 'string') return raw.trim().length > 0;
    if (Array.isArray(raw)) return raw.length > 0;
    return true;
  }).length;
}

/** 单题是否已作答（决定「下一题」是否可用） */
export function isAnswered(item: AssessmentItem, raw: AnswerValue | undefined): boolean {
  if (raw === undefined) return false;
  if (item.type === 'open') return true;
  if (typeof raw === 'string') return raw.trim().length > 0;
  if (Array.isArray(raw)) return raw.length > 0;
  return true;
}
