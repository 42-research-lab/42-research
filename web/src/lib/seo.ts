/**
 * seo.ts — 统一 JSON-LD 生成
 *
 * 单一真相源，避免各页面内联拼接 JSON-LD 逻辑分散。
 * 返回值均为可序列化的 plain object，调用方用
 *   JSON.stringify(obj).replace(/<\/script>/gi, '<\\/script>')
 * 防注入后注入 <script type="application/ld+json">。
 */
import { SITE, topicUrl } from './site'
import type { Topic } from '../data/topics'

/** schema.org WebSite + publisher Organization（用于首页） */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.baseUrl,
    description: SITE.description,
    inLanguage: SITE.locale,
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
