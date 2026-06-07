/**
 * feed.ts — RSS 2.0 XML 生成
 *
 * 手写字符串，零外部依赖。
 * 只收录 status === 'publish' 的课题。
 */
import { SITE, topicUrl } from './site'
import type { Topic } from '../data/topics'

/** 转义 XML 特殊字符（&<>"'） */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * 将 YYYY-MM-DD 格式日期转换为 RFC 822 格式。
 * 例：2026-06-07 → Sun, 07 Jun 2026 00:00:00 +0000
 */
export function toRfc822(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00Z`)
  return date.toUTCString().replace('GMT', '+0000')
}

/**
 * 生成 RSS 2.0 XML 字符串。
 * 仅收录 status === 'publish' 的课题。
 */
export function buildRss(topics: Topic[]): string {
  const published = topics.filter((t) => t.status === 'publish')

  const items = published
    .map((t) => {
      const link = topicUrl(t.slug)
      const pubDate = toRfc822(t.datePublished)
      const keywords = t.keywords.map(escapeXml).join(', ')

      return [
        '    <item>',
        `      <title>${escapeXml(t.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <description>${escapeXml(t.abstract)}</description>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        `      <category>${escapeXml(t.category)}</category>`,
        keywords ? `      <tags>${keywords}</tags>` : '',
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n')
    })
    .join('\n')

  const buildDate = toRfc822(new Date().toISOString().split('T')[0])

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(SITE.name)}</title>`,
    `    <link>${escapeXml(SITE.baseUrl)}</link>`,
    `    <description>${escapeXml(SITE.description)}</description>`,
    `    <language>${SITE.locale}</language>`,
    `    <lastBuildDate>${buildDate}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(SITE.baseUrl)}/rss.xml" rel="self" type="application/rss+xml"/>`,
    items,
    '  </channel>',
    '</rss>',
  ].join('\n')
}
