import type { AssessmentItem } from '@/types';

/**
 * 暖场模块（4 题：3 个滑条 + 1 道开放题）。
 *
 * 设计依据：借鉴 Holland 等职业决策量表 MVS（1980）的构念框架，
 * 取其中三个分量表对应的构念——
 *   · clarity    → 职业认同 VI（Vocational Identity，即"定向清晰度"）
 *   · comfort    → 障碍感知 Barriers（情感舒适，负向构念：得分越高代表担心越多）
 *   · information→ 职业信息需求 OI（Occupational Information，即"信息充足度"）
 * 并参考胡洁（2007）高中生职业决策因素量表改编版的表述方式。
 *
 * 说明一：本模块为自编 / 改编的演示条目，不是标准化 MVS 量表，About 页已标注。
 * 说明二：comfort 的负向构念由 data/norms.ts 与维度定义中的 polarity='negative' 表达，
 *        不使用 reverse 反向计分标记——两者是不同机制，校验器不会混淆。
 */
export const WARMUP_ITEMS: AssessmentItem[] = [
  {
    id: 'WU-clarity',
    dimension: 'clarity',
    type: 'slider100',
    text: '对于将来想做什么，我现在有多清楚？',
    subText: '不用想出一个确定的职业，凭现在的真实感觉就行。',
  },
  {
    id: 'WU-comfort',
    dimension: 'comfort',
    type: 'slider100',
    text: '想到要选科、选专业、选职业，我有多担心？',
    subText: '这是一道"担心程度"题：拉得越高表示越担心，不是越差。',
  },
  {
    id: 'WU-information',
    dimension: 'information',
    type: 'slider100',
    text: '对于"哪些科目、哪些专业以后能通向哪些职业"，我了解得有多少？',
    subText: '很多人这一条都不高，这正是我们想帮你补上的那一块。',
  },
  {
    id: 'WU-open-01',
    dimension: 'information',
    type: 'open',
    text: '如果现在有一分钟可以问一个过来人，你最想问什么？',
    subText: '可以是一个具体问题，也可以是你一直没想明白的困惑。这一题不计分。',
    // F5：开放题不能用滑条指导语，用自己的引导语覆盖模块级 prompt
    prompt: '写下你最想问的那个问题',
    placeholder: '比如：学这个专业以后真的能做什么工作？',
    maxLength: 200,
    // M2.1：开放题不计入任何维度计分。dimension 仅用于归档归类，
    // 作答只用于报告叙事生成与页脚温和提示触发（scripts/validate.ts 已加断言）。
    excludeFromScoring: true,
  },
];
