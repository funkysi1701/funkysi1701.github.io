+++
title = "What's Coming in .NET 11 This November"
date = "2026-08-14T18:00:00Z"
year = "2026"
month = "2026-08"
author = "funkysi1701"
authorTwitter = "funkysi1701"
cover = "/images/2026/whats-coming-in-dotnet-11.png"
images = ["/images/2026/whats-coming-in-dotnet-11.png"]
tags = ["DotNet", ".NET 11", "C-Sharp", "ASP.NET Core", "Visual Studio", "Aspire", "Microsoft", ".NET Conf"]
categories = ["tech"]
description = ".NET 11 ships 10 November 2026 as STS after .NET 10 LTS. Preview highlights worth trying, C# 15, upgrade notes, and where to follow .NET Conf."
showFullContent = false
readingTime = true
copyright = false
featured = false
draft = false
aliases = [
  "/whats-coming-in-dotnet-11",
  "/posts/whats-coming-in-dotnet-11",
  "/posts/2026/08/14/whats-coming-in-dotnet-11",
  "/2026/08/14/whats-coming-in-dotnet-11",
  "/posts/2026/11/10/whats-coming-in-dotnet-11",
  "/2026/11/10/whats-coming-in-dotnet-11",
  "/preparing-for-dotnet-11",
  "/posts/preparing-for-dotnet-11"
]
+++

Every November it is like Christmas for .NET developers. After [.NET 10](https://dotnet.microsoft.com/download/dotnet/10.0) landed as the current LTS release, the next stop on the calendar is **.NET 11** — a [Standard Term Support (STS)](https://github.com/dotnet/core/blob/main/release-policies.md) release planned for **10 November 2026**, with support through 9 November 2028.

Here is what is coming this November: a practical look at the previews worth trying, how .NET 11 sits next to .NET 10 LTS, and where to follow the launch at [.NET Conf](https://www.dotnetconf.net/). It is not a full changelog — Microsoft’s [What’s new in .NET 11](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-11/overview) page is the living source of truth while the bits are still in preview.

If you want the longer arc from .NET 5 through 10, I already wrote a [version-by-version tour](/posts/2026/dotnet-5-to-10-features/).

## Release facts

| | |
|---|---|
| **GA** | 10 November 2026 |
| **Support** | STS — two years (through 9 November 2028) |
| **C#** | C# 15 |
| **Downloads** | [dotnet.microsoft.com/download/dotnet/11.0](https://dotnet.microsoft.com/download/dotnet/11.0) |
| **Release notes** | [dotnet/core 11.0 README](https://github.com/dotnet/core/blob/main/release-notes/11.0/README.md) |

.NET 10 remains the LTS baseline for production workloads that want a longer support window. .NET 11 is the place to try new runtime and language features early — side projects, greenfield work, and teams that are happy to plan another upgrade on the STS cadence. Remember the only difference between STS and LTS releases is the length of support, there is no difference in quality.

## Highlights worth caring about

The [preview overview](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-11/overview) is already dense. These are the areas I expect to matter most day to day.

### Runtime Async and performance

[.NET 11’s runtime](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-11/runtime) continues the push on async and JIT quality:

- **Runtime-native async (Runtime Async)** — cleaner stack traces and lower overhead; for `net11.0` you no longer need the old feature-flag dance the earlier previews documented.
- Further **JIT** work (bounds-check elimination, switch folding, `SequenceEqual` constant-folding, and friends).
- **NativeAOT** interface-dispatch improvements and new SIMD lane helpers.

There is also a note on **updated minimum hardware requirements** for x86/x64 and Arm64. If you still build for very old CPUs in CI or on dusty lab machines, read that section carefully before you assume every box can run `net11.0` binaries.

### Libraries you will actually touch

From the [libraries what’s new](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-11/libraries) page, a few stand-outs:

- **System.Text.Json** — PascalCase naming policy, per-member naming overrides, F# discriminated unions, richer async enumerable / NDJSON helpers, and more.
- **Process** APIs — run-and-capture helpers, suspended starts, safer process lookup.
- **Compression** — including Zstandard in `System.IO.Compression`, plus ZIP and Base64 improvements.
- **LINQ** — `FullJoin` and nicer tuple-returning join overloads.
- **Async validation** via `AsyncValidationAttribute` / `IAsyncValidatableObject`.
- Scaffolding for **discriminated unions** at the runtime level (`UnionAttribute` / `IUnion`), which pairs with the language work below.

### SDK and CLI

The [SDK notes](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-11/sdk) are full of small quality-of-life wins:

- File-based apps can `#:include` other files (and even compiled DLLs).
- `dotnet run -e` to pass environment variables from the command line.
- `dotnet watch` improvements, including Aspire app-host integration.
- Solution filter (`.slnf`) create/edit from `dotnet sln`.
- `dotnet test` refinements and templates moving toward xUnit v3 / Microsoft.Testing.Platform by default.
- Smaller Linux/macOS SDK installers.

None of these will make a conference keynote on their own, but they are exactly the kind of thing you notice every day once you upgrade the SDK.

### C# 15

C# 15 ships with the .NET 11 wave. The headline features on [What’s new in C# 15](https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-15) are:

- **Union types** — a value that is one of several case types, with exhaustive `switch` checking.
- **Closed hierarchies** — `closed` classes whose direct descendants are fixed within the assembly, again for exhaustiveness.
- **Collection expression arguments** — e.g. `with(capacity: …)` inside `[…]` collection expressions.
- **Extension indexers**, **labeled `break` / `continue`**, and the first slice of a longer **memory safety** effort.

Union types in particular look like they will change how a lot of domain modelling is written once the feature is out of preview. I plan to try them on a small side project before relying on them in anything that has to stay boring and shippable.

### ASP.NET Core, EF Core, and friends

I will dig into framework-specific changes when I upgrade something real (last year that meant [Blazor and .NET 10](/posts/2025/blazor-and-dotnet10/) and a Wasm gotcha). For now, keep these bookmarked:

- [What’s new in ASP.NET Core for .NET 11](https://learn.microsoft.com/en-us/aspnet/core/release-notes/aspnetcore-11)
- [What’s new in EF Core 11](https://learn.microsoft.com/en-us/ef/core/what-is-new/ef-core-11.0/whatsnew)

## What I will try before GA

My usual November routine:

1. Install the [latest .NET 11 preview SDK](https://dotnet.microsoft.com/download/dotnet/11.0) (and Visual Studio Insiders / the matching VS build when needed).
2. Point a low-risk personal project at `net11.0` and fix whatever the compiler and NuGet graph complain about.
3. Skim the [breaking changes](https://learn.microsoft.com/en-us/dotnet/core/compatibility/11) notes once they firm up for GA — the [.NET 7 upgrade post](/posts/2022/dotnet7/) aged into a reminder that “smooth” is never guaranteed.
4. Watch how Aspire, containers, and test templates behave with the new SDK defaults.

If something painful shows up (Blazor, Wasm, auth, or otherwise), that usually becomes its own post — same pattern as the .NET 10 Blazor write-up.

## .NET Conf

[.NET Conf](https://www.dotnetconf.net/) is the free virtual conference that usually frames the November release: product keynote, deep dives, and a community day. Exact **2026 dates were not on the site when I drafted this**, so treat [dotnetconf.net](https://www.dotnetconf.net/) (and the [agenda](https://www.dotnetconf.net/agenda) page) as the source of truth once the next edition is announced.

How I use it:

- Day one for the “what shipped” narrative and demos.
- Later sessions for topics I actually build with (ASP.NET Core, Aspire, testing, cloud).
- The [.NET Blog](https://devblogs.microsoft.com/dotnet/) for call-for-content and “get ready” posts when they appear.
- Recordings afterwards when live UK daytime clashes with work — the Conf site and YouTube channel usually have everything after the fact.

I called out useful Conf demos back in the [.NET 9 post](/posts/2024/dotnet9/); expect the same rhythm this year.

## Upgrade checklist (LTS vs STS)

| Stay on **.NET 10 LTS** if… | Move to **.NET 11 STS** if… |
|---|---|
| You need the longer support window | You want C# 15 / Runtime Async early |
| Compliance or customers pin you to LTS | Side projects and greenfield services |
| Dependencies are not ready for `net11.0` | You are happy to upgrade again on the STS clock |

Practical bits either way:

- Bump `TargetFramework` only when your NuGet graph and CI images are ready.
- Refresh container base images and GitHub Actions / Azure Pipelines SDK installs together.
- Re-run tests under the new `dotnet test` defaults; template and runner changes can surprise you.
- Keep an eye on hardware baselines if you still support older machines.

## Wrap-up

That is what is coming with .NET 11 this November: the next STS stop after .NET 10 LTS, with Runtime Async, library and SDK polish, and C# 15 on top. Download the [previews](https://dotnet.microsoft.com/download/dotnet/11.0), keep [What’s new in .NET 11](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-11/overview) open while you poke at a project, and watch [.NET Conf](https://www.dotnetconf.net/) for the launch narrative once the 2026 dates are up.

I will refresh this after GA with anything that actually bit me on upgrade — same tradition as [.NET 9](/posts/2024/dotnet9/) and [Blazor on .NET 10](/posts/2025/blazor-and-dotnet10/).
