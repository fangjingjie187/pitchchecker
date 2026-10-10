import { ACTIONS } from '@/data/actions';
import { GRADE_BAND_HORIZON_GUIDE } from '@/data/interpretations';
import { getDimensionName } from '@/data/dimensionNames';
import type { ActionHorizon, ActionItemData, ActionPlanItem, DimensionScore, GradeBand } from '@/types';

/**
 * 生成分层行动计划。
 *
 * 三层时间框架（近 / 中 / 远）来自 GRADE_BAND_HORIZON_GUIDE（按年级段差异化）；
 * 具体条目从 data/actions.ts 按「模块 + 维度 + 等级」查表，保证每条建议都可追溯到来源。
 * 每条都带 source，报告中可以显示"为什么给我这条"。
 */
export function pickAction(
  module: ActionItemData['module'],
  dimension: string,
  level: ActionItemData['level'],
  gradeBand?: GradeBand,
): ActionItemData | null {
  const candidates = ACTIONS.filter(
    (action) => action.module === module && action.dimension === dimension && action.level === level,
  );
  if (candidates.length === 0) return null;
  const forBand = candidates.find((action) => gradeBand && action.gradeBands?.includes(gradeBand));
  return forBand ?? candidates[0];
}

export interface ActionPlanInput {
  gradeBand: GradeBand;
  /** 已完成模块的维度分 */
  interest: DimensionScore[] | null;
  ability: DimensionScore[] | null;
  adaptability: DimensionScore[] | null;
  value: DimensionScore[] | null;
  decision: DimensionScore[] | null;
  /** 暖场：信息充足度低时优先补信息 */
  warmup: DimensionScore[] | null;
}

export function buildActionPlan(input: ActionPlanInput): ActionPlanItem[] {
  const items: ActionPlanItem[] = [];
  const guide = GRADE_BAND_HORIZON_GUIDE[input.gradeBand];

  const addFromGuide = () => {
    const horizons: ActionHorizon[] = ['near', 'mid', 'long'];
    horizons.forEach((horizon) => {
      items.push({
        id: `guide-${input.gradeBand}-${horizon}`,
        horizon,
        text: guide[horizon],
        source: '年级段发展框架',
      });
    });
  };

  const add = (
    module: ActionItemData['module'],
    dimension: string,
    level: ActionItemData['level'],
    horizons: ActionHorizon[],
  ) => {
    const action = pickAction(module, dimension, level, input.gradeBand);
    if (!action) return;
    for (const horizon of horizons) {
      items.push({
        id: `${action.id}-${horizon}`,
        horizon,
        text: action.text,
        source: `${moduleLabel(module)} · ${getDimensionName(module, dimension)}`,
      });
    }
  };

  // 暖场：信息充足度低 → 先补信息（针对调研中最突出的未决原因）
  const info = input.warmup?.find((score) => score.key === 'information');
  if (info && info.level === 'low') add('warmup', 'information', 'low', ['near']);

  // 兴趣：强化主导方向
  const topInterest = input.interest?.[0];
  if (topInterest) add('interest', topInterest.key, 'high', ['mid']);

  // 能力：最低的维度最值得练
  const lowAbility = input.ability && input.ability.length > 0 ? input.ability[input.ability.length - 1] : null;
  if (lowAbility) add('ability', lowAbility.key, lowAbility.level, ['near']);

  // 适应力：最弱的一项配干预练习
  const lowAdapt =
    input.adaptability && input.adaptability.length > 0
      ? input.adaptability[input.adaptability.length - 1]
      : null;
  if (lowAdapt) add('adaptability', lowAdapt.key, lowAdapt.level, ['near']);

  // 价值观：Top1 给出验证方式
  const topValue = input.value?.[0];
  if (topValue) add('value', topValue.key, 'high', ['mid']);

  // 决策风格：主导风格给一条针对性建议
  const topDecision = input.decision?.[0];
  if (topDecision) add('decision', topDecision.key, 'high', ['near']);

  addFromGuide();

  const order: Record<ActionHorizon, number> = { near: 0, mid: 1, long: 2 };
  return items.sort((a, b) => order[a.horizon] - order[b.horizon]);
}

function moduleLabel(module: ActionItemData['module']): string {
  const map: Record<string, string> = {
    warmup: '暖场',
    interest: '兴趣',
    ability: '能力',
    value: '价值观',
    adaptability: '适应力',
    decision: '决策风格',
    personality: '人格',
  };
  return map[module] ?? module;
}
