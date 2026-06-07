---
name: research-methodology
description: >-
  执行 42-research 课题研究的方法论流程(research methodology execution)。把一个「我们好奇的问题」
  推进为可复现、可溯源、可同行评审的研究：6 阶段生命周期(hypothesis→survey→experiment→verify
  →synthesize→publish)、多源核实与一手优先的引用分级、对抗验证(并行 skeptic 推翻结论)、
  以及发布前的 Definition of Done 质量门。
  Use this skill whenever you start researching a new topic/课题/问题 for 42-research, are gathering
  and verifying sources, doing experiments/benchmarks, doing adversarial verification on a conclusion,
  recording sources.md, or whenever the user mentions 做研究/研究方法/对抗验证/求证/核实/课题立项/溯源。
  这是 research loop 的「怎么研究」环节,产出经核实的事实与结论,交给 research-artifact-html 结晶为产物。
---

# Research Methodology · 课题研究方法论执行

## 这个 skill 解决什么

42-research 的信条是「我们好奇的每一个问题，都值得被好好回答」。**好好回答**有客观标准——
不是写得漂亮，而是**可复现、可溯源、可同行评审**。本 skill 把 `docs/methodology/RESEARCH_METHODOLOGY.md`
的规范变成你手上的可执行流程：从一个问题，走到一组**经核实、带边界、可被推翻而未被推翻**的结论。

它**不**负责把结论写成 HTML（那是 `research-artifact-html`），也不负责上站发布（那是
`publish-research-topic`）。它负责的是最难、最不能偷懒的部分：**让结论值得相信**。

## 第一性原理（每个判断都回到这四条）

1. **基于事实，不凭记忆** — 任何技术声明先 WebSearch / 读官方文档核实。训练数据会过时，
   尤其定价、版本、发布状态这类快速变化的事实，**必须**当场核实并记下核实日期。
2. **不附和，要求证** — 社区/用户的流行说法（"X 彻底打败 Y"）是待验证假设，不是事实。
   独立验证它，如实记录偏差。发现流行说法夸大或不实，这本身就是高价值发现，开篇就纠正它。
3. **结论可证伪** — 每个结论都附"它在什么条件下成立、什么条件下不成立"。没有边界的结论是口号。
4. **引用可点击** — 每个事实声明配 URL + 核实日期 + 核实状态。读者能顺着链接自己复核。

## 6 阶段生命周期

课题状态记录在最终产物 JSON-LD 的 `researchStatus` 字段，逐阶段推进，不跳步：

```
1. hypothesis   提出可证伪的假设 + 明确判据（"满足什么就算成立/证伪"）
2. survey       多源采集：官方文档 / 一手数据 / 社区实践。边采集边记 sources.md
3. experiment   可复现实测：基准 / 成本模型 / 部署实验。记录环境、命令、版本——别人能重跑
4. verify       对抗验证：主动找反例、质疑自己（见下方「对抗验证」，这步最不能省）
5. synthesize   综合成结论 + 决策矩阵 + 适用边界
6. publish       交棒 research-artifact-html 结晶为 HTML 产物
```

**不要用产物模板倒逼结论**——先把 1-5 走扎实，有了经核实的事实和站得住的结论，再进 publish。
模板是用来呈现已完成研究的，不是用来填空凑出未经核实的断言的。

## 引用：边研究边记 sources.md

研究过程的素材用 Markdown（ADR-001 的格式分工：loop 用 MD，终产物用 HTML）。
每个课题在 `research/topics/NN-<slug>/sources.md` 累积引用，**每条事实声明落地时就记**，
别等到最后补——补的时候你已经忘了哪个声明出自哪。

每条引用记这些字段：

```
- url: https://...
  claim: 它支撑的【具体】声明（不是"关于定价"，而是"Workers Paid $5/月含千万请求"）
  tier: primary | secondary
  verified: yes | partial | no
  accessed: YYYY-MM-DD        # 你核实的日期
```

**分级规则**：
- `primary`（一手）= 官方文档、官方定价页、原始基准数据、官方公告。权重最高。
- `secondary`（二手）= 博客、媒体转述、第三方测算。可用于佐证趋势、补充观点，但**核心结论必须有一手支撑**。
- 冲突时**以一手为准并记录冲突**（例：官方说带宽 $0.15/GB，二手说 "$550/TB"，口径不同 → 取官方，注明差异）。
- 厂商自测的 benchmark 必须标注**"未独立验证"**——它是厂商立场下的数据，不等于客观事实。

另设 `## 存疑/需进一步验证 (Open Questions)` 段，把"还没核实清楚的""依赖快速变化事实的"老实列出来。
诚实的存疑清单比假装全知更可信。课题一的 `sources.md` 是完整范例，照它的结构写。

## 对抗验证（synthesize 前的强制关卡）

这是 42-research 区别于"AI 随便写写"的核心。在把事实综合成结论之前，对**每个核心结论**问：
**"它可能错在哪？"**

至少过一遍这几个角度：

- **反例 / 边界**：有没有场景让结论不成立？（"Cloudflare 更省钱" → 那 egress 极低的场景呢？）
- **数据偏差**：这个数字是厂商自测还是独立测试？样本有没有被挑选过？
- **相关 vs 因果**：是真的因果，还是只是同时出现？
- **时效性**：结论依赖的某个事实是不是快速变化的（版本、定价、发布状态）？多久会过期？

**用并行 skeptic 加强**：对一个关键结论，可以派多个 subagent，每个独立地**只做一件事——尝试推翻它**，
各自带不同视角（成本视角、生产成熟度视角、长期趋势视角）。**多数推翻 → 结论不成立**，回到 survey/experiment。
这比单线程自我审查更难自我欺骗。派发方式见 `superpowers:dispatching-parallel-agents`。

对抗验证的产出不是丢掉——**写进产物**。主动暴露"结论可能错在哪""反方场景"，
诚实是可信度的来源，不是减分项。

## Definition of Done（发布质量门）

进入 publish 前，逐条过这个 checklist。任一不满足 → 不发布，回到对应阶段补：

- [ ] 假设明确且**可证伪**（不是"X 很好"，而是"X 在条件 C 下优于 Y，判据是 M"）
- [ ] 每个事实声明有 ≥1 个核实引用；**核心声明有一手来源**
- [ ] 实验**可复现**：环境、命令、版本已记录，别人能重跑
- [ ] **已做对抗验证**：反例与边界已记录（不是"想了想觉得没问题"，是真的找过反例）
- [ ] 结论含**决策矩阵**与**适用边界**（什么场景选 A，什么场景选 B）
- [ ] 厂商 benchmark 均已标注是否独立验证
- [ ] 无未核实的"听说 / 据说 / 好像"式断言

## 在 research loop 中的位置

**`research-methodology`（怎么研究，产出经核实的事实与结论）**
→ `research-artifact-html`（把结论结晶为自包含 HTML 产物）
→ `publish-research-topic`（上站发布、SEO/AI 端点收录）。

## 参考

- 方法论规范全文：`docs/methodology/RESEARCH_METHODOLOGY.md`
- 完整引用范例：`research/topics/01-vibecoding-cloudflare-vs-vercel/sources.md`
- 并行 skeptic 派发：`superpowers:dispatching-parallel-agents`
