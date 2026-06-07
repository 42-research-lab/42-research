import { expect, test } from 'vitest'
import { extractBody, extractJsonLd } from './artifact'

const HTML = `<html><head><script type="application/ld+json">{"@type":"ScholarlyArticle","headline":"X"}</script><style>.a{}</style></head><body><main><h1>标题</h1><p>正文内容</p><script>var x=1</script></main></body></html>`

test('extractBody 取正文且剥离 script/style', () => {
  const b = extractBody(HTML)
  expect(b).toContain('正文内容')
  expect(b).not.toContain('<script')
  expect(b).not.toContain('var x=1')
})

test('extractJsonLd 解析首个 JSON-LD', () => {
  expect(extractJsonLd(HTML)?.headline).toBe('X')
})

test('extractJsonLd 无效返回 null', () => {
  expect(extractJsonLd('<html></html>')).toBeNull()
})

test('extractBody 无 main 时取整个 body', () => {
  const html = `<html><body><p>段落</p><style>body{}</style></body></html>`
  const b = extractBody(html)
  expect(b).toContain('段落')
  expect(b).not.toContain('<style')
})

test('extractBody 无 body 时返回空字符串', () => {
  expect(extractBody('<html><head></head></html>')).toBe('')
})
