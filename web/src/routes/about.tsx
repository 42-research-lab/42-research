import { createFileRoute, Link } from '@tanstack/react-router'
import { SITE } from '../lib/site'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: '研究方法论 · 42-research' },
      {
        name: 'description',
        content:
          '42-research 的研究方法论：第一性原理、课题生命周期、引用分级、对抗验证与产物质量门。',
      },
    ],
    links: [{ rel: 'canonical', href: `${SITE.baseUrl}/about` }],
  }),
  component: About,
})

const PRINCIPLES = [
  {
    no: '01',
    title: '基于事实，不凭记忆',
    desc: '任何技术声明必须经官方文档 / 一手数据核实——训练数据可能过时。',
  },
  {
    no: '02',
    title: '不附和，要谲证',
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
]

const LIFECYCLE = [
  { stage: 'hypothesis', desc: '提出假设 + 定义可证伪的判据' },
  { stage: 'survey', desc: '多源信息采集（官方文档 / 一手数据 / 社区实践）' },
  { stage: 'experiment', desc: '可复现的实测（基准 / 成本模型 / 部署），记录环境与命令' },
  { stage: 'verify', desc: '对抗验证：主动找反例，质疑自己的结论' },
  { stage: 'synthesize', desc: '综合成结论 + 决策矩阵 + 适用边界' },
  { stage: 'publish', desc: '产出自包含 HTML，元数据入 D1' },
]

const DOD = [
  '假设明确且可证伪',
  '每个事实声明有 ≥1 个核实引用（核心声明需一手来源）',
  '实验可复现（环境、命令、版本已记录）',
  '已做对抗验证，记录了反例与边界',
  '结论含决策矩阵与适用边界',
  'HTML 产物自包含、含完整 JSON-LD、响应式',
  '无未核实的「听说」式断言',
]

function About() {
  return (
    <main className="page-wrap px-4 pb-16 pt-16">
      {/* Hero — 关于这个项目 */}
      <section className="rise">
        <p className="kicker mb-4">// about · 42-research</p>
        <h1 className="display mb-6 max-w-3xl text-4xl leading-[1.08] font-extrabold tracking-tight text-[var(--fg)] sm:text-6xl">
          关于 42-research
          <span className="cursor" />
        </h1>
        <p className="max-w-2xl text-base leading-8 text-[var(--fg-soft)] sm:text-lg">
          我们好奇的每一个问题，都值得被好好回答。42-research
          研究技术与科技领域里大家真正关心、却少有人认真求证的问题，给出经得起核实的答案。
        </p>
      </section>

      {/* 我们相信什么 */}
      <section className="card mt-12 p-6 sm:p-8">
        <p className="kicker mb-4">// why we exist</p>
        <h2 className="display mb-4 text-xl font-bold text-[var(--fg)]">为什么是 42</h2>
        <p className="mb-4 text-sm leading-7 text-[var(--fg-soft)] sm:text-base">
          在《银河系漫游指南》里，超级计算机算了七百五十万年，给出「生命、宇宙及一切」的终极答案——
          <strong className="text-[var(--fg)]">42</strong>。笑点在于：答案有了，可没人记得问题到底是什么。
        </p>
        <p className="text-sm leading-7 text-[var(--fg-soft)] sm:text-base">
          技术世界正相反：到处是断言、带货和「听说」，却很少有人把问题问清楚、把答案查到底。
          42-research 想做的，就是把<strong className="text-[var(--fg)]">值得好奇的问题</strong>认真问清楚，
          再用可复现、可溯源、可同行评审的方法，给出一个<strong className="text-[var(--fg)]">经得起核实</strong>的答案。
        </p>
      </section>

      {/* 第一性原理 */}
      <section className="mt-20">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="display text-2xl font-bold text-[var(--fg)] sm:text-3xl">第一性原理</h2>
          <span className="kicker">first-principles</span>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {PRINCIPLES.map((p, i) => (
            <div
              key={p.no}
              className="card rise p-6"
              style={{ animationDelay: `${i * 70 + 80}ms` }}
            >
              <span className="mono text-2xl font-bold text-[var(--border-hi)]">{p.no}</span>
              <h3 className="display mt-3 text-lg font-bold text-[var(--fg)]">{p.title}</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--fg-soft)]">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 课题生命周期 */}
      <section className="mt-20">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="display text-2xl font-bold text-[var(--fg)] sm:text-3xl">课题生命周期</h2>
          <span className="kicker">topic-lifecycle</span>
        </div>
        <ol className="grid gap-3">
          {LIFECYCLE.map((s, i) => (
            <li
              key={s.stage}
              className="card flex items-center gap-4 p-4 sm:p-5"
            >
              <span className="mono text-sm font-bold text-[var(--accent)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="mono min-w-28 text-sm font-semibold text-[var(--fg)]">
                {s.stage}
              </span>
              <span className="text-sm leading-6 text-[var(--fg-soft)]">{s.desc}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* 引用标准 + 对抗验证 */}
      <section className="mt-20 grid gap-5 sm:grid-cols-2">
        <div className="card p-6 sm:p-8">
          <p className="kicker mb-3">// citation-standard</p>
          <h2 className="display mb-4 text-xl font-bold text-[var(--fg)]">引用分级</h2>
          <p className="mb-3 text-sm leading-7 text-[var(--fg-soft)]">
            <strong className="text-[var(--fg)]">一手来源</strong>（官方文档、原始基准数据）权重高于
            <strong className="text-[var(--fg)]">二手来源</strong>（博客、转述）。
          </p>
          <p className="text-sm leading-7 text-[var(--fg-soft)]">
            冲突时以一手来源为准，并记录冲突。每条引用标注核实日期与核实状态。
          </p>
        </div>
        <div className="card p-6 sm:p-8">
          <p className="kicker mb-3">// adversarial-verification</p>
          <h2 className="display mb-4 text-xl font-bold text-[var(--fg)]">对抗验证</h2>
          <p className="mb-3 text-sm leading-7 text-[var(--fg-soft)]">
            综合结论前，对每个核心结论主动追问「它可能错在哪？」：是否有反例、数据是否有偏、是否混淆相关与因果、是否依赖快速变化的事实。
          </p>
          <p className="text-sm leading-7 text-[var(--fg-soft)]">
            可并行派多个 skeptic 独立尝试推翻；多数推翻则结论不成立。
          </p>
        </div>
      </section>

      {/* 质量门 */}
      <section className="card mt-20 p-6 sm:p-8">
        <p className="kicker mb-3">// definition-of-done</p>
        <h2 className="display mb-6 text-xl font-bold text-[var(--fg)]">产物质量门</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {DOD.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[var(--fg-soft)]">
              <span className="mono mt-0.5 text-[var(--ok)]">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 如何参与 */}
      <section className="mt-20">
        <h2 className="display mb-3 text-xl font-bold text-[var(--fg)]">如何参与</h2>
        <p className="mb-6 text-sm leading-7 text-[var(--fg-soft)]">
          你可以提议一个值得深挖的课题，或按方法论完成一篇研究并提交 PR。
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/contribute" className="btn-primary">
            提交研究课题 →
          </Link>
          <a
            href={`${SITE.authorUrl}/42-research/blob/main/CONTRIBUTING.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            贡献指南
          </a>
        </div>
      </section>
    </main>
  )
}
