# 课题二 · 引用与来源 (Sources)

> research loop 内部素材，采用 Markdown（见 ADR-001 的格式分工）。
> 终产物 HTML 的 JSON-LD `citation[]` 由此派生。
> 采集日期: 2026-08-05 | 分级: primary(一手:官方/原始数据) / secondary(二手:博客/转述)

## 一手来源 (Primary)

- url: (本研究实测数据) evidence/results.json + scripts/generate.py
  claim: 50 次生成请求的完整台账 — 46 成功 / 4 个 HTTP 400；逐请求延迟；token 用量
    (MAI 三款恒定 1024 output tokens/图；GPT medium 1756 / high 7024 image tokens @1024×1024)。
    中位延迟(全部成功样本): Flash 15.8s(n=10) / 2.5 27.85s(n=10) / Pro 31.8s(n=10) /
    GPT medium 58.45s(n=8) / GPT high 158.3s(n=8)。
  tier: primary | verified: yes(自有实验,幂等可复现) | accessed: 2026-08-04
  注: 原始素材在内部仓库 ai-provider-ac/issues/2026-08-04-*；公开产物只携带脱敏后的方法与数据。

- url: https://learn.microsoft.com/en-us/azure/foundry/foundry-models/how-to/use-foundry-models-mai-image
  claim: MAI 图像模型官方文档 — 专有 /mai/v1/images/generations 与 /mai/v1/images/edits(multipart)；
    仅 7 区(West Central US/East US/West US/West Europe/Sweden Central/South India/UAE North)；
    width/height 各 ≥768 且乘积 ≤1,048,576；输出恒为 PNG；prompt 上限 32K tokens；
    GlobalStandard 配额分 6 档、2.5 系最高 12 RPM；全系 Preview；版本 2.5/Flash=2026-06-02, Pro=2026-06-19
  tier: primary | verified: yes | accessed: 2026-08-05

- url: https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/new-mai-models-in-foundry-across-text-image-voice-and-speech/4524632
  claim: MAI-Image-2.5 + Flash 发布公告(2026-06-02, Build 2026)；官方宣称 Arena.ai 「No. 2」；
    2.5 定价 $5/$8/$47 每 1M tokens(文本入/图入/图出)
  tier: primary | verified: yes(定价另有 mer.vin/wavespeed 两处独立转述一致) | accessed: 2026-08-05
  注: 正确 URL 为 .../new-mai-models-in-microsoft-foundry-across-text-image-voice-and-speech/4524632

- url: https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/introducing-mai-image-2-5-pro-and-mai-voice-2-flash-in-microsoft-foundry/4539446
  claim: MAI-Image-2.5-Pro 公告(2026-07-23)；定位最高保真/一致性；定价 $5/$8/$106
  tier: primary | verified: yes | accessed: 2026-08-05

- url: https://microsoft.ai/news/building-a-hillclimbing-machine-launching-seven-new-mai-models/
  claim: 微软 AI 七模型发布(2026-06-02, Suleyman)；宣称 2.5 「surpassing the Arena score of
    Nano Banana Pro」；模型同时上 OpenRouter/Fireworks/Baseten
  tier: primary | verified: yes(厂商宣称,榜单名次未独立验证) | accessed: 2026-08-05

- url: https://labs.ai.azure.com/innovations/mai-image-2-5/
  claim: Foundry Labs 模型页 — 称 2.5 debut 于 Arena「#3」(+74.5 ELO vs MAI-Image-2)。
    **与发布公告的「No. 2」口径冲突**(微软自家两页不一致,已记入产物纠偏区块)
  tier: primary | verified: yes(冲突已记录) | accessed: 2026-08-05

- url: https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/introducing-openais-gpt-image-2-in-microsoft-foundry/4500571
  claim: GPT-image-2 GA 公告(2026-04-21)；支持任意分辨率至 4K(各边 16px 倍数,
    总像素 655,360–8,294,400)；知识截止 2025-12；含思考/路由层
  tier: primary | verified: yes | accessed: 2026-08-05

- url: https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/dall-e
  claim: gpt-image-2 官方用法 — quality low/medium/high(默认 high)；n=1–10；输出 png/jpeg；
    支持 mask inpaint；仅 b64 输出；内容被过滤时报 contentFilter 错误
  tier: primary | verified: yes | accessed: 2026-08-05

- url: https://learn.microsoft.com/en-us/azure/foundry-classic/foundry-models/concepts/content-filter
  claim: Azure 内容过滤与图像生成模型协同工作(Azure AI Content Safety)；prompt 命中过滤
    → HTTP 400 + code "content_filter"；严重度阈值可配置；完全关闭需 Limited Access 审批
  tier: primary | verified: yes | accessed: 2026-08-05

## 二手来源 (Secondary)

- url: https://wavespeed.ai/blog/posts/mai-image-2-5-api/
  claim: Flash 定价转述 — 输入 $1.75/M(文本+图)、图出 $33/M(并注明「$19.50–$33 视来源而定」)；
    2.5 已进 PowerPoint/OneDrive 产品面
  tier: secondary | verified: partial(与内部速报所用 $26/M 冲突,见存疑#1) | accessed: 2026-08-05

- url: https://mer.vin/2026/06/mai-image-2-5-arena-2-image-editing-and-foundry-pricing-explained/
  claim: 2.5 定价表($5/$8/$47)独立转述；Arena 名次拆分口径(文生图 No.3 / 图编辑 No.2)
  tier: secondary | verified: yes(与官方公告一致) | accessed: 2026-08-05

- url: https://openrouter.ai/microsoft/mai-image-2.5
  claim: 2.5 于 2026-06-02 上线 OpenRouter(第三方可用性佐证)
  tier: secondary | verified: yes | accessed: 2026-08-05

- url: https://azure.microsoft.com/en-us/pricing/details/azure-openai/
  claim: Azure OpenAI 官方定价页(gpt-image-2 token 牌价的权威出处;页面 JS 渲染,
    本次未能直接引用到具体数字,见存疑#2)
  tier: primary | verified: partial | accessed: 2026-08-05

- url: https://www.getmaxim.ai/bifrost/llm-cost-calculator/provider/azure/model/gpt-image-2
  claim: gpt-image-2 每图成本参考 @1024² — low $0.006 / medium $0.053 / high $0.211
    (与 futureagi/cloudprice 等多个独立计算器一致;与实测 token 数 × $30/M 图出换算自洽)
  tier: secondary | verified: partial(多源一致+换算自洽,未见官方页直接数字) | accessed: 2026-08-05

## 存疑/需进一步验证 (Open Questions)

1. **Flash 图出牌价口径分歧**: 内部速报按 $26/M 计($0.027/图)，wavespeed 转述官方公告为 $33/M
   且注明有 $19.50–$33 区间。产物中 Flash 每图成本标注为区间 $0.027–$0.034 并注明分歧。
2. **gpt-image-2 图出 $30/M** 未能从官方定价页直接引用(JS 渲染)；依据 = 实测 token 数
   (medium 1756/high 7024,一手) × 多源一致的每图数字反推。绝对值如需入账请以官方计算器复核。
3. **4 个 HTTP 400 的响应体未存档**: results.json 仅存状态码与 URL。判定为内容过滤依据 =
   仅两个真人题材场景失败(其余 8 场景 GPT 全成功)+ s5 当日复测 2/2 复现 + Azure 文档规定
   被过滤 prompt 返回 400 + code content_filter。产物局限区块如实注明。
4. **Arena 榜单名次**: 微软自家页面 No.2(公告) vs No.3(Labs 页) 不一致；且均为厂商引用的
   社区榜单，本研究不采信榜单名次为结论依据，仅作背景。
5. **内容过滤可配置性的影响未实测**: Azure OpenAI 侧过滤阈值可调(完全关闭需审批)，本次
   实测为默认过滤配置。调低阈值后 GPT 两个人像场景是否可通过，未验证——结论边界已按此收窄。
6. 主观质量裁决(最佳/达标/偏离)为单评审、每格单次生成(n=1)，未做多评审一致性检验。
