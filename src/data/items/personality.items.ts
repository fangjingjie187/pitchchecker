import type { AssessmentItem } from '@/types';

/**
 * 人格特质模块（P2）：大五简版，12 题，5 点量表（符合程度）。
 * 维度分布：外向 2 / 宜人 2 / 尽责 3 / 情绪稳定 3 / 开放 2。
 *
 * 理论：Costa & McCrae 大五人格模型（NEO 体系），青少年简版改编。
 * 计分约定：本模块允许使用反向题（尽责、情绪稳定各 1 题）。
 * 使用限制：人格只用于描述学习与合作的风格偏好，不参与职业匹配，也不作为能力判断。
 * 交付说明：本模块为 P2，时间不足时从 config/modules.ts 的 ENABLED_PRIORITIES 移除 'P2' 即可下线。
 */
export const PERSONALITY_ITEMS: AssessmentItem[] = [
  // —— extraversion 外向性 ——
  {
    id: 'PT-extraversion-01',
    dimension: 'extraversion',
    type: 'likert5',
    text: '在人多的场合我会更来劲，喜欢和大家待在一起。',
  },
  {
    id: 'PT-extraversion-02',
    dimension: 'extraversion',
    type: 'likert5',
    text: '和不认识的人聊天，对我来说不算难事。',
  },

  // —— agreeableness 宜人性 ——
  {
    id: 'PT-agreeableness-01',
    dimension: 'agreeableness',
    type: 'likert5',
    text: '我比较容易站在别人的角度想问题。',
  },
  {
    id: 'PT-agreeableness-02',
    dimension: 'agreeableness',
    type: 'likert5',
    text: '小组里有分歧时，我会先想办法让大家都能接受。',
  },

  // —— conscientiousness 尽责性 ——
  {
    id: 'PT-conscientiousness-01',
    dimension: 'conscientiousness',
    type: 'likert5',
    text: '我会提前把要做的事列出来，按顺序做。',
    subText:
      '本条曾与 PT-conscientiousness-02 配对，已解除：计划性与履约性是尽责性下的两个不同侧面。',
  },
  {
    id: 'PT-conscientiousness-02',
    dimension: 'conscientiousness',
    type: 'likert5',
    text: '答应的事，我会尽量按时做完。',
  },
  {
    id: 'PT-conscientiousness-03',
    dimension: 'conscientiousness',
    type: 'likert5',
    text: '我常常拖到最后一刻才动手。',
    reverse: true,
  },

  // —— stability 情绪稳定性 ——
  {
    id: 'PT-stability-01',
    dimension: 'stability',
    type: 'likert5',
    text: '遇到突发状况，我大多能稳得住。',
    pairId: 'PT-stability-02',
  },
  {
    id: 'PT-stability-02',
    dimension: 'stability',
    type: 'likert5',
    text: '事情不顺利时，我能比较快调整过来。',
    pairId: 'PT-stability-01',
  },
  {
    id: 'PT-stability-03',
    dimension: 'stability',
    type: 'likert5',
    text: '我容易因为一点小事焦虑很久。',
    reverse: true,
  },

  // —— openness 经验开放性 ——
  {
    id: 'PT-openness-01',
    dimension: 'openness',
    type: 'likert5',
    text: '我喜欢尝试没做过的事、没接触过的内容。',
  },
  {
    id: 'PT-openness-02',
    dimension: 'openness',
    type: 'likert5',
    text: '对那些没有标准答案的问题，我会觉得很有意思。',
  },
];
