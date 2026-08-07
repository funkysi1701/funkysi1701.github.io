## ADDED Requirements

### Requirement: Schema-valid SWA configuration
`staticwebapp.config.json` MUST validate against the vendored SchemaStore schema used by `npm run check:swa-config`.

#### Scenario: Local and CI validation
- **WHEN** a contributor runs `npm run check:swa-config` (or `swa-config.yml` runs in CI)
- **THEN** the command exits successfully if the file matches the schema and site rules
- **THEN** the command fails if the JSON is invalid or required security/routing rules are violated

### Requirement: Correct 404 handling without SPA soft-404
The config MUST map missing routes to the custom 404 page and MUST NOT use a catch-all `navigationFallback` to `/index.html`.

#### Scenario: 404 override present
- **WHEN** the config is audited
- **THEN** `responseOverrides["404"].rewrite` is `/404.html`

#### Scenario: No homepage fallback
- **WHEN** the config is audited
- **THEN** it does not define `navigationFallback` rewriting unknown paths to `/index.html`

### Requirement: Required security headers
The config MUST set `globalHeaders` that include HSTS (max-age ≥ 1 year with includeSubDomains), `X-Frame-Options`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, and a Content-Security-Policy with `default-src 'self'`, `script-src`, `object-src 'none'`, and `frame-ancestors`.

#### Scenario: Validator accepts current headers
- **WHEN** `npm run check:swa-config` runs against the current file
- **THEN** all `REQUIRED_HEADERS` checks pass

### Requirement: Documented operator guidance
Onboarding docs MUST tell contributors to validate SWA config after edits and to avoid SPA `navigationFallback` soft-404s.

#### Scenario: AGENTS documents validate + 404 rule
- **WHEN** an agent reads `AGENTS.md` routing/headers guidance
- **THEN** it learns to run `npm run check:swa-config` and that missing routes must use `responseOverrides["404"]` → `/404.html`

### Requirement: Audit closes without silent regressions
Closing the audit issue MUST record that validation and related soft-404/CSP work already enforce the acceptance criteria, and MUST NOT weaken header or 404 behaviour.

#### Scenario: Close-out evidence
- **WHEN** [#3475](https://github.com/funkysi1701/funkysi1701.github.io/issues/3475) is closed
- **THEN** the closing comment references validator success and related closed issues (#3512, #3529, #3533) as applicable
