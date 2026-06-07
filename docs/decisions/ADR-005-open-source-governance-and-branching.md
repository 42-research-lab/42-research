# ADR-005 · Open-source governance and the dev → main branching model

- **Status**: Accepted
- **Date**: 2026-06-07
- **Deciders**: 42-research-lab
- **Related**: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Context

42-research is published as an open-source project under the `42-research-lab` GitHub organization. To keep `main` always release-ready and the history clean and reviewable, the project needs an explicit, enforced branching and contribution model.

## Decision

### 1. Two-branch model: `dev → main`

| Branch | Role |
|--------|------|
| `main` | Stable, always-deployable release branch. Protected. |
| `dev` | Integration branch. All day-to-day work lands here first. |

- Feature work branches off `dev` with conventional-commit prefixes: `feat/`, `fix/`, `docs/`, `chore/`.
- **No direct commits or PRs to `main`** except releases.

### 2. One issue → one PR

Each unit of work is tracked by a single issue and delivered by a single focused PR into `dev`. This keeps changes diffable, reviewable, and easy to revert, and keeps `main` clean once changes are promoted.

### 3. `main` branch protection

`main` is protected with:

- Required status checks (must be green before merge): the `Web` and `Research` CI jobs
- Required pull request before merging
- Linear history required
- Force-pushes and deletions disabled

### 4. English-only history and commits

All commit messages are written in **English**. The repository history was reset to a single clean English baseline before the first public release; the project no longer carries the pre-release Chinese commit history.

### 5. English-first, bilingual content

The website and public-facing documents default to **English**, with **Chinese** available (see [ADR-004](ADR-004-dual-format-and-llm-seo.md) and the `src/i18n` catalog). Process artifacts and internal scaffolding are kept out of the public, reader-facing surface.

## Consequences

### Positive

- `main` is always releasable and its history is clean and English-only.
- Contributions are small, reviewable, and traceable to an issue.
- Branch protection enforces the model mechanically, not by convention alone.

### Trade-offs

- The pre-release Chinese commit history was intentionally discarded (single-author, no forks at the time) in exchange for a clean English baseline.
- A release step (`dev` → `main` PR) is required to ship, adding a small amount of ceremony in return for a protected, always-green `main`.
