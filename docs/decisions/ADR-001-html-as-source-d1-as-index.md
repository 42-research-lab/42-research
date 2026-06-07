# ADR-001 · 三位一体研究产物架构：HTML 为真相源，D1 为查询索引

- **状态**: Accepted
- **日期**: 2026-06-06
- **决策者**: larrykoo711
- **相关**: 项目地基决策，影响所有后续课题产物
- **展示层注记**: 详情页由 iframe 改为 SSR 提取正文，见 [ADR-003](ADR-003-ssr-detail-over-iframe.md)（真相源不变）

## 背景 (Context)

42-research 需要一种研究产物的存储与展示形态，必须同时满足三个互相拉扯的需求：

1. **research 严谨性** — 可复现、可溯源、可同行评审（diff/版本历史）
2. **网站展示性能** — 快速筛选、搜索、排序、访问统计
3. **AI 可读性** — 产物本身能被 LLM 直接理解与处理（AI-native web 趋势）

## 已核实的事实依据 (Verified Evidence)

> 本项目是 research，所有架构声明必须基于核实的事实，不凭训练数据猜测。

1. **HTML 优于 Markdown（用于人读的最终产物）** — Thariq Shihipar（Claude Code 工程负责人）
   于 2026-05-09 发表《Using Claude Code: The Unreasonable Effectiveness of HTML》，
   核心论点："markdown is fine for the loop, but the final artifact a human reads is
   meaningfully better as HTML"。HTML 可在单文件内自包含 layout/交互/样式，支持 tab、
   目录、折叠、响应式，长文档（数百行）也能撑住。
   来源: https://claude.com/blog/using-claude-code-the-unreasonable-effectiveness-of-html

2. **VoidZero 加入 Cloudflare** — 2026-06-04 官宣，Evan You 带领 Vite/Vitest/Rolldown/Oxc
   团队进入 Cloudflare ETI，全部保持 MIT 开源，Cloudflare 投入 $1M 设立 Vite 生态基金。
   印证「AI-native web，产物本身既是数据又是界面」的趋势。
   来源: https://blog.cloudflare.com/voidzero-joins-cloudflare/

3. **D1 (SQLite) + R2 + Vite plugin 已 production-ready** — 所有 binding 类型
   (D1/R2/KV/Durable Objects/AI/Queues/Vectorize) 在 Vite plugin 下完整支持。
   来源: https://developers.cloudflare.com/workers/vite-plugin/

## 决策 (Decision)

采用**三位一体**架构，每种介质各司其职（呼应 Thariq 的 "HTML for the artifact, Markdown for the loop"）：

| 介质 | 职责 | 理由 |
|------|------|------|
| **自包含语义化 HTML** | 研究产物 = 真相源 + 展示页 + AI 可读数据 | 三位一体，零渲染损耗，人/AI 皆可读 |
| **D1 (SQLite)** | 查询索引 | 构建时解析 HTML 内 JSON-LD 入库，供筛选/搜索/排序/统计 |
| **git** | 过程留痕 | HTML 同样可 diff/版本化/同行评审 |
| **R2** | 资产存储 | 图表、附件、原始数据集等大文件 |
| **Markdown** | research loop 内部 agent 间传递 | 干净结构化文本，下游解析清爽 |

### 产物形态规范

每个课题 = 一个自包含 HTML 文件：

- `<head>` 内嵌 **JSON-LD** 结构化元数据：`@type: ScholarlyArticle`，含
  标题、假设(hypothesis)、结论(conclusion)、标签、引用(citation[])、日期、方法论。
- `<body>` 富排版可读正文：tab / 折叠 / 图表 / 响应式。
- 内联 CSS（自包含），不依赖外部样式表 → 可独立打开、可进 R2、可被 AI 单文件理解。

### 数据流

```
HTML 产物 (research/topics/<slug>/index.html)
   │ 构建时解析 <script type="application/ld+json">
   ├──> D1: topics 表 (slug, title, hypothesis, conclusion, tags, published_at, ...)
   │                citations 表 (topic_slug, url, title, verified)
   └──> git: 全量版本历史
```

## 后果 (Consequences)

### 正面
- 研究产物即展示页，无模板渲染中间层，符合 KISS
- JSON-LD 让产物对搜索引擎和 AI 同时友好（SEO + AI-native）
- D1 仅存可重建的索引 → 真相源永远是 git 里的 HTML，符合「single source of truth」
- 完全契合 Cloudflare + VoidZero 的技术趋势

### 负面 / 缓解
- **手写 HTML 比 Markdown 累** → 用 `research/_templates/topic.html` 模板 + 后续沉淀
  `research-artifact-html` skill 自动化生成，把成本降到最低。
- **D1 是派生数据，需保证与 HTML 一致** → 构建时全量重建（idempotent），不手改 D1。

## 被否决的方案 (Rejected Alternatives)

- **纯 D1**：研究过程无法版本化/diff/同行评审，违背 research 严谨性。
- **纯 Markdown**：放弃 HTML 的富交互与 AI-native 优势；且 Thariq 的研究表明
  人读的最终产物 HTML 更优。
- **重量知识库 (Obsidian/Notion)**：引入额外工具依赖，与 git/CI 集成更重。
