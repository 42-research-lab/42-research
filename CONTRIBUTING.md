# 贡献指南 · Contributing to 42-research

感谢你考虑为 **42-research** 做贡献。这不是一个普通的代码仓库——它是一个
**可复现、可溯源、可同行评审**的技术研究项目。贡献的核心不是"写代码"，而是
**用严谨的方法产出经得起核实的结论**。

> 在动手前，请先读 [`docs/methodology/RESEARCH_METHODOLOGY.md`](docs/methodology/RESEARCH_METHODOLOGY.md)
> 与 [`docs/decisions/`](docs/decisions/) 下的 ADR。它们是本项目的宪法。

---

## 贡献类型

| 类型 | 说明 | 入口 |
| --- | --- | --- |
| **新研究课题** | 提出并完成一个完整深度的课题 | `research/topics/<NN>-<slug>/` |
| **修正/补强已有课题** | 补充引用、纠正过时事实、增加反例 | 对应课题目录 |
| **方法论改进** | 改进研究标准本身 | `docs/methodology/` + 新 ADR |
| **网站/工具** | 改进展示站点或构建工具 | `web/` · `.claude/skills/` |

> 完整的 research loop 由三个 skill 串起：`research-methodology`（怎么研究）→
> `research-artifact-html`（结晶为产物）→ `publish-research-topic`（上站发布），
> 均在 `.claude/skills/` 下。

---

## 研究课题贡献流程

每个课题必须走完 6 阶段生命周期（状态记录在 HTML 产物的 JSON-LD `researchStatus`）：

```
1. hypothesis   提出假设 + 定义可证伪的判据
2. survey       多源采集 (官方文档 / 一手数据 / 社区实践)
3. experiment   可复现实测 (基准 / 成本模型 / 部署)，记录环境与命令
4. verify       对抗验证：主动找反例，质疑自己
5. synthesize   综合成结论 + 决策矩阵 + 适用边界
6. publish      产出自包含 HTML，元数据可入 D1
```

### 1. 用 skill 生成产物

本项目提供 `research-artifact-html` skill（见 `.claude/skills/research-artifact-html/`）。
它落地 ADR-001 的产物规范——**每个课题 = 一个自包含语义化 HTML**：

- `<head>` 内嵌 `schema.org/ScholarlyArticle` 的 JSON-LD（hypothesis / conclusion /
  keywords / citation[] / researchStatus）
- `<body>` 是富排版可读正文（tab / 折叠 / 决策矩阵 / 响应式）
- CSS 内联，零外部依赖（自包含）

产物落在 `research/topics/<NN>-<slug>/index.html`，原始引用素材落在同目录
`sources.md`。

### 2. 引用必须分级

每条引用在 `sources.md` 与 JSON-LD `citation[]` 中记录，并标 `tier`：

```yaml
- url: https://...
  title: 标题
  author: 作者/机构
  date: 来源发布日期
  accessed: YYYY-MM-DD     # 你核实的日期
  verified: true            # 是否独立核实
  claim: 它支撑的具体声明
  tier: primary | secondary # 一手(官方/原始数据) vs 二手(博客/转述)
```

**核心结论必须有一手来源支撑。** 一手与二手冲突时以一手为准，并记录冲突。

### 3. 对抗验证不可跳过

`synthesize` 前，对每个核心结论主动追问：

- 是否有反例 / 边界条件？
- 数据是否有偏（厂商自测 vs 独立测试）？
- 是否混淆了相关性与因果性？
- 结论是否依赖某个快速变化的事实（时效性）？

鼓励并行派多个 skeptic 独立尝试推翻结论；多数推翻则结论不成立。

---

## 质量门（Definition of Done）

PR 合并前，对照 checklist 自检：

- [ ] 假设明确且可证伪
- [ ] 每个事实声明有 ≥1 个核实引用（核心声明需一手来源）
- [ ] 实验可复现（环境、命令、版本已记录）
- [ ] 已做对抗验证，记录了反例与边界
- [ ] 结论含决策矩阵与适用边界
- [ ] HTML 产物自包含、含完整 JSON-LD、响应式
- [ ] 无未核实的「听说」式断言
- [ ] 运行校验脚本通过：
      `uv run .claude/skills/research-artifact-html/scripts/validate_artifact.py <path>`

---

## 本地开发

```bash
# 校验某个 HTML 产物
uv run .claude/skills/research-artifact-html/scripts/validate_artifact.py \
  research/topics/01-vibecoding-cloudflare-vs-vercel/index.html

# 展示站点（TanStack Start + Cloudflare Workers）
pnpm -C web install
pnpm -C web dev        # 本地预览
pnpm -C web build      # 构建验证
```

> 说明：仓库用 `pnpm`（Node）与 `uv`（Python）。已发布课题的 HTML 副本需同步到
> `web/public/topics/<NN>-<slug>/`，详情页在服务端提取其正文做 SSR 渲染（[ADR-003](docs/decisions/ADR-003-ssr-detail-over-iframe.md)）。
> 发布全流程见 `publish-research-topic` skill。

---

## 分支策略

采用 `dev → main` 双分支迭代：

| 分支 | 角色 | 规则 |
| --- | --- | --- |
| `main` | 稳定发布分支 | 受保护，只接受来自 `dev` 的 release PR；始终可部署 |
| `dev` | 集成分支 | 日常贡献汇入此分支；CI 必须通过 |

贡献流程：

```
从 dev 切功能分支  →  feat/xxx · fix/xxx · docs/xxx
       ↓ 开发 + 自检
PR 到 dev          →  CI(tsc/test/build + 产物质量门) 必须绿
       ↓ 评审合并
积累若干改动后      →  dev PR 到 main 完成一次 release
```

- 功能分支命名对齐 conventional commits 前缀：`feat/` `fix/` `docs/` `chore/`。
- **不要直接向 `main` 提交或发 PR**（release 除外）。

## 提交规范

- 提交信息简洁、用中文、说明「为什么」，不含自动生成的署名行。
- 一次提交对应一个逻辑变更，保持可 diff、可评审。
- 遵循 conventional commits：`feat(scope): ...` / `fix(scope): ...` / `docs: ...` / `chore: ...`。

---

## 行为准则

诚实优先于面子（Linus 精神）：发现自己的结论错了，如实纠正并记录。
我们重视**经得起核实的结论**，而不是听起来正确的断言。

许可证：[MIT](LICENSE)。贡献即表示你同意以 MIT 授权你的贡献。
