import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { ModuleKey, ModuleMeta, ValidityFlag } from '@/types';

/**
 * 模块完成后的即时小结：一行反馈 + 可信度提示 + 下一步入口。
 *
 * D1 四态：
 *  1. 有未完成模块 且 P0 未全完成 → 主按钮「下一模块 · XX（N 题）」（注册表顺序下一个未完成，任意层级）；
 *  2. 有未完成模块 且 P0 已全完成 → 主按钮「生成我的生涯画像」+ 次按钮「继续选做 · XX（N 题）」；
 *  3. 全部完成 → 仅「生成我的生涯画像」；
 *  4. 「返回大厅」始终保留。
 */
export function ClosingFeedbackPanel({
  feedback,
  flags,
  moduleTitle,
  nextModule,
  nextOptional,
  canGenerate,
  onBackToHub,
  onNavigateModule,
  onGenerate,
}: {
  feedback: string;
  flags: ValidityFlag[];
  moduleTitle: string;
  /** P0 未全完成时：注册表顺序下一个未完成模块（任意层级） */
  nextModule: ModuleMeta | null;
  /** P0 已全完成时：下一个未完成的选做模块；快速模式下恒为 null（P1/P2 不可见） */
  nextOptional: ModuleMeta | null;
  canGenerate: boolean;
  onBackToHub: () => void;
  onNavigateModule: (key: ModuleKey) => void;
  onGenerate: () => void;
}) {
  const showNextModule = !canGenerate && nextModule !== null;
  const showNextOptional = canGenerate && nextOptional !== null;
  const hasPrimary = showNextModule || canGenerate;

  return (
    <div className="surface animate-fade-up p-6 sm:p-8" role="status" aria-live="polite">
      <Badge tone="success">「{moduleTitle}」已完成</Badge>

      <p className="mt-4 text-lg font-medium leading-relaxed text-ink-900">{feedback}</p>

      {flags.length > 0 ? (
        <div className="mt-5 rounded-xl bg-amber-50 p-4">
          <p className="text-xs font-semibold text-amber-800">一点小提示（不影响结果使用）</p>
          <ul className="mt-2 space-y-1 text-xs leading-relaxed text-amber-800">
            {flags.map((flag) => (
              <li key={flag.code}>· {flag.message}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* 移动端纵向堆叠，桌面并排；主按钮 primary → 继续选做 outline → 返回大厅 ghost 层级递减 */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {showNextModule && nextModule ? (
          <Button size="lg" onClick={() => onNavigateModule(nextModule.key)}>
            下一模块 · {nextModule.title}（{nextModule.itemCount} 题）
          </Button>
        ) : null}
        {canGenerate ? (
          <Button size="lg" onClick={onGenerate}>
            生成我的生涯画像
          </Button>
        ) : null}
        {showNextOptional && nextOptional ? (
          <Button variant="outline" size="lg" onClick={() => onNavigateModule(nextOptional.key)}>
            继续选做 · {nextOptional.title}（{nextOptional.itemCount} 题）
          </Button>
        ) : null}
        <Button variant={hasPrimary ? 'ghost' : 'primary'} size="lg" onClick={onBackToHub}>
          返回大厅
        </Button>
      </div>
    </div>
  );
}
