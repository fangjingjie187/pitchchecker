import type { ModuleKey } from '@/types';

/** 数据目标与校验阈值。scripts/validate.ts 依据此文件校验 data/ 目录 */
export const DATA_TARGETS = {
  /** 职业库目标条数 */
  careers: 60,
  /** 覆盖行业数目标 */
  industries: 10,
  /** 每个 Holland 首码至少覆盖的职业数 */
  minCareersPerHolland: 6,
  /**
   * 各模块每个维度的最少题目数。
   * 价值观模块有 10 个维度、10 道题，故按 1 题/维度设计（7 题评定 + 3 题迫选覆盖其余维度）。
   * 迫选题按"选项所属维度"计入覆盖，不按题目自身维度统计。
   */
  minItemsPerDimension: {
    warmup: 1,
    interest: 3,
    ability: 2,
    value: 1,
    adaptability: 3,
    decision: 2,
    personality: 2,
  } as Record<ModuleKey, number>,
  /** 允许使用反向题的模块（其余模块必须全部正向计分） */
  reverseAllowedModules: ['personality', 'adaptability'] as const,
  /** 必须全部正向计分的模块（显式校验，防止误加 reverse） */
  positiveOnlyModules: ['warmup', 'interest', 'ability', 'value', 'decision'] as const,
} as const;
