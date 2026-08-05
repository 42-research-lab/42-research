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

/** localStorage key for the persisted manual locale choice. */
export const LOCALE_STORAGE_KEY = 'locale'

/**
 * Explicit URL i18n (SEO/GEO): English is the default locale and lives at
 * unprefixed URLs; Chinese lives under the visible /zh prefix. The URL is the
 * single source of truth for the rendered language.
 */
export const LOCALE_PATH_PREFIX: Record<Locale, string> = {
  en: '',
  zh: '/zh',
}

/** Derive the locale from a pathname. '/zh' and '/zh/...' → zh, else en. */
export function localeFromPathname(pathname: string): Locale {
  return pathname === '/zh' || pathname.startsWith('/zh/') ? 'zh' : 'en'
}

/** Strip a locale prefix from a pathname, returning the locale-neutral path ('' for home). */
export function stripLocalePrefix(pathname: string): string {
  const stripped = pathname.replace(/^\/(?:zh|en)(?=\/|$)/, '')
  return stripped === '/' ? '' : stripped
}

/** Rebuild the same page's pathname in another locale. */
export function switchLocalePath(pathname: string, locale: Locale): string {
  return `${LOCALE_PATH_PREFIX[locale]}${stripLocalePrefix(pathname)}` || '/'
}

/** Value for the {-$locale} route param when navigating ('zh' or undefined for default en). */
export function localeParam(locale: Locale): 'zh' | undefined {
  return locale === 'zh' ? 'zh' : undefined
}

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
 *
 * One-shot locale redirect on default (unprefixed) URLs only. Resolution
 * priority: manual choice (localStorage, highest) > browser language > default
 * English. Explicit /zh URLs are never touched — the URL is the source of
 * truth for content. Crawlers carry no stored choice and typically report an
 * English Accept-Language, so they always index the stable default URLs
 * (hreflang alternates point them to /zh).
 */
export const LOCALE_REDIRECT_SCRIPT = `(function(){try{
var p=location.pathname;
if(p==='/zh'||p.indexOf('/zh/')===0)return;
var c=null;try{c=localStorage.getItem('${LOCALE_STORAGE_KEY}')}catch(e){}
var l=(c==='zh'||c==='en')?c:((navigator.language||'').toLowerCase().indexOf('zh')===0?'zh':'en');
if(l==='zh')location.replace('/zh'+(p==='/'?'':p)+location.search+location.hash);
}catch(e){}})();`
