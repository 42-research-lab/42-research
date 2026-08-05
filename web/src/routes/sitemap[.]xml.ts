/**
 * GET /sitemap.xml
 *
 * 动态生成 XML sitemap（显式 URL 国际化）：
 * - 每个页面收录 en（无前缀，x-default）与 zh（/zh 前缀）两个 URL
 * - 每个 <url> 都带完整 xhtml:link hreflang alternates（Google 多语言 sitemap 规范）
 * - 课题详情页只收 publish 状态；不收录 /topics（旧路由已废弃）
 */
import { createFileRoute } from '@tanstack/react-router'
import { topics } from '../data/topics'
import { pageUrl } from '../lib/site'
import { LOCALE_TAG } from '../i18n'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

interface Page {
  /** locale-neutral path: '' for home, '/research', '/research/{slug}' ... */
  path: string
  lastmod: string
  changefreq: string
  priority: string
}

/** 一个逻辑页面展开为 en + zh 两个 <url>，共享同一组 hreflang alternates */
function pageToUrlElements(page: Page): string {
  const enUrl = escapeXml(pageUrl(page.path, 'en'))
  const zhUrl = escapeXml(pageUrl(page.path, 'zh'))
  const alternates = [
    `    <xhtml:link rel="alternate" hreflang="${LOCALE_TAG.en}" href="${enUrl}"/>`,
    `    <xhtml:link rel="alternate" hreflang="${LOCALE_TAG.zh}" href="${zhUrl}"/>`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/>`,
  ]
  return [enUrl, zhUrl]
    .map((loc) =>
      [
        '  <url>',
        `    <loc>${loc}</loc>`,
        ...alternates,
        `    <lastmod>${page.lastmod}</lastmod>`,
        `    <changefreq>${page.changefreq}</changefreq>`,
        `    <priority>${page.priority}</priority>`,
        '  </url>',
      ].join('\n'),
    )
    .join('\n')
}

function buildSitemap(): string {
  const today = new Date().toISOString().split('T')[0]

  const staticPages: Page[] = [
    { path: '', lastmod: today, changefreq: 'weekly', priority: '1.0' },
    { path: '/research', lastmod: today, changefreq: 'daily', priority: '0.9' },
    { path: '/about', lastmod: today, changefreq: 'monthly', priority: '0.7' },
    { path: '/contribute', lastmod: today, changefreq: 'monthly', priority: '0.7' },
  ]

  const topicPages: Page[] = topics
    .filter((t) => t.status === 'publish')
    .map((t) => ({
      path: `/research/${t.slug}`,
      lastmod: t.datePublished,
      changefreq: 'weekly',
      priority: '0.8',
    }))

  const urlElements = [...staticPages, ...topicPages].map(pageToUrlElements).join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    urlElements,
    '</urlset>',
  ].join('\n')
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        return new Response(buildSitemap(), {
          status: 200,
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
          },
        })
      },
    },
  },
})
