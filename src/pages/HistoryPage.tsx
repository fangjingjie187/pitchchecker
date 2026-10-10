import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, SectionTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/Feedback';
import { Button } from '@/components/ui/Button';
import { PageTransition } from '@/components/layout/PageTransition';
import { CompareRadar } from '@/components/charts/CompareRadar';
import { useAssessment } from '@/hooks/useAssessment';
import { HEX_ORDER } from '@/config/scoring.config';
import { HOLLAND_COLORS } from '@/config/theme.config';
import { formatDateTime } from '@/utils/format';
import type { ResultSnapshot } from '@/types';

/** 成长档案：单次报告降级提示；多次报告雷达叠加对比 + Holland 码变化时间轴 */
export default function HistoryPage() {
  const { state } = useAssessment();
  const results = state.results;

  if (results.length === 0) {
    return (
      <PageTransition>
        <div className="container-page max-w-2xl">
          <SectionTitle eyebrow="成长档案" title="还没有记录" />
          <EmptyState
            title="你还没有完成过一次测评"
            description="完成核心模块并生成报告后，这里会记录你的生涯画像，方便你隔一段时间回看变化。"
            action={
              <Link to="/hub">
                <Button>开始探索</Button>
              </Link>
            }
          />
        </div>
      </PageTransition>
    );
  }

  if (results.length === 1) {
    return <SingleResultView result={results[0]} />;
  }

  return <CompareView results={results} />;
}

/** 单次报告：降级为"完成首次测评"提示 */
function SingleResultView({ result }: { result: ResultSnapshot }) {
  return (
    <PageTransition>
      <div className="container-page max-w-2xl">
        <SectionTitle
          eyebrow="成长档案"
          title="完成首次测评"
          description="你已经有了一份生涯画像。建议过 2–4 周再来做一次，这里会展示两次之间的变化轨迹。"
        />
        <Card>
          <Badge tone="success">首次测评完成</Badge>
          <p className="mt-3 text-sm text-ink-700">
            {result.report.holland
              ? `当前参考代码 ${result.report.holland.code}（兴趣分化度 ${result.report.holland.differentiation}）`
              : '兴趣画像已生成'}
          </p>
          <p className="mt-1 text-xs text-muted">完成于 {formatDateTime(result.createdAt)}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/report">
              <Button>查看这份报告</Button>
            </Link>
            <Link to="/hub">
              <Button variant="outline">再做一次</Button>
            </Link>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}

function CompareView({ results }: { results: ResultSnapshot[] }) {
  // 取最近两次做雷达叠加；时间轴展示全部（最多 20 条）
  const recent = results.slice(0, 2);

  const radar = useMemo(() => {
    const series = recent.map((item) => {
      const map = new Map(item.report.interest?.dimensions.map((score) => [score.key, score.mean]) ?? []);
      return {
        name: formatDateTime(item.createdAt),
        values: HEX_ORDER.map((code) => Math.round(map.get(code) ?? 0)),
      };
    });
    return { dimensions: [...HEX_ORDER], series };
  }, [recent]);

  const timeline = useMemo(() => {
    return results.map((item) => {
      const code = item.report.holland?.code ?? '—';
      return { id: item.id, createdAt: item.createdAt, code, diff: item.report.holland?.differentiation ?? null };
    });
  }, [results]);

  return (
    <PageTransition>
      <div className="container-page">
        <SectionTitle
          eyebrow="成长档案"
          title={`你的 ${results.length} 次探索`}
          description="隔一段时间重测，看自己的兴趣与方向发生了哪些变化。"
        />

        <Card className="mb-6">
          <h3 className="text-base font-semibold">最近两次 · 兴趣剖面叠加</h3>
          <p className="mt-1 text-xs text-muted">同一坐标系下对比两次的六型得分。</p>
          <div className="mt-3">
            <CompareRadar dimensions={radar.dimensions} series={radar.series} />
          </div>
        </Card>

        <Card>
          <h3 className="text-base font-semibold">Holland 码变化时间轴</h3>
          <p className="mt-1 text-xs text-muted">三字母码与兴趣分化度随时间的演变。</p>
          <ol className="mt-4 space-y-3">
            {timeline.map((item, index) => (
              <li key={item.id} className="flex items-start gap-3">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700">
                  {index + 1}
                </span>
                <div className="flex flex-1 flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ background: HOLLAND_COLORS[item.code[0] as keyof typeof HOLLAND_COLORS] }}
                    />
                    <span className="font-mono text-sm font-semibold text-ink-900">{item.code}</span>
                    <span className="text-xs text-muted">
                      {item.diff === null ? '兴趣画像待生成' : `分化度 ${item.diff}`}
                    </span>
                  </div>
                  <span className="text-xs text-muted">{formatDateTime(item.createdAt)}</span>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-5 border-t border-brand-50 pt-4 text-xs text-muted">
            记录只保存在本机。需要删除某条记录，可在下方对应项操作；也可以
            <Link to="/" className="mx-1 text-brand-700 underline-offset-4 hover:underline">
              返回首页
            </Link>
            查看完整说明。
          </div>
        </Card>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/hub">
            <Button variant="outline">再做一次测评</Button>
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
