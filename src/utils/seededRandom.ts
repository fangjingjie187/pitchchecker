/**
 * 确定性伪随机（mulberry32）。
 * 用途：离线生成模拟作答样本（scripts/ 生成 sampleResponses.json）、演示人设填充。
 * 同一 seed 必须产出同一结果，便于复现与校对。
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next(): number {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Rng {
  next: () => number;
  int: (min: number, max: number) => number;
  pick: <T>(list: readonly T[]) => T;
  /** 近似正态（Box–Muller），用于生成更真实的作答分布 */
  normal: (mean: number, stdDev: number) => number;
  bool: (p: number) => boolean;
}

export function createRng(seed: number): Rng {
  const next = mulberry32(seed);
  const int = (min: number, max: number) => Math.floor(next() * (max - min + 1)) + min;
  return {
    next,
    int,
    pick: <T>(list: readonly T[]): T => list[int(0, list.length - 1)],
    normal: (mean: number, stdDev: number) => {
      const u = Math.max(next(), 1e-9);
      const v = next();
      return mean + stdDev * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    },
    bool: (p: number) => next() < p,
  };
}

/** 把 0–1 的连续值夹到指定量程并取整 */
export function quantize(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(value)));
}
