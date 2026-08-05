import { expect, test } from 'vitest'
import { extractBody, extractJsonLd, extractScopedStyles } from './artifact'

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

test('extractBody 剥离 artifact-interactive 标记区块（lightbox 等）', () => {
  const html = `<html><body><main><p>正文</p><!-- artifact-interactive-start --><div class="lb">弹层内容</div><script>lb()</script><!-- artifact-interactive-end --></main></body></html>`
  const b = extractBody(html)
  expect(b).toContain('正文')
  expect(b).not.toContain('弹层内容')
  expect(b).not.toContain('lb()')
})

test('extractScopedStyles 收集样式并做 @scope 隔离与 :root/body 改写', () => {
  const html = `<html><head><style>:root { --fg: #fff; } body { margin: 0; } .card { color: var(--fg); }</style></head><body><p>x</p></body></html>`
  const css = extractScopedStyles(html)
  expect(css).toContain('@scope (.artifact-html)')
  expect(css).toContain(':scope { --fg: #fff; }')
  expect(css).toContain(':scope { margin: 0; }')
  expect(css).toContain('.card { color: var(--fg); }')
  expect(css).not.toContain(':root')
})

test('extractScopedStyles 跳过交互区块内的样式，且不误伤 tbody 等选择器', () => {
  const html = `<html><body><style>tbody tr { color: red; }</style><!-- artifact-interactive-start --><style>.lb { display: none; }</style><!-- artifact-interactive-end --></body></html>`
  const css = extractScopedStyles(html)
  expect(css).toContain('tbody tr { color: red; }')
  expect(css).not.toContain('.lb')
})

test('extractScopedStyles 无样式返回空字符串', () => {
  expect(extractScopedStyles('<html><body><p>x</p></body></html>')).toBe('')
})
