import type { Subject } from '@/types';

/**
 * 中学学科库。
 * 用途：报告区块 9（学科 → 选科 → 专业 → 职业路径）的起点。
 * 设计动因：前期调研中"不清楚所选科目以后可以从事哪些职业"是突出的未决原因，
 * 所以每一门学科都必须说清"它锻炼的能力"与"它能通向哪里"。
 *
 * abilities 取值自能力维度 key：verbal / logic / spatial / handson / interpersonal / creative
 */
export const SUBJECTS: Subject[] = [
  {
    key: 'chinese',
    name: '语文',
    abilities: ['verbal', 'creative'],
    transferable: '把复杂的东西说清楚、写明白——这是几乎所有职业都用得上的底层能力。',
  },
  {
    key: 'math',
    name: '数学',
    abilities: ['logic', 'spatial'],
    transferable: '训练的是"把混乱变有序"的能力，金融、计算机、工程、数据分析都建立在这上面。',
  },
  {
    key: 'english',
    name: '英语',
    abilities: ['verbal'],
    transferable: '它决定了你能直接读到多少一手资料，也打开了更宽的选择面。',
  },
  {
    key: 'physics',
    name: '物理',
    abilities: ['logic', 'spatial'],
    transferable: '建模与抽象的能力：把现实问题变成可以计算的形式，是工科的共同语言。',
  },
  {
    key: 'chemistry',
    name: '化学',
    abilities: ['logic', 'handson'],
    transferable: '从微观机理推宏观现象，同时要求动手做实验，是材料、医药、化工的基础。',
  },
  {
    key: 'biology',
    name: '生物',
    abilities: ['logic', 'handson'],
    transferable: '理解生命系统的运作，通向医学、农学、环境、生物技术等方向。',
  },
  {
    key: 'politics',
    name: '思想政治',
    abilities: ['verbal', 'interpersonal'],
    transferable: '理解制度、社会与公共议题，也是法学、公共管理、新闻传播的基础训练。',
  },
  {
    key: 'history',
    name: '历史',
    abilities: ['verbal', 'logic'],
    transferable: '在长时段里看因果、看证据，训练的是判断力，而不只是记年代。',
  },
  {
    key: 'geography',
    name: '地理',
    abilities: ['spatial', 'logic'],
    transferable: '把空间、数据和人地关系放在一起想，通向城乡规划、环境、遥感与地理信息。',
  },
  {
    key: 'it',
    name: '信息技术',
    abilities: ['logic', 'handson'],
    transferable: '把重复的事交给机器去做，这是当下几乎所有行业都在补的能力。',
  },
  {
    key: 'art',
    name: '音乐与美术',
    abilities: ['creative'],
    transferable: '训练的是感受力与表达力，设计、内容、游戏、品牌传播都以此为核心。',
  },
  {
    key: 'pe',
    name: '体育',
    abilities: ['handson', 'interpersonal'],
    transferable: '身体控制与团队配合，通向运动康复、体育教育、应急救援等方向。',
  },
];

export const SUBJECT_MAP: Record<string, Subject> = Object.fromEntries(
  SUBJECTS.map((item) => [item.key, item]),
);
