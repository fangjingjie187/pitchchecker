import { afterEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Modal } from './Modal';

/**
 * Modal 可见性回归单测。
 *
 * 灰屏根因回顾：Modal 若留在页面 DOM 树内，会被 <PageTransition> 的 transform
 * （animate-fade-up 残留 translateY(0)）劫持为 fixed 的 containing block，导致
 * 弹窗被推到视口外 + 动画不推进 opacity 0。修复是 createPortal 挂到 document.body。
 *
 * 本测试锁定的核心不变量：open 时 dialog 必须挂在 document.body 下（脱离任何
 * transform 祖先）。jsdom 无布局引擎，无法真实断言 getBoundingClientRect 视口内坐标；
 * 视口内 bounding box + opacity 的视觉断言由 E2E 层覆盖（见 README「测试规范」）。
 */

let container: HTMLDivElement;
let root: Root;

afterEach(() => {
  act(() => {
    root?.unmount();
  });
  container?.remove();
  document.body.style.overflow = '';
});

function render(open: boolean, onClose = vi.fn()) {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => {
    root.render(
      <Modal
        open={open}
        onClose={onClose}
        title="你的结果分享码"
        description="包含你的测评结果摘要，仅分享给信任的人。"
      >
        <p>CODE-123</p>
      </Modal>,
    );
  });
  return onClose;
}

describe('Modal 可见性（portal 回归锁）', () => {
  it('open 时通过 portal 挂载到 document.body，脱离页面 transform 祖先', () => {
    render(true);
    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog).toBeTruthy();
    expect(dialog!.parentElement).toBe(document.body);
  });

  it('渲染标题、描述与内容', () => {
    render(true);
    const dialog = document.querySelector('[role="dialog"]')!;
    expect(dialog.textContent).toContain('你的结果分享码');
    expect(dialog.textContent).toContain('包含你的测评结果摘要');
    expect(dialog.textContent).toContain('CODE-123');
  });

  it('open=false 时不渲染任何 dialog', () => {
    render(false);
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  it('Esc 触发 onClose', () => {
    const onClose = render(true);
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
