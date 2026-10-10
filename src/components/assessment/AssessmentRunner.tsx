import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useAssessment } from '@/hooks/useAssessment';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { AUTO_ADVANCE_MS } from '@/config/app.config';
import { getActiveModules } from '@/config/modules';
import { computeDimensionStats, countAnswered, isAnswered } from '@/domain/scale';
import { shouldAutoAdvance, shouldAutoComplete } from '@/domain/advance';
import { buildClosingFeedback } from '@/domain/closingFeedback';
import { checkValidity } from '@/domain/validity';
import { getItemsForBand } from '@/data/items';
import { canGenerateReport } from '@/store/selectors';
import type { AnswerValue, GradeBand, ModuleKey, ModuleMeta } from '@/types';
import { QuestionCard } from './QuestionCard';
import { ItemProgress } from './ItemProgress';
import { ClosingFeedbackPanel } from './ClosingFeedbackPanel';

/**
 * 单模块作答流程。
 *
 * 关键行为：
 *  · 中断续答：题序写入 store，刷新后回到上次位置；
 *  · 即时反馈：全部作答完成后自动标记完成并显示一行小结；
 *  · 有效性检验：完成后计算 Flags，以温和提示呈现；
 *  · 键盘：量表支持 1–5，Enter 进入下一题；
 *  · 自动跳题：仅在"进入该题时它尚未作答"的情况下触发一次，
 *             回退到已答题不会再次跳走（见 domain/advance.ts，已有单测锁定）；
 *  · 动效：prefers-reduced-motion 下自动跳题延迟为 0。
 */
export function AssessmentRunner({
  meta,
  gradeBand,
  onExit,
  onNavigateModule,
  onGenerate,
}: {
  meta: ModuleMeta;
  gradeBand: GradeBand;
  onExit: () => void;
  /** 跳转到指定模块（完成态的「下一模块」） */
  onNavigateModule: (key: ModuleKey) => void;
  /** 跳转到结果生成（完成态的「生成画像」） */
  onGenerate: () => void;
}) {
  const { state, dispatch } = useAssessment();
  const reduced = usePrefersReducedMotion();
  const record = state.answers[meta.key];

  const items = useMemo(() => getItemsForBand(meta.key, gradeBand), [meta.key, gradeBand]);
  const [index, setIndex] = useState(() =>
    Math.min(Math.max(record?.currentIndex ?? 0, 0), Math.max(items.length - 1, 0)),
  );
  const [showFeedback, setShowFeedback] = useState(() => Boolean(record?.completed));
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tick = useRef(Date.now());
  /** 进入当前题时它是否尚未作答（决定能否自动跳题） */
  const unansweredOnArrival = useRef(true);
  /** 本次进入是否已自动跳过 */
  const advancedOnce = useRef(false);

  const answers = record?.answers ?? {};
  const answered = countAnswered(items, answers);
  const item = items[index];
  const currentAnswered = item ? isAnswered(item, answers[item.id]) : false;
  const atLast = index >= items.length - 1;

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  // 初次挂载（含中断续答）：按到达的第一题初始化"是否未作答"标记
  useEffect(() => {
    const first = items[index];
    unansweredOnArrival.current = first ? !isAnswered(first, answers[first.id]) : true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const commitDuration = useCallback(() => {
    const now = Date.now();
    dispatch({ type: 'ADD_DURATION', module: meta.key, deltaMs: Math.max(0, now - tick.current) });
    tick.current = now;
  }, [dispatch, meta.key]);

  const go = useCallback(
    (delta: number) => {
      if (delta < 0) dispatch({ type: 'METRIC_BACK' });
      commitDuration();
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
      // C2 修复：在 setState updater 内调用 dispatch 会在渲染期更新其他组件
      // （React "Cannot update a component while rendering"），改为在 updater 外先算好 next
      const next = Math.min(Math.max(index + delta, 0), items.length - 1);
      // 记录到达新题时它的作答状态：已作答过 → 不再自动跳走
      unansweredOnArrival.current = !isAnswered(items[next], answers[items[next].id]);
      advancedOnce.current = false;
      setIndex(next);
      dispatch({ type: 'SET_INDEX', module: meta.key, index: next });
    },
    [answers, commitDuration, dispatch, index, items, meta.key],
  );

  // 全部作答完成 → 标记完成并展示即时小结（开放题需手动点「完成」，见 shouldAutoComplete）
  useEffect(() => {
    if (items.length === 0) return;
    if (!shouldAutoComplete({ itemType: item?.type ?? 'open', answered, total: items.length })) return;
    const now = Date.now();
    dispatch({ type: 'ADD_DURATION', module: meta.key, deltaMs: Math.max(0, now - tick.current) });
    tick.current = now;
    if (!record?.completed) dispatch({ type: 'COMPLETE_MODULE', module: meta.key });
    setShowFeedback(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answered, items.length]);

  // 手动完成（开放题作为最后一题时，需用户点击「完成模块」进入小结）
  const finishModule = useCallback(() => {
    commitDuration();
    dispatch({ type: 'COMPLETE_MODULE', module: meta.key });
    setShowFeedback(true);
  }, [commitDuration, dispatch, meta.key]);

  const handleChange = (value: AnswerValue) => {
    if (!item) return;
    dispatch({ type: 'ANSWER', module: meta.key, itemId: item.id, value });

    if (
      shouldAutoAdvance({
        itemType: item.type,
        wasUnansweredOnArrival: unansweredOnArrival.current,
        alreadyAdvanced: advancedOnce.current,
        isLast: atLast,
      })
    ) {
      advancedOnce.current = true;
      dispatch({ type: 'METRIC_AUTO_ADVANCE' });
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => go(1), reduced ? 0 : AUTO_ADVANCE_MS);
    }
  };

  // Enter 进入下一题
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Enter') return;
      const target = event.target as HTMLElement | null;
      if (target?.tagName === 'TEXTAREA') return;
      if (showFeedback || !currentAnswered) return;
      event.preventDefault();
      if (atLast) return;
      go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [atLast, currentAnswered, go, showFeedback]);

  const stats = useMemo(
    () => computeDimensionStats(meta.key, answers, gradeBand),
    [meta.key, answers, gradeBand],
  );
  const flags = useMemo(
    () => checkValidity({ module: meta.key, answers, durationMs: record?.durationMs ?? 0, items }),
    [meta.key, answers, record?.durationMs, items],
  );
  const feedback = useMemo(() => buildClosingFeedback(meta.key, stats), [meta.key, stats]);

  if (!item) {
    return (
      <div className="surface p-6 text-sm text-muted">这个模块暂时没有题目，请返回大厅。</div>
    );
  }

  if (showFeedback) {
    // 遍历当前激活的全部模块（非快速模式 = 全部 7 个），不按 priority 截断
    const activeModules = getActiveModules({ quickMode: state.settings.quickMode });
    // 注册表顺序下一个「未完成」模块：先找 order 更大的，再从头兜底（排除当前模块）
    const findNextIncomplete = () =>
      activeModules.find((m) => m.order > meta.order && !state.answers[m.key]?.completed) ??
      activeModules.find((m) => m.key !== meta.key && !state.answers[m.key]?.completed) ??
      null;
    const canGenerate = canGenerateReport(state);
    // D1 四态：P0 未全完成 → 下一模块（任意层级）；P0 全完成 → 生成画像 + 继续选做
    const nextModule = canGenerate ? null : findNextIncomplete();
    const nextOptional = canGenerate ? findNextIncomplete() : null;
    return (
      <ClosingFeedbackPanel
        feedback={feedback || '记下你的答案了。'}
        flags={flags}
        moduleTitle={meta.title}
        nextModule={nextModule}
        nextOptional={nextOptional}
        canGenerate={canGenerate}
        onBackToHub={onExit}
        onNavigateModule={onNavigateModule}
        onGenerate={onGenerate}
      />
    );
  }

  return (
    <div className="pb-24 sm:pb-0">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <ItemProgress current={index + 1} total={items.length} className="min-w-[200px] flex-1" />
        <Button variant="ghost" size="sm" onClick={onExit} className="no-print">
          先离开
        </Button>
      </div>

      <QuestionCard
        item={item}
        prompt={meta.prompt}
        value={answers[item.id]}
        onChange={handleChange}
        scaleLabels={meta.scale.labels}
        index={index}
        total={items.length}
      />

      {/* 桌面端：题卡下方操作区；移动端：固定在底部，回退入口同样显眼 */}
      <div className="mt-5 hidden items-center justify-between gap-3 sm:flex">
        <Button variant="outline" size="lg" disabled={index === 0} onClick={() => go(-1)}>
          ← 上一题
        </Button>
        <span className="text-xs text-muted">
          {atLast
            ? currentAnswered
              ? '答完这一题，点「完成模块」结束'
              : '作答后点「完成模块」结束'
            : currentAnswered
              ? '按 Enter 也可以进入下一题'
              : '选一个答案后继续'}
        </span>
        {atLast ? (
          <Button size="lg" disabled={!currentAnswered} onClick={finishModule}>
            完成模块 ✓
          </Button>
        ) : (
          <Button size="lg" disabled={!currentAnswered} onClick={() => go(1)}>
            下一题 →
          </Button>
        )}
      </div>

      <div className="no-print fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-brand-100 bg-paper/95 px-4 py-3 backdrop-blur sm:hidden">
        <Button
          variant="outline"
          size="lg"
          disabled={index === 0}
          onClick={() => go(-1)}
          className="flex-1"
        >
          ← 上一题
        </Button>
        {atLast ? (
          <Button size="lg" disabled={!currentAnswered} onClick={finishModule} className="flex-1">
            完成模块 ✓
          </Button>
        ) : (
          <Button size="lg" disabled={!currentAnswered} onClick={() => go(1)} className="flex-1">
            下一题 →
          </Button>
        )}
      </div>

      {atLast && currentAnswered && answered < items.length ? (
        <p className="mt-3 text-center text-xs text-amber-700">
          还有 {items.length - answered} 题没作答，可以用「上一题」回去补上。
        </p>
      ) : null}
    </div>
  );
}
