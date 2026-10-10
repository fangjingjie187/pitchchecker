import type { GradeBand, HollandCode, ModuleKey, ScoreLevel } from './common';
import type { PathwayResult } from './career';

/** 作答有效性标记（前端可检验的部分） */
export interface ValidityFlag {
  code: 'tooFast' | 'straightLine' | 'inconsistentPair' | 'incomplete' | 'lowVariance';
  level: 'warn' | 'error';
  message: string;
}

export interface DimensionScore {
  key: string;
  name: string;
  /** 原始总分 */
  raw: number;
  /** 维度均分（已按量表量程归一到 0–100） */
  mean: number;
  /** 参考常模百分等级 0–100（演示常模，非标准化常模） */
  percentile: number;
  level: ScoreLevel;
}

export interface ModuleScore {
  module: ModuleKey;
  dimensions: DimensionScore[];
  /** 完成后即时显示的一行小结反馈 */
  closingFeedback: string;
  /** 模块解读段落 */
  narrative: string;
  completedAt: number;
  validity: ValidityFlag[];
}

/** Holland 衍生指数：一致性与分化度 */
export interface HollandProfile {
  /** 三字母码，如 'SAI' */
  code: string;
  scores: DimensionScore[];
  /** 一致性：前两码在六边形上的距离（1 相邻 / 2 相隔 / 3 相对），转换为 0–100，越高越聚焦 */
  consistency: number;
  /** 分化度：最高分与最低分之差（归一到 0–100） */
  differentiation: number;
  /** 主要类型与次要类型 */
  primary: HollandCode;
  secondary: HollandCode;
}

export interface CareerMatch {
  careerId: string;
  /** 综合匹配度 0–100 */
  total: number;
  interest: number;
  ability: number;
  value: number;
  /** 可解释的匹配理由（自然语言，逐条展示贡献） */
  reasons: string[];
}

export interface QuadrantItem {
  key: string;
  label: string;
  /** x：兴趣（0–100） */
  x: number;
  /** y：能力自信度（0–100） */
  y: number;
  zone: 'strength' | 'growth' | 'potential' | 'explore';
}

export type ActionHorizon = 'near' | 'mid' | 'long';

export interface ActionPlanItem {
  id: string;
  horizon: ActionHorizon;
  text: string;
  /** 依据的模块 / 维度，便于追溯来源 */
  source: string;
  done?: boolean;
}

/** 完整报告对象。注意：不含昵称、学校等任何身份信息（合规要求） */
export interface Report {
  id: string;
  createdAt: number;
  gradeBand: GradeBand;
  mode: 'full' | 'quick';
  /** 参与计分的模块（决定报告展示哪些区块） */
  modules: ModuleKey[];
  warmup: ModuleScore | null;
  interest: ModuleScore | null;
  ability: ModuleScore | null;
  value: ModuleScore | null;
  adaptability: ModuleScore | null;
  decision: ModuleScore | null;
  personality: ModuleScore | null;
  holland: HollandProfile | null;
  /** 兴趣 × 能力四象限 */
  quadrants: QuadrantItem[];
  /** Top N 职业匹配 */
  matches: CareerMatch[];
  /** 学科 → 选科 → 专业 → 职业路径（报告核心亮点区块） */
  pathway: PathwayResult | null;
  /** 分层行动建议 */
  actions: ActionPlanItem[];
  /** 生涯叙事小结（Savickas 生涯建构主义取向） */
  narrative: string;
  /** 结果可信度综合提示 */
  confidenceNote: string;
}
