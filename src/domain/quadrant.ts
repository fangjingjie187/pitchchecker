import { QUADRANT_MID, QUADRANT_PAIRS } from '@/config/scoring.config';
import type { QuadrantItem } from '@/types';
import type { DimensionStat } from './scale';

/**
 * 兴趣 × 能力四象限。
 *
 * 意义：兴趣高但能力信心不足的"成长区"是干预价值最高的地方（SCCT：兴趣驱动效能提升）；
 * 能力高但兴趣不高的"潜力区"可作为可迁移技能支撑其他方向。
 * 兴趣与能力的配对关系见 QUADRANT_PAIRS（启发式映射，可调整）。
 */
export function buildQuadrants(
  interestStats: DimensionStat[],
  abilityStats: DimensionStat[],
): QuadrantItem[] {
  const interestMap = new Map(interestStats.map((stat) => [stat.key, stat.mean]));
  const abilityMap = new Map(abilityStats.map((stat) => [stat.key, stat.mean]));

  return QUADRANT_PAIRS.map((pair) => {
    const x = interestMap.get(pair.interest) ?? 0;
    const y = abilityMap.get(pair.ability) ?? 0;
    const highX = x >= QUADRANT_MID;
    const highY = y >= QUADRANT_MID;
    const zone: QuadrantItem['zone'] =
      highX && highY ? 'strength' : highX && !highY ? 'growth' : !highX && highY ? 'potential' : 'explore';
    return { key: pair.key, label: pair.label, x: Math.round(x), y: Math.round(y), zone };
  });
}

/** 四象限中最值得投入的区域：优先成长区，其次优势区 */
export function primaryZone(items: QuadrantItem[]): QuadrantItem | null {
  const growth = items.filter((item) => item.zone === 'growth');
  if (growth.length > 0) {
    return growth.sort((a, b) => b.x - a.x)[0];
  }
  const strength = items.filter((item) => item.zone === 'strength');
  if (strength.length > 0) {
    return strength.sort((a, b) => b.x + b.y - (a.x + a.y))[0];
  }
  return items.sort((a, b) => b.x + b.y - (a.x + a.y))[0] ?? null;
}
