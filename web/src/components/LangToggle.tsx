import { LOCALES, type Locale } from '../i18n'
import { useLocale } from '../i18n/useLocale'

const SHORT: Record<Locale, string> = { en: 'EN', zh: '中' }
const FULL: Record<Locale, string> = { en: 'English', zh: '中文' }

/**
 * Language switch — a compact segmented control (EN / 中), mirroring ThemeToggle's
 * visual language. Persists the choice and updates <html lang> via LocaleProvider.
 */
export default function LangToggle() {
  const { locale, setLocale } = useLocale()

  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center rounded-lg border border-[var(--border)] p-0.5"
    >
      {LOCALES.map((l) => {
        const active = l === locale
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLocale(l)}
            aria-pressed={active}
            aria-label={FULL[l]}
            title={FULL[l]}
            className={[
              'mono cursor-pointer rounded-md px-2 py-1 text-xs font-semibold transition',
              active
                ? 'bg-[var(--card)] text-[var(--accent)]'
                : 'text-[var(--muted)] hover:text-[var(--fg)]',
            ].join(' ')}
          >
            {SHORT[l]}
          </button>
        )
      })}
    </div>
  )
}
