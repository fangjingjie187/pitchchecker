import { HEX_ORDER, LOW_DIFFERENTIATION_THRESHOLD } from '@/config/scoring.config';
import type { DimensionScore, HollandCode, HollandProfile } from '@/types';

/**
 * Holland 衍生指数。
 *
 * 理论：Holland 六边形模型假定 R–I–A–S–E–C 按顺序排列成环，
 * 类型间的距离决定"一致性"（相邻最一致、相对最不一致）。
 *  · 一致性 Consistency ：前两位代码在六边形上的距离，越近越聚焦
 *  · 分化度 Differentiation：最高分与最低分之差，反映兴趣轮廓是否鲜明
 */

export function hexIndex(code: string): number {
  const index = HEX_ORDER.indexOf(code as never);
  return index < 0 ? 0 : index;
}

/** 六边形最短距离：1 相邻 / 2 相隔 / 3 相对 */
export function hexDistance(a: string, b: string): number {
  const i = hexIndex(a);
  const j = hexIndex(b);
  const raw = Math.abs(i - j);
  return Math.min(raw, 6 - raw);
}

/**
 * 一致性（0–100）：距离 1 → 100，2 → 50，3 → 0。
 * 距离 0（同型）不会出现，因为取的是前两位不同代码。
 */
export function consistencyScore(distance: number): number {
  if (distance <= 1) return 100;
  if (distance === 2) return 50;
  return 0;
}

/** 分化度（0–100）：最高分与最低分之差（输入已在 0–100 尺度） */
export function differentiationScore(max: number, min: number): number {
  return Math.round(Math.max(0, Math.min(100, max - min)) * 10) / 10;
}

/**
 * 是否为低分化（兴趣图谱均衡）。
 * 低分化时不展示大字三码，改为"均衡·探索期"引导语，避免过早定向。
 */
export function isLowDifferentiation(
  differentiation: number,
  threshold: number = LOW_DIFFERENTIATION_THRESHOLD,
): boolean {
  return differentiation < threshold;
}

/** Hero 区的展示决策：低分化走"均衡模式"，正常分化走"三码模式" */
export type HollandDisplay =
  | { mode: 'balanced'; code: string }
  | { mode: 'code'; code: string };

export function hollandDisplay(holland: HollandProfile): HollandDisplay {
  return {
    mode: isLowDifferentiation(holland.differentiation) ? 'balanced' : 'code',
    code: holland.code,
  };
}

export function buildHollandProfile(scores: DimensionScore[]): HollandProfile | null {
  if (scores.length < 3) return null;
  const sorted = [...scores].sort((a, b) => b.mean - a.mean);
  const code = `${sorted[0].key}${sorted[1].key}${sorted[2].key}`;
  const distance = hexDistance(sorted[0].key, sorted[1].key);
  const max = sorted[0].mean;
  const min = sorted[sorted.length - 1].mean;

  return {
    code,
    scores,
    consistency: consistencyScore(distance),
    differentiation: differentiationScore(max, min),
    primary: sorted[0].key as HollandCode,
    secondary: sorted[1].key as HollandCode,
  };
}
