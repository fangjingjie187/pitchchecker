import { describe, expect, it } from 'vitest';
import { ITEMS } from '@/data/items';
import {
  computeDimensionStats,
  countAnswered,
  isAnswered,
  scoreNumericItem,
  toInternalScale,
} from './scale';
import { ABILITY_SLIDER } from '@/config/scoring.config';

const interestItems = ITEMS.interest;
const abilityItems = ITEMS.ability;

describe('单题计分', () => {
  it('5 点量表线性映射到 0–100', () => {
    const item = interestItems[0];
    expect(scoreNumericItem(item, 1)).toBe(0);
    expect(scoreNumericItem(item, 3)).toBe(50);
    expect(scoreNumericItem(item, 5)).toBe(100);
  });

  it('反向题先翻转再归一', () => {
    const item = ITEMS.adaptability.find((i) => i.id === 'AD-concern-03')!;
    expect(item.reverse).toBe(true);
    // 作答 5（很符合"很少想以后"）→ 翻转后为 1 → 0 分
    expect(scoreNumericItem(item, 5)).toBe(0);
    expect(scoreNumericItem(item, 1)).toBe(100);
  });

  it('0–100 滑条按原值计分，内部量化为 1–10', () => {
    const item = abilityItems[0];
    expect(scoreNumericItem(item, 0)).toBe(0);
    expect(scoreNumericItem(item, 70)).toBe(70);
    expect(scoreNumericItem(item, 100)).toBe(100);
    expect(toInternalScale(0)).toBeCloseTo(1, 6);
    expect(toInternalScale(100)).toBeCloseTo(10, 6);
    expect(ABILITY_SLIDER.step).toBe(10);
  });

  it('不计分条目（开放题）返回 null', () => {
    const open = ITEMS.warmup.find((i) => i.id === 'WU-open-01')!;
    expect(scoreNumericItem(open, 5)).toBeNull();
  });

  it('超出量程的作答视为无效', () => {
    const item = interestItems[0];
    expect(scoreNumericItem(item, 0)).toBeNull();
    expect(scoreNumericItem(item, 9)).toBeNull();
  });
});

describe('维度统计', () => {
  it('兴趣模块按维度求平均并按分数降序', () => {
    const answers: Record<string, number> = {};
    for (const item of interestItems) {
      answers[item.id] = item.dimension === 'S' ? 5 : 1;
    }
    const stats = computeDimensionStats('interest', answers);
    expect(stats[0].key).toBe('S');
    expect(stats[0].mean).toBe(100);
    expect(stats.find((s) => s.key === 'R')?.mean).toBe(0);
    expect(stats).toHaveLength(6);
  });

  it('价值观模块合成评定分与迫选分', () => {
    const answers: Record<string, string | number> = {};
    for (const item of ITEMS.value) {
      if (item.type === 'forcedChoice') {
        answers[item.id] = item.options[0].id;
      } else {
        answers[item.id] = 5; // 全部满分
      }
    }
    const stats = computeDimensionStats('value', answers);
    // reward 出现在 FC-01、FC-03，两次都选中第一个选项 → reward 满分
    const reward = stats.find((s) => s.key === 'reward')!;
    expect(reward.mean).toBeCloseTo(100, 5);
    // prestige 出现在 FC-02、FC-03；FC-02 选的是 prestige（第一个选项），FC-03 选的是 reward → 50
    const prestige = stats.find((s) => s.key === 'prestige')!;
    expect(prestige.mean).toBeCloseTo(50, 5);
    // security：有评定题（100），且出现在 FC-01 但未被选中 → 0.6×100 + 0.4×0 = 60
    const security = stats.find((s) => s.key === 'security')!;
    expect(security.mean).toBeCloseTo(60, 5);
    // altruism：只有评定题、不出现在任何迫选题中 → 直接取评定分
    const altruism = stats.find((s) => s.key === 'altruism')!;
    expect(altruism.mean).toBeCloseTo(100, 5);
    expect(stats).toHaveLength(10);
  });

  it('未作答的维度不出现在结果中', () => {
    const stats = computeDimensionStats('interest', { 'I-S-01': 5 });
    expect(stats.map((s) => s.key)).toEqual(['S']);
  });
});

describe('作答完成度', () => {
  it('开放题留空也算已处理', () => {
    const open = ITEMS.warmup.find((i) => i.id === 'WU-open-01')!;
    expect(isAnswered(open, '')).toBe(true);
    expect(countAnswered(ITEMS.warmup, { 'WU-open-01': '' })).toBe(1);
  });

  it('量表题必须有值才算作答', () => {
    const item = interestItems[0];
    expect(isAnswered(item, undefined)).toBe(false);
    expect(isAnswered(item, 3)).toBe(true);
  });

  it('全部作答后计数等于题量', () => {
    const answers: Record<string, number | string> = {};
    for (const item of ITEMS.ability) answers[item.id] = 50;
    expect(countAnswered(ITEMS.ability, answers)).toBe(12);
  });
});
