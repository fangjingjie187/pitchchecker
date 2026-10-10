import { describe, expect, it } from 'vitest';
import { shouldAutoAdvance, shouldAutoComplete } from './advance';

const base = {
  itemType: 'likert5' as const,
  wasUnansweredOnArrival: true,
  alreadyAdvanced: false,
  isLast: false,
};

describe('自动跳题判定', () => {
  it('首次作答未答过的量表题 → 自动跳', () => {
    expect(shouldAutoAdvance(base)).toBe(true);
  });

  it('回退到已作答的题目 → 不自动跳（核心防误触）', () => {
    expect(shouldAutoAdvance({ ...base, wasUnansweredOnArrival: false })).toBe(false);
  });

  it('同一题已自动跳过一次 → 不再重复跳', () => {
    expect(shouldAutoAdvance({ ...base, alreadyAdvanced: true })).toBe(false);
  });

  it('滑条与开放题不自动跳', () => {
    expect(shouldAutoAdvance({ ...base, itemType: 'slider100' })).toBe(false);
    expect(shouldAutoAdvance({ ...base, itemType: 'open' })).toBe(false);
  });

  it('迫选题自动跳，最后一题不跳', () => {
    expect(shouldAutoAdvance({ ...base, itemType: 'forcedChoice' })).toBe(true);
    expect(shouldAutoAdvance({ ...base, isLast: true })).toBe(false);
  });
});

describe('完成态自动进入判定', () => {
  it('选择题全部作答后自动进入完成态', () => {
    expect(shouldAutoComplete({ itemType: 'likert5', answered: 18, total: 18 })).toBe(true);
    expect(shouldAutoComplete({ itemType: 'slider100', answered: 3, total: 3 })).toBe(true);
  });

  it('未全部作答不进入完成态', () => {
    expect(shouldAutoComplete({ itemType: 'likert5', answered: 3, total: 4 })).toBe(false);
  });

  it('开放题全部作答后也不自动进入，需手动点完成（F1 核心）', () => {
    expect(shouldAutoComplete({ itemType: 'open', answered: 4, total: 4 })).toBe(false);
  });
});
