# 42-research

[![CI](https://github.com/42-research-lab/42-research/actions/workflows/ci.yml/badge.svg)](https://github.com/42-research-lab/42-research/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-f6821f.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-3ecf8e.svg)](CONTRIBUTING.md)
[![Code of Conduct](https://img.shields.io/badge/Code%20of%20Conduct-Contributor%20Covenant-6b8cff.svg)](CODE_OF_CONDUCT.md)

> *"The Answer to the Ultimate Question of Life, the Universe, and Everything is 42."*
> — Douglas Adams, *The Hitchhiker's Guide to the Galaxy*

**Every question worth asking deserves a real answer.**

42-research investigates the technical questions people genuinely care about — yet rarely verify rigorously — and publishes answers that hold up to scrutiny. Every conclusion is **reproducible, traceable, and peer-reviewable**: it states the conditions under which it holds and links to clickable primary sources.

🌐 **Website:** https://42-research.pages.dev (English / 中文)

---

## What this is

A research project with two parts:

| Part | Contents | Path |
|------|----------|------|
| **Research archive** | Methodology, topic artifacts, decision records | `docs/` · `research/` |
| **Public website** | The site that publishes the research | `web/` |

Each research topic is published as a **self-contained, semantic HTML artifact** that embeds [schema.org/ScholarlyArticle](https://schema.org/ScholarlyArticle) JSON-LD (hypothesis, conclusion, citations, status). The artifact is the single source of truth; the website renders it and the metadata is indexed for query.

---

## How research is done

Every topic follows a six-stage lifecycle, with the current stage recorded in the artifact's JSON-LD:

```
hypothesis → survey → experiment → verify → synthesize → publish
```

The standards that make a conclusion publishable:

- **Fact-based, not from memory** — every claim is verified against official docs or primary data.
- **Don't echo, verify** — popular claims are tested independently; deviations are recorded honestly.
- **Falsifiable** — every conclusion states where it holds and where it does not.
- **Clickable citations** — every fact carries a URL, with verification date and status. Primary sources outweigh secondary ones.
- **Adversarial verification** — before synthesizing, each conclusion is challenged for counter-examples, bias, and time-sensitivity.

Full methodology: [`docs/methodology/RESEARCH_METHODOLOGY.md`](docs/methodology/RESEARCH_METHODOLOGY.md).

---

## Discoverability

The site is friendly to search engines, AI agents, and feed readers:

| Endpoint | Format | Purpose |
|----------|--------|---------|
| `/research/{slug}` | HTML (SSR) | Human-readable article |
| `/research/{slug}.md` | Markdown + YAML frontmatter | Direct consumption by AI agents / MCP |
| `/rss.xml` | RSS 2.0 | Feed readers and aggregators |
| `/sitemap.xml` | XML sitemap | Search-engine and crawler indexing |
| `/llms.txt` | Markdown ([llmstxt.org](https://llmstxt.org)) | Site map for LLMs / AI agents |
| `/robots.txt` | Dynamic | Allows major AI crawlers, declares the sitemap |

All HTML pages carry schema.org JSON-LD; the default language is English with Chinese available. See [ADR-004](docs/decisions/ADR-004-dual-format-and-llm-seo.md).

---

## Tech stack

TanStack Start · React 19 · TypeScript · Tailwind CSS · Cloudflare Workers / D1 / R2.

---

## Repository layout

```
42-research/
├── docs/
│   ├── decisions/      # Architecture decision records (ADR)
│   └── methodology/    # Research methodology
├── research/
│   ├── topics/<NN>-<slug>/   # Each topic: index.html (artifact) + sources.md
│   └── _templates/          # Topic HTML template (with JSON-LD)
└── web/                # TanStack Start + Cloudflare website
```

## Decision records

| # | Decision |
|---|----------|
| [001](docs/decisions/ADR-001-html-as-source-d1-as-index.md) | HTML artifact as the source of truth, D1 as the query index |
| [002](docs/decisions/ADR-002-frontend-stack-resources.md) | Frontend stack and resources |
| [003](docs/decisions/ADR-003-ssr-detail-over-iframe.md) | SSR detail page instead of iframe |
| [004](docs/decisions/ADR-004-dual-format-and-llm-seo.md) | Dual-format publishing + LLM-SEO |
| [005](docs/decisions/ADR-005-open-source-governance-and-branching.md) | Open-source governance + dev → main branching |

---

## Contributing

Contributions are welcome — the goal is **verifiable conclusions, not just code**. You can propose a topic or complete a study following the methodology. See [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md).

The repository uses a `dev → main` branch workflow: contributions land on `dev` via PR (CI must pass), and `main` stays release-ready.

---

## License

[MIT](LICENSE) © 2026 42-research-lab and contributors.

---

<details>
<summary>中文简介</summary>

**每一个值得好奇的问题，都值得被好好回答。**

42-research 研究技术与科技领域里大家真正关心、却少有人认真求证的问题，并发布经得起核实的答案。每个结论都**可复现、可溯源、可同行评审**：说明在什么条件下成立，并附可点击的一手来源。

- 研究遵循六阶段生命周期：hypothesis → survey → experiment → verify → synthesize → publish。
- 每个课题发布为自包含语义化 HTML 产物，内嵌 schema.org/ScholarlyArticle 的 JSON-LD。
- 网站默认英文，提供中文；对搜索引擎与 AI Agent 全栈友好（`.md` / RSS / sitemap / llms.txt）。
- 方法论见 [`docs/methodology/RESEARCH_METHODOLOGY.md`](docs/methodology/RESEARCH_METHODOLOGY.md)，参与方式见 [CONTRIBUTING.md](CONTRIBUTING.md)。

</details>
