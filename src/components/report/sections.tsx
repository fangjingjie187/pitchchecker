import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Card, SectionTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RadarChart } from '@/components/charts/RadarChart';
import { HollandHexagon } from '@/components/charts/HollandHexagon';
import { DimensionBars } from '@/components/charts/DimensionBars';
import { ValueRankChart } from '@/components/charts/ValueRankChart';
import { QuadrantScatter } from '@/components/charts/QuadrantScatter';
import { MatchGauge } from '@/components/charts/MatchGauge';
import { PathwaySankey } from '@/components/charts/PathwaySankey';
import { HOLLAND_TYPES } from '@/data/holland';
import { HOLLAND_COLORS } from '@/config/theme.config';
import { QUADRANT_NOTE } from '@/config/scoring.config';
import { QUADRANT_COLORS } from '@/config/theme.config';
import { QUADRANT_ZONE_LEGEND } from '@/components/charts/QuadrantScatter';
import { CASVE_STEPS } from '@/data/decisionStyles';
import { QUADRANT_ZONE_LABELS } from '@/data/narratives';
import { HORIZON_LABELS } from '@/data/interpretations';
import { CAREER_MAP } from '@/data/careers';
import { ADAPTABILITY_DIMENSION_MAP } from '@/data/adaptability';
import { hollandDisplay } from '@/domain/holland';
import type { ActionPlanItem, ActionHorizon, CareerMatch, Report } from '@/types';

/* ───────────────────────── 通用骨架 ───────────────────────── */

export function ReportSection({
  index,
  title,
  description,
  children,
}: {
  index: number;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="report-section mb-8">
      <SectionTitle eyebrow={`区块 ${index}`} title={title} description={description} />
      {children}
    </section>
  );
}

/** 降级卡片：模块未作答时显示，不空白不报错，带补测入口 */
export function MissingModuleCard({
  moduleTitle,
  moduleKey,
  why,
}: {
  moduleTitle: string;
  moduleKey: string;
  why: string;
}) {
  return (
    <Card className="border-dashed border-brand-300 bg-brand-50/40">
      <Badge tone="neutral">未作答</Badge>
      <p className="mt-3 text-sm text-ink-700">
        你还没有完成「{moduleTitle}」，所以这里暂时是空的。
      </p>
      <p className="mt-1 text-xs text-muted">{why}</p>
      <Link to={`/assess/${moduleKey}`}>
        <Button size="sm" className="mt-4">
          现在去补测（约几分钟）
        </Button>
      </Link>
    </Card>
  );
}

/* ───────────────────────── 区块 1：生涯画像卡 ───────────────────────── */

export function HeroSection({ report }: { report: Report }) {
  const holland = report.holland;
  const interestTop = report.interest?.dimensions[0];
  const abilityTop = report.ability?.dimensions[0];
  const valueTop = report.value?.dimensions[0];

  return (
    <Card className="bg-gradient-to-br from-brand-50 to-coral-50">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">我的生涯画像</p>
          {holland ? (
            hollandDisplay(holland).mode === 'balanced' ? (
              <div className="mt-3">
                <Badge tone="brand">兴趣图谱较为均衡 · 探索期</Badge>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-700">
                  你对很多方向都有兴趣，还没有明显的高低之分。现在更适合广泛尝试，而不是过早锁定方向。
                </p>
                <p className="mt-1 text-xs text-muted">
                  参考代码 {holland.code}（兴趣分化度较低，暂不替你定向）
                </p>
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-3">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-paper text-2xl font-bold tracking-wider text-brand-700 shadow-card">
                  {holland.code}
                </span>
                <div>
                  <p className="text-sm text-ink-600">
                    你的 Holland 三字母码是
                    <strong className="text-ink-900"> {holland.code}</strong>
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    兴趣聚焦度 {holland.consistency} · 兴趣鲜明度 {holland.differentiation}
                  </p>
                </div>
              </div>
            )
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            {interestTop ? <Badge tone="brand">兴趣偏向 {interestTop.name}</Badge> : null}
            {abilityTop ? <Badge tone="coral">最有信心 {abilityTop.name}</Badge> : null}
            {valueTop ? <Badge tone="success">最看重 {valueTop.name}</Badge> : null}
          </div>
        </div>

        <div className="max-w-xs text-xs leading-relaxed text-muted">
          <p>{report.confidenceNote}</p>
        </div>
      </div>
    </Card>
  );
}

/* ───────────────────────── 区块 2：兴趣剖面 ───────────────────────── */

export function InterestSection({ report }: { report: Report }) {
  const holland = report.holland;
  const scores = report.interest?.dimensions ?? [];
  if (!holland) return <MissingModuleCard moduleTitle="兴趣探索" moduleKey="interest" why="完成兴趣模块后，这里会出现你的兴趣六边形与三字母码。" />;

  const scoreMap = Object.fromEntries(scores.map((score) => [score.key, score.mean]));

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
      <Card>
        <h3 className="text-base font-semibold">Holland 六边形</h3>
        <HollandHexagon scores={scoreMap} />
        <div className="mt-2 flex flex-wrap gap-2">
          {HOLLAND_TYPES.map((type) => (
            <span key={type.key} className="inline-flex items-center gap-1 text-xs text-ink-600">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: HOLLAND_COLORS[type.holland] }} />
              {type.key} {type.name}
            </span>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-base font-semibold">各类型得分</h3>
        <DimensionBars
          data={scores.map((score) => ({ name: `${score.key} ${score.name}`, value: score.mean, level: score.level }))}
        />
        <div className="mt-3 rounded-xl bg-mist p-3 text-xs leading-relaxed text-muted">
          <p>
            <strong className="text-ink-700">一致性 {holland.consistency}：</strong>
            {holland.consistency >= 80
              ? '你的兴趣很聚焦，前两类是相邻的，方向比较统一。'
              : holland.consistency >= 50
                ? '你的兴趣有一定跨度，前两类之间隔着一段距离。'
                : '你的前两类兴趣相对较远，说明你可能同时被很不一样的事情吸引。'}
          </p>
          <p className="mt-1">
            <strong className="text-ink-700">分化度 {holland.differentiation}：</strong>
            {holland.differentiation >= 30
              ? '你的兴趣轮廓鲜明，有明显的高低之分。'
              : holland.differentiation >= 15
                ? '你的兴趣有一定倾向，但还没到非它不可。'
                : '你的兴趣比较均衡，适合先广泛尝试再聚焦。'}
          </p>
        </div>
      </Card>
    </div>
  );
}

/* ───────────────────────── 区块 3：能力自信度 ───────────────────────── */

export function AbilitySection({ report }: { report: Report }) {
  const scores = report.ability?.dimensions ?? [];
  if (scores.length === 0) {
    return <MissingModuleCard moduleTitle="能力自信度" moduleKey="ability" why="完成能力模块后，这里会显示六项能力的信心剖面。" />;
  }
  return (
    <Card>
      <DimensionBars
        data={scores.map((score) => ({ name: score.name, value: score.mean, level: score.level }))}
      />
      <p className="mt-3 text-xs leading-relaxed text-muted">
        这一栏测的是"你有多有信心"，不是"你有多强"。信心可以练，低分只说明现在还没练到——每项能力都有对应的练习建议，见下方行动计划。
      </p>
    </Card>
  );
}

/* ───────────────────────── 区块 4：四象限 ───────────────────────── */

export function QuadrantSection({ report }: { report: Report }) {
  const quadrants = report.quadrants;
  if (quadrants.length === 0) {
    return <MissingModuleCard moduleTitle="兴趣 × 能力" moduleKey="interest" why="完成兴趣与能力两个模块后，这里会显示四象限。" />;
  }
  return (
    <Card>
      <QuadrantScatter
        data={quadrants.map((item) => ({ label: item.label, x: item.x, y: item.y, zone: item.zone }))}
      />
      <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted">
        {QUADRANT_ZONE_LEGEND.map((item) => (
          <span key={item.zone} className="inline-flex items-center gap-1.5">
            <span
              aria-hidden
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: QUADRANT_COLORS[item.zone] }}
            />
            {item.name}
          </span>
        ))}
      </div>
      <div className="mt-3 grid gap-2 text-xs leading-relaxed text-muted sm:grid-cols-2">
        {(['strength', 'growth', 'potential', 'explore'] as const).map((zone) => {
          const items = quadrants.filter((item) => item.zone === zone);
          if (items.length === 0) return null;
          return (
            <p key={zone}>
              <strong className="text-ink-700">{QUADRANT_ZONE_LABELS[zone]}：</strong>
              {items.map((item) => item.label).join('、')}
            </p>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-ink-400">{QUADRANT_NOTE}</p>
    </Card>
  );
}

/* ───────────────────────── 区块 5：价值观 ───────────────────────── */

export function ValueSection({ report }: { report: Report }) {
  const scores = report.value?.dimensions ?? [];
  if (scores.length === 0) {
    return <MissingModuleCard moduleTitle="工作价值观" moduleKey="value" why="完成价值观模块后，这里会显示你的价值观排序。" />;
  }
  return (
    <Card>
      <ValueRankChart
        data={scores.map((score, index) => ({ name: score.name, value: score.mean, top3: index < 3 }))}
      />
      <p className="mt-3 text-xs leading-relaxed text-muted">
        你的核心价值观是 <strong className="text-ink-700">{scores.slice(0, 3).map((score) => score.name).join('、')}</strong>。
        它们是你判断"这份工作好不好"的底层标准。
      </p>
    </Card>
  );
}

/* ───────────────────────── 区块 6：人格（P2，降级） ───────────────────────── */

export function PersonalitySection({ report }: { report: Report }) {
  const scores = report.personality?.dimensions ?? [];
  if (scores.length === 0) {
    return (
      <MissingModuleCard
        moduleTitle="人格特质"
        moduleKey="personality"
        why="人格描述学习与合作的风格偏好，不决定你能做什么。完成后这里会出现五维剖面。"
      />
    );
  }
  return (
    <Card>
      <DimensionBars
        data={scores.map((score) => ({ name: score.name, value: score.mean, level: score.level }))}
      />
    </Card>
  );
}

/* ───────────────────────── 区块 7：生涯适应力（P1，降级） ───────────────────────── */

export function AdaptabilitySection({ report }: { report: Report }) {
  const scores = report.adaptability?.dimensions ?? [];
  if (scores.length === 0) {
    return (
      <MissingModuleCard
        moduleTitle="生涯适应力"
        moduleKey="adaptability"
        why="适应力是四项可以练出来的能力：关注、控制、好奇、信心。完成后会给出针对性练习。"
      />
    );
  }
  const lowest = scores[scores.length - 1];
  const def = ADAPTABILITY_DIMENSION_MAP[lowest.key];
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
      <Card>
        <RadarChart
          dimensions={scores.map((score) => ({ name: score.name, value: score.mean }))}
          seriesName="生涯适应力"
        />
      </Card>
      <Card>
        <h3 className="text-base font-semibold">最值得练的一项：{lowest.name}</h3>
        <p className="mt-2 text-sm text-ink-600">{def?.intervention}</p>
        <div className="mt-3 rounded-xl bg-coral-50 p-4">
          <p className="text-xs font-semibold text-coral-800">一个可以直接去做的练习</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-700">{def?.activity}</p>
        </div>
      </Card>
    </div>
  );
}

/* ───────────────────────── 区块 8：决策风格（P1，降级） ───────────────────────── */

export function DecisionSection({ report }: { report: Report }) {
  const scores = report.decision?.dimensions ?? [];
  if (scores.length === 0) {
    return (
      <MissingModuleCard
        moduleTitle="决策风格"
        moduleKey="decision"
        why="了解自己的决策习惯，能让你更从容。完成后这里会给出你的主导风格与五步引导。"
      />
    );
  }
  const top = scores[0];
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
      <Card>
        <DimensionBars
          data={scores.map((score) => ({ name: score.name, value: score.mean, level: score.level }))}
        />
      </Card>
      <Card>
        <h3 className="text-base font-semibold">做重要决定的五步引导</h3>
        <ol className="mt-3 space-y-2">
          {CASVE_STEPS.map((step, index) => (
            <li key={step.key} className="flex gap-2 text-sm">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                {index + 1}
              </span>
              <span className="text-ink-600">
                <strong className="text-ink-800">{step.name}</strong> · {step.question}
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-muted">你的主导风格是「{top.name}」，上面第 1 步往往是它最需要补强的地方。</p>
      </Card>
    </div>
  );
}

/* ───────────────────────── 区块 9：职业匹配 ───────────────────────── */

export function CareerMatchSection({ report }: { report: Report }) {
  const matches = report.matches;
  if (matches.length === 0) {
    return <MissingModuleCard moduleTitle="职业匹配" moduleKey="interest" why="完成兴趣与能力模块后，这里会推荐与你匹配的职业。" />;
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {matches.map((match) => (
        <CareerCard key={match.careerId} match={match} />
      ))}
    </div>
  );
}

function CareerCard({ match }: { match: CareerMatch }) {
  const career = CAREER_MAP[match.careerId];
  if (!career) return null;
  return (
    <Card className="flex flex-col">
      <div className="flex items-center gap-3">
        <div className="h-24 w-24 shrink-0">
          <MatchGauge value={match.total} height={96} />
        </div>
        <div className="min-w-0">
          <h4 className="truncate text-sm font-semibold text-ink-900">{career.name}</h4>
          <p className="mt-1 text-xs text-muted">{career.industry}</p>
          <p className="mt-1 text-[11px] text-ink-400">兴趣 {match.interest} · 能力 {match.ability} · 价值观 {match.value}</p>
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-ink-600 line-clamp-3">{career.dayInLife}</p>
      <details className="mt-2 text-xs">
        <summary className="cursor-pointer text-brand-700">为什么匹配</summary>
        <ul className="mt-2 space-y-1 text-[11px] leading-relaxed text-muted">
          {match.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </details>
      <div className="mt-3 border-t border-brand-50 pt-2">
        <Link
          to={`/careers?holland=${career.hollandCode[0]}&industry=${career.industry}`}
          className="text-xs font-medium text-brand-700 underline-offset-4 hover:underline"
        >
          在职业库中查看同类 →
        </Link>
      </div>
    </Card>
  );
}

/* ───────────────────────── 区块 9b：路径 ───────────────────────── */

export function PathwaySection({ report }: { report: Report }) {
  const pathway = report.pathway;
  if (!pathway || pathway.nodes.length === 0) {
    return <MissingModuleCard moduleTitle="学科 → 选科 → 专业 → 职业" moduleKey="interest" why="完成兴趣与能力模块后，这里会画出你从今天的课堂到将来职业的路。" />;
  }
  return (
    <Card>
      <PathwaySankey pathway={pathway} />
      <ul className="mt-4 space-y-1.5 text-sm leading-relaxed text-ink-700">
        {pathway.narrative.map((line) => (
          <li key={line} className="flex gap-2">
            <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ───────────────────────── 区块 10：行动计划 + 叙事 ───────────────────────── */

export function ActionPlanSection({ report }: { report: Report }) {
  const byHorizon: Record<ActionHorizon, ActionPlanItem[]> = { near: [], mid: [], long: [] };
  report.actions.forEach((item) => byHorizon[item.horizon].push(item));

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {(['near', 'mid', 'long'] as const).map((horizon) => (
        <Card key={horizon}>
          <h3 className="text-base font-semibold">{HORIZON_LABELS[horizon]}</h3>
          <ul className="mt-3 space-y-3">
            {byHorizon[horizon].map((item) => (
              <li key={item.id} className="text-sm leading-relaxed text-ink-700">
                <p>{item.text}</p>
                <p className="mt-1 text-[11px] text-ink-400">依据：{item.source}</p>
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}

export function NarrativeSection({ report }: { report: Report }) {
  return (
    <Card className="bg-gradient-to-br from-brand-50 to-coral-50">
      <h3 className="text-base font-semibold">你的生涯故事</h3>
      <p className="mt-3 whitespace-pre-line text-sm leading-loose text-ink-700">{report.narrative}</p>
    </Card>
  );
}
