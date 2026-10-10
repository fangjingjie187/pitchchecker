import { useCallback } from 'react';

/**
 * 打印 / 导出 PDF：采用零依赖的 window.print + @media print 方案，
 * 相比 html2canvas 截图，能保证文字可选中、图表不失真、体积更小。
 */
export function usePrint() {
  return useCallback((title?: string) => {
    const previous = document.title;
    if (title) document.title = title;
    window.print();
    // 部分浏览器 print 为同步阻塞，延迟还原标题
    setTimeout(() => {
      document.title = previous;
    }, 500);
  }, []);
}
