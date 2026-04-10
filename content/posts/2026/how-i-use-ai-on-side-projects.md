+++
title = "How I Use AI on Side Projects: ChatGPT, Cursor, and Copilot"
date = "2026-04-10T12:00:00Z"
year = "2026"
month = "2026-04"
author = "funkysi1701"
authorTwitter = "funkysi1701"
cover = "/images/2026/ai-with-side-projects.png"
images = ['/images/2026/ai-with-side-projects.png']
tags = ["AI", "ChatGPT", "Cursor", "GitHub Copilot", "Side Projects", "Developer Workflow", "Blazor", "Hugo", "Productivity"]
categories = ["tech"]
keywords = ["AI coding tools", "Cursor IDE", "ChatGPT developers", "side project workflow", "GitHub Copilot"]
description = "A practical split: ChatGPT for low-context questions, Cursor and Copilot when the answer lives in your repo—illustrated with real hobby projects from Hugo to Blazor."
showFullContent = false
readingTime = true
copyright = false
featured = false
draft = false
aliases = [
    "/how-i-use-ai-on-side-projects",
    "/posts/how-i-use-ai-on-side-projects",
    "/posts/2026/04/10/how-i-use-ai-on-side-projects",
    "/2026/04/10/how-i-use-ai-on-side-projects"
]
+++

There is no shortage of AI tools aimed at developers right now: chat assistants, IDE completions, agents that promise to run your tests, and new products every month with overlapping features. I am not going to argue which one is "best." Instead, here is **what I am actually using today** on hobby code: [ChatGPT](https://chatgpt.com/) for quick, low-context questions, [Cursor](https://cursor.com/) when the work needs my repository in the loop, and [GitHub Copilot](https://github.com/features/copilot) for fast inline help while I type. That trio might change, but it reflects how I have learned to spend money and attention in 2026.

The through-line is simple: **match the tool to how much context the problem needs**. That stops me from dumping half a repo into a browser tab for a vague design question, or firing up an editor assistant when I only wanted a two-paragraph explanation of something I could read in the docs.

This is not a product review. It is a snapshot of how I work, using the projects on [my projects page](/projects/) as concrete examples.

## ChatGPT: questions that do not need my codebase

[ChatGPT](https://chatgpt.com/) is still my first stop when I am trying to *frame* a problem. I use it when the answer is mostly portable knowledge: comparisons, vocabulary, "what should I read next," and sanity checks that do not depend on the exact shape of my solution.

A few examples from things I have built:

- **This blog (Hugo + Azure Static Web Apps)** — I might ask how people usually implement site search on static sites, or what the trade-offs are between generating a JSON index at build time versus leaning on a hosted search service. I am not looking for a drop-in patch to my theme; I want a short list of options so I can decide what fits a hobby budget.

- **[Episode Atlas](https://www.episodeatlas.com/) (Blazor, Functions, SQL)** — good prompts sound like "patterns for tracking per-user progress through a large catalogue" or "when a tiny Blazor app might still justify a separate API layer." Those are design conversations. The model does not need to see my episode table to help me think about indexing and stale data.

- **[Mandelbrot Generator](https://mandelbrot.funkysi1701.com/) (Blazor WebAssembly)** — I have used general chats to reason about why browser-side fractals feel CPU-bound, or what people typically do first when zoom performance tanks. Again, that is physics-of-the-platform stuff, not "line 40 of my render loop."

- **Experiments** — when I am poking at [.NET Aspire](/projects/), Kubernetes, Elasticsearch, or Azure Functions in my own time, ChatGPT is useful for learning paths: what to skim first, what terms I am mixing up, and what I am over-engineering for a toy.

Where ChatGPT falls down is predictable: anything that requires *my* wiring—pipeline YAML that only fails in CI, a Hugo partial that interacts with three others, a Blazor component that only breaks after publish. For that, context wins.

## Cursor: when the answer is in the repo

[Cursor](https://cursor.com/) (or any "chat with your codebase" style editor) is where I go when I need **consistency across files** and **diff-shaped output**. Side projects accumulate small decisions—naming, folder layout, how strict nullability is—and the model only respects those if it can see them.

Typical jobs:

- **Blog platform** — adjusting a Hugo layout or partial, fixing warnings after a Hugo upgrade, or tweaking GitHub Actions / Azure Pipelines so the build still emits RSS and the JSON search index. Those changes are boring, fiddly, and easy to get subtly wrong if you guess from memory.

- **Episode Atlas** — refactoring a Blazor page, aligning a Function endpoint with what the client expects, or tightening a SQL query once I know the access pattern. Here I want suggestions that match *my* project structure, not a generic sample from the internet.

- **Mandelbrot** — iterating on rendering code where small mistakes show up as wrong colours or runaway iterations. Having the file in context beats describing the algorithm in chat.

- **[Thorne Pentecostal Church](https://www.thornepentecostalchurch.co.uk/) site** — simple HTML and CSS still benefit from repo context when the goal is "match what is already there" rather than "invent a new design system."

I still treat Cursor as an accelerator, not an author. I read diffs, run the site or tests, and verify anything touching hosting or secrets. Side projects are a great place to learn *when* to trust an edit—and when the model confidently invents an API that never existed.

## GitHub Copilot: the inline teammate

[GitHub Copilot](https://github.com/features/copilot) fills a different gap. Where Cursor often drives **multi-file** or **exploratory** edits, Copilot shines on **local** work: finishing a line, sketching a test, or repeating a pattern I have already established in the file.

I reach for it when:

- I am writing repetitive Blazor markup or boilerplate DTOs.
- I am editing YAML or shell and want a plausible next stanza that matches the block above.
- I already know what I am doing and want speed more than architecture.

There is overlap between Copilot and Cursor in my workflow, and I am fine with that. If you only pay for one tool, you can still apply the same *principle*: shallow context versus deep context.

## A quick decision table

| Situation | What I use |
|-----------|------------|
| "What are my options?" / compare approaches | ChatGPT |
| "Change this project to do X" | Cursor |
| "Finish this method / this pipeline step" | Copilot |
| Security, secrets, production incidents | Me, plus docs—AI optional and heavily verified |

## Closing thought

AI tools have not replaced the fun of side projects for me. Projects like Episode Atlas exist because I wanted a better way to track *Star Trek* rewatches across hundreds of episodes; the Mandelbrot app exists because fractals are still cool; this blog exists because writing things down forces clarity. What has changed is how fast I can get through the glue work—if I pick the right assistant for the amount of context the task really needs.

If you are a mid-level developer experimenting with the same stack—.NET, static sites, Azure—how do you split tools today? I would be interested to hear what works for you in the comments.
