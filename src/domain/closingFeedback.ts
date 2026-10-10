import { CLOSING_FEEDBACK_TEMPLATES } from '@/data/interpretations';
import { getDimensionName } from '@/data/dimensionNames';
import { getHollandHint } from '@/data/narratives';
import type { ModuleKey } from '@/types';
import type { DimensionStat } from './scale';
import { lowestDimension, topDimension } from './scale';

/**
 * 模块完成后的即时小结反馈（一行）。
 *
 * 设计意图：每完成一个模块就给一点正反馈与方向感，避免"答完 78 题才看到东西"的空洞感。
 * 措辞原则同报告：只描述倾向，不做判定；低分项表述为"还想练一练"而不是"弱"。
 */
export function buildClosingFeedback(module: ModuleKey, stats: DimensionStat[]): string {
  if (stats.length === 0) return '';
  const template = CLOSING_FEEDBACK_TEMPLATES[module] ?? '';
  const top = topDimension(stats);
  const low = lowestDimension(stats);

  const topName = top ? getDimensionName(module, top.key) : '';
  const lowName = low ? getDimensionName(module, low.key) : '';
  const topHint = module === 'interest' && top ? getHollandHint(top.key) : '';
  const valueList = stats
    .slice(0, 3)
    .map((stat) => getDimensionName(module, stat.key))
    .join('、');

  return template
    .replace('{topName}', topName)
    .replace('{topHint}', topHint)
    .replace('{lowName}', lowName)
    .replace('{valueList}', valueList);
}
