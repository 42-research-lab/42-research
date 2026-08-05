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
  {
    slug: 'mai-image-25-vs-gpt-image-2',
    no: '02',
    title: 'MAI-Image-2.5 vs GPT-Image-2：微软自研生图追上 OpenAI 了吗？',
    abstract:
      '在 Azure AI Foundry 上以同一组 10 场景 prompt 实测 MAI-Image-2.5 三档与 GPT-Image-2 两档（50 请求、46 成功、4 个被内容过滤拦截），延迟与 token 用量取自逐请求台账并脱敏公开。结论按内容类型分化：文字渲染归 GPT，人像摄影归 MAI——后者在 Azure 默认内容过滤下是唯一可用选项。',
    status: 'publish',
    hypothesis:
      'MAI-Image-2.5 系列的生图质量已足以在生产环境替代 GPT-Image-2 作为默认生图模型。判据：同 prompt 实测 10 场景中，MAI 至少半数场景不劣于 GPT-Image-2 medium，且不存在「整类需求不可用」的硬缺陷。',
    conclusion:
      '假设部分成立、按内容类型分化：人像/真人摄影场景 MAI 三款不仅达标，且在 Azure 默认内容过滤下是唯一可用选项（GPT 两档请求被拦截）；但中文/高密度文字渲染 GPT 两档近乎零错字、MAI 三款均有字形级错字，文字类需求 MAI 不能替代 GPT。通用配图与人像走 MAI-Image-2.5，文字海报/漫画走 GPT-Image-2 medium。结论仅在默认过滤配置、1024×1024、单次生成的边界内成立。',
    keywords: ['mai-image-2.5', 'gpt-image-2', 'azure-ai-foundry', 'image-generation', 'content-filter', 'model-evaluation', 'text-to-image'],
    datePublished: '2026-08-05',
    citations: 9,
    artifact: '/topics/02-mai-image-25-vs-gpt-image-2/index.html',
    category: '模型评测',
    tldr: '文字归 GPT、人像归 MAI：中文海报 GPT 近乎零错字，MAI 三款均有字形级错字；真人题材 GPT 被 Azure 默认内容过滤拦截、MAI 是唯一可用选项；延迟差十倍，同档成本持平——分流是唯一理性解',
    cover: '/topics/02-mai-image-25-vs-gpt-image-2/cover.jpg',
    coverSource: '/topics/02-mai-image-25-vs-gpt-image-2/index.html',
  },
]
