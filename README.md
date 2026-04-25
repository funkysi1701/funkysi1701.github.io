
# funkysi1701.com – Blog Powered by Hugo

This repository contains the source for [funkysi1701.com](https://www.funkysi1701.com?utm_source=gh), hosted on Azure Static Web Apps.

## 🚀 Getting Started


### Prerequisites

- [Hugo](https://gohugo.io/) must be installed.

### Local Development

Run locally with Hugo:

```sh
hugo server -D
```

#### Docker/Compose Setup

The Hugo version is set in the `.env` file as `HUGO_VERSION`. Update this file to change the version everywhere.

To run with Docker Compose:

```sh
docker-compose up
```

To run with Docker directly:

```sh
docker run --rm -it -v .:/src -p 1313:1313 floryn90/hugo:${HUGO_VERSION} server -D --disableFastRender --environment development
```

## 🧪 Testing

End-to-end tests use **[Playwright](https://playwright.dev/)** (`@playwright/test`). Playwright tests (spec files) live under `tests/`; many files reference the high-level plan in **`specs/funkysi1701-test-plan.md`** (see `specs/README.md`).

```sh
npm ci
npx playwright install chromium
npm test
```

By default, `playwright.config.ts` uses **`BASE_URL`** of `https://www.funkysi1701.com` when unset. For local or staging targets, set the variable (PowerShell: `$env:BASE_URL="http://localhost:1313"; npm test`).

**Azure DevOps** runs the full suite in **`azure-pipelines-playwright.yml`**: it sets `BASE_URL` to production for **`main`** (and **`master`** if used) and to **`https://blog-dev.funkysi1701.com`** for **`develop`**. After tests, **`scripts/generate-page-coverage.js`** can feed **Codecov** when `CODECOV_TOKEN` is configured in the pipeline.

**GitHub Actions** (`.github/workflows/`) includes checks such as **meta title** (50–60 characters) and **meta description** (110–160 characters) for `content/posts/**/*.md` via `scripts/check_meta_titles.py` and `scripts/check_meta_descriptions.py`.

For Hugo changes, still verify with `hugo server -D` or a production build (`hugo --minify --environment production`) as needed.

### Parkrun results (`content/parkrun.md`)

Official parkrun 5k tables and the progress chart are **generated** by `scripts/update_parkrun_results.py`, which reads each course’s parkrunner page under [parkrun.org.uk](https://www.parkrun.org.uk/). Non-parkrun races and manual notes live **outside** the `<!-- BEGIN PARKRUN_GENERATED -->` … `<!-- END PARKRUN_GENERATED -->` block.

```sh
pip install -r scripts/requirements-parkrun.txt
python scripts/update_parkrun_results.py
```

Optional environment variables: `PARKRUN_ID` (default `11453050`), `PARKRUN_BASE` (default `https://www.parkrun.org.uk`). To omit a scraped row that you disagree with (for example a DNF), add an entry to `data/parkrun_suppress.json`. You can refresh results manually from GitHub Actions via **Update parkrun results** (`.github/workflows/parkrun-update.yml`); it opens a pull request into **develop** (it does not push to protected **develop** directly).

## 🚢 Deployment and branches

- **`main`:** Production ([funkysi1701.com](https://www.funkysi1701.com?utm_source=gh)). GitHub Actions builds Hugo and deploys **Azure Static Web Apps** (`.github/workflows/azure-static-web-apps-victorious-pebble-0b8f90e03.yml`). **Azure Pipelines** also builds the Docker image, pushes to **ECR**, and deploys with **Helm** to the Kubernetes **`main`** namespace (`azure-pipelines.yml`).
- **`develop`:** Integration branch. Azure Pipelines builds and deploys to the **`develop`** and **`test`** namespaces (e.g. blog-dev / blog-test). **`.github/workflows/auto-pr.yml`** can open or refresh a **develop → main** pull request when `develop` is pushed.
- **`feature/*`:** Feature branches; Azure Pipelines builds and targets the **`develop`** namespace (not `test`), per pipeline conditions.

There is no separate branch named `dev`; use **`develop`** for integration work.

## 🛠 Built With

- [Hugo](https://gohugo.io/) – Static site generator

## 🤝 Contributing

Open to suggestions and improvements. Feel free to submit PRs!

## 👤 Author

- **Simon Foster** ([funkysi1701](https://github.com/funkysi1701))

See [contributors](https://github.com/funkysi1701/funkysi1701.github.io/contributors) for more.

## 🙏 Acknowledgments

Thanks to other bloggers and the open-source community.

---

[![Azure Static Web Apps CI/CD](https://github.com/funkysi1701/funkysi1701.github.io/actions/workflows/azure-static-web-apps-victorious-pebble-0b8f90e03.yml/badge.svg)](https://github.com/funkysi1701/funkysi1701.github.io/actions/workflows/azure-static-web-apps-victorious-pebble-0b8f90e03.yml)
[![pages-build-deployment](https://github.com/funkysi1701/funkysi1701.github.io/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/funkysi1701/funkysi1701.github.io/actions/workflows/pages/pages-build-deployment)

