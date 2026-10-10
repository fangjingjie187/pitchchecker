import type { DimensionDef } from '@/types';

/**
 * 暖场三构念定义。
 *
 * 设计依据：借鉴 Holland 等职业决策量表 MVS（1980）的构念框架
 * （VI 定向清晰度 / OI 职业信息需求 / Barriers 障碍感知），
 * 并参考胡洁（2007）高中生职业决策因素量表改编版的表述方式。
 *
 * 注意：comfort 的负向属性由 polarity='negative' 表达，
 * 不使用 reverse 反向计分——两者是不同机制（后者指题目措辞需要翻转）。
 */
export const WARMUP_DIMENSIONS: DimensionDef[] = [
  {
    key: 'clarity',
    name: '定向清晰度',
    short: '有多清楚',
    description: '对应 MVS 的职业认同 VI：对"将来想做什么"的清楚程度。',
    polarity: 'positive',
  },
  {
    key: 'comfort',
    name: '情感舒适',
    short: '有多担心',
    description:
      '对应 MVS 的障碍感知 Barriers，为负向构念：得分越高表示感知到的障碍与担心越多。',
    polarity: 'negative',
  },
  {
    key: 'information',
    name: '职业信息充足度',
    short: '了解多少',
    description: '对应 MVS 的职业信息需求 OI：对"科目—专业—职业"连接的了解程度。',
    polarity: 'positive',
  },
];

export const WARMUP_DIMENSION_MAP: Record<string, DimensionDef> = Object.fromEntries(
  WARMUP_DIMENSIONS.map((item) => [item.key, item]),
);
