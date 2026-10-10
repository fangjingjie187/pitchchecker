import { describe, expect, it } from 'vitest';
import { buildQuadrants, primaryZone } from './quadrant';
import type { DimensionStat } from './scale';

const stat = (key: string, mean: number): DimensionStat => ({ key, mean, count: 1 });

describe('兴趣 × 能力四象限', () => {
  it('按 50 中位划分四个区域，且只呈现 5 对（C 型不纳入能力框架）', () => {
    const interest = [
      stat('R', 70),
      stat('I', 30),
      stat('A', 70),
      stat('S', 30),
      stat('E', 20),
      stat('C', 80),
    ];
    const ability = [
      stat('handson', 80),
      stat('logic', 20),
      stat('creative', 20),
      stat('interpersonal', 80),
      stat('verbal', 30),
      stat('spatial', 90),
    ];
    const quadrants = buildQuadrants(interest, ability);
    expect(quadrants).toHaveLength(5);
    expect(quadrants.some((q) => q.key === 'C')).toBe(false);

    const byKey = Object.fromEntries(quadrants.map((q) => [q.key, q]));
    // R 高兴趣高能力 → strength；I 低低 → explore；A 高兴趣低能力 → growth；S 低兴趣高能力 → potential
    expect(byKey.R.zone).toBe('strength');
    expect(byKey.I.zone).toBe('explore');
    expect(byKey.A.zone).toBe('growth');
    expect(byKey.S.zone).toBe('potential');
  });

  it('primaryZone 优先返回成长区（兴趣驱动，干预价值最高）', () => {
    const quadrants = buildQuadrants(
      [stat('R', 70), stat('I', 80), stat('A', 90), stat('S', 40), stat('E', 40)],
      [stat('handson', 30), stat('logic', 90), stat('creative', 20), stat('interpersonal', 30), stat('verbal', 30)],
    );
    const primary = primaryZone(quadrants)!;
    expect(primary.zone).toBe('growth');
  });
});
