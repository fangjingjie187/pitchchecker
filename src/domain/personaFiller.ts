import { ITEMS } from '@/data/items';
import type { DemoPersona } from '@/types';
import type { AnswerValue, ModuleKey } from '@/types';
import { createRng } from '@/utils/seededRandom';
import { clamp } from '@/utils/format';

/**
 * 按人设生成作答（演示模式与离线样本生成共用）。
 *
 * 设计要点：
 *  · 同一 (persona, seed) 必须产出相同结果，便于复现与截图；
 *  · 配对题（pairId）取自同一维度，因此天然一致，不会触发一致性告警；
 *  · 反向题先算出强度再翻转，保证人设在"正向构念"上的语义一致。
 */
function hashCode(text: string): number {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function fillPersonaModule(
  persona: DemoPersona,
  module: ModuleKey,
  seed = 1,
): Record<string, AnswerValue> {
  const items = ITEMS[module] ?? [];
  const answers: Record<string, AnswerValue> = {};

  for (const item of items) {
    const rng = createRng(seed + hashCode(item.id));
    const baseLevel = persona.dimensionLevels[item.dimension] ?? persona.base;
    const jitter = rng.normal(0, persona.noise);
    const level = clamp(baseLevel + jitter, 0, 1);

    switch (item.type) {
      case 'likert5': {
        const raw = clamp(Math.round(1 + level * 4), 1, 5);
        answers[item.id] = item.reverse ? 6 - raw : raw;
        break;
      }
      case 'slider100': {
        const raw = clamp(Math.round((level * 100) / 10) * 10, 0, 100);
        answers[item.id] = item.reverse ? 100 - raw : raw;
        break;
      }
      case 'forcedChoice': {
        // 选人设强度最高的那个选项（加入少量噪声，避免样本过于机械）
        const scored = item.options.map((option) => ({
          id: option.id,
          score: (persona.dimensionLevels[option.dimension] ?? persona.base) + rng.normal(0, persona.noise / 2),
        }));
        scored.sort((a, b) => b.score - a.score);
        answers[item.id] = scored[0].id;
        break;
      }
      case 'sort': {
        // SortOption 只描述选项文案、不带维度归属，故默认保持原始顺序
        answers[item.id] = item.options.map((_, index) => index);
        break;
      }
      case 'open': {
        answers[item.id] = persona.openAnswers?.[item.id] ?? '';
        break;
      }
      default:
        break;
    }
  }

  return answers;
}

export function fillPersonaAll(
  persona: DemoPersona,
  modules: ModuleKey[],
  seed = 1,
): Partial<Record<ModuleKey, Record<string, AnswerValue>>> {
  const result: Partial<Record<ModuleKey, Record<string, AnswerValue>>> = {};
  for (const module of modules) {
    result[module] = fillPersonaModule(persona, module, seed);
  }
  return result;
}

/** 在人设基础上做整体扰动，用于生成多样的模拟样本 */
export function jitterPersona(persona: DemoPersona, seed: number, sd = 0.12): DemoPersona {
  const rng = createRng(seed);
  const levels: Record<string, number> = {};
  for (const [key, value] of Object.entries(persona.dimensionLevels)) {
    levels[key] = clamp(value + rng.normal(0, sd), 0.05, 0.95);
  }
  return { ...persona, dimensionLevels: levels, noise: persona.noise };
}
