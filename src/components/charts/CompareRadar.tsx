import { useMemo } from 'react';
import type { EChartsCoreOption } from 'echarts/core';
import { CHART_PALETTE } from '@/config/theme.config';
import { ECHART_BASE } from '@/config/theme.config';
import { EChart } from './EChart';

export interface CompareSeries {
  name: string;
  values: number[];
}

/** 多系列雷达叠加对比（成长档案：两次测评的兴趣剖面） */
export function CompareRadar({
  dimensions,
  series,
  max = 100,
  height,
}: {
  dimensions: string[];
  series: CompareSeries[];
  max?: number;
  height?: number;
}) {
  const colors = [CHART_PALETTE.brand, CHART_PALETTE.coral, '#14B8A6'];

  const option = useMemo<EChartsCoreOption>(
    () => ({
      ...ECHART_BASE,
      legend: { bottom: 0, textStyle: { color: '#46596C', fontSize: 11 } },
      radar: {
        indicator: dimensions.map((name) => ({ name, max })),
        radius: '62%',
        // 5 段→刻度为 20 的整数倍，避免 ECharts 对非整刻度(25)的告警
        splitNumber: 5,
        axisName: { color: '#46596C', fontSize: 12 },
        splitArea: { areaStyle: { color: ['rgba(14,165,233,0.02)', 'rgba(14,165,233,0.06)'] } },
        splitLine: { lineStyle: { color: '#D9EAF4' } },
        axisLine: { lineStyle: { color: '#D9EAF4' } },
      },
      series: [
        {
          type: 'radar',
          data: series.map((item, index) => ({
            value: item.values,
            name: item.name,
            lineStyle: { color: colors[index % colors.length], width: 2 },
            itemStyle: { color: colors[index % colors.length] },
            areaStyle: { color: `rgba(14,165,233,${index === 0 ? 0.14 : 0.08})` },
          })),
        },
      ],
    }),
    [dimensions, series, max],
  );

  return <EChart option={option} height={height ?? 320} />;
}
