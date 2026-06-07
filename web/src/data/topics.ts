/**
 * 课题清单 (research topics index)
 *
 * 当前为静态清单 —— 单一真相源仍是 research/topics/<slug>/index.html 的 JSON-LD
 * (见 ADR-001)。下一步将由构建脚本解析 JSON-LD 自动生成此清单并同步入 D1。
 * 暂以手写清单驱动网站，保证先 ship 可见的展示。
 */
export interface Topic {
  slug: string
  no: string
  title: string
  abstract: string
  status: 'hypothesis' | 'survey' | 'experiment' | 'verify' | 'synthesize' | 'publish'
  hypothesis: string
  conclusion: string
  keywords: string[]
  datePublished: string
  citations: number
  /** 自包含 HTML 产物的公开路径 (放入 web/public/topics/ 供 iframe 渲染) */
  artifact: string
  /** 课题分类 */
  category: string
  /** 一句话结论摘要 */
  tldr: string
  /** 封面图相对路径（可选，阶段 4 填充） */
  cover?: string
  /** 封面图来源说明（可选） */
  coverSource?: string
}

export const topics: Topic[] = [
  {
    slug: 'vibecoding-cloudflare-vs-vercel',
    no: '01',
    title: 'Vibecoding：Cloudflare or Vercel？',
    abstract:
      '对 AI 驱动的 vibecoding 开发模式，Cloudflare（Workers+D1+R2+Vite/VoidZero）与 Vercel（Next.js+v0）谁是长远最佳实践？基于官方一手定价、2026-06 生态趋势与对抗验证。',
    status: 'publish',
    hypothesis:
      '对长远而言，Cloudflare（Workers + D1 + R2 + VoidZero/Vite 工具链）比 Vercel 更适合 AI 驱动的 vibecoding。',
    conclusion:
      '趋势与成本指向 Cloudflare（尤其 2026-06 收购 VoidZero 后的 AI-native 工具链整合），但当下生产成熟度与纯 Next.js 一键闭环仍是 Vercel 的护城河。答案按场景分化，而非一刀切。',
    keywords: ['vibecoding', 'cloudflare', 'vercel', 'tanstack-start', 'edge', 'ai-native'],
    datePublished: '2026-06-06',
    citations: 7,
    artifact: '/topics/01-vibecoding-cloudflare-vs-vercel/index.html',
    category: '框架选型',
    tldr: '趋势与成本指向 Cloudflare，但当下生产成熟度与一键闭环仍是 Vercel 护城河——按场景分化',
    cover: '/topics/01-vibecoding-cloudflare-vs-vercel/cover.png',
    coverSource: 'https://blog.cloudflare.com/voidzero-joins-cloudflare/',
  },
]
