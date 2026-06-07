# 课题一 · 引用与来源 (Sources)

> research loop 内部素材，采用 Markdown（见 ADR-001 的格式分工）。
> 终产物 HTML 的 JSON-LD `citation[]` 由此派生。
> 采集日期: 2026-06-06 | 分级: primary(一手:官方/原始数据) / secondary(二手:博客/转述)

## 一手来源 (Primary)

- url: https://developers.cloudflare.com/workers/platform/pricing/
  claim: Workers 定价 — Free 10万请求/天;Paid $5/月含千万请求;CPU 计费只算执行时间,I/O 等待不计
  tier: primary | verified: yes | accessed: 2026-06-06

- url: https://developers.cloudflare.com/d1/platform/pricing/
  claim: D1 定价 — Free 500万行读/天;Paid 含250亿行读/月;写 $1/百万行;scale-to-zero
  tier: primary | verified: yes | accessed: 2026-06-06

- url: https://developers.cloudflare.com/r2/pricing/
  claim: R2 — 存储 $0.015/GB-月;**egress 完全免费**(核心成本杠杆)
  tier: primary | verified: yes | accessed: 2026-06-06

- url: https://vercel.com/docs/pricing
  claim: Vercel — Hobby 禁商用;Pro $20/席/月含$20额度+1TB传输;带宽超额 $0.15/GB
  tier: primary | verified: yes | accessed: 2026-06-06

- url: https://vercel.com/docs/functions/usage-and-pricing
  claim: Fluid Compute — Active CPU 按 CPU-小时分区计费;I/O 等待时 CPU 暂停但内存继续计费
  tier: primary | verified: yes | accessed: 2026-06-06

- url: https://www.cloudflare.com/press/press-releases/2026/cloudflare-acquires-voidzero-to-build-the-future-of-the-ai-native-web/
  claim: Cloudflare 收购 VoidZero(2026-06-04),Vite/Vitest/Rolldown/Oxc 全家桶,$100万生态基金
  tier: primary | verified: yes | accessed: 2026-06-06

- url: https://blog.cloudflare.com/voidzero-joins-cloudflare/
  claim: VoidZero 加入 Cloudflare;Evan You 表态保持中立开放;战略=local-to-production 一键部署
  tier: primary | verified: yes | accessed: 2026-06-06

- url: https://tanstack.com/blog/announcing-tanstack-start-v1
  claim: **TanStack Start 是 v1 RC(2025-09-23),非 stable 1.0**;RSC 仍在 active development
  tier: primary | verified: yes | accessed: 2026-06-06

- url: https://github.com/cloudflare/vinext
  claim: vinext 用 Vite 重实现 Next.js API;README 明标 "Experimental,use at your own risk";v0.0.55
  tier: primary | verified: yes | accessed: 2026-06-06

- url: https://opennext.js.org/cloudflare
  claim: OpenNext 跑 Next.js on CF 的限制 — edge runtime 不支持;免费层 3MiB gzip 上限;env 构建期坑;middleware auth 失效
  tier: primary | verified: yes | accessed: 2026-06-06

- url: https://developers.cloudflare.com/workers/static-assets/migration-guides/vercel-to-workers/
  claim: Cloudflare 官方 Vercel→Workers 迁移指南
  tier: primary | verified: yes | accessed: 2026-06-06

- url: https://claude.com/blog/using-claude-code-the-unreasonable-effectiveness-of-html
  claim: HTML 优于 Markdown 用于人读的最终产物(本项目架构依据 ADR-001)
  tier: primary | verified: yes | accessed: 2026-06-06

## 二手来源 (Secondary)

- url: https://venturebeat.com/infrastructure/vercel-rebuilt-v0-to-tackle-the-90-problem-connecting-ai-generated-code-to
  claim: Vercel v0 重建(2026-02),AI agent 与生产基础设施同公司闭环
  tier: secondary | verified: yes | accessed: 2026-06-06

- url: https://thenewstack.io/cloudflare-voidzero-acquisition-vite/
  claim: 对 Cloudflare 掌控 Vite 工具链的中立性质疑(合理对冲观点)
  tier: secondary | verified: yes(观点性) | accessed: 2026-06-06

- url: https://www.kunalganglani.com/blog/cloudflare-workers-vs-vercel-2026
  claim: 二手测算 1.5M访客+45M调用,CF $30-80/月
  tier: secondary | verified: partial(方向可信,绝对值未独立复核) | accessed: 2026-06-06

## 存疑/需进一步验证 (Open Questions)

1. Vercel 带宽 $0.15/GB(官方) vs 二手"$550/TB" 口径差异 — 以官方为准
2. TanStack Start stable 1.0 是否已发布 — 官方未见,截至 2026-06 仍 RC
3. 所有 benchmark(5.5x/4x/57%/99.99%) 均厂商或二手,缺独立第三方复现 → 产物中标注"未独立验证"
4. 大型企业署名迁移案例缺一手白皮书
5. vinext 进展快(每周更新),引用前需复查状态
