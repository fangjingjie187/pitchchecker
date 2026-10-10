/** 生成短 ID（无需外部依赖）。用于结果快照、行动计划条目等本地标识 */
export function createId(prefix = ''): string {
  const time = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return prefix ? `${prefix}_${time}${random}` : `${time}${random}`;
}
