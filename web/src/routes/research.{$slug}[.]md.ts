import { createFileRoute } from '@tanstack/react-router'
import { topics } from '../data/topics'
import { extractBody } from '../lib/artifact'
import { htmlToText, topicToMarkdown } from '../lib/markdown'

/**
 * GET /research/{slug}.md — Markdown 端点（AI Agent / MCP / LLM 消费，见 ADR-004）
 *
 * 独立路由文件，路径用 {$slug}[.]md 后缀参数匹配，与页面路由 /research/$slug 分离：
 * 页面路由不再需要 GET handler 放行逻辑（start-server-core 1.169+ 要求 handler
 * 必须返回 Response，旧的「返回 undefined 落回组件」写法会 500）。
 *
 * production / wrangler dev：env.ASSETS.fetch 读产物 HTML。
 * vite dev：同源 fetch（request.url 推导 origin）。
 * 失败时降级 abstract，绝不崩溃。
 */
export const Route = createFileRoute('/research/{$slug}.md')({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const topic = topics.find((t) => t.slug === params.slug)

        if (!topic) {
          return new Response(`# 404 Not Found\n\nNo topic found for slug: ${params.slug}`, {
            status: 404,
            headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
          })
        }

        let bodyText = ''
        try {
          let res: Response
          if (import.meta.env.PROD) {
            const { env } = await import('cloudflare:workers')
            res = await env.ASSETS.fetch(new URL(topic.artifact, 'https://assets.local'))
          } else {
            const origin = new URL(request.url).origin
            res = await fetch(new URL(topic.artifact, origin))
          }
          if (res.ok) {
            const html = await res.text()
            bodyText = htmlToText(extractBody(html))
          }
        } catch {
          // 降级：bodyText 为空，topicToMarkdown 使用 abstract 兜底
        }

        return new Response(topicToMarkdown(topic, bodyText), {
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
