import { describe, expect, it } from 'vitest';
import { cosineSimilarity, iachanIndex, matchCareers, valueMatchScore } from './matching';
import { TOP_CAREER_COUNT } from '@/config/scoring.config';
import type { DimensionScore } from '@/types';

const score = (key: string, mean: number): DimensionScore => ({
  key,
  name: key,
  raw: 0,
  mean,
  percentile: 50,
  level: 'mid',
});

describe('人—职匹配', () => {
  it('Iachan：完全相同得 100', () => {
    expect(iachanIndex('SAI', 'SAI')).toBeCloseTo(100, 5);
  });

  it('Iachan：同码异位按 0.5 折算', () => {
    // S A I vs S I A：S 同位(5)，A 异位(1.5)，I 异位(0.5) → 7/9
    expect(iachanIndex('SAI', 'SIA')).toBeCloseTo((7 / 9) * 100, 5);
  });

  it('Iachan：完全不同得 0', () => {
    expect(iachanIndex('RCE', 'SAI')).toBe(0);
  });

  it('余弦相似度：同向 100、正交 0', () => {
    expect(cosineSimilarity([1, 0, 0], [1, 0, 0])).toBeCloseTo(100, 5);
    expect(cosineSimilarity([0, 1, 0], [1, 0, 0])).toBeCloseTo(0, 5);
    expect(cosineSimilarity([0], [0])).toBe(0);
  });

  it('价值观匹配：Top3 按 3/2/1 加权', () => {
    expect(valueMatchScore(['a', 'b', 'c'], ['a', 'b', 'c'])).toBeCloseTo(100, 5);
    expect(valueMatchScore(['a', 'b'], ['a', 'x'])).toBeCloseTo(60, 5); // 3/5
    expect(valueMatchScore([], ['a'])).toBe(0);
  });

  it('matchCareers 返回 Top8 且总分落在 0–100 且按降序', () => {
    const ability = [
      score('verbal', 70),
      score('logic', 80),
      score('spatial', 60),
      score('handson', 55),
      score('interpersonal', 65),
      score('creative', 75),
    ];
    const matches = matchCareers({ code: 'AIS', abilityScores: ability, topValues: ['creativity', 'independence'] });
    expect(matches).toHaveLength(TOP_CAREER_COUNT);
    for (const match of matches) {
      expect(match.total).toBeGreaterThanOrEqual(0);
      expect(match.total).toBeLessThanOrEqual(100);
      expect(match.reasons.length).toBe(3);
    }
    const totals = matches.map((m) => m.total);
    expect([...totals].sort((a, b) => b - a)).toEqual(totals);
  });
});
