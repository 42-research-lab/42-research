# 研究方法论 · Research Methodology

> 本文档定义 42-research 的研究标准。每个课题都必须遵循。
> 目标：可复现 (Reproducible) · 可溯源 (Traceable) · 可同行评审 (Peer-reviewable)。

## 第一性原理 (First Principles)

1. **基于事实，不凭记忆** — 任何技术声明必须经 WebSearch/官方文档核实，训练数据可能过时。
2. **不附和，要谲证** — 用户/社区的说法（如"X 彻底打败 Y"）需独立验证，如实记录偏差。
3. **结论可证伪** — 每个结论附带它在什么条件下成立、什么条件下不成立。
4. **引用可点击** — 每个事实声明附 URL，标注核实日期与核实状态。

## 课题生命周期 (Topic Lifecycle)

每个课题经历 6 个阶段，状态记录在 HTML 产物的 JSON-LD `researchStatus` 字段：

```
1. hypothesis   提出假设 + 定义可证伪的判据
2. survey       多源信息采集 (官方文档 / 一手数据 / 社区实践)
3. experiment   可复现的实测 (基准/成本模型/部署实验)，记录环境与命令
4. verify       对抗验证 (adversarial): 主动找反例，质疑自己的结论
5. synthesize   综合成结论 + 决策矩阵 + 适用边界
6. publish      产出自包含 HTML，元数据入 D1
```

## 引用标准 (Citation Standard)

每条引用在 `sources.md` 与 HTML 的 JSON-LD `citation[]` 中记录：

```yaml
- url: https://...
  title: 标题
  author: 作者/机构
  date: 来源发布日期
  accessed: 2026-06-06        # 我们核实的日期
  verified: true              # 是否独立核实
  claim: 它支撑的具体声明
  tier: primary | secondary   # 一手(官方/原始数据) vs 二手(博客/转述)
```

**分级**：一手来源（官方文档、原始基准数据）权重高于二手来源（博客、转述）。
冲突时以一手来源为准，并记录冲突。

## 对抗验证 (Adversarial Verification)

synthesize 前必须做：对每个核心结论，主动提出 "它可能错在哪？"

- 是否有反例 / 边界条件？
- 数据是否有偏（厂商自测 vs 独立测试）？
- 是否混淆了相关性与因果性？
- 时效性：结论是否依赖某个快速变化的事实？

可用 Agent 并行派多个 skeptic 独立尝试推翻结论，多数推翻则结论不成立。

## 产物质量门 (Definition of Done)

课题发布前 checklist：

- [ ] 假设明确且可证伪
- [ ] 每个事实声明有 ≥1 个核实引用（核心声明需一手来源）
- [ ] 实验可复现（环境、命令、版本已记录）
- [ ] 已做对抗验证，记录了反例与边界
- [ ] 结论含决策矩阵与适用边界
- [ ] HTML 产物自包含、含完整 JSON-LD、响应式
- [ ] 无未核实的"听说"式断言
