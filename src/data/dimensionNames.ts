import type { DimensionDef, ModuleKey } from '@/types';
import { HOLLAND_TYPES } from './holland';
import { ABILITY_DIMENSIONS } from './abilities';
import { VALUE_DIMENSIONS } from './values';
import { ADAPTABILITY_DIMENSIONS } from './adaptability';
import { DECISION_STYLES } from './decisionStyles';
import { TRAIT_DIMENSIONS } from './traits';
import { WARMUP_DIMENSIONS } from './warmup';

/** 各模块的维度定义来源表 */
export const DIMENSION_DEFS: Record<ModuleKey, DimensionDef[]> = {
  warmup: WARMUP_DIMENSIONS,
  interest: HOLLAND_TYPES,
  ability: ABILITY_DIMENSIONS,
  value: VALUE_DIMENSIONS,
  adaptability: ADAPTABILITY_DIMENSIONS,
  decision: DECISION_STYLES,
  personality: TRAIT_DIMENSIONS,
};

const NAME_INDEX: Record<string, Record<string, DimensionDef>> = Object.fromEntries(
  Object.entries(DIMENSION_DEFS).map(([module, defs]) => [
    module,
    Object.fromEntries(defs.map((def) => [def.key, def])),
  ]),
);

/** 取维度定义；缺失时返回兜底对象，保证报告不会因为维度名缺失而崩溃 */
export function getDimensionDef(module: ModuleKey, key: string): DimensionDef {
  const def = NAME_INDEX[module]?.[key];
  if (def) return def;
  return {
    key,
    name: key,
    short: key,
    description: '',
    polarity: 'positive',
  };
}

export function getDimensionName(module: ModuleKey, key: string): string {
  return getDimensionDef(module, key).name;
}

export function getDimensionShort(module: ModuleKey, key: string): string {
  return getDimensionDef(module, key).short;
}
