<div align="center">

# 42·Research

[![CI](https://github.com/42-research-lab/42-research/actions/workflows/ci.yml/badge.svg)](https://github.com/42-research-lab/42-research/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-f6821f.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-3ecf8e.svg)](CONTRIBUTING.md)

**Every question worth asking deserves a real answer.**

Reproducible, traceable, peer-reviewable research into the technical questions people actually care about.

[**Website →**](https://42r.larrykoo.com) · [Methodology](docs/methodology/RESEARCH_METHODOLOGY.md) · [Contributing](CONTRIBUTING.md)

</div>

---

Each topic ships as a self-contained semantic HTML artifact with embedded [schema.org/ScholarlyArticle](https://schema.org/ScholarlyArticle) JSON-LD, and is held to one bar: every conclusion states the conditions under which it holds and links to clickable primary sources. The artifact is the single source of truth; the website renders it for humans and exposes it to machines (`/research/{slug}.md`, RSS, sitemap, `llms.txt`).

The site is bilingual (English / 中文, English by default).

## Contributing

The goal is verifiable conclusions, not just code. See the [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md). We use a `dev → main` workflow — PRs land on `dev`, and `main` stays release-ready ([ADR-005](docs/decisions/ADR-005-open-source-governance-and-branching.md)).

## License

[MIT](LICENSE) © 2026 42-research-lab and contributors.

<details>
<summary>中文</summary>

**每一个值得好奇的问题，都值得被好好回答。**

42·Research 研究技术与科技领域里大家真正关心的问题，并发布可复现、可溯源、可同行评审的答案。每个课题以自包含语义化 HTML 产物发布，内嵌 schema.org/ScholarlyArticle 的 JSON-LD；每个结论都说明在什么条件下成立、附可点击的一手来源。

网站默认英文、提供中文：[42r.larrykoo.com](https://42r.larrykoo.com)。参与方式见 [CONTRIBUTING.md](CONTRIBUTING.md)，方法论见 [docs/methodology](docs/methodology/RESEARCH_METHODOLOGY.md)。

</details>
