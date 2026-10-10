import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_GRADE_BAND } from '@/config/app.config';
import { Card } from '@/components/ui/Card';
import { PageTransition } from '@/components/layout/PageTransition';
import { useAssessment } from '@/hooks/useAssessment';
import { buildReport } from '@/domain/buildReport';
import { canGenerateReport } from '@/store/selectors';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * 结果生成页：CASVE 五步过渡动画，实际执行计分与落库。
 * 报告对象只计算一次并写入结果快照，随后跳转 /report。
 */
const CASVE = [
  { name: '沟通', line: '先看清：你现在的样子是怎样的？' },
  { name: '分析', line: '把兴趣、能力与价值观放在一起看。' },
  { name: '综合', line: '找出与你最匹配的职业方向。' },
  { name: '评估', line: '把今天的课堂和将来的职业连成一条路。' },
  { name: '执行', line: '为你排好下一步可以做的事。' },
];

export default function ComputingPage() {
  const { state, dispatch } = useAssessment();
  const navigate = useNavigate();
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  const addedRef = useRef(false);

  const gradeBand = state.profile?.gradeBand ?? DEFAULT_GRADE_BAND;
  const ready = canGenerateReport(state);

  const report = useMemo(() => (ready ? buildReport(state, gradeBand) : null), []);

  // 生成并落库（严格一次：StrictMode 双调 effect 由 ref 兜底）
  useEffect(() => {
    if (!report || addedRef.current) return;
    addedRef.current = true;
    dispatch({
      type: 'ADD_RESULT',
      snapshot: { id: report.id, createdAt: report.createdAt, gradeBand, mode: report.mode, report },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 五步过渡 + 跳转
  useEffect(() => {
    if (!report) return;
    const total = reduced ? 400 : 2500;
    const perStep = total / CASVE.length;
    if (step < CASVE.length) {
      const timer = setTimeout(() => setStep((prev) => prev + 1), perStep);
      return () => clearTimeout(timer);
    }
    const jump = setTimeout(() => navigate('/report', { replace: true }), 300);
    return () => clearTimeout(jump);
  }, [step, report, reduced, navigate]);

  if (!ready || !report) {
    return (
      <PageTransition>
        <div className="container-page max-w-xl">
          <Card>
            <p className="text-sm text-muted">
              还没有完成核心模块（暖场 + 兴趣 + 能力 + 价值观），请先回到大厅完成作答。
            </p>
          </Card>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container-page max-w-xl">
        <Card className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
            正在生成你的生涯画像
          </p>
          <ul className="mt-6 space-y-3 text-left">
            {CASVE.map((item, index) => {
              const done = index < step;
              const current = index === step;
              return (
                <li
                  key={item.name}
                  className={
                    'flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ' +
                    (current ? 'bg-brand-50' : done ? 'text-ink-700' : 'text-ink-400')
                  }
                >
                  <span
                    className={
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ' +
                      (done ? 'bg-brand-500 text-white' : 'bg-brand-100 text-brand-700')
                    }
                  >
                    {done ? '✓' : index + 1}
                  </span>
                  <span>
                    <strong className="text-sm">{item.name}</strong>
                    <span className="ml-2 text-sm">{item.line}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </PageTransition>
  );
}
