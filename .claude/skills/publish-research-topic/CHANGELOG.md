# Changelog — publish-research-topic

> 一次升级一条大条目，由「使用即迭代」能力域维护（见 SKILL.md 末尾）。版本规则：新能力 = minor，修复/文档 = patch 并入描述。

- **v1.2.1 (2026-08-05)**: 🔴 commit 规范修正（用户反馈）— 原文档「提交信息：简洁中文」与项目国际化标准冲突，改为**英文 + 一次课题发布一个 commit**；DoD 同步。实战中因此错误产生的 4 个中文 commit 已 squash 重写为 2 个英文 commit 并 force push。
- **v1.2 (2026-08-05)**: 课题 02 发布实战首用回写 — ① 修失实说明：`.md` 端点已从 research.$slug.tsx 嵌入 handler 拆为独立转义路由 `research.{$slug}[.]md.ts`（start-server-core 1.169+ 拒绝「handler 返回 undefined 落回组件」，实测两课题详情页 500，路由拆分后全 200）；② 新环境坑固化：pnpm 11 `ERR_PNPM_IGNORED_BUILDS` → 填 `web/pnpm-workspace.yaml` 的 `allowBuilds` 占位符；③ 封面步骤补「实测类课题优先自有实验产出拼图，coverSource 指产物自身」分支。
- **v1.1 (2026-08-05)**: 建立「使用即迭代」能力域（对标 ai-provider-ac 系 skill 的 self-upgrade 模式）——SKILL.md 增触发表 + 收口三步 + 本 CHANGELOG。首个实战检验场：课题 02（MAI-Image-2.5 vs GPT-Image-2）。
- **v1.0 (2026-06-06)**: 基线——7 步发布清单 / status='publish' 硬过滤坑 / 5 端点验证 / 三道构建关，随课题 01 建成。

## 迭代待办

- [ ] （空）
