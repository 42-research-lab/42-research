import { useCallback, useEffect, useState } from 'react'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { topics } from '../data/topics'
import { extractBody, extractJsonLd, extractScopedStyles } from '../lib/artifact'
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
      if (!res.ok) return { bodyHtml: '', styles: '', jsonLd: null }
      const html = await res.text()
      return {
        bodyHtml: extractBody(html),
        styles: extractScopedStyles(html),
        jsonLd: extractJsonLd(html),
      }
    } catch {
      // 读取/解析失败：降级为空，组件展示 abstract 兜底。
      return { bodyHtml: '', styles: '', jsonLd: null }
    }
  })

export const Route = createFileRoute('/research/$slug')({
  // .md 端点已拆至独立路由 research.{$slug}[.]md.ts（ADR-004），
  // 本页面路由不再挂 GET handler——start-server-core 1.169+ 要求 handler 必须返回 Response。
  loader: async ({ params }) => {
    const topic = topics.find((t) => t.slug === params.slug)
    if (!topic) throw notFound()

    const { bodyHtml, styles, jsonLd } = await getArtifact({ data: topic.artifact })

    return { topic, bodyHtml, styles, jsonLd }
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

/** 站点主题（root class 由 ThemeToggle/__root 初始化脚本维护）→ 透传给产物容器 data-theme */
function useSiteTheme(): 'dark' | 'light' {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  useEffect(() => {
    const root = document.documentElement
    const read = () => setTheme(root.classList.contains('light') ? 'light' : 'dark')
    read()
    const mo = new MutationObserver(read)
    mo.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => mo.disconnect()
  }, [])
  return theme
}

interface LightboxShot {
  src: string | null
  name: string
  note: string
}
interface LightboxState {
  scene: string
  shots: LightboxShot[]
  idx: number
}

/**
 * 详情页 lightbox：产物内联脚本被 SSR 剥除，这里用 React 重建同等交互
 * （点击场景图放大 / 左右键与滑动切换同场景五档 / Esc 关闭）。
 * 数据在点击时从产物 DOM 就地提取，产物结构由自有模板保证。
 */
function useArtifactLightbox() {
  const [lb, setLb] = useState<LightboxState | null>(null)

  const onArticleClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    const media = target.closest('a.shot-media')
    if (!media) return
    const scene = media.closest('section.scene')
    if (!scene) return
    e.preventDefault()
    const label = scene.querySelector('.scene-head h3')?.textContent ?? ''
    const cards = Array.from(scene.querySelectorAll('.shot'))
    const shots: LightboxShot[] = cards.map((card) => ({
      src: card.querySelector('.shot-media img')?.getAttribute('src') ?? null,
      name: card.querySelector('.shot-name')?.textContent ?? '',
      note: card.querySelector('.shot-note')?.textContent ?? '',
    }))
    const idx = cards.findIndex((card) => card.contains(media))
    setLb({ scene: label, shots, idx: Math.max(0, idx) })
  }, [])

  const step = useCallback(
    (dir: number) => {
      setLb((cur) => {
        if (!cur) return cur
        let m = cur.idx
        for (let k = 0; k < cur.shots.length; k++) {
          m = (m + dir + cur.shots.length) % cur.shots.length
          if (cur.shots[m].src) return { ...cur, idx: m }
        }
        return cur
      })
    },
    [],
  )

  useEffect(() => {
    if (!lb) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLb(null)
      else if (e.key === 'ArrowLeft') step(-1)
      else if (e.key === 'ArrowRight') step(1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lb, step])

  return { lb, setLb, step, onArticleClick }
}

function ArtifactLightbox({
  lb,
  onClose,
  onStep,
}: {
  lb: LightboxState
  onClose: () => void
  onStep: (dir: number) => void
}) {
  const [touchX, setTouchX] = useState<number | null>(null)
  const shot = lb.shots[lb.idx]
  if (!shot?.src) return null
  return (
    <div
      className="fixed inset-0 z-[100] grid grid-rows-[auto_minmax(0,1fr)_auto] gap-3 bg-[rgba(4,5,10,0.93)] p-5 backdrop-blur"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={(e) => setTouchX(e.changedTouches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX == null) return
        const dx = e.changedTouches[0].clientX - touchX
        if (Math.abs(dx) > 40) onStep(dx > 0 ? -1 : 1)
        setTouchX(null)
      }}
    >
      <div className="flex items-start justify-between gap-4 text-[#f2f4f8]">
        <div>
          <div className="text-sm font-semibold">{lb.scene}</div>
          <div className="mt-0.5 text-xs text-[#9aa2b4]">{shot.name}</div>
        </div>
        <button
          type="button"
          aria-label="关闭"
          onClick={onClose}
          className="h-9 w-9 shrink-0 rounded-full border border-white/20 bg-white/5 text-lg leading-none text-[#f2f4f8] hover:bg-white/15"
        >
          ×
        </button>
      </div>
      <div className="relative grid min-h-0 place-items-center px-14">
        <button
          type="button"
          aria-label="上一张"
          onClick={() => onStep(-1)}
          className="absolute left-1 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-[rgba(10,12,18,0.62)] text-xl text-[#f2f4f8] hover:bg-[rgba(30,34,48,0.85)]"
        >
          ‹
        </button>
        <img
          src={shot.src}
          alt={`${lb.scene} — ${shot.name}`}
          className="block h-auto max-h-[calc(100vh-190px)] w-auto max-w-[min(92vw,1024px)] rounded-xl object-contain"
        />
        <button
          type="button"
          aria-label="下一张"
          onClick={() => onStep(1)}
          className="absolute right-1 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-[rgba(10,12,18,0.62)] text-xl text-[#f2f4f8] hover:bg-[rgba(30,34,48,0.85)]"
        >
          ›
        </button>
      </div>
      <div className="flex flex-col items-center gap-2 text-center text-xs leading-relaxed text-[#9aa2b4]">
        <div className="flex gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
          {lb.shots.map((s, i) => (
            <i
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${
                !s.src ? 'bg-[rgba(239,107,107,0.45)]' : i === lb.idx ? 'scale-125 bg-[#f2f4f8]' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
        <span className="max-w-[820px] text-[#d6dae4]">{shot.note}</span>
        <span>← → 或左右滑动切换模型 · Esc 关闭</span>
      </div>
    </div>
  )
}

function ResearchDetail() {
  const { topic: t, bodyHtml, styles } = Route.useLoaderData()
  const tr = useT()
  const theme = useSiteTheme()
  const { lb, setLb, step, onArticleClick } = useArtifactLightbox()

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

      {/* 封面图 — 来源一手素材，本地化引用（来源标注见页尾）。
          产物正文自带全幅 hero（coverEmbedded）时不重复渲染，避免同图出现两次 */}
      {t.cover && !t.coverEmbedded && (
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

      {/* SSR 正文 — 有产物样式时按产物自身排版渲染（@scope 隔离，见 artifact.ts），
          无样式时降级 @tailwindcss/typography prose 排版 */}
      <div className="rise mt-10" style={{ animationDelay: '200ms' }}>
        {bodyHtml && styles ? (
          // 产物 HTML 由 42-research 自有模板生成，内容可控，XSS 风险已在 ADR-003 登记。
          // 通栏 full-bleed：产物自带底色与排版，跳出 page-wrap 铺满视口宽度，还原独立产物页观感。
          // data-theme 透传站点主题（产物含 light 调色板时随站点亮暗切换）；
          // onClick 事件代理承接场景图点击，弹出 React 版 lightbox（产物内联脚本已被 SSR 剥除）。
          <article
            className="artifact-html"
            data-theme={theme}
            style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)' }}
            onClick={onArticleClick}
            dangerouslySetInnerHTML={{ __html: `<style>${styles}</style>${bodyHtml}` }}
          />
        ) : bodyHtml ? (
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

      {/* 场景图 lightbox（仅产物含场景卡片时会被触发） */}
      {lb && <ArtifactLightbox lb={lb} onClose={() => setLb(null)} onStep={step} />}

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
