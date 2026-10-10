import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DISCLAIMER_SHORT } from '@/config/app.config';
import { GRADE_BANDS } from '@/config/app.config';
import { decodeShareCode } from '@/utils/shareCode';
import { sharePayloadToSummary, type ShareSummary } from '@/utils/reportShare';
import { Button } from '@/components/ui/Button';
import { Card, SectionTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DimensionBars } from '@/components/charts/DimensionBars';
import { PageTransition } from '@/components/layout/PageTransition';

/**
 * 分享码还原页：输入好友分享的码，临时查看简版结果。
 * 不写入 localStorage（纯内存展示），刷新即消失。
 */
export default function ShareReportPage() {
  const [input, setInput] = useState('');
  const [summary, setSummary] = useState<ShareSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleView = () => {
    setError(null);
    try {
      const payload = decodeShareCode(input);
      setSummary(sharePayloadToSummary(payload));
    } catch (err) {
      setSummary(null);
      setError(err instanceof Error ? err.message : '分享码无效');
    }
  };

  const gradeLabel = summary
    ? GRADE_BANDS.find((band) => band.key === summary.gradeBand)?.label ?? summary.gradeBand
    : '';

  return (
    <PageTransition>
      <div className="container-page max-w-3xl">
        <SectionTitle
          eyebrow="分享码"
          title="从分享码查看结果"
          description="输入同学或朋友分享的码，临时查看一份简版生涯画像。只在这台设备临时显示，不会保存。"
        />

        <Card>
          <label className="text-sm font-medium text-ink-800" htmlFor="share-code">
            粘贴分享码
          </label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              id="share-code"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="例如：ABCDE-FGHJK-MNPQR-STVWX"
              autoComplete="off"
              className="h-12 flex-1 rounded-xl border border-brand-200 bg-paper px-4 font-mono text-sm tracking-wide outline-none transition-colors focus:border-brand-400"
            />
            <Button size="lg" onClick={handleView} disabled={!input.trim()}>
              查看结果
            </Button>
          </div>
          {error ? (
            <p className="mt-3 text-sm text-coral-700" role="alert">
              {error}
            </p>
          ) : null}
        </Card>

        {summary ? <ShareSummaryView summary={summary} gradeLabel={gradeLabel} /> : null}

        <div className="mt-6 flex items-center justify-between text-xs text-muted">
          <span>{DISCLAIMER_SHORT}</span>
          <Link to="/" className="text-brand-700 hover:underline">
            ← 返回首页
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}

function ShareSummaryView({ summary, gradeLabel }: { summary: ShareSummary; gradeLabel: string }) {
  const hasInterest = summary.holland !== '---' && summary.interests.some((d) => d.score > 0);
  const hasAdaptability = summary.adaptability.some((d) => d.score > 0);

  return (
    <div className="mt-6 space-y-4">
      <Card className="bg-gradient-to-br from-brand-50 to-coral-50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
              Holland 三字母码
            </p>
            {hasInterest ? (
              <p className="mt-1 text-4xl font-bold tracking-widest text-ink-900">
                {summary.holland}
              </p>
            ) : (
              <p className="mt-1 text-lg font-medium text-muted">兴趣未测</p>
            )}
          </div>
          <Badge tone="brand">{gradeLabel}</Badge>
        </div>
      </Card>

      <Card>
        <h3 className="text-base font-semibold">兴趣六型</h3>
        {hasInterest ? (
          <div className="mt-3">
            <DimensionBars
              data={summary.interests.map((d) => ({ name: `${d.key} ${d.name}`, value: d.score }))}
            />
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted">未完成兴趣模块。</p>
        )}
      </Card>

      <Card>
        <h3 className="text-base font-semibold">能力自信度</h3>
        <div className="mt-3">
          <DimensionBars
            data={summary.abilities.map((d) => ({ name: d.name, value: d.score }))}
          />
        </div>
      </Card>

      <Card>
        <h3 className="text-base font-semibold">最看重的三项</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {summary.values.map((value, index) => (
            <Badge key={value.key} tone={index === 0 ? 'brand' : 'neutral'}>
              {index + 1}. {value.name}
            </Badge>
          ))}
        </div>
      </Card>

      {hasAdaptability ? (
        <Card>
          <h3 className="text-base font-semibold">生涯适应力 4C</h3>
          <div className="mt-3">
            <DimensionBars
              data={summary.adaptability.map((d) => ({ name: d.name, value: d.score }))}
            />
          </div>
        </Card>
      ) : null}

      <Card>
        <h3 className="text-base font-semibold">当前状态（暖场三问）</h3>
        <ul className="mt-3 space-y-2 text-sm text-ink-700">
          {summary.warmup.map((d) => (
            <li key={d.key} className="flex items-center justify-between gap-3">
              <span>{d.name}</span>
              <span className="font-semibold">{d.score}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted">担心程度得分越高表示越担心。</p>
      </Card>

      <p className="rounded-xl bg-mist p-3 text-xs leading-relaxed text-muted">
        这是临时查看的简版结果，未写入本机数据，刷新页面即消失。完整报告请让本人打开「生成分享码」链接查看。
      </p>
    </div>
  );
}
