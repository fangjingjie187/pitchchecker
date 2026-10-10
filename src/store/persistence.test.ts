import { describe, expect, it } from 'vitest';
import {
  SCHEMA_VERSION,
  STORAGE_KEY,
  clearState,
  createInitialState,
  exportBackup,
  loadState,
  parseBackup,
  saveState,
} from './persistence';
import type { AppState } from '@/types';

function stateWithProfile(): AppState {
  const state = createInitialState();
  return {
    ...state,
    consent: { accepted: true, acceptedAt: Date.now(), version: 1 },
    profile: {
      nickname: '小罗',
      gradeBand: '15-16',
      gender: 'undisclosed',
      regionType: 'undisclosed',
      createdAt: Date.now(),
    },
  };
}

describe('localStorage 持久化', () => {
  it('空存储时返回 null', () => {
    expect(loadState()).toBeNull();
  });

  it('保存后可原样读回', () => {
    const state = stateWithProfile();
    saveState(state);
    const loaded = loadState();
    expect(loaded?.profile?.gradeBand).toBe('15-16');
    expect(loaded?.consent.accepted).toBe(true);
  });

  it('读取到损坏的 JSON 时不抛错', () => {
    window.localStorage.setItem(STORAGE_KEY, '{not-json');
    expect(loadState()).toBeNull();
  });

  it('缺失字段会被归一化补全', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: SCHEMA_VERSION }));
    const loaded = loadState();
    expect(loaded?.results).toEqual([]);
    expect(loaded?.settings.quickMode).toBe(false);
  });

  it('清除后不再有数据', () => {
    saveState(stateWithProfile());
    clearState();
    expect(loadState()).toBeNull();
  });
});

describe('备份导入导出', () => {
  it('导出的备份不包含昵称', () => {
    const json = exportBackup(stateWithProfile());
    expect(json).not.toContain('小罗');
    expect(json).not.toContain('nickname');
  });

  it('导出后可解析回来，且保留年级段', () => {
    const json = exportBackup(stateWithProfile());
    const restored = parseBackup(json);
    expect(restored.profile?.gradeBand).toBe('15-16');
    expect(restored.profile?.nickname).toBe('');
  });

  it('拒绝非本应用的 JSON', () => {
    expect(() => parseBackup(JSON.stringify({ app: 'other' }))).toThrow(/生涯罗盘/);
  });

  it('拒绝非法 JSON', () => {
    expect(() => parseBackup('abc')).toThrow(/JSON/);
  });

  it('拒绝高于当前版本的备份', () => {
    expect(() =>
      parseBackup(JSON.stringify({ app: 'career-compass', schemaVersion: 999, state: {} })),
    ).toThrow(/版本高于/);
  });
});
