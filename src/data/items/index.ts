import type { AssessmentItem, ModuleKey } from '@/types';
import { WARMUP_ITEMS } from './warmup.items';
import { INTEREST_ITEMS } from './interest.items';
import { ABILITY_ITEMS } from './ability.items';
import { VALUE_ITEMS } from './value.items';
import { ADAPTABILITY_ITEMS } from './adaptability.items';
import { DECISION_ITEMS } from './decision.items';
import { PERSONALITY_ITEMS } from './personality.items';

/**
 * 题目汇总。scripts/validate.ts 会据此校验题量、维度覆盖与配对关系。
 * 替换校对时只需改动 items/ 下的各模块文件，本文件无需改动。
 */
export const ITEMS: Record<ModuleKey, AssessmentItem[]> = {
  warmup: WARMUP_ITEMS,
  interest: INTEREST_ITEMS,
  ability: ABILITY_ITEMS,
  value: VALUE_ITEMS,
  adaptability: ADAPTABILITY_ITEMS,
  decision: DECISION_ITEMS,
  personality: PERSONALITY_ITEMS,
};

/** 按 id 快速索引（作答页与计分共用） */
export const ITEM_INDEX: Record<ModuleKey, Record<string, AssessmentItem>> = {
  warmup: Object.fromEntries(WARMUP_ITEMS.map((item) => [item.id, item])),
  interest: Object.fromEntries(INTEREST_ITEMS.map((item) => [item.id, item])),
  ability: Object.fromEntries(ABILITY_ITEMS.map((item) => [item.id, item])),
  value: Object.fromEntries(VALUE_ITEMS.map((item) => [item.id, item])),
  adaptability: Object.fromEntries(ADAPTABILITY_ITEMS.map((item) => [item.id, item])),
  decision: Object.fromEntries(DECISION_ITEMS.map((item) => [item.id, item])),
  personality: Object.fromEntries(PERSONALITY_ITEMS.map((item) => [item.id, item])),
};

/** 年级段过滤：只保留该段可见的题目 */
export function getItemsForBand(module: ModuleKey, gradeBand: string): AssessmentItem[] {
  return ITEMS[module].filter((item) => !item.gradeBands || item.gradeBands.includes(gradeBand as never));
}
