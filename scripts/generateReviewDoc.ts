/**
 * 生成《数据校对稿》(docs/数据校对稿.md)。
 *
 * 目的：把 src/data/ 里的题目、职业库、常模、迫选计分映射导出成一份可在 Word 里批注的文档，
 * 便于逐条校对。文档由数据直接生成——数据改动后重跑 `npm run review` 即可同步，
 * 避免手工转录造成的版本漂移。
 *
 * 运行：npm run review
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ITEMS } from '../src/data/items';
import { CAREERS, INDUSTRY_LABELS, GROWTH_LABELS } from '../src/data/careers';
import { MAJORS } from '../src/data/majors';
import { SUBJECTS } from '../src/data/subjects';
import { VALUE_DIMENSIONS } from '../src/data/values';
import { ABILITY_DIMENSIONS } from '../src/data/abilities';
import { HOLLAND_TYPES } from '../src/data/holland';
import { BASE_NORMS, BAND_ADJUST } from '../src/data/norms';
import { MODULES } from '../src/config/modules';
import { SUBJECT_REQUIREMENT_NOTE } from '../src/config/app.config';
import { VALUE_SCORING } from '../src/config/scoring.config';
import type { AssessmentItem, Career, ModuleKey } from '../src/types';

const lines: string[] = [];
const w = (text = '') => lines.push(text);

const ABILITY_KEYS = ABILITY_DIMENSIONS.map((a) => a.key);
const VALUE_NAMES: Record<string, string> = Object.fromEntries(
  VALUE_DIMENSIONS.map((v) => [v.key, v.name]),
);
const SUBJECT_NAMES: Record<string, string> = Object.fromEntries(SUBJECTS.map((s) => [s.key, s.name]));

function scaleLabel(module: ModuleKey): string {
  const meta = MODULES.find((m) => m.key === module);
  if (!meta) return '';
  const map: Record<string, string> = {
    likert5: '5 点量表（1–5）',
    slider100: '滑条 0–100 / 10 分一档',
  };
  return map[meta.scale.type] ?? meta.scale.type;
}

function directionOf(item: AssessmentItem, module: ModuleKey): string {
  if (item.excludeFromScoring) return '—（不计分）';
  if (item.reverse) return '**反向**（需翻转）';
  // comfort 为负向构念：得分越高代表担心越多，但不使用 reverse 标记翻转
  if (module === 'warmup' && item.dimension === 'comfort') return '正向（负向构念）';
  return '正向';
}

function pairMark(item: AssessmentItem): string {
  return item.pairId ? `↔ ${item.pairId}` : '';
}

/* ───────────────────────── 封面与说明 ───────────────────────── */
w('# 生涯罗盘 · 数据校对稿');
w();
w(`> 本文件由 \`scripts/generateReviewDoc.ts\` 从 \`src/data/\` 直接生成，生成时间：${new Date().toLocaleString('zh-CN')}`);
w('> 数据修改后重新运行 `npm run review` 即可同步本稿。');
w();
w('## 怎么用这份稿子');
w();
w('1. 在 Word 中打开，用「审阅 → 新建批注」直接在表格右侧的 **批注** 空列里写意见；');
w('2. 需要大段修改的，在对应小节下方的「修改建议」行里直接改写文本；');
w('3. 改完把批注反馈给我，我按批注改 `src/data/` 里的源文件，再重跑本脚本复核。');
w();
w('## 目录');
w();
w('- [第一部分 · 78 题题目全文](#第一部分--78-题题目全文)');
w('- [第二部分 · 价值观迫选计分映射说明](#第二部分--价值观迫选计分映射说明)');
w('- [第三部分 · 60 条职业库全字段](#第三部分--60-条职业库全字段)');
w('- [第四部分 · 演示常模参数表](#第四部分--演示常模参数表)');
w('- [第五部分 · 专业库与学科库](#第五部分--专业库与学科库)');
w();
w('---');
w();

/* ───────────────────────── 第一部分：题目 ───────────────────────── */
w('<a id="第一部分--78-题题目全文"></a>');
w('## 第一部分 · 78 题题目全文');
w();
w('表头说明：**计分方向** 中「反向（需翻转）」表示该题需翻转计分；「正向（负向构念）」指该题不翻转，但得分越高代表越担心；**计分** 为「否」表示该题不计入任何维度（仅归档与叙事用）。');
w();

let total = 0;
for (const meta of MODULES) {
  const list = ITEMS[meta.key];
  total += list.length;
  w(`### ${meta.order + 1}. ${meta.title}（${meta.key} · ${meta.priority} · ${list.length} 题 · ${scaleLabel(meta.key)}）`);
  w();
  w(`- 理论依据：${meta.theory}`);
  w(`- 理论出处：${meta.theorySource}`);
  w(`- 作答指导语：**${meta.prompt ?? '—'}**`);
  w(`- 模块引导语：${meta.intro}`);
  w();
  w('| # | id | 维度 | 题干 | 补充说明 | 计分方向 | 计分 | 配对 | 批注 |');
  w('|---|---|---|---|---|---|---|---|---|');
  list.forEach((item, index) => {
    const cell = (text: string) => text.replace(/\|/g, '\\|').replace(/\n/g, ' ');
    w(
      `| ${index + 1} | \`${item.id}\` | ${item.dimension} | ${cell(item.text)} | ${cell(item.subText ?? '')} | ${directionOf(item, meta.key)} | ${item.excludeFromScoring ? '否' : '是'} | ${pairMark(item)} |  |`,
    );
  });
  w();
  w(`**模块小结**：${list.length} 题；维度覆盖：${meta.dimensions.join('、')}。`);
  w();
  w('修改建议：');
  w();
  w('> ');
  w();
}
w(`**题目合计：${total} 题**（目标 78 题）。`);
w();
w('---');
w();

/* ───────────────────────── 第二部分：迫选计分映射 ───────────────────────── */
w('<a id="第二部分--价值观迫选计分映射说明"></a>');
w('## 第二部分 · 价值观迫选计分映射说明');
w();
w('### 2.1 为什么混入迫选题');
w();
w('评定题容易出现「全都选重要」，看不出排序；迫选题逼出真实取舍，也能降低社会赞许性偏差。');
w();
w('### 2.2 选项 → 维度映射');
w();
w('| 题号 | 题干 | 选项 | 选中后计入的维度 | 批注 |');
w('|---|---|---|---|---|');
for (const item of ITEMS.value) {
  if (item.type !== 'forcedChoice') continue;
  item.options.forEach((option, index) => {
    w(
      `| ${index === 0 ? `\`${item.id}\`` : ''} | ${index === 0 ? item.text : ''} | ${option.label} | ${option.dimension}（${VALUE_NAMES[option.dimension] ?? '—'}） |  |`,
    );
  });
}
w();

// 统计每个维度在迫选题中出现的次数
const fcAppear: Record<string, number> = {};
for (const item of ITEMS.value) {
  if (item.type !== 'forcedChoice') continue;
  for (const option of item.options) {
    fcAppear[option.dimension] = (fcAppear[option.dimension] ?? 0) + 1;
  }
}

w('### 2.3 各维度的题源分布');
w();
w('| 维度 | 名称 | 评定题 | 在迫选题中出现次数 | 批注 |');
w('|---|---|---|---|---|');
for (const def of VALUE_DIMENSIONS) {
  const hasRating = ITEMS.value.some((i) => i.type !== 'forcedChoice' && i.dimension === def.key);
  w(
    `| ${def.key} | ${def.name} | ${hasRating ? '有（1 题）' : '无'} | ${fcAppear[def.key] ?? 0} |  |`,
  );
}
w();
w('### 2.4 合成规则');
w();
w('```');
w('评定分 p = (作答值 − 1) / 4 × 100            # 1–5 点线性映射到 0–100，仅 7 个维度有');
w('迫选分 f = 该维度被选中次数 / 该维度在迫选题中出现次数 × 100');
w(`维度最终分 = 两者都有时 ${VALUE_SCORING.ratingWeight}·p + ${VALUE_SCORING.forcedChoiceWeight}·f`);
w('             只有评定题时直接取 p；只有迫选题时直接取 f');
w('```');
w();
w(`权重常量位于 \`src/config/scoring.config.ts\` 的 \`VALUE_SCORING\`（当前 ${VALUE_SCORING.ratingWeight} / ${VALUE_SCORING.forcedChoiceWeight}），可直接调整。`);
w();
w('修改建议：');
w();
w('> ');
w();
w('---');
w();

/* ───────────────────────── 第三部分：职业库 ───────────────────────── */
w('<a id="第三部分--60-条职业库全字段"></a>');
w('## 第三部分 · 60 条职业库全字段');
w();

w('### 3.1 总览表');
w();
w('| # | id | 名称 | 行业 | Holland 码 | 前景 | 新兴 | 批注 |');
w('|---|---|---|---|---|---|---|---|');
CAREERS.forEach((career, index) => {
  w(
    `| ${index + 1} | \`${career.id}\` | ${career.name} | ${INDUSTRY_LABELS[career.industry] ?? career.industry} | ${career.hollandCode} | ${GROWTH_LABELS[career.growthOutlook] ?? career.growthOutlook} | ${career.isEmerging ? '★' : ''} |  |`,
  );
});
w();

const firstCodeCount: Record<string, number> = {};
for (const career of CAREERS) {
  firstCodeCount[career.hollandCode[0]] = (firstCodeCount[career.hollandCode[0]] ?? 0) + 1;
}
w('### 3.2 六型首码与行业分布');
w();
w('| Holland 首码 | 类型名 | 条数 | 批注 |');
w('|---|---|---|---|');
for (const type of HOLLAND_TYPES) {
  w(`| ${type.key} | ${type.name} | ${firstCodeCount[type.key] ?? 0} |  |`);
}
w();
w('| 行业 | 条数 | 其中新兴职业 | 批注 |');
w('|---|---|---|---|');
const industryCount: Record<string, number> = {};
const industryEmerging: Record<string, number> = {};
for (const career of CAREERS) {
  industryCount[career.industry] = (industryCount[career.industry] ?? 0) + 1;
  if (career.isEmerging) industryEmerging[career.industry] = (industryEmerging[career.industry] ?? 0) + 1;
}
for (const [key, count] of Object.entries(industryCount)) {
  w(`| ${INDUSTRY_LABELS[key] ?? key} | ${count} | ${industryEmerging[key] ?? 0} |  |`);
}
w();

w('### 3.3 逐条全字段');
w();
CAREERS.forEach((career: Career, index) => {
  w(`#### ${index + 1}. ${career.name}　\`${career.id}\``);
  w();
  w(`- **别名**：${career.aliases.join('、')}`);
  w(`- **Holland 码**：${career.hollandCode}　|　**行业**：${INDUSTRY_LABELS[career.industry] ?? career.industry}　|　**前景**：${GROWTH_LABELS[career.growthOutlook] ?? career.growthOutlook}${career.isEmerging ? '　|　**新兴职业 ★**' : ''}`);
  w(`- **学历路径**：${career.educationPath}`);
  w(`- **对口专业**：${career.majorIds.map((id) => MAJORS.find((m) => m.id === id)?.name ?? id).join('、')}`);
  w(
    `- **学科关联**：${Object.entries(career.subjectRelevance)
      .map(([key, value]) => `${SUBJECT_NAMES[key] ?? key} ${value}`)
      .join('　')}`,
  );
  w(
    `- **能力需求（1–5）**：${ABILITY_KEYS.map((key) => `${ABILITY_DIMENSIONS.find((a) => a.key === key)!.short} ${career.abilityDemand[key as keyof typeof career.abilityDemand]}`).join('　')}`,
  );
  w(`- **满足的价值观**：${career.valueSupply.map((key) => VALUE_NAMES[key] ?? key).join('、')}`);
  w(`- **一天在做什么**：${career.dayInLife}`);
  w(`- **中学阶段可做的事**：`);
  for (const action of career.entryActions) w(`  1. ${action}`);
  w(`- **常见误解澄清**：${career.misconceptions}`);
  w();
  w('修改建议：');
  w();
  w('> ');
  w();
});
w('---');
w();

/* ───────────────────────── 第四部分：常模 ───────────────────────── */
w('<a id="第四部分--演示常模参数表"></a>');
w('## 第四部分 · 演示常模参数表');
w();
w('> ⚠ 以下为**演示用参考参数**，不是标准化全国常模。来源为先验分布假定，正式使用需以真实常模样本重新标定。');
w();
w('### 4.1 基础参数（0–100 尺度）');
w();
for (const meta of MODULES) {
  const block = BASE_NORMS[meta.key];
  if (!block) continue;
  w(`**${meta.title}（${meta.key}）**`);
  w();
  w('| 维度 | 名称 | mean | sd | 批注 |');
  w('|---|---|---|---|---|');
  for (const [key, entry] of Object.entries(block)) {
    const def =
      HOLLAND_TYPES.find((t) => t.key === key) ??
      ABILITY_DIMENSIONS.find((a) => a.key === key) ??
      VALUE_DIMENSIONS.find((v) => v.key === key);
    w(`| ${key} | ${def?.name ?? '—'} | ${entry.mean} | ${entry.sd} |  |`);
  }
  w();
}
w('### 4.2 年级段微调');
w();
w('最终参数 = 基础值 + meanDelta，sd = 基础 sd × sdFactor。');
w();
w('| 年级段 | meanDelta | sdFactor | 批注 |');
w('|---|---|---|---|');
for (const [band, adjust] of Object.entries(BAND_ADJUST)) {
  w(`| ${band} | ${adjust.meanDelta} | ${adjust.sdFactor} |  |`);
}
w();
w('### 4.3 等级切分');
w();
w('| 等级 | 百分等级条件 |');
w('|---|---|');
w('| low | < 35 |');
w('| mid | 35 – 65 |');
w('| high | ≥ 65 |');
w();
w('修改建议：');
w();
w('> ');
w();
w('---');
w();

/* ───────────────────────── 第五部分：专业库与学科库 ───────────────────────── */
w('<a id="第五部分--专业库与学科库"></a>');
w('## 第五部分 · 专业库与学科库');
w();
w(`> ⚠ 选科要求为通用描述，**${SUBJECT_REQUIREMENT_NOTE}**（界面展示该字段时必须同时展示此脚注）。`);
w();
w('### 5.1 学科库');
w();
w('| key | 名称 | 锻炼的能力 | 可迁移说明 | 批注 |');
w('|---|---|---|---|---|');
for (const subject of SUBJECTS) {
  w(
    `| ${subject.key} | ${subject.name} | ${subject.abilities.join('、')} | ${subject.transferable} |  |`,
  );
}
w();
w('### 5.2 专业库');
w();
w('| # | id | 名称 | 门类 | 选科要求 | 对口职业 | 批注 |');
w('|---|---|---|---|---|---|---|');
MAJORS.forEach((major, index) => {
  const careerNames = major.careerIds
    .map((id) => CAREERS.find((c) => c.id === id)?.name ?? id)
    .join('、');
  w(
    `| ${index + 1} | \`${major.id}\` | ${major.name} | ${major.category} | ${major.subjectRequirement} | ${careerNames} |  |`,
  );
});
w();
w('---');
w();
w('## 附：本稿生成来源');
w();
w('- 题目：`src/data/items/*.ts`');
w('- 职业库：`src/data/careers.ts`　专业库：`src/data/majors.ts`　学科库：`src/data/subjects.ts`');
w('- 常模：`src/data/norms.ts`　权重：`src/config/scoring.config.ts`');
w('- 模块元数据：`src/config/modules.ts`');
w('- 校验命令：`npm run validate`（当前应为「错误 0 项」）');
w();

const target = resolve(dirname(fileURLToPath(import.meta.url)), '../docs/数据校对稿.md');
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, lines.join('\n'), 'utf-8');
console.log(`已生成校对稿 → docs/数据校对稿.md（${lines.length} 行）`);
