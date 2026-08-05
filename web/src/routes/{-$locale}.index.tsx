import { createFileRoute, Link } from '@tanstack/react-router'
import { topics } from '../data/topics'
import { TopicCard } from '../components/TopicCard'
import { SITE } from '../lib/site'
import { websiteJsonLd, serializeJsonLd, localeAlternates } from '../lib/seo'
import { LOCALE_TAG, messages, resolveLocale } from '../i18n'
import { useT } from '../i18n/useLocale'

export const Route = createFileRoute('/{-$locale}/')({
  loader: ({ params }) => ({ topics, locale: resolveLocale(params.locale) }),
  head: ({ loaderData }) => {
    const locale = loaderData?.locale ?? 'en'
    const site = messages(locale).site
    return {
      meta: [
        { title: site.title },
        { name: 'description', content: site.description },
        { property: 'og:title', content: site.title },
        { property: 'og:description', content: site.description },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: LOCALE_TAG[locale] },
        { property: 'og:image', content: `${SITE.baseUrl}/og-image.png` },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: site.title },
        { name: 'twitter:description', content: site.description },
      ],
      links: localeAlternates('', locale),
      scripts: [
        {
          type: 'application/ld+json',
          children: serializeJsonLd(websiteJsonLd(locale)),
        },
      ],
    }
  },
  component: Home,
})

function Home() {
  const { topics } = Route.useLoaderData()
  const t = useT()
  const h = t.home
  const published = topics.filter((x) => x.status === 'publish').length
  const featured = topics.slice(0, 3)

  return (
    <main className="page-wrap px-4 pb-16 pt-16">
      {/* ── 1. Hero ────────────────────────────────────────── */}
      <section className="rise relative">
        {/* 数据晶体 SVG 水印 */}
        <CrystalWatermark />

        <p className="kicker mb-4">{h.kicker}</p>

        <h1 className="display mb-6 max-w-4xl text-balance text-4xl leading-[1.12] font-extrabold tracking-tight text-[var(--fg)] sm:text-6xl sm:leading-[1.08]">
          {h.heroLine1}
          {/* 窄屏让整句自然流动换行；宽屏(sm+)才强制成两行的设计感 */}
          <br className="hidden sm:block" />
          {h.heroLine2}
          <span className="text-[var(--accent)]">{h.heroEmphasis}</span>
          <span className="cursor" />
        </h1>

        <p className="mb-9 max-w-2xl text-base leading-8 text-[var(--fg-soft)] sm:text-lg">
          {h.heroBody}
          <strong className="text-[var(--fg)]">{h.heroBodyStrong}</strong>
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/{-$locale}/research" className="btn-primary">
            {h.ctaBrowse}
          </Link>
          <Link to="/{-$locale}/about" className="btn-ghost">
            {h.ctaHow}
          </Link>
        </div>
      </section>

      {/* ── 2. 大数字可信度条 ───────────────────────────────── */}
      <section
        className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--border)] sm:grid-cols-4"
        aria-label={h.stats.topics}
      >
        <StatBlock value={String(topics.length)} label={h.stats.topics} />
        <StatBlock value={String(published)} label={h.stats.published} accent />
        <StatBlock value="100%" label={h.stats.primarySourced} />
        <StatBlock value={h.stats.reproducibleValue} label={h.stats.reproducible} mono />
      </section>

      {/* ── 3. 研究领域（4 格静态） ─────────────────────────── */}
      <section className="mt-20">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="display text-2xl font-bold text-[var(--fg)] sm:text-3xl">{h.domains.heading}</h2>
          <span className="kicker">domains/</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {h.domains.items.map((d) => (
            <DomainCard key={d.title} icon={d.icon} title={d.title} desc={d.desc} />
          ))}
        </div>
      </section>

      {/* ── 4. 精选研究 ────────────────────────────────────── */}
      <section className="mt-20">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="display text-2xl font-bold text-[var(--fg)] sm:text-3xl">{h.featured.heading}</h2>
          <Link
            to="/{-$locale}/research"
            className="mono text-sm text-[var(--fg-soft)] transition-colors hover:text-[var(--accent)]"
          >
            {h.featured.all}
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((x, i) => (
              <TopicCard
                key={x.slug}
                topic={x}
                featured
                style={{ animationDelay: `${i * 100 + 120}ms` }}
              />
            ))}
          </div>
        ) : (
          <div className="card p-10 text-center">
            <p className="mono text-sm text-[var(--muted)]">{h.featured.empty}</p>
          </div>
        )}
      </section>

      {/* ── 5. 为什么可信 ──────────────────────────────────── */}
      <section className="card mt-20 p-6 sm:p-8">
        <p className="kicker mb-3">{h.trust.kicker}</p>
        <h2 className="display mb-6 text-xl font-bold text-[var(--fg)]">{h.trust.heading}</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {h.trust.items.map((item) => (
            <TrustItem key={item.title} title={item.title} desc={item.desc} />
          ))}
        </div>
      </section>

      {/* ── 6. 末尾 CTA ───────────────────────────────────── */}
      <section className="mt-20 flex flex-col items-center gap-4 py-12 text-center">
        <p className="kicker">{h.cta.kicker}</p>
        <h2 className="display text-2xl font-bold text-[var(--fg)] sm:text-3xl">
          {h.cta.heading}
        </h2>
        <p className="max-w-lg text-sm leading-7 text-[var(--fg-soft)]">
          {h.cta.body}
        </p>
        <Link to="/{-$locale}/contribute" className="btn-primary mt-2">
          {h.cta.button}
        </Link>
      </section>
    </main>
  )
}

/* ── 子组件 ─────────────────────────────────────────────── */

/** 大数字可信度条的单格 */
function StatBlock({
  value,
  label,
  accent,
  mono,
}: {
  value: string
  label: string
  accent?: boolean
  mono?: boolean
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 bg-[var(--card)] px-4 py-6 text-center">
      <div
        className={[
          'font-bold leading-none',
          mono ? 'mono text-lg sm:text-xl' : 'display text-3xl sm:text-4xl',
          accent ? 'text-[var(--accent)]' : 'text-[var(--fg)]',
        ].join(' ')}
      >
        {value}
      </div>
      <div className="mono mt-1 text-xs text-[var(--muted)]">{label}</div>
    </div>
  )
}

/** 研究领域卡片（静态文案） */
function DomainCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="card p-5">
      <div className="mono mb-3 text-2xl text-[var(--accent-2)]" aria-hidden="true">
        {icon}
      </div>
      <h3 className="mb-2 text-sm font-semibold text-[var(--fg)]">{title}</h3>
      <p className="m-0 text-sm leading-6 text-[var(--fg-soft)]">{desc}</p>
    </div>
  )
}

/** 可信度区的单条 */
function TrustItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-[var(--fg)]">{title}</h3>
      <p className="m-0 text-sm leading-6 text-[var(--fg-soft)]">{desc}</p>
    </div>
  )
}

/** 数据晶体 SVG 水印 —— 纯装饰，不影响布局 */
function CrystalWatermark() {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      className="pointer-events-none absolute -right-8 -top-8 w-64 opacity-[0.04] sm:w-80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 数据晶体：六边形 + 内嵌三角分割 */}
      <polygon
        points="100,10 180,55 180,145 100,190 20,145 20,55"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
      <polygon
        points="100,10 180,145 20,145"
        stroke="var(--accent-2)"
        strokeWidth="1"
        strokeDasharray="4 3"
      />
      <polygon
        points="100,190 20,55 180,55"
        stroke="var(--accent-2)"
        strokeWidth="1"
        strokeDasharray="4 3"
      />
      <line x1="100" y1="10" x2="100" y2="190" stroke="var(--accent)" strokeWidth="0.8" />
      <line x1="20" y1="55" x2="180" y2="145" stroke="var(--accent)" strokeWidth="0.8" />
      <line x1="180" y1="55" x2="20" y2="145" stroke="var(--accent)" strokeWidth="0.8" />
      <circle cx="100" cy="100" r="18" stroke="var(--accent-2)" strokeWidth="1" />
    </svg>
  )
}
