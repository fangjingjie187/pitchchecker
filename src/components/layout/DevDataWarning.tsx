import { useState } from 'react';
import { MODULES } from '@/config/modules';
import { DATA_STATUS } from '@/data/status';

/**
 * 开发态提示条：列出尚未填充题目的模块。
 * 仅在 import.meta.env.DEV 下渲染，生产构建中不会输出。
 */
export function DevDataWarning() {
  const [dismissed, setDismissed] = useState(false);

  if (!import.meta.env.DEV || dismissed) return null;

  const missing = MODULES.filter((m) => m.enabled && !DATA_STATUS.populated.includes(m.key));
  if (missing.length === 0) return null;

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
      <div className="container-page flex items-start justify-between gap-4">
        <p>
          <strong>开发提示：</strong>
          以下模块尚未填充题目数据：{missing.map((m) => m.title).join('、')}。
          运行 <code className="rounded bg-white px-1">npm run validate</code> 可查看完整校验报告。
        </p>
        <button type="button" className="shrink-0 underline" onClick={() => setDismissed(true)}>
          知道了
        </button>
      </div>
    </div>
  );
}
