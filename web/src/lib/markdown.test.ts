import { expect, test } from 'vitest'
import { htmlToText, topicToMarkdown } from './markdown'
import { topicUrl } from './site'
import type { Topic } from '../data/topics'

const mockTopic: Topic = {
  slug: 'test-topic',
  no: '99',
  title: '测试课题标题',
  abstract: '这是摘要内容',
  status: 'publish',
  hypothesis: '假设',
  conclusion: '结论',
  keywords: ['keyword1', 'keyword2'],
  datePublished: '2026-06-07',
  citations: 5,
  artifact: '/topics/99-test-topic/index.html',
  category: '框架选型',
  tldr: '一句话结论',
}

test('htmlToText 转换标题标签', () => {
  const html = '<h1>标题一</h1><h2>标题二</h2><p>段落内容</p>'
  const text = htmlToText(html)
  expect(text).toContain('# 标题一')
  expect(text).toContain('## 标题二')
  expect(text).toContain('段落内容')
  expect(text).not.toContain('<h1>')
  expect(text).not.toContain('<p>')
})

test('htmlToText 还原 HTML 实体', () => {
  const html = '<p>&amp; &lt; &gt; &quot; &nbsp;</p>'
  const text = htmlToText(html)
  expect(text).toContain('&')
  expect(text).toContain('<')
  expect(text).toContain('>')
  expect(text).toContain('"')
})

test('htmlToText 去除所有 HTML 标签', () => {
  const html = '<div class="x"><span>文字</span></div>'
  const text = htmlToText(html)
  expect(text).not.toContain('<')
  expect(text).toContain('文字')
})

test('topicToMarkdown 含 YAML frontmatter 关键字段', () => {
  const md = topicToMarkdown(mockTopic, '正文内容')
  expect(md).toContain('---')
  expect(md).toContain(`title: "${mockTopic.title}"`)
  expect(md).toContain(`slug: ${mockTopic.slug}`)
  expect(md).toContain(`category: "${mockTopic.category}"`)
  expect(md).toContain(`datePublished: ${mockTopic.datePublished}`)
  expect(md).toContain(`citations: ${mockTopic.citations}`)
  expect(md).toContain(`canonical: ${topicUrl(mockTopic.slug)}`)
  expect(md).toContain(`status: ${mockTopic.status}`)
})

test('topicToMarkdown 含正文内容', () => {
  const md = topicToMarkdown(mockTopic, '这是正文内容')
  expect(md).toContain('这是正文内容')
  expect(md).toContain(mockTopic.tldr)
  expect(md).toContain(mockTopic.abstract)
})

test('topicToMarkdown 正文为空时降级 abstract', () => {
  const md = topicToMarkdown(mockTopic, '')
  expect(md).toContain(mockTopic.abstract)
})

test('topicToMarkdown canonical 链接正确', () => {
  const md = topicToMarkdown(mockTopic, '内容')
  const canonical = topicUrl(mockTopic.slug)
  expect(md).toContain(canonical)
})
