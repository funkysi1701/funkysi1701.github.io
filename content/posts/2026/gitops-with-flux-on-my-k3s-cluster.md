+++
title = "GitOps with Flux on my k3s cluster"
date = "2026-08-18T08:00:00Z"
year = "2026"
month = "2026-08"
author = "funkysi1701"
authorTwitter = "funkysi1701"
cover = "/images/2026/gitops-with-flux-k3s.png"
images = ["/images/2026/gitops-with-flux-k3s.png"]
tags = ["Flux", "GitOps", "Kubernetes", "Helm", "k3s", "DevOps", "SOPS", "cert-manager"]
categories = ["tech"]
keywords = ["Flux CD", "GitOps", "k3s", "HelmRelease", "SOPS", "homelab Kubernetes"]
description = "Flux pulls platform state onto my homelab k3s cluster from git. Apps still deploy from their own repos. Here is the split, the layout, and how a change lands."
showFullContent = false
readingTime = true
copyright = false
featured = false
draft = false
aliases = [
    "/gitops-with-flux-on-my-k3s-cluster",
    "/posts/gitops-with-flux-on-my-k3s-cluster",
    "/posts/2026/08/18/gitops-with-flux-on-my-k3s-cluster",
    "/2026/08/18/gitops-with-flux-on-my-k3s-cluster"
]
+++

I already knew how to put things *on* a Kubernetes cluster. [Helm](/posts/2025/deploying-hugo-with-helm/) packages the YAML. [`kubectl apply`](/posts/2025/learning-kubernetes/) makes it exist. [cert-manager](/posts/2025/kubernetes-and-letsencrypt/) mints the certificates. What I did not have was a boring answer to “what happens next week, when I have forgotten which laptop I ran that from?”

GitOps is that answer, at least for **platform** on my homelab. In practice, GitOps means keeping the desired cluster state in git and having an in-cluster controller continuously reconcile the live cluster back to that state. **`simon-cluster`** is the name I gave the [k3s](https://k3s.io/) cluster I run at home — a small Kubernetes estate for shared ingress, certificates, monitoring, and the GitHub Actions runners this blog builds on. [Flux CD](https://fluxcd.io/) on that cluster watches a private platform repo and keeps it in line with `main`.

The useful part is not “I put YAML in git.” It is the **split**. Flux owns MetalLB, Traefik, cert-manager, GitHub runners, the in-cluster registry, Cloudflare Tunnel, and monitoring. Application Helm releases in `develop` / `main` / `test` still come from **their own repos and pipelines**. Azure DevOps is still in that second column. Flux is not pretending to be the whole estate.

## Pull, not push

A lot of “GitOps” talk is really CI with extra steps: a pipeline authenticates to the cluster and runs `helm upgrade`. That is a **push**. It works. I still do it for apps.

Flux is a **pull**. The cluster has a `GitRepository` pointed at a private platform repo on `main`. Child `Kustomization` objects apply paths under that repo on a schedule. If someone (or some leftover pipeline) changes a Flux-managed object by hand, the next reconcile puts it back.

```yaml
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: flux-system
  namespace: flux-system
spec:
  interval: 1m
  ref:
    branch: main
  url: https://github.com/example/example-config.git
```

Bootstrap is once: install the Flux controllers (`gotk-components.yaml`), give Flux a git credential and an age key for SOPS, apply `gotk-sync.yaml`. After that I mostly work in git rather than reaching for kubeconfig.

```bash
git add -A && git commit -m "…" && git push
flux get all -A
flux reconcile kustomization flux-system --with-source
```

I still keep `kubectl` for poking at pods. I try not to use it as the source of truth for anything Flux already owns.

## How the repo is laid out

```text
clusters/simon-cluster/   # Flux bootstrap + child Kustomizations
infrastructure/           # HelmRepositories, HelmReleases, CRs, SOPS
```

`clusters/simon-cluster` is the entry point Flux syncs. Each child Kustomization is a named slice of the platform with its own interval, `dependsOn`, and (where secrets live) SOPS decryption. `infrastructure/` is the actual YAML those slices apply.

Order matters. Helm charts cannot install until the `HelmRepository` objects exist. cert-manager cannot come up until those sources do. A shortened version of the cert-manager slice looks like this:

```yaml
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: cert-manager
  namespace: flux-system
spec:
  interval: 30m
  dependsOn:
    - name: sources
  path: ./infrastructure/cert-manager
  prune: true
  wait: true
  decryption:
    provider: sops
    secretRef:
      name: sops-age
```

`prune: true` is the bit people skip and then regret. If you delete the manifest and Flux still has prune off, the live object sits there forever looking “fine.” `wait: true` plus `dependsOn` is the other half of that: cert-manager does not race Traefik because the Kustomization will not move on until the slice is healthy.

The Helm install itself is a `HelmRelease`, not a pipeline task:

```yaml
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: cert-manager
  namespace: cert-manager
spec:
  interval: 30m
  chart:
    spec:
      chart: cert-manager
      version: "v1.21.0"
      sourceRef:
        kind: HelmRepository
        name: jetstack
        namespace: flux-system
```

Same idea as [deploying with Helm](/posts/2025/deploying-hugo-with-helm/), except the cluster is the thing that runs `helm`, not me.

## One change, end to end

A typical platform change is dull, which is the point.

1. Edit YAML under `infrastructure/…` (chart version, values, a `ClusterIssuer`, a runner replica count).
2. Open a PR, merge to `main`.
3. Wait for the Kustomization interval, or `flux reconcile` if I am impatient.
4. `flux get hr,ks -A` until the slice is `Ready`.

If it is not Ready, read the condition before assuming git and the cluster agree. That command is the homelab equivalent of a pipeline log.

I already wrote about [Let’s Encrypt on this cluster](/posts/2025/kubernetes-and-letsencrypt/) when cert-manager was a `kubectl apply` of upstream YAML. That install now lives in git as the HelmRelease above plus `ClusterIssuer` manifests. The DNS-01 token is not in those files in plaintext; it is a SOPS-encrypted Secret Flux decrypts on the cluster.

Grafana followed the same path. I first ran it in [Docker Compose for .NET metrics](/posts/2025/setting-up-grafana/). The homelab copy now sits in the `monitoring` namespace, owned by Flux, with dashboards as ConfigMaps in the same repo. Compose taught me the product; GitOps is how it stays installed when I am not watching.

This blog is in the picture too, just not as a website on the cluster. Production is still Azure Static Web Apps. What Flux *does* provision for this repo is a pool of [Actions Runner Controller](https://github.com/actions/actions-runner-controller) runners labelled `k8s`, so GitHub Actions can build on the homelab instead of burning hosted minutes. The `RunnerDeployment` is YAML in that private platform repo. The workflows stay in *this* git repo. That is the split in miniature.

## Secrets in git, not in chat

Platform secrets are `*.enc.yaml` files encrypted with [SOPS](https://github.com/getsops/sops) and [age](https://age-encryption.org/). Flux has a `sops-age` Secret in `flux-system` (created once, not committed) and Kustomizations that need secrets set `decryption.provider: sops`.

What *is* in git: Cloudflare DNS-01, the ARC GitHub token, Grafana admin, registry pull secrets, tunnel token. What is **not**: the age private key. If you clone that private platform repo you get ciphertext and the public key in `.sops.yaml`. That is enough to *add* a secret if you have the private key locally; it is not enough to read the live ones.

This is not Azure Key Vault. A homelab cluster does not need a cloud HSM to stop me committing a PAT. It needs encryption at rest in git and a bootstrap secret that never hits GitHub. The repo documents how SOPS and age are wired up.

## What Flux does not own

I keep an ownership map in that private platform repo because GitOps fails the moment two systems apply the same object. Deciding who is allowed to apply has been more useful than any controller version pin. The short version:

| Owner | Examples |
| --- | --- |
| **This repo (Flux)** | Namespaces, MetalLB, cert-manager, Traefik, ARC, Zot, cloudflared, monitoring |
| **App git + CI** | Helm releases in `develop` / `main` / `test` (blog chart, TrekRanks, SQL, …) |
| **k3s / the node** | CoreDNS, local-path, metrics-server, disable bundled Traefik |

Several apps still deploy from Azure DevOps. That is fine. It is **push CI**, and Flux will not “fix” a Deployment it does not declare. If an old pipeline and a HelmRelease both think they own Grafana, they will fight. I moved monitoring into Flux on purpose so there is one owner.

k3s itself is not GitOps in this repo either. Node join, versions, and “do not run the bundled Traefik” are documented and applied on the hosts. Flux cannot bootstrap the thing that runs Flux.

In-cluster [Renovate](https://docs.renovatebot.com/) is a small extra: it opens image-bump PRs against that private platform repo. Upgrades become git history too, not SSH-and-hope. One note on Renovate, the Renovate package itself is very noisy, with multiple update PRs raised per day. I have chosen to automerge these, but you may want to consider skiping this package or updating on a schedule.

I would not start a new cluster by SSHing in and applying twenty manifests. Ingress, certificates, runners, and monitoring are shared, so they belong in git from the start. I would still start a new *app* with a pipeline and a Helm chart in *that* repo — Flux `HelmRelease` is how those charts get onto the cluster, not a replacement for packaging.

I have not moved every Helm chart into Flux, and I am not pretending that is a moral failing. GitOps earned its place here by making the platform dull. Dull is the goal.

If you run Kubernetes at home — or you are weighing GitOps against push CI — how do you split **platform** from **apps**? Full pull, pipelines only, or a hybrid like mine? I would be interested to hear what works for you in the comments.

If this is your first step on the same path, these posts are where I started: [learning Kubernetes](/posts/2025/learning-kubernetes/), [deploying with Helm](/posts/2025/deploying-hugo-with-helm/), and [Let's Encrypt on the cluster](/posts/2025/kubernetes-and-letsencrypt/). For a monthly email when I publish something new, [subscribe to the newsletter](/newsletter).
