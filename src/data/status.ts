import type { ModuleKey } from '@/types';

/**
 * 数据填充进度登记（由 scripts/validate.ts 校验其与真实文件一致）。
 * DevDataWarning 依据它在开发态提示"哪些模块还没有题目"。
 */
export const DATA_STATUS: { populated: ModuleKey[] } = {
  populated: ['warmup', 'interest', 'ability', 'value', 'adaptability', 'decision', 'personality'],
};
