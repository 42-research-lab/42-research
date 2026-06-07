import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  LOCALE_TAG,
  isLocale,
  messages,
  type Locale,
} from './index'
import type { Messages } from './en'

type LocaleContextValue = {
  locale: Locale
  setLocale: (l: Locale) => void
  t: Messages
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

/**
 * Read the initial locale on the client from <html lang> (set by LOCALE_INIT_SCRIPT
 * before paint). On the server this provider renders with DEFAULT_LOCALE ('en'),
 * keeping SSR deterministic and English-first.
 */
function readInitialLocale(): Locale {
  if (typeof document === 'undefined') return DEFAULT_LOCALE
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
  if (isLocale(stored)) return stored
  return document.documentElement.lang.toLowerCase().startsWith('zh')
    ? 'zh'
    : DEFAULT_LOCALE
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  // After hydration, adopt the client's persisted/declared locale.
  useEffect(() => {
    setLocaleState(readInitialLocale())
  }, [])

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, l)
      document.cookie = `${LOCALE_STORAGE_KEY}=${l};path=/;max-age=31536000;samesite=lax`
      document.documentElement.lang = LOCALE_TAG[l]
    } catch {
      /* storage unavailable — keep in-memory state only */
    }
  }, [])

  const value: LocaleContextValue = { locale, setLocale, t: messages(locale) }
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within <LocaleProvider>')
  return ctx
}

/** Shorthand: just the message catalog for the current locale. */
export function useT(): Messages {
  return useLocale().t
}
