import type { AbilityDef } from '@/types';

/**
 * 能力自信度六个维度。
 * 理论：Bandura 自我效能理论；Lent, Brown & Hackett (1994) 社会认知生涯理论（SCCT）。
 * 重要：本模块测的是"我有多有信心"，不是"我有多强"。自我效能是可塑的，
 * 报告中的每一次低分都必须配一条提升路径，避免把"现在没信心"读成"我不行"。
 */
export const ABILITY_DIMENSIONS: AbilityDef[] = [
  {
    key: 'verbal',
    name: '言语表达',
    short: '表达',
    description: '把一件事说清楚、写明白，让别人听得懂、愿意听。',
    polarity: 'positive',
    trainingTips: [
      '每周一次"三分钟讲清楚"练习：选一个知识点讲给同学或家人听',
      '写完后出声读一遍，把超过 30 字的句子拆开',
      '做课堂发言前的 3 句话提纲：结论、理由、例子',
    ],
  },
  {
    key: 'logic',
    name: '逻辑数理',
    short: '推理',
    description: '从数字和信息里找规律、做推理、发现不对劲的地方。',
    polarity: 'positive',
    trainingTips: [
      '做题后回看一步：这道题的"关键转折"在哪一步',
      '每天记一个生活里的数据（开销、步数、天气），试着找规律',
      '遇到结论先问一句"依据是什么"',
    ],
  },
  {
    key: 'spatial',
    name: '空间想象',
    short: '空间',
    description: '在脑子里旋转、拆分和组合图形，想象平面与立体的关系。',
    polarity: 'positive',
    trainingTips: [
      '看说明书前先自己猜一遍组装顺序，再对照',
      '用纸盒做一次立体模型的展开图',
      '在陌生地方先看地图确定方位，再出发',
    ],
  },
  {
    key: 'handson',
    name: '动手操作',
    short: '动手',
    description: '用工具、材料和身体把事情真正做出来。',
    polarity: 'positive',
    trainingTips: [
      '独立完成一次拆装或组装（家具、模型、设备）',
      '学一件需要手上的活：做饭、缝扣子、接线路、做手工',
      '做完后记录"哪一步卡住了"，下次先解决这一步',
    ],
  },
  {
    key: 'interpersonal',
    name: '人际沟通',
    short: '人际',
    description: '和不同的人合作，察觉对方的状态，把话说得合适。',
    polarity: 'positive',
    trainingTips: [
      '小组活动里主动承担一次"确认分工"的角色',
      '练习一句共情话术："你是说……对吗？"',
      '冲突时先复述对方的观点，再说自己的',
    ],
  },
  {
    key: 'creative',
    name: '创意想象',
    short: '创意',
    description: '想出不一样又说得通的点子，并把它变成看得见的作品。',
    polarity: 'positive',
    trainingTips: [
      '每周做一次"一题五解"：同一个问题想出 5 种做法',
      '把喜欢的一个作品拆开看：它为什么吸引我',
      '从一个小作品开始做完整：一篇短文、一组图、一段视频',
    ],
  },
];

export const ABILITY_DIMENSION_MAP: Record<string, AbilityDef> = Object.fromEntries(
  ABILITY_DIMENSIONS.map((item) => [item.key, item]),
);
