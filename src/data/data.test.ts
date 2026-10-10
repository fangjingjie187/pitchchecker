import { describe, expect, it } from 'vitest';
import { ITEMS } from './items';
import { CAREERS } from './careers';
import { MAJORS } from './majors';
import { SUBJECTS } from './subjects';
import { VALUE_DIMENSIONS } from './values';
import { ABILITY_DIMENSIONS } from './abilities';
import { HOLLAND_TYPES } from './holland';
import { ADAPTABILITY_DIMENSIONS } from './adaptability';
import { DECISION_STYLES } from './decisionStyles';
import { TRAIT_DIMENSIONS } from './traits';
import { ACTIONS } from './actions';
import { MODULE_INTERPRETATIONS } from './interpretations';
import { BASE_NORMS, getNorm } from './norms';
import { DEMO_PERSONAS, DEFAULT_PERSONA_ID } from './demoPersonas';
import { fillPersonaModule } from '@/domain/personaFiller';
import { MODULES } from '@/config/modules';
import { DATA_TARGETS } from '@/config/data.config';
import { HOLLAND_CODES } from '@/types';

const ABILITY_KEYS = ABILITY_DIMENSIONS.map((a) => a.key);
const VALUE_KEYS = VALUE_DIMENSIONS.map((v) => v.key);

describe('题目数据', () => {
  it('总题量为 78 题', () => {
    const total = Object.values(ITEMS).reduce((sum, list) => sum + list.length, 0);
    expect(total).toBe(78);
  });

  it('各模块题量与注册表声明一致', () => {
    for (const meta of MODULES) {
      expect(ITEMS[meta.key].length, `${meta.key} 题量`).toBe(meta.itemCount);
    }
  });

  it('题目 id 全局唯一', () => {
    const ids = Object.values(ITEMS).flat().map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('反向题只出现在人格与生涯适应力模块', () => {
    for (const meta of MODULES) {
      const reversed = ITEMS[meta.key].filter((item) => item.reverse);
      if (!(DATA_TARGETS.reverseAllowedModules as readonly string[]).includes(meta.key)) {
        expect(reversed.length, `${meta.key} 不应有反向题`).toBe(0);
      }
    }
    expect(ITEMS.adaptability.filter((i) => i.reverse).length).toBe(4);
    expect(ITEMS.personality.filter((i) => i.reverse).length).toBe(2);
  });

  it('兴趣、能力、价值观模块全部正向计分', () => {
    for (const key of ['interest', 'ability', 'value'] as const) {
      expect(ITEMS[key].every((item) => !item.reverse)).toBe(true);
    }
  });

  it('配对题双向且存在于同模块', () => {
    for (const meta of MODULES) {
      const byId = new Map(ITEMS[meta.key].map((item) => [item.id, item]));
      for (const item of ITEMS[meta.key]) {
        if (!item.pairId) continue;
        const target = byId.get(item.pairId);
        expect(target, `${item.id} 的配对题不存在`).toBeDefined();
        expect(target?.pairId).toBe(item.id);
      }
    }
  });

  it('M2.1：兴趣模块只保留 1 对近义改写配对题', () => {
    const pairs = ITEMS.interest.filter((i) => i.pairId);
    expect(pairs).toHaveLength(2);
    expect(pairs.map((i) => i.id).sort()).toEqual(['I-R-01', 'I-R-02']);
    // 互为配对：一题的 pairId 指向另一题
    expect(pairs.map((i) => i.pairId).sort()).toEqual(['I-R-01', 'I-R-02']);
  });

  it('M2.1：I-S-03 为纯 S 条目，不再与 E 型条目重叠', () => {
    const item = ITEMS.interest.find((i) => i.id === 'I-S-03')!;
    expect(item.text).toContain('志愿服务');
    expect(item.text).not.toContain('组织');
  });

  it('M2.1：AD-concern-03 为单管条目（不含"想了也没什么用"）', () => {
    const item = ITEMS.adaptability.find((i) => i.id === 'AD-concern-03')!;
    expect(item.reverse).toBe(true);
    expect(item.text).toBe('我很少去想以后的事。');
    expect(item.text).not.toContain('没什么用');
  });

  it('M2.1：开放题不计入任何维度计分', () => {
    const openItems = Object.values(ITEMS).flat().filter((i) => i.type === 'open');
    expect(openItems.length).toBeGreaterThan(0);
    for (const item of openItems) {
      expect(item.excludeFromScoring, `${item.id} 应标记不计分`).toBe(true);
    }
    const scoredOpen = Object.values(ITEMS)
      .flat()
      .filter((i) => i.type !== 'open' && i.excludeFromScoring);
    expect(scoredOpen).toHaveLength(0);
  });

  it('暖场为 3 滑条 + 1 开放题，且 comfort 用 polarity 而非 reverse 表达负向', () => {
    expect(ITEMS.warmup.filter((i) => i.type === 'slider100')).toHaveLength(3);
    expect(ITEMS.warmup.filter((i) => i.type === 'open')).toHaveLength(1);
    expect(ITEMS.warmup.every((i) => !i.reverse)).toBe(true);
  });

  it('价值观迫选题的每个选项维度都合法', () => {
    const valueDims = MODULES.find((m) => m.key === 'value')!.dimensions;
    for (const item of ITEMS.value) {
      if (item.type !== 'forcedChoice') continue;
      for (const option of item.options) {
        expect(valueDims).toContain(option.dimension);
      }
    }
  });
});

describe('职业库', () => {
  it('共 60 条职业', () => {
    expect(CAREERS).toHaveLength(DATA_TARGETS.careers);
  });

  it('id 唯一', () => {
    expect(new Set(CAREERS.map((c) => c.id)).size).toBe(CAREERS.length);
  });

  it('覆盖 10 个行业', () => {
    expect(new Set(CAREERS.map((c) => c.industry)).size).toBe(DATA_TARGETS.industries);
  });

  it('六型首码各至少 6 条（实际各 10 条）', () => {
    for (const code of HOLLAND_CODES) {
      const count = CAREERS.filter((c) => c.hollandCode[0] === code).length;
      expect(count, `${code} 首码职业数`).toBeGreaterThanOrEqual(DATA_TARGETS.minCareersPerHolland);
    }
  });

  it('hollandCode 均为三位合法字母', () => {
    for (const career of CAREERS) {
      expect(career.hollandCode).toHaveLength(3);
      for (const char of career.hollandCode) {
        expect(HOLLAND_CODES).toContain(char as never);
      }
    }
  });

  it('新兴职业分散在多个行业，不集中于单一类目', () => {
    const emerging = CAREERS.filter((c) => c.isEmerging);
    expect(emerging.length).toBeGreaterThanOrEqual(8);
    const industries = new Set(emerging.map((c) => c.industry));
    expect(industries.size).toBeGreaterThanOrEqual(5);
    const inLifeService = emerging.filter((c) => c.industry === 'life-service').length;
    expect(inLifeService).toBeLessThanOrEqual(2);
  });

  it('abilityDemand 覆盖六维且取值 1–5', () => {
    for (const career of CAREERS) {
      for (const key of ABILITY_KEYS) {
        const value = career.abilityDemand[key as keyof typeof career.abilityDemand];
        expect(Number.isInteger(value), `${career.id}.${key}`).toBe(true);
        expect(value).toBeGreaterThanOrEqual(1);
        expect(value).toBeLessThanOrEqual(5);
      }
    }
  });

  it('majorIds / subjectRelevance / valueSupply 引用均不缺链', () => {
    const majorIds = new Set(MAJORS.map((m) => m.id));
    const subjectKeys = new Set(SUBJECTS.map((s) => s.key));
    for (const career of CAREERS) {
      for (const id of career.majorIds) expect(majorIds, `${career.id}→${id}`).toContain(id);
      for (const key of Object.keys(career.subjectRelevance)) {
        expect(subjectKeys, `${career.id}→${key}`).toContain(key);
      }
      for (const key of career.valueSupply) expect(VALUE_KEYS, `${career.id}→${key}`).toContain(key);
    }
  });

  it('M2.1：c-doctor 的 Holland 码已按 O*NET 定稿为 SIC', () => {
    // O*NET 29-1215.00 Family Medicine Physicians 的 Career Interest Types：
    // Social 87 / Investigative 85 / Conventional 49 / Realistic 46
    const doctor = CAREERS.find((c) => c.id === 'c-doctor')!;
    expect(doctor.hollandCode).toBe('SIC');
  });

  it('每条职业都有日常工作、准备事项与误解澄清', () => {
    for (const career of CAREERS) {
      expect(career.dayInLife.trim().length).toBeGreaterThan(10);
      expect(career.entryActions.length).toBeGreaterThanOrEqual(2);
      expect(career.misconceptions.trim().length).toBeGreaterThan(5);
    }
  });
});

describe('专业库与学科库', () => {
  it('专业 id 唯一且 careerIds 不缺链', () => {
    const careerIds = new Set(CAREERS.map((c) => c.id));
    expect(new Set(MAJORS.map((m) => m.id)).size).toBe(MAJORS.length);
    for (const major of MAJORS) {
      for (const id of major.careerIds) expect(careerIds, `${major.id}→${id}`).toContain(id);
    }
  });

  it('学科 abilities 均为合法能力维度', () => {
    for (const subject of SUBJECTS) {
      for (const ability of subject.abilities) expect(ABILITY_KEYS).toContain(ability);
    }
  });
});

describe('维度定义与配套数据', () => {
  it('各维度定义的 key 与模块注册表一致', () => {
    const expected: Record<string, string[]> = {
      interest: HOLLAND_TYPES.map((t) => t.key),
      ability: ABILITY_DIMENSIONS.map((a) => a.key),
      value: VALUE_KEYS,
      adaptability: ADAPTABILITY_DIMENSIONS.map((a) => a.key),
      decision: DECISION_STYLES.map((d) => d.key),
      personality: TRAIT_DIMENSIONS.map((t) => t.key),
    };
    for (const [module, keys] of Object.entries(expected)) {
      const meta = MODULES.find((m) => m.key === module)!;
      expect(meta.dimensions).toEqual(keys);
    }
  });

  it('每个维度都有演示常模，且年级段微调生效', () => {
    for (const meta of MODULES) {
      for (const dimension of meta.dimensions) {
        expect(BASE_NORMS[meta.key]?.[dimension], `${meta.key}/${dimension}`).toBeDefined();
      }
    }
    const a = getNorm('interest', 'I', '12-14');
    const b = getNorm('interest', 'I', '17-18');
    expect(b.mean).toBeGreaterThan(a.mean);
  });

  it('每个维度的解释文案三档齐全', () => {
    for (const meta of MODULES) {
      const block = MODULE_INTERPRETATIONS[meta.key];
      expect(block, meta.key).toBeDefined();
      for (const dimension of meta.dimensions) {
        const set = block.dimensions[dimension];
        expect(set, `${meta.key}/${dimension}`).toBeDefined();
        expect(set.high.trim()).not.toBe('');
        expect(set.mid.trim()).not.toBe('');
        expect(set.low.trim()).not.toBe('');
      }
    }
  });

  it('兴趣、能力、适应力三维度的行动建议三档齐全', () => {
    const covered = new Set(ACTIONS.map((a) => `${a.module}/${a.dimension}/${a.level}`));
    for (const key of ['interest', 'ability', 'adaptability'] as const) {
      const meta = MODULES.find((m) => m.key === key)!;
      for (const dimension of meta.dimensions) {
        for (const level of ['high', 'mid', 'low']) {
          expect(covered.has(`${key}/${dimension}/${level}`), `${key}/${dimension}/${level}`).toBe(true);
        }
      }
    }
  });

  it('Comfort 维度使用 polarity=negative 而非 reverse（校验器不会误判）', () => {
    const comfortItem = ITEMS.warmup.find((i) => i.dimension === 'comfort');
    expect(comfortItem?.reverse).toBeFalsy();
    expect(ITEMS.warmup.filter((i) => i.reverse)).toHaveLength(0);
  });
});

describe('演示人设', () => {
  it('默认人设为"还没想好选科"的高一学生', () => {
    const persona = DEMO_PERSONAS.find((p) => p.id === DEFAULT_PERSONA_ID)!;
    expect(persona.isDefault).toBe(true);
    expect(persona.gradeBand).toBe('15-16');
    expect(persona.dimensionLevels.information).toBeLessThan(0.35);
  });

  it('默认人设兴趣分化度低（六型得分接近）', () => {
    const persona = DEMO_PERSONAS.find((p) => p.id === DEFAULT_PERSONA_ID)!;
    const levels = HOLLAND_CODES.map((code) => persona.dimensionLevels[code] ?? persona.base);
    expect(Math.max(...levels) - Math.min(...levels)).toBeLessThan(0.15);
  });

  it('填充结果为完整作答且取值在量程内', () => {
    const persona = DEMO_PERSONAS[0];
    const answers = fillPersonaModule(persona, 'interest', 7);
    expect(Object.keys(answers)).toHaveLength(18);
    for (const value of Object.values(answers)) {
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(5);
    }
    const ability = fillPersonaModule(persona, 'ability', 7);
    for (const value of Object.values(ability)) {
      expect(value as number % 10).toBe(0);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(100);
    }
  });

  it('同一 seed 的人设填充结果可复现', () => {
    const persona = DEMO_PERSONAS[1];
    expect(fillPersonaModule(persona, 'decision', 42)).toEqual(
      fillPersonaModule(persona, 'decision', 42),
    );
  });
});
