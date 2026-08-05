/**
 * GET /llms.txt
 *
 * Follows the llmstxt.org spec to give LLMs / AI agents a map of the site.
 * Lists each topic's .md endpoint (structured, directly consumable) plus key pages.
 * English-first, matching the site's default locale.
 */
import { createFileRoute } from '@tanstack/react-router'
import { localizeTopic, topics } from '../data/topics'
import { SITE, pageUrl, topicUrl } from '../lib/site'

function buildLlmsTxt(): string {
  const publishedTopics = topics.filter((t) => t.status === 'publish')

  // English is the site default (unprefixed URLs); Chinese lives under /zh —
  // both .md endpoint sets are listed so agents can pick the language they need.
  const researchSection = publishedTopics
    .map((t) => {
      const loc = localizeTopic(t, 'en')
      return `- [${loc.title}](${topicUrl(t.slug)}.md): ${loc.tldr}`
    })
    .join('\n')

  const researchZhSection = publishedTopics
    .map((t) => `- [${t.title}](${topicUrl(t.slug, 'zh')}.md): ${t.tldr}`)
    .join('\n')

  const pagesSection = [
    `- [Home](${SITE.baseUrl}): ${SITE.tagline}`,
    `- [Research index](${SITE.baseUrl}/research): All research topics`,
    `- [About](${SITE.baseUrl}/about): Research methodology of 42-research`,
    `- [Contribute](${SITE.baseUrl}/contribute): Submit a research topic`,
    `- [中文站](${pageUrl('', 'zh')}): Chinese edition — every page mirrored under /zh`,
  ].join('\n')

  const topicDetailsSection = publishedTopics
    .map((t) => {
      const loc = localizeTopic(t, 'en')
      return `- [${loc.title}](${topicUrl(t.slug)}): ${loc.abstract}`
    })
    .join('\n')

  return [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    '## Research',
    '',
    'Each link below is a research topic in Markdown, with YAML frontmatter and a structured body — ideal for direct LLM consumption.',
    '',
    researchSection || '(no published topics yet)',
    '',
    '## Research (中文版)',
    '',
    'The same topics in Chinese, served from explicit /zh URLs.',
    '',
    researchZhSection || '(no published topics yet)',
    '',
    '## Research Pages',
    '',
    topicDetailsSection || '(no published topics yet)',
    '',
    '## Pages',
    '',
    pagesSection,
    '',
    '## Data Endpoints',
    '',
    `- [RSS](${SITE.baseUrl}/rss.xml): RSS 2.0, all published topics`,
    `- [Sitemap](${SITE.baseUrl}/sitemap.xml): XML sitemap, en + zh URLs with hreflang alternates`,
    `- [llms.txt](${SITE.baseUrl}/llms.txt): this file, the AI-agent site map`,
    '',
    `---`,
    `*${SITE.name} · ${SITE.baseUrl} · reproducible, traceable technical research*`,
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
