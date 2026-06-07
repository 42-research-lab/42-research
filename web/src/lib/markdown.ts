/**
 * markdown.ts — HTML 产物 → Markdown 转换
 *
 * topicToMarkdown: 生成带 YAML frontmatter + 纯文本正文的 Markdown 字符串。
 * 正文简单去 HTML 标签，保留段落与标题结构，无外部依赖。
 */
import type { Topic } from '../data/topics'
import { SITE, topicUrl } from './site'

/**
 * 将 HTML 字符串转换为适合 Markdown 正文的纯文本。
 * - 标题标签 (h1-h6) → Markdown ATX 标题
 * - 段落 → 换行分隔
 * - 其余标签去除，保留文字内容
 * - HTML 实体做基本还原
 */
export function htmlToText(html: string): string {
  // 标题 h1-h6 → ATX Markdown
  let text = html
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n')
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n')
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n')
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n#### $1\n')
    .replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, '\n##### $1\n')
    .replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, '\n###### $1\n')

  // 段落与块级元素后加换行
  text = text
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/blockquote>/gi, '\n')

  // 去除所有剩余 HTML 标签
  text = text.replace(/<[^>]+>/g, '')

  // 还原常见 HTML 实体
  text = text
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&nbsp;/gi, ' ')

  // 合并多余空行（超过 2 个连续换行 → 2 个）
  text = text.replace(/\n{3,}/g, '\n\n').trim()

  return text
}

/**
 * 生成带 YAML frontmatter + 正文的 Markdown 字符串。
 * bodyText 为已处理的纯文本正文（由调用方从 HTML 产物提取并转换）。
 * bodyText 为空时降级使用 topic.abstract。
 */
export function topicToMarkdown(topic: Topic, bodyText: string): string {
  const canonical = topicUrl(topic.slug)

  // YAML frontmatter
  const frontmatter = [
    '---',
    `title: "${topic.title.replace(/"/g, '\\"')}"`,
    `slug: ${topic.slug}`,
    `category: "${topic.category}"`,
    `datePublished: ${topic.datePublished}`,
    `citations: ${topic.citations}`,
    `canonical: ${canonical}`,
    `status: ${topic.status}`,
    `keywords: [${topic.keywords.map((k) => `"${k}"`).join(', ')}]`,
    '---',
  ].join('\n')

  // 正文：优先使用转换后的 bodyText，否则降级 abstract
  const body = bodyText.trim() || topic.abstract

  const sections = [
    frontmatter,
    '',
    `# ${topic.title}`,
    '',
    `> **TL;DR** — ${topic.tldr}`,
    '',
    `**摘要**：${topic.abstract}`,
    '',
    '---',
    '',
    body,
    '',
    '---',
    '',
    `*来源：[${SITE.name}](${SITE.baseUrl}) · canonical: ${canonical}*`,
  ]

  return sections.join('\n')
}
