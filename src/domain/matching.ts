import { CAREERS } from '@/data/careers';
import { VALUE_DIMENSION_MAP } from '@/data/values';
import { getDimensionName } from '@/data/dimensionNames';
import {
  IACHAN_CROSS_POSITION_FACTOR,
  IACHAN_MAX,
  IACHAN_WEIGHTS,
  MATCH_WEIGHTS,
  TOP_CAREER_COUNT,
} from '@/config/scoring.config';
import type { CareerMatch, DimensionScore } from '@/types';

/**
 * 人—职匹配：兴趣 40% + 能力 35% + 价值观 25%（权重见 MATCH_WEIGHTS）。
 *
 * 三层分别对应 O*NET 内容模型的三个要素，并且**每一条都要给出可解释的理由**——
 * 只给一个总分会让青少年难以判断该不该采信，可解释性本身就是干预的一部分。
 */

/** Iachan 人—职一致指数：第一码 5 分、第二码 3 分、第三码 1 分 */
export function iachanIndex(personCode: string, careerCode: string): number {
  let score = 0;
  for (let i = 0; i < IACHAN_WEIGHTS.length; i += 1) {
    const letter = personCode[i];
    if (!letter) continue;
    if (careerCode[i] === letter) {
      score += IACHAN_WEIGHTS[i];
    } else if (careerCode.includes(letter)) {
      score += IACHAN_WEIGHTS[i] * IACHAN_CROSS_POSITION_FACTOR;
    }
  }
  return (score / IACHAN_MAX) * 100;
}

/** 余弦相似度（0–100）：用于能力向量与职业能力需求的匹配 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length === 0 || a.length !== b.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return (dot / (Math.sqrt(normA) * Math.sqrt(normB))) * 100;
}

/** 价值观匹配（0–100）：Top3 按 3 / 2 / 1 加权命中 */
export function valueMatchScore(topValues: string[], valueSupply: string[]): number {
  if (topValues.length === 0) return 0;
  const weights = [3, 2, 1];
  let hit = 0;
  let total = 0;
  topValues.forEach((key, index) => {
    const weight = weights[index] ?? 1;
    total += weight;
    if (valueSupply.includes(key)) hit += weight;
  });
  return total === 0 ? 0 : (hit / total) * 100;
}

export interface MatchInput {
  /** 个人 Holland 三字母码 */
  code: string;
  /** 六维能力得分（0–100），顺序与 ABILITY_DIMENSIONS 一致 */
  abilityScores: DimensionScore[];
  /** Top3 价值观 key */
  topValues: string[];
  /**
   * 兴趣是否低分化（图谱均衡）。
   * 为 true 时，推荐理由首句注明"基于你目前相对均衡的兴趣图谱"，
   * 避免把均衡兴趣误读成明确倾向。
   */
  lowDifferentiation?: boolean;
}

function contribution(value: number, weight: number): number {
  return Math.round(value * weight);
}

export function matchCareers(input: MatchInput): CareerMatch[] {
  const abilityVector = input.abilityScores.map((score) => score.mean);
  const abilityKeys = input.abilityScores.map((score) => score.key);

  const matches = CAREERS.map((career) => {
    const interest = iachanIndex(input.code, career.hollandCode);
    const ability = cosineSimilarity(
      abilityVector,
      abilityKeys.map((key) => (career.abilityDemand as Record<string, number>)[key] ?? 3),
    );
    const value = valueMatchScore(input.topValues, career.valueSupply);
    const total =
      interest * MATCH_WEIGHTS.interest +
      ability * MATCH_WEIGHTS.ability +
      value * MATCH_WEIGHTS.value;

    const reasons: string[] = [];
    const interestPrefix = input.lowDifferentiation ? '基于你目前相对均衡的兴趣图谱，' : '';
    reasons.push(
      `兴趣：${interestPrefix}你的 ${input.code} 与该职业的 ${career.hollandCode} ${describeInterestFit(interest)}（贡献 +${contribution(interest, MATCH_WEIGHTS.interest)}）`,
    );
    reasons.push(
      `能力：${describeAbilityFit(abilityKeys, abilityVector, career.abilityDemand as Record<string, number>)}（贡献 +${contribution(ability, MATCH_WEIGHTS.ability)}）`,
    );
    const missing = input.topValues.filter((key) => !career.valueSupply.includes(key));
    reasons.push(
      missing.length === 0
        ? `价值观：它同时满足你看重的 ${input.topValues
            .map((key) => VALUE_DIMENSION_MAP[key]?.name ?? key)
            .join('、')}（贡献 +${contribution(value, MATCH_WEIGHTS.value)}）`
        : `价值观：它满足了 ${input.topValues
            .filter((key) => career.valueSupply.includes(key))
            .map((key) => VALUE_DIMENSION_MAP[key]?.name ?? key)
            .join('、') || '其中一部分'}，但较少满足 ${missing
            .map((key) => VALUE_DIMENSION_MAP[key]?.name ?? key)
            .join('、')}（贡献 +${contribution(value, MATCH_WEIGHTS.value)}）`,
    );

    return {
      careerId: career.id,
      total: Math.round(total * 10) / 10,
      interest: Math.round(interest * 10) / 10,
      ability: Math.round(ability * 10) / 10,
      value: Math.round(value * 10) / 10,
      reasons,
    };
  });

  return matches.sort((a, b) => b.total - a.total).slice(0, TOP_CAREER_COUNT);
}

function describeInterestFit(score: number): string {
  if (score >= 75) return '高度吻合';
  if (score >= 50) return '比较接近';
  if (score >= 30) return '有一定交集';
  return '关联较弱';
}

function describeAbilityFit(
  keys: string[],
  mine: number[],
  demand: Record<string, number>,
): string {
  const gaps: { key: string; gap: number }[] = [];
  keys.forEach((key, index) => {
    const need = (demand[key] ?? 3) * 20; // 需求 1–5 → 0–100
    gaps.push({ key, gap: mine[index] - need });
  });
  gaps.sort((a, b) => b.gap - a.gap);
  const best = gaps[0];
  const worst = gaps[gaps.length - 1];
  const bestName = getDimensionName('ability', best.key);
  if (best.gap >= 0) {
    return `你的${bestName}已接近这个职业的要求`;
  }
  return `${bestName}还有提升空间，${getDimensionName('ability', worst.key)}则是最需要练习的部分`;
}
