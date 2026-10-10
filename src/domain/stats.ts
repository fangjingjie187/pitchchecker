import { getNorm } from '@/data/norms';
import { LEVEL_CUTS } from '@/config/scoring.config';
import { getDimensionName } from '@/data/dimensionNames';
import type { DimensionScore, GradeBand, ModuleKey, ScoreLevel } from '@/types';
import type { DimensionStat } from './scale';

/** 标准正态累积分布（Abramowitz & Stegun 26.2.17 近似） */
export function normalCdf(z: number): number {
  const abs = Math.abs(z);
  const t = 1 / (1 + 0.2316419 * abs);
  const density = 0.3989422804014327 * Math.exp((-abs * abs) / 2);
  const poly =
    t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  const p = 1 - density * poly;
  return z >= 0 ? p : 1 - p;
}

/**
 * 参考常模百分等级（0–100）。
 * ⚠ 使用演示参考常模，不是标准化全国常模；报告中一律表述为"相对参考区间"。
 */
export function percentileOf(value: number, mean: number, sd: number): number {
  if (sd <= 0) return value >= mean ? 50 : 0;
  const z = (value - mean) / sd;
  const p = normalCdf(z) * 100;
  return Math.round(Math.min(99.5, Math.max(0.5, p)) * 10) / 10;
}

export function levelFromPercentile(percentile: number): ScoreLevel {
  if (percentile >= LEVEL_CUTS.high) return 'high';
  if (percentile < LEVEL_CUTS.low) return 'low';
  return 'mid';
}

/** 把维度统计合成为带常模百分等级与等级的 DimensionScore[] */
export function buildDimensionScores(
  module: ModuleKey,
  stats: DimensionStat[],
  gradeBand: GradeBand,
): DimensionScore[] {
  return stats.map((stat) => {
    const norm = getNorm(module, stat.key, gradeBand);
    const percentile = percentileOf(stat.mean, norm.mean, norm.sd);
    return {
      key: stat.key,
      name: getDimensionName(module, stat.key),
      raw: Math.round(stat.mean * stat.count),
      mean: stat.mean,
      percentile,
      level: levelFromPercentile(percentile),
    };
  });
}
