## ADDED Requirements

### Requirement: Production deploys to SWA on main push

The site SHALL deploy to the production Azure Static Web Apps resource when commits are pushed to the `main` branch. The build MUST use Hugo with `--minify --environment production --noBuildLock`, copy `staticwebapp.config.json` into `public/`, and upload pre-built static files via `Azure/static-web-apps-deploy` with `skip_app_build: true`. The production canonical URL MUST remain `https://www.funkysi1701.com/`.

#### Scenario: Main branch production deploy

- **WHEN** a commit is pushed to `main`
- **THEN** GitHub Actions builds Hugo with the production environment config and deploys the `public/` artefact to the production SWA
- **THEN** the deployed site is served at `https://www.funkysi1701.com/`

### Requirement: Develop branch deploys to dev and test SWA

The site SHALL deploy to separate dev and test SWA resources when commits are pushed to `develop`. The dev deploy MUST use Hugo `--environment development` (base URL `https://blog-dev.funkysi1701.com/`). The test deploy MUST use Hugo `--environment staging` (base URL `https://blog-test.funkysi1701.com/`). Each deploy MUST copy `staticwebapp.config.json` into `public/` before upload.

#### Scenario: Develop push updates blog-dev and blog-test

- **WHEN** a commit is pushed to `develop`
- **THEN** GitHub Actions deploys a development-environment build to the dev SWA at `https://blog-dev.funkysi1701.com/`
- **THEN** GitHub Actions deploys a staging-environment build to the test SWA at `https://blog-test.funkysi1701.com/`

### Requirement: Feature branches deploy to dev SWA only

The site SHALL deploy to the dev SWA when commits are pushed to `feature/*` branches. The build MUST use Hugo `--environment development`. Feature branches MUST NOT deploy to the test or production SWA.

#### Scenario: Feature branch dev deploy

- **WHEN** a commit is pushed to a branch matching `feature/*`
- **THEN** GitHub Actions deploys a development-environment build to the dev SWA at `https://blog-dev.funkysi1701.com/`
- **THEN** no deploy runs against the test or production SWA for that push

### Requirement: SWA deploy uses pinned Hugo version from .env

All SWA deploy workflows MUST read `HUGO_VERSION` from `.env` and build using the `floryn90/hugo:${HUGO_VERSION}-ext-alpine` Docker image, matching the existing production and `hugo-build.yml` pattern.

#### Scenario: Hugo version parity across environments

- **WHEN** any SWA deploy workflow runs
- **THEN** the Hugo version used for the build matches the value in `.env`
- **THEN** the build flags include `--noBuildLock`

### Requirement: Custom domains point to SWA not Kubernetes

DNS for `blog-dev.funkysi1701.com` and `blog-test.funkysi1701.com` MUST resolve to the corresponding SWA custom-domain endpoints after cutover. Kubernetes ingress MUST NOT serve blog traffic for any environment once migration is complete.

#### Scenario: Blog-dev served by SWA after cutover

- **WHEN** a client requests `https://blog-dev.funkysi1701.com/`
- **THEN** the response is served by Azure Static Web Apps (not the AKS Hugo server deployment)

### Requirement: Kubernetes blog hosting is removed

After successful cutover and validation, the repository MUST NOT contain active Kubernetes/Helm deploy configuration for the blog. The `Helm/blog/` chart and runtime `Dockerfile` (Hugo server image) MUST be removed from the repo. Azure Pipelines MUST NOT build, push, or deploy blog images to ECR/AKS.

#### Scenario: No Helm deploy in CI

- **WHEN** a pipeline runs for `main`, `develop`, or `feature/*`
- **THEN** no step builds a blog Docker image for ECR and no Helm upgrade runs for blog namespaces
