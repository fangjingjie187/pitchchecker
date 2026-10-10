import { useMemo } from 'react';
import type { EChartsCoreOption } from 'echarts/core';
import { HOLLAND_COLORS } from '@/config/theme.config';
import { ECHART_BASE } from '@/config/theme.config';
import { HEX_ORDER } from '@/config/scoring.config';
import { EChart } from './EChart';

/**
 * Holland 六边形图。
 * 六型按 R–I–A–S–E–C 顺序排列成环（雷达图即六边形），
 * 相邻类型相关高、相对类型相关低——面积轮廓直观呈现"兴趣聚焦在哪里"。
 */
export function HollandHexagon({
  scores,
  height,
}: {
  scores: Record<string, number>;
  height?: number;
}) {
  const option = useMemo<EChartsCoreOption>(
    () => ({
      ...ECHART_BASE,
      radar: {
        indicator: HEX_ORDER.map((code) => ({ name: code, max: 100 })),
        radius: '60%',
        // 5 段→刻度为 20 的整数倍，避免 ECharts 对非整刻度(25)的告警
        splitNumber: 5,
        axisName: { color: '#46596C', fontSize: 13, fontWeight: 'bold' },
        splitArea: { areaStyle: { color: ['rgba(14,165,233,0.02)', 'rgba(14,165,233,0.05)'] } },
        splitLine: { lineStyle: { color: '#D9EAF4' } },
        axisLine: { lineStyle: { color: '#D9EAF4' } },
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: HEX_ORDER.map((code) => Math.round(scores[code] ?? 0)),
              name: '兴趣得分',
              areaStyle: { color: 'rgba(14,165,233,0.16)' },
              lineStyle: { color: '#0EA5E9', width: 2 },
              itemStyle: { color: '#FF6B4A' },
            },
          ],
        },
      ],
    }),
    [scores],
  );

  // 六型颜色图例单独用 HTML 展示，见报告组件
  void HOLLAND_COLORS;
  return <EChart option={option} height={height ?? 320} />;
}
