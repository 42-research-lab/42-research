/**
 * GET /llms.txt
 *
 * 遵循 llmstxt.org 规范，为 LLM/AI Agent 提供站点结构导航。
 * 列出每个研究课题的 .md 端点（结构化、可直接消费）+ 主要页面。
 */
import { createFileRoute } from '@tanstack/react-router'
import { topics } from '../data/topics'
import { SITE, topicUrl } from '../lib/site'

function buildLlmsTxt(): string {
  const publishedTopics = topics.filter((t) => t.status === 'publish')

  const researchSection = publishedTopics
    .map((t) => `- [${t.title}](${SITE.baseUrl}/research/${t.slug}.md): ${t.tldr}`)
    .join('\n')

  const pagesSection = [
    `- [首页](${SITE.baseUrl}): ${SITE.tagline}`,
    `- [研究目录](${SITE.baseUrl}/research): 全部研究课题列表`,
    `- [关于](${SITE.baseUrl}/about): 42-research 的研究方法与三位一体架构`,
    `- [提交课题](${SITE.baseUrl}/contribute): 提交你想看的研究课题`,
  ].join('\n')

  const topicDetailsSection = publishedTopics
    .map((t) => `- [${t.title}](${topicUrl(t.slug)}): ${t.abstract}`)
    .join('\n')

  return [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    '## 研究 (Research)',
    '',
    '以下每个链接为 Markdown 格式的研究课题，含 YAML frontmatter 与结构化正文，适合 LLM 直接消费。',
    '',
    researchSection || '（暂无已发布课题）',
    '',
    '## 研究详情页 (Research Pages)',
    '',
    topicDetailsSection || '（暂无已发布课题）',
    '',
    '## 页面 (Pages)',
    '',
    pagesSection,
    '',
    '## 数据端点 (Data Endpoints)',
    '',
    `- [RSS 订阅](${SITE.baseUrl}/rss.xml): RSS 2.0 格式，含所有已发布课题`,
    `- [Sitemap](${SITE.baseUrl}/sitemap.xml): XML Sitemap，供搜索引擎与 AI 爬虫索引`,
    `- [llms.txt](${SITE.baseUrl}/llms.txt): 本文件，AI Agent 站点导航`,
    '',
    `---`,
    `*${SITE.name} · ${SITE.baseUrl} · 可复现、可溯源的技术研究*`,
  ].join('\n')
}

export const Route = createFileRoute('/llms.txt')({
  server: {
    handlers: {
      GET: async () => {
        return new Response(buildLlmsTxt(), {
          status: 200,
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
          },
        })
      },
    },
  },
})
