import { describe, expect, it } from 'vitest';
import {
  buildHollandProfile,
  consistencyScore,
  differentiationScore,
  hexDistance,
  hexIndex,
  hollandDisplay,
  isLowDifferentiation,
} from './holland';
import { LOW_DIFFERENTIATION_THRESHOLD } from '@/config/scoring.config';
import type { DimensionScore } from '@/types';

describe('Holland 六边形与衍生指数', () => {
  it('六边形距离：相邻 1、相隔 2、相对 3', () => {
    expect(hexIndex('R')).toBe(0);
    expect(hexDistance('R', 'I')).toBe(1);
    expect(hexDistance('R', 'A')).toBe(2);
    expect(hexDistance('R', 'S')).toBe(3);
    expect(hexDistance('S', 'R')).toBe(3);
    expect(hexDistance('E', 'C')).toBe(1);
  });

  it('一致性：距离 1→100、2→50、3→0', () => {
    expect(consistencyScore(1)).toBe(100);
    expect(consistencyScore(2)).toBe(50);
    expect(consistencyScore(3)).toBe(0);
  });

  it('分化度 = 最高分 − 最低分', () => {
    expect(differentiationScore(80, 30)).toBe(50);
    expect(differentiationScore(90, 90)).toBe(0);
  });

  it('三字母码取前三并计算一致性/分化度', () => {
    const make = (key: string, mean: number): DimensionScore => ({
      key,
      name: key,
      raw: 0,
      mean,
      percentile: 50,
      level: 'mid',
    });
    const scores = [
      make('S', 90),
      make('I', 80),
      make('A', 70),
      make('R', 40),
      make('E', 30),
      make('C', 20),
    ];
    const profile = buildHollandProfile(scores)!;
    expect(profile.code).toBe('SIA');
    expect(profile.primary).toBe('S');
    expect(profile.secondary).toBe('I');
    expect(profile.consistency).toBe(50); // S-I 相距 2
    expect(profile.differentiation).toBe(70); // 90 - 20
  });

  it('不足三型时返回 null', () => {
    const make = (key: string): DimensionScore => ({
      key,
      name: key,
      raw: 0,
      mean: 50,
      percentile: 50,
      level: 'mid',
    });
    expect(buildHollandProfile([make('R'), make('I')])).toBeNull();
  });
});

describe('低分化降级（Hero 展示决策）', () => {
  const makeProfile = (diff: number): ReturnType<typeof buildHollandProfile> =>
    buildHollandProfile([
      { key: 'S', name: '社会型', raw: 0, mean: 50 + diff / 2, percentile: 50, level: 'mid' },
      { key: 'A', name: '艺术型', raw: 0, mean: 50, percentile: 50, level: 'mid' },
      { key: 'I', name: '研究型', raw: 0, mean: 50 - diff / 2, percentile: 50, level: 'mid' },
    ]);

  it('分化度低于阈值 → 均衡模式（不显示大字三码）', () => {
    const profile = makeProfile(0)!;
    expect(isLowDifferentiation(profile.differentiation)).toBe(true);
    expect(hollandDisplay(profile).mode).toBe('balanced');
    expect(profile.differentiation).toBeLessThan(LOW_DIFFERENTIATION_THRESHOLD);
  });

  it('分化度高于等于阈值 → 三码模式（正常显示）', () => {
    const profile = makeProfile(30)!;
    expect(isLowDifferentiation(profile.differentiation)).toBe(false);
    expect(hollandDisplay(profile).mode).toBe('code');
  });

  it('阈值边界：恰好等于阈值不算低分化（< 才成立）', () => {
    expect(isLowDifferentiation(LOW_DIFFERENTIATION_THRESHOLD)).toBe(false);
    expect(isLowDifferentiation(LOW_DIFFERENTIATION_THRESHOLD - 0.1)).toBe(true);
  });
});
