import { CONSENT_VERSION, DEFAULT_GRADE_BAND } from '@/config/app.config';
import type { AppState, GradeBand } from '@/types';
import { assertNoIdentity } from '@/utils/privacy';

/**
 * 本地持久化层。
 * 设计要点：
 *  - 单一 key + 版本号，便于整体迁移；
 *  - 所有读写集中于此，未来换 IndexedDB 只需替换本文件；
 *  - 导出内容一律经过身份信息拦截（合规）。
 */

export const STORAGE_KEY = 'career-compass';
export const SCHEMA_VERSION = 1;

export function createInitialState(): AppState {
  return {
    version: SCHEMA_VERSION,
    consent: { accepted: false, acceptedAt: null, version: CONSENT_VERSION },
    profile: null,
    answers: {},
    results: [],
    settings: { quickMode: false, demoMode: false, lastPersonaId: null },
    metrics: { backClicks: 0, autoAdvances: 0 },
  };
}

type Migration = (raw: Record<string, unknown>) => Record<string, unknown>;

/** 版本迁移函数表：key 为"从该版本迁移到下一版本" */
const MIGRATIONS: Record<number, Migration> = {
  // 示例：1: (raw) => ({ ...raw, settings: { ...(raw.settings ?? {}), demoMode: false } }),
};

function migrate(raw: Record<string, unknown>): AppState {
  let current = raw;
  let version = typeof current.version === 'number' ? current.version : 0;
  while (version < SCHEMA_VERSION) {
    const migration = MIGRATIONS[version];
    if (!migration) {
      // 无可用迁移路径：回退到初始态，避免脏数据导致崩溃
      return createInitialState();
    }
    current = migration(current);
    version += 1;
    current = { ...current, version };
  }
  return normalizeState(current as unknown as Partial<AppState>);
}

function normalizeState(partial: Partial<AppState>): AppState {
  const base = createInitialState();
  return {
    version: SCHEMA_VERSION,
    consent: { ...base.consent, ...(partial.consent ?? {}) },
    profile: partial.profile ?? null,
    answers: partial.answers ?? {},
    results: Array.isArray(partial.results) ? partial.results : [],
    settings: { ...base.settings, ...(partial.settings ?? {}) },
    metrics: { ...base.metrics, ...(partial.metrics ?? {}) },
  };
}

function getStorage(): Storage | null {
  try {
    const probe = '__cc_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    // 隐私模式 / 禁用存储：降级为纯内存运行
    return null;
  }
}

export function loadState(): AppState | null {
  const storage = getStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return migrate(parsed);
  } catch {
    return null;
  }
}

export function saveState(state: AppState): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify({ ...state, version: SCHEMA_VERSION }));
  } catch {
    // 配额超限等异常：静默失败，不打断作答
  }
}

export function clearState(): void {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(STORAGE_KEY);
}

export interface BackupFile {
  app: 'career-compass';
  schemaVersion: number;
  exportedAt: number;
  /** 仅包含非身份信息与作答 / 结果数据 */
  state: Omit<AppState, 'profile'> & { gradeBand: string | null };
}

/** 生成可导入的备份内容（剔除昵称等身份字段，但保留年级段用于常模参照） */
export function buildBackup(state: AppState): BackupFile {
  return {
    app: 'career-compass',
    schemaVersion: SCHEMA_VERSION,
    exportedAt: Date.now(),
    state: {
      version: SCHEMA_VERSION,
      consent: state.consent,
      answers: state.answers,
      results: state.results,
      settings: state.settings,
      metrics: state.metrics,
      gradeBand: state.profile?.gradeBand ?? DEFAULT_GRADE_BAND,
    },
  };
}

export function exportBackup(state: AppState): string {
  const backup = buildBackup(state);
  assertNoIdentity(backup, '备份文件');
  return JSON.stringify(backup, null, 2);
}

/** 解析并校验备份文件；返回归一化后的 state（不含 profile，需用户重新填写基本信息） */
export function parseBackup(json: string): AppState {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('不是有效的 JSON 备份文件');
  }
  const backup = parsed as Partial<BackupFile>;
  if (!backup || backup.app !== 'career-compass') {
    throw new Error('这个文件不是生涯罗盘的数据备份');
  }
  if (typeof backup.schemaVersion !== 'number') {
    throw new Error('备份文件缺少版本信息');
  }
  if (backup.schemaVersion > SCHEMA_VERSION) {
    throw new Error('备份文件版本高于当前应用，请更新后重试');
  }
  const incoming = (backup.state ?? {}) as Partial<AppState> & { gradeBand?: string | null };
  const gradeBand = (incoming.gradeBand ?? DEFAULT_GRADE_BAND) as GradeBand;
  return normalizeState({
    ...incoming,
    profile: {
      nickname: '',
      gradeBand,
      gender: 'undisclosed',
      regionType: 'undisclosed',
      createdAt: Date.now(),
    },
  });
}
