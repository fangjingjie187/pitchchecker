import { useMemo } from 'react';
import type { EChartsCoreOption } from 'echarts/core';
import { CHART_PALETTE } from '@/config/theme.config';
import { ECHART_BASE } from '@/config/theme.config';
import { EChart } from './EChart';

export interface ValueDatum {
  name: string;
  /** 0–100 */
  value: number;
  /** 是否进入 Top3（高亮） */
  top3: boolean;
}

/** 价值观排序：横向条形 + Top3 高亮，直观呈现排序差异 */
export function ValueRankChart({ data, height }: { data: ValueDatum[]; height?: number }) {
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
              color: item.top3 ? CHART_PALETTE.coral : '#B8CCDA',
              borderRadius: [0, 6, 6, 0],
            },
          })),
          barWidth: 16,
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

  return <EChart option={option} height={height ?? Math.max(240, data.length * 38 + 40)} />;
}
