import { GRADE_BAND_KEYS, type GradeBand } from '@/types';

/**
 * 分享码：把报告摘要编码为一串可复制的字符（Crockford Base32 + 校验位）。
 * 只包含结果向量，不含昵称、学校等任何身份信息。
 * 用途：换设备查看简版结果 / 同学之间相互参考。
 */

const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const VERSION = 1;

export interface SharePayload {
  version: number;
  gradeBand: GradeBand;
  /** Holland 三字母码，未测时为 '---' */
  holland: string;
  /** 六型得分 0–100 */
  interests: number[];
  /** 六维能力自信度 0–100 */
  abilities: number[];
  /** Top3 价值观在 value 维度表中的下标 */
  values: number[];
  /** 暖场三滑条 0–100 */
  warmup: number[];
  /** 生涯适应力 4C 0–100，未测时为空数组 */
  adaptability: number[];
}

const EMPTY_HOLLAND = '---';

function byte(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function encodeBytes(payload: SharePayload): Uint8Array {
  const gradeIndex = Math.max(0, GRADE_BAND_KEYS.indexOf(payload.gradeBand));
  const holland = (payload.holland || EMPTY_HOLLAND).padEnd(3, '-').slice(0, 3);
  const bytes: number[] = [
    byte(payload.version),
    byte(gradeIndex),
    ...holland.split('').map((c) => byte(c.charCodeAt(0))),
  ];
  const pushVector = (vector: number[], length: number) => {
    for (let i = 0; i < length; i += 1) {
      bytes.push(byte(vector[i] ?? 0));
    }
  };
  pushVector(payload.interests, 6);
  pushVector(payload.abilities, 6);
  pushVector(payload.values, 3);
  pushVector(payload.warmup, 3);
  pushVector(payload.adaptability, 4);
  return Uint8Array.from(bytes);
}

function decodeBytes(bytes: Uint8Array): SharePayload {
  if (bytes.length < 27) throw new Error('分享码长度不足');
  let i = 0;
  const version = bytes[i++];
  const gradeBand = GRADE_BAND_KEYS[bytes[i++]] ?? GRADE_BAND_KEYS[1];
  const holland = String.fromCharCode(bytes[i++], bytes[i++], bytes[i++]);
  const readVector = (length: number): number[] => {
    const out: number[] = [];
    for (let k = 0; k < length; k += 1) out.push(bytes[i++]);
    return out;
  };
  return {
    version,
    gradeBand,
    holland,
    interests: readVector(6),
    abilities: readVector(6),
    values: readVector(3),
    warmup: readVector(3),
    adaptability: readVector(4),
  };
}

function bytesToBase32(bytes: Uint8Array): string {
  let bits = 0;
  let value = 0;
  let out = '';
  for (const b of bytes) {
    value = (value << 8) | b;
    bits += 8;
    while (bits >= 5) {
      out += ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += ALPHABET[(value << (5 - bits)) & 31];
  return out;
}

function base32ToBytes(input: string): Uint8Array {
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const ch of input) {
    const index = ALPHABET.indexOf(ch);
    if (index < 0) throw new Error(`分享码包含无效字符：${ch}`);
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Uint8Array.from(out);
}

function checksumChar(bytes: Uint8Array): string {
  let sum = 0;
  for (const b of bytes) sum = (sum + b) % 32;
  return ALPHABET[sum];
}

/** 归一化用户输入：去分隔符、Crockford 易混字符映射、转大写 */
function normalize(input: string): string {
  return input
    .toUpperCase()
    .replace(/[\s-]/g, '')
    .replace(/O/g, '0')
    .replace(/[IL]/g, '1')
    .replace(/U/g, 'V');
}

export function encodeShareCode(payload: SharePayload): string {
  const bytes = encodeBytes({ ...payload, version: VERSION });
  const body = bytesToBase32(bytes);
  const code = body + checksumChar(bytes);
  return (code.match(/.{1,5}/g) ?? []).join('-');
}

export function decodeShareCode(code: string): SharePayload {
  const normalized = normalize(code);
  if (normalized.length < 2) throw new Error('分享码为空');
  const body = normalized.slice(0, -1);
  const check = normalized.slice(-1);
  const bytes = base32ToBytes(body);
  if (checksumChar(bytes) !== check) {
    throw new Error('分享码校验失败，请检查是否复制完整');
  }
  const payload = decodeBytes(bytes);
  if (payload.version !== VERSION) {
    throw new Error(`分享码版本不匹配（${payload.version}），请使用当前版本生成的分享码`);
  }
  return payload;
}

export function isShareCodeValid(code: string): boolean {
  try {
    decodeShareCode(code);
    return true;
  } catch {
    return false;
  }
}
