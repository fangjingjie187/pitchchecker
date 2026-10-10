import { HEX_ORDER } from '@/config/scoring.config';
import { VALUE_DIMENSIONS } from '@/data/values';
import type { Report } from '@/types';
import type { SharePayload } from './shareCode';

/** 把报告摘要转换为分享码载荷（只含结果向量，不含任何身份信息） */
export function reportToSharePayload(report: Report): SharePayload {
  const interestMap = new Map(report.interest?.dimensions.map((score) => [score.key, score.mean]) ?? []);
  const warmupMap = new Map(report.warmup?.dimensions.map((score) => [score.key, score.mean]) ?? []);
  const adaptMap = new Map(report.adaptability?.dimensions.map((score) => [score.key, score.mean]) ?? []);

  const interests = HEX_ORDER.map((code) => Math.round(interestMap.get(code) ?? 0));
  const abilities = (report.ability?.dimensions ?? []).map((score) => Math.round(score.mean));
  const warmup = ['clarity', 'comfort', 'information'].map((key) => Math.round(warmupMap.get(key) ?? 0));
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
