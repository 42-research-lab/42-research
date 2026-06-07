import { en, type Messages } from './en'
import { zh } from './zh'

export type Locale = 'en' | 'zh'

/** Default locale of 42-research. English is primary. */
export const DEFAULT_LOCALE: Locale = 'en'
export const LOCALES: Locale[] = ['en', 'zh']

/** BCP-47 tags for <html lang>, og:locale, JSON-LD inLanguage, RSS <language>. */
export const LOCALE_TAG: Record<Locale, string> = {
  en: 'en',
  zh: 'zh-CN',
}

const CATALOG: Record<Locale, Messages> = { en, zh }

/** Cookie/localStorage key for the persisted locale choice. */
export const LOCALE_STORAGE_KEY = 'locale'

export function isLocale(v: unknown): v is Locale {
  return v === 'en' || v === 'zh'
}

/** Return the message catalog for a locale (falls back to default). */
export function messages(locale: Locale): Messages {
  return CATALOG[locale] ?? CATALOG[DEFAULT_LOCALE]
}

/**
 * Resolve a locale from a raw value (cookie, header, etc.), falling back to default.
 * Accepts things like "zh", "zh-CN", "en-US".
 */
export function resolveLocale(raw: string | null | undefined): Locale {
  if (!raw) return DEFAULT_LOCALE
  const lower = raw.toLowerCase()
  if (lower.startsWith('zh')) return 'zh'
  if (lower.startsWith('en')) return 'en'
  return DEFAULT_LOCALE
}

/**
 * Inline script injected before first paint (mirrors THEME_INIT_SCRIPT).
 * Reads the persisted locale and applies <html lang>, so SSR/CSR agree and there is no flash.
 * Default stays English; only an explicit 'zh' choice flips the lang.
 */
export const LOCALE_INIT_SCRIPT = `(function(){try{
var l=localStorage.getItem('${LOCALE_STORAGE_KEY}');
if(!l){var n=(navigator.language||'').toLowerCase();l=n.indexOf('zh')===0?'zh':'en';}
document.documentElement.lang=(l==='zh'?'zh-CN':'en');
}catch(e){}})();`
