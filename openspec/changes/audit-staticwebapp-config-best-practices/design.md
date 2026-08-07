## Context

[#3475](https://github.com/funkysi1701/funkysi1701.github.io/issues/3475) is a low-priority tech-debt audit of `staticwebapp.config.json`. Related closed work:

| Issue | Outcome |
|-------|---------|
| [#3512](https://github.com/funkysi1701/funkysi1701.github.io/issues/3512) | CI + local `npm run check:swa-config` (SchemaStore + required headers) |
| [#3529](https://github.com/funkysi1701/funkysi1701.github.io/issues/3529) | Removed SPA `navigationFallback` soft-404; `responseOverrides["404"]` → `/404.html` |
| [#3533](https://github.com/funkysi1701/funkysi1701.github.io/issues/3533) | Content-Security-Policy (and related header posture) on SWA responses |

Current config (~16 lines of logic): `$schema`, `responseOverrides.404`, `globalHeaders` (HSTS, frame/MIME/referrer/permissions, CSP). Copied into `public/` on every SWA deploy.

Constraints: multi-page Hugo site — never add `navigationFallback` → `/index.html`; keep CSP usable for Giscus, Zaraz Lite, embeds; British English docs; smallest change.

## Goals / Non-Goals

**Goals:**

- Re-confirm config + validator enforce best practices from the issue acceptance criteria.
- Document the audit trail (closed issues + `check:swa-config`) so the tech-debt scan has a clear “already handled” answer.
- Close #3475 without inventing regressions.

**Non-Goals:**

- Rewriting CSP to remove `unsafe-inline` / `unsafe-eval` (theme/embed reality; separate hardening epic).
- Adding mimeTypes, authentication, or networking blocks without a product need.
- Changing Playwright 404 tests beyond what #3529 already required.

## Decisions

### 1. Validator is the living checklist (default)

**Choice:** Treat `scripts/check_staticwebapp_config.mjs` `REQUIRED_HEADERS` and soft-404 guards as the normative audit checklist; run it rather than maintaining a one-off checklist in the issue comment only.

**Alternatives considered:** Manual Azure portal checklist — drifts from repo; Azure docs alone miss site-specific anti–soft-404 rule.

### 2. No config change unless validator or review finds a defect

**Choice:** Document-and-verify pass; leave JSON unchanged if `check:swa-config` passes and routes/headers match the known good posture.

### 3. Doc polish only for gaps

**Choice:** AGENTS already forbids SPA fallback and points at `check:swa-config`. Add a short “related issues / last audited” note only if useful; prefer not bloating README with closed issue IDs unless CONTRIBUTING checklist lacks a SWA audit cue.

## Risks / Trade-offs

- **[Risk]** Scan reopens on line-count heuristics → **Mitigation:** Close with evidence + CI gate reference.
- **[Trade-off]** CSP remains broad for third parties → Acceptable until a dedicated CSP-hardening issue.

## Migration Plan

1. Run validator; read config vs required headers / 404 override.
2. Doc sync if needed.
3. Close #3475.
4. Rollback: N/A if config untouched.

## Open Questions

None blocking.
