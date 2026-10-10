import { Link, Navigate } from 'react-router-dom';
import {
  CRISIS_HINT,
  DISCLAIMER,
  DISCLAIMER_SHORT,
  SUBJECT_REQUIREMENT_NOTE,
  SUBJECT_REQUIREMENT_SOURCE,
} from '@/config/app.config';
import { Button } from '@/components/ui/Button';
import { PageTransition } from '@/components/layout/PageTransition';
import { ReportToolbar } from '@/components/report/ReportToolbar';
import {
  ActionPlanSection,
  AbilitySection,
  AdaptabilitySection,
  CareerMatchSection,
  DecisionSection,
  HeroSection,
  InterestSection,
  NarrativeSection,
  PathwaySection,
  PersonalitySection,
  QuadrantSection,
  ReportSection,
  ValueSection,
} from '@/components/report/sections';
import { useAssessment } from '@/hooks/useAssessment';
import { selectLatestResult } from '@/store/selectors';

/** 报告页：10 个区块 + 固定免责声明 + 打印/分享 */
export default function ReportPage() {
  const { state } = useAssessment();
  const result = selectLatestResult(state);

  if (!result) {
    return <Navigate to="/hub" replace />;
  }
  const report = result.report;

  return (
    <PageTransition>
      <div className="container-page">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">我的生涯画像</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">认识现在的自己</h1>
            <p className="mt-2 text-sm text-muted">
              {report.mode === 'quick' ? '快速模式 · 核心三模块' : '完整模式'} · 生成于{' '}
              {new Date(report.createdAt).toLocaleString('zh-CN')}
            </p>
          </div>
          <ReportToolbar report={report} />
        </div>

        <HeroSection report={report} />

        <div className="mt-8">
          <ReportSection index={2} title="兴趣剖面" description="你天然被什么吸引，兴趣有多聚焦。">
            <InterestSection report={report} />
          </ReportSection>

          <ReportSection index={3} title="能力自信度" description="你对自己做好这些事的信心有多高。">
            <AbilitySection report={report} />
          </ReportSection>

          <ReportSection index={4} title="兴趣 × 能力四象限" description="喜欢和擅长，并不总是同一件事。">
            <QuadrantSection report={report} />
          </ReportSection>

          <ReportSection index={5} title="工作价值观" description="什么对你来说最重要。">
            <ValueSection report={report} />
          </ReportSection>

          <ReportSection index={6} title="人格特质" description="你的学习与合作风格偏好。">
            <PersonalitySection report={report} />
          </ReportSection>

          <ReportSection index={7} title="生涯适应力" description="面对未来，你的准备度如何。">
            <AdaptabilitySection report={report} />
          </ReportSection>

          <ReportSection index={8} title="决策风格" description="你通常怎么做选择，以及更稳的五步。">
            <DecisionSection report={report} />
          </ReportSection>

          <ReportSection index={9} title="职业匹配推荐" description="把兴趣、能力、价值观放在一起，找出值得了解的方向。">
            <CareerMatchSection report={report} />
          </ReportSection>

          <ReportSection
            index={9}
            title="学科 → 选科 → 专业 → 职业"
            description="从今天的课堂，一路看到将来的职业。"
          >
            <PathwaySection report={report} />
          </ReportSection>

          <ReportSection index={10} title="你的下一步" description="按近、中、远三个时间层排好的行动清单。">
            <ActionPlanSection report={report} />
          </ReportSection>

          <ReportSection index={10} title="你的生涯故事">
            <NarrativeSection report={report} />
          </ReportSection>
        </div>

        <div className="mt-8 space-y-3 rounded-xl2 border border-brand-100 bg-paper p-5">
          <p className="text-xs font-semibold text-ink-700">使用说明与免责声明</p>
          <ul className="space-y-1.5 text-xs leading-relaxed text-muted">
            {DISCLAIMER.map((line) => (
              <li key={line}>· {line}</li>
            ))}
            <li>
              · 选科与专业信息为通用描述，{SUBJECT_REQUIREMENT_NOTE}临床医学、药学等"必选物理+化学"的表述依据
              {SUBJECT_REQUIREMENT_SOURCE}。
            </li>
          </ul>
          <p className="text-xs leading-relaxed text-coral-700">{CRISIS_HINT}</p>
          <p className="print-only text-xs text-muted">{DISCLAIMER_SHORT}</p>
        </div>

        <div className="no-print mt-8 flex flex-wrap items-center justify-between gap-3">
          <Link to="/hub" className="text-sm font-medium text-brand-700 underline-offset-4 hover:underline">
            返回探索大厅
          </Link>
          <Button variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            回到顶部
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
