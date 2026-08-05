# Changelog — research-artifact-html

> 一次升级一条大条目，由「使用即迭代」能力域维护（见 SKILL.md 末尾）。版本规则：新能力 = minor，修复/文档 = patch 并入描述。

- **v1.4 (2026-08-05)**: 🔴 SSR 详情页样式策略反转（用户反馈「样式混乱」+「Hero 未恢复」实战发现）— 旧行为「剥 `<style>` 套 prose」在复杂版式产物（grid5 卡片流、hero 大图）下彻底塌掉；新行为 = `extractScopedStyles` 把产物样式经 `@scope (.artifact-html)` 隔离注入（`:root`/顶层 `body` 改写 `:scope`），详情页按产物自身排版渲染，旧浏览器降级 prose；交互区块（lightbox）以 `<!-- artifact-interactive-start/end -->` 标记、SSR/.md 一律剥除。回归测试 +4（交互区块剥离 / @scope 改写 / tbody 不误伤 / 空样式），29 单测绿。SKILL.md「下游消费」段同步改写。
- **v1.3 (2026-08-05)**: 评测类产物版式先例（课题 03，用户要求与来源报告展示格式一致）— 场景 grid5 卡片流（图 + 延迟/裁决 chip + 点评 + takeaway）、能力矩阵（tone 着色）、bento 总览（静态宽度条形图 + 成本卡）；**内联 `<script>` 允许**（校验只禁外部 src），lightbox 等交互放产物内、SSR 详情页不执行内联脚本时须优雅降级（图片 href 兜底开原图）；大区块用生成脚本从数据源产出再拼装，避免手写 50 张卡片。
- **v1.2 (2026-08-05)**: 课题 02 实战首用回写 — 新产物形态「图片证据」处理方式固化：evidence/ 目录 + 降采样 JPEG + 根绝对路径（SSR 与原始产物两可用、file:// 降级靠 alt/figcaption 兜底）+ 脱敏台账以 `@type: Dataset` 入 JSON-LD citation + 「原始输出未修饰」声明。校验脚本对课题 02（含图片/Dataset 引用）回归通过。
- **v1.1 (2026-08-05)**: 建立「使用即迭代」能力域（对标 ai-provider-ac 系 skill 的 self-upgrade 模式）——SKILL.md 增触发表 + 收口三步 + 本 CHANGELOG。首个实战检验场：课题 02（MAI-Image-2.5 vs GPT-Image-2）。
- **v1.0 (2026-06-06)**: 基线——自包含 HTML 产物规范 / JSON-LD 骨架 / 模板 / validate_artifact.py 校验门，随课题 01 建成。

## 迭代待办

- [ ] （空）
