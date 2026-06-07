---
name: research-artifact-html
description: >-
  生成 42-research 项目的自包含语义化 HTML 研究产物(self-contained research artifact)。
  每个研究课题产出一个单文件 HTML,<head> 内嵌 schema.org/ScholarlyArticle 的 JSON-LD
  结构化元数据(假设/结论/标签/引用/方法论),<body> 是富排版可读正文(tab/折叠/决策矩阵/响应式)。
  该 HTML 同时是「真相源 + 展示页 + AI 可读数据」,构建时其 JSON-LD 被解析入 D1 作查询索引。
  Use this skill whenever you are writing up a research topic/finding/课题/结论 for 42-research,
  creating a new topic under research/topics/, turning a research report into a publishable
  artifact, or whenever the user mentions 研究产物/课题 HTML/research artifact/发布课题。
  本 skill 落地 ADR-001 的产物规范,确保每个课题可复现、可溯源、可同行评审。
---

# Research Artifact (HTML) · 自包含研究产物生成

## 为什么是 HTML(背景，帮助你做对的判断)

42-research 的架构决策 ADR-001 规定：研究产物用**自包含语义化 HTML**。这不是随意选择，
依据是 Thariq Shihipar（Claude Code 工程负责人）已核实的研究——人读的最终产物 HTML 优于
Markdown，因为单文件可自包含 layout/交互/样式，长文档也能撑住。而 research loop 内部
（agent 间传递、原始素材）仍用 Markdown。理解这个分工，你就知道：**终产物写 HTML，
过程素材写 Markdown**，不要搞反。

产物之所以"三位一体"：
- **真相源** — 它在 git 里，可 diff、可版本化、可同行评审。
- **展示页** — 它内联 CSS、零外部依赖，可直接在浏览器打开，也可进 R2。
- **AI 可读数据** — `<head>` 的 JSON-LD 让 LLM 和搜索引擎都能结构化理解。

D1 只存从 JSON-LD 派生的索引，**永远可从 HTML 全量重建**，所以 HTML 是唯一真相源。

### 产物下游会被怎么消费（影响你怎么写 body）

产物写完后不是直接给人看的——它有两个下游展示层，理解它们能让你做对的取舍：

- **SSR 详情页**（ADR-003）：`/research/{slug}` 在服务端把你产物的 `<body>` 正文提取出来，
  套站点的 `.prose-research` 排版重新渲染，让搜索引擎与 AI 爬虫能直接索引正文。
  **关键后果**：提取时会剥掉 `<style>`，所以你产物里的纯 CSS 交互（tab 切换、`<details>` 折叠）
  在详情页会**降级为静态展开**。因此正文结构要保证"全部展开也读得通"——
  别把关键信息藏在默认折叠、靠交互才能看到的地方。原始完整交互仍可经"查看原始产物"链接访问。
- **双格式发布**（ADR-004）：同一篇正文还会被转成 `/research/{slug}.md`（给 AI/Agent/LLM 读）。
  纯文本转换依赖语义化标签——**用真实的 `<h2>/<h3>/<ul>`，别用 `<div>` 模拟标题**，
  否则 `.md` 端点提取出的结构会塌掉。
  - **表格的特殊坑**：`.md` 转换器（`web/src/lib/markdown.ts` 的 `htmlToText`）**不处理 `<table>`**，
    单元格文字在 `.md` 里会糊成一坨、丢掉行列结构。所以**决策矩阵这类关键对比，除了用 `<table>`
    给人看，务必在表格前后用一两句话或 `<ul>` 把核心裁决再复述一遍**——保证 AI 读 `.md` 时
    也能拿到结论，不依赖表格结构。

一句话：正文既要在「剥样式后的 SSR 页」可读，也要在「转纯文本的 .md」可读。语义化 + 不依赖交互，两边都稳。

## 工作流

### 1. 确认课题已完成研究

产物是研究的**结晶**，不是研究本身。动手写 HTML 前，确认已有：假设、多源核实的事实、
对抗验证、结论。研究方法论见 `docs/methodology/RESEARCH_METHODOLOGY.md`。
原始引用应已记录在课题目录的 `sources.md`（Markdown，loop 素材）。

若研究尚未完成，先做研究——不要用产物模板倒逼出未经核实的结论。

### 2. 创建课题目录

课题**目录名**用 `NN-kebab-case` 形式（NN 为两位序号），保证排序与唯一性：

```
research/topics/NN-<slug>/
├── index.html      # 终产物(本 skill 生成)
└── sources.md      # 原始引用(loop 素材, Markdown)
```

**两个名字要分清，别搞混**（这是上站时最容易错的地方）：

| 概念 | 取值示例 | 用在哪 |
|------|---------|--------|
| **目录名 / `identifier`** | `01-vibecoding-cloudflare-vs-vercel` | 文件目录名、JSON-LD `identifier`（必须一致，校验脚本会查） |
| **公开 slug** | `vibecoding-cloudflare-vs-vercel`（去掉 `NN-` 前缀） | 网站 URL `/research/{slug}`、`topics.ts` 的 `slug` 字段 |

记忆口诀：**磁盘上带序号前缀（排序用），URL 上去前缀（干净好读）**。
JSON-LD 的 `identifier` 跟**目录名**，不是 slug——校验脚本 `validate_artifact.py` 会比对二者，不一致直接失败。

### 3. 从模板生成 HTML

复制 `assets/topic-template.html` 到 `research/topics/NN-<slug>/index.html`，替换占位符。
模板已含完整结构：JSON-LD 骨架、内联 CSS（暗色主题 + Cloudflare 橙强调色）、
tab 组件（纯 CSS）、决策矩阵表格、折叠的引用与局限区块、响应式断点。

**填充 JSON-LD（这是 D1 索引的真相源，必须有效且完整）：**

```json
{
  "@context": "https://schema.org",
  "@type": "ScholarlyArticle",
  "identifier": "NN-slug",          // 与目录名一致
  "headline": "课题标题",
  "abstract": "一句话摘要",
  "datePublished": "YYYY-MM-DD",
  "dateModified": "YYYY-MM-DD",
  "keywords": ["tag1", "tag2"],
  "researchStatus": "publish",      // 见下方生命周期
  "hypothesis": "可证伪的假设",
  "conclusion": "结论(含适用边界)",
  "citation": [
    { "@type": "CreativeWork", "url": "https://...", "name": "来源名",
      "tier": "primary", "verified": true, "accessed": "YYYY-MM-DD" }
  ]
}
```

`researchStatus` 取值（课题生命周期，见方法论）：
`hypothesis` → `survey` → `experiment` → `verify` → `synthesize` → `publish`。
只有走到 `publish` 才算发布。

### 4. 撰写正文(body)

正文要体现 research 的诚实，结构建议（按需增删，不要为凑结构而注水）：

- **假设卡片** — 开篇亮出可证伪的假设。
- **纠偏区块**（若适用）— 如果研究中发现流行说法不实/夸大，开篇就纠正它。
  这是 42-research 的灵魂：不附和，要谲证。用 `.warn-box` 卡片。
- **正文/对比** — 用 tab 组织多视角，用决策矩阵表格做结构化对比。
  事实声明就地标注来源分级 `<span class="tier primary">`。
- **对抗验证区块** — 主动列出"结论可能错在哪""反方场景"。诚实是可信度的来源。
- **结论卡片** — `.conclusion`，明确假设是否成立、在什么条件下成立。
- **引用折叠区** — 一手来源优先，标注 tier。
- **局限与存疑折叠区** — 如实写明 benchmark 是否独立验证、数据口径差异等。

### 5. 校验产物(质量门)

写完后运行校验脚本——它检查 JSON-LD 有效性、CSS 无非 ASCII 字符混入（中文输入法易混入
西里尔字母到颜色值）、必填字段齐全：

```bash
python3 .claude/skills/research-artifact-html/scripts/validate_artifact.py research/topics/NN-<slug>/index.html
```

校验通过 = 满足发布质量门。校验失败必须修复，不要带病发布——D1 索引依赖 JSON-LD 有效。

## 关键原则

- **JSON-LD 是真相源，D1 是派生**。不手改 D1，改 HTML 后重建索引。
- **一手来源 > 二手来源**。核心结论需一手支撑；benchmark 务必标注是否独立验证。
- **诚实高于动听**。对抗验证与局限区块不是可选项，它们是 research 可信度的根基。
- **自包含**。CSS 内联，不引外部样式表/JS，确保可独立打开、可进 R2、可被 AI 单文件理解。

## 写完产物之后 → 交棒发布

产物校验通过 ≠ 上站可访问。产物只是真相源，要让它出现在网站目录、被 SEO/AI 端点收录，
还需要一串发布动作（同步产物到 `web/public/`、抓封面、登记 `web/src/data/topics.ts`、
验证 5 个机器可读端点、跑 tsc/test/build）。**这些不在本 skill 范围**——
本 skill 只负责把研究**结晶为合格产物**。发布交给 `publish-research-topic` skill 端到端处理。

本 skill 在 research loop 中的位置：
`research-methodology`（怎么研究）→ **`research-artifact-html`（结晶为产物）** → `publish-research-topic`（上站发布）。

## 示例参考

课题一是完整范例，可直接参照其结构与质量：
`research/topics/01-vibecoding-cloudflare-vs-vercel/index.html`
