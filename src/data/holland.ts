import type { HollandTypeDef } from '@/types';

/**
 * Holland RIASEC 六型定义。
 * 理论：Holland 职业兴趣类型理论（1959 / 1985）；六边形顺序 R–I–A–S–E–C，
 * 相邻类型相关高，相对类型相关低，该结构用于计算"一致性"与"分化度"。
 * 说明：本文件为面向高中生改写的描述性内容，非量表条目。
 */
export const HOLLAND_TYPES: HollandTypeDef[] = [
  {
    key: 'R',
    holland: 'R',
    name: '现实型',
    short: '动手派',
    description: '喜欢和具体的东西打交道：工具、机器、材料、动植物、户外现场。',
    polarity: 'positive',
    keywords: ['动手', '实用', '机械', '户外', '做出实物'],
    typicalActivities: [
      '拆装、修理或组装东西',
      '用工具把材料做成能用的实物',
      '操作设备、器械或车辆',
      '在户外或现场作业，而不是一直坐在桌前',
    ],
    relatedSubjects: ['物理', '化学', '信息技术', '体育'],
    relatedMajorCategories: ['工学', '农学', '医学技术类', '装备制造类'],
    strengths: '执行力强、能把想法变成看得见摸得着的东西，遇到实际问题不容易慌。',
    misconceptions: '现实型不等于"成绩不好才去干活"。很多高水平的工程、医疗技术、农业技术岗位都需要扎实的数理基础。',
  },
  {
    key: 'I',
    holland: 'I',
    name: '研究型',
    short: '探究派',
    description: '喜欢追问"为什么"，享受观察、分析、验证和把复杂问题弄明白的过程。',
    polarity: 'positive',
    keywords: ['思考', '追问', '分析', '实验', '解决难题'],
    typicalActivities: [
      '琢磨一个现象背后的原理',
      '查资料、做实验去验证猜想',
      '解需要一步步推理的难题',
      '收集和整理数据，从中找规律',
    ],
    relatedSubjects: ['数学', '物理', '化学', '生物', '信息技术'],
    relatedMajorCategories: ['理学', '工学', '医学', '农学'],
    strengths: '逻辑清晰、耐得住性子，遇到没有现成答案的问题愿意自己找路。',
    misconceptions: '研究型不等于"只会读书"。研究型职业里有大量需要动手实验、跑现场、跑数据的工作。',
  },
  {
    key: 'A',
    holland: 'A',
    name: '艺术型',
    short: '创造派',
    description: '喜欢用作品表达想法，重视原创和美感，不愿意照着模板重复。',
    polarity: 'positive',
    keywords: ['原创', '表达', '美感', '想象', '非传统'],
    typicalActivities: [
      '写作、绘画、做音乐、拍视频来表达想法',
      '设计一个独特的作品或方案',
      '欣赏和讨论好看、好用的设计',
      '把一个模糊的感觉变成具体的形象',
    ],
    relatedSubjects: ['语文', '英语', '音乐', '美术'],
    relatedMajorCategories: ['艺术学', '文学', '设计学'],
    strengths: '感受力强、能提出不一样的解法，在需要"让人眼前一亮"的场合很有价值。',
    misconceptions: '艺术型不等于"不稳定、不好找工作"。设计、内容、用户体验、游戏、品牌传播都需要这类人。',
  },
  {
    key: 'S',
    holland: 'S',
    name: '社会型',
    short: '助人派',
    description: '喜欢和人在一起，愿意倾听、解释、照顾和帮助，从"别人变好了"里获得成就感。',
    polarity: 'positive',
    keywords: ['助人', '沟通', '教学', '合作', '倾听'],
    typicalActivities: [
      '给别人讲明白一个知识点',
      '倾听别人的烦恼并想办法帮忙',
      '组织小组一起完成一件事',
      '照顾、陪伴或支持有需要的人',
    ],
    relatedSubjects: ['语文', '英语', '思想政治', '生物'],
    relatedMajorCategories: ['教育学', '医学', '心理学', '社会学'],
    strengths: '共情力和沟通力强，容易获得信任，在团队里常常是黏合剂。',
    misconceptions: '社会型不等于"心软好欺负"。教学、临床、社会工作都需要很强的专业训练和边界感。',
  },
  {
    key: 'E',
    holland: 'E',
    name: '企业型',
    short: '开拓派',
    description: '喜欢发起事情、影响别人、争取资源和结果，享受把一件事从 0 做到 1。',
    polarity: 'positive',
    keywords: ['发起', '说服', '组织', '经营', '争取'],
    typicalActivities: [
      '说服别人接受自己的想法',
      '发起并组织一个活动或项目',
      '尝试做生意、运营账号或拉到资源',
      '在竞争中争取一个目标',
    ],
    relatedSubjects: ['语文', '英语', '思想政治', '历史'],
    relatedMajorCategories: ['管理学', '经济学', '法学'],
    strengths: '行动力强、敢开口、能扛压力，适合做需要推动多方协作的事。',
    misconceptions: '企业型不等于"爱出风头"。它更是一种把资源组织起来解决问题的能力。',
  },
  {
    key: 'C',
    holland: 'C',
    name: '常规型',
    short: '秩序派',
    description: '喜欢清楚的规则、有序的流程和准确的数据，把事情做规范、做细致会让他踏实。',
    polarity: 'positive',
    keywords: ['秩序', '规则', '准确', '数据', '流程'],
    typicalActivities: [
      '把杂乱的信息整理成清晰的表格或清单',
      '按流程和规则办事，把细节做准确',
      '耐心核对、记账、排期、归档',
      '让一件事有据可查、不出错',
    ],
    relatedSubjects: ['数学', '信息技术', '英语'],
    relatedMajorCategories: ['管理学', '经济学', '工学（质量与标准化）'],
    strengths: '可靠、细致、抗干扰，是团队里"交给他就放心"的那个人。',
    misconceptions: '常规型不等于"没创意"。在流程、风控、质量和数据工作中，秩序本身就是一种专业能力。',
  },
];

export const HOLLAND_TYPE_MAP: Record<string, HollandTypeDef> = Object.fromEntries(
  HOLLAND_TYPES.map((type) => [type.key, type]),
);
