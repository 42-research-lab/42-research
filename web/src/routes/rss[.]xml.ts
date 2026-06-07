/**
 * GET /rss.xml
 *
 * RSS 2.0 订阅源——供 Feed Reader、AI Aggregator 消费。
 * 仅收录 status === 'publish' 的课题。
 */
import { createFileRoute } from '@tanstack/react-router'
import { topics } from '../data/topics'
import { buildRss } from '../lib/feed'

export const Route = createFileRoute('/rss.xml')({
  server: {
    handlers: {
      GET: async () => {
        const xml = buildRss(topics)
        return new Response(xml, {
          status: 200,
          headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
          },
        })
      },
    },
  },
})
