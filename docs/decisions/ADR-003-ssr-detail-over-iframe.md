# ADR-003 · 详情页由 iframe 改为 SSR 内联正文

- **状态**: Accepted
- **日期**: 2026-06-06
- **决策者**: larrykoo711
- **相关**: [ADR-001](ADR-001-html-as-source-d1-as-index.md)（真相源不变）

## 背景 (Context)

阶段 4 的课题详情页（`/research/$slug`）使用 `<iframe>` 直接嵌入自包含 HTML 产物。
该方案零渲染损耗，但正文被沙盒隔离，搜索引擎爬虫与 AI Agent 无法索引正文内容，
违背「可溯源、AI 可读」的核心定位。

随着 AI 搜索（Perplexity、Gemini、ChatGPT Search）和 GEO（Generative Engine Optimization）
成为主要流量入口，正文必须以 SSR HTML 直出，才能被 LLM 和爬虫直接消费。

## 决策 (Decision)

详情页改为 **SSR 内联正文**：

1. `loader` 在服务端 fetch 产物 HTML，调用 `lib/artifact.ts` 的 `extractBody` 提取正文、
   `extractJsonLd` 解析结构化元数据，返回 `{ topic, bodyHtml, jsonLd }`。
2. 组件用 `dangerouslySetInnerHTML` 渲染 `bodyHtml`，外包 `.prose-research .prose` 排版层。
   （产物 HTML 由 42-research 自有模板生成，内容可控；XSS 风险可接受，已登记。）
3. `head()` 注入完整 SEO/GEO 元数据：canonical、og:*、twitter:card、JSON-LD。
4. 页面同时保留「查看原始自包含 HTML 产物 ↗」链接，保证原始产物可独立访问和溯源。

**真相源不变**：产物 HTML（`web/public/topics/<slug>/index.html`）仍是唯一真相源，
详情页正文是对真相源的展示层提取，非独立数据。

## 理由 (Rationale)

| 维度 | iframe 方案 | SSR 正文方案 |
|------|------------|------------|
| SEO 可索引 | ✗ 爬虫无法穿透 iframe | ✓ 正文直出 HTML |
| GEO / AI 可读 | ✗ LLM 抓不到正文 | ✓ SSR HTML 直接可解析 |
| 真相源一致性 | ✓ 展示即产物 | ✓ 展示提取自产物，链接保留 |
| 主题一致性 | ✗ 产物暗色与站点亮色冲突 | ✓ prose-research 配 CSS 变量自适应 |
| TL;DR / 结构化摘要 | ✗ 无 | ✓ TL;DR 卡片 + JSON-LD 双路输出 |

## 实现细节

- `web/src/lib/artifact.ts`：纯字符串处理，无 DOM，SSR/Worker 安全；
  `extractJsonLd` 返回 `JsonLd` 类型（JSON 可序列化），供 `createServerFn` 跨边界传输。
- `web/src/lib/artifact.test.ts`：5 个 vitest 测试用例，TDD 驱动。
- `web/src/styles.css`：`.prose-research` 用 `--tw-prose-*` CSS 变量覆盖 prose 颜色，
  暗/亮主题自动切换，无需 `prose-invert` 写死。
- **产物读取策略**：用 `createServerFn` + Cloudflare ASSETS binding
  服务端在 `createServerFn().handler()` 内按环境分支，整体 try/catch，任何失败降级为空（展示 abstract），绝不抛错崩页：
  - production / `wrangler dev`（真 workerd）：动态 `import('cloudflare:workers')` 取 `env.ASSETS`，
    `env.ASSETS.fetch` 同源读取，已验证可用，无降级窗口。
  - `vite dev`（SSR 在 Node，无 ASSETS binding）：从 `getRequest()` 当前请求 origin 同源 fetch
    dev server 静态产物——**不硬编码端口**，dev server 落在任意端口（8042 被占用时自动换 8043…）都能读到。
  - wrangler.jsonc 启用 `"assets": { "directory": "./public", "binding": "ASSETS" }`，
    并 `wrangler types` 生成 `Env.ASSETS: Fetcher` 类型。
  - 用 `createServerFn` 包装（而非裸 loader 分支）：确保 `cloudflare:workers` 只进 server bundle，
    不污染 client bundle（裸 loader 内动态 import 会令 client 构建无法 resolve 该虚拟模块）。
- JSON-LD `children` 防御性转义 `</script>` → `<\/script>`，避免 JSON 内容意外终止脚本块。
- canonical 用 `head().links[]`（渲染为 `<link rel="canonical">`），不放 `meta[]`。

## 被否决的方案 (Rejected Alternatives)

- **继续用 iframe + `<noscript>` fallback**：fallback 无法做到完整正文输出，SEO 效果有限，
  且双轨维护成本高。
- **用 `node:fs` 读产物文件**：Cloudflare Workers 无文件系统，不可行。
- **SSR loader 自 fetch 站点域名（`fetch(SITE.baseUrl + artifact)`）**：可用但非最优——
  首次部署有极短降级窗口，且 preview 模式拿不到正文。改用 ASSETS binding 消除该依赖。
- **静态生成（build 时提取写入路由）**：增加构建复杂度，且 TanStack Start SSR 已足够快；
  YAGNI。

## 后果 (Consequences)

### 正面
- `/research/$slug` 的正文对搜索引擎、AI 爬虫、Perplexity 等 GEO 工具完全可索引。
- JSON-LD 结构化数据随 SSR 首屏输出，schema.org/ScholarlyArticle 完整。
- 暗/亮主题均可读，与站点视觉一致。

### 负面 / 缓解
- **产物内的 CSS 动效丢失**（tabs、折叠等 CSS-only 交互）：
  `extractBody` 已剥除 `<style>`，互动组件降级为静态 HTML 展示。
  缓解：保留「查看原始产物」链接，用户可在原始页体验完整交互。
- **`vite dev` 与 production 走不同读取路径**（dev 同源 fetch / prod ASSETS binding）：
  ASSETS binding 在 vite dev 下不可用（vite-plugin 已知限制：对直接 fetch 返回 403），
  故 dev 改走 `getRequest()` origin 同源 fetch。两路径均已实测，三环境
  （vite dev 默认/非默认端口、wrangler dev）均返回 200 正文渲染。
- **取产物经服务端**：用 `createServerFn`，SSR 在进程内执行、客户端导航走一次轻量 RPC；
  避免在客户端重复拉取整份产物 HTML，且确保 `cloudflare:workers` 不进 client bundle。
- **回归教训**：初版 dev 分支硬编码 `localhost:8042`，当 dev server 落在其他端口时
  serverFn 内 fetch 失败导致整页 500（非优雅降级）。改用 `getRequest()` origin 修复。
