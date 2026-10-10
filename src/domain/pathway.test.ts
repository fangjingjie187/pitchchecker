import { describe, expect, it } from 'vitest';
import { buildPathway } from './pathway';
import type { CareerMatch } from '@/types';

const match = (careerId: string, total: number): CareerMatch => ({
  careerId,
  total,
  interest: total,
  ability: total,
  value: total,
  reasons: [],
});

describe('学科 → 选科 → 专业 → 职业 路径推导', () => {
  it('空匹配返回空结果', () => {
    const result = buildPathway([]);
    expect(result.nodes).toHaveLength(0);
    expect(result.links).toHaveLength(0);
  });

  it('生成四级节点与边，且叙事完整', () => {
    const result = buildPathway([
      match('c-software-engineer', 90),
      match('c-data-analyst', 85),
      match('c-ai-trainer', 80),
      match('c-cybersecurity', 70),
    ]);
    expect(result.nodes.length).toBeGreaterThan(0);
    expect(result.links.length).toBeGreaterThan(0);
    expect(result.narrative.length).toBeGreaterThan(0);

    const levels = result.nodes.map((node) => node.level);
    expect(levels).toContain('subject');
    expect(levels).toContain('subjectChoice');
    expect(levels).toContain('major');
    expect(levels).toContain('career');

    // 每个 link 的 source/target 都必须能在 nodes 里找到（桑基图不报错的前提）
    const nodeIds = new Set(result.nodes.map((node) => node.id));
    for (const link of result.links) {
      expect(nodeIds.has(link.source), `source ${link.source}`).toBe(true);
      expect(nodeIds.has(link.target), `target ${link.target}`).toBe(true);
    }
  });

  it('三段边值归一化到 10–100（跨级量纲可比，避免"选科→专业"偏粗误读）', () => {
    const result = buildPathway([
      match('c-software-engineer', 90),
      match('c-data-analyst', 85),
      match('c-ai-trainer', 80),
      match('c-cybersecurity', 70),
    ]);
    for (const link of result.links) {
      expect(link.value).toBeGreaterThanOrEqual(10);
      expect(link.value).toBeLessThanOrEqual(100);
    }
  });

  it('选科要求存在分歧时，节点标注"方案之一"而非单一方案', () => {
    // c-doctor→m-clinical(物理+化学)、c-lab-technician→m-medlab(化学+生物) 等，要求不同
    const result = buildPathway([
      match('c-doctor', 95),
      match('c-lab-technician', 90),
      match('c-rehab-therapist', 85),
    ]);
    const choice = result.nodes.find((node) => node.level === 'subjectChoice');
    expect(choice?.label).toContain('方案之一');
  });
});
