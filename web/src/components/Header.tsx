import { Link } from '@tanstack/react-router'
import { LogoMark } from './Logo'
import ThemeToggle from './ThemeToggle'
import LangToggle from './LangToggle'
import { SITE } from '../lib/site'
import { useT } from '../i18n/useLocale'

export default function Header() {
  const t = useT()
  // 目标路径带 {-$locale} 可选参数：Link 会继承当前 URL 的 locale，
  // 在 /zh/* 下导航自然停留在中文前缀，无前缀下停留在默认英文。
  const nav = [
    { to: '/{-$locale}/research', label: t.nav.research },
    { to: '/{-$locale}/contribute', label: t.nav.contribute },
    { to: '/{-$locale}/about', label: t.nav.about },
  ] as const

  return (
    <header className="site-header sticky top-0 z-50 px-2 sm:px-4">
      {/*
        不用 .page-wrap（其 calc(100%-2rem) 会额外吃掉 32px）——改用纯居中+max-width，
        左右留白完全交给 header 的 px-2 sm:px-4，小屏边距更小、给中间更多空间。
      */}
      <nav className="mx-auto flex w-full max-w-[1120px] flex-nowrap items-center gap-3 py-4 sm:gap-4">
        {/*
          收缩优先级（空间不足时）：theme/lang/github 最先缩 → Logo 次之 → 导航最后。
          Logo 容器允许收缩(min-w-0)，字标在小屏退回 42·R 给导航让路；
          导航 shrink-0 永不收缩、whitespace-nowrap 永不折行，确保始终单行平铺。
        */}
        <Link to="/{-$locale}" className="flex min-w-0 flex-shrink items-center gap-2.5 overflow-hidden">
          <LogoMark size={30} />
          <span
            className="mono whitespace-nowrap font-bold tracking-tight text-[var(--fg)]"
            style={{ fontSize: '1.0625rem', letterSpacing: '-0.02em' }}
          >
            42<span className="text-[var(--accent)]">·</span>
            {/* 小屏只显 R，sm+ 显完整 Research（Logo 先于导航让路） */}
            <span className="sm:hidden">R</span>
            <span className="hidden sm:inline">Research</span>
          </span>
        </Link>

        {/* 导航 — 最重要，shrink-0 永不收缩、nowrap 永不折行，始终单行平铺 */}
        <div className="flex shrink-0 flex-nowrap items-center gap-4 sm:ml-4 sm:gap-6">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="nav-link whitespace-nowrap"
              activeProps={{ className: 'nav-link is-active whitespace-nowrap' }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* 右侧：语言下拉 + 主题药丸 + GitHub —— 最先缩 */}
        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-1.5">
          <LangToggle />
          <ThemeToggle />
          <a
            href={SITE.repoUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            title="GitHub"
            // .gh-link（类选择器，优先级 > 全局 `a`）让 GitHub mark 走主题感知的
            // --gh-fg：亮色=官方黑、暗色=浅前景。详见 styles.css。
            className="gh-link rounded-lg p-2 transition hover:bg-[var(--card)]"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" width="20" height="20">
              <path
                fill="currentColor"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
              />
            </svg>
          </a>
        </div>
      </nav>
    </header>
  )
}
