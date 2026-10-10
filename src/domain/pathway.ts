import { CAREERS } from '@/data/careers';
import { MAJORS } from '@/data/majors';
import { SUBJECTS } from '@/data/subjects';
import { SUBJECT_REQUIREMENT_NOTE } from '@/config/app.config';
import type { CareerMatch, PathwayLink, PathwayResult, PathwayStep } from '@/types';

/**
 * 学科 → 选科 → 专业 → 职业 路径推导（报告区块 9，核心亮点）。
 *
 * 设计动因：前期调研（n = 2119）中"不清楚所选科目以后可以从事哪些职业"
 * 是突出的未决原因。本模块把"将来的职业"倒推回"今天的课堂"，
 * 让选科不再是一次盲选。
 */
export function buildPathway(matches: CareerMatch[], topN = 4): PathwayResult {
  const ranked = matches.slice(0, topN);
  if (ranked.length === 0) {
    return { nodes: [], links: [], narrative: [] };
  }

  // 1) 职业节点
  const careerNodes: PathwayStep[] = ranked.map((match, index) => {
    const career = CAREERS.find((item) => item.id === match.careerId);
    return {
      level: 'career' as const,
      id: `career:${match.careerId}`,
      label: career?.name ?? match.careerId,
      weight: 100 - index * 8,
    };
  });

  // 2) 专业节点：按在推荐职业中出现的频次排序
  const majorCount = new Map<string, number>();
  for (const match of ranked) {
    const career = CAREERS.find((item) => item.id === match.careerId);
    for (const majorId of career?.majorIds ?? []) {
      majorCount.set(majorId, (majorCount.get(majorId) ?? 0) + 1);
    }
  }
  const topMajors = [...majorCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
  const majorNodes: PathwayStep[] = topMajors.map(([id, count]) => ({
    level: 'major' as const,
    id: `major:${id}`,
    label: MAJORS.find((major) => major.id === id)?.name ?? id,
    weight: count * 30,
  }));
  const majorIds = new Set(topMajors.map(([id]) => id));

  // 3) 学科节点：按推荐职业的学科关联度加权汇总
  const subjectScore = new Map<string, number>();
  for (const match of ranked) {
    const career = CAREERS.find((item) => item.id === match.careerId);
    for (const [key, value] of Object.entries(career?.subjectRelevance ?? {})) {
      subjectScore.set(key, (subjectScore.get(key) ?? 0) + value);
    }
  }
  const topSubjects = [...subjectScore.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
  const subjectNodes: PathwayStep[] = topSubjects.map(([key, score]) => ({
    level: 'subject' as const,
    id: `subject:${key}`,
    label: SUBJECTS.find((subject) => subject.key === key)?.name ?? key,
    weight: score * 4,
  }));

  // 4) 选科节点：汇总 Top 专业的选科要求；若存在分歧则标注"方案之一"并并列多方案
  const choiceRequirements = [
    ...new Set(
      topMajors
        .map(([id]) => MAJORS.find((major) => major.id === id)?.subjectRequirement)
        .filter((req): req is string => Boolean(req)),
    ),
  ];
  const choiceLabel =
    choiceRequirements.length <= 1
      ? choiceRequirements[0]
        ? `选科参考：${choiceRequirements[0]}`
        : '选科参考：见各专业要求'
      : `选科方案之一：${choiceRequirements[0]}；另有：${choiceRequirements.slice(1).join('；')}`;
  const choiceNode: PathwayStep = {
    level: 'subjectChoice' as const,
    id: 'choice:core',
    label: choiceLabel,
    weight: 100,
  };

  /*
   * 桑基边 value 的语义与量纲（有据可查）：
   *
   *  学科 → 选科（subject → subjectChoice）：
   *    原始 = subjectScore × 4；subjectScore = 对 Top4 推荐职业累加 subjectRelevance[该学科]（1–5）。
   *  选科 → 专业（subjectChoice → major）：
   *    原始 = majorCount × 30；majorCount = Top4 推荐职业中 majorIds 含该专业的职业数。
   *  专业 → 职业（major → career）：
   *    原始 = match.total（该职业综合匹配度 0–100）。
   *
   * ⚠ 三段原始量纲不同（16–80 / 30–120 / 10–33），若直接绘制，"选科→专业"边会
   * 显著偏粗，造成"这一段最重要"的误读。故将**每一级独立归一化到 10–100**，
   * 让边宽反映"该级内部的相对强弱"，跨级视觉可比；语义口径见上，不再跨级比较绝对大小。
   */
  const normalize = (values: number[]): number[] => {
    const max = Math.max(...values);
    if (max <= 0) return values.map(() => 10);
    return values.map((value) => Math.max(10, Math.round((value / max) * 100)));
  };
  const subjectNorm = normalize(subjectNodes.map((node) => node.weight));
  const majorNorm = normalize(majorNodes.map((node) => node.weight));

  const links: PathwayLink[] = [];
  subjectNodes.forEach((subject, index) => {
    links.push({ source: subject.id, target: choiceNode.id, value: subjectNorm[index] });
  });
  majorNodes.forEach((major, index) => {
    links.push({ source: choiceNode.id, target: major.id, value: majorNorm[index] });
  });
  for (const match of ranked) {
    const career = CAREERS.find((item) => item.id === match.careerId);
    const node = careerNodes.find((item) => item.id === `career:${match.careerId}`)!;
    for (const majorId of career?.majorIds ?? []) {
      if (!majorIds.has(majorId)) continue;
      // match.total 本身 0–100，与前两级归一化后的量纲一致，直接取用
      links.push({
        source: `major:${majorId}`,
        target: node.id,
        value: Math.max(10, Math.round(match.total)),
      });
    }
  }

  const subjectNames = subjectNodes.map((node) => node.label);
  const majorNames = majorNodes.map((node) => node.label);
  const careerNames = careerNodes.map((node) => node.label);

  const narrative: string[] = [];
  if (subjectNames.length > 0 && majorNames.length > 0) {
    narrative.push(
      `你现在学好的 ${subjectNames.join('、')}，会直接通向 ${majorNames.join('、')} 这些专业。`,
    );
  }
  if (majorNames.length > 0 && careerNames.length > 0) {
    narrative.push(
      `读完 ${majorNames[0]}，比较常见的去向是 ${careerNames.slice(0, 3).join('、')} 这类工作。`,
    );
  }
  if (choiceRequirements.length > 0) {
    narrative.push(`${choiceLabel}。${SUBJECT_REQUIREMENT_NOTE}`);
  }

  return {
    nodes: [...subjectNodes, choiceNode, ...majorNodes, ...careerNodes],
    links,
    narrative,
  };
}
