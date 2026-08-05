/**
 * seo.ts — 统一 JSON-LD 生成
 *
 * 单一真相源，避免各页面内联拼接 JSON-LD 逻辑分散。
 * 返回值均为可序列化的 plain object，调用方用
 *   JSON.stringify(obj).replace(/<\/script>/gi, '<\\/script>')
 * 防注入后注入 <script type="application/ld+json">。
 */
import { SITE, pageUrl, topicUrl } from './site'
import { LOCALE_TAG, type Locale } from '../i18n'
import type { Topic } from '../data/topics'

/**
 * Explicit-URL i18n head links: per-locale canonical + hreflang alternates
 * (en / zh-CN / x-default → en). `path` is the locale-neutral pathname
 * ('' for home, '/research', '/research/{slug}', ...).
 */
export function localeAlternates(path: string, locale: Locale) {
  const enUrl = pageUrl(path, 'en')
  const zhUrl = pageUrl(path, 'zh')
  // 属性名用小写 hreflang（HeadContent 原样输出属性，不走 React prop 规范化）
  return [
    { rel: 'canonical', href: locale === 'zh' ? zhUrl : enUrl },
    { rel: 'alternate', hreflang: LOCALE_TAG.en, href: enUrl },
    { rel: 'alternate', hreflang: LOCALE_TAG.zh, href: zhUrl },
    { rel: 'alternate', hreflang: 'x-default', href: enUrl },
  ]
}

/** schema.org WebSite + publisher Organization（用于首页，按 locale 标注 URL 与语言） */
export function websiteJsonLd(locale: Locale = 'en') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: pageUrl('', locale),
    description: SITE.description,
    inLanguage: LOCALE_TAG[locale],
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.baseUrl,
      description: SITE.description,
    },
  }
}

/** schema.org ScholarlyArticle（用于研究详情页） */
export function articleJsonLd(topic: Topic) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: topic.title,
    abstract: topic.abstract,
    datePublished: topic.datePublished,
    keywords: topic.keywords,
    author: {
      '@type': 'Organization',
      name: '42-research',
      url: SITE.baseUrl,
    },
    url: topicUrl(topic.slug),
  }
}

/** schema.org BreadcrumbList */
export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * 序列化 JSON-LD 对象为安全字符串（防 </script> 注入）。
 * 供各页面 head() 的 scripts[].children 直接使用。
 */
export function serializeJsonLd(obj: Record<string, unknown>): string {
  return JSON.stringify(obj).replace(/<\/script>/gi, '<\\/script>')
}
