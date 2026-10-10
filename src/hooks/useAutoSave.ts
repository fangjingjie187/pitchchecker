import { useEffect, useRef } from 'react';

/**
 * 通用防抖保存。当前状态落盘由 AssessmentProvider 统一处理，
 * 该 hook 用于局部场景（如开放题长文本、行动计划勾选）。
 */
export function useAutoSave<T>(value: T, save: (value: T) => void, delayMs = 500): void {
  const latest = useRef(value);
  latest.current = value;

  useEffect(() => {
    const timer = setTimeout(() => save(latest.current), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs, save]);
}
