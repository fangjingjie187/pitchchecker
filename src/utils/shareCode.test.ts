import { describe, expect, it } from 'vitest';
import { decodeShareCode, encodeShareCode, isShareCodeValid, type SharePayload } from './shareCode';

const payload: SharePayload = {
  version: 1,
  gradeBand: '15-16',
  holland: 'SAI',
  interests: [40, 82, 66, 91, 55, 30],
  abilities: [70, 60, 50, 40, 90, 80],
  values: [0, 3, 7],
  warmup: [30, 80, 20],
  adaptability: [65, 70, 55, 60],
};

describe('分享码编解码', () => {
  it('编码后可完整还原', () => {
    const code = encodeShareCode(payload);
    const decoded = decodeShareCode(code);
    expect(decoded.gradeBand).toBe(payload.gradeBand);
    expect(decoded.holland).toBe('SAI');
    expect(decoded.interests).toEqual(payload.interests);
    expect(decoded.abilities).toEqual(payload.abilities);
    expect(decoded.values).toEqual(payload.values);
    expect(decoded.warmup).toEqual(payload.warmup);
    expect(decoded.adaptability).toEqual(payload.adaptability);
  });

  it('包含分隔符且长度可控', () => {
    const code = encodeShareCode(payload);
    expect(code).toContain('-');
    expect(code.replace(/-/g, '').length).toBeLessThanOrEqual(48);
  });

  it('缺失一个字符时校验失败', () => {
    const code = encodeShareCode(payload);
    const broken = code.slice(0, -2);
    expect(isShareCodeValid(broken)).toBe(false);
  });

  it('篡改中间字符时校验失败', () => {
    const code = encodeShareCode(payload);
    const chars = code.replace(/-/g, '').split('');
    const index = Math.floor(chars.length / 2);
    chars[index] = chars[index] === 'Z' ? 'Y' : 'Z';
    expect(isShareCodeValid(chars.join(''))).toBe(false);
  });

  it('小写与空格容错', () => {
    const code = encodeShareCode(payload);
    expect(decodeShareCode(` ${code.toLowerCase()} `).holland).toBe('SAI');
  });
});
