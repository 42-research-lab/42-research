/**
 * 42-research 品牌标 · 「数据晶体」
 *
 * 六边形 = 数据/分子结构；橙蓝双切面 = 「真相源(橙) + 索引(蓝)」二元。
 * 单一内联 SVG 源，无需 dark/light 两套文件：
 *   - 橙(#f6821f)/蓝(#6b8cff) 切面固定，在暗/亮主题均成立
 *   - 六边形外框底色与描边走 CSS 变量(--card / --border-hi)，随主题自动适配
 *
 * 静态资产(favicon/png/ico)见 web/public/ 与 web/src/assets/brand/。
 */

interface LogoMarkProps {
  /** 像素尺寸(高)，默认 28 */
  size?: number
  className?: string
  /** 装饰性时设 true(默认)，对屏幕阅读器隐藏；独立使用时设 false 暴露 aria-label */
  decorative?: boolean
}

/** 仅图标(icon mark) */
export function LogoMark({ size = 28, className, decorative = true }: LogoMarkProps) {
  return (
    <svg
      width={(size * 46) / 52}
      height={size}
      viewBox="0 0 46 52"
      fill="none"
      className={className}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : '42-research'}
    >
      <path
        d="M23 3 L41 13.5 V34.5 L23 45 L5 34.5 V13.5 Z"
        fill="var(--card)"
        stroke="var(--border-hi)"
        strokeWidth="1.6"
      />
      <path d="M23 3 L23 24 L5 13.5 Z" fill="#6b8cff" fillOpacity="0.22" />
      <path d="M23 3 L41 13.5 L23 24 Z" fill="#6b8cff" fillOpacity="0.55" />
      <path d="M23 24 L41 13.5 V34.5 Z" fill="#f6821f" />
    </svg>
  )
}

interface LogoProps extends LogoMarkProps {
  /** 字标字号(rem)，默认 1.0625rem(17px) */
  wordSize?: string
}

/** 横向锁版(icon + wordmark)，用于 Header/Footer/Landing */
export function Logo({ size = 30, wordSize = '1.0625rem', className }: LogoProps) {
  return (
    <span className={`logo-lockup ${className ?? ''}`}>
      <LogoMark size={size} />
      <span
        className="mono font-bold tracking-tight text-[var(--fg)]"
        style={{ fontSize: wordSize, letterSpacing: '-0.02em' }}
      >
        42<span className="text-[var(--accent)]">·</span>Research
      </span>
    </span>
  )
}

export default Logo
