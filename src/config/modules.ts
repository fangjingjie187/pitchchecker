import type { ModuleMeta, ModuleKey, Priority } from '@/types';

/**
 * 模块注册表。
 * 说明：模块的顺序、题量、优先级、理论一句话属于结构性配置，故放在 config/ 而非 data/，
 * 使 data/ 目录保持为"纯题目内容"，便于整体替换校对。
 *
 * 交付分层：
 *   P0 = 兴趣 18 + 能力 12 + 价值观 10（核心，快速模式仅包含 P0 + 暖场）
 *   P1 = 生涯适应力 12 + 决策风格 10（理论核心，优先保证）
 *   P2 = 人格 12（时间不足可直接从 ENABLED_PRIORITIES 中移除，不影响其他模块）
 */

/** 控制哪些优先级参与作答。移除 'P2' 即整体下线人格模块，无需改动其他代码 */
export const ENABLED_PRIORITIES: Priority[] = ['P0', 'P1', 'P2'];

export const MODULES: ModuleMeta[] = [
  {
    key: 'warmup',
    title: '暖场三问',
    subtitle: '先说说你现在的状态',
    theory: '职业未决的双维结构：定向清晰度、情感舒适、职业信息充足度',
    theorySource:
      '借鉴 Holland 等职业决策量表 MVS（1980）的构念框架（VI 定向清晰度 / OI 职业信息需求 / Barriers 障碍感知），并参考胡洁（2007）高中生职业决策因素量表改编版的表述方式。本模块条目为自编 / 改编的演示版本，不是标准化 MVS 量表。',
    priority: 'P0',
    order: 0,
    itemCount: 4,
    estimatedMinutes: 1,
    inQuickMode: true,
    enabled: true,
    scale: { type: 'slider100', min: 0, max: 100, step: 10, labels: ['完全不是', '完全是'] },
    dimensions: ['clarity', 'comfort', 'information'],
    closingFeedback: false,
    intro: '三个滑条，不用想太久，凭第一感觉拉到你觉得合适的位置。',
    prompt: '凭第一感觉，把它拉到合适的位置',
  },
  {
    key: 'interest',
    title: '兴趣探索',
    subtitle: '你天然被什么吸引',
    theory: 'Holland 职业兴趣类型理论（RIASEC 六型 + 六边形结构）',
    theorySource: 'Holland (1959, 1985) 职业兴趣类型理论；RIASEC 六边形模型',
    priority: 'P0',
    order: 1,
    itemCount: 18,
    estimatedMinutes: 3,
    inQuickMode: true,
    enabled: true,
    scale: {
      type: 'likert5',
      min: 1,
      max: 5,
      step: 1,
      labels: ['很不喜欢', '不太喜欢', '一般', '比较喜欢', '很喜欢'],
    },
    dimensions: ['R', 'I', 'A', 'S', 'E', 'C'],
    closingFeedback: true,
    intro: '下面描述的是一些活动。请选择你对这件事的真实喜欢程度，没有对错。',
    // 硬性要求：兴趣模块问的是"喜欢程度"
    prompt: '你喜欢做这件事的程度',
  },
  {
    key: 'ability',
    title: '能力自信度',
    subtitle: '你觉得自己能做好什么',
    theory: '社会认知生涯理论 SCCT：自我效能影响兴趣形成与职业选择',
    theorySource: 'Bandura 自我效能理论；Lent, Brown & Hackett (1994) 社会认知生涯理论 SCCT',
    priority: 'P0',
    order: 2,
    itemCount: 12,
    estimatedMinutes: 3,
    inQuickMode: true,
    enabled: true,
    scale: { type: 'slider100', min: 0, max: 100, step: 10, labels: ['完全没信心', '非常有信心'] },
    dimensions: ['verbal', 'logic', 'spatial', 'handson', 'interpersonal', 'creative'],
    closingFeedback: true,
    intro:
      '这次问的不是"你有多优秀"，而是"你有多有信心"。信心可以通过练习一点点长起来。',
    // 硬性要求：能力模块必须使用 Bandura 自我效能标尺措辞"你有多大信心"
    prompt: '你有多大信心做好这件事？',
  },
  {
    key: 'value',
    title: '工作价值观',
    subtitle: '什么对你最重要',
    theory: 'Super 工作价值观：判断一份工作"好不好"的底层标准',
    theorySource: 'Super (1970) 工作价值观量表 WVI，青少年版精简为 10 项',
    priority: 'P0',
    order: 3,
    itemCount: 10,
    estimatedMinutes: 2,
    inQuickMode: true,
    enabled: true,
    scale: {
      type: 'likert5',
      min: 1,
      max: 5,
      step: 1,
      labels: ['很不重要', '不太重要', '一般', '比较重要', '非常重要'],
    },
    dimensions: [
      'achievement',
      'independence',
      'altruism',
      'creativity',
      'intellectual',
      'reward',
      'security',
      'prestige',
      'balance',
      'relationship',
    ],
    closingFeedback: true,
    intro: '价值观没有高下之分，只是每个人的排序不同。它会随着年龄和经历变化。比如"工资高但天天加班"和"钱少点但时间自由"，你更看重哪头？',
    prompt: '这一点对你有多重要？',
  },
  {
    key: 'adaptability',
    title: '生涯适应力',
    subtitle: '面对未来，你的准备度如何',
    theory: '生涯建构理论 4C：关注、控制、好奇、信心',
    theorySource: 'Savickas 生涯建构理论；CAAS 生涯适应力量表（Savickas & Porfeli, 2012）',
    priority: 'P1',
    order: 4,
    itemCount: 12,
    estimatedMinutes: 2,
    inQuickMode: false,
    enabled: true,
    scale: {
      type: 'likert5',
      min: 1,
      max: 5,
      step: 1,
      labels: ['很不符合', '不太符合', '一般', '比较符合', '很符合'],
    },
    dimensions: ['concern', 'control', 'curiosity', 'confidence'],
    closingFeedback: true,
    intro: '适应力不是天生的，它是可以练出来的能力。',
    prompt: '这句话有多符合你？',
  },
  {
    key: 'decision',
    title: '决策风格',
    subtitle: '你通常怎么做选择',
    theory: '一般决策风格 GDMS 五风格：理性、直觉、依赖、回避、 spontaneity',
    theorySource:
      'Dinklage (1968) 决策风格分类；Scott & Bruce (1995) 一般决策风格量表 GDMS；Harren 决策风格模型辅助引用。条目为自编改编演示版本。',
    priority: 'P1',
    order: 5,
    itemCount: 10,
    estimatedMinutes: 2,
    inQuickMode: false,
    enabled: true,
    scale: {
      type: 'likert5',
      min: 1,
      max: 5,
      step: 1,
      labels: ['很不符合', '不太符合', '一般', '比较符合', '很符合'],
    },
    dimensions: ['rational', 'intuitive', 'dependent', 'avoidant', 'spontaneous'],
    closingFeedback: true,
    intro: '做选择没有标准答案，但了解自己的习惯能让你更从容。',
    prompt: '这句话有多符合你？',
  },
  {
    key: 'personality',
    title: '人格特质',
    subtitle: '你的风格偏好',
    theory: '大五人格：描述学习与合作的风格偏好，不决定你能做什么',
    theorySource: 'Costa & McCrae 大五人格模型（NEO 体系），青少年简版改编',
    priority: 'P2',
    order: 6,
    itemCount: 12,
    estimatedMinutes: 2,
    inQuickMode: false,
    enabled: true,
    scale: {
      type: 'likert5',
      min: 1,
      max: 5,
      step: 1,
      labels: ['很不符合', '不太符合', '一般', '比较符合', '很符合'],
    },
    dimensions: ['extraversion', 'agreeableness', 'conscientiousness', 'stability', 'openness'],
    closingFeedback: true,
    intro: '人格描述的是风格偏好，不是能力上限，也不该成为限制你的标签。',
    prompt: '这句话有多符合你？',
  },
];

/** 按优先级与启用状态过滤后的实际作答模块（顺序按 order） */
export function getActiveModules(options?: { quickMode?: boolean }): ModuleMeta[] {
  return MODULES.filter((m) => {
    if (!m.enabled) return false;
    if (!ENABLED_PRIORITIES.includes(m.priority)) return false;
    if (options?.quickMode && !m.inQuickMode) return false;
    return true;
  }).sort((a, b) => a.order - b.order);
}

export function getModule(key: ModuleKey): ModuleMeta | undefined {
  return MODULES.find((m) => m.key === key);
}

export const MODULE_KEYS: ModuleKey[] = MODULES.map((m) => m.key);
