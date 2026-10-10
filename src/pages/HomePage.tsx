import { Link, useNavigate } from 'react-router-dom';
import { APP, CRISIS_HINT } from '@/config/app.config';
import { MODULES } from '@/config/modules';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PageTransition } from '@/components/layout/PageTransition';
import { useAssessment } from '@/hooks/useAssessment';
import { selectOverallProgress } from '@/store/selectors';

/** 首页：价值主张 + 三步流程 + 理论背书（CIP 金字塔映射） */
export default function HomePage() {
  const { state } = useAssessment();
  const navigate = useNavigate();
  const progress = selectOverallProgress(state);
  const started = progress.answered > 0;

  const steps = [
    {
      title: '认识自己',
      desc: '兴趣、能力自信度、工作价值观——三个角度看清楚"我是谁"。',
    },
    {
      title: '看见连接',
      desc: '把今天的学科、将来的选科与专业、可能的职业连成一条路。',
    },
    {
      title: '做出下一步',
      desc: '拿到一份分阶段的行动清单，从这一学期就能开始做。',
    },
  ];

  return (
    <PageTransition>
      <div className="container-page">
        <section className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <Badge tone="brand">面向 12–18 岁 · 参赛演示版本</Badge>
            <h1 className="mt-4 text-balance text-3xl font-bold leading-tight sm:text-4xl">
              {APP.tagline}
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-600">
              {APP.description}
              整个测评约 12 分钟，做完你会得到一份属于自己的生涯画像，以及一份看得见、做得到的下一步清单。
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button size="lg" onClick={() => navigate(started ? '/hub' : '/consent')}>
                {started ? '继续探索' : '开始探索'}
              </Button>
              <Link
                to="/about"
                className="text-sm font-medium text-brand-700 underline-offset-4 hover:underline"
              >
                先看看理论依据
              </Link>
            </div>

            {started ? (
              <p className="mt-4 text-xs text-muted">
                你已完成 {progress.answered} / {progress.total} 题，可随时继续。
              </p>
            ) : null}

            <p className="mt-8 max-w-xl rounded-xl bg-paper/70 p-3 text-xs leading-relaxed text-muted">
              {CRISIS_HINT}
            </p>
          </div>

          <Card className="relative overflow-hidden bg-gradient-to-br from-brand-50 to-coral-50">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
              理论骨架
            </p>
            <h2 className="mt-2 text-lg font-semibold">
              认知信息加工理论（CIP）金字塔
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              整个产品的模块划分直接对应这个模型：先建立自我知识与职业知识，再训练决策技能，
              最后通过元认知把想法变成行动。
            </p>
            <ul className="mt-4 space-y-3">
              <PyramidRow level="顶层" label="元认知" items="生涯适应力 · 决策风格 · 反思叙事" />
              <PyramidRow level="中层" label="决策技能" items="CASVE 循环五步引导 · 决策平衡单" />
              <PyramidRow
                level="底层"
                label="自我知识 + 职业知识"
                items="兴趣 / 能力 / 价值观 + 职业库 · 专业库 · 学科路径"
              />
            </ul>
          </Card>
        </section>

        <section className="mt-16">
          <h2 className="text-xl font-semibold sm:text-2xl">三步，从模糊到清楚</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <Card key={step.title} hoverable>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-xl font-semibold sm:text-2xl">你会回答哪些部分</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {MODULES.filter((m) => m.enabled).map((meta) => (
              <Card key={meta.key} padded={false} className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{meta.title}</h3>
                  <Badge tone={meta.priority === 'P0' ? 'brand' : meta.priority === 'P1' ? 'coral' : 'neutral'}>
                    {meta.priority}
                  </Badge>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{meta.subtitle}</p>
                <p className="mt-2 text-[11px] text-ink-400">
                  {meta.itemCount} 题 · 约 {meta.estimatedMinutes} 分钟
                </p>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

function PyramidRow({ level, label, items }: { level: string; label: string; items: string }) {
  return (
    <li className="rounded-xl bg-paper/80 p-3">
      <div className="flex items-center gap-2">
        <span className="rounded-md bg-brand-100 px-2 py-0.5 text-[11px] font-medium text-brand-700">
          {level}
        </span>
        <span className="text-sm font-semibold text-ink-800">{label}</span>
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-ink-600">{items}</p>
    </li>
  );
}
