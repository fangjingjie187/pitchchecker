import { NARRATIVE_BLOCKS, QUADRANT_ZONE_LABELS } from '@/data/narratives';
import { GRADE_BANDS } from '@/config/app.config';
import { getDimensionName } from '@/data/dimensionNames';
import type {
  DimensionScore,
  GradeBand,
  HollandProfile,
  PathwayResult,
  QuadrantItem,
} from '@/types';
import { primaryZone } from './quadrant';

/**
 * 生涯叙事小结（报告末尾）。
 *
 * 理论：Savickas 生涯建构主义——人不只是"被测量出来的分数"，更是自己生涯故事的叙述者。
 * 因此结尾回到第二人称讲述，把兴趣、能力、价值观与当下的困境串成一段"你的故事"，
 * 并明确交代"这是此刻的样子，不是结论"。
 */
export interface NarrativeInput {
  holland: HollandProfile | null;
  ability: DimensionScore[] | null;
  value: DimensionScore[] | null;
  quadrants: QuadrantItem[];
  pathway: PathwayResult | null;
  gradeBand: GradeBand;
}

export function buildNarrative(input: NarrativeInput): string {
  const parts: string[] = [];
  const { holland } = input;

  if (holland) {
    const primaryName = getDimensionName('interest', holland.primary);
    const secondaryName = getDimensionName('interest', holland.secondary);
    parts.push(
      NARRATIVE_BLOCKS.opening[0]
        .replace('{primaryName}', primaryName)
        .replace('{secondaryName}', secondaryName),
    );

    const diffText =
      holland.differentiation >= 30
        ? NARRATIVE_BLOCKS.differentiation.high
        : holland.differentiation >= 15
          ? NARRATIVE_BLOCKS.differentiation.mid
          : NARRATIVE_BLOCKS.differentiation.low;
    parts.push(diffText.replace('{code}', holland.code));
  }

  if (input.ability && input.ability.length >= 2) {
    const top = input.ability[0];
    const grow = input.ability[input.ability.length - 1];
    parts.push(
      NARRATIVE_BLOCKS.abilityBridge[0]
        .replace('{topAbility}', top.name)
        .replace('{growAbility}', grow.name),
    );
  }

  if (input.value && input.value.length > 0) {
    const valueList = input.value
      .slice(0, 3)
      .map((score) => score.name)
      .join('、');
    parts.push(NARRATIVE_BLOCKS.valueBridge[0].replace('{valueList}', valueList));
  }

  if (input.quadrants.length > 0) {
    const strength = input.quadrants
      .filter((item) => item.zone === 'strength')
      .map((item) => item.label);
    const growth = input.quadrants.filter((item) => item.zone === 'growth').map((item) => item.label);
    if (strength.length > 0) {
      parts.push(NARRATIVE_BLOCKS.quadrant.strength.replace('{strengthZone}', strength.join('、')));
    }
    if (growth.length > 0) {
      parts.push(NARRATIVE_BLOCKS.quadrant.growth.replace('{growthZone}', growth.join('、')));
    }
    if (strength.length === 0 && growth.length === 0) {
      const primary = primaryZone(input.quadrants);
      parts.push(
        NARRATIVE_BLOCKS.quadrant.balanced +
          (primary ? `目前最接近投入状态的是${primary.label}（${QUADRANT_ZONE_LABELS[primary.zone]}）。` : ''),
      );
    }
  }

  const subjectHint = input.pathway?.narrative[0];
  if (subjectHint) {
    parts.push(NARRATIVE_BLOCKS.pathway[0].replace('{subjectHint}', subjectHint));
  }

  const gradeFocus = GRADE_BANDS.find((band) => band.key === input.gradeBand)?.reportFocus ?? '';
  parts.push(NARRATIVE_BLOCKS.closing[input.gradeBand].replace('{gradeFocus}', gradeFocus));
  parts.push(NARRATIVE_BLOCKS.disclaimer[0]);

  return parts.join('');
}
