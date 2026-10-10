import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/** 页面切换动效。尊重 prefers-reduced-motion：偏好减少动效时直接静态呈现 */
export function PageTransition({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = usePrefersReducedMotion();
  return <div className={cn(reduced ? 'opacity-100' : 'animate-fade-up', className)}>{children}</div>;
}
