import { useCallback, useEffect, useState } from 'react';

/** 轻量 localStorage 读写（用于与作答无关的局部偏好，如折叠状态） */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // 存储不可用时忽略
    }
  }, [key, value]);

  const remove = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setValue(initialValue);
    } catch {
      // 忽略
    }
  }, [key, initialValue]);

  return [value, setValue, remove] as const;
}
