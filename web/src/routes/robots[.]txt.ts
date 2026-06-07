/**
 * GET /robots.txt
 *
 * 动态生成，替代 public/robots.txt 静态文件（已删除）。
 * 策略：开源研究站，最大化可见度——允许所有爬虫含主流 AI 爬虫。
 */
import { createFileRoute } from '@tanstack/react-router'
import { SITE } from '../lib/site'

const ROBOTS_TXT = `User-agent: *
Allow: /

# 主流 AI 爬虫 — 全部允许（开源研究站，最大化 AI 可见度）
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: CCBot
Allow: /

User-agent: Bytespider
Allow: /

User-agent: Applebot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: FacebookBot
Allow: /

User-agent: YouBot
Allow: /

User-agent: DuckAssistBot
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: omgili
Allow: /

User-agent: Diffbot
Allow: /

Sitemap: ${SITE.baseUrl}/sitemap.xml
`

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: async () => {
        return new Response(ROBOTS_TXT, {
          status: 200,
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=86400',
          },
        })
      },
    },
  },
})
