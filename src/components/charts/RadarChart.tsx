import { useMemo } from 'react';
import type { EChartsCoreOption } from 'echarts/core';
import { ECHART_BASE } from '@/config/theme.config';
import { EChart } from './EChart';

export interface RadarDatum {
  name: string;
  /** 0–100 */
  value: number;
}

/** 多维度剖面雷达图（兴趣 / 适应力 / 人格等） */
export function RadarChart({
  dimensions,
  seriesName,
  max = 100,
  height,
}: {
  dimensions: RadarDatum[];
  seriesName: string;
  max?: number;
  height?: number;
}) {
  const option = useMemo<EChartsCoreOption>(
    () => ({
      ...ECHART_BASE,
      radar: {
        indicator: dimensions.map((item) => ({ name: item.name, max })),
        radius: '62%',
        // 5 段→刻度为 20 的整数倍（0/20/40/60/80/100），避免 ECharts 对非整刻度(25)的告警
        splitNumber: 5,
        axisName: { color: '#46596C', fontSize: 12 },
        splitArea: { areaStyle: { color: ['rgba(14,165,233,0.02)', 'rgba(14,165,233,0.06)'] } },
        splitLine: { lineStyle: { color: '#D9EAF4' } },
        axisLine: { lineStyle: { color: '#D9EAF4' } },
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: dimensions.map((item) => item.value),
              name: seriesName,
              areaStyle: { color: 'rgba(14,165,233,0.18)' },
              lineStyle: { color: '#0EA5E9', width: 2 },
              itemStyle: { color: '#0EA5E9' },
            },
          ],
        },
      ],
    }),
    [dimensions, seriesName, max],
  );

  return <EChart option={option} height={height ?? 300} />;
}
