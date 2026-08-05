import { Link } from '@tanstack/react-router'
import { LogoMark } from './Logo'
import { SITE } from '../lib/site'
import { useT } from '../i18n/useLocale'

export default function Footer() {
  const t = useT()
  // {-$locale} 由 Link 从当前 URL 继承（中文站内导航停留在 /zh 前缀下）
  const navGroups = [
    {
      title: t.footer.browse,
      links: [
        { to: '/{-$locale}/research', label: t.footer.research },
        { to: '/{-$locale}/about', label: t.footer.about },
        { to: '/{-$locale}/contribute', label: t.footer.contribute },
      ],
    },
  ] as const

  return (
    <footer className="site-footer mt-24 px-4 py-14 text-[var(--muted)]">
      <div className="page-wrap">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          {/* 品牌 + slogan */}
          <div className="flex max-w-xs flex-col gap-3">
            <Link to="/{-$locale}" className="logo-lockup w-fit">
              <LogoMark size={24} />
              <span className="mono text-sm font-bold tracking-tight text-[var(--fg)]">
                42<span className="text-[var(--accent)]">·</span>Research
              </span>
            </Link>
            <p className="m-0 text-sm leading-6 text-[var(--fg-soft)]">
              {t.footer.tagline}
            </p>
          </div>

          {/* 导航分组 + 社交 — 移动端两组并排(grid)，桌面横向 */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:flex sm:gap-16">
            {navGroups.map((group) => (
              <nav key={group.title} className="flex flex-col gap-2.5">
                <p className="kicker text-[0.62rem]">{group.title}</p>
                {group.links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-sm transition hover:text-[var(--fg)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            ))}

            <nav className="flex flex-col gap-2.5">
              <p className="kicker text-[0.62rem]">{t.footer.openSource}</p>
              <a
                href={SITE.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-[var(--fg)] transition hover:text-[var(--accent)]"
              >
                <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor" aria-hidden="true">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
                {t.footer.repo}
              </a>
              <a
                href={`${SITE.repoUrl}/blob/main/CONTRIBUTING.md`}
                target="_blank"
                rel="noreferrer"
                className="text-sm transition hover:text-[var(--fg)]"
              >
                {t.footer.contributing}
              </a>
            </nav>
          </div>
        </div>

        {/* 底部条：版权 + 技术栈 */}
        <div className="mt-12 flex flex-col gap-3 border-t border-[var(--border)] pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="mono m-0 text-[var(--fg-soft)]">{t.footer.license}</p>
          <div className="flex items-center gap-2.5">
            <span className="kicker text-[0.6rem]">{t.footer.builtWith}</span>
            <a
              href="https://tanstack.com/start"
              target="_blank"
              rel="noreferrer"
              title="TanStack Start"
              aria-label="TanStack Start"
              className="text-[var(--muted)] transition hover:text-[var(--fg)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <ellipse cx="12" cy="6" rx="9" ry="3" stroke="currentColor" strokeWidth="1.6" />
                <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" stroke="currentColor" strokeWidth="1.6" />
                <path d="M3 18c0 1.66 4.03 3 9 3s9-1.34 9-3" stroke="currentColor" strokeWidth="1.6" />
                <path d="M3 6v12M21 6v12" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </a>
            <a
              href="https://workers.cloudflare.com"
              target="_blank"
              rel="noreferrer"
              title="Cloudflare Workers"
              aria-label="Cloudflare Workers"
              className="text-[var(--muted)] transition hover:text-[var(--accent)]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M16.5 17H7a4 4 0 1 1 .8-7.92A5 5 0 0 1 17 10.5a3.25 3.25 0 0 1-.5 6.5Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
