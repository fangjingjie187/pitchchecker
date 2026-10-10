import { HEX_ORDER } from '@/config/scoring.config';
import { VALUE_DIMENSIONS } from '@/data/values';
import { HOLLAND_TYPE_MAP } from '@/data/holland';
import { ABILITY_DIMENSIONS } from '@/data/abilities';
import { ADAPTABILITY_DIMENSIONS } from '@/data/adaptability';
import type { Report } from '@/types';
import type { SharePayload } from './shareCode';

/**
 * 把报告摘要转换为分享码载荷（只含结果向量，不含任何身份信息）。
 *
 * ⚠ 顺序约定（还原侧 sharePayloadToSummary 必须与此一致）：
 * 所有向量都按「固定维度顺序」而非报告里的得分降序——
 * 报告维度在 buildDimensionScores 里是按 mean 降序排列的，若直接切片，
 * 载荷里"哪个分数属于哪个维度"会丢失，还原时会张冠李戴。
 *   · interests     → HEX_ORDER（R I A S E C）
 *   · abilities     → ABILITY_DIMENSIONS 顺序（verbal logic spatial handson interpersonal creative）
 *   · adaptability  → concern control curiosity confidence
 *   · warmup        → clarity comfort information
 *   · values        → Top3 在 VALUE_DIMENSIONS 中的下标
 */
export function reportToSharePayload(report: Report): SharePayload {
  const interestMap = new Map(
    report.interest?.dimensions.map((score) => [score.key, score.mean]) ?? [],
  );
  const abilityMap = new Map(
    report.ability?.dimensions.map((score) => [score.key, score.mean]) ?? [],
  );
  const warmupMap = new Map(
    report.warmup?.dimensions.map((score) => [score.key, score.mean]) ?? [],
  );
  const adaptMap = new Map(
    report.adaptability?.dimensions.map((score) => [score.key, score.mean]) ?? [],
  );

  const interests = HEX_ORDER.map((code) => Math.round(interestMap.get(code) ?? 0));
  const abilities = ABILITY_DIMENSIONS.map((dim) => Math.round(abilityMap.get(dim.key) ?? 0));
  const warmup = ['clarity', 'comfort', 'information'].map((key) =>
    Math.round(warmupMap.get(key) ?? 0),
  );
  const adaptability = ['concern', 'control', 'curiosity', 'confidence'].map((key) =>
    Math.round(adaptMap.get(key) ?? 0),
  );

  const topValueKeys = (report.value?.dimensions ?? []).slice(0, 3).map((score) => score.key);
  const values = topValueKeys.map((key) => {
    const index = VALUE_DIMENSIONS.findIndex((value) => value.key === key);
    return index < 0 ? 0 : index;
  });

  return {
    version: 1,
    gradeBand: report.gradeBand,
    holland: report.holland?.code ?? '---',
    interests,
    abilities,
    values,
    warmup,
    adaptability,
  };
}

export interface ShareDimensionScore {
  key: string;
  name: string;
  score: number;
}

export interface ShareSummary {
  gradeBand: SharePayload['gradeBand'];
  holland: string;
  interests: ShareDimensionScore[];
  abilities: ShareDimensionScore[];
  values: { key: string; name: string }[];
  warmup: ShareDimensionScore[];
  adaptability: ShareDimensionScore[];
}

const WARMUP_LABELS: Record<string, string> = {
  clarity: '定向清晰度',
  comfort: '担心程度',
  information: '信息了解度',
};

/** 把分享码载荷还原为可渲染的简版报告摘要（维度名 + 分数），纯函数 */
export function sharePayloadToSummary(payload: SharePayload): ShareSummary {
  const interests = HEX_ORDER.map((code, i) => ({
    key: code,
    name: HOLLAND_TYPE_MAP[code]?.name ?? code,
    score: payload.interests[i] ?? 0,
  }));
  const abilities = ABILITY_DIMENSIONS.map((dim, i) => ({
    key: dim.key,
    name: dim.name,
    score: payload.abilities[i] ?? 0,
  }));
  const values = payload.values.map((index) => {
    const dim = VALUE_DIMENSIONS[index];
    return { key: dim?.key ?? 'achievement', name: dim?.name ?? '成就感' };
  });
  const warmup = ['clarity', 'comfort', 'information'].map((key, i) => ({
    key,
    name: WARMUP_LABELS[key],
    score: payload.warmup[i] ?? 0,
  }));
  const adaptability = ADAPTABILITY_DIMENSIONS.map((dim, i) => ({
    key: dim.key,
    name: dim.name,
    score: payload.adaptability[i] ?? 0,
  }));
  return {
    gradeBand: payload.gradeBand,
    holland: payload.holland,
    interests,
    abilities,
    values,
    warmup,
    adaptability,
  };
}
