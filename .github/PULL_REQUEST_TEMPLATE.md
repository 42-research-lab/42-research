<!--
  感谢你的贡献！请填写以下内容，帮助评审者快速理解你的改动。
  目标分支说明：日常改动请基于并 PR 到 `dev`；只有 release 才从 `dev` PR 到 `main`。
-->

## 这个 PR 做了什么

> 一句话概括改动，以及「为什么」要做。

## 改动类型

- [ ] 🔬 新研究课题 / 补强已有课题
- [ ] 📐 方法论或 ADR 改动
- [ ] ✨ 网站 / 工具功能
- [ ] 🐛 Bug 修复
- [ ] 📝 文档
- [ ] 🧹 重构 / 杂项

## 自检清单

- [ ] 提交信息简洁、中文、说明「为什么」，**不含自动生成的署名行**
- [ ] 一次提交对应一个逻辑变更，可 diff、可评审
- [ ] 没有提交任何敏感凭证（`.env` 类文件已 gitignore）

### 若涉及研究课题，额外确认（对照 [DoD](../CONTRIBUTING.md#质量门definition-of-done)）

- [ ] 假设可证伪；每个事实声明有 ≥1 个核实引用（核心声明有一手来源）
- [ ] 已做对抗验证，记录了反例与边界；结论含适用边界
- [ ] 产物通过校验：`uv run .claude/skills/research-artifact-html/scripts/validate_artifact.py <path>`

### 若涉及网站 / 工具，额外确认

- [ ] `pnpm -C web exec tsc --noEmit` 通过
- [ ] `pnpm -C web test` 通过
- [ ] `pnpm -C web build` 通过

## 相关 Issue

> 用 `Closes #123` 关联。
