export const SITE = {
  name: '42-research',
  title: '42-research · 我们好奇的每一个问题，都值得被好好回答',
  description:
    '42-research 研究技术与科技领域里大家真正关心的问题，用可复现、可溯源、可同行评审的方法给出经得起核实的答案——不猜测，不附和未经核实的说法。',
  /** 主 slogan（A 方向定稿） */
  tagline: '我们好奇的每一个问题，都值得被好好回答。',
  taglineEn: 'Every question we’re curious about deserves a good answer.',
  baseUrl: 'https://42-research.pages.dev',
  author: 'larrykoo711',
  authorUrl: 'https://github.com/larrykoo711',
  /** GitHub 仓库地址（单一真相源；全站 GitHub 链接、Issue/PR/CONTRIBUTING 均基于它） */
  repoUrl: 'https://github.com/42-research-lab/42-research',
  locale: 'zh-CN',
} as const

export const topicUrl = (slug: string) => `${SITE.baseUrl}/research/${slug}`
