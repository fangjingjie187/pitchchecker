import { ITEMS } from '@/data/items';
import { scoreNumericItem } from './scale';
import sampleRaw from '@/data/sampleResponses.json';
import type { AssessmentItem, ModuleKey, SampleResponsesFile } from '@/types';

// JSON 字面量推断为各模块精确 key 的联合类型，这里收窄到统一契约便于索引
const sample = sampleRaw as SampleResponsesFile;

/**
 * 心理测量学方法演示（仅用于 About 仪表盘）。
 *
 * ⚠ 数据源为 sampleResponses.json —— 由种子随机**离线生成的模拟数据**，
 * 不是真实受测者数据。所有指标（Cronbach α、相关矩阵、分布）仅用于演示计算链路，
 * 不能作为本量表信效度的实证依据。
 */

const responses = sample.responses;

function variance(values: number[]): number {
  const n = values.length;
  if (n < 2) return 0;
  const m = values.reduce((s, v) => s + v, 0) / n;
  return values.reduce((s, v) => s + (v - m) ** 2, 0) / (n - 1);
}

function mean(values: number[]): number {
  return values.reduce((s, v) => s + v, 0) / values.length;
}

/** Cronbach α：条目数 < 2 或作答不足时返回 null（表示不适用） */
export function cronbachAlpha(
  items: AssessmentItem[],
  answers: Record<string, number>[],
): number | null {
  const scored = items.filter(
    (item) =>
      !item.excludeFromScoring && (item.type === 'likert5' || item.type === 'slider100'),
  );
  const k = scored.length;
  if (k < 2) return null;

  const itemScores: number[][] = scored.map((item) => {
    const scores: number[] = [];
    for (const record of answers) {
      const raw = record[item.id];
      if (typeof raw !== 'number') continue;
      const value = scoreNumericItem(item, raw);
      if (value !== null) scores.push(value);
    }
    return scores;
  });
  const n = Math.min(...itemScores.map((scores) => scores.length));
  if (n < 2) return null;
  const aligned = itemScores.map((scores) => scores.slice(0, n));

  const itemVar = aligned.map(variance);
  const totals = Array.from({ length: n }, (_, r) =>
    aligned.reduce((sum, item) => sum + item[r], 0),
  );
  const totalVar = variance(totals);
  if (totalVar === 0) return null;
  const alpha = (k / (k - 1)) * (1 - itemVar.reduce((s, v) => s + v, 0) / totalVar);
  return Math.round(alpha * 100) / 100;
}

/** 各模块各维度的 Cronbach α（价值观测值为 null = 单条目维度不适用 α） */
export function dimensionAlphas(): Record<ModuleKey, Record<string, number | null>> {
  const out = {} as Record<ModuleKey, Record<string, number | null>>;
  for (const module of Object.keys(ITEMS) as ModuleKey[]) {
    const items = ITEMS[module];
    out[module] = {};
    const dims = [...new Set(items.filter((item) => !item.excludeFromScoring).map((item) => item.dimension))];
    for (const dim of dims) {
      const dimItems = items.filter((item) => item.dimension === dim && !item.excludeFromScoring);
      const dimAnswers = responses.map((r) => {
        const obj: Record<string, number> = {};
        for (const item of dimItems) {
          const value = r.answers[module]?.[item.id];
          if (typeof value === 'number') obj[item.id] = value;
        }
        return obj;
      });
      out[module][dim] = cronbachAlpha(dimItems, dimAnswers);
    }
  }
  return out;
}

function pearson(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  if (n < 2) return 0;
  const ma = mean(a.slice(0, n));
  const mb = mean(b.slice(0, n));
  let num = 0;
  let da = 0;
  let db = 0;
  for (let i = 0; i < n; i += 1) {
    const x = a[i] - ma;
    const y = b[i] - mb;
    num += x * y;
    da += x * x;
    db += y * y;
  }
  if (da === 0 || db === 0) return 0;
  return num / Math.sqrt(da * db);
}

/** 兴趣六型相关矩阵（用模拟样本，验证六边形相邻高相关、相对低相关的结构） */
export function interestCorrelation(): { dimensions: string[]; matrix: number[][] } {
  const module: ModuleKey = 'interest';
  const items = ITEMS[module];
  const dims = [...new Set(items.filter((item) => !item.excludeFromScoring).map((item) => item.dimension))];
  const vectors = dims.map((dim) => {
    const dimItems = items.filter((item) => item.dimension === dim && !item.excludeFromScoring);
    return responses.map((r) => {
      const scores = dimItems
        .map((item) => {
          const raw = r.answers[module]?.[item.id];
          return typeof raw === 'number' ? scoreNumericItem(item, raw) : null;
        })
        .filter((value): value is number => value !== null);
      return scores.length > 0 ? mean(scores) : 0;
    });
  });
  const matrix = dims.map((_, i) =>
    dims.map((_, j) =>
      i === j ? 1 : Math.round(pearson(vectors[i], vectors[j]) * 100) / 100,
    ),
  );
  return { dimensions: dims, matrix };
}

export const PSYCHOMETRICS_NOTE =
  '模拟数据 · 方法演示：以下指标由 scripts/generateSample.ts 用种子随机离线生成的 200 份模拟作答计算，仅用于演示计算链路，不是本量表信效度的实证依据。';
