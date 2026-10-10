/**
 * 职业库 / 专业库 / 学科库 数据契约。
 * 数据来源方向：O*NET 内容模型（兴趣-能力-工作价值观-工作内容四要素）本土化改编，
 * 参照《中华人民共和国职业分类大典》与新高考选科政策。
 */

/** 能力维度 key 与 abilities.js / ability.items.js 的 dimension 保持一致 */
export type AbilityKey =
  | 'verbal'
  | 'logic'
  | 'spatial'
  | 'handson'
  | 'interpersonal'
  | 'creative';

export type AbilityDemand = Record<AbilityKey, number>; // 取值 1–5，表示该职业对该能力的需求强度

export interface Career {
  id: string;
  name: string;
  /** 别名 / 常用叫法，用于搜索 */
  aliases: string[];
  /** Holland 三字母码，如 'IRE' */
  hollandCode: string;
  industry: string;
  /** 发展前景标签：'growing' | 'stable' | 'emerging' | 'adjusting' */
  growthOutlook: 'growing' | 'stable' | 'emerging' | 'adjusting';
  /** 是否为近年新兴职业 */
  isEmerging?: boolean;
  /** 典型学历路径 */
  educationPath: string;
  /** 对口大学专业 id（引用 majors.js） */
  majorIds: string[];
  /** 中学学科关联度 1–5（引用 subjects.js 的 key） */
  subjectRelevance: Record<string, number>;
  /** 该职业对各能力的需求强度 1–5 */
  abilityDemand: AbilityDemand;
  /** 该职业主要能满足的工作价值观 key（引用 values.js） */
  valueSupply: string[];
  /** 3–4 句日常工作描述，青少年可读 */
  dayInLife: string;
  /** 中学阶段可做的 2–3 件准备事项 */
  entryActions: string[];
  /** 常见误解澄清，防止刻板印象 */
  misconceptions: string;
}

export interface Major {
  id: string;
  name: string;
  /** 学科门类，如 '工学' */
  category: string;
  /** 新高考选科要求描述（不同省份政策有差异，此处为通用描述） */
  subjectRequirement: string;
  /** 核心课程举例 */
  coreCourses: string[];
  /** 对口职业 id（引用 careers.js） */
  careerIds: string[];
  /** 一句话说明这个专业学什么、将来做什么 */
  summary: string;
}

export interface Subject {
  key: string;
  name: string;
  /** 该学科主要锻炼的能力维度 */
  abilities: AbilityKey[];
  /** 一句话说明：学好这门课能带来什么可迁移能力 */
  transferable: string;
}

/** 路径推导结果（报告区块 9） */
export interface PathwayStep {
  level: 'subject' | 'subjectChoice' | 'major' | 'career';
  id: string;
  label: string;
  /** 0–100 关联强度，用于桑基图边宽 */
  weight: number;
}

export interface PathwayLink {
  source: string;
  target: string;
  value: number;
}

export interface PathwayResult {
  nodes: PathwayStep[];
  links: PathwayLink[];
  /** 文字版路径：从当前学科到目标职业 */
  narrative: string[];
}
