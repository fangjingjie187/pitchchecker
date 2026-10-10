/**
 * 离线生成模拟作答样本 → src/data/sampleResponses.json
 *
 * 用途：M5 心理测量学仪表盘（Cronbach α、相关矩阵、分布）的方法演示数据。
 * 说明：数据由种子随机生成，**不是真实受测者数据**，文件 meta 中已明确标注。
 * 同一 seed 产出完全相同的结果，便于复现与校对。
 *
 * 运行：npm run sample
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEMO_PERSONAS } from '../src/data/demoPersonas';
import { MODULE_KEYS } from '../src/config/modules';
import { fillPersonaModule, jitterPersona } from '../src/domain/personaFiller';
import type { GradeBand, ModuleKey } from '../src/types';
import type { SampleResponsesFile } from '../src/types';
import { createRng } from '../src/utils/seededRandom';

const SEED = 20261009;
const COUNT = 200;

/** 各人设在样本中的占比（贴近调研观察到的分布：未决型占比最高） */
const MIX: { personaId: string; weight: number }[] = [
  { personaId: 'p-undecided', weight: 0.45 },
  { personaId: 'p-sci-tech', weight: 0.2 },
  { personaId: 'p-art', weight: 0.2 },
  { personaId: 'p-helper', weight: 0.15 },
];

const GRADE_MIX: { band: GradeBand; weight: number }[] = [
  { band: '12-14', weight: 0.25 },
  { band: '15-16', weight: 0.45 },
  { band: '17-18', weight: 0.3 },
];

function pickWeighted<T extends { weight: number }>(list: T[], value: number): T {
  let acc = 0;
  for (const item of list) {
    acc += item.weight;
    if (value <= acc) return item;
  }
  return list[list.length - 1];
}

function main(): void {
  const rng = createRng(SEED);
  const responses: SampleResponsesFile['responses'] = [];

  for (let i = 0; i < COUNT; i += 1) {
    const personaId = pickWeighted(MIX, rng.next()).personaId;
    const basePersona = DEMO_PERSONAS.find((p) => p.id === personaId) ?? DEMO_PERSONAS[0];
    const persona = jitterPersona(basePersona, SEED + i * 37);
    const gradeBand = pickWeighted(GRADE_MIX, rng.next()).band;

    const answers: Partial<Record<ModuleKey, Record<string, number>>> = {};
    for (const module of MODULE_KEYS) {
      const filled = fillPersonaModule(persona, module, SEED + i * 11);
      // 样本文件只保留数值型作答（开放题不参与统计演示）
      const numeric: Record<string, number> = {};
      for (const [itemId, value] of Object.entries(filled)) {
        if (typeof value === 'number') numeric[itemId] = value;
      }
      answers[module] = numeric;
    }

    responses.push({ id: `s${String(i + 1).padStart(3, '0')}`, gradeBand, answers });
  }

  const payload: SampleResponsesFile = {
    meta: {
      seed: SEED,
      count: COUNT,
      generatedAt: new Date().toISOString(),
      note: '由 scripts/generateSample.ts 用种子随机离线生成的模拟数据，不是真实受测者数据，仅用于心理测量学方法演示。',
    },
    responses,
  };

  const target = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/sampleResponses.json');
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, JSON.stringify(payload), 'utf-8');
  console.log(`已生成 ${COUNT} 份模拟作答 → src/data/sampleResponses.json`);
}

void main();
