import { describe, expect, it } from 'vitest';
import { ENABLED_PRIORITIES, MODULES, getActiveModules, getModule } from './modules';
import { DATA_TARGETS } from './data.config';
import { MATCH_WEIGHTS } from './scoring.config';

describe('模块注册表', () => {
  it('key 与 order 唯一', () => {
    const keys = MODULES.map((m) => m.key);
    const orders = MODULES.map((m) => m.order);
    expect(new Set(keys).size).toBe(keys.length);
    expect(new Set(orders).size).toBe(orders.length);
  });

  it('P0 三模块题量与决策一致：兴趣 18 / 能力 12 / 价值观 10', () => {
    expect(getModule('interest')?.itemCount).toBe(18);
    expect(getModule('ability')?.itemCount).toBe(12);
    expect(getModule('value')?.itemCount).toBe(10);
  });

  it('P1 两模块题量：适应力 12 / 决策风格 10', () => {
    expect(getModule('adaptability')?.itemCount).toBe(12);
    expect(getModule('decision')?.itemCount).toBe(10);
  });

  it('暖场为 3 滑条 + 1 开放题，且维度为 MVS 三构念', () => {
    const warmup = getModule('warmup');
    expect(warmup?.itemCount).toBe(4);
    expect(warmup?.dimensions).toEqual(['clarity', 'comfort', 'information']);
  });

  it('快速模式只包含暖场与 P0 三模块', () => {
    const quick = getActiveModules({ quickMode: true }).map((m) => m.key);
    expect(quick).toEqual(['warmup', 'interest', 'ability', 'value']);
  });

  it('完整模式按 ENABLED_PRIORITIES 过滤且按 order 排序', () => {
    const all = getActiveModules();
    const orders = all.map((m) => m.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
    for (const meta of all) {
      expect(ENABLED_PRIORITIES).toContain(meta.priority);
    }
  });

  it('决策风格使用 GDMS 五风格并标注自编改编', () => {
    const decision = getModule('decision');
    expect(decision?.dimensions).toEqual([
      'rational',
      'intuitive',
      'dependent',
      'avoidant',
      'spontaneous',
    ]);
    expect(decision?.theorySource).toContain('Scott & Bruce');
    expect(decision?.theorySource).toContain('自编改编');
  });

  it('匹配权重之和为 1', () => {
    const sum = MATCH_WEIGHTS.interest + MATCH_WEIGHTS.ability + MATCH_WEIGHTS.value;
    expect(sum).toBeCloseTo(1, 6);
  });

  it('反向题只允许出现在人格与适应力模块', () => {
    expect(DATA_TARGETS.reverseAllowedModules).toEqual(['personality', 'adaptability']);
  });
});
