import { useMemo } from 'react';
import type { EChartsCoreOption } from 'echarts/core';
import { CHART_PALETTE } from '@/config/theme.config';
import { ECHART_BASE } from '@/config/theme.config';
import { EChart } from './EChart';
import type { PathwayResult } from '@/types';

/**
 * 学科 → 选科 → 专业 → 职业 桑基图（报告区块 9，核心亮点）。
 * 边宽表示关联强度，直观呈现"今天的课堂通向哪里"。
 */
export function PathwaySankey({
  pathway,
  height,
}: {
  pathway: PathwayResult;
  height?: number;
}) {
  const option = useMemo<EChartsCoreOption>(() => {
    const levelColor: Record<string, string> = {
      subject: CHART_PALETTE.brand,
      subjectChoice: CHART_PALETTE.coral,
      major: CHART_PALETTE.positive,
      career: CHART_PALETTE.coral,
    };
    return {
      ...ECHART_BASE,
      tooltip: { ...ECHART_BASE.tooltip, trigger: 'item' },
      series: [
        {
          type: 'sankey',
          left: 8,
          right: 110,
          top: 16,
          bottom: 16,
          nodeWidth: 14,
          nodeGap: 26,
          emphasis: { focus: 'adjacency' },
          label: { color: '#33475B', fontSize: 12 },
          data: pathway.nodes.map((node) => ({
            name: node.label,
            itemStyle: { color: levelColor[node.level] ?? '#8296AA' },
          })),
          links: pathway.links.map((link) => ({
            source: findLabel(pathway, link.source),
            target: findLabel(pathway, link.target),
            value: link.value,
          })),
          lineStyle: { color: 'gradient', curveness: 0.5, opacity: 0.35 },
        },
      ],
    };
  }, [pathway]);

  return <EChart option={option} height={height ?? Math.max(320, pathway.nodes.length * 40)} />;
}

function findLabel(pathway: PathwayResult, id: string): string {
  return pathway.nodes.find((node) => node.id === id)?.label ?? id;
}
