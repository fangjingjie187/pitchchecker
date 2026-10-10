import type { GradeBand, HollandCode, ModuleKey, Priority } from './common';

export type ItemType = 'likert5' | 'slider100' | 'sort' | 'forcedChoice' | 'open';

export interface ItemBase {
  /** 唯一 ID，约定格式：模块缩写-维度-序号，如 I-R-01 */
  id: string;
  /** 所属维度 key */
  dimension: string;
  /** 题干（第二人称，12–18 岁可读） */
  text: string;
  /** 括号补充说明 / 举例，降低理解偏差 */
  subText?: string;
  /** 题目级作答指导语（覆盖模块级 prompt）。开放题等特殊题型用它替换模块指导语 */
  prompt?: string;
  /**
   * 是否反向计分。
   * 约定：仅人格（personality）与生涯适应力（adaptability）量表使用反向题；
   * 兴趣 / 能力 / 价值观量表全部正向计分。
   * 暖场"担心"滑条不使用此标记，而是由维度定义中的 polarity='negative' 表达负向构念。
   */
  reverse?: boolean;
  /** 限定出现的年级段；缺省表示全段通用 */
  gradeBands?: GradeBand[];
  /** 一致性检验配对题 ID（两题应为近义改写，用于作答有效性检验） */
  pairId?: string;
  /**
   * 是否计入维度计分。开放题一律为 true（即不计分），
   * dimension 字段仅作归档归类用，供叙事生成与温和提示触发使用。
   */
  excludeFromScoring?: boolean;
}

export interface LikertItem extends ItemBase {
  type: 'likert5';
}

export interface SliderItem extends ItemBase {
  type: 'slider100';
}

export interface SortOption {
  id: string;
  label: string;
}

export interface SortItem extends ItemBase {
  type: 'sort';
  options: SortOption[];
}

export interface ForcedChoiceOption {
  id: string;
  label: string;
  /** 选中该选项即为哪一维度加分 */
  dimension: string;
}

export interface ForcedChoiceItem extends ItemBase {
  type: 'forcedChoice';
  options: ForcedChoiceOption[];
}

export interface OpenItem extends ItemBase {
  type: 'open';
  placeholder?: string;
  maxLength?: number;
}

export type AssessmentItem =
  | LikertItem
  | SliderItem
  | SortItem
  | ForcedChoiceItem
  | OpenItem;

/** 量表作答方式 */
export interface ScaleSpec {
  type: ItemType;
  min: number;
  max: number;
  step: number;
  /** 端点（及中点）文字锚定 */
  labels: string[];
}

/** 维度定义 */
export interface DimensionDef {
  key: string;
  name: string;
  short: string;
  description: string;
  /** 极性：negative 表示得分越高代表越需要从干预角度关注（如"担心程度"） */
  polarity: 'positive' | 'negative';
  /** 若为 Holland 六型维度，对应的类型码 */
  holland?: HollandCode;
}

/** 模块元数据（结构性配置，位于 src/config/modules.ts） */
export interface ModuleMeta {
  key: ModuleKey;
  title: string;
  subtitle: string;
  /** 一句话理论依据（展示在测评大厅卡片） */
  theory: string;
  /** 理论出处（展示在 About 页） */
  theorySource: string;
  priority: Priority;
  /** 展示与作答顺序 */
  order: number;
  /** 题目数量（与 items 文件实际条目数由 validate 脚本校验一致） */
  itemCount: number;
  estimatedMinutes: number;
  /** 是否包含在快速模式（快速模式 = 暖场 + 兴趣 + 能力 + 价值观） */
  inQuickMode: boolean;
  /** 是否已交付启用（P2 未完成时置 false，不阻塞其他模块） */
  enabled: boolean;
  scale: ScaleSpec;
  /** 维度 key 列表 */
  dimensions: string[];
  /** 完成后是否即时显示一行小结反馈 */
  closingFeedback: boolean;
  /** 模块开场引导语 */
  intro: string;
  /**
   * 作答页题目前的指导语（紧贴题目的那一行）。
   * 措辞必须匹配所测构念：兴趣问"喜欢程度"，能力问"有多大信心"（Bandura 自我效能标尺措辞）。
   */
  prompt: string;
}
