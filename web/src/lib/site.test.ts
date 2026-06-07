import { expect, test } from 'vitest'
import { SITE, topicUrl } from './site'

test('SITE 基本字段', () => {
  expect(SITE.name).toBe('42-research')
  expect(SITE.baseUrl).toMatch(/^https:\/\//)
})

test('topicUrl 生成 canonical', () => {
  expect(topicUrl('vibecoding-cloudflare-vs-vercel')).toBe(
    SITE.baseUrl + '/research/vibecoding-cloudflare-vs-vercel',
  )
})
