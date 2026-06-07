import { createFileRoute, Link } from '@tanstack/react-router'
import { topics } from '../data/topics'
import { TopicCard } from '../components/TopicCard'
import { SITE } from '../lib/site'
import { websiteJsonLd, serializeJsonLd } from '../lib/seo'

export const Route = createFileRoute('/')({
  loader: () => ({ topics }),
  head: () => {
    return {
      meta: [
        { title: SITE.title },
        { name: 'description', content: SITE.description },
        { property: 'og:title', content: SITE.title },
        { property: 'og:description', content: SITE.description },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: `${SITE.baseUrl}/og-image.png` },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: SITE.title },
        { name: 'twitter:description', content: SITE.description },
      ],
      links: [{ rel: 'canonical', href: SITE.baseUrl }],
      scripts: [
        {
          type: 'application/ld+json',
          children: serializeJsonLd(websiteJsonLd()),
        },
      ],
    }
  },
  component: Home,
})

function Home() {
  const { topics } = Route.useLoaderData()
  const published = topics.filter((t) => t.status === 'publish').length
  const featured = topics.slice(0, 3)

  return (
    <main className="page-wrap px-4 pb-16 pt-16">
      {/* ── 1. Hero ────────────────────────────────────────── */}
      <section className="rise relative">
        {/* 数据晶体 SVG 水印 */}
        <CrystalWatermark />

        <p className="kicker mb-4">// research dossier · est. 2026</p>

        <h1 className="display mb-6 max-w-4xl text-balance text-4xl leading-[1.12] font-extrabold tracking-tight text-[var(--fg)] sm:text-6xl sm:leading-[1.08]">
          我们好奇的每一个问题，
          {/* 窄屏让整句自然流动换行；宽屏(sm+)才强制成两行的设计感 */}
          <br className="hidden sm:block" />
          都值得被<span className="text-[var(--accent)]">好好回答</span>
          <span className="cursor" />
        </h1>

        <p className="mb-9 max-w-2xl text-base leading-8 text-[var(--fg-soft)] sm:text-lg">
          42-research 研究技术与科技领域里大家真正关心、却少有人认真求证的问题。每个结论都说明在什么条件下成立、附可点击的一手来源——
          <strong className="text-[var(--fg)]">不猜测，不附和未经核实的说法</strong>。
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/research" className="btn-primary">
            浏览研究 →
          </Link>
          <Link to="/about" className="btn-ghost">
            我们怎么做研究
          </Link>
        </div>
      </section>

      {/* ── 2. 大数字可信度条 ───────────────────────────────── */}
      <section
        className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--border)] sm:grid-cols-4"
        aria-label="站点数据概览"
      >
        <StatBlock value={String(topics.length)} label="研究课题" />
        <StatBlock value={String(published)} label="已发布" accent />
        <StatBlock value="100%" label="结论附一手来源" />
        <StatBlock value="可复现" label="过程公开可查" mono />
      </section>

      {/* ── 3. 研究领域（4 格静态） ─────────────────────────── */}
      <section className="mt-20">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="display text-2xl font-bold text-[var(--fg)] sm:text-3xl">研究领域</h2>
          <span className="kicker">domains/</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DomainCard
            icon="◈"
            title="AI 与机器智能"
            desc="模型能力的真实边界、AI 工具在生产中的适用场景与限制，剥开宣传看数据。"
          />
          <DomainCard
            icon="⬡"
            title="架构与基础设施"
            desc="Edge、云、数据库等方案的实际成本与延迟——按真实用量测算，不看厂商自测。"
          />
          <DomainCard
            icon="◎"
            title="工具与选型"
            desc="框架、平台、付费服务怎么选。给出按场景分化的结论，而非一刀切的推荐。"
          />
          <DomainCard
            icon="◇"
            title="趋势与判断"
            desc="一项技术是真趋势还是炒作？用一手信号和第一性原理判断，记录会被证伪的预测。"
          />
        </div>
      </section>

      {/* ── 4. 精选研究 ────────────────────────────────────── */}
      <section className="mt-20">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="display text-2xl font-bold text-[var(--fg)] sm:text-3xl">精选研究</h2>
          <Link
            to="/research"
            className="mono text-sm text-[var(--fg-soft)] transition-colors hover:text-[var(--accent)]"
          >
            → 全部研究
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((t, i) => (
              <TopicCard
                key={t.slug}
                topic={t}
                featured
                style={{ animationDelay: `${i * 100 + 120}ms` }}
              />
            ))}
          </div>
        ) : (
          <div className="card p-10 text-center">
            <p className="mono text-sm text-[var(--muted)]">研究进行中，首篇即将发布。</p>
          </div>
        )}
      </section>

      {/* ── 5. 为什么可信 ──────────────────────────────────── */}
      <section className="card mt-20 p-6 sm:p-8">
        <p className="kicker mb-3">// why trust this</p>
        <h2 className="display mb-6 text-xl font-bold text-[var(--fg)]">为什么可以相信结论</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <TrustItem
            title="只用一手来源"
            desc="数据取自官方文档或我们直接测量，不引用二手转述与营销材料。每个事实都附可点击的出处。"
          />
          <TrustItem
            title="结论会标明边界"
            desc="每个结论都说明在什么条件下成立、什么条件下不成立——不给你一个假装放之四海皆准的答案。"
          />
          <TrustItem
            title="先自我反驳"
            desc="下结论前主动找反例、质疑自己。把不确定的地方如实标出，而不是藏起来。"
          />
        </div>
      </section>

      {/* ── 6. 末尾 CTA ───────────────────────────────────── */}
      <section className="mt-20 flex flex-col items-center gap-4 py-12 text-center">
        <p className="kicker">// contribute</p>
        <h2 className="display text-2xl font-bold text-[var(--fg)] sm:text-3xl">
          有想看的研究课题？
        </h2>
        <p className="max-w-lg text-sm leading-7 text-[var(--fg-soft)]">
          有什么技术问题你一直想弄清楚、却找不到经得起核实的答案？提交它。我们会用同样的研究流程，给出可溯源的结论。
        </p>
        <Link to="/contribute" className="btn-primary mt-2">
          提交你想看的研究课题 →
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
