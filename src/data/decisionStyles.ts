import type { DecisionStyleDef } from '@/types';

/**
 * 决策风格五种类型。
 * 理论：Dinklage (1968) 决策风格分类；Scott & Bruce (1995) 一般决策风格量表 GDMS；
 *      Harren 决策风格模型为辅助引用。
 * 重要：本模块条目为自编 / 改编的演示版本，未经标准化信效度检验（About 页已标注）。
 * 呈现原则：不只给标签，而是给出该风格在 CASVE 循环中需要重点补的环节。
 * 反向题说明：本模块全部正向计分，不使用反向题。
 */
export const DECISION_STYLES: DecisionStyleDef[] = [
  {
    key: 'rational',
    name: '理性型',
    short: '想清楚再定',
    description: '习惯先收集信息、列出选项、逐条比较后再做决定。',
    polarity: 'positive',
    risk: '信息永远收集不完，容易陷入"再查一查"而迟迟不行动。',
    tip: '给信息收集设一个截止时间：时间一到，就用现有的信息做决定。',
    casveFocus: ['valuing', 'execution'],
  },
  {
    key: 'intuitive',
    name: '直觉型',
    short: '凭感觉走',
    description: '更相信自己的第一感觉和内在偏好，不太依赖清单和表格。',
    polarity: 'positive',
    risk: '感觉会被近期的情绪和别人的期待影响，事后容易后悔。',
    tip: '做完决定后补一句"我为什么选它"，把感觉翻译成理由，便于日后复盘。',
    casveFocus: ['analysis', 'valuing'],
  },
  {
    key: 'dependent',
    name: '依赖型',
    short: '想听听别人的',
    description: '重要决定习惯先征求家人、老师或朋友的意见。',
    polarity: 'positive',
    risk: '别人的经验未必适合你，容易把"他们觉得好"当成"我想要"。',
    tip: '先自己写下一版答案，再去问别人；比较两版答案的差异，能看出哪些是你真正的想法。',
    casveFocus: ['communication', 'synthesis'],
  },
  {
    key: 'avoidant',
    name: '回避型',
    short: '先不想了',
    description: '面对选择时倾向于拖延、回避，希望拖到不得不选的时候。',
    polarity: 'negative',
    risk: '拖到最后往往只能"被安排"，选择权其实是在不知不觉中交出去的。',
    tip: '把"做一个大决定"拆成"今天做一件小事"：比如今天就只查清一个专业是学什么的。',
    casveFocus: ['communication', 'execution'],
  },
  {
    key: 'spontaneous',
    name: '即时型',
    short: '想到就做',
    description: '不太纠结，常常临时起意就行动，觉得做错了再调整。',
    polarity: 'positive',
    risk: '有些决定一旦做出就很难回头（比如选科），试错成本并不总是很低。',
    tip: '先分清"可逆"和"不可逆"：可逆的决定可以快，不可逆的决定至少留出一个晚上的思考时间。',
    casveFocus: ['analysis', 'synthesis'],
  },
];

export const DECISION_STYLE_MAP: Record<string, DecisionStyleDef> = Object.fromEntries(
  DECISION_STYLES.map((item) => [item.key, item]),
);

/** CASVE 五步引导问题：报告区块 8 用它把"给结论"变成"带你走一遍决策流程" */
export const CASVE_STEPS: { key: string; name: string; question: string; hint: string }[] = [
  {
    key: 'communication',
    name: '沟通',
    question: '我现在到底要决定什么？理想和现实之间差在哪？',
    hint: '先把它写成一句话，比如"我要在高二选科时决定要不要选物理"。',
  },
  {
    key: 'analysis',
    name: '分析',
    question: '关于这几个选项，我已经知道什么？还缺什么信息？',
    hint: '把"已知"和"待查"分成两栏，只去补"待查"里的空。',
  },
  {
    key: 'synthesis',
    name: '综合',
    question: '除了眼前这几个，还有没有别的可能？能不能缩小到三个？',
    hint: '先脑暴 5 个可能，再按"我最不能接受的"删到 3 个。',
  },
  {
    key: 'valuing',
    name: '评估',
    question: '按我最看重的价值观排，哪个选项排第一？影响了谁？',
    hint: '用报告里的价值观排序给每个选项打分，分数不是答案，是提醒。',
  },
  {
    key: 'execution',
    name: '执行',
    question: '定了之后，我这学期能做的第一件事是什么？',
    hint: '把它写成一个具体到"什么时候、做什么"的小步骤。',
  },
];
