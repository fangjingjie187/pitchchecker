/**
 * 计分与匹配参数集中配置。
 * 所有权重与切分点在此调整，不需要改动 domain/ 下的算法代码。
 */

/** 人—职匹配三层加权（和必须为 1） */
export const MATCH_WEIGHTS = {
  interest: 0.4,
  ability: 0.35,
  value: 0.25,
} as const;

/** 等级切分依据：参考常模百分等级 */
export const LEVEL_CUTS = {
  /** 百分等级 < 35 → low */
  low: 35,
  /** 百分等级 >= 65 → high */
  high: 65,
} as const;

/** Likert 5 点量表 */
export const LIKERT_5 = {
  min: 1,
  max: 5,
  step: 1,
} as const;

/**
 * 能力自信度滑块：0–100、10 分一档（Bandura 自我效能量表规范）。
 * 内部量化为 1–10 处理（scaleTo = 10）。
 */
export const ABILITY_SLIDER = {
  min: 0,
  max: 100,
  step: 10,
  scaleTo: 10,
} as const;

/** 暖场三滑条（MVS 三构念）同样使用 0–100 / 10 分档 */
export const WARMUP_SLIDER = {
  min: 0,
  max: 100,
  step: 10,
  scaleTo: 10,
} as const;

/**
 * 价值观模块的合成权重（评定题 vs 迫选题）。
 * 合成规则（见 docs/数据校对稿.md「价值观迫选计分映射说明」）：
 *   评定分 p = (x − 1) / 4 × 100            （1–5 点线性映射到 0–100，仅 7 个维度有）
 *   迫选分 f = 被选中次数 / 该维度在迫选题中出现次数 × 100
 *   维度最终分 = 两者都有时 ratingWeight·p + forcedChoiceWeight·f
 *                只有评定题时直接取 p；只有迫选题时直接取 f
 */
export const VALUE_SCORING = {
  ratingWeight: 0.6,
  forcedChoiceWeight: 0.4,
} as const;

/** Holland 六边形距离表：索引为 R I A S E C */
export const HEX_ORDER = ['R', 'I', 'A', 'S', 'E', 'C'] as const;

/**
 * Iachan 人—职一致指数权重：第一码 5 分、第二码 3 分、第三码 1 分。
 * 同码同位得满分，同码异位按 0.5 折算，未出现得 0。
 */
export const IACHAN_WEIGHTS = [5, 3, 1] as const;
export const IACHAN_CROSS_POSITION_FACTOR = 0.5;
export const IACHAN_MAX = 9;

/**
 * 作答有效性检验阈值（全部可调）。
 * 前端能检验的只是"作答过程是否可疑"，不能据此判定作答无效——
 * 报告中以"结果可信度提示"的方式温和呈现。
 */
export const VALIDITY = {
  /** 单题平均作答时长下限（ms），低于此值提示"作答偏快" */
  minMsPerItem: 1200,
  /** 连续同值（直线作答）比例阈值：同一取值占比达到该比例即提示 */
  straightLineRatio: 0.8,
  /** 参与直线作答检验的最少题量（题量太少时比例不稳定） */
  minItemsForStraightLine: 8,
  /** 配对题作答差异超过该值视为不一致（5 点量表尺度） */
  pairMaxDiff: 2,
  /**
   * 标准差下限：**在 0–100 归一化尺度上计算**（不是 1–5 原始分）。
   * 若在 1–5 原始分上计算，SD 上限仅约 2，本规则将永不触发（死代码）。
   * 换算参照：原始 1–5 上的 SD = 1 相当于归一化后的 25。
   */
  minStdDev: 4,
  /** 题量过少时不做方差检验 */
  minItemsForVariance: 5,
} as const;

/** 兴趣 × 能力四象限：以 50 为中位分割（0–100 尺度） */
export const QUADRANT_MID = 50;

/**
 * 低分化阈值（0–100 尺度上最高型与最低型之差）。
 * 分化度 < 该阈值视为"兴趣图谱均衡"，报告 Hero 不渲染大字三码，
 * 避免对兴趣尚未分化的学生做"过早定向"（违背伦理承诺）。
 * 默认 15，可按试测结果调整。
 */
export const LOW_DIFFERENTIATION_THRESHOLD = 15;

/**
 * 兴趣维度 ↔ 能力维度的对应关系（四象限散点图用）。
 *
 * ⚠ 构念核查结论（诚实优先于对称）：RIASEC 六型与能力六维**不同构**。
 * 其中常规型 C（秩序与规范执行）在能力六维（言语/逻辑/空间/动手/人际/创意）中
 * 没有对应的维度，强行配对会引入构念偏差。故四象限只呈现 5 对（R/I/A/S/E），
 * 图注说明"常规型对应的能力维度（条理与规范执行）未纳入本工具能力框架"。
 * （原第 6 对曾把 C ↔ 空间想象凑对，依据不足，已移除。）
 *
 * 其余五对依据：该兴趣类型最典型的活动最依赖哪一项能力。
 *  · R 现实型（动手制作/操作器械） → handson 动手操作
 *  · I 研究型（推理/实验/分析）      → logic 逻辑数理
 *  · A 艺术型（原创/表达）           → creative 创意想象
 *  · S 社会型（助人/沟通/合作）      → interpersonal 人际沟通
 *  · E 企业型（说服/推动/影响）      → verbal 言语表达
 */
export const QUADRANT_PAIRS: {
  key: string;
  label: string;
  interest: string;
  ability: string;
}[] = [
  { key: 'R', label: '动手操作', interest: 'R', ability: 'handson' },
  { key: 'I', label: '探究推理', interest: 'I', ability: 'logic' },
  { key: 'A', label: '创意表达', interest: 'A', ability: 'creative' },
  { key: 'S', label: '人际助人', interest: 'S', ability: 'interpersonal' },
  { key: 'E', label: '说服推动', interest: 'E', ability: 'verbal' },
];

/** 四象限图注（诚实说明 C 型未纳入能力框架） */
export const QUADRANT_NOTE =
  '注：常规型（C，条理与规范执行）对应的能力维度未纳入本工具的能力框架，故这里只呈现 5 个类型。';

/** 报告展示的推荐职业数量 */
export const TOP_CAREER_COUNT = 8;

/** 价值观排序取前 N 项参与匹配与展示 */
export const TOP_VALUE_COUNT = 3;
