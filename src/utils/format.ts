export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function round(value: number, digits = 0): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

/** 0–1 → 0–100 百分比整数 */
export function toPercent(ratio: number): number {
  return Math.round(clamp(ratio, 0, 1) * 100);
}

/** 百分等级 → 通俗描述（避免"排名"带来的比较压力） */
export function describePercentile(percentile: number): string {
  if (percentile >= 80) return '明显高于参考区间多数同学';
  if (percentile >= 65) return '略高于参考区间多数同学';
  if (percentile > 35) return '与参考区间多数同学接近';
  if (percentile > 20) return '略低于参考区间多数同学';
  return '目前相对薄弱，也是最容易提升的部分';
}

export function formatDate(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatDateTime(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${formatDate(ts)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** 毫秒 → "约 6 分钟" */
export function formatMinutes(ms: number): string {
  const minutes = Math.max(1, Math.round(ms / 60000));
  return `约 ${minutes} 分钟`;
}
