import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';

/**
 * 弹窗。
 *
 * ⚠ 重要：必须用 createPortal 挂到 document.body。
 * 页面内容被 <PageTransition> 包裹，其入场动画 animate-fade-up 结束后会保留
 * transform: translateY(0)（非 none）。CSS 规范中「transform 非 none 的元素会成为
 * 后代 position:fixed 的 containing block」——若 Modal 留在页面 DOM 树内，
 * fixed inset-0 将相对该容器定位而非视口，对话框会被推到几千像素深的页面下方，
 * 视口内只剩遮罩灰底（表现为"点了弹窗，屏幕变灰但看不到内容"）。
 * Portal 到 body 后脱离该容器，fixed 永远相对视口，任何页面都安全。
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-ink-900/40 animate-fade-in" onClick={onClose} aria-hidden />
      <div
        className={cn(
          'relative w-full max-w-lg rounded-t-xl3 bg-paper p-5 shadow-card-hover animate-pop-in sm:rounded-xl2 sm:p-6',
          className,
        )}
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
        {children ? <div className="mt-4">{children}</div> : null}
        {footer ? <div className="mt-6 flex flex-wrap justify-end gap-2">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}
