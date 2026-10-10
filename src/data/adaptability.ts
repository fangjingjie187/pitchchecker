import type { AdaptabilityDef } from '@/types';

/**
 * 生涯适应力 4C。
 * 理论：Savickas 生涯建构理论；CAAS 生涯适应力量表（Savickas & Porfeli, 2012）。
 * 核心立场：适应力不是天生特质，而是可以训练的能力——每个维度都配一个可以直接去做的练习。
 * 反向题说明：本模块允许使用反向题（与人格模块同为 config/data.config.ts 中允许的模块）。
 */
export const ADAPTABILITY_DIMENSIONS: AdaptabilityDef[] = [
  {
    key: 'concern',
    name: '关注',
    short: '我会想将来吗',
    description: '是否愿意为将来打算，而不只顾眼前。',
    polarity: 'positive',
    intervention: '把"将来"具体化：越具体的未来越容易让人愿意去想。',
    activity: '未来信件：给三年后的自己写一封信，写清楚"那时我在做什么、和谁在一起、学会了什么"。',
  },
  {
    key: 'control',
    name: '控制',
    short: '我相信我能决定吗',
    description: '是否相信自己的选择能影响未来，愿意为自己的决定负责。',
    polarity: 'positive',
    intervention: '从小决定开始练习"我说了算"，积累掌控感。',
    activity: '决策日志：连续一周，每天记下 1 个你自己做的选择，以及它带来的结果。',
  },
  {
    key: 'curiosity',
    name: '好奇',
    short: '我愿意去了解吗',
    description: '是否主动探索可能的自己与可能的职业世界。',
    polarity: 'positive',
    intervention: '降低探索成本：从"了解一个人"开始，而不是从"决定一生"开始。',
    activity: '职业影子日：访谈一位你感兴趣的从业者，问清楚三件事——一天怎么过、怎么入行、最难的是什么。',
  },
  {
    key: 'confidence',
    name: '信心',
    short: '我相信我能做到吗',
    description: '是否相信自己有能力克服路上的困难。',
    polarity: 'positive',
    intervention: '用"小胜"积累自我效能（Bandura 的掌握经验），把大目标拆到可达成。',
    activity: '小胜记录：把这个月想达成的事拆成 4 个小步骤，每完成一步就记下来。',
  },
];

export const ADAPTABILITY_DIMENSION_MAP: Record<string, AdaptabilityDef> = Object.fromEntries(
  ADAPTABILITY_DIMENSIONS.map((item) => [item.key, item]),
);
