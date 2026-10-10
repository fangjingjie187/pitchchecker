import clsx, { type ClassValue } from 'clsx';

/** 类名拼接。用于收敛 Tailwind 类名，避免散落在业务组件里 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
