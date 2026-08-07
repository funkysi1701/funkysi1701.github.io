## Why

[#3475](https://github.com/funkysi1701/funkysi1701.github.io/issues/3475) asks for an audit of `staticwebapp.config.json` against Azure Static Web Apps best practices (routes, security headers, redirects/fallbacks). Much of the risk surface is already addressed: SchemaStore + site rules via `npm run check:swa-config` / `swa-config.yml` ([#3512](https://github.com/funkysi1701/funkysi1701.github.io/issues/3512)), no SPA `navigationFallback` ([#3529](https://github.com/funkysi1701/funkysi1701.github.io/issues/3529)), and a full `globalHeaders` set including CSP ([#3533](https://github.com/funkysi1701/funkysi1701.github.io/issues/3533)). Remaining work is to re-audit against the current file and validators, document the accepted posture, and close #3475.

## What Changes

- Audit `staticwebapp.config.json` against SWA practice and `scripts/check_staticwebapp_config.mjs` required headers / anti–soft-404 rules.
- Confirm onboarding docs (`AGENTS.md`, README, CONTRIBUTING where relevant) already describe validate-after-edit and forbid SPA fallback; tighten only if drift exists.
- Run `npm run check:swa-config` as evidence; change the JSON only if the audit finds a real defect.
- Close [#3475](https://github.com/funkysi1701/funkysi1701.github.io/issues/3475) with pointers to the closed related issues.

## Capabilities

### New Capabilities

- `staticwebapp-config-audit`: Audited SWA config posture — required security headers, correct 404 override (no SPA homepage fallback), schema + CI validation, and documented operator guidance.

### Modified Capabilities

<!-- No archived openspec/specs/ capability for this area yet. -->

## Impact

- **Config:** `staticwebapp.config.json` (read-only unless a defect is found).
- **Validation:** `scripts/check_staticwebapp_config.mjs`, `scripts/schemas/staticwebapp.config.schema.json`, `.github/workflows/swa-config.yml`.
- **Docs:** Light sync only if the audit criterion or related-issue trail is under-documented.
- **Out of scope:** Broad CSP allowlist reduction, Permissions-Policy redesign, new route redirects, or changing Zaraz/Giscus/embed allowlists without a separate security task.
