/**
 * 导出心理测量学结果表 → docs/心理测量学结果表.md
 *
 * 用途：把 About 页仪表盘的 Cronbach α 与兴趣相关矩阵落成文档，供设计报告直接引用。
 * 运行：npm run psychometrics
 *
 * 自查规则：α < 0.5 或为负属于"模拟参数问题"，应回头调整生成脚本
 * （scripts/generateSample.ts 的人设分布/噪声），而不是把异常值写进结果表。
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dimensionAlphas, interestCorrelation } from '../src/domain/psychometrics';

const MODULE_NAMES: Record<string, string> = {
  warmup: '暖场',
  interest: '兴趣',
  ability: '能力',
  value: '价值观',
  adaptability: '适应力',
  decision: '决策风格',
  personality: '人格',
};

const DIM_NAMES: Record<string, Record<string, string>> = {
  warmup: { clarity: '定向清晰度', comfort: '情感舒适', information: '职业信息充足度' },
  interest: { R: '现实型', I: '研究型', A: '艺术型', S: '社会型', E: '企业型', C: '常规型' },
  value: {
    achievement: '成就感',
    independence: '独立自主',
    altruism: '利他助人',
    creativity: '创造表达',
    intellectual: '智力激发',
    reward: '经济回报',
    security: '稳定保障',
    prestige: '声望认可',
    balance: '生活平衡',
    relationship: '人际氛围',
  },
  ability: {
    verbal: '言语表达',
    logic: '逻辑数理',
    spatial: '空间想象',
    handson: '动手操作',
    interpersonal: '人际沟通',
    creative: '创意想象',
  },
  adaptability: { concern: '关注', control: '控制', curiosity: '好奇', confidence: '信心' },
  decision: {
    rational: '理性型',
    intuitive: '直觉型',
    dependent: '依赖型',
    avoidant: '回避型',
    spontaneous: '即时型',
  },
  personality: {
    extraversion: '外向性',
    agreeableness: '宜人性',
    conscientiousness: '尽责性',
    stability: '情绪稳定性',
    openness: '开放性',
  },
};

function main(): void {
  const alphas = dimensionAlphas();
  const correlation = interestCorrelation();

  const lines: string[] = [];
  lines.push('# 心理测量学结果表（模拟数据）');
  lines.push('');
  lines.push(
    `> ⚠ 本文档由 \`scripts/generatePsychometrics.ts\` 生成（${new Date().toLocaleString('zh-CN')}）。`,
  );
  lines.push('> 数据源：src/data/sampleResponses.json（seed 20261009，n = 200，离线生成）。');
  lines.push('> **以上指标仅用于演示计算链路，不是本量表信效度的实证依据。**');
  lines.push('');

  lines.push('## 一、各维度 Cronbach α');
  lines.push('');
  lines.push('| 模块 | 维度 | α | 备注 |');
  lines.push('|---|---|---|---|');

  const issues: string[] = [];
  for (const [module, dims] of Object.entries(alphas)) {
    for (const [dim, alpha] of Object.entries(dims)) {
      const dimName = DIM_NAMES[module]?.[dim] ?? dim;
      if (alpha === null) {
        lines.push(`| ${MODULE_NAMES[module] ?? module} | ${dimName} | — | 单条目维度，不适用 α |`);
        continue;
      }
      let note = '';
      if (alpha < 0.5 || alpha < 0) {
        note = '⚠ 需调整生成脚本';
        issues.push(`${module}/${dim} α=${alpha.toFixed(2)}`);
      }
      lines.push(`| ${MODULE_NAMES[module] ?? module} | ${dimName} | ${alpha.toFixed(2)} | ${note} |`);
    }
  }
  lines.push('');

  lines.push('## 二、兴趣六型相关矩阵');
  lines.push('');
  lines.push('| 类型 | ' + correlation.dimensions.join(' | ') + ' |');
  lines.push('|' + '---|'.repeat(correlation.dimensions.length + 1));
  correlation.matrix.forEach((row, i) => {
    lines.push('| ' + correlation.dimensions[i] + ' | ' + row.map((value) => value.toFixed(2)).join(' | ') + ' |');
  });
  lines.push('');

  lines.push('## 三、自查结论');
  lines.push('');
  if (issues.length === 0) {
    lines.push('所有维度 α 均 ≥ 0.5（或为单条目不适用），无需调整生成脚本。');
  } else {
    lines.push('以下维度 α 异常，需调整 scripts/generateSample.ts 后重新生成：');
    for (const issue of issues) lines.push(`- ${issue}`);
  }
  lines.push('');

  const target = resolve(dirname(fileURLToPath(import.meta.url)), '../docs/心理测量学结果表.md');
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, lines.join('\n'), 'utf-8');
  console.log(`已导出 → docs/心理测量学结果表.md`);
  if (issues.length > 0) {
    console.log(`⚠ 存在 ${issues.length} 个异常维度：${issues.join('、')}`);
  } else {
    console.log('α 自查通过（无 < 0.5 或负值）。');
  }
}

void main();
