/**
 * 数据完整性校验器（node 侧运行：npm run validate）。
 *
 * 用途：data/ 目录由人工替换校对，必须在启动前把字段缺失、引用断链、
 * 题量不符、反向题越界等问题暴露出来，而不是等到运行时崩溃。
 *
 * 未生成的文件会标记为 SKIP，不会导致失败（便于按里程碑推进）。
 */

import { DATA_TARGETS } from '../src/config/data.config';
import { MODULES, MODULE_KEYS } from '../src/config/modules';
import { MATCH_WEIGHTS, ABILITY_SLIDER } from '../src/config/scoring.config';
import { HOLLAND_CODES, type AssessmentItem, type ModuleKey } from '../src/types';
import { DATA_STATUS } from '../src/data/status';

interface CheckResult {
  file: string;
  status: 'OK' | 'SKIP' | 'ERROR';
  errors: string[];
  warnings: string[];
}

const results: CheckResult[] = [];
/** 全卷允许的配对题对数（近义改写，语义可互换） */
const MAX_TOTAL_PAIRS = 3;
const ABILITY_KEYS = ['verbal', 'logic', 'spatial', 'handson', 'interpersonal', 'creative'];

function record(file: string): CheckResult {
  const entry: CheckResult = { file, status: 'OK', errors: [], warnings: [] };
  results.push(entry);
  return entry;
}

/**
 * 数据文件按里程碑逐个交付，缺失时不应导致校验器崩溃。
 * 这里使用 @ts-ignore：路径在编译期可能尚不存在，由运行期 try/catch 兜底。
 */
async function tryImport<T>(path: string): Promise<T | null> {
  try {
    // @ts-ignore 数据文件可能尚未生成
    return (await import(path)) as T;
  } catch {
    return null;
  }
}

/** ---- 1. 模块注册表 ---- */
function checkRegistry(): void {
  const entry = record('src/config/modules.ts');
  const keys = new Set<string>();
  const orders = new Set<number>();
  for (const meta of MODULES) {
    if (keys.has(meta.key)) entry.errors.push(`模块 key 重复：${meta.key}`);
    keys.add(meta.key);
    if (orders.has(meta.order)) entry.errors.push(`模块 order 重复：${meta.order}`);
    orders.add(meta.order);
    if (meta.itemCount <= 0) entry.errors.push(`${meta.key}：itemCount 必须大于 0`);
    if (meta.dimensions.length === 0) entry.errors.push(`${meta.key}：未定义维度`);
    if (meta.scale.type === 'likert5' && meta.scale.labels.length !== 5) {
      entry.errors.push(`${meta.key}：5 点量表需要 5 个锚定词，当前 ${meta.scale.labels.length} 个`);
    }
  }
  for (const key of MODULE_KEYS) {
    if (!keys.has(key)) entry.errors.push(`MODULE_KEYS 中存在未定义元数据的模块：${key}`);
  }
}

/** ---- 2. 计分配置 ---- */
function checkScoringConfig(): void {
  const entry = record('src/config/scoring.config.ts');
  const sum = MATCH_WEIGHTS.interest + MATCH_WEIGHTS.ability + MATCH_WEIGHTS.value;
  if (Math.abs(sum - 1) > 1e-6) {
    entry.errors.push(`MATCH_WEIGHTS 之和应为 1，当前为 ${sum}`);
  }
  if (ABILITY_SLIDER.step !== 10 || ABILITY_SLIDER.max !== 100) {
    entry.errors.push('能力自信度滑条应为 0–100、10 分一档（Bandura 自我效能规范）');
  }
}

/** ---- 3. 题目数据 ---- */
async function checkItems(): Promise<void> {
  const file = 'src/data/items/index.ts';
  const entry = record(file);
  const mod = await tryImport<{ ITEMS?: Record<string, AssessmentItem[]> }>('../src/data/items/index.ts');
  if (!mod?.ITEMS) {
    entry.status = 'SKIP';
    entry.warnings.push('题目文件尚未生成（M2 交付）');
    return;
  }

  const items = mod.ITEMS;
  const allIds = new Set<string>();

  for (const meta of MODULES) {
    const list = items[meta.key] ?? [];
    if (list.length === 0) {
      entry.warnings.push(`${meta.key}：暂无题目`);
      continue;
    }
    if (list.length !== meta.itemCount) {
      entry.errors.push(`${meta.key}：题目数 ${list.length} 与注册表声明的 ${meta.itemCount} 不一致`);
    }

    const perDimension = new Map<string, number>();
    for (const item of list) {
      if (allIds.has(item.id)) entry.errors.push(`题目 id 重复：${item.id}`);
      allIds.add(item.id);

      if (!meta.dimensions.includes(item.dimension)) {
        entry.errors.push(`${item.id}：维度 ${item.dimension} 不在模块声明的维度列表中`);
      }
      if (!item.text?.trim()) entry.errors.push(`${item.id}：题干为空`);

      // M2.1：开放题一律不计入任何维度计分，dimension 仅作归档用
      if (item.type === 'open' && item.excludeFromScoring !== true) {
        entry.errors.push(`${item.id}：开放题必须标记 excludeFromScoring: true，不得计入维度计分`);
      }
      if (item.type !== 'open' && item.excludeFromScoring === true) {
        entry.errors.push(`${item.id}：只有开放题可以标记 excludeFromScoring`);
      }

      // 迫选题按"选项所属维度"统计覆盖，题目自身的 dimension 仅作显示用
      if (item.type === 'forcedChoice') {
        for (const option of item.options) {
          perDimension.set(option.dimension, (perDimension.get(option.dimension) ?? 0) + 1);
        }
      } else if (!item.excludeFromScoring) {
        // 不计分条目（开放题）不参与维度覆盖统计
        perDimension.set(item.dimension, (perDimension.get(item.dimension) ?? 0) + 1);
      }

      // 反向题约定：仅人格与生涯适应力量表允许
      if (
        item.reverse &&
        !(DATA_TARGETS.reverseAllowedModules as readonly string[]).includes(meta.key)
      ) {
        entry.errors.push(`${item.id}：反向题只允许出现在人格与生涯适应力量表（当前在 ${meta.key}）`);
      }

      // 开放题与迫选题允许混编在任何模块中（价值观模块即为 7 题评定 + 3 题迫选）
      const mixedAllowed = item.type === 'open' || item.type === 'forcedChoice';
      if (!mixedAllowed && item.type !== meta.scale.type) {
        entry.errors.push(`${item.id}：题型 ${item.type} 与模块量表类型 ${meta.scale.type} 不一致`);
      }

      if (item.type === 'forcedChoice' && item.options.length < 2) {
        entry.errors.push(`${item.id}：迫选题至少需要 2 个选项`);
      }
      if (item.type === 'forcedChoice') {
        for (const option of item.options) {
          if (!meta.dimensions.includes(option.dimension)) {
            entry.errors.push(`${item.id}/${option.id}：选项维度 ${option.dimension} 不在维度列表中`);
          }
        }
      }
    }

    // 维度覆盖
    const min = DATA_TARGETS.minItemsPerDimension[meta.key] ?? 1;
    for (const dimension of meta.dimensions) {
      const count = perDimension.get(dimension) ?? 0;
      if (count < min) {
        entry.errors.push(`${meta.key}/${dimension}：题目数 ${count}，少于要求的 ${min}`);
      }
    }

    // 正向计分模块的显式校验：不得出现 reverse 标记
    if ((DATA_TARGETS.positiveOnlyModules as readonly string[]).includes(meta.key)) {
      const reversed = list.filter((item) => item.reverse).map((item) => item.id);
      if (reversed.length > 0) {
        entry.errors.push(`${meta.key}：要求全部正向计分，但以下题目标了 reverse：${reversed.join('、')}`);
      }
    }

    // 配对题一致性检验
    const byId = new Map(list.map((item) => [item.id, item]));
    for (const item of list) {
      if (!item.pairId) continue;
      const target = byId.get(item.pairId);
      if (!target) {
        entry.errors.push(`${item.id}：pairId 指向的题目 ${item.pairId} 不存在`);
        continue;
      }
      if (target.pairId !== item.id) {
        entry.warnings.push(`${item.id} 与 ${item.pairId}：配对关系不是双向的`);
      }
    }

    // 配对题必须是语义可互换的近义改写；每个模块最多 1 对
    const pairCount = list.filter((item) => item.pairId).length / 2;
    if (pairCount > 1) {
      entry.errors.push(
        `${meta.key}：一致性配对题最多 1 对（当前 ${pairCount} 对）。配对题必须是近义改写，否则真实心理差异会被误报为作答噪声。`,
      );
    }
    if (meta.key === 'interest' && pairCount !== 1) {
      entry.errors.push(`interest：一致性配对题应为 1 对（近义改写），当前 ${pairCount} 对。`);
    }
  }
}

/** ---- 4. 职业库 / 专业库 / 学科库 ---- */
async function checkCareerData(): Promise<void> {
  const careersMod = await tryImport<{ CAREERS?: any[] }>('../src/data/careers.ts');
  const majorsMod = await tryImport<{ MAJORS?: any[] }>('../src/data/majors.ts');
  const subjectsMod = await tryImport<{ SUBJECTS?: any[] }>('../src/data/subjects.ts');
  const valuesMod = await tryImport<{ VALUE_DIMENSIONS?: any[] }>('../src/data/values.ts');

  const entry = record('src/data/careers.ts');
  if (!careersMod?.CAREERS) {
    entry.status = 'SKIP';
    entry.warnings.push('职业库尚未生成（M2 交付）');
    return;
  }

  const careers = careersMod.CAREERS;
  const majorIds = new Set((majorsMod?.MAJORS ?? []).map((m) => m.id));
  const subjectKeys = new Set((subjectsMod?.SUBJECTS ?? []).map((s) => s.key));
  const valueKeys = new Set((valuesMod?.VALUE_DIMENSIONS ?? []).map((v) => v.key));

  if (careers.length !== DATA_TARGETS.careers) {
    entry.errors.push(`职业数量 ${careers.length}，目标为 ${DATA_TARGETS.careers}`);
  }

  const ids = new Set<string>();
  const industries = new Set<string>();
  const hollandFirst = new Map<string, number>();

  for (const career of careers) {
    if (ids.has(career.id)) entry.errors.push(`职业 id 重复：${career.id}`);
    ids.add(career.id);
    industries.add(career.industry);

    const code = String(career.hollandCode ?? '');
    if (code.length !== 3 || [...code].some((c) => !HOLLAND_CODES.includes(c as never))) {
      entry.errors.push(`${career.id}：hollandCode "${code}" 非法（应为 3 位 RIASEC 字母）`);
    } else {
      const first = code[0];
      hollandFirst.set(first, (hollandFirst.get(first) ?? 0) + 1);
    }

    for (const key of ABILITY_KEYS) {
      const value = career.abilityDemand?.[key];
      if (typeof value !== 'number' || value < 1 || value > 5) {
        entry.errors.push(`${career.id}：abilityDemand.${key} 缺失或不在 1–5 之间`);
      }
    }

    for (const majorId of career.majorIds ?? []) {
      if (majorIds.size > 0 && !majorIds.has(majorId)) {
        entry.errors.push(`${career.id}：引用了不存在的专业 ${majorId}`);
      }
    }
    for (const subjectKey of Object.keys(career.subjectRelevance ?? {})) {
      if (subjectKeys.size > 0 && !subjectKeys.has(subjectKey)) {
        entry.errors.push(`${career.id}：引用了不存在的学科 ${subjectKey}`);
      }
    }
    for (const valueKey of career.valueSupply ?? []) {
      if (valueKeys.size > 0 && !valueKeys.has(valueKey)) {
        entry.errors.push(`${career.id}：引用了不存在的价值观 ${valueKey}`);
      }
    }
    if (!career.dayInLife?.trim()) entry.errors.push(`${career.id}：缺少 dayInLife`);
    if (!career.entryActions?.length) entry.errors.push(`${career.id}：缺少 entryActions`);
    if (!career.misconceptions?.trim()) entry.errors.push(`${career.id}：缺少 misconceptions`);
  }

  for (const code of HOLLAND_CODES) {
    const count = hollandFirst.get(code) ?? 0;
    if (count < DATA_TARGETS.minCareersPerHolland) {
      entry.errors.push(`以 ${code} 为首码的职业只有 ${count} 条，要求至少 ${DATA_TARGETS.minCareersPerHolland} 条`);
    }
  }
  if (industries.size < DATA_TARGETS.industries) {
    entry.warnings.push(`行业覆盖 ${industries.size} 个，目标 ${DATA_TARGETS.industries} 个`);
  }

  const majorsEntry = record('src/data/majors.ts');
  if (!majorsMod?.MAJORS) {
    majorsEntry.status = 'SKIP';
    majorsEntry.warnings.push('专业库尚未生成（M2 交付）');
  } else {
    const careerIdSet = new Set(careers.map((c) => c.id));
    for (const major of majorsMod.MAJORS) {
      for (const careerId of major.careerIds ?? []) {
        if (!careerIdSet.has(careerId)) {
          majorsEntry.errors.push(`${major.id}：引用了不存在的职业 ${careerId}`);
        }
      }
    }
  }

  const subjectsEntry = record('src/data/subjects.ts');
  if (!subjectsMod?.SUBJECTS) {
    subjectsEntry.status = 'SKIP';
    subjectsEntry.warnings.push('学科库尚未生成（M2 交付）');
  } else {
    for (const subject of subjectsMod.SUBJECTS) {
      for (const ability of subject.abilities ?? []) {
        if (!ABILITY_KEYS.includes(ability)) {
          subjectsEntry.errors.push(`${subject.key}：能力 key ${ability} 不在能力维度表中`);
        }
      }
    }
  }
}

/** ---- 4.5 全卷配对题总数 ---- */
async function checkPairTotal(): Promise<void> {
  const mod = await tryImport<{ ITEMS?: Record<string, AssessmentItem[]> }>('../src/data/items/index.ts');
  const entry = record('题目配对题总数');
  if (!mod?.ITEMS) {
    entry.status = 'SKIP';
    return;
  }
  const total = Object.values(mod.ITEMS).flat().filter((item) => item.pairId).length / 2;
  if (total > MAX_TOTAL_PAIRS) {
    entry.errors.push(`全卷配对题共 ${total} 对，超过上限 ${MAX_TOTAL_PAIRS} 对`);
  }
  const kept = Object.entries(mod.ITEMS)
    .flatMap(([module, list]) => list.filter((item) => item.pairId).map((item) => `${module}:${item.id}`))
    .sort();
  entry.warnings.push(`当前保留 ${total} 对：${kept.join('、')}`);
}

/** ---- 5. 常模 / 解释文案 / 行动建议的覆盖度 ---- */
async function checkSupportData(): Promise<void> {
  const normsMod = await tryImport<{ BASE_NORMS?: Record<string, Record<string, unknown>> }>(
    '../src/data/norms.ts',
  );
  const interpMod = await tryImport<{
    MODULE_INTERPRETATIONS?: Record<string, { dimensions?: Record<string, unknown> }>;
  }>('../src/data/interpretations.ts');
  const actionsMod = await tryImport<{ ACTIONS?: { module: string; dimension: string; level: string }[] }>(
    '../src/data/actions.ts',
  );

  const normsEntry = record('src/data/norms.ts');
  if (!normsMod?.BASE_NORMS) {
    normsEntry.status = 'SKIP';
  } else {
    for (const meta of MODULES) {
      for (const dimension of meta.dimensions) {
        if (!normsMod.BASE_NORMS[meta.key]?.[dimension]) {
          normsEntry.errors.push(`${meta.key}/${dimension}：缺少演示常模参数`);
        }
      }
    }
  }

  const interpEntry = record('src/data/interpretations.ts');
  if (!interpMod?.MODULE_INTERPRETATIONS) {
    interpEntry.status = 'SKIP';
  } else {
    for (const meta of MODULES) {
      const block = interpMod.MODULE_INTERPRETATIONS[meta.key];
      if (!block) {
        interpEntry.errors.push(`${meta.key}：缺少模块解释文案`);
        continue;
      }
      for (const dimension of meta.dimensions) {
        const set = block.dimensions?.[dimension] as Record<string, string> | undefined;
        if (!set) {
          interpEntry.errors.push(`${meta.key}/${dimension}：缺少解释文案`);
          continue;
        }
        for (const level of ['high', 'mid', 'low']) {
          if (!set[level]?.trim()) {
            interpEntry.errors.push(`${meta.key}/${dimension}：缺少 ${level} 档解释文案`);
          }
        }
      }
    }
  }

  const actionsEntry = record('src/data/actions.ts');
  if (!actionsMod?.ACTIONS) {
    actionsEntry.status = 'SKIP';
  } else {
    const covered = new Set(actionsMod.ACTIONS.map((a) => `${a.module}/${a.dimension}/${a.level}`));
    // 兴趣、能力、适应力三个模块必须三档齐全
    for (const key of ['interest', 'ability', 'adaptability'] as const) {
      const meta = MODULES.find((m) => m.key === key);
      if (!meta) continue;
      for (const dimension of meta.dimensions) {
        for (const level of ['high', 'mid', 'low']) {
          if (!covered.has(`${key}/${dimension}/${level}`)) {
            actionsEntry.errors.push(`${key}/${dimension}/${level}：缺少行动建议`);
          }
        }
      }
    }
    // 价值观与决策风格按"高分 / 主导"给建议
    const valueMeta = MODULES.find((m) => m.key === 'value');
    for (const dimension of valueMeta?.dimensions ?? []) {
      if (!covered.has(`value/${dimension}/high`)) {
        actionsEntry.errors.push(`value/${dimension}/high：缺少价值观行动建议`);
      }
    }
    const decisionMeta = MODULES.find((m) => m.key === 'decision');
    for (const dimension of decisionMeta?.dimensions ?? []) {
      if (!covered.has(`decision/${dimension}/high`)) {
        actionsEntry.errors.push(`decision/${dimension}/high：缺少决策风格行动建议`);
      }
    }
  }
}

/** ---- 6. 数据填充登记 ---- */
function checkStatus(): void {
  const entry = record('src/data/status.ts');
  const unknown = DATA_STATUS.populated.filter((key: ModuleKey) => !MODULE_KEYS.includes(key));
  if (unknown.length > 0) {
    entry.errors.push(`DATA_STATUS 中存在未注册的模块：${unknown.join('、')}`);
  }
  const missing = MODULES.filter((m) => m.enabled && !DATA_STATUS.populated.includes(m.key));
  if (missing.length > 0) {
    entry.warnings.push(`尚未填充题目：${missing.map((m) => m.key).join('、')}`);
  }
}

/** ---- 输出 ---- */
function print(): number {
  const line = '─'.repeat(64);
  console.log(`\n生涯罗盘 · 数据校验报告`);
  console.log(line);
  for (const result of results) {
    const tag =
      result.status === 'OK' ? '通过' : result.status === 'SKIP' ? '跳过' : '错误';
    console.log(`[${tag}] ${result.file}`);
    for (const warning of result.warnings) console.log(`        · 提示：${warning}`);
    for (const error of result.errors) console.log(`        ✗ ${error}`);
  }
  console.log(line);
  const errorCount = results.reduce((sum, r) => sum + r.errors.length, 0);
  const warningCount = results.reduce((sum, r) => sum + r.warnings.length, 0);
  console.log(`错误 ${errorCount} 项 · 提示 ${warningCount} 项`);
  if (errorCount > 0) {
    console.log('结论：存在必须修复的问题，请修正后重新运行。\n');
    return 1;
  }
  console.log('结论：已生成的数据全部通过校验。\n');
  return 0;
}

async function main(): Promise<void> {
  checkRegistry();
  checkScoringConfig();
  await checkItems();
  await checkPairTotal();
  await checkCareerData();
  await checkSupportData();
  checkStatus();
  const code = print();
  process.exit(code);
}

void main();
