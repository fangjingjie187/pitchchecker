import { describe, expect, it } from 'vitest';
import { createInitialState } from './persistence';
import { reducer } from './reducer';
import type { AppState } from '@/types';

describe('作答 reducer', () => {
  it('同意后记录时间戳', () => {
    const next = reducer(createInitialState(), { type: 'CONSENT_ACCEPT' });
    expect(next.consent.accepted).toBe(true);
    expect(next.consent.acceptedAt).toBeTypeOf('number');
  });

  it('作答会写入对应模块并更新题序', () => {
    let state: AppState = reducer(createInitialState(), {
      type: 'ANSWER',
      module: 'interest',
      itemId: 'I-R-01',
      value: 4,
    });
    state = reducer(state, { type: 'SET_INDEX', module: 'interest', index: 1 });
    expect(state.answers.interest?.answers['I-R-01']).toBe(4);
    expect(state.answers.interest?.currentIndex).toBe(1);
  });

  it('修改答案会覆盖旧值', () => {
    let state = reducer(createInitialState(), {
      type: 'ANSWER',
      module: 'value',
      itemId: 'V-01',
      value: 2,
    });
    state = reducer(state, { type: 'ANSWER', module: 'value', itemId: 'V-01', value: 5 });
    expect(state.answers.value?.answers['V-01']).toBe(5);
  });

  it('累计作答时长', () => {
    let state = reducer(createInitialState(), {
      type: 'ADD_DURATION',
      module: 'ability',
      deltaMs: 1500,
    });
    state = reducer(state, { type: 'ADD_DURATION', module: 'ability', deltaMs: 2500 });
    expect(state.answers.ability?.durationMs).toBe(4000);
  });

  it('完成模块与重置模块', () => {
    let state = reducer(createInitialState(), { type: 'COMPLETE_MODULE', module: 'interest' });
    expect(state.answers.interest?.completed).toBe(true);
    state = reducer(state, { type: 'RESET_MODULE', module: 'interest' });
    expect(state.answers.interest).toBeUndefined();
  });

  it('RESET_ALL 清空作答与结果但保留版本号', () => {
    let state = reducer(createInitialState(), { type: 'CONSENT_ACCEPT' });
    state = reducer(state, {
      type: 'ADD_RESULT',
      snapshot: {
        id: 'r1',
        createdAt: Date.now(),
        gradeBand: '15-16',
        mode: 'quick',
        report: {} as never,
      },
    });
    state = reducer(state, { type: 'RESET_ALL' });
    expect(state.results).toHaveLength(0);
    expect(state.consent.accepted).toBe(false);
    expect(state.version).toBe(createInitialState().version);
  });

  it('结果快照最多保留 20 条', () => {
    let state = createInitialState();
    for (let i = 0; i < 25; i += 1) {
      state = reducer(state, {
        type: 'ADD_RESULT',
        snapshot: {
          id: `r${i}`,
          createdAt: Date.now(),
          gradeBand: '15-16',
          mode: 'full',
          report: {} as never,
        },
      });
    }
    expect(state.results).toHaveLength(20);
    expect(state.results[0].id).toBe('r24');
  });
});
