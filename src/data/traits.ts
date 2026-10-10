import type { TraitDef } from '@/types';

/**
 * 人格特质五个维度（大五简版）。
 * 理论：Costa & McCrae 大五人格模型（NEO 体系），青少年简版改编。
 * 定位：仅用于描述学习与合作的风格偏好，不参与职业筛选，也不作为能力判断。
 * 说明：本模块为 P2，时间不足可从 ENABLED_PRIORITIES 中移除 'P2' 直接下线。
 */
export const TRAIT_DIMENSIONS: TraitDef[] = [
  {
    key: 'extraversion',
    name: '外向性',
    short: '外向',
    description: '从与人互动中获得能量，喜欢热闹和表达的场合。',
    polarity: 'positive',
    studyTip: '可以把需要记忆的内容讲给别人听，用"输出"带动"输入"。',
    collabTip: '你在小组讨论里容易带起气氛，注意也给安静的同学留出说话的空间。',
  },
  {
    key: 'agreeableness',
    name: '宜人性',
    short: '合作',
    description: '倾向于信任他人、照顾关系、避免冲突。',
    polarity: 'positive',
    studyTip: '结伴学习对你有帮助，但也要给自己留出独立完成的时段。',
    collabTip: '你是很好的协作者，练习"温和地表达不同意见"会让合作更健康。',
  },
  {
    key: 'conscientiousness',
    name: '尽责性',
    short: '有条理',
    description: '倾向于提前规划、按计划推进、把事做到位。',
    polarity: 'positive',
    studyTip: '用周计划和清单把任务拆小，你的优势在于稳定推进。',
    collabTip: '你常被依赖，注意不要把别人的任务也揽到自己身上。',
  },
  {
    key: 'stability',
    name: '情绪稳定性',
    short: '稳得住',
    description: '面对压力和突发状况时，情绪能比较快地恢复平稳。',
    polarity: 'positive',
    studyTip: '考前给自己准备一个"稳定流程"（作息、呼吸、复盘），比临时抱佛脚更有效。',
    collabTip: '压力大的时候先说出来，而不是硬扛；团队里承认困难并不等于能力不足。',
  },
  {
    key: 'openness',
    name: '经验开放性',
    short: '爱尝试',
    description: '对新鲜事物、抽象问题和没有标准答案的议题有兴趣。',
    polarity: 'positive',
    studyTip: '多给自己安排"没接触过"的内容，好奇心本身就是最好的驱动力。',
    collabTip: '你容易提出新角度，注意把它落到可执行的下一步上。',
  },
];

export const TRAIT_DIMENSION_MAP: Record<string, TraitDef> = Object.fromEntries(
  TRAIT_DIMENSIONS.map((item) => [item.key, item]),
);
