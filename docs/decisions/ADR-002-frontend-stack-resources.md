# ADR-002 · 前端技术选型资源清单（Geek 级最佳实践）

- **状态**: Accepted（资源已登记，按需引入）
- **日期**: 2026-06-06
- **决策者**: larrykoo711
- **相关**: 在 [ADR-001](ADR-001-html-as-source-d1-as-index.md) 架构下，为网站 (B 子系统) 与课题 HTML 产物的视觉/交互层登记可选资源。
- **当前栈**: TanStack Start v1 RC · React 19 · Vite 8 · Tailwind 4 · 已带 `lucide-react`

## 背景

视觉与交互是研究展示的"最后一公里"。本项目要避免 generic AI 美学
（已核实洞察：AI 时代 lucide 被烤进所有模板，导致产品长得都一样
— [shadcndesign](https://www.shadcndesign.com/blog/5-best-icon-libraries-for-shadcn-ui)）。
因此对每个资源都登记真实定位与本栈兼容性，按需引入而非一次性堆叠（YAGNI）。

## 资源清单（已核实）

| 资源 | 定位 | 与本栈兼容性 | 引入时机 |
|------|------|------------|---------|
| **[RemixIcon](https://github.com/Remix-Design/RemixIcon)** | 3000+ 中性系统图标，outline+filled，差异化于 lucide | React 可用（`remixicon-react` 或 SVG 直引）；可与脚手架自带 lucide 并存 | 需要 lucide 缺失的图标、或追求差异化视觉时 |
| **[motion](https://github.com/motiondivision/motion)** | React/JS 动画库（framer-motion 2025 独立改名而来） | **完整支持 React 19**；装 `motion`、import `motion/react`（不是旧 `framer-motion`） | 课题产物/网站需要进场动画、布局过渡时 |
| **[three.js](https://github.com/mrdoob/three.js/)** | JS 3D 库 | 标准 ESM，Vite 友好；SSR 下需 client-only 边界（仅浏览器渲染） | 课题需要 3D 数据可视化/英雄区时（重，慎用） |
| **[cal-heatmap](https://github.com/wa0x6e/cal-heatmap)** | Geek 风活跃度/热点日历热力图（GitHub-contribution 风格） | 浏览器端库，可在 client 组件用；适合研究"时间维度"可视化 | 展示课题发布节奏、活跃度时间线时 |
| **[square-ui](https://github.com/ln-dev7/square-ui)** | 现成 UI 组件参考（择一作为视觉风格基准） | 参考实现/抄样式，非依赖 | 设计网站组件库时作为风格参照 |
| **[andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills)** | Karpathy 风格的 Claude Code skills 集 | skills 参考，对标 skills.sh TOP10 水准 | 沉淀新 skill 时作为质量/风格基准 |

## 决策原则

1. **按需引入，不预装**（YAGNI）— 清单是"可选武器库"，每个库在真正用到的课题/页面才加入
   `web/package.json`，避免 bundle 膨胀与无谓依赖。
2. **差异化优先** — RemixIcon、motion、cal-heatmap、three.js 都是对抗 generic AI 美学的手段，
   呼应 frontend-design skill 的"avoid generic AI aesthetics"。
3. **React 19 / Vite 8 / SSR 兼容性须先验证** — three.js、cal-heatmap 等浏览器端库在
   TanStack Start SSR 下需 client-only 边界，引入时必须实测构建通过（见方法论"基于事实"）。
4. **版本锁定** — 真正引入时锁具体版本，不用 `latest`，保证课题产物可复现。

## 引入清单（checklist，引入某资源时执行）

- [ ] `pnpm -C web add <pkg>@<locked-version>`
- [ ] 若浏览器端库：包裹 client-only 边界，确认 SSR 不报错
- [ ] `pnpm -C web build` 构建通过
- [ ] 在对应课题/页面登记使用，更新本表"引入时机"为"已引入 @version"

## 参考来源

- [motion GitHub](https://github.com/motiondivision/motion) (primary, verified, 2026-06-06)
- [motion React 19 支持](https://motion.dev/docs/react) (primary, verified, 2026-06-06)
- [Lucide vs Remix Icon 对比](https://www.wmtips.com/technologies/compare/lucide-vs-remix-icon/) (secondary, verified, 2026-06-06)
- [RemixIcon](https://github.com/Remix-Design/RemixIcon) · [three.js](https://github.com/mrdoob/three.js/) · [cal-heatmap](https://github.com/wa0x6e/cal-heatmap) · [square-ui](https://github.com/ln-dev7/square-ui) · [andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) (primary repos, 2026-06-06)
