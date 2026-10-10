import { describe, expect, it } from 'vitest';
import { cronbachAlpha, dimensionAlphas, interestCorrelation, PSYCHOMETRICS_NOTE } from './psychometrics';
import type { AssessmentItem } from '@/types';

const likert = (id: string, dimension = 'd'): AssessmentItem => ({
  id,
  dimension,
  type: 'likert5',
  text: id,
});

describe('心理测量学（模拟数据方法演示）', () => {
  it('完全一致的同维度条目 α = 1', () => {
    const items = [likert('a'), likert('b'), likert('c')];
    const answers = [1, 2, 3, 4, 5].map((value) => ({ a: value, b: value, c: value }));
    expect(cronbachAlpha(items, answers)).toBeCloseTo(1, 5);
  });

  it('条目数 < 2 时不适用（返回 null）', () => {
    expect(cronbachAlpha([likert('a')], [{ a: 3 }])).toBeNull();
  });

  it('dimensionAlphas 覆盖全部模块，兴趣六型各有 α（3 题/维度）', () => {
    const alphas = dimensionAlphas();
    expect(Object.keys(alphas)).toHaveLength(7);
    const interest = alphas.interest;
    expect(Object.keys(interest)).toHaveLength(6);
    for (const key of Object.keys(interest)) {
      expect(interest[key], `interest/${key}`).not.toBeNull();
    }
  });

  it('价值观单条目维度 α 为 null（不适用）', () => {
    const value = dimensionAlphas().value;
    for (const key of Object.keys(value)) {
      expect(value[key]).toBeNull();
    }
  });

  it('兴趣相关矩阵：6×6，对角线为 1，取值落在 [-1,1]', () => {
    const { dimensions, matrix } = interestCorrelation();
    expect(dimensions).toHaveLength(6);
    expect(matrix).toHaveLength(6);
    matrix.forEach((row, i) => {
      expect(row).toHaveLength(6);
      expect(row[i]).toBe(1);
      row.forEach((value) => {
        expect(value).toBeGreaterThanOrEqual(-1);
        expect(value).toBeLessThanOrEqual(1);
      });
    });
  });

  it('仪表盘顶部标注包含"模拟数据 · 方法演示"', () => {
    expect(PSYCHOMETRICS_NOTE).toContain('模拟数据');
    expect(PSYCHOMETRICS_NOTE).toContain('方法演示');
  });
});
