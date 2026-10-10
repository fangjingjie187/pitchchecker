import {
  APP,
  CRISIS_HINT,
  DISCLAIMER,
  RESEARCH_CONTEXT,
  SUBJECT_REQUIREMENT_NOTE,
  SUBJECT_REQUIREMENT_SOURCE,
  WARMUP_NORM_NOTE,
} from '@/config/app.config';
import { lazy, Suspense } from 'react';
import { MODULES } from '@/config/modules';
import { Card, SectionTitle } from '@/components/ui/Card';
import { Accordion } from '@/components/ui/Accordion';
import { PageTransition } from '@/components/layout/PageTransition';

// 按需加载：心理测量学仪表盘依赖 sampleResponses.json（约 287KB），不进主包
const PsychometricsDashboard = lazy(
  () => import('@/components/report/PsychometricsDashboard'),
);

const LIMITATIONS = [
  ...DISCLAIMER,
  '内置常模为演示用参考区间，非标准化全国常模，百分等级仅用于粗略定位。',
  '单次作答受当时心情与状态影响，建议间隔一段时间重测后再看变化。',
  '职业与专业信息基于公开资料整理，政策与就业情况会随时间变化，重要决策请以官方最新信息为准。',
  `专业选科要求为通用描述，${SUBJECT_REQUIREMENT_NOTE}临床医学、药学等"必选物理+化学"的表述依据${SUBJECT_REQUIREMENT_SOURCE}。`,
];

const FRAMEWORK = [
  { label: '顶层 · 元认知', body: '生涯适应力（4C）、决策风格、反思与叙事' },
  { label: '中层 · 决策技能', body: 'CASVE 循环五步引导：沟通、分析、综合、评估、执行' },
  { label: '底层 · 自我知识', body: '兴趣（RIASEC）、能力自我效能（SCCT）、工作价值观（Super WVI）' },
  { label: '底层 · 职业知识', body: '职业库、专业库、学科—选科—专业—职业路径' },
];

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="container-page max-w-3xl">
        <SectionTitle
          eyebrow="理论与伦理"
          title="这个工具是怎么来的"
          description={`${APP.name} 的模块划分直接对应认知信息加工（CIP）理论金字塔，每个模块都有明确的心理学依据。`}
        />

        <Card className="mb-6">
          <h3 className="text-base font-semibold">理论骨架：CIP 金字塔</h3>
          <ul className="mt-3 space-y-3">
            {FRAMEWORK.map((row) => (
              <li key={row.label} className="rounded-xl bg-mist p-3">
                <p className="text-sm font-semibold text-ink-800">{row.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{row.body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">
            参考：Sampson, Peterson, Lenz & Reardon 的认知信息加工（CIP）理论。
          </p>
        </Card>

        <h3 className="mb-3 text-base font-semibold">各模块的理论依据</h3>
        <div className="space-y-3">
          {MODULES.filter((m) => m.enabled).map((meta) => (
            <Accordion key={meta.key} title={meta.title} subtitle={meta.theory}>
              <p className="text-sm leading-relaxed text-ink-600">{meta.theorySource}</p>
              <p className="mt-2 text-xs text-muted">
                {meta.itemCount} 题 · {meta.dimensions.length} 个维度 · 约 {meta.estimatedMinutes} 分钟
              </p>
            </Accordion>
          ))}
        </div>

        <Card className="mt-6">
          <h3 className="text-base font-semibold">暖场三滑条的设计依据</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-600">
            三个滑条对应职业未决研究中常用的三个构念：
            <strong>定向清晰度</strong>（我现在有多清楚自己想要什么）、
            <strong>情感舒适</strong>（我对这件事有多担心，负向构念）、
            <strong>职业信息充足度</strong>（我对职业与专业了解得够不够）。
            前两者来自职业未决的双维结构传统，第三个直接对应"不清楚所选科目以后能做什么"这一常见困扰。
          </p>
          <p className="mt-2 text-xs text-muted">
            设计依据：借鉴 Holland 等职业决策量表 MVS（1980）的构念框架（VI 定向清晰度 / OI
            职业信息需求 / Barriers 障碍感知），并参考胡洁（2007）高中生职业决策因素量表改编版的表述方式。
            本模块条目为自编 / 改编的演示版本，不是标准化量表。
          </p>
          <p className="mt-2 rounded-lg bg-brand-50 p-3 text-xs leading-relaxed text-brand-800">
            常模脚注：{WARMUP_NORM_NOTE}
          </p>
        </Card>

        <Card className="mt-6">
          <h3 className="text-base font-semibold">前期调研</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-600">
            {RESEARCH_CONTEXT.year} 年，我们使用{RESEARCH_CONTEXT.instrument}对
            {RESEARCH_CONTEXT.description.split('，')[0]}做过一次实地调研，
            有效样本 n = {RESEARCH_CONTEXT.n}
            （男 {RESEARCH_CONTEXT.male} / 女 {RESEARCH_CONTEXT.female}）。
            调研中"不清楚所选科目以后可以从事哪些职业""所选科目就业方向不明确"是突出的未决原因，
            这也是本产品把学科—选科—专业—职业路径做成报告核心模块的原因。
          </p>
          <p className="mt-2 text-xs text-muted">样本描述：{RESEARCH_CONTEXT.description}</p>
        </Card>

        <Card className="mt-6">
          <h3 className="text-base font-semibold">局限性与使用说明</h3>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-600">
            {LIMITATIONS.map((line) => (
              <li key={line} className="flex gap-2">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral-400" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-xl bg-coral-50 p-3 text-xs leading-relaxed text-coral-800">
            {CRISIS_HINT}
          </div>
        </Card>

        <Suspense
          fallback={
            <Card className="mt-6">
              <p className="text-sm text-muted">心理测量学仪表盘加载中…</p>
            </Card>
          }
        >
          <PsychometricsDashboard />
        </Suspense>
      </div>
    </PageTransition>
  );
}
