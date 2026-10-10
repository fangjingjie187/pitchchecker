import { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import {
  BarChart,
  GaugeChart,
  HeatmapChart,
  RadarChart,
  SankeyChart,
  ScatterChart,
  LineChart,
} from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  RadarComponent,
  TooltipComponent,
  TitleComponent,
  VisualMapComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsCoreOption, EChartsType } from 'echarts/core';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

// 按需注册，控制打包体积（M4 增加图表类型时在此补充）
echarts.use([
  BarChart,
  GaugeChart,
  HeatmapChart,
  RadarChart,
  SankeyChart,
  ScatterChart,
  LineChart,
  GridComponent,
  LegendComponent,
  RadarComponent,
  TooltipComponent,
  TitleComponent,
  VisualMapComponent,
  CanvasRenderer,
]);

export function useEcharts<T extends HTMLElement = HTMLDivElement>(
  option: EChartsCoreOption,
  deps: unknown[] = [],
) {
  const containerRef = useRef<T | null>(null);
  const chartRef = useRef<EChartsType | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = echarts.init(containerRef.current, undefined, { renderer: 'canvas' });
    chartRef.current = chart;

    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    chart.setOption(
      { ...option, animation: !reduced, animationDuration: reduced ? 0 : 600 },
      { notMerge: true },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, ...deps]);

  return { containerRef, chartRef };
}
