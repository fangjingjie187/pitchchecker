import type { GradeBand } from '@/types';

export const APP = {
  name: '生涯罗盘',
  fullName: '生涯罗盘 · 高中生生涯探索工具',
  /** 面向教育资源相对有限学校场景的价值主张。UI 全程不使用标签化地域字眼 */
  tagline: '让每一所中学的学生都能获得科学的生涯探索支持',
  description:
    '认识自己的兴趣、能力自信度与工作价值观，看清学科、选科、专业与职业之间的连接。',
  /** 由 vite.config.ts 从 package.json 注入，页脚展示，便于区分新旧版本 */
  version: __APP_VERSION__,
  /** 构建时间戳（ms），页脚展示 */
  buildTime: __APP_BUILD_TIME__,
  /** 代码冻结线 */
  freezeDate: '2026-10-24',
} as const;

export interface GradeBandDef {
  key: GradeBand;
  label: string;
  description: string;
  /** Super 发展阶段对应 */
  superStage: string;
  /** 该阶段报告侧重点 */
  reportFocus: string;
}

export const GRADE_BANDS: GradeBandDef[] = [
  {
    key: '12-14',
    label: '初中阶段（12–14 岁）',
    description: '广泛尝试，建立兴趣与学科的连接',
    superStage: '成长期末（兴趣与能力期）',
    reportFocus: '探索广度、学科联结、活动尝试',
  },
  {
    key: '15-16',
    label: '高一阶段（15–16 岁）',
    description: '认识选科与专业，开始收窄方向',
    superStage: '探索期 · 试探阶段',
    reportFocus: '选科认知、专业认知、科目—职业关联',
  },
  {
    key: '17-18',
    label: '高二至高三（17–18 岁）',
    description: '做出决策并落实执行',
    superStage: '探索期 · 过渡阶段',
    reportFocus: '决策执行、志愿准备、行动计划落地',
  },
];

/** 演示默认年级段：高一（15–16），重点展示选科与专业认知内容 */
export const DEFAULT_GRADE_BAND: GradeBand = '15-16';

export const CONSENT_VERSION = 1;

/** 危机提示文案（定稿）。仅温和提示，不做任何判定 */
export const CRISIS_HINT =
  '如果最近情绪持续低落、压力很大，可以和信任的家人、老师聊聊，也可以拨打12355青少年服务台热线（共青团中央，全国统一号码）。';

/** 报告页脚固定免责声明 */
export const DISCLAIMER = [
  '本报告是帮助你认识自己的探索工具，不是能力测定，也不是职业指定。',
  '结果反映的是你此刻的想法与感受，会随着经历和成长而变化。',
  '本工具的测评条目为研究演示用自编 / 改编版本，面向高中生的适配改编未经标准化信效度检验。',
  '如果你对结果有疑问，欢迎和学校的心理老师或生涯规划老师一起讨论。',
] as const;

export const DISCLAIMER_SHORT = '本报告为探索工具，非能力判定，非职业指定。';

/**
 * 大学专业"选科要求"的统一脚注。
 * 各专业条目中的 subjectRequirement 为通用描述，不同省份、不同院校、不同年份政策均有差异，
 * 凡展示该字段的位置都必须同时展示本脚注。
 */
export const SUBJECT_REQUIREMENT_NOTE = '具体以各省最新招生政策为准。';

/**
 * 选科要求的政策依据（临床医学、药学等"必选物理+化学"的出处）。
 * 依据：教育部《普通高校本科招生专业选考科目要求指引（通用版）》（教学厅函〔2021〕27号）。
 */
export const SUBJECT_REQUIREMENT_SOURCE =
  '《普通高校本科招生专业选考科目要求指引（通用版）》（教学厅函〔2021〕27号）';

/** 分享码旁提示 */
export const SHARE_CODE_NOTE = '包含你的测评结果摘要，仅分享给信任的人。';

/** 隐私承诺 */
export const PRIVACY_PROMISE = [
  '所有作答只保存在你自己的设备浏览器里，不会上传到任何服务器。',
  '报告中不会出现你的学校、姓名等身份信息。',
  '你可以随时在页面底部一键清除全部数据。',
] as const;

export const QUICK_MODE = {
  label: '快速模式',
  description: '暖场 + 兴趣、能力、价值观 3 个核心模块，约 6 分钟。',
} as const;

/** 前期实地调研（2024 年施测，实测数据已填报） */
export const RESEARCH_CONTEXT = {
  year: 2024,
  /** 样本描述 */
  description:
    '山东、河南两所县域普通高中高一学生，2024年施测，职业决策因素量表（胡洁，2007）高中生改编版',
  instrument: '职业决策因素量表（胡洁，2007）高中生改编版',
  /** 有效样本量 */
  n: 2119,
  male: 968,
  female: 1151,
} as const;

/**
 * 暖场常模锚定脚注。
 * 清晰度与担心两条滑条锚定自 2024 年实测；信息充足度为预估参考值。
 */
export const WARMUP_NORM_NOTE =
  '清晰度与担心两条滑条的同龄参考区间，锚定自2024年两省县中高一学生实测数据（n=2119）；信息充足度为预估参考值。';

/** 离散选择题作答后自动跳题的延迟（ms）。试测后可直接调参 */
export const AUTO_ADVANCE_MS = 280;
