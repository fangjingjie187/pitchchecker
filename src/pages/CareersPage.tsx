import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CAREERS, GROWTH_LABELS, INDUSTRY_LABELS } from '@/data/careers';
import { HOLLAND_TYPES } from '@/data/holland';
import { HOLLAND_COLORS } from '@/config/theme.config';
import { Card, SectionTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PageTransition } from '@/components/layout/PageTransition';
import { cn } from '@/utils/cn';

const GROWTH_KEYS = ['growing', 'stable', 'emerging', 'adjusting'] as const;

/** 职业库浏览筛选页：行业 × Holland 首码 × 前景 + 名称/别名搜索，支持从报告跳转携带筛选态 */
export default function CareersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  const industry = searchParams.get('industry') ?? 'all';
  const holland = searchParams.get('holland') ?? 'all';
  const growth = searchParams.get('growth') ?? 'all';

  const setFilter = (key: 'industry' | 'holland' | 'growth', value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === 'all') next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const setQueryParam = (value: string) => {
    setQuery(value);
    const next = new URLSearchParams(searchParams);
    if (value.trim()) next.set('q', value.trim());
    else next.delete('q');
    setSearchParams(next, { replace: true });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CAREERS.filter((career) => {
      if (industry !== 'all' && career.industry !== industry) return false;
      if (holland !== 'all' && career.hollandCode[0] !== holland) return false;
      if (growth !== 'all' && career.growthOutlook !== growth) return false;
      if (q) {
        const haystack = [career.name, ...career.aliases].join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [query, industry, holland, growth]);

  const activeFilters = [industry, holland, growth].filter((value) => value !== 'all').length;

  return (
    <PageTransition>
      <div className="container-page">
        <SectionTitle
          eyebrow="职业库"
          title="探索 60 种职业"
          description="按行业、Holland 首码、发展前景筛选，或用名称、别名搜索。"
        />

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1">
            <span aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">
              搜索
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQueryParam(event.target.value)}
              placeholder="输入职业名称或别名，如「医生」「程序员」"
              aria-label="搜索职业名称或别名"
              className="h-11 w-full rounded-xl border border-brand-200 bg-paper pl-14 pr-4 text-sm outline-none transition-colors focus:border-brand-400"
            />
          </div>
          {activeFilters > 0 ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSearchParams({}, { replace: true });
              }}
              className="text-sm text-brand-700 underline-offset-4 hover:underline"
            >
              清除全部筛选（{activeFilters}）
            </button>
          ) : null}
        </div>

        <div className="mb-6 grid gap-4 lg:grid-cols-3">
          <FilterGroup label="行业" ariaLabel="按行业筛选">
            {[['all', '全部行业'], ...Object.entries(INDUSTRY_LABELS)].map(([key, label]) => (
              <Chip key={key} active={industry === key} onClick={() => setFilter('industry', key)}>
                {label}
              </Chip>
            ))}
          </FilterGroup>

          <FilterGroup label="Holland 首码" ariaLabel="按 Holland 首码筛选">
            <Chip active={holland === 'all'} onClick={() => setFilter('holland', 'all')}>
              全部类型
            </Chip>
            {HOLLAND_TYPES.map((type) => (
              <Chip key={type.holland} active={holland === type.holland} onClick={() => setFilter('holland', type.holland)}>
                <span
                  aria-hidden
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: HOLLAND_COLORS[type.holland] }}
                />
                {type.holland} {type.name}
              </Chip>
            ))}
          </FilterGroup>

          <FilterGroup label="发展前景" ariaLabel="按发展前景筛选">
            <Chip active={growth === 'all'} onClick={() => setFilter('growth', 'all')}>
              全部前景
            </Chip>
            {GROWTH_KEYS.map((key) => (
              <Chip key={key} active={growth === key} onClick={() => setFilter('growth', key)}>
                {GROWTH_LABELS[key]}
              </Chip>
            ))}
          </FilterGroup>
        </div>

        <p className="mb-4 text-xs text-muted">共 {filtered.length} 条职业</p>

        {filtered.length === 0 ? (
          <Card className="border-dashed text-center text-sm text-muted">
            没有符合条件的职业，试试放宽筛选条件。
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((career) => (
              <Card key={career.id} padded={false} className="flex flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-semibold text-ink-900">{career.name}</h3>
                  <span
                    className="rounded-lg px-2 py-1 text-sm font-bold text-white"
                    style={{ background: HOLLAND_COLORS[career.hollandCode[0] as keyof typeof HOLLAND_COLORS] }}
                  >
                    {career.hollandCode}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge tone="neutral">{INDUSTRY_LABELS[career.industry] ?? career.industry}</Badge>
                  <Badge tone={career.isEmerging ? 'warning' : 'brand'}>
                    {GROWTH_LABELS[career.growthOutlook] ?? career.growthOutlook}
                  </Badge>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-ink-600 line-clamp-3">{career.dayInLife}</p>
                <div className="mt-auto pt-3">
                  <details className="text-xs">
                    <summary className="cursor-pointer text-brand-700">更多：对口专业与中学准备</summary>
                    <div className="mt-2 space-y-2 text-[11px] leading-relaxed text-muted">
                      <p>
                        <strong className="text-ink-700">对口专业：</strong>
                        {career.majorIds.join('、')}
                      </p>
                      <p>
                        <strong className="text-ink-700">中学可做：</strong>
                        {career.entryActions.join('；')}
                      </p>
                      <p>
                        <strong className="text-ink-700">澄清误区：</strong>
                        {career.misconceptions}
                      </p>
                    </div>
                  </details>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}

function FilterGroup({
  label,
  ariaLabel,
  children,
}: {
  label: string;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-ink-700">{label}</p>
      <div role="group" aria-label={ariaLabel} className="flex flex-wrap gap-1.5">
        {children}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors',
        active
          ? 'border-brand-500 bg-brand-500 text-white'
          : 'border-brand-200 bg-paper text-ink-600 hover:border-brand-300 hover:bg-brand-50',
      )}
    >
      {children}
    </button>
  );
}
