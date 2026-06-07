import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import ErrorPage from './components/ErrorPage'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,

    // 全站 404 —— 访问不存在的路由
    defaultNotFoundComponent: () => (
      <ErrorPage
        code="404"
        title="这个页面还没有答案"
        message="你要找的页面不存在，或已被移动。也许从研究目录开始更有收获。"
      />
    ),

    // 全站运行时错误（500）—— 组件/loader 抛错冒泡到路由
    defaultErrorComponent: ({ error, reset }) => (
      <ErrorPage
        code="500"
        title="出了点意外"
        message="页面在渲染时遇到了未预期的错误。可以重试，或返回首页。"
        onRetry={reset}
        detail={import.meta.env.DEV ? `${error.message}\n${error.stack ?? ''}` : undefined}
      />
    ),
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
