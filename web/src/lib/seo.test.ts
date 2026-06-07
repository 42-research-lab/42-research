import { expect, test } from 'vitest'
import { websiteJsonLd, articleJsonLd, breadcrumbJsonLd, serializeJsonLd } from './seo'
import { SITE, topicUrl } from './site'
import type { Topic } from '../data/topics'

const mockTopic: Topic = {
  slug: 'test-topic',
  no: '99',
  title: '测试课题',
  abstract: '这是摘要',
  status: 'publish',
  hypothesis: '假设内容',
  conclusion: '结论内容',
  keywords: ['test', 'seo'],
  datePublished: '2026-06-07',
  citations: 3,
  artifact: '/topics/99-test-topic/index.html',
  category: '测试',
  tldr: '一句话结论',
}

test('websiteJsonLd 返回 WebSite + Organization', () => {
  const ld = websiteJsonLd()
  expect(ld['@type']).toBe('WebSite')
  expect(ld['@context']).toBe('https://schema.org')
  expect(ld.name).toBe(SITE.name)
  expect(ld.url).toBe(SITE.baseUrl)
  expect(ld.description).toBe(SITE.description)
  expect(ld.inLanguage).toBe(SITE.locale)
  expect((ld.publisher as Record<string, unknown>)['@type']).toBe('Organization')
  expect((ld.publisher as Record<string, unknown>).name).toBe(SITE.name)
})

test('articleJsonLd 返回 ScholarlyArticle 含关键字段', () => {
  const ld = articleJsonLd(mockTopic)
  expect(ld['@type']).toBe('ScholarlyArticle')
  expect(ld['@context']).toBe('https://schema.org')
  expect(ld.headline).toBe(mockTopic.title)
  expect(ld.abstract).toBe(mockTopic.abstract)
  expect(ld.datePublished).toBe(mockTopic.datePublished)
  expect(ld.keywords).toEqual(mockTopic.keywords)
  expect(ld.url).toBe(topicUrl(mockTopic.slug))
  expect((ld.author as Record<string, unknown>)['@type']).toBe('Organization')
  expect((ld.author as Record<string, unknown>).name).toBe('42-research')
})

test('breadcrumbJsonLd 返回 BreadcrumbList 结构正确', () => {
  const items = [
    { name: '首页', url: SITE.baseUrl },
    { name: '研究', url: `${SITE.baseUrl}/research` },
    { name: '测试课题', url: topicUrl('test-topic') },
  ]
  const ld = breadcrumbJsonLd(items)
  expect(ld['@type']).toBe('BreadcrumbList')
  expect(ld['@context']).toBe('https://schema.org')
  expect(Array.isArray(ld.itemListElement)).toBe(true)
  expect(ld.itemListElement).toHaveLength(3)
  const first = ld.itemListElement[0] as Record<string, unknown>
  expect(first['@type']).toBe('ListItem')
  expect(first.position).toBe(1)
  expect(first.name).toBe('首页')
  expect(first.item).toBe(SITE.baseUrl)
  const last = ld.itemListElement[2] as Record<string, unknown>
  expect(last.position).toBe(3)
})

test('serializeJsonLd 防 </script> 注入', () => {
  const ld = { test: '</script><script>alert(1)</script>' }
  const out = serializeJsonLd(ld)
  expect(out).not.toContain('</script>')
  expect(out).toContain('<\\/script>')
})
