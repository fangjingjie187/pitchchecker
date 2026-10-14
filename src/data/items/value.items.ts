import type { AssessmentItem } from '@/types';

/**
 * 工作价值观模块：7 题重要性评定（5 点）+ 3 题三选一迫选 = 10 题。
 *
 * 理论：Super (1970) 工作价值观量表 WVI（原 15 项），面向高中生精简为 10 项。
 * 计分约定：全部正向计分，不使用反向题。
 *
 * 为什么混入迫选题：评定题容易全部选"重要"，看不出排序；
 * 迫选题逼出真实取舍，也能降低社会赞许性偏差。
 * 迫选题的维度归属由各选项的 dimension 字段决定（校验器按选项统计维度覆盖）。
 */
export const VALUE_ITEMS: AssessmentItem[] = [
  // —— 7 题重要性评定 ——
  {
    id: 'V-achievement-01',
    dimension: 'achievement',
    type: 'likert5',
    text: '做出让人佩服的成果，让大家看到"这件事是我做成的"。',
  },
  {
    id: 'V-independence-01',
    dimension: 'independence',
    type: 'likert5',
    text: '自己安排节奏和做法，不用事事听人安排。',
  },
  {
    id: 'V-altruism-01',
    dimension: 'altruism',
    type: 'likert5',
    text: '我的工作能真的帮到别人，对社会有用。',
  },
  {
    id: 'V-creativity-01',
    dimension: 'creativity',
    type: 'likert5',
    text: '有机会想新点子、做出新东西，而不是照着模板重复。',
  },
  {
    id: 'V-intellectual-01',
    dimension: 'intellectual',
    type: 'likert5',
    text: '需要不断学新东西、遇到新问题，不会一眼望到头。',
  },
  {
    id: 'V-security-01',
    dimension: 'security',
    type: 'likert5',
    text: '收入和工作都比较稳定，不用总担心失业。',
  },
  {
    id: 'V-balance-01',
    dimension: 'balance',
    type: 'likert5',
    text: '工作之外还有足够的时间，留给家人、爱好和自己。',
  },

  // —— 3 题三选一迫选 ——
  {
    id: 'V-FC-01',
    dimension: 'reward',
    type: 'forcedChoice',
    text: '想象毕业时同时有三份工作可选，只能比较一个方面，你会先看哪个？',
    subText: '只能选一个。',
    options: [
      { id: 'V-FC-01-a', label: '赚得多不多', dimension: 'reward' },
      { id: 'V-FC-01-b', label: '稳定、不容易失业', dimension: 'security' },
      { id: 'V-FC-01-c', label: '能做出成绩', dimension: 'achievement' },
    ],
  },
  {
    id: 'V-FC-02',
    dimension: 'prestige',
    type: 'forcedChoice',
    text: '你更希望自己成为哪一种人？',
    subText: '只能选一个。',
    options: [
      { id: 'V-FC-02-a', label: '被很多人认识和认可的人', dimension: 'prestige' },
      { id: 'V-FC-02-b', label: '和一群合得来的伙伴一起做事的人', dimension: 'relationship' },
      { id: 'V-FC-02-c', label: '自己决定怎么干、不用处处请示的人', dimension: 'independence' },
    ],
  },
  {
    id: 'V-FC-03',
    dimension: 'relationship',
    type: 'forcedChoice',
    text: '十年以后回头看，你最不希望缺少的是哪一样？',
    subText: '只能选一个。',
    options: [
      { id: 'V-FC-03-a', label: '钱够用，能支撑我想要的生活', dimension: 'reward' },
      { id: 'V-FC-03-b', label: '说出名字，别人知道你做得不错', dimension: 'prestige' },
      { id: 'V-FC-03-c', label: '一群真心相处的同事', dimension: 'relationship' },
    ],
  },
];
