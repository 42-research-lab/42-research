import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/topics/$slug')({
  beforeLoad: ({ params }) => {
    // 去掉数字前缀（如 01-）映射到新 slug
    const newSlug = params.slug.replace(/^\d+-/, '')
    throw redirect({
      to: '/{-$locale}/research/$slug',
      params: { slug: newSlug, locale: undefined },
      statusCode: 308,
    })
  },
})
