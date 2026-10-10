import { describe, expect, it } from 'vitest';
import { buildClosingFeedback } from './closingFeedback';
import { computeDimensionStats } from './scale';
import { ITEMS } from '@/data/items';
import { CLOSING_FEEDBACK_TEMPLATES } from '@/data/interpretations';
import { getModule } from '@/config/modules';

describe('模块即时小结反馈', () => {
  it('兴趣模块返回主导类型与提示', () => {
    const answers: Record<string, number> = {};
    for (const item of ITEMS.interest) answers[item.id] = item.dimension === 'A' ? 5 : 2;
    const stats = computeDimensionStats('interest', answers);
    const text = buildClosingFeedback('interest', stats);
    expect(text).toContain('艺术型');
    expect(text).not.toContain('{');
  });

  it('能力模块返回最高与最低的维度名', () => {
    const answers: Record<string, number> = {};
    for (const item of ITEMS.ability) {
      answers[item.id] = item.dimension === 'logic' ? 100 : item.dimension === 'spatial' ? 0 : 50;
    }
    const stats = computeDimensionStats('ability', answers);
    const text = buildClosingFeedback('ability', stats);
    expect(text).toContain('逻辑数理');
    expect(text).toContain('空间想象');
    expect(text).not.toContain('{');
  });

  it('价值观模块列出前三价值观', () => {
    const answers: Record<string, number | string> = {};
    for (const item of ITEMS.value) {
      if (item.type === 'forcedChoice') answers[item.id] = item.options[0].id;
      else answers[item.id] = item.dimension === 'altruism' ? 5 : 3;
    }
    const stats = computeDimensionStats('value', answers);
    const text = buildClosingFeedback('value', stats);
    expect(text).toContain('、');
    expect(text).not.toContain('{');
  });

  it('空统计时返回空字符串，不产生占位符残留', () => {
    expect(buildClosingFeedback('interest', [])).toBe('');
  });

  it('每个模块的模板占位符都能被填充', () => {
    const modules = ['interest', 'ability', 'value', 'adaptability', 'decision', 'personality'] as const;
    for (const key of modules) {
      const answers: Record<string, number | string> = {};
      for (const item of ITEMS[key]) {
        if (item.type === 'forcedChoice') answers[item.id] = item.options[0].id;
        else answers[item.id] = 4;
      }
      const stats = computeDimensionStats(key, answers);
      const text = buildClosingFeedback(key, stats);
      expect(text, key).not.toContain('{');
      expect(text.length, key).toBeGreaterThan(5);
    }
  });
});

describe('作答指导语（硬性要求）', () => {
  it('能力模块指导语为 Bandura 效能标尺措辞', () => {
    expect(getModule('ability')?.prompt).toBe('你有多大信心做好这件事？');
  });

  it('兴趣模块指导语为喜欢程度', () => {
    expect(getModule('interest')?.prompt).toBe('你喜欢做这件事的程度');
  });

  it('暖场模块无即时小结（仅为前置滑条）', () => {
    expect(CLOSING_FEEDBACK_TEMPLATES.warmup).toBeTruthy();
    expect(getModule('warmup')?.closingFeedback).toBe(false);
  });
});
