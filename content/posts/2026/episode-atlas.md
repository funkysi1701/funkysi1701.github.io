+++
title = "Building Episode Atlas: Tracking 900+ Star Trek Episodes"
date = "2026-06-01T12:00:00Z"
year = "2026"
month = "2026-06"
author = "funkysi1701"
authorTwitter = "funkysi1701"
cover = "/images/2026/episode-atlas/episode-atlas-home.png"
images = [
    "/images/2026/episode-atlas/episode-atlas-home.png",
    "/images/2026/episode-atlas/episode-atlas-episodes.png",
    "/images/2026/episode-atlas/episode-atlas-search.png",
    "/images/2026/episode-atlas/episode-atlas-themes.png",
    "/images/2026/episode-atlas/episode-atlas-random.png"
]
tags = ["Blazor", "Azure", "Star Trek", "Side Projects", ".NET", "Azure Static Web Apps", "Azure Functions", "Cosmos DB"]
categories = ["tech"]
description = "I built Episode Atlas to track Star Trek rewatches across 900+ episodes—search, themes, random picks, and per-user progress with Blazor on Azure."
showFullContent = false
readingTime = true
copyright = false
featured = false
draft = true
diagram = true
aliases = [
    "/episode-atlas",
    "/posts/episode-atlas",
    "/posts/2026/06/01/episode-atlas",
    "/2026/06/01/episode-atlas"
]
+++

If you have ever tried to rewatch *Star Trek* properly—not just dip into a favourite episode, but work through hundreds of instalments across multiple series—you will know the feeling. You pause *Deep Space Nine* for a few weeks, start something else, and suddenly you have no idea which episode you were on. Spreadsheets help for a while, then they do not. Notes on your phone get lost. Memory is unreliable when you jump between TNG, DS9, and whatever new show has just dropped.

That is the problem **[Episode Atlas](https://www.episodeatlas.com/)** exists to solve: **search 900+ episodes, mark what you have watched, and always know what to watch next**—without treating a rewatch like a project-management exercise.

![Episode Atlas homepage: search and track Star Trek episodes](/images/2026/episode-atlas/episode-atlas-home.png)

## Why I built it

I write about *Star Trek* on this blog from time to time—episode reviews, top-50 lists, thoughts on new series—and I kept linking readers to a tool I was building for myself. The honest origin is simpler than that, though: **I wanted a better way to track my own rewatches**.

Generic TV trackers are fine if you watch a bit of everything. They are less helpful when you care about **one enormous franchise** with inconsistent numbering, films mixed in with series, and the urge to jump to “all the Borg episodes” rather than the next sequential instalment. Episode Atlas is deliberately narrow: all of *Star Trek*, in one place, with features shaped by how fans actually rewatch.

## What it does today

You can **[browse without signing up](https://www.episodeatlas.com/)**. Search and filter across the catalogue, open an episode, and see prev/next navigation. If you want your progress saved—a captain’s log, in the site’s wording—you sign in with **GitHub** and mark episodes watched.

| Feature | What it gives you |
|--------|-------------------|
| **Search and filter** | Find episodes by series, season, or keyword |
| **Episode pages** | Metadata, navigation, and your watch history when logged in |
| **Mark watched** | Log rewatches and resume where you stopped |
| **Themes** | Curated lists—Borg, time travel, holodeck stories, and more |
| **Random episode** | When it is 10pm and you want *good* Trek, not just *any* Trek |

The live site spells out the flow clearly: search → open → mark watched → jump to the next episode. That is the whole product in three gestures.

![Episode list: find and filter Star Trek episodes](/images/2026/episode-atlas/episode-atlas-episodes.png)

## Architecture: Blazor on Azure

Episode Atlas is a **.NET Blazor** front end on **Azure Static Web Apps**, with **Azure Functions** for the API and **Azure Cosmos DB** for persistence. **GitHub authentication** handles identity so I did not have to build username-and-password flows for a hobby project.

{{< mermaid >}}
flowchart TB
  subgraph client [Browser]
    UI[Blazor UI]
  end
  subgraph azure [Azure]
    SWA[Static Web Apps]
    FN[Azure Functions API]
    DB[(Cosmos DB)]
  end
  GH[GitHub OAuth]
  UI --> SWA
  UI --> FN
  FN --> DB
  UI --> GH
{{< /mermaid >}}

This is the same broad pattern I described in [Why every developer should have a personal website](/posts/why-do-i-have-a-website/): a **static or WASM front end** hosted cheaply, with **serverless functions** for the bits that need secrets and a database. Episode Atlas is the “playground” side of that split; this Hugo blog is the stable, search-indexed half.

**Why a separate API layer?** Even a small Blazor app benefits from not talking to Cosmos DB directly from the browser. Functions give you a place to enforce auth on writes, keep connection strings off the client, and evolve the API without redeploying every UI tweak. I have used that split when refactoring pages and aligning endpoints—exactly the kind of work I described in [How I use AI on side projects](/how-i-use-ai-on-side-projects/).

Deployment follows the **Azure Static Web Apps + GitHub Actions** path I wrote about in [Using GitHub Actions](/posts/using-github-actions/): push to the repo, build the Blazor app and Functions, publish to SWA. No VM to patch.

## Data: 900+ episodes and per-user watches

The catalogue is the easy part to describe and the fiddly part to maintain: every series, season, episode number, and title needs to stay consistent enough that search and “next episode” logic work. User data is separate—**watch records keyed to your GitHub identity**—so the same episode documents serve every visitor while progress stays private to you.

Design goals I cared about:

- **Fast search** over a large catalogue (keyword and series filters must feel instant).
- **Idempotent “mark watched”**—tapping twice should not corrupt state.
- **Resume anywhere**—picking up DS9 after a TNG detour should still show what *you* last logged on DS9.

Episode and watch data live in **Cosmos DB**, accessed from the Functions API. Partition keys and query shapes matter more than they would in a single-table SQL design—especially when you are loading a user’s watch history alongside catalogue lookups. If you have upgraded .NET versions on a long-lived side project, you may recognise other pains from the same era: I wrote about several .NET 7 migration surprises in [Upgrading to .NET 7](/posts/dotnet7/)—AutoMapper test failures and code coverage in CI—from work on this app around that time.

## Search, themes, and the random picker

**Search** is the front door. Most visits start with “I know roughly what I want” or “which episode was that again?”—filtering by series and season narrows the list; keywords catch titles and descriptions you only half remember.

![Search results filtered by keyword](/images/2026/episode-atlas/episode-atlas-search.png)

**Themes** encode fan knowledge without building a full recommendation engine. Instead of an algorithm guessing what you might like, curated collections point at Borg stories, time-travel episodes, holodeck highlights, and similar lists. They answer a different question from search: *“It’s late, show me something good in this mood.”*

![Curated Star Trek theme collections](/images/2026/episode-atlas/episode-atlas-themes.png)

The **[random episode](https://www.episodeatlas.com/random)** picker is the same idea with less commitment—useful when you and the sofa have agreed on *Star Trek* but not on *which* *Star Trek*.

![Random episode picker](/images/2026/episode-atlas/episode-atlas-random.png)

## Auth: browse first, log in to save

Requiring an account before you can *look* at episodes would have killed the hobby-project vibe. Anonymous browsing keeps the funnel wide; **GitHub login** is only for persisting your log. That matches how I use it: quick lookup without friction, sign in when I am on a serious rewatch and want history to stick.

Static Web Apps integrates auth with the hosting story; the Functions API still has to treat unauthenticated reads and authenticated writes differently. Anything that mutates your watch list goes through the API with a verified identity—not optional for a multi-user database, even when “multi-user” means a handful of friends and me.

## Shipping and upgrading over the years

Episode Atlas has lived through several **.NET versions**—it started life on **.NET Core 3** Blazor and has been carried forward as new releases landed. Side projects are brilliant for that kind of learning until a major upgrade breaks AutoMapper in unit tests or coverage stops reporting in Azure DevOps; then they are less fun for an evening.

What kept me going:

- **Unit tests and coverage in CI**—annoying when they break, invaluable when they catch regressions before deploy.
- **Incremental features**—themes and random episodes did not need a rewrite; they layered on a working catalogue.
- **Azure’s consumption pricing**—SWA and Functions stay sensible for low-traffic apps if you resist over-engineering the database tier.

I have not open-sourced the repository; it is a personal app first and a portfolio piece second. The [projects page](/projects/) summarises the stack if you want a one-screen overview.

## What I would do differently

With hindsight:

- **Invest earlier in screenshot and smoke tests** for the Blazor UI—deploy-only surprises are common with WASM.
- **Document the episode ingest pipeline** the day I built it—I know how the rows got there; future-me has to re-derive it.
- **Be ruthless about scope**—every new series launch is tempting to support on day one; a stable core matters more.

I am happy with “narrow and deep” for *Star Trek*. Generalising to every TV show would be a different product.

## Try it

**[episodeatlas.com](https://www.episodeatlas.com/)** — search without an account, log in when you want your progress saved.

If you are building something similar on **Blazor and Azure**, you might also like [Using GitHub Actions](/posts/using-github-actions/) for SWA deploys and [How I use AI on side projects](/how-i-use-ai-on-side-projects/) for how I split ChatGPT, Cursor, and Copilot when refactoring this codebase.

How do you track long rewatches — spreadsheet, app, or pure memory? I would be interested to hear what works for you in the comments.
