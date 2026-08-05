---
name: publish-research-topic
description: >-
  把一个已完成的 42-research 课题产物【端到端上站发布】(publish a research topic end-to-end)。
  覆盖产物校验 → 同步产物到 web/public/topics/ → 抓取一手来源封面图 → 登记 web/src/data/topics.ts
  清单 → 验证 5 个机器可读端点(robots/sitemap/rss/llms/{slug}.md)全 200 → 跑 tsc/test/build 三道关 → commit。
  Use this skill whenever a research artifact (index.html) is ready and needs to go live on the site,
  the user says 发布课题/上站/上线课题/publish topic/让课题出现在网站上, you've just finished
  research-artifact-html and need the topic to appear in the /research 目录与详情页, or you need to
  register a topic in topics.ts and verify SEO/AI endpoints。这是 research loop 的最后一棒——
  产物校验通过 ≠ 上站，本 skill 负责把合格产物变成网站上可访问、可被搜索引擎与 AI 收录的课题。
---

# Publish Research Topic · 课题端到端发布

## 这个 skill 解决什么

研究做完了（`research-methodology`），产物写好了（`research-artifact-html`），但**产物校验通过 ≠ 上站**。
产物只是躺在 `research/topics/` 里的真相源。要让它出现在网站 `/research` 目录、有详情页、
被 Google/Perplexity/AI Agent 收录，还有一串机械但**容易漏**的发布动作。本 skill 把它们固化成
不跳步的清单——任何一步漏了，要么页面 404，要么 SEO 端点掉内容，要么构建挂掉。

发布前置条件：课题已走完 `research-methodology` 的 DoD 质量门，产物已通过 `validate_artifact.py`。
若没有，先回去补——**不要发布带病的产物**。

## 关键事实（先记住，后面每步都用到）

| 项 | 值 |
|----|----|
| 产物真相源 | `research/topics/NN-<slug>/index.html` |
| 站点产物副本 | `web/public/topics/NN-<slug>/index.html`（详情页 SSR 从这里读，见 ADR-003） |
| 公开 slug | 目录名**去掉 `NN-` 前缀**（`01-vibecoding-...` → `vibecoding-...`） |
| 清单文件 | `web/src/data/topics.ts` |
| 详情页 URL | `/research/{slug}` |
| 本地 dev 端口 | `8042`（`pnpm -C web dev`） |

> **为什么要副本**：详情页 SSR（ADR-003）用 Cloudflare ASSETS binding 从 `web/public/` 读产物正文。
> `research/topics/` 是 git 里的真相源，`web/public/topics/` 是部署时被服务的静态资源。两者内容相同，
> 真相源变了，副本要同步。（注：`pnpm -C web` 是因为 zoxide 拦截 `cd`，统一用 `-C` 指定目录。）

## 发布流程（逐步执行，不跳步）

### 1. 校验产物（质量门）

```bash
python3 .claude/skills/research-artifact-html/scripts/validate_artifact.py research/topics/NN-<slug>/index.html
```

退出码非 0 必须先修复。这一步挡住 JSON-LD 残缺、identifier 与目录名不符、引用缺一手来源、CSS 混入非 ASCII 等问题。

### 2. 同步产物到 web/public

```bash
mkdir -p web/public/topics/NN-<slug>
cp research/topics/NN-<slug>/index.html web/public/topics/NN-<slug>/index.html
```

详情页正文读的是这个副本，**漏了这步详情页就空**（降级显示 abstract，不会崩但内容缺失）。

### 3. 抓取一手来源封面图

课题卡片与详情页都要封面（提升可信度与可读性）。**优先从课题的一手来源博客/官方页下载真实配图**，
而不是用通用占图——一手配图本身也是溯源的一部分。

- 去 `sources.md` 里 tier=primary 的来源页，找有代表性的官方配图（架构图、产品截图、公告头图）。
- 下载到 `web/public/topics/NN-<slug>/cover.png`（或 `.jpg`，与 `topics.ts` 里的 `cover` 路径一致）。
- **记下来源 URL**——它要填进 `topics.ts` 的 `coverSource`，详情页会展示"封面来源"署名。
- 尊重来源版权：用于评述/研究引用，注明出处；如来源明确禁止，换一张可用的或自绘示意图。
- **实测/评测类课题例外**：封面优先用自有实验产出（代表图或拼图，如课题 02 的 3×2 实测原图 montage）——
  自己的实验数据本身就是一手来源，比官方宣传图更可信；此时 `coverSource` 指向产物自身路径即可。

### 4. 登记到 topics.ts 清单

打开 `web/src/data/topics.ts`，在 `topics` 数组追加一条。**所有字段都要填全且与产物 JSON-LD 一致**
（这是当前的手写清单，将来由构建脚本从 JSON-LD 自动生成，现在先保证手写正确）：

```ts
{
  slug: 'vibecoding-cloudflare-vs-vercel',   // 去 NN- 前缀，对应 URL /research/{slug}
  no: '01',                                   // 两位序号，与目录前缀一致
  title: '...',                               // 与 JSON-LD headline 一致
  abstract: '...',                            // 与 JSON-LD abstract 一致
  status: 'publish',                          // 与 JSON-LD researchStatus 一致
  hypothesis: '...',                          // 与 JSON-LD 一致
  conclusion: '...',                          // 与 JSON-LD 一致
  keywords: ['...'],                          // 与 JSON-LD keywords 一致
  datePublished: 'YYYY-MM-DD',                // 与 JSON-LD 一致
  citations: 7,                               // sources.md 里引用条数
  artifact: '/topics/NN-<slug>/index.html',   // public 下的路径（带 NN- 前缀）
  category: '...',                            // 课题分类（卡片上的标签）
  tldr: '一句话结论摘要',                       // 卡片/详情页 TL;DR
  cover: '/topics/NN-<slug>/cover.png',        // 步骤 3 下载的封面
  coverSource: 'https://...',                  // 封面来源 URL（署名用）
}
```

**一致性是这步的灵魂**：`slug` 去前缀、`artifact`/`cover` 带前缀，别填反。title/abstract/status 等
与 JSON-LD 对不上，会出现"卡片说 A、详情页说 B"的割裂。

> **status 必须是 `'publish'`（最隐蔽的坑）**：sitemap / rss / llms.txt 三个端点都**硬过滤
> `status === 'publish'`**，但详情页和 `.md` 端点**只按 slug 匹配、不过滤 status**。后果：若 status
> 没设成 `publish`，课题页面**能打开、能分享，却不出现在 sitemap/rss/llms 里**——搜索引擎和 AI
> 爬虫永远发现不了，"页面上线了但 SEO 裸奔"且不报错。所以发布课题的 status 必须是 `publish`。

### 5. 启动 dev，验证页面与 5 个端点全 200

```bash
pnpm -C web dev          # 起在 8042
```

逐个访问，确认**页面正常 + 5 个机器可读端点全部 200 且含本课题**（ADR-004 双格式 + LLM-SEO）：

| 检查 | URL | 期望 |
|------|-----|------|
| 详情页 | `http://localhost:8042/research/<slug>` | 200，正文 + 封面 + TL;DR 正常 |
| 目录页 | `http://localhost:8042/research` | 200，新课题卡片出现 |
| Markdown 端点 | `http://localhost:8042/research/<slug>.md` | 200，YAML frontmatter + 正文纯文本 |
| sitemap | `http://localhost:8042/sitemap.xml` | 200，含 `/research/<slug>` |
| RSS | `http://localhost:8042/rss.xml` | 200，含本课题条目 |
| llms.txt | `http://localhost:8042/llms.txt` | 200，列出本课题 |
| robots | `http://localhost:8042/robots.txt` | 200，声明 sitemap |

可用 curl 批量核对状态码，例如：
```bash
for u in research/<slug> research research/<slug>.md sitemap.xml rss.xml llms.txt robots.txt; do
  printf '%s -> ' "$u"; curl -s -o /dev/null -w '%{http_code}\n' "http://localhost:8042/$u"
done
```
（`.md` 端点是独立转义路由 `web/src/routes/research.{$slug}[.]md.ts`——不要在页面路由挂 GET handler，
start-server-core 1.169+ 要求 handler 必须返回 Response，「返回 undefined 落回组件」的旧写法会 500。）

> **环境坑**：`pnpm install` / `pnpm dev` 报 `ERR_PNPM_IGNORED_BUILDS` → 检查 `web/pnpm-workspace.yaml`
> 的 `allowBuilds:` 是否还留着 `set this to true or false` 占位符，填成 `true` 即可（esbuild/sharp/workerd）。

### 6. 三道构建关：tsc / test / build

提交前必须全绿（DoD：每次提交都要编译通过、测试通过）：

```bash
pnpm -C web exec tsc --noEmit    # 类型检查（无独立 typecheck script，直接调 tsc）
pnpm -C web test                 # vitest run
pnpm -C web build                # vite build，双环境产物
```

任一失败 → 修复，别带病提交。`.md`/SSR 逻辑改动尤其要靠 `artifact.test.ts` 兜底。

### 7. commit（只 commit，不 push）

提交信息：**英文**（本项目是国际化开源项目，commit message 不得出现中文——用户 2026-08-05 明确反馈）、
conventional 风格、**不带任何 "Generated" 字样**。**一次课题发布 = 一个 commit**（产物 + 封面 + topics.ts
+ 过程中的 skill 回写都并入），与课题无关的修复才单独拆 commit。例：

```
feat(research): publish topic 02 — MAI-Image-2.5 vs GPT-Image-2
```

> 本项目规约：**只 commit，不 push**。不要执行 `git push`。

## 发布完成 Checklist（DoD）

- [ ] `validate_artifact.py` 退出 0
- [ ] 产物已 copy 到 `web/public/topics/NN-<slug>/`
- [ ] 封面已下载，`cover` + `coverSource` 已填且来源真实
- [ ] `topics.ts` 一条新记录，所有字段与 JSON-LD 一致（slug 去前缀、路径带前缀）
- [ ] 详情页/目录页/5 端点全部 200 且含本课题
- [ ] `tsc --noEmit` / `test` / `build` 三道关全绿
- [ ] 已 commit（英文、单 commit、无 Generated）、未 push

## 在 research loop 中的位置

`research-methodology`（怎么研究）→ `research-artifact-html`（结晶为产物）→ **`publish-research-topic`（上站发布）**。

## 使用即迭代（Self-Upgrade）

**本 skill 每一次被使用都是一次实战检验。使用中发现问题，当场回写升级——不留到「以后」。**

| 使用中发现 | 当场动作 |
|---|---|
| 清单步骤与仓库实际不符（路径 / 端口 / 脚本 / 字段变了） | 以仓库为准当场修清单——失实清单比没清单更危险 |
| 发布后发现新坑（端点漏内容、卡片与详情页不一致等） | 补进对应步骤的坑说明或 DoD checklist |
| 同类手工步骤 ≥2 次 / 明显绕路 | 沉淀成脚本或合并步骤 |
| Checklist 某项被证明永远多余 / 永远缺失 | 增删该项，不让 checklist 变成仪式 |

**收口（每次升级全过才算完成）**：
1. 改动落进 SKILL.md（保持精简，SKILL.md ≤ 200 行，超限内容外移 `references/`）；
2. `CHANGELOG.md` 追加**一条聚合大条目**（一次升级 = 一条；新能力 = minor +0.1，纯修复/文档 = patch 并入描述）；
3. 拿不准的改动记入 CHANGELOG 末尾「迭代待办」，下次使用时顺手清。

## 参考

- 产物规范与 slug 映射：`research-artifact-html` skill
- 双格式与端点策略：`docs/decisions/ADR-004-dual-format-and-llm-seo.md`
- SSR 详情页读取机制：`docs/decisions/ADR-003-ssr-detail-over-iframe.md`
- 完整范例课题：`research/topics/01-vibecoding-cloudflare-vs-vercel/` + `web/public/topics/01-.../`
