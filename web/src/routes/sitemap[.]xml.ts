/**
 * GET /sitemap.xml
 *
 * 动态生成 XML sitemap：
 * - 静态页：/、/research、/about、/contribute
 * - 每个 topic 的详情页 /research/{slug}（只收 publish 状态）
 * 不收录 /topics（旧路由已废弃）。
 */
import { createFileRoute } from '@tanstack/react-router'
import { topics } from '../data/topics'
import { SITE, topicUrl } from '../lib/site'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildSitemap(): string {
  const today = new Date().toISOString().split('T')[0]

  const staticPages = [
    { loc: SITE.baseUrl, lastmod: today, changefreq: 'weekly', priority: '1.0' },
    { loc: `${SITE.baseUrl}/research`, lastmod: today, changefreq: 'daily', priority: '0.9' },
    { loc: `${SITE.baseUrl}/about`, lastmod: today, changefreq: 'monthly', priority: '0.7' },
    { loc: `${SITE.baseUrl}/contribute`, lastmod: today, changefreq: 'monthly', priority: '0.7' },
  ]

  const topicPages = topics
    .filter((t) => t.status === 'publish')
    .map((t) => ({
      loc: topicUrl(t.slug),
      lastmod: t.datePublished,
      changefreq: 'weekly',
      priority: '0.8',
    }))

  const allPages = [...staticPages, ...topicPages]

  const urlElements = allPages
    .map((page) =>
      [
        '  <url>',
        `    <loc>${escapeXml(page.loc)}</loc>`,
        `    <lastmod>${page.lastmod}</lastmod>`,
        `    <changefreq>${page.changefreq}</changefreq>`,
        `    <priority>${page.priority}</priority>`,
        '  </url>',
      ].join('\n'),
    )
    .join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
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
