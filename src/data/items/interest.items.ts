import type { AssessmentItem } from '@/types';

/**
 * 兴趣模块：RIASEC 六型 × 3 题 = 18 题，5 点量表（喜欢程度）。
 *
 * 理论：Holland 职业兴趣类型理论（1959 / 1985）。
 * 计分约定：全部正向计分，不使用反向题（反向题只出现在人格与生涯适应力模块）。
 *
 * 一致性检验（M2.1 修正）：配对题必须是**近义改写**，否则同型不同活动之间的真实偏好差异
 * 会被误报为"作答不一致"（从而人为拉高同型维度相关）。因此本模块只保留 1 对近义重复题
 * I-R-01↔I-R-02（同一行为的两种说法），其余原配对（I-I-01↔I-I-02、I-C-01↔I-C-03）
 * 已取消 pairId，作为普通题目保留。
 *
 * 条目来源：面向高中生自编，描述的是日常可接触的活动，避免行业术语。
 */
export const INTEREST_ITEMS: AssessmentItem[] = [
  // —— R 现实型 ——
  {
    id: 'I-R-01',
    dimension: 'R',
    type: 'likert5',
    text: '拆开或修理东西，比如自行车、小家电、桌椅，看它到底是怎么工作的。',
    pairId: 'I-R-02',
  },
  {
    id: 'I-R-02',
    dimension: 'R',
    type: 'likert5',
    text: '动手拆装、修理各种物品，弄清楚它们是怎么运转起来的。',
    subText: '与上一题是同一件事的两种说法，用来看你的作答是否稳定。',
    pairId: 'I-R-01',
  },
  {
    id: 'I-R-03',
    dimension: 'R',
    type: 'likert5',
    text: '在户外或现场干活、运动、操作器械，而不是一直坐在桌前。',
  },

  // —— I 研究型 ——
  {
    id: 'I-I-01',
    dimension: 'I',
    type: 'likert5',
    text: '琢磨一个现象背后的原理，弄清楚"为什么会这样"。',
  },
  {
    id: 'I-I-02',
    dimension: 'I',
    type: 'likert5',
    text: '做个小实验或查资料，去验证自己猜得到底对不对。',
  },
  {
    id: 'I-I-03',
    dimension: 'I',
    type: 'likert5',
    text: '解需要一步步推理的难题，比如数学题、逻辑题、找出程序里的错误。',
  },

  // —— A 艺术型 ——
  {
    id: 'I-A-01',
    dimension: 'A',
    type: 'likert5',
    text: '写故事、画画、做音乐、剪视频，用作品把自己的想法表达出来。',
  },
  {
    id: 'I-A-02',
    dimension: 'A',
    type: 'likert5',
    text: '设计一个独特的作品或方案，不愿意照着现成的模板来。',
  },
  {
    id: 'I-A-03',
    dimension: 'A',
    type: 'likert5',
    text: '欣赏并讨论好看的设计，比如海报、服装、建筑、插画、界面。',
  },

  // —— S 社会型 ——
  {
    id: 'I-S-01',
    dimension: 'S',
    type: 'likert5',
    text: '给同学讲明白一道题或一个知识点，看他"哦——"的那一刻。',
  },
  {
    id: 'I-S-02',
    dimension: 'S',
    type: 'likert5',
    text: '听别人说烦恼，然后一起想办法、帮上一点忙。',
  },
  {
    id: 'I-S-03',
    dimension: 'S',
    type: 'likert5',
    text: '参加志愿服务，为有需要的人做点事。',
    subText: 'M2.1 修正：原条目"组织几个人协调干活"偏 E 型企业型，与 I-E-02 重叠，会人为拉高 S/E 相关。',
  },

  // —— E 企业型 ——
  {
    id: 'I-E-01',
    dimension: 'E',
    type: 'likert5',
    text: '说服别人接受我的想法，把一件事推动起来。',
  },
  {
    id: 'I-E-02',
    dimension: 'E',
    type: 'likert5',
    text: '发起并组织一个活动或项目，从零开始把它做出来。',
  },
  {
    id: 'I-E-03',
    dimension: 'E',
    type: 'likert5',
    text: '尝试做生意、运营账号或想办法赚到钱，比如摆摊、卖东西、接单。',
  },

  // —— C 常规型 ——
  {
    id: 'I-C-01',
    dimension: 'C',
    type: 'likert5',
    text: '把杂乱的信息整理成清楚的表格、清单或分类，让它一目了然。',
  },
  {
    id: 'I-C-02',
    dimension: 'C',
    type: 'likert5',
    text: '按流程、按规则办事，把每个细节都做准确。',
  },
  {
    id: 'I-C-03',
    dimension: 'C',
    type: 'likert5',
    text: '做需要耐心核对的事，比如记账、检查作业、整理错题本。',
  },
];
