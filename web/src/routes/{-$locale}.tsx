import { Outlet, createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { stripLocalePrefix } from '../i18n'

/**
 * 显式 URL 国际化的统一入口（pathless 布局，见 ADR-004 的 SEO 取向）：
 * - 无前缀 = 默认英文（x-default），/zh/* = 中文。URL 是语言唯一真相源。
 * - /en/* 301 到无前缀等价页——默认语言只保留一个 canonical URL，避免重复内容。
 * - 其他前缀（如 /foo）会被可选参数吞进 locale，这里校验后交给全站 404。
 */
export const Route = createFileRoute('/{-$locale}')({
  beforeLoad: ({ params, location }) => {
    const { locale } = params
    if (locale === undefined || locale === 'zh') return
    if (locale === 'en') {
      throw redirect({ href: stripLocalePrefix(location.pathname) || '/', statusCode: 301 })
    }
    throw notFound()
  },
  component: Outlet,
})
