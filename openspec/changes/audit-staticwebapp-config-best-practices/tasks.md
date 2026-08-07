## 1. Audit current config

- [x] 1.1 Read `staticwebapp.config.json` and confirm `$schema`, `responseOverrides["404"]` → `/404.html`, no SPA `navigationFallback`, and required `globalHeaders` (incl. CSP)
- [x] 1.2 Confirm `scripts/check_staticwebapp_config.mjs` + `swa-config.yml` enforce schema and site rules (#3512)
- [x] 1.3 Note related closed issues #3529 (soft-404) and #3533 (CSP) in the close-out narrative

## 2. Doc sync

- [x] 2.1 Confirm `AGENTS.md` / README / CONTRIBUTING still document `check:swa-config` and the no–SPA-fallback rule; update only if drift is found
- [x] 2.2 Leave `staticwebapp.config.json` unchanged unless the audit finds a defect

## 3. Verify and close

- [x] 3.1 Run `npm run check:swa-config` and record success
- [x] 3.2 Comment on and close [#3475](https://github.com/funkysi1701/funkysi1701.github.io/issues/3475) with audit evidence
