+++
title = "Projects"
author = "funkysi1701"
authorTwitter = "funkysi1701"
cover = ""
keywords = ["projects", "portfolio", "open source", "apps", "Azure", ".NET", "Blazor"]
description = "Featured work and grouped portfolio: cloud systems, AI-backed apps, and tools — with engineering signals and outcomes."
showFullContent = false
copyright = false
readingTime = true
comment = false
aliases = [
    "/projects"
]
+++

<h2 id="featured-projects-heading">Featured Projects</h2>

<p class="projects-featured-intro">Three live Azure workloads I own end-to-end — CI/CD static delivery, AI-backed search on real content, and full-stack Blazor with actual users. </p>

<div class="projects-featured" role="region" aria-labelledby="featured-projects-heading">
<div class="projects-featured-grid">
<article class="projects-featured-card">
<h3 class="projects-featured-title"><a href="https://www.episodeatlas.com" target="_blank" rel="noopener noreferrer">🔧 Episode Atlas</a></h3>
<p class="projects-featured-hook">Track TV progress at scale with per-user state and cloud-backed data.</p>
<a href="https://www.episodeatlas.com" target="_blank" rel="noopener noreferrer"><img src="/images/projects/episode-atlas.png" alt="Episode Atlas: TV episode tracking app" width="800" height="450" loading="lazy"></a>
<p class="projects-featured-meta"><strong>What it does:</strong> Per-user episode lists, “last watched” markers, and curated metadata links — so long-running franchises stay manageable.</p>
<p class="projects-featured-meta"><strong>Tech used:</strong> .NET Blazor, Azure Static Web Apps, Azure Functions, Azure SQL, GitHub auth.</p>
<p class="projects-featured-impressive"><strong>Why it’s impressive:</strong> Demonstrates scalable data modelling and cloud-first architecture for user-driven applications.</p>
<div class="projects-signals" aria-label="Engineering signals"><span class="projects-signal">Deployed to Azure</span><span class="projects-signal">Implements authentication / APIs / caching</span></div>
<p class="projects-featured-outcome"><strong>Outcome:</strong> Turned a personal “where was I in 900+ episodes?” problem into a maintainable multi-tenant pattern for identity, persistence, and UX for ongoing shows.</p>
<p class="projects-featured-links"><strong>Links:</strong> <a href="https://www.episodeatlas.com" target="_blank" rel="noopener noreferrer">episodeatlas.com</a></p>
</article>
<article class="projects-featured-card">
<h3 class="projects-featured-title"><a href="https://search.funkysi1701.com/" target="_blank" rel="noopener noreferrer">🔧 Semantic Search</a></h3>
<p class="projects-featured-hook">AI-powered natural language search for discovering content beyond keywords.</p>
<a href="https://search.funkysi1701.com/" target="_blank" rel="noopener noreferrer"><img src="/images/projects/semantic-search.png" alt="Semantic Search: natural-language blog search" width="800" height="450" loading="lazy"></a>
<p class="projects-featured-meta"><strong>What it does:</strong> Accepts conversational queries, retrieves meaningfully related posts, and surfaces them alongside the site’s JSON index search.</p>
<p class="projects-featured-meta"><strong>Tech used:</strong> .NET, Azure, Cosmos DB, OpenAI.</p>
<p class="projects-featured-impressive"><strong>Why it’s impressive:</strong> Showcases practical LLM integration in .NET beyond basic chat interfaces.</p>
<div class="projects-signals" aria-label="Engineering signals"><span class="projects-signal">Deployed to Azure</span><span class="projects-signal">Designed with clean architecture</span></div>
<p class="projects-featured-outcome"><strong>Outcome:</strong> Explored how vector-style retrieval and operational concerns (cost, latency, content freshness) fit next to a static Hugo site without compromising the authoring workflow.</p>
<p class="projects-featured-links"><strong>Links:</strong> <a href="https://search.funkysi1701.com/" target="_blank" rel="noopener noreferrer">search.funkysi1701.com</a> · linked from <a href="/search/">Search</a></p>
</article>
<article class="projects-featured-card">
<h3 class="projects-featured-title"><a href="https://www.funkysi1701.com/" target="_blank" rel="noopener noreferrer">🔧 Blog Platform</a></h3>
<p class="projects-featured-hook">Technical blog on Azure with CI/CD—fast static pages, search, and comments without babysitting an app server.</p>
<a href="https://www.funkysi1701.com/" target="_blank" rel="noopener noreferrer"><img src="/images/projects/blog.png" alt="Blog homepage: navigation and latest posts" width="800" height="450" loading="lazy"></a>
<p class="projects-featured-meta"><strong>What it does:</strong> Publishes posts, generates RSS and a JSON search index, integrates Giscus for discussions, and deploys on every merge.</p>
<p class="projects-featured-meta"><strong>Tech used:</strong> Hugo, GitHub Actions, Azure Static Web Apps, Giscus.</p>
<p class="projects-featured-impressive"><strong>Why it’s impressive:</strong> Highlights modern static-first architecture with automated deployment pipelines.</p>
<div class="projects-signals" aria-label="Engineering signals"><span class="projects-signal">Deployed to Azure</span><span class="projects-signal">CI/CD via GitHub Actions</span></div>
<p class="projects-featured-outcome"><strong>Outcome:</strong> Demonstrates a production-shaped static pipeline — preview builds, repeatable deploys, and content-driven SEO — suitable as a reference architecture for docs and marketing sites.</p>
<p class="projects-featured-links"><strong>Links:</strong> <a href="https://github.com/funkysi1701/funkysi1701.github.io" target="_blank" rel="noopener noreferrer">GitHub repository</a></p>
</article>
</div>
</div>

---

## 💼 Cloud & Production Systems

### 🔧 Blog Platform

*Technical blog on Azure with CI/CD—fast static pages, search, and comments without babysitting an app server.*

[![Blog homepage: navigation and latest posts](/images/projects/blog.png)](https://www.funkysi1701.com/)

**What it does** — Hosts this blog with automated builds, JSON search index generation, RSS, and Giscus comments so publishing stays a git-based workflow.

**Tech used** — Hugo, GitHub Actions, Azure Static Web Apps, Giscus.

**Why it’s impressive** — Highlights modern static-first architecture with automated deployment pipelines.

**Engineering signals:** Deployed to Azure · CI/CD via GitHub Actions

**Outcome:** Built the site to prove out a low-ops, high-signal publishing stack — fast TTFB, predictable deploys, and room to add features (search, analytics hooks) without re-platforming.

**Links:** [Live site](https://www.funkysi1701.com/) · [GitHub repository](https://github.com/funkysi1701/funkysi1701.github.io)

### 🔧 Episode Atlas

*Track TV progress at scale with per-user state and cloud-backed data.*

[![Episode Atlas: TV episode tracking app](/images/projects/episode-atlas.png)](https://www.episodeatlas.com)

**What it does** — Lets signed-in users maintain shows and episodes, mark “last watched,” sort lists, add titles, and jump to reference sites such as Memory Alpha for episode context.

**Tech used** — .NET Blazor, Azure Static Web Apps, Azure Functions, Azure SQL, GitHub authentication.

**Why it’s impressive** — Demonstrates scalable data modelling and cloud-first architecture for user-driven applications.

**Engineering signals:** Deployed to Azure · Implements authentication / APIs / caching

**Outcome:** Shipped a production-style app to solve a real tracking problem (large franchises, hundreds of episodes) while keeping the domain model and UX extensible for more providers and features later.

**Links:** [Episode Atlas](https://www.episodeatlas.com)

### 🔧 Thorne Pentecostal Church

*Dependable church presence online—clear for newcomers, simple for volunteers to keep current.*

[![Thorne Pentecostal Church website homepage](/images/projects/thorne-pentecostal-church.png)](https://www.thornepentecostalchurch.co.uk)

**What it does** — Presents service times, beliefs, and visitor information with a simple structure so members and newcomers get answers in one place.

**Tech used** — HTML/CSS, Azure Static Web Apps.

**Why it’s impressive** — Demonstrates proportionate engineering: production-grade static hosting and clear information architecture for stakeholders who need reliability, not complexity.

**Engineering signals:** Deployed to Azure · CI/CD via GitHub Actions

**Outcome:** Delivered a first web presence focused on clarity and sustainability so non-developers can keep content current with minimal process overhead.

**Links:** [Thorne Pentecostal Church](https://www.thornepentecostalchurch.co.uk)

---

## 🤖 AI & Experimental Projects

### 🔧 Semantic Search

*AI-powered natural language search for discovering content beyond keywords.*

[![Semantic Search: natural-language blog search](/images/projects/semantic-search.png)](https://search.funkysi1701.com/)

**What it does** — Runs natural-language queries over blog content so readers can discover posts by intent, not only exact keywords, complementing the [Search](/search/) page’s JSON index.

**Tech used** — .NET, Azure, Cosmos DB, OpenAI.

**Why it’s impressive** — Showcases practical LLM integration in .NET beyond basic chat interfaces.

**Engineering signals:** Deployed to Azure · Designed with clean architecture

**Outcome:** Built the service to explore how AI-assisted retrieval pairs with static content pipelines — latency budgets, data refresh, and cost — without locking the main blog into a heavyweight runtime.

**Links:** [search.funkysi1701.com](https://search.funkysi1701.com/)

---

## 🛠 Tools & Utilities

### 🔧 Mandelbrot Generator

*Interactive Mandelbrot exploration in the browser—smooth zoom, pure WASM, zero server-side rendering cost.*

[![Mandelbrot Generator: fractal view in the browser](/images/projects/mandelbrot.png)](https://mandelbrot.funkysi1701.com)

**What it does** — Renders the Mandelbrot set in the client with zoom for desktop and mobile, demonstrating CPU-bound UI work in WASM.

**Tech used** — .NET Blazor WebAssembly, Azure Static Web Apps.

**Why it’s impressive** — Demonstrates client-side compute discipline in Blazor WASM: rich, interactive UI with predictable cost because heavy work never hits the server.

**Engineering signals:** Deployed to Azure · Designed with clean architecture

**Outcome:** Built the tool to stress-test interactive Blazor WASM performance and touch UX patterns — a small codebase that still informs decisions about heavier client-side workloads.

**Links:** [Mandelbrot Generator](https://mandelbrot.funkysi1701.com)

---

## 💡 Ongoing exploration

Areas I keep hands-on with outside these shipped projects:

- **.NET Aspire** — Cloud-native composition and local dev parity
- **Kubernetes** — Orchestration and service boundaries
- **Elasticsearch** — Search and analytics stacks
- **Azure Functions** — Event-driven and serverless patterns
- **DevOps automation** — CI/CD, IaC, and release hygiene

---

## 🤝 Collaborate With Me

Interested in collaborating on a project or discussing an idea?

- [Contact Me](/contact/) — Get in touch
- [GitHub](https://github.com/funkysi1701) — Code and experiments
- [LinkedIn](https://linkedin.com/in/funkysi1701) — Connect professionally

---

## 📚 More resources

- [Tools & Resources](/tools-and-resources/) — Recommended development tools
- [About Me](/about/) — Background and experience
- [Blog Posts](/posts/) — Technical writing
