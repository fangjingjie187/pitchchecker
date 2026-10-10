import type { GradeBand, HollandCode, ModuleKey, ScoreLevel } from './common';
import type { ActionHorizon } from './report';
import type { DimensionDef } from './assessment';

/** Holland 六型定义（data/holland.ts） */
export interface HollandTypeDef extends DimensionDef {
  holland: HollandCode;
  keywords: string[];
  typicalActivities: string[];
  relatedSubjects: string[];
  relatedMajorCategories: string[];
  strengths: string;
  misconceptions: string;
}

/** 能力维度定义（data/abilities.ts） */
export interface AbilityDef extends DimensionDef {
  /** 提升该能力自信度的可操作建议 */
  trainingTips: string[];
}

/** 工作价值观定义（data/values.ts） */
export interface ValueDef extends DimensionDef {
  whatItMeans: string;
  careersHint: string;
}

/** 人格维度定义（data/traits.ts） */
export interface TraitDef extends DimensionDef {
  studyTip: string;
  collabTip: string;
}

/** 生涯适应力 4C 定义（data/adaptability.ts） */
export interface AdaptabilityDef extends DimensionDef {
  /** 对应的干预思路 */
  intervention: string;
  /** 一个可以直接去做的练习（Savickas 取向：适应力可训练） */
  activity: string;
}

/** 决策风格定义（data/decisionStyles.ts） */
export interface DecisionStyleDef extends DimensionDef {
  description: string;
  risk: string;
  tip: string;
  /** 对应 CASVE 循环中需要重点补的环节 */
  casveFocus: string[];
}

/** 演示常模条目 */
export interface NormEntry {
  mean: number;
  sd: number;
}

/** 行动建议条目（data/actions.ts） */
export interface ActionItemData {
  id: string;
  module: ModuleKey;
  dimension: string;
  level: ScoreLevel;
  horizons: ActionHorizon[];
  gradeBands?: GradeBand[];
  text: string;
}

/** 某维度三种分数档位的解释文案 */
export interface InterpretationSet {
  high: string;
  mid: string;
  low: string;
}

export interface ModuleInterpretation {
  /** 模块整体的一句话解读 */
  summary: string;
  dimensions: Record<string, InterpretationSet>;
}

/** 演示人设（data/demoPersonas.ts） */
export interface DemoPersona {
  id: string;
  name: string;
  description: string;
  gradeBand: GradeBand;
  /** 现场演示默认人设 */
  isDefault: boolean;
  /** 各维度的作答强度（0–1），未列出的维度使用 base */
  dimensionLevels: Record<string, number>;
  /** 未指定维度的基础强度 */
  base: number;
  /** 随机波动幅度（0–1） */
  noise: number;
  /** 开放题预填答案 */
  openAnswers?: Record<string, string>;
}

/** 离线生成的模拟作答样本（data/sampleResponses.json） */
export interface SampleResponsesFile {
  meta: {
    seed: number;
    count: number;
    generatedAt: string;
    note: string;
  };
  responses: {
    id: string;
    gradeBand: GradeBand;
    answers: Partial<Record<ModuleKey, Record<string, number>>>;
  }[];
}
