import { createFileRoute, Link } from '@tanstack/react-router'
import { SITE } from '../lib/site'
import { localeAlternates } from '../lib/seo'
import { LOCALE_TAG, messages, resolveLocale } from '../i18n'
import { useT } from '../i18n/useLocale'

export const Route = createFileRoute('/{-$locale}/contribute')({
  loader: ({ params }) => ({ locale: resolveLocale(params.locale) }),
  head: ({ loaderData }) => {
    const locale = loaderData?.locale ?? 'en'
    const m = messages(locale).contribute
    return {
      meta: [
        { title: m.metaTitle },
        { name: 'description', content: m.metaDescription },
        { property: 'og:locale', content: LOCALE_TAG[locale] },
      ],
      links: localeAlternates('/contribute', locale),
    }
  },
  component: Contribute,
})

const GATE_ICONS = ['①', '②', '③', '④']

function Contribute() {
  const t = useT()
  const c = t.contribute
  return (
    <main className="page-wrap px-4 pb-16 pt-16">
      {/* Hero */}
      <section className="rise">
        <p className="kicker mb-4">{c.kicker}</p>
        <h1 className="display mb-6 text-4xl font-extrabold tracking-tight text-[var(--fg)] sm:text-6xl">
          {c.heading}
          <span className="cursor" />
        </h1>
        <p className="max-w-2xl text-base leading-8 text-[var(--fg-soft)] sm:text-lg">
          {c.heroBody}
        </p>
      </section>

      {/* 双路径卡片 */}
      <section className="mt-14 grid gap-5 sm:grid-cols-2">
        {/* 路径一：提 Issue */}
        <div className="card flex flex-col p-6 sm:p-8">
          <p className="kicker mb-3">{c.issue.kicker}</p>
          <h2 className="display mb-3 text-xl font-bold text-[var(--fg)]">{c.issue.heading}</h2>
          <p className="mb-6 flex-1 text-sm leading-7 text-[var(--fg-soft)]">
            {c.issue.body}
          </p>
          <a
            href={`${SITE.repoUrl}/issues/new?template=research-topic.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary self-start"
          >
            {c.issue.cta}
          </a>
        </div>

        {/* 路径二：提 PR */}
        <div className="card flex flex-col p-6 sm:p-8">
          <p className="kicker mb-3">{c.pr.kicker}</p>
          <h2 className="display mb-3 text-xl font-bold text-[var(--fg)]">{c.pr.heading}</h2>
          <p className="mb-6 flex-1 text-sm leading-7 text-[var(--fg-soft)]">
            {c.pr.body}
          </p>
          <a
            href={`${SITE.repoUrl}/blob/main/CONTRIBUTING.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost self-start"
          >
            {c.pr.cta}
          </a>
        </div>
      </section>

      {/* 质量门提示 */}
      <section className="card mt-10 p-6 sm:p-8">
        <p className="kicker mb-3">{c.gate.kicker}</p>
        <h2 className="display mb-5 text-lg font-bold text-[var(--fg)]">{c.gate.heading}</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {c.gate.items.map((text, i) => (
            <li key={text} className="flex items-start gap-3 text-sm leading-6 text-[var(--fg-soft)]">
              <span className="mono mt-0.5 font-bold text-[var(--accent)]">{GATE_ICONS[i]}</span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm leading-7 text-[var(--fg-soft)]">
          {c.gate.noteA}{' '}
          <Link to="/{-$locale}/about" className="text-[var(--accent-2)] hover:text-[var(--fg)]">
            {c.gate.noteLink}
          </Link>
          {c.gate.noteB}
        </p>
      </section>

      <div className="mt-12">
        <Link to="/{-$locale}" className="btn-ghost">
          {c.back}
        </Link>
      </div>
    </main>
  )
}
