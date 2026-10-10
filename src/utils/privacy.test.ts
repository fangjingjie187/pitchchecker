import { describe, expect, it } from 'vitest';
import { assertNoIdentity, stripIdentity } from './privacy';

describe('身份信息拦截（合规）', () => {
  it('不含身份字段时通过', () => {
    expect(() => assertNoIdentity({ holland: 'SAI', scores: [1, 2, 3] }, '报告')).not.toThrow();
  });

  it('出现学校字段时抛错', () => {
    expect(() => assertNoIdentity({ school: '某中学' }, '报告')).toThrow(/身份信息/);
  });

  it('嵌套出现 nickname 时抛错', () => {
    expect(() =>
      assertNoIdentity({ result: { profile: { nickname: '小罗' } } }, '备份文件'),
    ).toThrow(/身份信息/);
  });

  it('stripIdentity 会剔除身份字段', () => {
    const cleaned = stripIdentity({ nickname: '小罗', gradeBand: '15-16', results: [{ id: 'r1' }] });
    expect(cleaned).toEqual({ gradeBand: '15-16', results: [{ id: 'r1' }] });
  });

  it('stripIdentity 支持额外剔除字段', () => {
    const cleaned = stripIdentity({ token: 'abc', keep: 1 }, ['token']);
    expect(cleaned).toEqual({ keep: 1 });
  });
});
