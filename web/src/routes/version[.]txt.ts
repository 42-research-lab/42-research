import { createFileRoute } from '@tanstack/react-router'

/**
 * GET /version.txt — 构建标识端点（运维用，非 SEO 内容）。
 *
 * 返回构建期注入的 BUILD_ID（git SHA + 部署时间戳）。部署脚本
 * scripts/deploy.sh 轮询此端点确认边缘节点已收敛到新版本——
 * worker 脚本版本传播存在分钟级延迟，静态资产层则是即时的，
 * 仅凭资产可访问无法判断 SSR 已更新。
 */
export const Route = createFileRoute('/version.txt')({
  server: {
    handlers: {
      GET: async () =>
        new Response(__BUILD_ID__, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-store',
          },
        }),
    },
  },
})
