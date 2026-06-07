# Contributing to 42-research

Thank you for considering a contribution. This is not an ordinary code repository — it is a **reproducible, traceable, peer-reviewable** technical research project. The core of contributing is not "writing code," but **producing conclusions that hold up to verification using rigorous methods**.

> Before you start, please read [`docs/methodology/RESEARCH_METHODOLOGY.md`](docs/methodology/RESEARCH_METHODOLOGY.md) and the ADRs under [`docs/decisions/`](docs/decisions/). They are the constitution of this project.

---

## Types of contribution

| Type | Description | Where |
| --- | --- | --- |
| **New research topic** | Propose and complete a topic in depth | `research/topics/<NN>-<slug>/` |
| **Fix / strengthen a topic** | Add citations, correct stale facts, add counter-examples | The topic's directory |
| **Methodology improvement** | Improve the research standards themselves | `docs/methodology/` + a new ADR |
| **Website / tooling** | Improve the site or build tooling | `web/` · `.claude/skills/` |

> The full research loop is covered by three skills under `.claude/skills/`: `research-methodology` (how to research) → `research-artifact-html` (crystallize into an artifact) → `publish-research-topic` (publish to the site).

---

## Research topic workflow

Every topic walks the full six-stage lifecycle (the current stage is recorded in the artifact's JSON-LD `researchStatus`):

```
1. hypothesis   State a hypothesis and define falsifiable criteria
2. survey       Gather from multiple sources (official docs / primary data / community practice)
3. experiment   Reproducible measurement (benchmarks / cost models / deployment), with environment and commands recorded
4. verify       Adversarial verification: actively seek counter-examples, challenge your own conclusion
5. synthesize   Synthesize into a conclusion with a decision matrix and applicability boundaries
6. publish      Produce a self-contained HTML artifact; metadata can be indexed in D1
```

### 1. Generate the artifact with the skill

The project provides the `research-artifact-html` skill (see `.claude/skills/research-artifact-html/`). It implements the ADR-001 artifact spec — **each topic is one self-contained semantic HTML file**:

- The `<head>` embeds `schema.org/ScholarlyArticle` JSON-LD (hypothesis / conclusion / keywords / citation[] / researchStatus)
- The `<body>` is richly formatted, readable prose (tabs / collapsibles / decision matrix / responsive)
- CSS is inlined, with zero external dependencies (self-contained)

The artifact goes in `research/topics/<NN>-<slug>/index.html`; raw citation material goes in `sources.md` in the same directory.

### 2. Citations must be tiered

Each citation is recorded in `sources.md` and in the JSON-LD `citation[]`, annotated with its `tier`:

```yaml
- url: https://...
  title: Title
  author: Author / organization
  date: Source publication date
  accessed: YYYY-MM-DD     # the date you verified it
  verified: true           # independently verified?
  claim: The specific claim it supports
  tier: primary | secondary # primary (official / raw data) vs secondary (blog / paraphrase)
```

**Core conclusions must be backed by a primary source.** On a primary-vs-secondary conflict, primary wins, and the conflict is recorded.

### 3. Adversarial verification is not optional

Before `synthesize`, challenge each core conclusion:

- Are there counter-examples or boundary conditions?
- Is the data biased (vendor self-benchmark vs independent test)?
- Is correlation being confused with causation?
- Does the conclusion depend on a fast-changing fact (time-sensitivity)?

You are encouraged to dispatch multiple skeptics in parallel to independently attempt a rebuttal; if a majority refute it, the conclusion does not stand.

---

## Definition of done

Before a PR is merged, self-check against the list:

- [ ] Hypothesis is explicit and falsifiable
- [ ] Every factual claim has ≥1 verified citation (core claims need a primary source)
- [ ] Experiment is reproducible (environment, commands, versions recorded)
- [ ] Adversarial verification done, with counter-examples and boundaries recorded
- [ ] Conclusion includes a decision matrix and applicability boundaries
- [ ] HTML artifact is self-contained, with complete JSON-LD, responsive
- [ ] No unverified "I heard that…" assertions
- [ ] The validation script passes:
      `uv run .claude/skills/research-artifact-html/scripts/validate_artifact.py <path>`

---

## Local development

```bash
# Validate an HTML artifact
uv run .claude/skills/research-artifact-html/scripts/validate_artifact.py \
  research/topics/01-vibecoding-cloudflare-vs-vercel/index.html

# The website (TanStack Start + Cloudflare Workers)
pnpm -C web install
pnpm -C web dev        # local preview on :8042
pnpm -C web build      # build check
```

> The repo uses `pnpm` (Node) and `uv` (Python). A published topic's HTML copy must be synced to `web/public/topics/<NN>-<slug>/`; the detail page extracts its body and renders it server-side ([ADR-003](docs/decisions/ADR-003-ssr-detail-over-iframe.md)). The full publish flow is covered by the `publish-research-topic` skill.

---

## Branch strategy

We use a `dev → main` two-branch workflow:

| Branch | Role | Rule |
| --- | --- | --- |
| `main` | Stable release branch | Protected; accepts only release PRs from `dev`; always deployable |
| `dev` | Integration branch | Day-to-day contributions land here; CI must pass |

Workflow:

```
Branch from dev   →  feat/xxx · fix/xxx · docs/xxx
       ↓ develop + self-check
PR into dev       →  CI (tsc / test / build + artifact quality gate) must be green
       ↓ review + merge
After enough changes  →  dev PR into main for a release
```

- Branch names follow conventional-commit prefixes: `feat/` `fix/` `docs/` `chore/`.
- **Do not commit or PR directly to `main`** (except for releases).

## Commit conventions

- Keep messages concise, **in English**, explaining the "why". No auto-generated signature lines.
- One logical change per commit, kept diffable and reviewable.
- Follow conventional commits: `feat(scope): ...` / `fix(scope): ...` / `docs: ...` / `chore: ...`.

---

## Conduct

Honesty over face: if you find your own conclusion was wrong, correct and record it. We value **conclusions that hold up to verification**, not assertions that merely sound right. See the [Code of Conduct](CODE_OF_CONDUCT.md).

License: [MIT](LICENSE). By contributing, you agree to license your contribution under the MIT License.

---

<details>
<summary>中文简介</summary>

这是一个**可复现、可溯源、可同行评审**的技术研究项目。贡献的核心不是"写代码"，而是用严谨方法产出经得起核实的结论。动手前请先读 [`docs/methodology/RESEARCH_METHODOLOGY.md`](docs/methodology/RESEARCH_METHODOLOGY.md)。

- 每个课题走完六阶段生命周期：hypothesis → survey → experiment → verify → synthesize → publish。
- 引用必须分级（一手优先），核心结论需一手来源支撑。
- synthesize 前必须做对抗验证，主动找反例。
- 分支策略 `dev → main`：日常贡献 PR 到 `dev`（CI 必过），release 时 `dev` PR 到 `main`。
- 提交信息用英文、conventional 风格、不含自动生成署名。

完整质量门见上方 Definition of done。许可证 [MIT](LICENSE)。

</details>
