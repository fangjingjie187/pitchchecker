import type { AnswerValue, GradeBand, Gender, ModuleKey, RegionType } from './common';
import type { Report } from './report';

/** 基本信息。nickname 仅用于本机识别，绝不写入报告、导出文件与分享码 */
export interface Profile {
  nickname: string;
  gradeBand: GradeBand;
  gender: Gender;
  regionType: RegionType;
  createdAt: number;
}

export interface Consent {
  accepted: boolean;
  acceptedAt: number | null;
  /** 知情同意文本版本，文本变更时需重新同意 */
  version: number;
}

export type AnswerMap = Record<string, AnswerValue>;

export interface ModuleAnswerState {
  answers: AnswerMap;
  updatedAt: number;
  /** 当前题序（支持中断续答） */
  currentIndex: number;
  completed: boolean;
  /** 累计作答时长（ms），用于有效性检验 */
  durationMs: number;
}

export interface ResultSnapshot {
  id: string;
  createdAt: number;
  gradeBand: GradeBand;
  mode: 'full' | 'quick';
  /** 报告正文（已确保不含身份信息） */
  report: Report;
}

/**
 * 试测观察指标（本机计数，不外传）。
 * 误触回退率 = backClicks / answeredItems —— 用于判断自动跳题是否造成误触。
 */
export interface SessionMetrics {
  /** 点击「上一题」的次数 */
  backClicks: number;
  /** 自动跳题触发次数 */
  autoAdvances: number;
}

export interface Settings {
  /** 快速模式：仅暖场 + 兴趣 + 能力 + 价值观 */
  quickMode: boolean;
  /** 演示模式：允许一键填充人设作答 */
  demoMode: boolean;
  /** 上次使用的演示人设 id */
  lastPersonaId: string | null;
}

export interface AppState {
  version: number;
  consent: Consent;
  profile: Profile | null;
  answers: Partial<Record<ModuleKey, ModuleAnswerState>>;
  results: ResultSnapshot[];
  settings: Settings;
  metrics: SessionMetrics;
}
