import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { topics } from '../data/topics'
import { extractBody, extractJsonLd } from '../lib/artifact'
import { SITE, topicUrl } from '../lib/site'
import { articleJsonLd, serializeJsonLd } from '../lib/seo'
import { useT } from '../i18n/useLocale'
import ErrorPage from '../components/ErrorPage'

/**
 * 服务端读取自包含 HTML 产物的正文与 JSON-LD（见 ADR-003）。
 *
 * 用 createServerFn 包装，确保 cloudflare:workers 仅进 server bundle、不污染 client bundle。
 * 整体 try/catch —— 任何失败都降级为空，组件展示 abstract 兜底，绝不抛错崩页：
 *   - production / wrangler dev（真 workerd）：用 ASSETS binding 同源读取，无降级窗口。
 *   - vite dev（SSR 在 Node，无 ASSETS binding）：从当前请求 origin 同源 fetch dev server 静态资源
 *     （origin 取自 getRequest()，不再硬编码端口，dev server 落在任意端口都可读）。
 */
const getArtifact = createServerFn({ method: 'GET' })
  .inputValidator((artifact: string) => artifact)
  .handler(async ({ data: artifact }) => {
    try {
      let res: Response
      if (import.meta.env.PROD) {
        const { env } = await import('cloudflare:workers')
        res = await env.ASSETS.fetch(new URL(artifact, 'https://assets.local'))
      } else {
        const origin = new URL(getRequest().url).origin
        res = await fetch(new URL(artifact, origin))
      }
      if (!res.ok) return { bodyHtml: '', jsonLd: null }
      const html = await res.text()
      return { bodyHtml: extractBody(html), jsonLd: extractJsonLd(html) }
    } catch {
      // 读取/解析失败：降级为空，组件展示 abstract 兜底。
      return { bodyHtml: '', jsonLd: null }
    }
  })

export const Route = createFileRoute('/research/$slug')({
  // .md 端点已拆至独立路由 research.{$slug}[.]md.ts（ADR-004），
  // 本页面路由不再挂 GET handler——start-server-core 1.169+ 要求 handler 必须返回 Response。
  loader: async ({ params }) => {
    const topic = topics.find((t) => t.slug === params.slug)
    if (!topic) throw notFound()

    const { bodyHtml, jsonLd } = await getArtifact({ data: topic.artifact })

    return { topic, bodyHtml, jsonLd }
  },

  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const { topic, jsonLd } = loaderData

    // 若产物 JSON-LD 解析成功则复用，否则用 seo.ts 统一生成 ScholarlyArticle
    const structuredData = jsonLd ?? articleJsonLd(topic)

    const ogImage = topic.cover ? `${SITE.baseUrl}${topic.cover}` : undefined

    return {
      meta: [
        { title: `${topic.title} · 42-research` },
        { name: 'description', content: topic.abstract },
        { property: 'og:title', content: topic.title },
        { property: 'og:description', content: topic.abstract },
        { property: 'og:type', content: 'article' },
        ...(ogImage ? [{ property: 'og:image', content: ogImage }] : []),
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: topic.title },
        { name: 'twitter:description', content: topic.abstract },
        ...(ogImage ? [{ name: 'twitter:image', content: ogImage }] : []),
      ],
      links: [{ rel: 'canonical', href: topicUrl(topic.slug) }],
      scripts: [
        {
          type: 'application/ld+json',
          // 防御性转义闭合标签，避免 JSON 内容意外终止 <script>
          children: serializeJsonLd(structuredData as Record<string, unknown>),
        },
      ],
    }
  },

  component: ResearchDetail,

  notFoundComponent: () => <TopicNotFound />,
})

function TopicNotFound() {
  const tr = useT()
  return (
    <ErrorPage
      code="404"
      title={tr.detail.notFoundTitle}
      message={tr.detail.notFoundMessage}
    />
  )
}

function ResearchDetail() {
  const { topic: t, bodyHtml } = Route.useLoaderData()
  const tr = useT()

  return (
    <main className="page-wrap px-4 pb-16 pt-12">
      {/* 面包屑 */}
      <Link
        to="/research"
        className="mono text-sm text-[var(--muted)] transition hover:text-[var(--fg)]"
      >
        {tr.detail.breadcrumb}
      </Link>

      {/* 文章头部元信息 */}
      <header className="rise mt-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="mono text-2xl font-bold text-[var(--border-hi)]">{t.no}</span>
          <span className={`badge ${t.status === 'publish' ? 'published' : ''}`}>
            {tr.status[t.status]}
          </span>
          <span className="mono text-xs text-[var(--muted)]">
            {t.datePublished} · {t.citations} {tr.detail.primaryCitations}
          </span>
        </div>
        <h1 className="display mt-4 text-3xl font-extrabold tracking-tight text-[var(--fg)] sm:text-5xl">
          {t.title}
        </h1>
      </header>

      {/* 封面图 — 来源一手素材，本地化引用（来源标注见页尾） */}
      {t.cover && (
        <figure
          className="rise mt-8 overflow-hidden rounded-2xl border border-[var(--border)]"
          style={{ animationDelay: '80ms' }}
        >
          <img
            src={t.cover}
            alt={t.title}
            className="aspect-video w-full object-cover"
            loading="eager"
          />
        </figure>
      )}

      {/* TL;DR 结论块 — 醒目卡片，便于机器/人快速提取 */}
      <div className="rise card mt-8 border-l-4 border-l-[var(--ok)] p-5" style={{ animationDelay: '120ms' }}>
        <p className="kicker mb-2">{tr.detail.tldrKicker}</p>
        <p className="text-base leading-7 text-[var(--fg)]">{t.tldr}</p>
      </div>

      {/* SSR 正文 — @tailwindcss/typography prose 排版 */}
      <div className="rise mt-10" style={{ animationDelay: '200ms' }}>
        {bodyHtml ? (
          // 产物 HTML 由 42-research 自有模板生成，内容可控，XSS 风险已在 ADR-003 登记
          <article
            className="prose-research prose max-w-none"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        ) : (
          // fetch 失败降级：展示 abstract
          <div className="card p-6">
            <p className="kicker mb-2">{tr.detail.abstractKicker}</p>
            <p className="text-base leading-7 text-[var(--fg-soft)]">{t.abstract}</p>
          </div>
        )}
      </div>

      {/* 封面来源标注（合规） */}
      {t.coverSource && (
        <p className="mt-8 text-xs text-[var(--muted)]">
          {tr.detail.coverSource}
          <a href={t.coverSource} target="_blank" rel="noreferrer" className="hover:text-[var(--fg-soft)]">
            {t.coverSource}
          </a>
        </p>
      )}

      {/* 查看原始产物链接 */}
      <div className="mt-6 border-t border-[var(--border)] pt-6">
        <a
          href={t.artifact}
          target="_blank"
          rel="noreferrer"
          className="mono text-sm text-[var(--muted)] transition hover:text-[var(--fg-soft)]"
        >
          {tr.detail.rawArtifact}
        </a>
        <p className="mt-1 text-xs text-[var(--muted)]">
          {tr.detail.rawArtifactNote}
        </p>
      </div>
    </main>
  )
}
