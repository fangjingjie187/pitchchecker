import type { HollandCode } from '@/types';

/** Holland 六型配色（明亮活泼主题） */
export const HOLLAND_COLORS: Record<HollandCode, string> = {
  R: '#14B8A6', // 现实型 · 青绿（动手、工具、实物）
  I: '#6366F1', // 研究型 · 靛蓝（思考、探究、分析）
  A: '#A855F7', // 艺术型 · 紫（创造、表达、想象）
  S: '#EC4899', // 社会型 · 玫红（助人、合作、沟通）
  E: '#F59E0B', // 企业型 · 琥珀（影响、组织、开拓）
  C: '#64748B', // 常规型 · 石板灰（秩序、规范、细致）
};

export const HOLLAND_LIGHT_COLORS: Record<HollandCode, string> = {
  R: '#99F6E4',
  I: '#C7D2FE',
  A: '#E9D5FF',
  S: '#FBCFE8',
  E: '#FDE68A',
  C: '#CBD5E1',
};

/** 图表通用调色板 */
export const CHART_PALETTE = {
  brand: '#0EA5E9',
  coral: '#FF6B4A',
  ink: '#33475B',
  muted: '#8296AA',
  grid: '#E8F3F9',
  axis: '#B8CCDA',
  positive: '#14B8A6',
  neutral: '#F59E0B',
  negative: '#FF6B4A',
} as const;

/** 分数等级配色 */
export const LEVEL_COLORS = {
  low: '#F59E0B',
  mid: '#0EA5E9',
  high: '#14B8A6',
} as const;

/** 四象限配色 */
export const QUADRANT_COLORS = {
  strength: '#14B8A6',
  growth: '#FF6B4A',
  potential: '#6366F1',
  explore: '#94A3B8',
} as const;

/** ECharts 通用基础配置（M4 图表复用） */
export const ECHART_BASE = {
  textStyle: {
    fontFamily:
      '-apple-system, "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif',
    color: '#33475B',
  },
  tooltip: {
    backgroundColor: 'rgba(255,255,255,.96)',
    borderColor: '#B8E4F9',
    borderWidth: 1,
    textStyle: { color: '#12212E', fontSize: 13 },
    extraCssText: 'box-shadow: 0 8px 24px -12px rgba(12,74,110,.35); border-radius: 12px;',
  },
} as const;
