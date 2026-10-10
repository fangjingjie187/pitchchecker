/** 年级分段：Super 生涯发展阶段理论，12–18 岁跨越成长期末与探索期（试探 / 过渡阶段） */
export type GradeBand = '12-14' | '15-16' | '17-18';

export const GRADE_BAND_KEYS: GradeBand[] = ['12-14', '15-16', '17-18'];

export type Gender = 'male' | 'female' | 'undisclosed';

export type RegionType = 'county' | 'city' | 'other' | 'undisclosed';

/** 测评模块：暖场为轻量前置模块（MVS 三滑条），其余按 P0/P1/P2 分层交付 */
export type ModuleKey =
  | 'warmup'
  | 'interest'
  | 'ability'
  | 'value'
  | 'adaptability'
  | 'decision'
  | 'personality';

/** Holland RIASEC 六型 */
export type HollandCode = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export const HOLLAND_CODES: HollandCode[] = ['R', 'I', 'A', 'S', 'E', 'C'];

/** 分数等级（基于常模百分等级切分） */
export type ScoreLevel = 'low' | 'mid' | 'high';

/** 模块交付优先级 */
export type Priority = 'P0' | 'P1' | 'P2';

/** 单题作答值：量表 / 滑块为 number；排序为 number[]；开放题为 string */
export type AnswerValue = number | number[] | string;
