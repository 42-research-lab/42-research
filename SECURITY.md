# Security Policy

## Reporting a Vulnerability

We take the security of 42-research seriously. If you discover a security vulnerability, **please do not open a public issue**.

Use one of the following private channels instead:

- **GitHub Private Vulnerability Reporting** (preferred): [Submit a security advisory](https://github.com/42-research-lab/42-research/security/advisories/new)
- Contact a repository maintainer directly and privately

When submitting a report, please include as much of the following as possible:

- Type of vulnerability and its potential impact
- Steps to reproduce or a proof-of-concept (PoC)
- Affected files, endpoints, or versions
- Suggested remediation (optional)

## Response Commitments

| Milestone | Target |
|-----------|--------|
| Acknowledgement | Within **3 business days** |
| Initial assessment and action plan | Within **7 business days** |
| Credit in release notes | Upon fix publication, with your consent |

We will keep you informed as we work through the disclosure process and coordinate a responsible release.

## Scope

42-research is an open-source technical research site built on TanStack Start and Cloudflare Workers.

**In scope:**

- Injection, XSS, SSRF, or authentication/authorization flaws in the web application
- Supply-chain risks in the build pipeline or dependencies
- Credential exposure (e.g., secrets accidentally committed to the repository)

**Out of scope:**

- Local credential files that are already gitignored (this is intentional, not a vulnerability)
- Infrastructure-level issues in third-party services (Cloudflare, GitHub, etc.)
- Social-engineering scenarios that require a victim to actively execute a malicious action

## Credential Safety

Sensitive files such as `.cloudflare.env` and `.ghcr.env` are declared in `.gitignore` and are **never committed to the repository**. Deployment secrets are injected at runtime via GitHub Actions Secrets.

If you discover that any credentials have been accidentally committed, please report it through the private channels above.

---

<details>
<summary>中文版</summary>

## 报告漏洞

如发现安全漏洞，请**不要**通过公开 Issue 报告，改用以下私密渠道：

- [GitHub Private Vulnerability Reporting（推荐）](https://github.com/42-research-lab/42-research/security/advisories/new)
- 直接私下联系仓库维护者

报告请包含：漏洞类型与影响、复现步骤或 PoC、受影响的文件/端点/版本，以及可选的修复建议。

## 响应承诺

- **3 个工作日内**确认收到
- **7 个工作日内**给出初步评估与处理计划
- 修复发布后，在你同意的前提下于致谢中署名

## 范围

**关注范围**：Web 注入、XSS、SSRF、认证/授权缺陷、供应链风险、凭证泄露。

**不在范围内**：已 gitignore 的本地凭证文件、第三方服务基础设施、社工场景。

## 凭证安全

`.cloudflare.env`、`.ghcr.env` 等敏感文件已在 `.gitignore` 中声明，绝不入库。部署密钥通过 GitHub Actions Secrets 注入。如发现意外提交，请私密报告。

</details>
