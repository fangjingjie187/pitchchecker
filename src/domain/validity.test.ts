import { describe, expect, it } from 'vitest';
import { ITEMS } from '@/data/items';
import { VALIDITY } from '@/config/scoring.config';
import { checkValidity, describeConfidence } from './validity';
import { fillPersonaModule } from './personaFiller';
import { DEMO_PERSONAS } from '@/data/demoPersonas';

function fullAnswers(module: 'interest' | 'ability', value: number) {
  const answers: Record<string, number> = {};
  for (const item of ITEMS[module]) answers[item.id] = value;
  return answers;
}

describe('作答有效性检验', () => {
  it('完整、正常的作答不产生提示', () => {
    const persona = DEMO_PERSONAS[1];
    const answers = fillPersonaModule(persona, 'interest', 3) as Record<string, number>;
    const flags = checkValidity({
      module: 'interest',
      answers,
      durationMs: ITEMS.interest.length * 5000,
    });
    expect(flags).toHaveLength(0);
    expect(describeConfidence(flags)).toContain('未见明显');
  });

  it('未答完时提示 incomplete', () => {
    const flags = checkValidity({ module: 'interest', answers: { 'I-R-01': 3 } });
    expect(flags.some((f) => f.code === 'incomplete')).toBe(true);
  });

  it('直线作答（全部同一取值）时提示 straightLine', () => {
    const flags = checkValidity({
      module: 'interest',
      answers: fullAnswers('interest', 3),
      durationMs: 60000,
    });
    expect(flags.some((f) => f.code === 'straightLine')).toBe(true);
  });

  it('作答过快时提示 tooFast', () => {
    const persona = DEMO_PERSONAS[1];
    const answers = fillPersonaModule(persona, 'interest', 3) as Record<string, number>;
    const flags = checkValidity({
      module: 'interest',
      answers,
      durationMs: ITEMS.interest.length * (VALIDITY.minMsPerItem - 200),
    });
    expect(flags.some((f) => f.code === 'tooFast')).toBe(true);
  });

  it('近义配对题作答差异过大时提示 inconsistentPair', () => {
    const answers = fullAnswers('interest', 3);
    answers['I-R-01'] = 5;
    answers['I-R-02'] = 1; // 同一件事的两种说法，差 4 档
    const flags = checkValidity({
      module: 'interest',
      answers,
      durationMs: 60000,
    });
    expect(flags.some((f) => f.code === 'inconsistentPair')).toBe(true);
  });

  it('配对题作答一致时不提示', () => {
    const answers = fullAnswers('interest', 3);
    answers['I-R-01'] = 4;
    answers['I-R-02'] = 5; // 差 1 档，属于正常波动
    const flags = checkValidity({ module: 'interest', answers, durationMs: 60000 });
    expect(flags.some((f) => f.code === 'inconsistentPair')).toBe(false);
  });

  it('minStdDev 在 0–100 归一化尺度上计算（不是 1–5 原始分）', () => {
    // 原始 1–5 上 SD ≈ 1（在 1–5 尺度上属于"很低"），归一化后 SD = 25 → 不应触发
    const mild: Record<string, number> = {};
    ITEMS.interest.forEach((item, i) => {
      mild[item.id] = [3, 4, 3, 2, 3, 4, 3, 2, 3, 4, 3, 2, 3, 4, 3, 2, 3, 4][i % 18];
    });
    const flagsMild = checkValidity({ module: 'interest', answers: mild, durationMs: 60000 });
    expect(flagsMild.some((f) => f.code === 'lowVariance')).toBe(false);

    // 归一化后 SD < VALIDITY.minStdDev（4）→ 应触发
    const flat = fullAnswers('ability', 50);
    flat['AB-verbal-01'] = 55;
    flat['AB-verbal-02'] = 45; // 归一化 SD ≈ 2.1 < 4
    const flagsFlat = checkValidity({ module: 'ability', answers: flat, durationMs: 60000 });
    expect(flagsFlat.some((f) => f.code === 'lowVariance')).toBe(true);

    // 阈值本身必须落在 0–100 量纲内（若有人误改成 ≤2，规则在归一化尺度上形同虚设）
    expect(VALIDITY.minStdDev).toBeGreaterThan(2);
    expect(VALIDITY.minStdDev).toBeLessThan(100);
  });

  it('区分度过低时提示 lowVariance', () => {
    const answers = fullAnswers('ability', 50);
    answers['AB-verbal-01'] = 60; // 制造极小波动
    const flags = checkValidity({ module: 'ability', answers, durationMs: 60000 });
    expect(flags.some((f) => f.code === 'lowVariance')).toBe(true);
  });

  it('所有提示均为 warn 级，不判定作答无效', () => {
    const flags = checkValidity({
      module: 'interest',
      answers: fullAnswers('interest', 3),
      durationMs: 1000,
    });
    expect(flags.every((f) => f.level === 'warn')).toBe(true);
    expect(describeConfidence(flags)).not.toContain('无效');
  });
});
