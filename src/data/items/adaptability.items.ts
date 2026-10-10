import type { AssessmentItem } from '@/types';

/**
 * 生涯适应力模块：4C × 3 题 = 12 题，5 点量表（符合程度）。
 *
 * 理论：Savickas 生涯建构理论；CAAS 生涯适应力量表（Savickas & Porfeli, 2012）。
 * 计分约定：本模块允许使用反向题（每维度 1 题，共 4 题），题干带"反向"标记便于校对。
 * 呈现原则：适应力是可训练的能力，每个维度的低分都会给出对应的练习（见 data/adaptability.ts）。
 */
export const ADAPTABILITY_ITEMS: AssessmentItem[] = [
  // —— concern 关注 ——
  {
    id: 'AD-concern-01',
    dimension: 'concern',
    type: 'likert5',
    text: '我会认真想自己三五年后想过什么样的生活。',
    subText:
      '本条曾与 AD-concern-02 配对，已解除："想未来"与"做准备"属实质心理差异，不是作答噪声。',
  },
  {
    id: 'AD-concern-02',
    dimension: 'concern',
    type: 'likert5',
    text: '我会为将来做些准备，而不只是过好眼前。',
  },
  {
    id: 'AD-concern-03',
    dimension: 'concern',
    type: 'likert5',
    text: '我很少去想以后的事。',
    subText: 'M2.1 修正：删去"想了也没什么用"——它同时测量了无助感，构成双管枪条目。',
    reverse: true,
  },

  // —— control 控制 ——
  {
    id: 'AD-control-01',
    dimension: 'control',
    type: 'likert5',
    text: '我相信我的将来主要由我自己的选择决定。',
  },
  {
    id: 'AD-control-02',
    dimension: 'control',
    type: 'likert5',
    text: '遇到变化时，我会先想自己能做些什么。',
  },
  {
    id: 'AD-control-03',
    dimension: 'control',
    type: 'likert5',
    text: '将来会怎样，基本不是我能决定的。',
    reverse: true,
  },

  // —— curiosity 好奇 ——
  {
    id: 'AD-curiosity-01',
    dimension: 'curiosity',
    type: 'likert5',
    text: '我会主动去了解不同职业的人一天是怎么过的。',
  },
  {
    id: 'AD-curiosity-02',
    dimension: 'curiosity',
    type: 'likert5',
    text: '碰到没接触过的领域，我会想多知道一点。',
  },
  {
    id: 'AD-curiosity-03',
    dimension: 'curiosity',
    type: 'likert5',
    text: '我对了解别的职业没什么兴趣。',
    reverse: true,
  },

  // —— confidence 信心 ——
  {
    id: 'AD-confidence-01',
    dimension: 'confidence',
    type: 'likert5',
    text: '我相信自己能克服实现目标路上的困难。',
    pairId: 'AD-confidence-02',
  },
  {
    id: 'AD-confidence-02',
    dimension: 'confidence',
    type: 'likert5',
    text: '就算一开始做不好，我也愿意再试一次。',
    pairId: 'AD-confidence-01',
  },
  {
    id: 'AD-confidence-03',
    dimension: 'confidence',
    type: 'likert5',
    text: '遇到难事，我容易觉得"我大概做不到"。',
    reverse: true,
  },
];
