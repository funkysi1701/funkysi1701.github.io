+++
title = "Signal Diff CLI for coding agents"
date = "2026-09-21T12:00:00Z"
year = "2026"
month = "2026-09"
author = "funkysi1701"
authorTwitter = "funkysi1701"
cover = "/images/2026/signal-diff-cli.png"
images = ['/images/2026/signal-diff-cli.png']
tags = ["AI", "DevOps", "Signal Diff", "Open Source", "Side Projects"]
categories = ["tech"]
keywords = ["Signal Diff CLI", "SEO crawl", "AI coding agents", "Cursor", "GitHub Actions"]
description = "Coding agents can crawl a sitemap and read deploy diffs with the Signal Diff CLI. No browser session, and no MCP server to configure."
showFullContent = false
readingTime = true
copyright = false
featured = false
draft = false
aliases = [
    "/signal-diff-cli",
    "/posts/signal-diff-cli",
    "/posts/2026/09/21/signal-diff-cli",
    "/2026/09/21/signal-diff-cli"
]
+++

I already know whether a deploy of this blog broke titles, descriptions, or routes. After the Static Web Apps job finishes, [Signal Diff](https://signaldiff.dev/) crawls the sitemap and compares the live site with a baseline. I wrote that loop up in [GitOps with Azure DevOps for .NET apps](/posts/2026/implementing-gitops-with-azure-devops-for-net-apps/). The Action is the unattended gate. It sits quiet during the hour I am in Cursor, halfway through a layout change, wanting the same answer before I push.

That is the job of the `signaldiff` CLI. Coding agents already have a terminal. A terminal is enough to crawl a sitemap and read the report. There is no browser session to open, and no MCP server to configure.

## What Signal Diff is doing

[Signal Diff](https://signaldiff.dev/) fetches the URLs in a sitemap and looks for on-page SEO and crawl problems: titles, meta descriptions, redirects, slow responses, and the rest of the check list. A later run can diff against a baseline, often the previous deploy, so you see what changed.

The site and the GitHub Action came first. I still use those. The CLI is the same product when the caller is a shell, which is where Cursor, Copilot, and Claude Code already are. Signal Diff also has a customer-hosted crawler for teams who want the crawl to stay on their network. This post stays on the coding-agent path.

## Why I added a CLI

I wanted a crawl with no account. If I am showing an agent a site, or trying the tool on a sitemap I do not monitor yet, sign-in can wait. `signaldiff --sitemap` writes an HTML report on this machine. No API key.

I wanted the dashboard questions in the terminal once a key does exist: which sites, what the last run found, what changed since the baseline. The subcommands `sites`, `runs`, `diff`, `findings`, and `scan` call the [Agent API](https://signaldiff.dev/docs/agent-api). The agent stays in the repo. I stay out of a second tab.

An MCP host would have been another install, then another client to teach. The tools I already use can run a command and read a file. One executable on `PATH` is the setup I wanted. The command reference is at [signaldiff.dev/docs/cli](https://signaldiff.dev/docs/cli).

A few behaviours matter once an agent is the one typing:

- `signaldiff` with no arguments prints help and exits. It does not start a crawl.
- `--json` belongs on cloud subcommands. Success JSON goes to stdout. A failure is one JSON object on stderr, with a status code and, on a rate limit, how many seconds to wait. Progress logs stay on stderr, so a pipe keeps the result.
- A local `--sitemap` crawl refuses `--json` and still writes HTML.

## Install, then crawl this blog

The installers are self-contained. You do not need the .NET SDK, and you do not need a clone of the repo. On Windows:

```powershell
irm 'https://signaldiff.dev/install/cli.ps1' -OutFile "$env:TEMP\signaldiff-install-cli.ps1"
& "$env:TEMP\signaldiff-install-cli.ps1"
```

On Linux or macOS:

```bash
curl -fsSL 'https://signaldiff.dev/install/cli.sh' | bash
```

Open a new terminal so `PATH` picks up the binary (`~/.local/bin` on Linux and macOS). Then crawl a real sitemap, with a page cap so the first run stays small:

```powershell
signaldiff --sitemap https://www.funkysi1701.com/sitemap.xml --max-pages 20 --output seo-report.html --quiet
```

`--output` creates missing folders before the crawl starts. `--quiet` keeps the summary short. The report path is on stdout. I point this at my own sitemap because that is the site I already monitor. Swap in yours.

`signaldiff update` replaces the install with the latest published build and checks the SHA256. `signaldiff update --check` tells you whether one is waiting, and leaves the current binary alone.

## What I tell the agent

The API key stays in the environment. It stays out of the chat. Here is the prompt I give Cursor, Copilot, or Claude Code:

> Install the Signal Diff CLI from https://signaldiff.dev/docs/cli. Then, in a new terminal, run `signaldiff --sitemap https://www.funkysi1701.com/sitemap.xml --max-pages 20 --output seo-report.html --quiet`. Read `seo-report.html` and list the SEO and crawl issues worth fixing, with the URL for each and a concrete change. Use cloud commands only if `SIGNALDIFF_API_KEY` is already set. Leave the key out of the chat.

That is the loop. The agent installs if it must, runs a capped crawl, and works from the HTML. I still read the suggestions. A title that is two characters over the limit is a real fix. A rewrite of a post I care about is a suggestion until I agree with it.

This sits next to the split I described in [how I use AI on side projects](/posts/2026/how-i-use-ai-on-side-projects/). ChatGPT when the question needs no repo. Cursor when the answer is in the files. The CLI when the question is about the live sitemap.

## When a key is already set

Cloud commands need a paid key from the Signal Diff dashboard (Developers → API keys). Set it in the environment. Prefer that to `--api-key`, which shows up in the process list.

```powershell
$env:SIGNALDIFF_API_KEY = "sck_…"
$env:SIGNALDIFF_API_BASE_URL = "https://signaldiff.dev/api"
```

The base URL includes `/api`. That is the easy one to get wrong. The GitHub Action uses a different variable, and the site origin with no `/api` suffix. Same secret value. Different names, different URL shape.

| Caller | Variable | Base URL |
|---|---|---|
| CLI and the Agent API | `SIGNALDIFF_API_KEY` | `https://signaldiff.dev/api` |
| GitHub Action | `SIGNALDIFF_CI_API_KEY` | `https://signaldiff.dev` |

These are the commands I want an agent to run once that is set:

| You want | Command |
|---|---|
| Sites you already monitor | `signaldiff sites list` |
| A short brief for one run | `signaldiff runs summary <runId>` |
| Only the deploy diff | `signaldiff diff get <runId>` |
| Errors from that run | `signaldiff findings list <runId> --severity Error --limit 50` |
| Machine-readable output | add `--json` |

`runs summary` is the one I point agents at. It is a capped brief: headline counts, top regressions, top improvements, and fix hints. It leaves out the full page payload. `diff get` is there when the only question is what changed against the baseline.

Starting a cloud scan is a separate decision. `signaldiff scan start` queues work on the service, and `signaldiff scan wait <scanId> --json` polls until it finishes. I leave that out of the default prompt. A local HTML report answers "what is wrong on this sitemap right now". A cloud scan spends quota and shows up in the dashboard, so I ask for it on purpose.

## The Action still runs after deploy

The pipeline check stays. On this blog the Action still crawls after a Static Web Apps deploy, with the API key in GitHub secrets and a pinned action version. The wiring is in the [GitOps post](/posts/2026/implementing-gitops-with-azure-devops-for-net-apps/). The Action answers "did this deploy stay healthy?" when I am not looking. The CLI answers the same question while an agent and I are still in the change.

## Try it on a sitemap you care about

Install the CLI, cap a crawl with `--max-pages`, and have the agent read the HTML before it edits templates. If you already have a key, ask for `runs summary` on the latest run and see whether the brief is enough to act on.

I am curious how you give an agent this kind of check. A CLI it can run, an MCP server, or a dashboard you still open by hand? Tell me in the comments. Command reference, updates, and checksums are on the [CLI docs](https://signaldiff.dev/docs/cli).
