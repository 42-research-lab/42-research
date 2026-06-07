import { Link } from '@tanstack/react-router'
import { LogoMark } from './Logo'

interface ErrorPageProps {
  /** HTTP 状态码或错误代号，如 '404' / '500' / '403' */
  code: string
  /** 标题 */
  title: string
  /** 一句话说明 */
  message: string
  /** 可选：重试回调（运行时错误用），有则显示「重试」按钮 */
  onRetry?: () => void
  /** 可选：技术错误详情（仅开发期/可折叠展示） */
  detail?: string
}

/**
 * 全站统一的品牌化错误页 —— 404 / 500 / 403 等复用。
 * 延续 Research Terminal 美学：数据晶体水印 + 终端 kicker + 大号代号。
 * 文案呼应项目精神（「没找到答案」的双关），暗/亮主题自适配（CSS 变量）。
 */
export default function ErrorPage({ code, title, message, onRetry, detail }: ErrorPageProps) {
  return (
    <main className="page-wrap relative flex min-h-[70vh] flex-col items-center justify-center px-4 py-24 text-center">
      {/* 数据晶体水印 */}
      <svg
        viewBox="0 0 200 200"
        aria-hidden="true"
        className="pointer-events-none absolute top-12 w-72 opacity-[0.05] sm:w-96"
        fill="none"
      >
        <polygon points="100,10 180,55 180,145 100,190 20,145 20,55" stroke="var(--accent)" strokeWidth="1.5" />
        <line x1="100" y1="10" x2="100" y2="190" stroke="var(--accent)" strokeWidth="0.8" />
        <line x1="20" y1="55" x2="180" y2="145" stroke="var(--accent-2)" strokeWidth="0.8" />
        <line x1="180" y1="55" x2="20" y2="145" stroke="var(--accent-2)" strokeWidth="0.8" />
      </svg>

      <div className="relative flex flex-col items-center gap-5">
        <LogoMark size={40} />

        <p className="kicker">// error · {code}</p>

        <h1 className="display text-6xl font-extrabold tracking-tight text-[var(--fg)] sm:text-8xl">
          {code}
        </h1>

        <h2 className="display text-xl font-bold text-[var(--fg)] sm:text-2xl">{title}</h2>

        <p className="max-w-md text-sm leading-7 text-[var(--fg-soft)]">{message}</p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className="btn-primary">
            返回首页
          </Link>
          <Link to="/research" className="btn-ghost">
            浏览研究
          </Link>
          {onRetry && (
            <button type="button" onClick={onRetry} className="btn-ghost">
              重试
            </button>
          )}
        </div>

        {detail && (
          <details className="mt-6 max-w-xl text-left">
            <summary className="mono cursor-pointer text-xs text-[var(--muted)] hover:text-[var(--fg-soft)]">
              技术详情
            </summary>
            <pre className="mono mt-2 overflow-auto rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 text-xs text-[var(--fg-soft)]">
              {detail}
            </pre>
          </details>
        )}
      </div>
    </main>
  )
}
