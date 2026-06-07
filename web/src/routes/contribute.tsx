import { createFileRoute, Link } from '@tanstack/react-router'
import { SITE } from '../lib/site'

export const Route = createFileRoute('/contribute')({
  head: () => ({
    meta: [
      { title: '提交研究课题 · 42-research' },
      {
        name: 'description',
        content:
          '提议一个课题，或按方法论完成一篇研究并提交 PR。42-research 只收录经核实的结论。',
      },
    ],
    links: [{ rel: 'canonical', href: `${SITE.baseUrl}/contribute` }],
  }),
  component: Contribute,
})

const QUALITY_GATES = [
  {
    icon: '①',
    text: '假设基于一手来源，不凭转述',
  },
  {
    icon: '②',
    text: '结论经过对抗验证——主动找过反例',
  },
  {
    icon: '③',
    text: '结论可证伪：明确在什么条件下不成立',
  },
  {
    icon: '④',
    text: '实验可复现：环境、命令、版本均有记录',
  },
]

function Contribute() {
  return (
    <main className="page-wrap px-4 pb-16 pt-16">
      {/* Hero */}
      <section className="rise">
        <p className="kicker mb-4">// contribute</p>
        <h1 className="display mb-6 text-4xl font-extrabold tracking-tight text-[var(--fg)] sm:text-6xl">
          提交你想看的研究课题
          <span className="cursor" />
        </h1>
        <p className="max-w-2xl text-base leading-8 text-[var(--fg-soft)] sm:text-lg">
          你好奇、却一直没有好答案的技术问题，正是我们想研究的。提议一个课题，或直接贡献一篇研究——我们只收录经核实的结论：有据可查、有反例可查、有边界可查。
        </p>
      </section>

      {/* 双路径卡片 */}
      <section className="mt-14 grid gap-5 sm:grid-cols-2">
        {/* 路径一：提 Issue */}
        <div className="card flex flex-col p-6 sm:p-8">
          <p className="kicker mb-3">// lightweight · 轻量</p>
          <h2 className="display mb-3 text-xl font-bold text-[var(--fg)]">提议一个课题</h2>
          <p className="mb-6 flex-1 text-sm leading-7 text-[var(--fg-soft)]">
            有想深挖的问题？给出你的假设、为什么这个问题值得研究、以及你已知的一手来源链接。
          </p>
          <a
            href={`${SITE.authorUrl}/42-research/issues/new?template=research-topic.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary self-start"
          >
            在 GitHub 提 Issue →
          </a>
        </div>

        {/* 路径二：提 PR */}
        <div className="card flex flex-col p-6 sm:p-8">
          <p className="kicker mb-3">// deep · 深度</p>
          <h2 className="display mb-3 text-xl font-bold text-[var(--fg)]">完成一篇研究</h2>
          <p className="mb-6 flex-1 text-sm leading-7 text-[var(--fg-soft)]">
            按方法论走完 6 阶段生命周期（假设→采集→实测→对抗验证→综合→发布），产出自包含 HTML，提交 PR。
          </p>
          <a
            href={`${SITE.authorUrl}/42-research/blob/main/CONTRIBUTING.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost self-start"
          >
            阅读贡献指南 →
          </a>
        </div>
      </section>

      {/* 质量门提示 */}
      <section className="card mt-10 p-6 sm:p-8">
        <p className="kicker mb-3">// quality-gate</p>
        <h2 className="display mb-5 text-lg font-bold text-[var(--fg)]">我们只要经核实的结论</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {QUALITY_GATES.map((g) => (
            <li key={g.icon} className="flex items-start gap-3 text-sm leading-6 text-[var(--fg-soft)]">
              <span className="mono mt-0.5 font-bold text-[var(--accent)]">{g.icon}</span>
              <span>{g.text}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm leading-7 text-[var(--fg-soft)]">
          不确定自己的研究是否达标？先读{' '}
          <Link to="/about" className="text-[var(--accent-2)] hover:text-[var(--fg)]">
            方法论
          </Link>
          ，再提 Issue 讨论。
        </p>
      </section>

      <div className="mt-12">
        <Link to="/" className="btn-ghost">
          ← 返回首页
        </Link>
      </div>
    </main>
  )
}
