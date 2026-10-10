import { describe, expect, it } from 'vitest';
import { createInitialState } from '@/store/persistence';
import { DEMO_PERSONAS } from '@/data/demoPersonas';
import { fillPersonaModule } from './personaFiller';
import { buildReport } from './buildReport';
import { MODULES } from '@/config/modules';
import type { AppState, ModuleKey } from '@/types';

/** 按人设填满指定模块并标记完成 */
function completeModules(state: AppState, keys: ModuleKey[]): AppState {
  const persona = DEMO_PERSONAS[0];
  let next = { ...state };
  for (const key of keys) {
    const meta = MODULES.find((m) => m.key === key)!;
    const answers = fillPersonaModule(persona, key, 20261009);
    const answerMap = next.answers[key] ?? {
      answers: {},
      updatedAt: Date.now(),
      currentIndex: 0,
      completed: false,
      durationMs: 0,
    };
    const merged = {
      ...answerMap,
      answers: { ...answerMap.answers, ...answers },
      completed: true,
      updatedAt: Date.now(),
      durationMs: meta.itemCount * 4000,
    };
    next = { ...next, answers: { ...next.answers, [key]: merged } };
  }
  return next;
}

function baseState(quickMode = false): AppState {
  return {
    ...createInitialState(),
    profile: {
      nickname: '',
      gradeBand: '15-16',
      gender: 'undisclosed',
      regionType: 'undisclosed',
      createdAt: Date.now(),
    },
    settings: { quickMode, demoMode: false, lastPersonaId: null },
  };
}

describe('报告组装', () => {
  it('仅完成 P0 时，报告主体完整成立，适应力/决策/人格为 null（降级）', () => {
    const state = completeModules(baseState(false), ['warmup', 'interest', 'ability', 'value']);
    const report = buildReport(state, '15-16');

    expect(report.holland).not.toBeNull();
    expect(report.interest).not.toBeNull();
    expect(report.ability).not.toBeNull();
    expect(report.value).not.toBeNull();
    expect(report.matches.length).toBeGreaterThan(0);
    expect(report.pathway).not.toBeNull();
    expect(report.actions.length).toBeGreaterThan(0);
    expect(report.narrative.length).toBeGreaterThan(50);

    // 降级：未作答模块为 null，由界面渲染"未作答 + 补测入口"
    expect(report.adaptability).toBeNull();
    expect(report.decision).toBeNull();
    expect(report.personality).toBeNull();
  });

  it('完整模式下全部完成时，七个模块都有结果', () => {
    const state = completeModules(baseState(false), [
      'warmup',
      'interest',
      'ability',
      'value',
      'adaptability',
      'decision',
      'personality',
    ]);
    const report = buildReport(state, '15-16');
    for (const key of [
      'warmup',
      'interest',
      'ability',
      'value',
      'adaptability',
      'decision',
      'personality',
    ] as const) {
      expect(report[key]).not.toBeNull();
    }
    expect(report.mode).toBe('full');
  });

  it('快速模式只包含 P0 模块', () => {
    const state = completeModules(baseState(true), ['warmup', 'interest', 'ability', 'value']);
    const report = buildReport(state, '15-16');
    expect(report.mode).toBe('quick');
    expect(report.modules).toEqual(['warmup', 'interest', 'ability', 'value']);
  });

  it('默认人设（低分化）产出的 Holland 分化度较低', () => {
    const state = completeModules(baseState(false), ['interest', 'ability', 'value', 'warmup']);
    const report = buildReport(state, '15-16');
    expect(report.holland!.differentiation).toBeLessThan(30);
  });

  it('低分化人设：匹配理由首句注明"相对均衡的兴趣图谱"', () => {
    const state = completeModules(baseState(false), ['interest', 'ability', 'value', 'warmup']);
    const report = buildReport(state, '15-16');
    expect(report.matches.length).toBeGreaterThan(0);
    expect(report.matches[0].reasons[0]).toContain('相对均衡');
  });

  it('正常分化人设：匹配理由不出现"相对均衡"注记', () => {
    const persona = DEMO_PERSONAS.find((p) => p.id === 'p-sci-tech')!;
    const answers: AppState['answers'] = {};
    for (const key of ['interest', 'ability', 'value', 'warmup'] as const) {
      const meta = MODULES.find((m) => m.key === key)!;
      answers[key] = {
        answers: fillPersonaModule(persona, key, 20261009),
        updatedAt: Date.now(),
        currentIndex: 0,
        completed: true,
        durationMs: meta.itemCount * 4000,
      };
    }
    const state: AppState = {
      ...createInitialState(),
      profile: {
        nickname: '',
        gradeBand: '15-16',
        gender: 'undisclosed',
        regionType: 'undisclosed',
        createdAt: Date.now(),
      },
      answers,
    };
    const report = buildReport(state, '15-16');
    expect(report.matches[0].reasons[0]).not.toContain('相对均衡');
  });
});
