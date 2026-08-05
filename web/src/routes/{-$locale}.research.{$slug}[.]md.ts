import { createFileRoute } from '@tanstack/react-router'
import { localizeTopic, topics } from '../data/topics'
import { resolveLocale } from '../i18n'
import { extractBody } from '../lib/artifact'
import { htmlToText, topicToMarkdown } from '../lib/markdown'

/**
 * GET /research/{slug}.md 与 /zh/research/{slug}.md — Markdown 端点
 * （AI Agent / MCP / LLM 消费，见 ADR-004；显式 URL 国际化后每个语言一个端点）。
 *
 * 独立路由文件，路径用 {$slug}[.]md 后缀参数匹配，与页面路由分离：
 * 页面路由不再需要 GET handler 放行逻辑（start-server-core 1.169+ 要求 handler
 * 必须返回 Response，旧的「返回 undefined 落回组件」写法会 500）。
 *
 * server handler 不经过布局路由 beforeLoad，locale 参数在此就地校验。
 *
 * production / wrangler dev：env.ASSETS.fetch 读产物 HTML。
 * vite dev：同源 fetch（request.url 推导 origin）。
 * 失败时降级 abstract，绝不崩溃。
 */
export const Route = createFileRoute('/{-$locale}/research/{$slug}.md')({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const topic = topics.find((t) => t.slug === params.slug)
        const validLocale = params.locale === undefined || params.locale === 'zh'

        if (!topic || !validLocale) {
          return new Response(`# 404 Not Found\n\nNo topic found for: ${params.slug}`, {
            status: 404,
            headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
          })
        }

        const locale = resolveLocale(params.locale)
        const loc = localizeTopic(topic, locale)

        let bodyText = ''
        try {
          let res: Response
          if (import.meta.env.PROD) {
            const { env } = await import('cloudflare:workers')
            res = await env.ASSETS.fetch(new URL(loc.artifact, 'https://assets.local'))
          } else {
            const origin = new URL(request.url).origin
            res = await fetch(new URL(loc.artifact, origin))
          }
          if (res.ok) {
            const html = await res.text()
            bodyText = htmlToText(extractBody(html))
          }
        } catch {
          // 降级：bodyText 为空，topicToMarkdown 使用 abstract 兜底
        }

        return new Response(topicToMarkdown(topic, bodyText, locale), {
          status: 200,
          headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
          },
        })
      },
    },
  },
})
