# ADR-004 · 双格式发布 + LLM-SEO 全栈可发现性策略

- **状态**: Accepted
- **日期**: 2026-06-07
- **决策者**: larrykoo711
- **相关**: [ADR-001](ADR-001-html-as-source-d1-as-index.md)（三位一体架构）、[ADR-003](ADR-003-ssr-detail-over-iframe.md)（SSR 详情页）

## 背景 (Context)

AI Agent、LLM、MCP 工具链正在成为内容消费的主要入口之一（OpenAI、Claude、Perplexity 等均有网络访问与爬取能力）。42-research 作为严谨可溯源的技术研究站，若仅提供 HTML 展示页，AI Agent 获取结构化内容时需解析 DOM——效率低、信号损耗大。

同时，传统 SEO（Google/Bing）依赖 sitemap、structured data（JSON-LD）、canonical、robots 等信号；新兴 GEO（Generative Engine Optimization）依赖 llms.txt、.md 端点、RSS 等机器可读格式。两者均需统一策略应对。

## 已核实的事实依据 (Verified Evidence)

1. **llmstxt.org 规范**（2024 年提出，Jeremy Howard 等推动）：`/llms.txt` 为站点向 LLM 提供导航的标准入口，格式为 Markdown，列出关键页面与数据端点。
2. **OpenAI GPTBot、Anthropic ClaudeBot、Google-Extended** 等主流 AI 爬虫均遵守 `robots.txt`，需显式 Allow 方可爬取。
3. **Thariq Shihipar（Claude Code 工程负责人）核实**：「Markdown is fine for the loop, but the final artifact a human reads is meaningfully better as HTML」——对应双格式：人读 HTML，AI/Agent 读 `.md`。
4. **JSON-LD ScholarlyArticle** 是 Google Rich Results 与 AI 摘要引用的首选结构化数据格式，集中管理可保证 DRY 与一致性。
5. **RSS 2.0** 仍是 Feed Reader 与 AI Aggregator 的通用订阅格式，零依赖可手写字符串实现。

## 决策 (Decision)

### 1. 双格式发布 (Dual Format Publishing)

| 格式 | 路径 | 受众 |
|------|------|------|
| 富文本 HTML（SSR） | `/research/{slug}` | 人类读者 |
| Markdown + YAML frontmatter | `/research/{slug}.md` | AI Agent、MCP、LLM、开发者 |

`.md` 端点由 TanStack Start server handler 动态生成：从产物 HTML 提取正文转纯文本，附 YAML frontmatter（title/slug/category/datePublished/citations/canonical/status/keywords）。提取失败时降级为 `abstract`，绝不崩溃。

### 2. 机器可读数据端点

| 端点 | 格式 | 用途 |
|------|------|------|
| `/rss.xml` | RSS 2.0 XML | Feed Reader、AI Aggregator 订阅 |
| `/sitemap.xml` | XML Sitemap | Google/Bing 索引、AI 爬虫发现所有页面 |
| `/robots.txt` | 动态生成（替代静态文件） | 声明 Sitemap URL、显式 Allow 所有主流 AI 爬虫 |
| `/llms.txt` | Markdown（llmstxt.org 规范） | LLM/AI Agent 站点导航入口 |

### 3. AI 爬虫策略：全部允许

开源研究站，目标是最大化可见度与引用。robots.txt 显式 Allow 所有主流 AI 爬虫：
GPTBot、ChatGPT-User、ClaudeBot、Claude-Web、anthropic-ai、Google-Extended、
PerplexityBot、CCBot、Bytespider、Applebot、Applebot-Extended、cohere-ai、
FacebookBot、YouBot、DuckAssistBot、Amazonbot、Diffbot、omgili。

### 4. 统一 JSON-LD 生成（seo.ts）

将各页面内联的 JSON-LD 拼接逻辑提取到 `web/src/lib/seo.ts`，提供：
- `websiteJsonLd()` → schema.org WebSite + publisher Organization
- `articleJsonLd(topic)` → ScholarlyArticle
- `breadcrumbJsonLd(items)` → BreadcrumbList
- `serializeJsonLd(obj)` → 防 `</script>` 注入的安全序列化

各页面 `head()` 中 canonical 保留在 `links[]`，JSON-LD 保留在 `scripts[]`。

### 5. RSS alternate link

`__root.tsx` head 全局注入 `<link rel="alternate" type="application/rss+xml">` 以供浏览器/Feed Reader 自动发现。

## 实现技术细节

- 所有非 HTML 端点用 TanStack Start `server.handlers.GET` 返回 `new Response()`，无 React 组件。
- `.md` 端点文件名：`research.$slug[.]md.ts`（`[.]` 转义点号，映射路由 `/research/$slug.md`）。
- XML/RSS/robots/sitemap/llms.txt 手写字符串，零新依赖（YAGNI）。
- `public/robots.txt` 静态文件已删除，改由 `/robots.txt` 动态路由服务，避免静态/动态冲突。

## 后果 (Consequences)

### 正面
- AI Agent 可直接 `fetch /research/{slug}.md` 获取结构化内容，无需解析 HTML
- llms.txt 一处声明全站结构，LLM 可一次性了解所有端点
- robots.txt 显式 Allow AI 爬虫 → 最大化搜索引擎与 AI 引用覆盖
- JSON-LD 统一管理 → DRY，减少各页面遗漏或不一致风险
- 双格式发布与 ADR-001 三位一体架构完全兼容（HTML 真相源不变）

### 负面 / 缓解
- **vite dev 下 `.md` 端点产物读取**：server handler 里无法直接拿到 request origin，以硬编码 `http://localhost:8042` 兜底 fetch 产物 HTML。wrangler dev / production 走 `env.ASSETS.fetch`，稳定可靠。降级机制（bodyText 为空时用 abstract）确保端点始终返回有效内容。
- **robots.txt 动态路由 vs 静态文件**：已删除 `public/robots.txt` 静态文件，避免 Cloudflare Pages/Workers 同时命中两条规则造成不确定行为。

## 被否决的方案 (Rejected Alternatives)

- **引入 `rss` / `xml-builder` npm 包**：YAGNI，RSS 2.0 结构极简，手写字符串 + XML 转义函数足够，零新依赖成本更低。
- **Atom feed**：RSS 2.0 已满足需求，Atom 格式兼容性无显著优势，增加复杂度不值得。
- **分页 sitemap**：当前课题数量极少，单文件 sitemap 足够，待课题超 50000 条再考虑。
- **保留静态 `public/robots.txt`**：动态生成可在 robots.txt 中嵌入 `SITE.baseUrl` 变量，避免 baseUrl 变更时需手动更新静态文件。
