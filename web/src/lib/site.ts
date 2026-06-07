/**
 * Site-wide constants. English is the default language, so the default
 * title/description/tagline here are English and mirror `i18n/en.ts`.
 * Locale-aware UI text lives in the i18n catalog; these defaults feed SSR
 * meta, RSS, sitemap, and llms.txt (machine-readable, English-first).
 */
export const SITE = {
  name: '42-research',
  title: '42-research · Every question worth asking deserves a real answer',
  description:
    '42-research investigates the technical questions people actually care about, and answers them with reproducible, traceable, peer-reviewable methods — no guessing, no echoing unverified claims.',
  /** Primary slogan. */
  tagline: 'Every question worth asking deserves a real answer.',
  baseUrl: 'https://42-research.pages.dev',
  author: 'larrykoo711',
  authorUrl: 'https://github.com/larrykoo711',
  /** GitHub repository (single source of truth for all GitHub links). */
  repoUrl: 'https://github.com/42-research-lab/42-research',
  /** Default locale tag (English-first). */
  locale: 'en',
} as const

export const topicUrl = (slug: string) => `${SITE.baseUrl}/research/${slug}`
