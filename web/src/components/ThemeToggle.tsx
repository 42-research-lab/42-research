import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

type ThemeMode = 'light' | 'dark' | 'auto'

const MODE_LABEL: Record<ThemeMode, string> = {
  light: '亮色',
  auto: '跟随系统',
  dark: '暗色',
}

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'auto'
  }

  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark' || stored === 'auto') {
    return stored
  }

  return 'auto'
}

function applyThemeMode(mode: ThemeMode) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const resolved = mode === 'auto' ? (prefersDark ? 'dark' : 'light') : mode

  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(resolved)

  if (mode === 'auto') {
    root.removeAttribute('data-theme')
  } else {
    root.setAttribute('data-theme', mode)
  }

  root.style.colorScheme = resolved
}

/* 太阳图标 — 亮色模式 */
function SunIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
      <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
      <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
    </svg>
  )
}

/* 月亮图标 — 暗色模式 */
function MoonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

/* 半圆图标 — 自动（半亮半暗） */
function AutoIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {/* 暗色半圆（左半） */}
      <path
        d="M12 3a9 9 0 0 0 0 18V3z"
        fill="currentColor"
        opacity="0.9"
      />
      {/* 亮色半圆轮廓（右半） */}
      <path
        d="M12 3a9 9 0 0 1 0 18V3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  )
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('auto')

  useEffect(() => {
    const initialMode = getInitialMode()
    setMode(initialMode)
    applyThemeMode(initialMode)
  }, [])

  // auto 模式下监听系统主题变化
  useEffect(() => {
    if (mode !== 'auto') {
      return
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyThemeMode('auto')

    media.addEventListener('change', onChange)
    return () => {
      media.removeEventListener('change', onChange)
    }
  }, [mode])

  function selectMode(next: ThemeMode) {
    setMode(next)
    applyThemeMode(next)
    window.localStorage.setItem('theme', next)
  }

  const OPTIONS: { mode: ThemeMode; icon: ReactNode }[] = [
    { mode: 'light', icon: <SunIcon /> },
    { mode: 'auto', icon: <AutoIcon /> },
    { mode: 'dark', icon: <MoonIcon /> },
  ]

  // 移动端单 icon 显示「当前生效的主题」并在 light↔dark 间切换。
  // auto 时按系统解析出的实际外观显示对应 icon，点击落到与系统相反的明确模式。
  const prefersDark =
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  const resolved: 'light' | 'dark' =
    mode === 'auto' ? (prefersDark ? 'dark' : 'light') : mode

  return (
    <>
      {/* 桌面（sm+）：三 icon 分段控件 */}
      <div
        role="group"
        aria-label="主题"
        className="hidden items-center gap-0.5 rounded-lg border border-[var(--border)] bg-[var(--card)] p-0.5 sm:flex"
      >
        {OPTIONS.map((opt) => {
          const active = mode === opt.mode
          return (
            <button
              key={opt.mode}
              type="button"
              onClick={() => selectMode(opt.mode)}
              aria-label={`主题：${MODE_LABEL[opt.mode]}`}
              aria-pressed={active}
              title={MODE_LABEL[opt.mode]}
              className={`flex cursor-pointer items-center justify-center rounded-md p-1.5 transition ${
                active
                  ? 'bg-[var(--card-hi)] text-[var(--accent)]'
                  : 'text-[var(--muted)] hover:text-[var(--fg)]'
              }`}
            >
              {opt.icon}
            </button>
          )
        })}
      </div>

      {/* 移动端（<sm）：单 icon，点击在 light↔dark 间切换 */}
      <button
        type="button"
        onClick={() => selectMode(resolved === 'dark' ? 'light' : 'dark')}
        aria-label={resolved === 'dark' ? '切换为亮色' : '切换为暗色'}
        title={resolved === 'dark' ? '切换为亮色' : '切换为暗色'}
        className="flex cursor-pointer items-center justify-center rounded-lg p-2 text-[var(--fg)] transition hover:bg-[var(--card)] sm:hidden"
      >
        {resolved === 'dark' ? <MoonIcon /> : <SunIcon />}
      </button>
    </>
  )
}
