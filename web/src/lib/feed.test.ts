import { expect, test } from 'vitest'
import { buildRss, toRfc822 } from './feed'
import { SITE, topicUrl } from './site'
import type { Topic } from '../data/topics'

const publishedTopic: Topic = {
  slug: 'test-published',
  no: '01',
  title: '已发布课题 & 特殊字符 <test>',
  abstract: '摘要内容 "quoted" & ampersand',
  status: 'publish',
  hypothesis: '假设',
  conclusion: '结论',
  keywords: ['rss', 'test'],
  datePublished: '2026-06-07',
  citations: 3,
  artifact: '/topics/01-test-published/index.html',
  category: '测试类别',
  tldr: '一句话',
}

const draftTopic: Topic = {
  slug: 'test-draft',
  no: '02',
  title: '草稿课题',
  abstract: '不应出现在 RSS',
  status: 'hypothesis',
  hypothesis: '假设',
  conclusion: '结论',
  keywords: ['draft'],
  datePublished: '2026-06-07',
  citations: 0,
  artifact: '/topics/02-test-draft/index.html',
  category: '测试',
  tldr: '草稿',
}

test('buildRss 返回合法 RSS 2.0 XML', () => {
  const xml = buildRss([publishedTopic])
  expect(xml).toContain('<rss version="2.0"')
  expect(xml).toContain('</rss>')
  expect(xml).toContain('<channel>')
  expect(xml).toContain('</channel>')
})

test('buildRss 含 channel 元数据', () => {
  const xml = buildRss([publishedTopic])
  expect(xml).toContain(`<title>${SITE.name}</title>`)
  expect(xml).toContain(`<link>${SITE.baseUrl}</link>`)
  expect(xml).toContain('<language>zh-cn</language>')
})

test('buildRss 只收录 publish 状态课题', () => {
  const xml = buildRss([publishedTopic, draftTopic])
  expect(xml).toContain('test-published')
  expect(xml).not.toContain('test-draft')
  expect(xml).not.toContain('不应出现在 RSS')
})

test('buildRss item 含必要字段', () => {
  const xml = buildRss([publishedTopic])
  const link = topicUrl(publishedTopic.slug)
  expect(xml).toContain('<item>')
  expect(xml).toContain('</item>')
  // link 和 guid 含 canonicalUrl（已 XML 转义）
  expect(xml).toContain(link)
  expect(xml).toContain('<pubDate>')
  expect(xml).toContain('<guid isPermaLink="true">')
})

test('buildRss XML 转义特殊字符', () => {
  const xml = buildRss([publishedTopic])
  // 标题中 & → &amp;，< → &lt;，> → &gt;
  expect(xml).toContain('&amp;')
  expect(xml).toContain('&lt;')
  expect(xml).toContain('&gt;')
  // 不应出现未转义的裸 & 或 <test> 在属性/内容中
  // （除了合法 XML 标签本身）
  // 验证摘要转义
  expect(xml).toContain('&quot;quoted&quot;')
})

test('toRfc822 转换日期格式', () => {
  const result = toRfc822('2026-06-07')
  // 格式：DDD, DD Mon YYYY HH:MM:SS +0000
  expect(result).toMatch(/\w{3}, \d{2} \w{3} 2026 \d{2}:\d{2}:\d{2} \+0000/)
})

test('buildRss 无 publish 课题时 items 为空', () => {
  const xml = buildRss([draftTopic])
  expect(xml).not.toContain('<item>')
  expect(xml).toContain('<channel>')
})
