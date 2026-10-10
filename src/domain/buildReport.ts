import { TOP_VALUE_COUNT } from '@/config/scoring.config';
import { getActiveModules } from '@/config/modules';
import type { AppState, GradeBand, ModuleKey, ModuleScore, Report } from '@/types';
import { ITEMS } from '@/data/items';
import { computeDimensionStats } from './scale';
import { buildDimensionScores } from './stats';
import { buildHollandProfile, isLowDifferentiation } from './holland';
import { buildQuadrants } from './quadrant';
import { matchCareers } from './matching';
import { buildPathway } from './pathway';
import { buildActionPlan } from './actionPlan';
import { buildNarrative } from './narrative';
import { checkValidity, describeConfidence } from './validity';
import { createId } from '@/utils/id';

/**
 * 组装完整报告。
 *
 * 降级规则（硬性要求）：
 *  · 适应力 / 决策 / 人格未作答时，对应区块渲染为"未作答 + 一键补测"，不得空白或报错；
 *  · 只要 P0（暖场 + 兴趣 + 能力 + 价值观）完成，报告主体
 *    （画像 / 兴趣 / 能力 / 四象限 / 价值观 / 职业匹配 / 行动计划）必须完整成立。
 */
export function buildReport(state: AppState, gradeBand: GradeBand): Report {
  const modules = getActiveModules({ quickMode: state.settings.quickMode });
  const completedKeys = modules.filter((meta) => state.answers[meta.key]?.completed).map((m) => m.key);

  const buildModule = (
    key: ModuleKey,
    closingTemplate: (name: string) => string,
  ): ModuleScore | null => {
    if (!completedKeys.includes(key)) return null;
    const record = state.answers[key];
    if (!record) return null;
    const items = ITEMS[key] ?? [];
    const stats = computeDimensionStats(key, record.answers, gradeBand);
    const scores = buildDimensionScores(key, stats, gradeBand);
    const flags = checkValidity({
      module: key,
      answers: record.answers,
      durationMs: record.durationMs,
      items,
    });
    const top = scores[0];
    return {
      module: key,
      dimensions: scores,
      closingFeedback: top ? closingTemplate(top.name) : '',
      narrative: '',
      completedAt: record.updatedAt,
      validity: flags,
    };
  };

  const warmup = buildModule('warmup', (name) => `你在「${name}」上的状态已被记录。`);
  const interest = buildModule('interest', (name) => `你的兴趣偏向是${name}。`);
  const ability = buildModule('ability', (name) => `你最有信心的是${name}。`);
  const value = buildModule('value', (name) => `你最看重的是${name}。`);
  const adaptability = buildModule('adaptability', (name) => `你适应力里最稳的是${name}。`);
  const decision = buildModule('decision', (name) => `你的主导决策风格是${name}。`);
  const personality = buildModule('personality', (name) => `你最突出的风格偏好是${name}。`);

  const interestScores = interest?.dimensions ?? [];
  const abilityScores = ability?.dimensions ?? [];
  const valueScores = value?.dimensions ?? [];

  const holland = interestScores.length >= 3 ? buildHollandProfile(interestScores) : null;
  const quadrants =
    interestScores.length > 0 && abilityScores.length > 0
      ? buildQuadrants(
          interestScores.map((s) => ({ key: s.key, mean: s.mean, count: 1 })),
          abilityScores.map((s) => ({ key: s.key, mean: s.mean, count: 1 })),
        )
      : [];

  const topValues = valueScores.slice(0, TOP_VALUE_COUNT).map((score) => score.key);
  const matches =
    holland && abilityScores.length > 0
      ? matchCareers({
          code: holland.code,
          abilityScores,
          topValues,
          lowDifferentiation: isLowDifferentiation(holland.differentiation),
        })
      : [];

  const pathway = matches.length > 0 ? buildPathway(matches) : null;

  const actions = buildActionPlan({
    gradeBand,
    interest: interestScores,
    ability: abilityScores,
    adaptability: adaptability?.dimensions ?? null,
    value: valueScores,
    decision: decision?.dimensions ?? null,
    warmup: warmup?.dimensions ?? null,
  });

  const narrative = buildNarrative({
    holland,
    ability: abilityScores,
    value: valueScores,
    quadrants,
    pathway,
    gradeBand,
  });

  const allFlags = [
    ...(warmup?.validity ?? []),
    ...(interest?.validity ?? []),
    ...(ability?.validity ?? []),
    ...(value?.validity ?? []),
    ...(adaptability?.validity ?? []),
    ...(decision?.validity ?? []),
    ...(personality?.validity ?? []),
  ];

  const mode: Report['mode'] = state.settings.quickMode ? 'quick' : 'full';

  return {
    id: createId('report'),
    createdAt: Date.now(),
    gradeBand,
    mode,
    modules: completedKeys,
    warmup,
    interest,
    ability,
    value,
    adaptability,
    decision,
    personality,
    holland,
    quadrants,
    matches,
    pathway,
    actions,
    narrative,
    confidenceNote: describeConfidence(allFlags),
  };
}
