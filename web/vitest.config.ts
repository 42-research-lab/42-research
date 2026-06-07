import { defineConfig } from 'vitest/config'

export default defineConfig({
  // 排除 cloudflare / tanstackStart 插件，避免 Worker 环境冲突
  resolve: {
    alias: {
      '#/': new URL('./src/', import.meta.url).pathname,
      '@/': new URL('./src/', import.meta.url).pathname,
    },
  },
  test: {
    environment: 'node',
  },
})
