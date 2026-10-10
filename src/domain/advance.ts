import type { ItemType } from '@/types';

/**
 * 自动跳题判定（纯函数，便于单测锁定行为）。
 *
 * 规则：
 *  1. 仅离散选择题（5 点量表、迫选）自动跳；滑条与开放题不自动跳，避免误触；
 *  2. **回到已作答的题目时不再自动跳**——否则用户回退检查答案会被"弹回"下一题，
 *     这是最容易引起误触的场景；
 *  3. 每次进入一道未作答的题目，只允许自动跳一次；
 *  4. 最后一题不自动跳（改为进入完成态）。
 */
export function shouldAutoAdvance(params: {
  itemType: ItemType;
  /** 进入该题时它是否尚未作答 */
  wasUnansweredOnArrival: boolean;
  /** 本次进入是否已经自动跳过 */
  alreadyAdvanced: boolean;
  isLast: boolean;
}): boolean {
  const { itemType, wasUnansweredOnArrival, alreadyAdvanced, isLast } = params;
  if (itemType !== 'likert5' && itemType !== 'forcedChoice') return false;
  if (!wasUnansweredOnArrival) return false;
  if (alreadyAdvanced) return false;
  if (isLast) return false;
  return true;
}

/**
 * 全部作答完成后是否自动进入「完成小结」（纯函数，便于单测锁定行为）。
 *
 * 规则：
 *  1. 未全部作答 → 不进入；
 *  2. 开放题（type=open）即便已全部作答也不自动进入——用户输入任意字符都会被视为"已作答"，
 *     若自动进入会把文本框顶掉、无法继续书写，因此开放题必须由用户手动点「完成」。
 */
export function shouldAutoComplete(params: {
  itemType: ItemType;
  answered: number;
  total: number;
}): boolean {
  if (params.answered < params.total) return false;
  if (params.itemType === 'open') return false;
  return true;
}
