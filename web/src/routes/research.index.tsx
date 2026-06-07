import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { topics } from '../data/topics'
import { TopicCard } from '../components/TopicCard'
import { SITE } from '../lib/site'

export const Route = createFileRoute('/research/')({
  loader: () => ({ topics }),
  head: () => ({
    meta: [
      { title: '研究目录 · 42-research' },
      {
        name: 'description',
        content: '42-research 全部研究课题，按时间倒序。每篇可溯源、可复现。',
      },
      { property: 'og:title', content: '研究目录 · 42-research' },
      {
        property: 'og:description',
        content: '42-research 全部研究课题，按时间倒序。每篇可溯源、可复现。',
      },
    ],
    links: [{ rel: 'canonical', href: `${SITE.baseUrl}/research` }],
  }),
  component: ResearchIndex,
})

function ResearchIndex() {
  const { topics } = Route.useLoaderData()

  // 动态算出所有 category（去重，保留出现顺序）
  const categories = useMemo(
    () => ['全部', ...Array.from(new Set(topics.map((t) => t.category)))],
    [topics],
  )

  const [activeCategory, setActiveCategory] = useState<string>('全部')

  const filtered =
    activeCategory === '全部' ? topics : topics.filter((t) => t.category === activeCategory)

  return (
    <main className="page-wrap px-4 pb-16 pt-16">
      {/* 页头 */}
      <section className="rise">
        <p className="kicker mb-4">research/</p>
        <h1 className="display mb-4 text-4xl font-extrabold tracking-tight text-[var(--fg)] sm:text-6xl">
          研究目录
          <span className="cursor" />
        </h1>
        <p className="max-w-2xl text-base leading-8 text-[var(--fg-soft)] sm:text-lg">
          全部课题，按时间倒序。每篇可溯源、可复现。
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
            {cat}
          </button>
        ))}
      </div>

      {/* 卡片网格 */}
      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t, i) => (
            <TopicCard
              key={t.slug}
              topic={t}
              style={{ animationDelay: `${i * 80 + 80}ms` }}
            />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="mono text-sm text-[var(--muted)]">暂无该分类课题</p>
        </div>
      )}
    </main>
  )
}
