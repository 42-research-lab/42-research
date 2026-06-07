import type { Messages } from './en'

/**
 * 中文 message catalog。形状与 en.ts 完全一致(由 Messages 类型强制),
 * 缺 key 会编译报错。
 */
export const zh: Messages = {
  site: {
    title: '42-research · 每一个值得好奇的问题，都值得被好好回答',
    description:
      '42-research 研究技术与科技领域里大家真正关心的问题，用可复现、可溯源、可同行评审的方法给出经得起核实的答案——不猜测，不附和未经核实的说法。',
    tagline: '每一个值得好奇的问题，都值得被好好回答。',
  },

  nav: {
    research: '研究',
    contribute: '贡献',
    about: '关于',
  },

  langSwitch: {
    label: '语言',
    en: 'EN',
    zh: '中文',
  },

  home: {
    kicker: '// research dossier · est. 2026',
    heroLine1: '我们好奇的每一个问题，',
    heroLine2: '都值得被',
    heroEmphasis: '好好回答',
    heroBody:
      '42-research 研究技术与科技领域里大家真正关心、却少有人认真求证的问题。每个结论都说明在什么条件下成立、附可点击的一手来源——',
    heroBodyStrong: '不猜测，不附和未经核实的说法。',
    ctaBrowse: '浏览研究 →',
    ctaHow: '我们怎么做研究',
    stats: {
      topics: '研究课题',
      published: '已发布',
      primarySourced: '结论附一手来源',
      reproducible: '过程公开可查',
      reproducibleValue: '可复现',
    },
    domains: {
      heading: '研究领域',
      items: [
        {
          icon: '◈',
          title: 'AI 与机器智能',
          desc: '模型能力的真实边界、AI 工具在生产中的适用场景与限制，剥开宣传看数据。',
        },
        {
          icon: '⬡',
          title: '架构与基础设施',
          desc: 'Edge、云、数据库等方案的实际成本与延迟——按真实用量测算，不看厂商自测。',
        },
        {
          icon: '◎',
          title: '工具与选型',
          desc: '框架、平台、付费服务怎么选。给出按场景分化的结论，而非一刀切的推荐。',
        },
        {
          icon: '◇',
          title: '趋势与判断',
          desc: '一项技术是真趋势还是炒作？用一手信号和第一性原理判断，记录会被证伪的预测。',
        },
      ],
    },
    featured: {
      heading: '精选研究',
      all: '→ 全部研究',
      empty: '研究进行中，首篇即将发布。',
    },
    trust: {
      kicker: '// why trust this',
      heading: '为什么可以相信结论',
      items: [
        {
          title: '只用一手来源',
          desc: '数据取自官方文档或我们直接测量，不引用二手转述与营销材料。每个事实都附可点击的出处。',
        },
        {
          title: '结论会标明边界',
          desc: '每个结论都说明在什么条件下成立、什么条件下不成立——不给你一个假装放之四海皆准的答案。',
        },
        {
          title: '先自我反驳',
          desc: '下结论前主动找反例、质疑自己。把不确定的地方如实标出，而不是藏起来。',
        },
      ],
    },
    cta: {
      kicker: '// contribute',
      heading: '有想看的研究课题？',
      body: '有什么技术问题你一直想弄清楚、却找不到经得起核实的答案？提交它。我们会用同样的研究流程，给出可溯源的结论。',
      button: '提交你想看的研究课题 →',
    },
  },

  about: {
    metaTitle: '研究方法论 · 42-research',
    metaDescription:
      '42-research 的研究方法论：第一性原理、课题生命周期、引用分级、对抗验证与产物质量门。',
    kicker: '// about · 42-research',
    heading: '关于 42-research',
    heroBody:
      '每一个值得好奇的问题，都值得被好好回答。42-research 研究技术与科技领域里大家真正关心、却少有人认真求证的问题，给出经得起核实的答案。',
    why: {
      kicker: '// why we exist',
      heading: '为什么是 42',
      p1a: '在《银河系漫游指南》里，超级计算机算了七百五十万年，给出「生命、宇宙及一切」的终极答案——',
      p1b: '42',
      p1c: '。笑点在于：答案有了，可没人记得问题到底是什么。',
      p2a: '技术世界正相反：到处是断言、带货和「听说」，却很少有人把问题问清楚、把答案查到底。42-research 想做的，就是把',
      p2b: '值得好奇的问题',
      p2c: '认真问清楚，再用可复现、可溯源、可同行评审的方法，给出一个',
      p2d: '经得起核实',
      p2e: '的答案。',
    },
    principles: {
      heading: '第一性原理',
      kicker: 'first-principles',
      items: [
        {
          no: '01',
          title: '基于事实，不凭记忆',
          desc: '任何技术声明必须经官方文档 / 一手数据核实——训练数据可能过时。',
        },
        {
          no: '02',
          title: '不附和，要求证',
          desc: '社区流行说法（如「X 彻底打败 Y」）需独立验证，如实记录与原说法的偏差。',
        },
        {
          no: '03',
          title: '结论可证伪',
          desc: '每个结论附带它在什么条件下成立、什么条件下不成立。',
        },
        {
          no: '04',
          title: '引用可点击',
          desc: '每个事实声明附 URL，标注核实日期与核实状态。',
        },
      ],
    },
    lifecycle: {
      heading: '课题生命周期',
      kicker: 'topic-lifecycle',
      items: [
        { stage: 'hypothesis', desc: '提出假设 + 定义可证伪的判据' },
        { stage: 'survey', desc: '多源信息采集（官方文档 / 一手数据 / 社区实践）' },
        { stage: 'experiment', desc: '可复现的实测（基准 / 成本模型 / 部署），记录环境与命令' },
        { stage: 'verify', desc: '对抗验证：主动找反例，质疑自己的结论' },
        { stage: 'synthesize', desc: '综合成结论 + 决策矩阵 + 适用边界' },
        { stage: 'publish', desc: '产出自包含 HTML，元数据入 D1' },
      ],
    },
    citation: {
      kicker: '// citation-standard',
      heading: '引用分级',
      p1a: '一手来源',
      p1b: '（官方文档、原始基准数据）权重高于',
      p1c: '二手来源',
      p1d: '（博客、转述）。',
      p2: '冲突时以一手来源为准，并记录冲突。每条引用标注核实日期与核实状态。',
    },
    adversarial: {
      kicker: '// adversarial-verification',
      heading: '对抗验证',
      p1: '综合结论前，对每个核心结论主动追问「它可能错在哪？」：是否有反例、数据是否有偏、是否混淆相关与因果、是否依赖快速变化的事实。',
      p2: '可并行派多个 skeptic 独立尝试推翻；多数推翻则结论不成立。',
    },
    dod: {
      kicker: '// definition-of-done',
      heading: '产物质量门',
      items: [
        '假设明确且可证伪',
        '每个事实声明有 ≥1 个核实引用（核心声明需一手来源）',
        '实验可复现（环境、命令、版本已记录）',
        '已做对抗验证，记录了反例与边界',
        '结论含决策矩阵与适用边界',
        'HTML 产物自包含、含完整 JSON-LD、响应式',
        '无未核实的「听说」式断言',
      ],
    },
    participate: {
      heading: '如何参与',
      body: '你可以提议一个值得深挖的课题，或按方法论完成一篇研究并提交 PR。',
      ctaSubmit: '提交研究课题 →',
      ctaGuide: '贡献指南',
    },
  },

  contribute: {
    metaTitle: '提交研究课题 · 42-research',
    metaDescription:
      '提议一个课题，或按方法论完成一篇研究并提交 PR。42-research 只收录经核实的结论。',
    kicker: '// contribute',
    heading: '提交你想看的研究课题',
    heroBody:
      '你好奇、却一直没有好答案的技术问题，正是我们想研究的。提议一个课题，或直接贡献一篇研究——我们只收录经核实的结论：有据可查、有反例可查、有边界可查。',
    issue: {
      kicker: '// lightweight · 轻量',
      heading: '提议一个课题',
      body: '有想深挖的问题？给出你的假设、为什么这个问题值得研究、以及你已知的一手来源链接。',
      cta: '在 GitHub 提 Issue →',
    },
    pr: {
      kicker: '// deep · 深度',
      heading: '完成一篇研究',
      body: '按方法论走完 6 阶段生命周期（假设→采集→实测→对抗验证→综合→发布），产出自包含 HTML，提交 PR。',
      cta: '阅读贡献指南 →',
    },
    gate: {
      kicker: '// quality-gate',
      heading: '我们只要经核实的结论',
      items: [
        '假设基于一手来源，不凭转述',
        '结论经过对抗验证——主动找过反例',
        '结论可证伪：明确在什么条件下不成立',
        '实验可复现：环境、命令、版本均有记录',
      ],
      noteA: '不确定自己的研究是否达标？先读',
      noteLink: '方法论',
      noteB: '，再提 Issue 讨论。',
    },
    back: '← 返回首页',
  },

  research: {
    metaTitle: '研究目录 · 42-research',
    metaDescription: '42-research 全部研究课题，按时间倒序。每篇可溯源、可复现。',
    kicker: 'research/',
    heading: '研究目录',
    body: '全部课题，按时间倒序。每篇可溯源、可复现。',
    all: '全部',
    empty: '暂无该分类课题',
  },

  card: {
    citations: '引用',
  },

  detail: {
    breadcrumb: '← 研究目录',
    primaryCitations: '一手引用',
    tldrKicker: 'TL;DR · 一句话结论',
    abstractKicker: '摘要',
    coverSource: '封面来源：',
    rawArtifact: '查看原始自包含 HTML 产物 ↗',
    rawArtifactNote:
      '真相源为自包含语义化 HTML，含 JSON-LD 结构化元数据，可独立打开、可溯源（ADR-001）',
    notFoundTitle: '找不到这个课题',
    notFoundMessage: '这个研究课题不存在，或 slug 有误。去研究目录看看其他课题。',
  },

  status: {
    hypothesis: '假设',
    survey: '调研',
    experiment: '实验',
    verify: '验证',
    synthesize: '综合',
    publish: '已发布',
  },

  footer: {
    tagline:
      '每一个值得好奇的问题，都值得被好好回答。可复现、可溯源、可同行评审的技术研究。',
    browse: '浏览',
    research: '研究目录',
    about: '关于 · 方法论',
    contribute: '提交课题',
    openSource: '开源',
    repo: 'GitHub 仓库',
    contributing: '贡献指南',
    license: '© 2026 42-research-lab · MIT License',
    builtWith: 'built with',
  },
}
