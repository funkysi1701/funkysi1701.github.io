+++
title = "Implementing GitOps with Azure DevOps for .NET Apps"
date = "2026-07-12T19:00:00Z"
year = "2026"
month = "2026-07"
author = "funkysi1701"
authorTwitter = "funkysi1701"
cover = "/images/2026/implementing-gitops-azure-devops.png"
images = ["/images/2026/implementing-gitops-azure-devops.png"]
tags = ["DevOps", "Azure", "AzureDevOps", "DotNet", "CI/CD", "Kubernetes", "GitOps", "Bicep", "KeyVault", "Episode Atlas", "Signal Diff"]
categories = ["tech"]
description = "A hands-on GitOps guide for .NET apps using Azure DevOps: Bicep infrastructure, CI/CD, Key Vault secrets, and safer rollbacks on AKS or App Service."
showFullContent = false
readingTime = true
copyright = false
featured = false
draft = false
aliases = [
  "/implementing-gitops-with-azure-devops-for-net-apps",
  "/posts/implementing-gitops-with-azure-devops-for-net-apps",
  "/posts/2026/07/12/implementing-gitops-with-azure-devops-for-net-apps",
  "/2026/07/12/implementing-gitops-with-azure-devops-for-net-apps"
]
+++

GitOps is one of those terms that can sound like marketing fluff until you try to run a .NET estate across environments without spreadsheet-driven deploys. In practice it is simple: **Git is the source of truth**, and pipelines apply that truth to Azure.

I have written before about [learning Kubernetes](/posts/2025/learning-kubernetes/), [deploying with Helm](/posts/2025/deploying-hugo-with-helm/), [container registries](/posts/2026/acr-vs-ecr/), and the wider [DevOps tooling landscape](/posts/2025/periodic-table-devops-2025/). This post pulls those threads together using two projects I actually run: **[Episode Atlas](https://www.episodeatlas.com/)** — a .NET Blazor app on Azure Static Web Apps with Functions and Cosmos DB — and **[Signal Diff](https://signaldiff.dev/)** — the deploy-to-deploy SEO check that gates this blog after each Static Web Apps release.

You do not need AKS on day one. Episode Atlas is the App Service / Static Web Apps path. Signal Diff is the “did the live site still match what we meant?” gate. Kubernetes stays available when the workload grows into it.

## What GitOps means here

For this post, GitOps means:

1. **Desired state lives in Git** — app code, Bicep, environment overlays, and pipeline YAML.
2. **Changes go through pull requests** — review, CI checks, then merge.
3. **Automation reconciles the cloud** — Azure Pipelines or GitHub Actions apply what Git says.
4. **Rollbacks are Git operations** — revert the commit, re-apply, done.
5. **Live verification is part of the loop** — a health check or a Signal Diff crawl confirms the deploy, not just the pipeline exit code.

You do not need Flux or Argo CD on day one. Many .NET teams get most of the value from a **push-based** model: merge to `main` → pipeline deploys. That is how Episode Atlas and this blog ship. Pull-based operators are a strong next step once AKS is in the mix and you want continuous reconciliation.

## Two lived examples

### Episode Atlas — the .NET app

[Episode Atlas](/posts/2026/episode-atlas/) is a Star Trek rewatch tracker: search 900+ episodes, mark progress, earn ranks. The stack is **.NET Blazor**, **Azure Functions**, **Cosmos DB**, **GitHub auth**, hosted on **Azure Static Web Apps**.

That shape is a useful GitOps teaching case because it is real:

- A **Blazor front end** and **Functions API** that must stay contract-aligned.
- **Cosmos** connection strings and OAuth secrets that must never live in Git.
- Non-secret config (catalogue behaviour, feature defaults, environment URLs) that *should* live in Git so reviews catch surprises.
- A **push-based** deploy: merge → build → Static Web Apps. Same discipline as App Service, without inventing a Kubernetes story the app does not need.

### Signal Diff — the post-deploy gate

[Signal Diff](https://signaldiff.dev/) compares a sitemap crawl of the live site against a baseline (often the previous commit). This blog calls it after production and blog-dev Static Web Apps deploys via [`funkysi1701/signal-diff-action`](https://github.com/funkysi1701/signal-diff-action). Secrets stay in GitHub (`SIGNALDIFF_API_BASE_URL`, `SIGNALDIFF_CI_API_KEY`); the workflow pins a versioned action and a fail mode.

GitOps is incomplete if “pipeline green” is your only signal. Signal Diff is how I ask: did titles, descriptions, and routes still look right after we shipped?

## Repository layout that stays sane

For an Episode Atlas-style solution I favour a split that keeps UI, API, infra, and pipelines clear without inventing a monorepo religion:

```text
/
├── src/
│   ├── EpisodeAtlas.Client/     # Blazor UI
│   └── EpisodeAtlas.Functions/  # Azure Functions API
├── tests/
├── infra/                       # Bicep (SWA, Functions, Cosmos, Key Vault)
│   ├── main.bicep
│   ├── modules/
│   └── parameters/
│       ├── dev.bicepparam
│       └── prod.bicepparam
├── deploy/                      # optional: App Service / AKS overlays later
└── azure-pipelines/             # or .github/workflows/
    ├── ci.yml
    └── cd.yml
```

Keep **secrets out of Git**. Keep **non-secret config** in Git. That single rule prevents most of the pain — whether the secret is a Cosmos key for Episode Atlas or a Signal Diff API key for the blog.

## Infrastructure as code with Bicep

Bicep is the comfortable default on Azure: readable, first-class in Azure DevOps, and easier to review than raw ARM JSON.

For Episode Atlas the interesting modules are the ones that actually exist in the architecture: Static Web Apps (or App Service), Functions, Cosmos DB, Key Vault, and the identities that let Functions reach Cosmos without a connection string in app settings forever. Per-environment `.bicepparam` files keep diffs reviewable.

In Azure Pipelines you typically:

1. Validate (`az bicep build` / what-if).
2. Deploy to a non-prod subscription or resource group.
3. Promote the same templates with different parameters after approval.

What-if before apply is worth the pipeline minutes. Catching a deleted private endpoint — or an accidental Cosmos throughput change — in review is cheaper than explaining an outage.

## CI for .NET: build once, promote the artefact

Episode Atlas CI should look boring on purpose:

- Restore, build, and test the Blazor client and Functions projects with a fixed SDK version.
- Publish versioned artefacts (SWA zip / Functions package) — or a container image if you later move off SWA.
- Run quality gates you actually trust (unit tests, contract checks between client and Functions).
- Tag the build so CD can promote **the same bits** you tested.

If you containerise later, push to **ACR** (or ECR — see [ACR vs ECR](/posts/2026/acr-vs-ecr/)) with an immutable tag such as the Git SHA. Avoid deploying `:latest` in anything that matters.

Example shape (abbreviated Azure Pipelines YAML):

```yaml
trigger:
  branches:
    include:
      - main
      - develop

pool:
  vmImage: ubuntu-latest

variables:
  buildConfiguration: Release

steps:
  - task: UseDotNet@2
    inputs:
      packageType: sdk
      version: "10.0.x"

  - script: |
      dotnet restore
      dotnet build --configuration $(buildConfiguration) --no-restore
      dotnet test --configuration $(buildConfiguration) --no-build --logger trx
    displayName: Build and test Blazor + Functions

  - task: DotNetCoreCLI@2
    displayName: Publish Functions
    inputs:
      command: publish
      publishWebProjects: false
      projects: "**/EpisodeAtlas.Functions.csproj"
      arguments: "--configuration $(buildConfiguration) --output $(Build.ArtifactStagingDirectory)/functions"
      zipAfterPublish: true
```

Swap the project names for your solution; the important part is **one commit → one artefact set** that CD promotes unchanged.

## CD: Static Web Apps, App Service, or AKS

### Episode Atlas path — Static Web Apps / App Service

For Episode Atlas, Azure Static Web Apps is enough. GitOps still applies:

- Desired UI and API packages come from the commit you just built.
- App settings for Cosmos and GitHub auth come from **Key Vault references** or variable groups backed by Key Vault — not pasted into YAML.
- Infrastructure (Bicep) and app version both pinned in Git.
- Slot-style or staged deploys (dev → prod) with approvals when the blast radius grows.

App Service is the same story with different hosting knobs: staging slots, swaps, and Key Vault-backed settings. The GitOps habit does not change.

### When you outgrow that — AKS

If you later move a .NET API onto Kubernetes, treat Helm (or Kustomize) values as the environment contract. My earlier [Helm post](/posts/2025/deploying-hugo-with-helm/) is about packaging; GitOps is about **who is allowed to change those values and how they get applied**.

A practical Azure DevOps CD flow:

1. CI publishes chart package + image tag.
2. CD updates the environment overlay in Git (or applies the chart with the new tag).
3. Optional: Flux/Argo watches the repo and reconciles the cluster.

Start push-based if your team already lives in Azure Pipelines or GitHub Actions — that is how Episode Atlas and this blog work today. Add a pull agent when you need drift detection and continuous reconciliation.

## Secrets and configuration with Key Vault

Azure Key Vault should own secrets. For Episode Atlas that means Cosmos keys (until managed identity replaces them), GitHub OAuth client secrets, and any third-party API keys. For Signal Diff consumers, that means `SIGNALDIFF_*` credentials in the CI vault — never in the workflow file.

Apps and pipelines should receive secrets via:

- **Key Vault references** on Static Web Apps / App Service / Container Apps, or
- **Managed identity** from Functions to Cosmos wherever you can, or
- Short-lived injection at deploy time from a pipeline service connection with least privilege.

Do **not** paste connection strings into pipeline variables as plain text and call it done. Variable groups linked to Key Vault keep credentials out of logs and YAML.

Config that is not secret — feature defaults, public URLs, fail modes for Signal Diff (`none` vs `error` vs `errorOrWarning`) — belongs in Git so reviews catch policy changes.

## Monitoring and rollbacks

GitOps only helps if you can see whether the desired state is healthy.

For **Episode Atlas**, wire **Application Insights** / OpenTelemetry on the Blazor client path and Functions early. Gate production on a smoke test or health endpoint after deploy. Prefer **forward fixes** when the bug is in app code; prefer **Git revert** when the bad change was config or infra.

For **this blog**, Signal Diff is the post-deploy check. After the production Static Web Apps job finishes, a follow-on job runs:

```yaml
- name: Run Signal Diff crawl
  uses: funkysi1701/signal-diff-action@v1.10
  with:
    api_base_url: ${{ secrets.SIGNALDIFF_API_BASE_URL }}
    api_key: ${{ secrets.SIGNALDIFF_CI_API_KEY }}
    sitemap_url: ${{ vars.SIGNALDIFF_DEFAULT_SITEMAP_URL }}
    fail_mode: none
    comment_on_pr: true
    collect_code_changes: true
```

That is GitOps-adjacent discipline: Git said “ship this commit”; Signal Diff asks whether the live sitemap still looks like what that commit intended. On blog-dev the same action runs in agent mode against `https://blog-dev.funkysi1701.com/sitemap.xml`, correlated with `commit_sha` and a baseline ref.

On AKS, `helm rollback` is useful in an emergency, but if Git still says “deploy the bad values”, the next reconciliation may re-break you. Fix Git, then reconcile — that is the habit that makes GitOps real.

## Lessons I keep re-learning

- **One deployable artefact per commit** beats “build again in prod” — true for Episode Atlas packages and for Hugo builds on this blog.
- **Environment overlays** beat copy-pasted pipelines with hard-coded resource names.
- **Approvals and branch policies** are part of the platform, not bureaucracy theatre.
- **Verify the live site**, not only the pipeline — Signal Diff exists because “deploy succeeded” is not the same as “SEO and routes are fine”.
- **Start smaller than the conference talk**. Blazor + Functions + SWA + Key Vault gets you most of GitOps without boiling the ocean. AKS can wait.
- Document the happy path for “something is wrong in prod”: which repo, which commit, which pipeline, which revert — and which Signal Diff report to read.

## Wrapping up

GitOps with Azure DevOps for .NET is less about buying a new product and more about discipline: Git holds the desired state, pipelines apply it, Key Vault holds secrets, and rollbacks are deliberate. Episode Atlas is my concrete .NET example of that loop on Azure Static Web Apps. Signal Diff is how I close the loop after a deploy lands.

If you already have .NET CI working, the next useful step is usually infrastructure and environment config in the same review flow — not a greenfield rewrite. Add a post-deploy check (health endpoint or a Signal Diff-style crawl) before you chase Flux. From there, AKS and pull-based operators are an evolution, not a prerequisite.

If you are shaping a similar setup, the related posts on [Episode Atlas](/posts/2026/episode-atlas/), Kubernetes, Helm, registries, and DevOps tooling are useful companions — and [signaldiff.dev](https://signaldiff.dev/) is there when you want deploy diffs as a first-class gate.
