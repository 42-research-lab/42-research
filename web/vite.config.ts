import { execFileSync } from 'node:child_process'
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'

/**
 * 构建标识：git 短 SHA + 可选的部署脚本时间戳（BUILD_ID env）。
 * 经 /version.txt 暴露，供部署脚本轮询边缘收敛（worker 脚本版本传播有分钟级延迟）。
 */
const gitSha = (() => {
  try {
    return execFileSync('git', ['rev-parse', '--short', 'HEAD']).toString().trim()
  } catch {
    return 'nogit'
  }
})()
const buildId = process.env.BUILD_ID ?? `${gitSha}-dev`

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  define: { __BUILD_ID__: JSON.stringify(buildId) },
  plugins: [
    devtools(),
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
