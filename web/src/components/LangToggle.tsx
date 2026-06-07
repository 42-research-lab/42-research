import { useEffect, useRef, useState } from 'react'
import { LOCALES, type Locale } from '../i18n'
import { useLocale } from '../i18n/useLocale'

/** Endonyms — each language labelled in its own script, the international convention. */
const NATIVE: Record<Locale, string> = { en: 'English', zh: '简体中文' }

/* 译字 glyph（文A）— 与参考设计一致的语言标识 icon */
function LangIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 5h7M9 3v2c0 4.4-2.5 7.5-5 9" />
      <path d="M5 9c0 2.4 2.5 4.4 6 5" />
      <path d="m13 19 4-9 4 9M14.5 16h5" />
    </svg>
  )
}

function Chevron() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="transition-transform duration-200 group-hover:rotate-180"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

/**
 * Language switch — an icon trigger that reveals a dropdown of languages on
 * hover (pointer) or focus (keyboard), mirroring the reference design.
 * Each option is shown in its own script (endonym). Persisting + <html lang>
 * is handled by LocaleProvider.
 */
export default function LangToggle() {
  const { locale, setLocale } = useLocale()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Hover is handled by CSS (group-hover); focus-within drives keyboard `open`.
  // A click outside or Escape closes the focus-opened menu.
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    function onPointer(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  return (
    <div ref={ref} className="group relative">
      <button
        type="button"
        aria-label="Language"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex cursor-pointer items-center gap-1 rounded-lg p-2 text-[var(--muted)] transition hover:bg-[var(--card)] hover:text-[var(--fg)]"
      >
        <LangIcon />
        <Chevron />
      </button>

      {/*
        下拉面板：指针 hover 经 group-hover 显隐，键盘焦点经 open 显隐。
        两条路径用 opacity+pointer-events 切换，避免布局抖动并保持平滑过渡。
      */}
      <div
        role="menu"
        className={[
          'absolute right-0 top-full mt-1 min-w-[10rem] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] p-1 shadow-lg transition duration-150',
          'pointer-events-none translate-y-1 opacity-0',
          'group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100',
          open ? 'pointer-events-auto translate-y-0 opacity-100' : '',
        ].join(' ')}
      >
        {LOCALES.map((l) => {
          const active = l === locale
          return (
            <button
              key={l}
              type="button"
              role="menuitemradio"
              aria-checked={active}
              onClick={() => {
                setLocale(l)
                setOpen(false)
              }}
              className={[
                'flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition',
                active
                  ? 'font-semibold text-[var(--fg)]'
                  : 'text-[var(--muted)] hover:bg-[var(--card-hi)] hover:text-[var(--fg)]',
              ].join(' ')}
            >
              <span>{NATIVE[l]}</span>
              {active && <span className="text-[var(--accent)]">✓</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
