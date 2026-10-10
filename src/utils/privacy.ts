/**
 * 合规保障：任何导出文件、分享码、报告对象都不得包含身份信息。
 * 该模块在导出路径上做最后一道拦截（开发态抛错，生产态告警）。
 */

export const FORBIDDEN_FIELD_HINTS = [
  'name',
  '姓名',
  'realName',
  'nickname',
  'nick',
  'school',
  '学校',
  'className',
  '班级',
  'studentId',
  '学号',
  'phone',
  '手机',
  'idCard',
  '身份证',
  'address',
  '地址',
  'teacher',
  '班主任',
] as const;

function collectKeys(value: unknown, keys: Set<string>, depth = 0): void {
  if (depth > 6 || value === null || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    value.forEach((item) => collectKeys(item, keys, depth + 1));
    return;
  }
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    keys.add(key);
    collectKeys(child, keys, depth + 1);
  }
}

/**
 * 检查对象中是否出现身份信息字段。
 * 开发态（import.meta.env.DEV）直接抛错，避免问题流入交付版本。
 */
export function assertNoIdentity(payload: unknown, label = '导出内容'): void {
  const keys = new Set<string>();
  collectKeys(payload, keys);
  const hits = FORBIDDEN_FIELD_HINTS.filter((hint) =>
    [...keys].some((key) => key.toLowerCase() === hint.toLowerCase()),
  );
  if (hits.length === 0) return;

  const message = `${label}包含疑似身份信息字段：${hits.join('、')}。合规要求：报告与导出内容不得出现学校、姓名等身份信息。`;
  if (import.meta.env?.DEV) {
    throw new Error(message);
  }
  // eslint-disable-next-line no-console
  console.warn(`[privacy] ${message}`);
}

/**
 * 结构化脱敏：从对象中剔除身份相关字段（默认用于导出与分享）。
 * 注意：Profile.nickname 仅用于本机识别，一律不随任何导出物离开设备。
 */
export function stripIdentity<T>(payload: T, extraKeys: string[] = []): T {
  const drop = new Set<string>([...FORBIDDEN_FIELD_HINTS, ...extraKeys].map((k) => k.toLowerCase()));
  const clone = <V>(value: V, depth = 0): V => {
    if (depth > 6 || value === null || typeof value !== 'object') return value;
    if (Array.isArray(value)) return value.map((item) => clone(item, depth + 1)) as unknown as V;
    const out: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      if (drop.has(key.toLowerCase())) continue;
      out[key] = clone(child, depth + 1);
    }
    return out as V;
  };
  return clone(payload);
}
