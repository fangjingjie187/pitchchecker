import { useMemo } from 'react';
import type { EChartsCoreOption } from 'echarts/core';
import { ECHART_BASE } from '@/config/theme.config';
import { EChart } from './EChart';

/** 相关矩阵热力图（-1 ~ 1，蓝色负相关 → 白色 → 红色正相关） */
export function CorrelationHeatmap({
  dimensions,
  matrix,
  height,
}: {
  dimensions: string[];
  matrix: number[][];
  height?: number;
}) {
  const option = useMemo<EChartsCoreOption>(() => {
    const data: [number, number, number][] = [];
    matrix.forEach((row, i) => {
      row.forEach((value, j) => {
        data.push([j, i, value]);
      });
    });
    return {
      ...ECHART_BASE,
      tooltip: {
        ...ECHART_BASE.tooltip,
        position: 'top',
        formatter: (params: { data: [number, number, number] }) =>
          `${dimensions[params.data[1]]} × ${dimensions[params.data[0]]}：${params.data[2]}`,
      },
      grid: { left: 40, right: 16, top: 16, bottom: 40 },
      xAxis: {
        type: 'category',
        data: dimensions,
        splitArea: { show: true },
        axisLabel: { color: '#46596C', fontSize: 12 },
      },
      yAxis: {
        type: 'category',
        data: dimensions,
        splitArea: { show: true },
        axisLabel: { color: '#46596C', fontSize: 12 },
      },
      visualMap: {
        min: -1,
        max: 1,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        textStyle: { color: '#8296AA', fontSize: 11 },
        inRange: {
          color: ['#2563EB', '#EFF5F9', '#FF6B4A'],
        },
      },
      series: [
        {
          type: 'heatmap',
          data,
          label: {
            show: true,
            fontSize: 11,
            color: '#33475B',
            formatter: (params: { data: [number, number, number] }) => String(params.data[2]),
          },
          itemStyle: { borderColor: '#ffffff', borderWidth: 1 },
          emphasis: { itemStyle: { shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.25)' } },
        },
      ],
    };
  }, [dimensions, matrix]);

  return <EChart option={option} height={height ?? Math.max(260, dimensions.length * 52 + 60)} />;
}
