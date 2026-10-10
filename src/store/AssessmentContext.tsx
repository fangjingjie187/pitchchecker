import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { AppState } from '@/types';
import { createInitialState, loadState, saveState } from './persistence';
import { reducer, type Action } from './reducer';

interface AssessmentContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  /** 首次从 localStorage 恢复完成前为 false，避免空状态覆盖已存数据 */
  hydrated: boolean;
}

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

const SAVE_DEBOUNCE_MS = 400;

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => loadState() ?? createInitialState());
  const [hydrated, setHydrated] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // 防抖落盘：作答过程中高频更新不会阻塞交互
  useEffect(() => {
    if (!hydrated) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => saveState(state), SAVE_DEBOUNCE_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [state, hydrated]);

  // 关闭页面前兜底保存一次，避免防抖窗口内丢失最后一题
  useEffect(() => {
    if (!hydrated) return;
    const handler = () => saveState(state);
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [state, hydrated]);

  const value = useMemo<AssessmentContextValue>(() => ({ state, dispatch, hydrated }), [state, hydrated]);

  return <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>;
}

export function useAssessment(): AssessmentContextValue {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error('useAssessment 必须在 AssessmentProvider 内使用');
  return ctx;
}
