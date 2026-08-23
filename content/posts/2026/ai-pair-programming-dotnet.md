+++
title = "AI pairing in VS Code and Cursor"
date = "2026-08-07T12:00:00Z"
year = "2026"
month = "2026-08"
author = "funkysi1701"
authorTwitter = "funkysi1701"
cover = "/images/2026/ai-pair-programming-dotnet.png"
images = ['/images/2026/ai-pair-programming-dotnet.png']
tags = ["AI", "DotNet", "Cursor", "VS Code", "GitHub Copilot", "Productivity", "Programming"]
categories = ["tech"]
keywords = ["AI pair programming", ".NET Copilot", "Cursor IDE", "VS Code .NET", "developer productivity"]
description = "Lessons from pairing with Copilot and Cursor on .NET work: a thin tools map, scenarios from Episode Atlas and this blog, and habits that keep AI honest."
showFullContent = false
readingTime = true
copyright = false
featured = false
draft = false
aliases = [
    "/ai-pair-programming-dotnet",
    "/posts/ai-pair-programming-dotnet",
    "/posts/2026/08/07/ai-pair-programming-dotnet",
    "/2026/08/07/ai-pair-programming-dotnet"
]
+++

On a lot of days my pair programmer is not a person. It is Copilot finishing a method, or Cursor proposing a multi-file edit I still have to own.

Back in April I covered [how I use ChatGPT, Cursor, and Copilot on side projects](/posts/2026/how-i-use-ai-on-side-projects/). That was mostly about which tool I reach for. Here I want to talk about what that looks like when the code is .NET—C#, Blazor, Azure Functions—and I am working in VS Code or Cursor.

I am not claiming a universal workflow. These are habits that have helped me in 2026.

## A thin tools map (so we can move on)

I still use the same three buckets. The only change is which bucket I reach for when the stack is .NET-heavy.

| Situation | What I reach for |
|-----------|------------------|
| Framing a design question or learning path | ChatGPT (browser) |
| Multi-file change across a solution | Cursor |
| Finish this method / test / YAML stanza | GitHub Copilot in the editor |
| "Build AI *into* the product" | Separate concern — see [Using AI with .NET and Semantic Kernel](/posts/2025/using-ai/) |

If you already read the April post, you can skim this table and skip ahead. The interesting part is not the brand names; it is what happens after a suggestion appears.

For vocabulary (RAG, LLM, Copilot, and friends), [Common AI and Copilot Terms](/posts/2024/common-ai-copilot-terms/) is still a useful glossary.

## Scenario: unfamiliar code that is still "mine"

[Episode Atlas](https://www.episodeatlas.com/) grew the way hobby apps do: Blazor on the front, Azure Functions and Cosmos DB behind, enough moving parts that I forget my own choices. When I come back after a few weeks, I do not want a greenfield tutorial from a chat window. I want something that has *seen* the repo.

In Cursor I ask questions like "where does per-user progress get written?" or "what breaks if this Cosmos query assumes a different partition key?" The useful answers cite *my* folders and types. The useless ones invent a service layer I never wrote.

What I do next matters more than the first reply:

- Open the files it named and confirm they are the real path.
- Diff any proposed edit against how neighbouring code already looks.
- Run `dotnet build` (and the bit of the app I touched) before I trust it.

The productivity win is not that the model "knows Episode Atlas." It is that I spend less time remapping a codebase I already wrote.

## Scenario: boring glue that still has to be correct

This blog is Hugo plus Azure Static Web Apps, with GitHub Actions and a pile of Node/Python checks. A lot of the work is glue: a layout partial, a workflow step, a Playwright selector after a theme tweak. Copilot is often enough when I already know the shape—finish the next YAML key, sketch a test that matches the one above.

Cursor earns its keep when the change spans files: "update this partial and the smoke test that asserts the heading," or "align the SWA config check with what CI runs." Those are exactly the edits where an incomplete suggestion is worse than no suggestion—half-applied config fails in ways that waste an evening.

On Blazor and Functions work the same pattern shows up as DTOs, mapping, and tests. Copilot is fast at the third similar test. Cursor is better when the DTO, the endpoint, and the client all need to move together.

## Scenario: debugging when the model is too confident

I have let an assistant send me on a wild goose chase: wrong package version, an API that never existed, a "fix" that compiled and still left the bug. A human pair who is sure and wrong is more dangerous than one who says "I am guessing."

When something fails, I try to feed the model the error text and a failing test, not a vague description of what I think is wrong. If the first patch does not change the symptom, I stop re-prompting the same story. I read the stack, check docs, or bisect—same as I would without AI.

Side projects are a forgiving place to learn that discipline. Production systems are not. Secrets, customer data, and employer code stay out of tools unless policy clearly allows them; I wrote about that boundary in the [side projects post](/posts/2026/how-i-use-ai-on-side-projects/) and I still follow it.

## Guardrails that actually saved me time

These are the practices that keep AI pairing from becoming AI babysitting:

1. **Read every diff you did not type.** Especially NuGet names, HTTP routes, auth, and anything touching data.
2. **Prefer project conventions over "cleaner" internet defaults.** If my solution uses one DI style, I reject the rewrite that introduces another for a one-line fix.
3. **Verify against official docs when the call looks unfamiliar.** Models still hallucinate plausible APIs.
4. **Keep the human review bar.** I treat agent output like a junior's pull request: helpful when it is right, never something I merge on trust alone.
5. **Match depth of context to the task.** Do not paste half a solution into a browser chat for a one-line rename; do not ask inline Copilot to redesign a Functions + Cosmos flow.

## What "productivity" has meant for me

I am faster at first drafts and at navigating code I have not opened in a month. I am not faster at *skipping* judgment. If anything, the cost of a bad accept is higher because the broken change can look polished.

That lines up with the longer argument in [AI Won't Replace Developers, But It Will Redefine Us](/posts/2026/ai-wont-replace-developers/): the work shifts toward directing, reviewing, and verifying. I see that every time I open Cursor or Copilot on Episode Atlas, this blog, or whichever .NET side project I am tinkering with that week.

If you are doing similar work in C# or Blazor, leave a comment and tell me which tool you reach for first—and what you still refuse to hand to an assistant. I am always curious how other people draw that line.
