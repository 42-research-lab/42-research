/**
 * TopicCard — 研究课题卡片
 *
 * 整卡 Link 可导航至 /research/$slug，复用 .card/.badge/.kicker/.display/.mono/.rise 样式。
 * 封面逻辑：有 cover 用 <img>；无 cover 用品牌几何占位（LogoMark + 渐变底），不留白。
 * featured 变体预留 prop 接口，目录页用默认，首页精选（阶段6）再扩充。
 */
import { Link } from '@tanstack/react-router'
import type { CSSProperties } from 'react'
import { localizeTopic, type Topic } from '../data/topics'
import { useLocale } from '../i18n/useLocale'
import { LogoMark } from './Logo'

interface TopicCardProps {
  topic: Topic
  featured?: boolean
  style?: CSSProperties
}

export function TopicCard({ topic, featured = false, style }: TopicCardProps) {
  const { locale, t } = useLocale()
  const loc = localizeTopic(topic, locale)
  return (
    <Link
      to="/{-$locale}/research/$slug"
      params={{ slug: topic.slug }}
      className="card rise block overflow-hidden"
      style={style}
    >
      {/* 封面区 */}
      <CoverArea topic={topic} featured={featured} />

      {/* 正文区 */}
      <div className="p-5 sm:p-6">
        {/* 编号 + 状态 badge + category */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="mono text-xl font-bold text-[var(--border-hi)]">{topic.no}</span>
          <span className={`badge ${topic.status === 'publish' ? 'published' : ''}`}>
            {t.status[topic.status]}
          </span>
          <span className="mono rounded-md border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--muted)]">
            {loc.category}
          </span>
        </div>

        {/* 标题 */}
        <h3
          className={`display mt-3 font-bold text-[var(--fg)] leading-tight ${
            featured ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
          }`}
        >
          {loc.title}
        </h3>

        {/* 摘要（截断 3 行） */}
        <p className="mt-2 text-sm leading-6 text-[var(--fg-soft)] line-clamp-3">
          {loc.abstract}
        </p>

        {/* 关键词 chips */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {topic.keywords.map((k) => (
            <span
              key={k}
              className="mono rounded-md border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--muted)]"
            >
              {k}
            </span>
          ))}
        </div>

        {/* 底部 meta */}
        <div className="mono mt-4 flex items-center justify-between text-xs text-[var(--muted)]">
          <span>{topic.datePublished}</span>
          <span>
            {topic.citations} {t.card.citations}
          </span>
        </div>
      </div>
    </Link>
  )
}

/** 封面区：有 cover 用图片；无 cover 用品牌几何占位 */
function CoverArea({ topic, featured }: { topic: Topic; featured: boolean }) {
  if (topic.cover) {
    return (
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          src={topic.cover}
          alt={topic.title}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
    )
  }

  /* 无封面：品牌几何占位 —— 渐变底 + 居中 LogoMark */
  return (
    <div
      className="relative flex aspect-video w-full items-center justify-center overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, rgba(107,140,255,0.10) 0%, rgba(246,130,31,0.07) 60%, transparent 100%)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* 装饰性网格背景 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />
      {/* 光晕 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(246,130,31,0.12) 0%, transparent 65%)',
        }}
        aria-hidden="true"
      />
      <LogoMark size={featured ? 48 : 36} className="relative opacity-40" decorative />
    </div>
  )
}
