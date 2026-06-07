import { createFileRoute, Link } from '@tanstack/react-router'
import { SITE } from '../lib/site'
import { en } from '../i18n/en'
import { useT } from '../i18n/useLocale'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: en.about.metaTitle },
      {
        name: 'description',
        content: en.about.metaDescription,
      },
    ],
    links: [{ rel: 'canonical', href: `${SITE.baseUrl}/about` }],
  }),
  component: About,
})

function About() {
  const t = useT()
  const a = t.about
  return (
    <main className="page-wrap px-4 pb-16 pt-16">
      {/* Hero — 关于这个项目 */}
      <section className="rise">
        <p className="kicker mb-4">{a.kicker}</p>
        <h1 className="display mb-6 max-w-3xl text-4xl leading-[1.08] font-extrabold tracking-tight text-[var(--fg)] sm:text-6xl">
          {a.heading}
          <span className="cursor" />
        </h1>
        <p className="max-w-2xl text-base leading-8 text-[var(--fg-soft)] sm:text-lg">
          {a.heroBody}
        </p>
      </section>

      {/* 我们相信什么 */}
      <section className="card mt-12 p-6 sm:p-8">
        <p className="kicker mb-4">{a.why.kicker}</p>
        <h2 className="display mb-4 text-xl font-bold text-[var(--fg)]">{a.why.heading}</h2>
        <p className="mb-4 text-sm leading-7 text-[var(--fg-soft)] sm:text-base">
          {a.why.p1a}
          <strong className="text-[var(--fg)]">{a.why.p1b}</strong>
          {a.why.p1c}
        </p>
        <p className="text-sm leading-7 text-[var(--fg-soft)] sm:text-base">
          {a.why.p2a}
          <strong className="text-[var(--fg)]">{a.why.p2b}</strong>
          {a.why.p2c}
          <strong className="text-[var(--fg)]">{a.why.p2d}</strong>
          {a.why.p2e}
        </p>
      </section>

      {/* 第一性原理 */}
      <section className="mt-20">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="display text-2xl font-bold text-[var(--fg)] sm:text-3xl">{a.principles.heading}</h2>
          <span className="kicker">{a.principles.kicker}</span>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {a.principles.items.map((p, i) => (
            <div
              key={p.no}
              className="card rise p-6"
              style={{ animationDelay: `${i * 70 + 80}ms` }}
            >
              <span className="mono text-2xl font-bold text-[var(--border-hi)]">{p.no}</span>
              <h3 className="display mt-3 text-lg font-bold text-[var(--fg)]">{p.title}</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--fg-soft)]">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 课题生命周期 */}
      <section className="mt-20">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="display text-2xl font-bold text-[var(--fg)] sm:text-3xl">{a.lifecycle.heading}</h2>
          <span className="kicker">{a.lifecycle.kicker}</span>
        </div>
        <ol className="grid gap-3">
          {a.lifecycle.items.map((s, i) => (
            <li
              key={s.stage}
              className="card flex items-center gap-4 p-4 sm:p-5"
            >
              <span className="mono text-sm font-bold text-[var(--accent)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="mono min-w-28 text-sm font-semibold text-[var(--fg)]">
                {s.stage}
              </span>
              <span className="text-sm leading-6 text-[var(--fg-soft)]">{s.desc}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* 引用标准 + 对抗验证 */}
      <section className="mt-20 grid gap-5 sm:grid-cols-2">
        <div className="card p-6 sm:p-8">
          <p className="kicker mb-3">{a.citation.kicker}</p>
          <h2 className="display mb-4 text-xl font-bold text-[var(--fg)]">{a.citation.heading}</h2>
          <p className="mb-3 text-sm leading-7 text-[var(--fg-soft)]">
            <strong className="text-[var(--fg)]">{a.citation.p1a}</strong>
            {a.citation.p1b}
            <strong className="text-[var(--fg)]">{a.citation.p1c}</strong>
            {a.citation.p1d}
          </p>
          <p className="text-sm leading-7 text-[var(--fg-soft)]">
            {a.citation.p2}
          </p>
        </div>
        <div className="card p-6 sm:p-8">
          <p className="kicker mb-3">{a.adversarial.kicker}</p>
          <h2 className="display mb-4 text-xl font-bold text-[var(--fg)]">{a.adversarial.heading}</h2>
          <p className="mb-3 text-sm leading-7 text-[var(--fg-soft)]">
            {a.adversarial.p1}
          </p>
          <p className="text-sm leading-7 text-[var(--fg-soft)]">
            {a.adversarial.p2}
          </p>
        </div>
      </section>

      {/* 质量门 */}
      <section className="card mt-20 p-6 sm:p-8">
        <p className="kicker mb-3">{a.dod.kicker}</p>
        <h2 className="display mb-6 text-xl font-bold text-[var(--fg)]">{a.dod.heading}</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {a.dod.items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[var(--fg-soft)]">
              <span className="mono mt-0.5 text-[var(--ok)]">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 如何参与 */}
      <section className="mt-20">
        <h2 className="display mb-3 text-xl font-bold text-[var(--fg)]">{a.participate.heading}</h2>
        <p className="mb-6 text-sm leading-7 text-[var(--fg-soft)]">
          {a.participate.body}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/contribute" className="btn-primary">
            {a.participate.ctaSubmit}
          </Link>
          <a
            href={`${SITE.repoUrl}/blob/main/CONTRIBUTING.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            {a.participate.ctaGuide}
          </a>
        </div>
      </section>
    </main>
  )
}
