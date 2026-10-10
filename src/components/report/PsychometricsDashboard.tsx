import { useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { CorrelationHeatmap } from '@/components/charts/CorrelationHeatmap';
import { dimensionAlphas, interestCorrelation, PSYCHOMETRICS_NOTE } from '@/domain/psychometrics';

const MODULE_NAMES: Record<string, string> = {
  warmup: '暖场',
  interest: '兴趣',
  ability: '能力',
  value: '价值观',
  adaptability: '适应力',
  decision: '决策风格',
  personality: '人格',
};

/**
 * 心理测量学仪表盘（模拟数据 · 方法演示）。
 *
 * 该组件单独成文件并配合 React.lazy 按需加载：
 * domain/psychometrics 依赖的 sampleResponses.json（约 287KB）只在这里被引用，
 * 从而从主包中剥离，避免静态托管首屏加载不必要的体积。
 */
export default function PsychometricsDashboard() {
  const alphas = useMemo(() => dimensionAlphas(), []);
  const correlation = useMemo(() => interestCorrelation(), []);

  return (
    <div className="mt-6 space-y-6">
      {/* 顶部显眼标注 */}
      <div className="rounded-xl2 border border-amber-300 bg-amber-50 p-4">
        <p className="text-sm font-semibold text-amber-900">⚠ {PSYCHOMETRICS_NOTE}</p>
        <p className="mt-1 text-xs text-amber-800">
          数据文件：src/data/sampleResponses.json（seed 20261009，n = 200）。α 与相关矩阵仅用于演示"指标是怎么算出来的"。
        </p>
      </div>

      <Card>
        <h3 className="text-base font-semibold">各维度 Cronbach α（模拟数据）</h3>
        <p className="mt-1 text-xs text-muted">
          α 为内部一致性信度；价值观为单条目维度（每维度 1 题），不适用 α，显示为「—」。
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-brand-100 text-xs text-muted">
                <th className="py-2 pr-4">模块</th>
                <th className="py-2 pr-4">维度 α（按维度逐列）</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(alphas).map(([module, dims]) => (
                <tr key={module} className="border-b border-brand-50 align-top">
                  <td className="py-2 pr-4 font-medium text-ink-800">{MODULE_NAMES[module] ?? module}</td>
                  <td className="py-2 text-ink-600">
                    {Object.entries(dims)
                      .map(([dim, alpha]) => `${dim} ${alpha === null ? '—' : alpha.toFixed(2)}`)
                      .join('　')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h3 className="text-base font-semibold">兴趣六型相关矩阵（模拟数据）</h3>
        <p className="mt-1 text-xs text-muted">
          用于演示"六边形相邻高相关、相对低相关"的结构。数据为模拟样本，非实证结论。
        </p>
        <div className="mt-4">
          <CorrelationHeatmap dimensions={correlation.dimensions} matrix={correlation.matrix} />
        </div>
      </Card>
    </div>
  );
}
