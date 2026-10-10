import { useMemo } from 'react';
import type { EChartsCoreOption } from 'echarts/core';
import { QUADRANT_COLORS } from '@/config/theme.config';
import { ECHART_BASE } from '@/config/theme.config';
import { EChart } from './EChart';

export interface QuadrantDatum {
  label: string;
  /** 兴趣 0–100 */
  x: number;
  /** 能力自信度 0–100 */
  y: number;
  zone: 'strength' | 'growth' | 'potential' | 'explore';
}

export const QUADRANT_ZONE_LEGEND = [
  { zone: 'strength' as const, name: '优势区（喜欢且擅长）' },
  { zone: 'growth' as const, name: '成长区（喜欢但还不熟练）' },
  { zone: 'potential' as const, name: '潜力区（擅长但兴趣一般）' },
  { zone: 'explore' as const, name: '待探索区' },
];

/**
 * 兴趣 × 能力四象限散点：横轴兴趣、纵轴能力，50 为中位分割。
 *
 * 用单一系列承载全部点（按点着色），这样 labelLayout 的 moveOverlap
 * 能在所有标签之间统一避让——若按区域拆成多个 series，跨 series 的标签仍会重叠。
 * 低分化人设（多个点几乎重合）时尤为明显。
 */
export function QuadrantScatter({ data, height }: { data: QuadrantDatum[]; height?: number }) {
  const option = useMemo<EChartsCoreOption>(() => {
    return {
      ...ECHART_BASE,
      grid: { left: 8, right: 56, top: 16, bottom: 24, containLabel: true },
      xAxis: {
        type: 'value',
        min: 0,
        max: 100,
        name: '兴趣 →',
        nameTextStyle: { color: '#8296AA' },
        splitLine: { lineStyle: { color: '#EFF5F9' } },
        axisLabel: { color: '#8296AA', fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        name: '能力信心 ↑',
        nameTextStyle: { color: '#8296AA' },
        splitLine: { lineStyle: { color: '#EFF5F9' } },
        axisLabel: { color: '#8296AA', fontSize: 11 },
      },
      series: [
        {
          type: 'scatter',
          symbolSize: 20,
          data: data.map((item) => ({
            value: [item.x, item.y],
            name: item.label,
            itemStyle: { color: QUADRANT_COLORS[item.zone] },
          })),
          label: {
            show: true,
            position: 'top',
            formatter: (params: { dataIndex: number }) => data[params.dataIndex].label,
            color: '#33475B',
            fontSize: 12,
          },
          labelLayout: { moveOverlap: 'shiftY', hideOverlap: false },
        },
      ],
    };
  }, [data]);

  return <EChart option={option} height={height ?? 340} />;
}
