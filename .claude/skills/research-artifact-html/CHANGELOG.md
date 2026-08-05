# Changelog — research-artifact-html

> 一次升级一条大条目，由「使用即迭代」能力域维护（见 SKILL.md 末尾）。版本规则：新能力 = minor，修复/文档 = patch 并入描述。

- **v1.6 (2026-08-05)**: 🔴 国际化改为显式 URL（用户反馈「隐式切换不利于 SEO/GEO」）——废弃 v1.5 的「SSR 按 locale cookie 选产物 + 客户端热替换」：改为 `{-$locale}` 可选路径参数路由，英文默认无前缀（x-default），中文显式 `/zh/*`，URL 是语言唯一真相源；语言解析优先级 = 显式 URL > 手动选择（localStorage，切换即导航）> 浏览器语言（仅在无前缀 URL 上首屏前一次性 `location.replace`，爬虫无存储、Accept-Language 多为 en，始终索引稳定默认页）。SEO/GEO 面配齐：每页 hreflang（en/zh-CN/x-default）+ 按语言 canonical + og:locale，sitemap 双 URL + xhtml:link alternates，`.md` 端点每语言一个（`/zh/research/{slug}.md`，frontmatter 带 language + alternate 互链），llms.txt 双语分节。per-locale 产物文件约定（v1.5）不变。
- **v1.5 (2026-08-05)**: 课题国际化约定（用户要求三课题补齐英文版）— per-locale artifact：中文为 `index.html`（或 02 例外：zh=index.zh.html/en=index.html，尊重恢复现状），英文为 `index.en.html`，同一 identifier、同一事实与引用、JSON-LD 加 `inLanguage`；站点经 topics.ts `artifactEn`/`titleEn`/`abstractEn`/`tldrEn`/`categoryEn` + `localizeTopic()` 接线，SSR 按 locale cookie 选产物、客户端切语言热替换正文。英文产物同样必须过 validate_artifact.py。
- **v1.4 (2026-08-05)**: 🔴 SSR 详情页样式策略反转（用户反馈「样式混乱」+「Hero 未恢复」实战发现）— 旧行为「剥 `<style>` 套 prose」在复杂版式产物（grid5 卡片流、hero 大图）下彻底塌掉；新行为 = `extractScopedStyles` 把产物样式经 `@scope (.artifact-html)` 隔离注入（`:root`/顶层 `body` 改写 `:scope`），详情页按产物自身排版渲染，旧浏览器降级 prose；交互区块（lightbox）以 `<!-- artifact-interactive-start/end -->` 标记、SSR/.md 一律剥除。回归测试 +4（交互区块剥离 / @scope 改写 / tbody 不误伤 / 空样式），29 单测绿。SKILL.md「下游消费」段同步改写。
- **v1.3 (2026-08-05)**: 评测类产物版式先例（课题 03，用户要求与来源报告展示格式一致）— 场景 grid5 卡片流（图 + 延迟/裁决 chip + 点评 + takeaway）、能力矩阵（tone 着色）、bento 总览（静态宽度条形图 + 成本卡）；**内联 `<script>` 允许**（校验只禁外部 src），lightbox 等交互放产物内、SSR 详情页不执行内联脚本时须优雅降级（图片 href 兜底开原图）；大区块用生成脚本从数据源产出再拼装，避免手写 50 张卡片。
- **v1.2 (2026-08-05)**: 课题 02 实战首用回写 — 新产物形态「图片证据」处理方式固化：evidence/ 目录 + 降采样 JPEG + 根绝对路径（SSR 与原始产物两可用、file:// 降级靠 alt/figcaption 兜底）+ 脱敏台账以 `@type: Dataset` 入 JSON-LD citation + 「原始输出未修饰」声明。校验脚本对课题 02（含图片/Dataset 引用）回归通过。
- **v1.1 (2026-08-05)**: 建立「使用即迭代」能力域（对标 ai-provider-ac 系 skill 的 self-upgrade 模式）——SKILL.md 增触发表 + 收口三步 + 本 CHANGELOG。首个实战检验场：课题 02（MAI-Image-2.5 vs GPT-Image-2）。
- **v1.0 (2026-06-06)**: 基线——自包含 HTML 产物规范 / JSON-LD 骨架 / 模板 / validate_artifact.py 校验门，随课题 01 建成。

## 迭代待办

- [ ] （空）
