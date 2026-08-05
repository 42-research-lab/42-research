# 课题二 · 引用与来源 (Sources)

> research loop 内部素材，采用 Markdown（见 ADR-001 的格式分工）。
> **恢复说明**：本课题 2026-06-22 发布后，原始 loop 素材（sources.md）随当时的工作副本遗失，
> 未进入公开 git 仓库。2026-08-05 从线上旧部署（worker 版本 c1f160a8, 2026-06-28）恢复产物
> 时，本文件由产物 JSON-LD 的 citation[] 反向重建——引用条目完整，但当时的采集过程笔记
> 与 Open Questions 原文不可恢复。
> 采集日期: 2026-06-22 | 分级: primary(一手:官方/原始数据) / secondary(二手:博客/转述)

## 引用（由 JSON-LD 反向重建）

- url: https://news.microsoft.com/build-2026/
  claim: Microsoft Build 2026 官方新闻 hub
  tier: primary | verified: yes | accessed: 2026-06-22

- url: https://microsoft.ai/news/microsoft-build-2026-mai-keynote-transcript/
  claim: MAI Build 2026 keynote 官方文字稿
  tier: primary | verified: yes | accessed: 2026-06-22

- url: https://microsoft.ai/news/building-a-hillclimbing-machine-launching-seven-new-mai-models/
  claim: Building a hill-climbing machine: 7 个新 MAI 模型
  tier: primary | verified: yes | accessed: 2026-06-22

- url: https://devblogs.microsoft.com/foundry/whats-new-in-microsoft-foundry-build-2026/
  claim: What's new in Microsoft Foundry (Build 2026)
  tier: primary | verified: yes | accessed: 2026-06-22

- url: https://devblogs.microsoft.com/foundry/agent-service-build2026/
  claim: Foundry Agent Service — agents at scale
  tier: primary | verified: yes | accessed: 2026-06-22

- url: https://devblogs.microsoft.com/foundry/build-smarter-agents-faster-with-foundry-iq/
  claim: Foundry IQ — unified knowledge plane
  tier: primary | verified: yes | accessed: 2026-06-22

- url: https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/improve-recall-by-up-to-54-using-knowledge-bases/4524852
  claim: Foundry IQ +54% recall 评测(精确口径)
  tier: primary | verified: yes | accessed: 2026-06-22

- url: https://devblogs.microsoft.com/foundry/build-2026-open-trust-stack-ai-agents/
  claim: Open trust stack for AI agents (ASSERT/ACS)
  tier: primary | verified: yes | accessed: 2026-06-22

- url: https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-at-build-2026-announce/
  claim: Microsoft Agent Framework (MAF) at Build 2026 — 1.0 GA 早于 Build
  tier: primary | verified: yes | accessed: 2026-06-22

- url: https://devblogs.microsoft.com/microsoft365dev/work-iq-production-ready-intelligence-for-every-agent/
  claim: Work IQ + Work IQ API
  tier: primary | verified: yes | accessed: 2026-06-22

- url: https://blogs.bing.com/search/June-2026/Announcing-Microsoft-Web-IQ
  claim: Announcing Microsoft Web IQ
  tier: primary | verified: yes | accessed: 2026-06-22

- url: https://www.microsoft.com/en-us/microsoft-365/blog/2026/06/02/introducing-microsoft-scout-your-always-on-personal-agent/
  claim: Introducing Microsoft Scout
  tier: primary | verified: yes | accessed: 2026-06-22

- url: https://github.blog/news-insights/product-news/github-copilot-app-the-agent-native-desktop-experience/
  claim: GitHub Copilot app — agent-native desktop
  tier: primary | verified: yes | accessed: 2026-06-22

- url: https://www.microsoft.com/en-us/microsoft-365/blog/2026/03/09/powering-frontier-transformation-with-copilot-and-agents/
  claim: Copilot 多模型(2026-03 Wave 3, 早于 Build)
  tier: primary | verified: yes | accessed: 2026-06-22

- url: https://blogs.windows.com/windowsdeveloper/2026/06/02/windows-platform-security-for-ai-agents/
  claim: Windows platform security for AI agents
  tier: primary | verified: yes | accessed: 2026-06-22

- url: https://commandline.microsoft.com/project-solara-build-2026/
  claim: Project Solara — agent-first device platform
  tier: primary | verified: yes | accessed: 2026-06-22

- url: https://azure.microsoft.com/en-us/blog/microsoft-build-2026-building-agentic-apps-with-microsoft-fabric-and-microsoft-databases/
  claim: Agentic apps with Fabric & Databases (Fabric IQ)
  tier: primary | verified: yes | accessed: 2026-06-22

- url: https://azure.microsoft.com/en-us/blog/announcing-microsoft-discovery-general-availability-and-microsoft-discovery-app-preview/
  claim: Microsoft Discovery GA
  tier: primary | verified: yes | accessed: 2026-06-22

- url: https://www.youtube.com/watch?v=FFMm454fxNA
  claim: Build 2026 Satya Nadella Opening Keynote (官方完整视频)
  tier: primary | verified: yes | accessed: 2026-06-22
## 存疑/需进一步验证 (Open Questions)

（原文随 loop 素材遗失，以下为产物正文中保留的对抗验证结论）

1. 多数公告能力为 preview 而非 GA，落地时间线待验。
2. 关键 benchmark（如 Foundry IQ +54% recall）为厂商自测，未独立验证。
3. 『Copilot 跨 OpenAI/Anthropic/开源』说法混淆 Copilot 与 Foundry，且早于 Build（2026-03 Wave 3）。
4. 『Windows Agent Framework 已 GA』被证伪——GA 的是跨平台 MAF（2026-04 已 GA）。
