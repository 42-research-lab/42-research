import { useEffect, useState } from 'react'

type ThemeMode = 'light' | 'dark' | 'auto'
type Resolved = 'light' | 'dark'

/**
 * `auto` (follow system) is the default before the user ever chooses, but it is
 * intentionally not exposed in the UI — the control only offers an explicit
 * light ↔ dark switch. The first interaction persists a concrete choice.
 */
function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') return 'auto'
  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark' || stored === 'auto') return stored
  return 'auto'
}

function prefersDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyThemeMode(mode: ThemeMode) {
  const resolved: Resolved = mode === 'auto' ? (prefersDark() ? 'dark' : 'light') : mode
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

/* 太阳图标 — 亮色 */
function SunIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
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

/* 月亮图标 — 暗色 */
function MoonIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

/**
 * Theme switch — a pill toggle with a sliding knob (sun on the left for light,
 * moon on the right for dark). The visible state always reflects what the page
 * currently looks like; clicking commits the opposite as an explicit choice and
 * persists it to localStorage, so the browser remembers it across visits.
 */
export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('auto')

  useEffect(() => {
    const initial = getInitialMode()
    setMode(initial)
    applyThemeMode(initial)
  }, [])

  // While in auto, track live system changes so the knob position stays honest.
  useEffect(() => {
    if (mode !== 'auto') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      applyThemeMode('auto')
      // nudge a re-render so the knob follows the system flip
      setMode('auto')
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [mode])

  const resolved: Resolved = mode === 'auto' ? (prefersDark() ? 'dark' : 'light') : mode
  const isDark = resolved === 'dark'

  function toggle() {
    const next: Resolved = isDark ? 'light' : 'dark'
    setMode(next)
    applyThemeMode(next)
    window.localStorage.setItem('theme', next)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="relative flex h-7 w-12 cursor-pointer items-center rounded-full border border-[var(--border)] bg-[var(--card)] px-0.5 transition"
    >
      {/* 滑动拉杆：light 居左、dark 居右 */}
      <span
        className={[
          'flex h-5 w-5 items-center justify-center rounded-full bg-[var(--fg)] text-[var(--bg)] shadow-sm transition-transform duration-200 ease-out',
          isDark ? 'translate-x-5' : 'translate-x-0',
        ].join(' ')}
      >
        {isDark ? <MoonIcon /> : <SunIcon />}
      </span>
    </button>
  )
}
