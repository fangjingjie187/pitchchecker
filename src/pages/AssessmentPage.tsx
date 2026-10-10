import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { DEFAULT_GRADE_BAND, WARMUP_NORM_NOTE } from '@/config/app.config';
import { getModule } from '@/config/modules';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PageTransition } from '@/components/layout/PageTransition';
import { AssessmentRunner } from '@/components/assessment/AssessmentRunner';
import { useAssessment } from '@/hooks/useAssessment';
import type { ModuleKey } from '@/types';

/** 作答页：单模块逐题作答 */
export default function AssessmentPage() {
  const { moduleKey } = useParams<{ moduleKey: string }>();
  const { state } = useAssessment();
  const navigate = useNavigate();

  const meta = moduleKey ? getModule(moduleKey as ModuleKey) : undefined;
  if (!meta || !meta.enabled) return <Navigate to="/hub" replace />;

  const gradeBand = state.profile?.gradeBand ?? DEFAULT_GRADE_BAND;

  return (
    <PageTransition>
      <div className="container-page max-w-3xl">
        <Card className="mb-5 bg-gradient-to-br from-brand-50 to-coral-50">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand">{meta.priority}</Badge>
            <Badge tone="neutral">
              {meta.itemCount} 题 · 约 {meta.estimatedMinutes} 分钟
            </Badge>
          </div>
          <h1 className="mt-3 text-xl font-semibold sm:text-2xl">{meta.title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">{meta.intro}</p>
          <p className="mt-3 rounded-lg bg-paper/70 p-3 text-xs text-muted">{meta.theory}</p>
        </Card>

        {/* C2：key=moduleKey 强制模块切换时重新挂载，避免上一模块的
            showFeedback/题序状态泄入下一模块（SPA 内部导航不重挂载组件） */}
        <AssessmentRunner
          key={meta.key}
          meta={meta}
          gradeBand={gradeBand}
          onExit={() => navigate('/hub')}
          onNavigateModule={(key) => navigate(`/assess/${key}`)}
          onGenerate={() => navigate('/computing')}
        />

        {meta.key === 'warmup' ? (
          <p className="mt-4 rounded-lg bg-brand-50 p-3 text-xs leading-relaxed text-brand-800">
            常模脚注：{WARMUP_NORM_NOTE}
          </p>
        ) : null}
      </div>
    </PageTransition>
  );
}
