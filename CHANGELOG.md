# 更新日志

本项目按里程碑迭代，10 月 24 日为代码冻结线。版本 1.0.0 为参赛演示冻结版。

## v1.0.3（2026-10-14）

### 试测修复轮（6 人试测 · 5 份有效反馈）
- **T 组文案**：V-FC-01 题干/选项改写、V-achievement-01 改写、I-A-02 去否定式补语、价值观引导语补少年语境示例、完成小结与过渡文案"说人话"（warmup 小结点明「下一模块 + 用途」）
- **域名定性修正**：README 明确主域名 `favicon-37oj34y.maozi.io` 固定、快照域名才变，附 D1–D6 部署编号
- **fixed 元素审计**：`PageTransition` 的 `animate-fade-up` 去掉 transform 残留（改为纯 opacity），根除 PageTransition 内 fixed 元素被 transform 劫持的隐患
- **测试规范升级**：Modal 补 portal 可见性单测；README 固化 overlay/fixed 组件「视口内 bounding box + opacity」断言规范

## v1.0.2（2026-10-11）

- 分享码跨设备还原上线（`/share` 简版报告 + 还原页豁免知情同意门禁）
- 分享码 Modal 灰屏修复（createPortal 挂 body，脱离 PageTransition transform 祖先）

## v1.0.0（2026-10-10）

### M1 · 骨架
- Vite 5 + React 18 + TypeScript 5（strict）+ Tailwind 3.4 + HashRouter + Vitest 工程搭建
- 设计 token（青蓝 `#0EA5E9` + 珊瑚 `#FF6B4A`，单一浅色主题）
- 类型契约（题目 / 职业 / 报告 / 状态树 4 组）
- 存储层：版本化 localStorage + 迁移 + 防抖落盘 + 导出脱敏拦截
- UI 基础件 12 个、全流程 10 路由空壳、知情同意门禁、页脚一键清除数据

### M2 · 数据与算法
- `data/` 全量填充：78 题（7 模块）+ 60 条职业 + 54 专业 + 12 学科 + 维度定义 + 演示常模 + 解释文案 + 行动建议 + 叙事模板 + 演示人设
- 计分领域层纯函数 + 单测（Vitest）
- 数据校验器 `scripts/validate.ts`、校对稿生成 `scripts/generateReviewDoc.ts`、模拟样本 `scripts/generateSample.ts`

### M2.1 · 数据修正
- I-S-03 去除 E 型构念漂移；兴趣配对题收紧为 1 对近义改写；AD-concern-03 去双管枪；开放题不计分；c-doctor 按 O*NET 定稿为 SIC

### M3 · 测评流程
- 测评大厅（总进度 + 快速模式 + 模块卡片 + 演示模式）
- 作答页（键盘 1–5、能力 0–100 十档滑条、自动跳题、中断续答、模块即时小结）
- 作答有效性检验（直线作答 / 作答过快 / 配对不一致 / 区分度不足，阈值可调）
- 演示一键填充（4 人设）

### M4 · 报告与可视化
- 报告 10 区块 + 8 类 ECharts 图表（六边形 / 雷达 / 条形 / 四象限 / 价值观 / 仪表盘 / 桑基 / 热力）
- 计分与匹配算法（Holland 衍生指数、Iachan、余弦、价值观加权）、四象限、学科→选科→专业→职业路径
- 低分化降级规则（均衡兴趣不渲染大字三码）、报告分享码、打印/PDF、CASVE 计算页

### M5 · 打磨（P0/P1）
- **P0**：打印样式收尾（免责 + 12355 + 选科脚注）、心理测量学仪表盘（Cronbach α + 相关矩阵，标注"模拟数据·方法演示"）、演示脚本两版
- **P1**：职业库浏览筛选页（行业×Holland×前景 + 搜索 + URL 筛选态）、成长档案（单次降级 / 多次雷达叠加 + Holland 时间轴）、无障碍收尾、主包瘦身（仪表盘 lazy 加载 −283KB）

### P2 · 取消
- 路由级代码分割边际收益趋零，冻结线前不引入回归风险，不执行。

---

## 待办 / 已知项

- `npm run validate` 的「配对题清单」提示为**预期行为**（列出当前保留的 3 对近义配对题供校对），非缺陷，见 README。
- `RESEARCH_CONTEXT.n` 等实测数据在 `src/config/app.config.ts` 集中维护。
