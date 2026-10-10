import { useMemo } from 'react';
import type { EChartsCoreOption } from 'echarts/core';
import { useEcharts } from '@/hooks/useEcharts';

/** ECharts 基础容器：负责实例生命周期与 resize，业务侧只需给 option */
export function EChart({
  option,
  height = 280,
  className,
}: {
  option: EChartsCoreOption;
  height?: number;
  className?: string;
}) {
  // 稳定 option 引用：只有 option 内容变化时才触发 setOption
  const deps = useMemo(() => [option], [option]);
  const { containerRef } = useEcharts<HTMLDivElement>(option, deps);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ height, width: '100%' }}
      role="img"
      aria-label="图表"
    />
  );
}
