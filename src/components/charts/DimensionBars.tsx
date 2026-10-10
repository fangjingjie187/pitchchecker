import { useMemo } from 'react';
import type { EChartsCoreOption } from 'echarts/core';
import { LEVEL_COLORS } from '@/config/theme.config';
import { ECHART_BASE } from '@/config/theme.config';
import { EChart } from './EChart';

export interface BarDatum {
  name: string;
  /** 0–100 */
  value: number;
  level?: 'low' | 'mid' | 'high';
}

/** 横向条形图（能力自信度 / 人格 / 决策风格等） */
export function DimensionBars({ data, height }: { data: BarDatum[]; height?: number }) {
  const option = useMemo<EChartsCoreOption>(() => {
    const sorted = [...data].sort((a, b) => a.value - b.value);
    return {
      ...ECHART_BASE,
      grid: { left: 8, right: 24, top: 8, bottom: 8, containLabel: true },
      xAxis: {
        type: 'value',
        max: 100,
        splitLine: { lineStyle: { color: '#EFF5F9' } },
        axisLabel: { color: '#8296AA', fontSize: 11 },
      },
      yAxis: {
        type: 'category',
        data: sorted.map((item) => item.name),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#33475B', fontSize: 12 },
      },
      series: [
        {
          type: 'bar',
          data: sorted.map((item) => ({
            value: item.value,
            itemStyle: {
              color: LEVEL_COLORS[item.level ?? 'mid'],
              borderRadius: [0, 6, 6, 0],
            },
          })),
          barWidth: 18,
          label: {
            show: true,
            position: 'right',
            color: '#46596C',
            fontSize: 11,
            formatter: '{c}',
          },
        },
      ],
    };
  }, [data]);

  return <EChart option={option} height={height ?? Math.max(200, data.length * 44 + 40)} />;
}
