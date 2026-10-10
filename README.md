# 生涯罗盘 · Career Compass

面向 **12–18 岁青少年（县域高中场景）** 的生涯探索与自我认知测评 Web 应用，纯前端实现、可静态部署，用于应用心理学专业赛事参赛演示。

> 核心主张：不是"算命式职业匹配"，而是基于经典生涯理论的 **自我知识建构 + 决策能力训练 + 可执行行动计划** 闭环。

---

## 技术栈

React 18 · TypeScript 5（strict）· Vite 5 · Tailwind CSS 3.4 · ECharts 5 · React Router（HashRouter）· Vitest

纯前端，无后端；数据以 localStorage 本地持久化，**不上传任何身份信息**。

---

## 本地运行（复现）

```bash
# 1. 安装依赖（Node ≥ 18）
npm install

# 2. 开发（HMR，改文案即时可见）
npm run dev

# 3. 类型检查
npm run typecheck

# 4. 单元测试
npm run test

# 5. 生产构建（产出 dist/ 纯静态文件）
npm run build

# 6. 本地预览构建产物
npm run preview
```

`npm run build` = `tsc --noEmit && vite build`，产物在 `dist/`。`vite.config.ts` 已设 `base: './'`，路由为 **HashRouter**，因此 `dist/` 可放到任意静态托管（Vercel / Netlify / GitHub Pages / 腾讯云静态网站 / `npx serve dist`），无需服务端路由 fallback，深链可直接访问。

---

## 数据校对入口（重点）

所有可替换的"内容"都集中在 `src/data/`，与逻辑完全分离（`data/` 内只有 `export const`，零函数零条件逻辑）。

| 你要校对什么 | 看哪里 |
|---|---|
| 78 题全文（含维度/计分方向/配对标记） | `src/data/items/*.ts` |
| 60 条职业库全字段 | `src/data/careers.ts` |
| 54 条专业库（选科要求） | `src/data/majors.ts` |
| 12 门学科库 | `src/data/subjects.ts` |
| 维度定义 / 演示常模 / 解释文案 / 行动建议 / 叙事模板 | `src/data/*.ts` |
| **一键生成 Word 批注友好的校对稿** | `npm run review` → `docs/数据校对稿.md` |
| 心理测量学结果表（供设计报告引用） | `npm run psychometrics` → `docs/心理测量学结果表.md` |

改完数据后，务必运行 `npm run validate` 确认无断链/无覆盖缺口，再 `npm run review` 同步校对稿。

---

## 数据 / 校验命令

| 命令 | 作用 |
|---|---|
| `npm run validate` | 数据完整性校验：题量、维度覆盖、反向题越界、pairId 配对、职业 Holland 码、abilityDemand 六维、majorIds/valueSupply 断链、常模/解释/行动建议覆盖 |
| `npm run review` | 生成 `docs/数据校对稿.md`（78 题 + 60 职业 + 常模 + 迫选映射） |
| `npm run sample` | 用种子随机脚本离线生成 `src/data/sampleResponses.json`（200 份模拟作答） |
| `npm run psychometrics` | 计算 Cronbach α + 兴趣相关矩阵，导出 `docs/心理测量学结果表.md` |
| `npm run test` | Vitest 单测（领域层纯函数 + 数据契约） |

> **预期提示（非缺陷）**：`npm run validate` 会常驻一条「配对题清单」提示——它列出当前保留的 3 对近义改写配对题（`I-R-01↔02`、`AD-confidence-01↔02`、`PT-stability-01↔02`）供校对，属预期行为，评审时请勿误读为缺陷。

---

## 演示模式与一键填充

测评大厅底部有「演示模式」开关，打开后可按**人设一键填充全部作答**并生成报告，用于现场演示与截图：

| 人设 | 说明 |
|---|---|
| `p-undecided`（默认） | 县中高一学生·还没想好选科：兴趣分化度低、科目—职业关联认知不足、有一定担心 |
| `p-sci-tech` | 科创少年：I/R 高、A/S 低 |
| `p-art` | 爱创作的女生：A 高 |
| `p-helper` | 喜欢帮人的班长：S/E 高 |

人设定义见 `src/data/demoPersonas.ts`，填充逻辑见 `src/domain/personaFiller.ts`（纯函数，可复现）。

---

## 功能说明

- **结果分享码**：已实现并**已部署启用**（v1.0.2）。`src/utils/shareCode.ts`（编解码 + 校验位）与 `src/utils/reportShare.ts`（载荷映射）均含单测，`ReportToolbar` 已恢复「生成分享码」按钮与复制 Modal。线上地址见下方「部署」。
- 说明：分享码在「可公开访问」的环境下才能实现跨设备还原。若线上站点启用了访问限制（如 EdgeOne Pages 预览域名的签名 token），需在控制台开启公开访问或绑定自定义域名后，分享码还原功能才会对访客完全生效。

---

## 部署

- **平台**：EdgeOne Pages（EdgeOne Makers），纯静态托管，`vite build` 产物 `dist/` 直接上传。
- **线上域名**：`https://career-compass-pcxjjusa.edgeone.cool`
- **控制台**：`https://console.cloud.tencent.com/edgeone/pages/project/makers-ovy31x9wq9pm`
- 部署命令（登录后）：

```bash
npm run build
npx edgeone makers deploy dist --name career-compass --env production
```

> 访问说明：EdgeOne Pages 默认域名 `*.edgeone.cool` 在中国大陆网络下**不能直接访问**（返回 401），须使用「预览链接」（控制台项目概览右上角「预览」按钮，或每次 `deploy` 返回的 `?eo_token=` 链接，**3 小时有效**）。要获得长期公开链接，需绑定**自定义域名**（面向大陆需备案域名；面向海外可选「全球可用区（不含中国大陆）」则无需备案）。

---

## 如何确认当前版本

页面**底部页脚**固定显示版本号与构建时间，格式如 `生涯罗盘 v1.0.1 · 2026-10-10 14:33`。

- 若你看到的界面**没有**这条版本信息，说明打开的是旧版本的未刷新页面；
- 请按 `Ctrl + Shift + R`（Windows / Linux）或 `Cmd + Shift + R`（macOS）强制刷新，或关闭旧标签页后重新打开。

版本号来自 `package.json`，构建时间在 `vite build` 时注入（`vite.config.ts` 的 `define`），新旧版本一眼可辨。

---

## 测试规范（Playwright 复验必读）

- **用例间强制清空 localStorage**：每个用例开始前必须清空本机存储（推荐走页脚「清除本机全部数据」——直接 `localstorage-clear` + reload 会被应用 `beforeunload` 回写内存态而失效），杜绝演示填充残留污染判定。
- **跳转类测试必须断言目的地 UI 内容，不得只断言 URL**：SPA 内部导航不重挂载组件，URL 正确 ≠ 界面正确（C2 教训：URL 到达 `/assess/interest`，但界面残留上一模块的完成态）。跳转用例须断言目的地的题干预文本或界面状态。
- **「点击导航」与「goto」分开覆盖**：`goto` 是完整加载（组件重挂载、状态重新初始化），点按钮是 SPA 导航（组件复用、状态保留），两者行为可能不同，跳转链路需各覆盖一次。

---

## 目录结构导览

```
career-compass/
├─ index.html
├─ vite.config.ts / tailwind.config.js / tsconfig.json / vitest.config.ts
├─ scripts/                 # 数据工具（不参与运行时）
│  ├─ validate.ts           # 数据完整性校验
│  ├─ generateReviewDoc.ts  # 校对稿生成
│  ├─ generateSample.ts     # 模拟样本生成
│  └─ generatePsychometrics.ts  # 心理测量学结果导出
├─ docs/                    # 校对稿、结果表、演示脚本、截图
└─ src/
   ├─ config/               # 可调参数（站点/计分/主题/模块注册）
   ├─ data/                 # ★ 纯数据，校对主入口
   ├─ domain/               # 心理学算法（纯函数，单测覆盖）
   ├─ store/                # 状态 + localStorage 持久化
   ├─ hooks/                # useAssessment / useEcharts 等
   ├─ components/
   │  ├─ ui/                # 无业务基础件
   │  ├─ layout/            # AppShell / Header / Footer
   │  ├─ charts/            # ECharts 封装
   │  ├─ assessment/        # 作答流程
   │  └─ report/            # 报告区块
   ├─ pages/                # 10 个路由页
   ├─ types/                # 类型契约
   └─ utils/                # cn / id / 分享码 / 脱敏 / 导出
```

---

## 理论骨架

应用结构即理论结构，顶层采用 **CIP 认知信息加工理论金字塔**：

- **元认知层**：生涯适应力（Savickas 4C）、决策风格（Dinklage / GDMS 五风格）
- **决策技能层**：CASVE 循环（报告页五步引导 + 决策平衡单）
- **自我知识层**：兴趣（Holland RIASEC）、能力自我效能（Bandura / SCCT）、工作价值观（Super WVI）、人格（大五简版，P2）
- **职业知识层**：职业库（O*NET 内容模型本土化）、学科→选科→专业→职业路径
- **贯穿层**：Super 发展阶段（12–14 / 15–16 / 17–18 三段自适应）

详见 About 页「理论与伦理」与 `docs/演示脚本-*.md`。

---

## 伦理与合规

- 纯前端本地存储，**不采集/不上传学校、姓名等身份信息**；导出报告经脱敏拦截。
- 报告页脚固定免责声明 + 12355 青少年服务台温和提示（仅提示，不做判定）。
- About 页完整局限声明：条目为研究演示用自编/改编版本，未经标准化信效度检验；演示常模非全国常模。
