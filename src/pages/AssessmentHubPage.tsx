import { useNavigate } from 'react-router-dom';
import { QUICK_MODE } from '@/config/app.config';
import { Button } from '@/components/ui/Button';
import { SquareCheckbox } from '@/components/ui/SquareCheckbox';
import { ProgressRing } from '@/components/ui/Progress';
import { SectionTitle } from '@/components/ui/Card';
import { PageTransition } from '@/components/layout/PageTransition';
import { ModuleCard } from '@/components/assessment/ModuleCard';
import { DemoFiller } from '@/components/assessment/DemoFiller';
import { useAssessment } from '@/hooks/useAssessment';
import { selectActiveModules, selectModuleProgress, selectOverallProgress } from '@/store/selectors';
import { canGenerateReport } from '@/store/selectors';

/** 测评大厅：模块入口、总进度、快速模式开关、演示填充 */
export default function AssessmentHubPage() {
  const { state, dispatch } = useAssessment();
  const navigate = useNavigate();
  const modules = selectActiveModules(state);
  const overall = selectOverallProgress(state);
  const ready = canGenerateReport(state);

  return (
    <PageTransition>
      <div className="container-page">
        <SectionTitle
          eyebrow="开始探索"
          title="六件事，认识现在的自己"
          description="按顺序做会更顺，但也可以先从你最想答的那个开始。中途离开不会丢，随时回来继续。"
        />

        <div className="mb-8 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="surface flex items-center gap-4 p-5">
            <ProgressRing value={overall.ratio * 100} size={84} />
            <div>
              <p className="text-sm font-semibold text-ink-900">
                已完成 {overall.completedModules} / {overall.activeModules} 个模块
              </p>
              <p className="mt-1 text-xs text-muted">
                {overall.answered} / {overall.total} 题
              </p>
            </div>
          </div>

          <div className="surface flex flex-wrap items-center justify-between gap-4 p-5">
            <SquareCheckbox
              checked={state.settings.quickMode}
              onChange={(next) => dispatch({ type: 'SET_SETTINGS', patch: { quickMode: next } })}
              label={QUICK_MODE.label}
              description={QUICK_MODE.description}
            />
            <Button
              size="lg"
              disabled={!ready}
              onClick={() => navigate('/computing')}
              className="shrink-0"
            >
              生成我的生涯画像
            </Button>
          </div>
        </div>

        {!ready ? (
          <p className="mb-6 text-xs text-muted">
            完成「暖场 + 兴趣 + 能力 + 价值观」四个模块后即可生成结果。
          </p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((meta) => {
            const progress = selectModuleProgress(state, meta.key);
            return (
              <ModuleCard
                key={meta.key}
                meta={meta}
                answered={progress?.answered ?? 0}
                completed={progress?.completed ?? false}
                onStart={() => navigate(`/assess/${meta.key}`)}
                onRestart={() => {
                  dispatch({ type: 'RESET_MODULE', module: meta.key });
                  navigate(`/assess/${meta.key}`);
                }}
              />
            );
          })}
        </div>

        <div className="mt-10 space-y-4">
          <SquareCheckbox
            checked={state.settings.demoMode}
            onChange={(next) => dispatch({ type: 'SET_SETTINGS', patch: { demoMode: next } })}
            label="演示模式"
            description="用示例数据一键填充，快速查看完整报告。"
          />
          {state.settings.demoMode ? <DemoFiller /> : null}
        </div>
      </div>
    </PageTransition>
  );
}
