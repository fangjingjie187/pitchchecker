import { getActiveModules, getModule } from '@/config/modules';
import type { AppState, ModuleKey, ModuleMeta } from '@/types';

export function selectActiveModules(state: AppState): ModuleMeta[] {
  return getActiveModules({ quickMode: state.settings.quickMode });
}

export interface ModuleProgress {
  meta: ModuleMeta;
  answered: number;
  total: number;
  ratio: number;
  completed: boolean;
  currentIndex: number;
}

export function selectModuleProgress(state: AppState, key: ModuleKey): ModuleProgress | null {
  const meta = getModule(key);
  if (!meta) return null;
  const record = state.answers[key];
  const answered = record ? Object.keys(record.answers).length : 0;
  const total = meta.itemCount;
  return {
    meta,
    answered,
    total,
    ratio: total === 0 ? 0 : Math.min(1, answered / total),
    completed: record?.completed ?? false,
    currentIndex: record?.currentIndex ?? 0,
  };
}

export function selectOverallProgress(state: AppState): {
  answered: number;
  total: number;
  ratio: number;
  completedModules: number;
  activeModules: number;
} {
  const modules = selectActiveModules(state);
  let answered = 0;
  let total = 0;
  let completedModules = 0;
  for (const meta of modules) {
    const progress = selectModuleProgress(state, meta.key);
    if (!progress) continue;
    answered += progress.answered;
    total += progress.total;
    if (progress.completed) completedModules += 1;
  }
  return {
    answered,
    total,
    ratio: total === 0 ? 0 : answered / total,
    completedModules,
    activeModules: modules.length,
  };
}

/** 是否可以进入结果生成：至少完成所有 P0 模块 */
export function canGenerateReport(state: AppState): boolean {
  const required = selectActiveModules(state).filter((m) => m.priority === 'P0');
  if (required.length === 0) return false;
  return required.every((m) => state.answers[m.key]?.completed);
}

export function selectMissingModules(state: AppState): ModuleMeta[] {
  return selectActiveModules(state).filter((m) => !state.answers[m.key]?.completed);
}

export function selectLatestResult(state: AppState) {
  return state.results[0] ?? null;
}

/**
 * 试测观察指标：误触回退率。
 * 定义 = 点击「上一题」次数 / 已作答条目数。用于判断自动跳题是否造成误触。
 */
export function selectBackRate(state: AppState): {
  backClicks: number;
  answered: number;
  rate: number;
} {
  const answered = selectOverallProgress(state).answered;
  const backClicks = state.metrics?.backClicks ?? 0;
  return {
    backClicks,
    answered,
    rate: answered === 0 ? 0 : Math.round((backClicks / answered) * 1000) / 10,
  };
}
