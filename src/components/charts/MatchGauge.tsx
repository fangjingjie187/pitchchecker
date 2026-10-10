import { useMemo } from 'react';
import type { EChartsCoreOption } from 'echarts/core';
import { CHART_PALETTE } from '@/config/theme.config';
import { ECHART_BASE } from '@/config/theme.config';
import { EChart } from './EChart';

/** 匹配度仪表盘（0–100），用于职业卡片顶部 */
export function MatchGauge({
  value,
  height = 140,
}: {
  value: number;
  height?: number;
}) {
  const option = useMemo<EChartsCoreOption>(
    () => ({
      ...ECHART_BASE,
      series: [
        {
          type: 'gauge',
          startAngle: 210,
          endAngle: -30,
          min: 0,
          max: 100,
          radius: '92%',
          progress: {
            show: true,
            width: 10,
            itemStyle: { color: CHART_PALETTE.coral },
          },
          axisLine: { lineStyle: { width: 10, color: [[1, '#E8F3F9']] } },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          pointer: { show: false },
          detail: {
            valueAnimation: true,
            formatter: '{value}',
            color: '#33475B',
            fontSize: 24,
            fontWeight: 'bolder',
            offsetCenter: [0, '4%'],
          },
          data: [{ value: Math.round(value) }],
        },
      ],
    }),
    [value],
  );

  return <EChart option={option} height={height} />;
}
