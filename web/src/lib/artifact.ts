/**
 * artifact.ts — 从自包含 HTML 产物中提取正文与 JSON-LD
 *
 * 纯字符串处理，无 DOM，SSR/Worker 安全。
 * 产物由 42-research 自有模板生成，结构可控，正则处理足够稳健。
 */

/**
 * 取 HTML 字符串中的可读正文片段。
 * 优先取 <main>...</main>，否则取 <body>...</body> 全部内容。
 * 剥离所有 <script> 与 <style> 块（含内容）。
 */
export function extractBody(html: string): string {
  // 尝试取 <main>...</main>（dotall + 大小写不敏感）
  const mainMatch = html.match(/<main[\s\S]*?>([\s\S]*?)<\/main>/i)
  // 取 <body>...</body>
  const bodyMatch = html.match(/<body[\s\S]*?>([\s\S]*?)<\/body>/i)

  let content = mainMatch?.[1] ?? bodyMatch?.[1] ?? ''

  // 剥离产物声明的交互区块（lightbox 等，仅在原始产物页生效；SSR/.md 均不需要）
  content = content.replace(
    /<!--\s*artifact-interactive-start\s*-->[\s\S]*?<!--\s*artifact-interactive-end\s*-->/gi,
    '',
  )
  // 剥离 <script>...</script>（含内容，dotall）
  content = content.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
  // 剥离 <style>...</style>（含内容，dotall）
  content = content.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')

  return content.trim()
}

/**
 * 提取产物的内联样式并做作用域隔离，供 SSR 详情页随正文一起注入（保留产物排版）。
 *
 * - 收集全部 <style> 块（跳过 JSON-LD 之类的 script；交互区块内的样式一并跳过——
 *   其对应 DOM 已被 extractBody 剥除）。
 * - `:root` / 顶层 `body` 选择器改写为 `:scope`（产物把变量与底色挂在文档根上，
 *   注入页面时应挂在容器上）。
 * - 整体包进 `@scope (.artifact-html)`：元素选择器（h1/table/p…）只在容器内生效，
 *   不泄漏到站点页面框架；不支持 @scope 的旧浏览器降级为无产物样式（与旧行为一致）。
 */
export function extractScopedStyles(html: string): string {
  const withoutInteractive = html.replace(
    /<!--\s*artifact-interactive-start\s*-->[\s\S]*?<!--\s*artifact-interactive-end\s*-->/gi,
    '',
  )
  const blocks = [...withoutInteractive.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(
    (m) => m[1],
  )
  if (blocks.length === 0) return ''

  const css = blocks
    .join('\n')
    .replace(/:root\b/g, ':scope')
    .replace(/(^|[}\s,])body\b/g, '$1:scope')

  return `@scope (.artifact-html) {\n${css}\n}`
}

/** JSON 可序列化值（供 createServerFn 跨边界传输时类型可序列化校验通过） */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

/** JSON-LD 顶层为对象 */
export type JsonLd = { [key: string]: JsonValue }

/**
 * 解析 HTML 中首个 <script type="application/ld+json"> 的内容。
 * 解析失败或不存在时返回 null。
 */
export function extractJsonLd(html: string): JsonLd | null {
  const match = html.match(
    /<script\s+type=["']application\/ld\+json["'][\s\S]*?>([\s\S]*?)<\/script>/i,
  )
  if (!match) return null
  try {
    return JSON.parse(match[1].trim())
  } catch {
    return null
  }
}
