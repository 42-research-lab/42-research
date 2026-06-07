# 42-research

[![CI](https://github.com/42-research-lab/42-research/actions/workflows/ci.yml/badge.svg)](https://github.com/42-research-lab/42-research/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-f6821f.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-3ecf8e.svg)](CONTRIBUTING.md)
[![Code of Conduct](https://img.shields.io/badge/Code%20of%20Conduct-Contributor%20Covenant-6b8cff.svg)](CODE_OF_CONDUCT.md)

> *"The Answer to the Ultimate Question of Life, the Universe, and Everything is 42."*
> — Douglas Adams, *The Hitchhiker's Guide to the Galaxy*

一个**严谨、可复现、可同行评审**的技术研究项目，并将研究成果通过公开网站展示。

研究遵循 YC 最佳实践与第一性原理：每个结论都可溯源、每个声明都经核实、每个决策都有记录。

---

## 🧬 双子系统

| 子系统 | 内容 | 路径 |
|--------|------|------|
| **(A) 研究档案体系** | 方法论、课题产物、决策记录(ADR) | `docs/` `research/` |
| **(B) 公开展示网站** | TanStack Start + Cloudflare 全栈应用 | `web/` |

> 网站本身即课题一《Vibecoding + Cloudflare or Vercel?》的 **dogfooding 实证**。

---

## 🏛 核心架构：三位一体

详见 [ADR-001](docs/decisions/ADR-001-html-as-source-d1-as-index.md)。

```
研究产物 = 自包含语义化 HTML  (真相源 + 展示页 + AI可读数据)
   ├──> D1 (SQLite)   查询索引: 筛选/搜索/排序/统计
   ├──> git           过程留痕: diff/版本/同行评审
   └──> R2            资产存储: 图表/附件/数据集
```

**职责分工**（基于 Thariq Shihipar 已核实研究）：
- 人读的最终产物 → **HTML**（自包含、富交互）
- research loop 内 agent 间传递 → **Markdown**
- 结构化查询 → **D1** ｜ 过程与评审 → **git**

---

## 🛠 技术栈

| 层 | 选型 | 状态 |
|----|------|------|
| 框架 | TanStack Start (v1 RC) | API 稳定，feature-complete |
| 构建 | Vite (VoidZero → Cloudflare) | 趋势核心 |
| 运行时 | Cloudflare Workers | production |
| 数据库 | D1 (SQLite at edge) | production-ready |
| 对象存储 | R2 | production-ready |
| 语言 | TypeScript | — |
| 样式 | Tailwind CSS | — |

---

## 📂 目录结构

```
42-research/
├── docs/
│   ├── specs/            # 设计文档
│   ├── decisions/        # ADR 架构决策记录
│   └── methodology/      # 研究方法论
├── research/
│   ├── topics/<slug>/    # 各课题: index.html (产物) + sources.md (原始引用)
│   └── _templates/       # 课题 HTML 模板 (含 JSON-LD)
├── .claude/skills/       # 项目沉淀的可复用 Claude Code skills
├── web/                  # TanStack Start + Cloudflare 网站
└── README.md
```

---

## 📋 决策记录 (ADR)

| # | 决策 | 状态 |
|---|------|------|
| [001](docs/decisions/ADR-001-html-as-source-d1-as-index.md) | 三位一体架构：HTML 为真相源，D1 为查询索引 | Accepted |
| [002](docs/decisions/ADR-002-frontend-stack-resources.md) | 前端技术选型资源清单（RemixIcon / motion / three.js / cal-heatmap …） | Accepted |
| [003](docs/decisions/ADR-003-ssr-detail-over-iframe.md) | SSR 详情页替代 iframe（ADR-001 展示层注记） | Accepted |
| [004](docs/decisions/ADR-004-dual-format-and-llm-seo.md) | 双格式发布 + LLM-SEO 全栈可发现性策略 | Accepted |

---

## 🌐 可发现性 (Discoverability)

站点对 Google/Bing/AI Agent/MCP 全栈友好，提供以下端点：

| 端点 | 格式 | 用途 |
|------|------|------|
| `/rss.xml` | RSS 2.0 | Feed Reader、AI Aggregator 订阅所有已发布课题 |
| `/llms.txt` | Markdown（llmstxt.org） | LLM/AI Agent 一站式发现全部端点与内容 |
| `/research/{slug}.md` | Markdown + YAML frontmatter | AI Agent/MCP 直接消费单篇研究，含结构化元数据 |
| `/sitemap.xml` | XML Sitemap | Google/Bing 索引、AI 爬虫发现所有页面 |
| `/robots.txt` | 动态生成 | Allow 所有主流 AI 爬虫（GPTBot/ClaudeBot/Google-Extended 等），声明 Sitemap |

所有 HTML 页面含 schema.org JSON-LD（WebSite/ScholarlyArticle），canonical 在 `<link rel="canonical">`，全站 head 注入 RSS alternate link。详见 [ADR-004](docs/decisions/ADR-004-dual-format-and-llm-seo.md)。

---

## 🔬 研究课题

| # | 课题 | 状态 |
|---|------|------|
| [01](research/topics/01-vibecoding-cloudflare-vs-vercel/index.html) | Vibecoding + Cloudflare or Vercel? | ✅ 已发布 |

---

## 🧩 项目沉淀的 Skills

完整的 research loop 由三个 Claude Code skill 串起，覆盖「怎么研究 → 结晶为产物 → 上站发布」：

| Skill | 作用 |
|-------|------|
| [research-methodology](.claude/skills/research-methodology/SKILL.md) | 执行研究方法论：6 阶段生命周期 · 一手优先引用分级 · 对抗验证 · DoD 质量门 |
| [research-artifact-html](.claude/skills/research-artifact-html/SKILL.md) | 生成自包含语义化 HTML 研究产物（落地 ADR-001，含校验脚本） |
| [publish-research-topic](.claude/skills/publish-research-topic/SKILL.md) | 课题端到端上站：校验 · 抓封面 · 登记 · 验证 SEO/AI 端点 · 三道构建关 |

---

## 🔐 凭证管理

`.cloudflare.env` / `.ghcr.env` 含敏感凭证，**已 gitignore，绝不入库**。
部署所需的密钥通过 GitHub Actions Secrets 注入，不落仓库。

---

## 🤝 参与贡献

贡献的核心是**用严谨方法产出经得起核实的结论**，而非单纯写代码。完整流程
（6 阶段生命周期 · 引用分级 · 对抗验证 · 质量门）见 [CONTRIBUTING.md](CONTRIBUTING.md)。

新课题请用 `research-artifact-html` skill 生成自包含 HTML 产物，并通过校验脚本：

```bash
uv run .claude/skills/research-artifact-html/scripts/validate_artifact.py <path>
```

---

## 📄 许可证

本项目以 [MIT License](LICENSE) 开源，版权 © 2026 42-research-lab and contributors。

---

## 🧭 研究精神

> Linus 的诚实 · 尤雨溪的执着 · Musk 的第一性原理 · IronMan 的极客精神

不附和未经核实的说法。例如：课题立项时核实到「TanStack Start 彻底打败 Next.js」
是**夸大**——事实是它处于 v1 RC、快速崛起但远未"彻底打败"。research 如实记录，
而非附和。这正是本项目的严谨性所在。
