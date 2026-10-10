import { describe, expect, it } from 'vitest';
import { createRng, quantize } from './seededRandom';

describe('种子随机', () => {
  it('同一 seed 产出相同序列（保证模拟数据可复现）', () => {
    const a = createRng(20261009);
    const b = createRng(20261009);
    const seqA = [a.next(), a.next(), a.next()];
    const seqB = [b.next(), b.next(), b.next()];
    expect(seqA).toEqual(seqB);
  });

  it('不同 seed 产出不同序列', () => {
    const a = createRng(1);
    const b = createRng(2);
    expect(a.next()).not.toBe(b.next());
  });

  it('int 落在闭区间内', () => {
    const rng = createRng(7);
    for (let i = 0; i < 200; i += 1) {
      const value = rng.int(1, 5);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(5);
      expect(Number.isInteger(value)).toBe(true);
    }
  });

  it('quantize 会把越界值夹回量程', () => {
    expect(quantize(120, 0, 100)).toBe(100);
    expect(quantize(-10, 0, 100)).toBe(0);
    expect(quantize(63, 0, 100)).toBe(63);
  });
});
