# 安全策略 · Security Policy

## 报告漏洞

我们重视 42-research 的安全。如果你发现了安全漏洞，请**不要**通过公开 Issue 报告。

请改用以下任一私密渠道：

- GitHub 的 [Private vulnerability reporting](https://github.com/42-research-lab/42-research/security/advisories/new)（推荐）
- 向仓库维护者私下联系

报告时请尽量包含：

- 漏洞类型与影响范围
- 复现步骤或概念验证（PoC）
- 受影响的文件 / 端点 / 版本
- 你认为可行的修复方向（可选）

## 响应承诺

- **3 个工作日内**确认收到报告
- **7 个工作日内**给出初步评估与处理计划
- 修复发布后，在征得你同意的前提下，于致谢中署名

## 范围

本项目是一个开源研究站点（TanStack Start + Cloudflare Workers）。以下属于关注范围：

- Web 应用的注入、XSS、SSRF、认证/授权缺陷
- 构建链与依赖的供应链风险
- 凭证泄露（如 `.env` 类文件被误提交）

以下**不在**范围内：

- 已 gitignore 的本地凭证文件（设计如此，非漏洞）
- 第三方服务（Cloudflare / GitHub）自身的基础设施问题
- 需要受害者主动执行恶意操作的社工场景

## 凭证安全

`.cloudflare.env`、`.ghcr.env` 等敏感文件已在 `.gitignore` 中声明，**绝不入库**。
部署密钥通过 GitHub Actions Secrets 注入。若发现任何凭证被意外提交，请按上述流程私密报告。
