import type { ValueDef } from '@/types';

/**
 * 工作价值观十个维度（青少年精简版）。
 * 理论：Super (1970) 工作价值观量表 WVI（原 15 项），面向高中生精简为 10 项。
 * 说明：价值观没有高下之分，只反映"你判断一份工作好不好的底层标准"。
 */
export const VALUE_DIMENSIONS: ValueDef[] = [
  {
    key: 'achievement',
    name: '成就感',
    short: '做出成绩',
    description: '希望工作能产出看得见的成果，让人承认"这件事是我做成的"。',
    polarity: 'positive',
    whatItMeans: '你需要的是"做成了"的反馈，而不只是"做了"。',
    careersHint: '留意那些有明确交付物和评价标准的工作，比如工程项目、临床治疗、教学内容。',
  },
  {
    key: 'independence',
    name: '独立自主',
    short: '自己说了算',
    description: '希望自己决定节奏和做法，不用事事请示、被人盯着。',
    polarity: 'positive',
    whatItMeans: '你对"被安排"的容忍度比较低，需要一定的自主空间。',
    careersHint: '留意自由度较高的岗位形态：研究、创作、技术专家路线、独立执业或小团队。',
  },
  {
    key: 'altruism',
    name: '利他助人',
    short: '帮到别人',
    description: '希望自己的付出真的能让别人变好，对社会有用。',
    polarity: 'positive',
    whatItMeans: '"有没有用"比"赚多少"更能决定你愿不愿意投入。',
    careersHint: '教育、医疗康复、心理咨询、公共服务、社会工作等方向通常能满足这一点。',
  },
  {
    key: 'creativity',
    name: '创造表达',
    short: '做新东西',
    description: '希望有机会想新点子、做出新东西，而不是照着模板重复。',
    polarity: 'positive',
    whatItMeans: '重复性的工作会让你很快失去动力。',
    careersHint: '设计、内容创作、产品研发、游戏、品牌传播等方向的创造空间更大。',
  },
  {
    key: 'intellectual',
    name: '智力激发',
    short: '不断学新东西',
    description: '希望工作持续带来新问题和新知识，不会一眼望到头。',
    polarity: 'positive',
    whatItMeans: '"学得到东西"本身就能给你能量。',
    careersHint: '技术迭代快的领域（人工智能、生物医药、数据分析）通常能满足，但也意味着要一直学。',
  },
  {
    key: 'reward',
    name: '经济回报',
    short: '收入待遇',
    description: '希望收入能支撑自己想要的生活，付出能得到相应的回报。',
    polarity: 'positive',
    whatItMeans: '报酬是你衡量价值的重要尺度之一，这很正常。',
    careersHint: '同一份能力在不同行业、不同城市的回报差异很大，选行业和地点有时比选岗位更关键。',
  },
  {
    key: 'security',
    name: '稳定保障',
    short: '稳定安心',
    description: '希望工作和生活都比较稳定，不用总担心失业或收入断掉。',
    polarity: 'positive',
    whatItMeans: '确定性对你很重要，这能让你更安心地投入。',
    careersHint: '稳定也有代价：通常意味着节奏变化慢、竞争方式不同。可以一部分求稳、一部分留给探索。',
  },
  {
    key: 'prestige',
    name: '声望认可',
    short: '被认可',
    description: '希望自己的能力和名字被更多人知道、认可和尊重。',
    polarity: 'positive',
    whatItMeans: '外界的认可对你有明显的激励作用。',
    careersHint: '专业资质、作品集、公开成果都能积累声望，但声望通常是结果而不是起点。',
  },
  {
    key: 'balance',
    name: '生活平衡',
    short: '有自己的时间',
    description: '希望工作之外还有足够的时间给家人、爱好和自己。',
    polarity: 'positive',
    whatItMeans: '你不愿意把全部生活都交给工作。',
    careersHint: '不同岗位的时间弹性差别很大，专业面试时可以直接问清加班与出差情况。',
  },
  {
    key: 'relationship',
    name: '人际氛围',
    short: '和得来的人一起',
    description: '希望和一群合得来、互相支持的人一起做事。',
    polarity: 'positive',
    whatItMeans: '团队氛围直接影响你能发挥多少。',
    careersHint: '除了选职业，也要看具体团队：同一份工作在不同团队里的体验可能完全不同。',
  },
];

export const VALUE_DIMENSION_MAP: Record<string, ValueDef> = Object.fromEntries(
  VALUE_DIMENSIONS.map((item) => [item.key, item]),
);
