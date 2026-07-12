+++ 
title = "Implementing GitOps with Azure DevOps for .NET Apps" 
date = "2026-07-12T19:00:00Z" 
year = "2026" 
month = "2026-07" 
author = "funkysi1701"
authorTwitter = "funkysi1701"
cover = "/images/2026/implementing-gitops-azure-devops.png"
images = ["/images/2026/implementing-gitops-azure-devops.png"]
tags = ["DevOps", "Azure", "AzureDevOps", "DotNet", "CI/CD", "Kubernetes", "GitOps", "Bicep", "KeyVault"]
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

I have written before about [learning Kubernetes](/posts/2025/learning-kubernetes/), [deploying with Helm](/posts/2025/deploying-hugo-with-helm/), [container registries](/posts/2026/acr-vs-ecr/), and the wider [DevOps tooling landscape](/posts/2025/periodic-table-devops-2025/). This post pulls those threads together for a practical GitOps shape that works well with **Azure DevOps** and **.NET** apps — whether you land on **AKS** or **App Service**.

## What GitOps means here

For this post, GitOps means:

1. **Desired state lives in Git** — app manifests, Helm values, Bicep, and environment overlays.
2. **Changes go through pull requests** — review, CI checks, then merge.
3. **Automation reconciles the cloud** — Azure Pipelines (or a cluster agent) applies what Git says.
4. **Rollbacks are Git operations** — revert the commit, re-apply, done.

You do not need Flux or Argo CD on day one. Many .NET teams get most of the value from a **push-based** model: merge to `main` → pipeline deploys. Pull-based operators are a strong next step once AKS is in the mix and you want continuous reconciliation.

## Repository layout that stays sane

I favour a split that keeps app code and deploy config clear without inventing a monorepo religion:

```text
/
├── src/                  # .NET solution
├── tests/
├── infra/                # Bicep (or ARM)
│   ├── main.bicep
│   ├── modules/
│   └── parameters/
│       ├── dev.bicepparam
│       └── prod.bicepparam
├── deploy/               # Kubernetes / App Service config
│   ├── helm/             # or raw manifests / Kustomize
│   └── environments/
│       ├── dev/
│       └── prod/
└── azure-pipelines/      # YAML pipelines
    ├── ci.yml
    └── cd.yml
```

Keep **secrets out of Git**. Keep **non-secret config** in Git. That single rule prevents most of the pain.

## Infrastructure as code with Bicep

Bicep is the comfortable default on Azure: readable, first-class in Azure DevOps, and easier to review than raw ARM JSON.

A thin `main.bicep` that composes modules (App Service or AKS, ACR, Key Vault, networking) plus per-environment `.bicepparam` files keeps diffs reviewable. In Azure Pipelines you typically:

1. Validate (`az bicep build` / what-if).
2. Deploy to a non-prod subscription or resource group.
3. Promote the same templates with different parameters after approval.

What-if before apply is worth the pipeline minutes. Catching a deleted private endpoint in review is cheaper than explaining an outage.

## CI for .NET: build once, promote the artefact

A solid CI pipeline for .NET looks boring on purpose:

- Restore, build, test (`dotnet test`) with a fixed SDK version.
- Publish a versioned artefact or container image.
- Run quality gates you actually trust (tests, scanners, smoke checks).
- Tag the build so CD can promote **the same bits** you tested.

If you containerise, push to **ACR** (or ECR if that is your world — see [ACR vs ECR](/posts/2026/acr-vs-ecr/)) with an immutable tag such as the Git SHA. Avoid deploying `:latest` in anything that matters.

Example shape (abbreviated):

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
    displayName: Build and test

  - task: Docker@2
    inputs:
      command: buildAndPush
      repository: myapp
      Dockerfile: "**/Dockerfile"
      tags: |
        $(Build.SourceVersion)
```



## CD: App Service or AKS



### App Service

For many .NET APIs and sites, App Service is enough. GitOps still applies:

- Slot deploy (staging → swap) for safer releases.
- App settings sourced from Key Vault references or variable groups backed by Key Vault.
- Infrastructure and app version both pinned in Git.



### AKS

If you are on Kubernetes, treat Helm (or Kustomize) values as the environment contract. My earlier [Helm post](/posts/2025/deploying-hugo-with-helm/) is about packaging; GitOps is about **who is allowed to change those values and how they get applied**.

A practical Azure DevOps CD flow:

1. CI publishes chart package + image tag.
2. CD updates the environment overlay in Git (or applies the chart with the new tag).
3. Optional: Flux/Argo watches the repo and reconciles the cluster.

Start push-based if your team already lives in Azure Pipelines. Add a pull agent when you need drift detection and continuous reconciliation.

## Secrets and configuration with Key Vault

Azure Key Vault should own secrets. Apps should receive them via:

- **Key Vault references** on App Service / Container Apps, or
- **CSI Secrets Store** / mounted secrets on AKS, or
- Short-lived injection at deploy time from a pipeline service connection with least privilege.

Do **not** paste connection strings into pipeline variables as plain text and call it done. Variable groups linked to Key Vault, plus managed identity where you can, keep credentials out of logs and YAML.

Config that is not secret (feature flags defaults, URLs, tier sizes) belongs in Git so reviews catch surprises.

## Monitoring and rollbacks

GitOps only helps if you can see whether the desired state is healthy.

- Wire **Application Insights** / OpenTelemetry early.
- Gate production on a smoke test or health endpoint after deploy.
- Prefer **forward fixes** when the bug is in app code; prefer **Git revert** when the bad change was config or infra.

On AKS, `helm rollback` is useful in an emergency, but if Git still says “deploy the bad values”, the next reconciliation may re-break you. Fix Git, then reconcile — that is the habit that makes GitOps real.

## Lessons I keep re-learning

- **One deployable artefact per commit** beats “build again in prod”.
- **Environment overlays** beat copy-pasted pipelines with hard-coded resource names.
- **Approvals and branch policies** are part of the platform, not bureaucracy theatre.
- **Start smaller than the conference talk**. Bicep + YAML pipelines + Key Vault gets you most of GitOps without boiling the ocean.
- Document the happy path for “something is wrong in prod”: which repo, which commit, which pipeline, which revert.



## Wrapping up

GitOps with Azure DevOps for .NET is less about buying a new product and more about discipline: Git holds the desired state, pipelines apply it, Key Vault holds secrets, and rollbacks are deliberate.

If you already have .NET CI working, the next useful step is usually infrastructure and environment config in the same review flow — not a greenfield rewrite. From there, AKS and pull-based operators are an evolution, not a prerequisite.

If you are shaping a similar setup, the related posts above on Kubernetes, Helm, registries, and DevOps tooling are useful companions. I will refine this draft as I tighten the sample pipelines and Bicep layout for a follow-up.