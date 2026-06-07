import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { topics } from '../data/topics'
import { TopicCard } from '../components/TopicCard'
import { SITE } from '../lib/site'
import { en } from '../i18n/en'
import { useT } from '../i18n/useLocale'

/** Sentinel for "show all categories" — kept separate from the localized label. */
const ALL = '__all__'

export const Route = createFileRoute('/research/')({
  loader: () => ({ topics }),
  head: () => ({
    meta: [
      { title: en.research.metaTitle },
      { name: 'description', content: en.research.metaDescription },
      { property: 'og:title', content: en.research.metaTitle },
      { property: 'og:description', content: en.research.metaDescription },
    ],
    links: [{ rel: 'canonical', href: `${SITE.baseUrl}/research` }],
  }),
  component: ResearchIndex,
})

function ResearchIndex() {
  const { topics } = Route.useLoaderData()
  const t = useT()

  // 动态算出所有 category（去重，保留出现顺序）；ALL 是 sentinel，展示用本地化标签
  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(topics.map((x) => x.category)))],
    [topics],
  )

  const [activeCategory, setActiveCategory] = useState<string>(ALL)

  const filtered =
    activeCategory === ALL ? topics : topics.filter((x) => x.category === activeCategory)

  return (
    <main className="page-wrap px-4 pb-16 pt-16">
      {/* 页头 */}
      <section className="rise">
        <p className="kicker mb-4">{t.research.kicker}</p>
        <h1 className="display mb-4 text-4xl font-extrabold tracking-tight text-[var(--fg)] sm:text-6xl">
          {t.research.heading}
          <span className="cursor" />
        </h1>
        <p className="max-w-2xl text-base leading-8 text-[var(--fg-soft)] sm:text-lg">
          {t.research.body}
        </p>
      </section>

      {/* Category 筛选 chips */}
      <div className="mt-10 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            aria-pressed={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
            className={[
              'mono rounded-full border px-3 py-1 text-xs transition-colors duration-150',
              activeCategory === cat
                ? 'border-[var(--accent)] bg-[var(--accent)] text-[#1a1206]'
                : 'border-[var(--border-hi)] text-[var(--fg-soft)] hover:border-[var(--accent-2)] hover:text-[var(--fg)]',
            ].join(' ')}
          >
            {cat === ALL ? t.research.all : cat}
          </button>
        ))}
      </div>

      {/* 卡片网格 */}
      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((x, i) => (
            <TopicCard
              key={x.slug}
              topic={x}
              style={{ animationDelay: `${i * 80 + 80}ms` }}
            />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="mono text-sm text-[var(--muted)]">{t.research.empty}</p>
        </div>
      )}
    </main>
  )
}
