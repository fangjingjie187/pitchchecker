import type { GradeBand, ModuleKey, NormEntry } from '@/types';

/**
 * 参考常模。
 *
 * ⚠ 重要声明：以下参数是**演示用参考参数**，不是标准化全国常模。
 * 除暖场模块的清晰度与担心两个维度外，其余维度均由构念的先验分布假定生成
 * （均值 50–65、标准差 15–22 之间），仅用于把原始分换算成"相对参考区间"。
 * 正式使用必须以真实常模样本重新标定（About 页已声明这一局限）。
 *
 * 锚定情况：
 *  · **仅暖场 clarity / comfort 两个维度锚定自实测**：2024 年山东、河南两所县域普通高中
 *    高一学生实测（n = 2119，男 968 / 女 1151），量表为职业决策因素量表（胡洁，2007）高中生改编版。
 *    换算方式：原始为 5 点量表，mean' = (M − 1) / 4 × 100，sd' = SD / 4 × 100。
 *  · comfort 的实测值是"情感舒适"正向分（M = 3.17 → 54），而本产品滑条方向为
 *    "担心程度"，故须反向映射：100 − 54 = 46。⚠ 不要直接填 54。
 *  · information 无实测锚定，为预估参考值。
 *  · 其余模块（兴趣 / 能力 / 价值观 / 适应力 / 决策 / 人格）均为先验假定参数，无实测锚定。
 *
 * 结构说明：
 *  · BASE_NORMS 给出各模块各维度的基础均值与标准差（0–100 尺度）；
 *  · BAND_ADJUST 给出年级段的整体微调（**仅 15–16 段有实测锚定**，12–14 / 17–18 由微调系数外推）；
 *  · getNorm() 合成最终参数，供 domain 层计算百分等级。
 *
 * comfort（担心程度）为负向构念：得分越高表示越担心，不代表越好或越差。
 */
export const BASE_NORMS: Record<ModuleKey, Record<string, NormEntry>> = {
  warmup: {
    // 修订计分版本锚定（2024，n=2119，15–16 段）：M=2.7208 → (2.7208−1)/4×100 ≈ 43；SD=0.86426 → /4×100 ≈ 22
    clarity: { mean: 43, sd: 22 },
    // 实测锚定：情感舒适正向 M=3.17 → 54；滑条方向为"担心程度"，反向映射 100−54 = 46；SD=0.92 → 23
    comfort: { mean: 46, sd: 23 },
    // 预估值，无实测锚定
    information: { mean: 40, sd: 20 },
  },
  interest: {
    R: { mean: 50, sd: 20 },
    I: { mean: 55, sd: 20 },
    A: { mean: 58, sd: 20 },
    S: { mean: 62, sd: 18 },
    E: { mean: 55, sd: 19 },
    C: { mean: 52, sd: 18 },
  },
  ability: {
    verbal: { mean: 55, sd: 18 },
    logic: { mean: 52, sd: 20 },
    spatial: { mean: 52, sd: 19 },
    handson: { mean: 54, sd: 19 },
    interpersonal: { mean: 58, sd: 18 },
    creative: { mean: 57, sd: 19 },
  },
  value: {
    achievement: { mean: 60, sd: 17 },
    independence: { mean: 62, sd: 16 },
    altruism: { mean: 58, sd: 18 },
    creativity: { mean: 60, sd: 17 },
    intellectual: { mean: 58, sd: 17 },
    reward: { mean: 60, sd: 17 },
    security: { mean: 62, sd: 16 },
    prestige: { mean: 52, sd: 18 },
    balance: { mean: 65, sd: 15 },
    relationship: { mean: 63, sd: 16 },
  },
  adaptability: {
    concern: { mean: 58, sd: 18 },
    control: { mean: 60, sd: 17 },
    curiosity: { mean: 60, sd: 17 },
    confidence: { mean: 56, sd: 18 },
  },
  decision: {
    rational: { mean: 55, sd: 18 },
    intuitive: { mean: 58, sd: 17 },
    dependent: { mean: 60, sd: 18 },
    avoidant: { mean: 52, sd: 19 },
    spontaneous: { mean: 50, sd: 18 },
  },
  personality: {
    extraversion: { mean: 55, sd: 19 },
    agreeableness: { mean: 62, sd: 16 },
    conscientiousness: { mean: 56, sd: 18 },
    stability: { mean: 54, sd: 19 },
    openness: { mean: 60, sd: 17 },
  },
};

/**
 * 年级段微调。
 * ⚠ 仅 15–16 段锚定自 2024 年实测（n = 2119）；
 * 12–14 与 17–18 段是在该锚定点上外推的微调系数，没有独立实测支持。
 */
export const BAND_ADJUST: Record<GradeBand, { meanDelta: number; sdFactor: number }> = {
  '12-14': { meanDelta: -2, sdFactor: 1.05 },
  '15-16': { meanDelta: 0, sdFactor: 1 },
  '17-18': { meanDelta: 3, sdFactor: 0.95 },
};

const FALLBACK: NormEntry = { mean: 55, sd: 18 };

export function getNorm(module: ModuleKey, dimension: string, gradeBand: GradeBand): NormEntry {
  const base = BASE_NORMS[module]?.[dimension] ?? FALLBACK;
  const adjust = BAND_ADJUST[gradeBand] ?? BAND_ADJUST['15-16'];
  return {
    mean: Math.round((base.mean + adjust.meanDelta) * 10) / 10,
    sd: Math.round(base.sd * adjust.sdFactor * 10) / 10,
  };
}

/** 等级切分（百分等级），与 config/scoring.config.ts 的 LEVEL_CUTS 保持一致 */
export const LEVEL_THRESHOLD = { low: 35, high: 65 } as const;
