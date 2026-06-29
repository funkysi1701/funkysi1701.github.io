+++
title = ".NET Key Features Introduced in Each Release"
date = "2026-06-29T18:00:00Z"
year = "2026"
month = "2026-06"
author = "funkysi1701"
authorTwitter = "funkysi1701"
cover = "/images/bot-01.png"
images = ['/images/bot-01.png']
tags = ["DotNet", ".NET 5", ".NET 6", ".NET 7", ".NET 8", ".NET 9", ".NET 10", "C-Sharp", "Blazor", "ASP.NET Core", "Visual Studio"]
categories = ["tech"]
description = "From dropping the Core suffix in .NET 5 to LTS .NET 10 — a version-by-version tour of C#, ASP.NET Core, Blazor, tooling, and performance highlights since 2020."
showFullContent = false
readingTime = true
copyright = false
featured = false
draft = false
aliases = [
  "/dotnet-5-to-10-features",
  "/posts/dotnet-5-to-10-features",
  "/posts/2026/06/29/dotnet-5-to-10-features",
  "/2026/06/29/dotnet-5-to-10-features"
]
+++

Every November, [.NET Conf](https://www.dotnetconf.net/) brings a new major release of .NET. If you have been building on the platform since the early 2020s, you have watched the ecosystem move from ".NET Core" to a single, unified .NET — and pick up minimal APIs, Native AOT, Blazor full stack, Aspire, and a steady stream of C# language improvements along the way.

This post is a guided tour of what landed in each major version from **.NET 5** through **.NET 10**. It is not exhaustive — Microsoft ships hundreds of changes per release — but it should help you remember which version introduced what, and where to dig deeper.

| Version | Released | Support type | C# version | Status (June 2026) |
|---------|----------|--------------|------------|-------------------|
| .NET 5  | Nov 2020 | STS (18 months) | C# 9  | End of support |
| .NET 6  | Nov 2021 | **LTS** (3 years) | C# 10 | End of support |
| .NET 7  | Nov 2022 | STS (18 months) | C# 11 | End of support |
| .NET 8  | Nov 2023 | **LTS** (3 years) | C# 12 | Supported |
| .NET 9  | Nov 2024 | STS (2 years) | C# 13 | Supported |
| .NET 10 | Nov 2025 | **LTS** (3 years) | C# 14 | Current LTS |
| .NET 11 | Nov 2026 | Preview | C# 15 | Preview Until Nov 2026 then STS |

For the full release schedule and patch versions, see the official [.NET releases](https://learn.microsoft.com/en-us/dotnet/core/releases-and-support) documentation.

## .NET 5 — November 2020

.NET 5 was the first release after the "Core" branding was dropped. Version 4.x was skipped deliberately so nobody confused it with .NET Framework 4.x. The message was clear: this is the main implementation of .NET going forward, not a side project.

### Platform and runtime

- **Unified vision** — one BCL and runtime targeting cloud, desktop, web, mobile, and IoT (the full unification completed in .NET 6).
- **Single-file applications** and improved **app trimming** for smaller deployments.
- **ClickOnce** publishing for .NET (Windows).
- **ARM64** support on Windows.
- Performance work across the runtime, GC, and networking stack.

### C# 9

C# 9 shipped alongside .NET 5 and brought several features that are now everyday tools:

- **Records** — reference types with value-based equality and `with` expressions for non-destructive mutation.
- **Init-only setters** — immutable object initialisation without verbose constructors.
- **Top-level statements** — less boilerplate in small console apps.
- **Pattern matching** — relational patterns (`>`, `<`, `and`, `or`, `not`) and improved `switch` expressions.
- **Source generators** — compile-time code generation (the foundation for later JSON and logging generators).

### Libraries and frameworks

- **EF Core 5** — split queries, table-per-entity (TPE) mapping, and Cosmos DB improvements.
- **ASP.NET Core** in the 5.x line — gRPC improvements, HTTP/2 and HTTP/3 groundwork, and Blazor WebAssembly performance gains.
- **System.Text.Json** — constructor and parameterised constructor support, `[JsonIgnore]` on properties, and better options for ignoring cycles.

.NET 5 reached end of support in May 2022. If you still have projects on it, plan an upgrade — there are no security patches.

## .NET 6 — November 2021 (LTS)

.NET 6 delivered on the unification promise: one SDK, one base class library, and one runtime across mobile, desktop, IoT, and cloud. It was an **LTS** release and became the baseline many teams standardised on.

### Developer experience

- **Hot reload** in Visual Studio 2022 and `dotnet watch` — edit code and see changes without a full restart.
- **Minimal APIs** — build HTTP APIs with far less ceremony than traditional controllers.
- **SDK workloads** — optional components (MAUI, Blazor WebAssembly AOT, and others) install via `dotnet workload` instead of bloating the default SDK.
- **Project templates modernised** — top-level statements, file-scoped namespaces, nullable reference types, and `async Main` in new projects.

### C# 10

- `global using` directives
- File-scoped namespaces
- Record structs
- Improved interpolated strings and constant interpolated strings
- `AsyncMethodBuilder` attribute for custom async method builders

### Runtime and libraries

- **DateOnly** and **TimeOnly** — separate date and time types without carrying a full `DateTime`.
- **PriorityQueue&lt;TElement, TPriority&gt;** — a built-in min-heap.
- **System.Text.Json** source generator, writeable **JsonNode** DOM, and `IAsyncEnumerable` serialisation.
- **HTTP/3** preview support via QUIC.
- **OpenTelemetry** metrics APIs in `System.Diagnostics.Metrics`.
- **FileStream** rewrite for better async performance on Windows.
- **Arm64** support for macOS ("Apple Silicon") and Windows, with side-by-side x64 and Arm64 installs.

### ASP.NET Core 6

- Minimal APIs as a first-class style for microservices.
- **Blazor** components renderable from JavaScript; AOT compilation for Blazor WebAssembly.
- Improved gRPC and SignalR performance.

### .NET MAUI

.NET Multi-platform App UI arrived in preview with .NET 6 — one codebase for Android, iOS, macOS, and Windows native apps. GA followed in 2022.

.NET 6 LTS ended in November 2024.

## .NET 7 — November 2022

.NET 7 was a **standard-term support** release focused heavily on performance, cloud-native patterns, and polishing the developer experience. I wrote about [upgrading to .NET 7](/posts/2022/dotnet7/) at the time — mostly smooth, with a few surprises around AutoMapper and EF Core triggers.

### C# 11

- **Raw string literals** — multi-line strings without escape-character pain.
- **`required` members** — enforce initialisation at compile time.
- **Generic math** — static abstract interface members for numeric generics.
- **List patterns** — `if (list is [var first, .., var last])`.
- **UTF-8 string literals** — `u8` suffix for byte-oriented APIs.

### ASP.NET Core 7

- **Rate limiting middleware** — built-in protection against abuse.
- **Output caching** — cache entire responses at the framework level.
- **Minimal API improvements** — route groups, typed results, and filters.
- **Native AOT** for console apps — smaller, faster-starting binaries (ASP.NET Core AOT came in .NET 8).

### Performance and tooling

- Continued JIT and GC improvements; **Native AOT** publishing matured.
- **Regex source generator** for compile-time pattern compilation.
- **Library multi-targeting** and package validation tooling for NuGet authors.

.NET 7 reached end of support in May 2024.

## .NET 8 — November 2023 (LTS)

.NET 8 is the current-generation **LTS** baseline for many production workloads (supported until November 2026). It is the release where cloud-native tooling, Native AOT for web apps, and modern C# really clicked together.

### C# 12

- **Primary constructors** — declare constructor parameters on the type declaration.
- **Collection expressions** — `[1, 2, 3]` syntax for arrays, spans, and lists.
- **Alias any type** — `using Point = (int X, int Y);`
- **Default lambda parameters** — optional parameters in lambdas.

### ASP.NET Core 8

- **Blazor full stack** — server-side rendering, streaming rendering, and enhanced interactivity models in one framework.
- **Native AOT** for ASP.NET Core — ahead-of-time compilation for web workloads.
- **Keyed dependency injection** — register and resolve multiple implementations of the same interface by key.
- **Frozen collections** — optimised read-only collections for hot paths.
- **TimeProvider** — abstract time for testable code.

### .NET Aspire (now just called Aspire)

[.NET Aspire](/posts/2024/aspire/) launched in preview with .NET 8 — an opinionated stack for observable, distributed applications. AppHost orchestrates dependencies; ServiceDefaults wire up OpenTelemetry, health checks, and resilience. I have been using it for local microservice development and it removes a lot of port-and-connection-string drudgery. In 2025 .Net Aspire was rebranded to Aspire and version 13 was released (don't ask why 13, but I believe it was so it was no longer tied to .NET releases)

### Other highlights

- **EF Core 8** — complex types, primitive collections, JSON column mapping, `HierarchyId`.
- **NuGet Audit** — warnings when packages have known vulnerabilities.
- **Windows Forms and WPF** improvements — DPI, data binding, and hardware acceleration.
- **Source generators** for COM interop and configuration binding.

## .NET 9 — November 2024

.NET 9 continued the annual cadence with performance, AI integration, and polish across the stack. I covered several highlights in my [.NET 9 post](/posts/2024/dotnet9/) when it shipped.

### C# 13

- **`params` collections** — `params` works with `Span<T>`, `ReadOnlySpan<T>`, and collection types beyond arrays.
- **`lock` on `System.Object`** — the `lock` statement can use more types safely.
- **Partial properties and indexers** — split declarations across files.
- **Escape sequence `\e`** for the ESC character.

### Platform and libraries

- **Performance** — runtime, GC, and JIT improvements across the board; the team publishes detailed benchmark posts each release.
- **AI abstractions** — `Microsoft.Extensions.AI` packages unify access to language models and embeddings from different providers.
- **NuGet Audit** defaults to reporting **transitive** dependency vulnerabilities (opt back to direct-only with `<NuGetAuditMode>direct</NuGetAuditMode>`).
- **OpenTelemetry** enhancements and better observability defaults.

### ASP.NET Core 9 and Blazor

- **`MapStaticAssets()`** — fingerprinted, cache-friendly static files replace `UseStaticFiles()` for Blazor and modern web apps.
- **Blazor** component state persistence, improved form handling, and better WebAssembly performance.
- **.NET Aspire 9** — dashboard improvements, deployment tooling, and more community integrations.

.NET 9 is **standard-term support** until November 2026.

## .NET 10 — November 2025 (LTS)

.NET 10 is the current **LTS** release (supported until November 2028). If you are choosing a version for a new project in 2026, this is the long-term bet.

### C# 14

- **Field-backed properties** — use the `field` keyword when you outgrow auto-properties.
- **`nameof` for unbound generics** — e.g. `nameof(List<>)`.
- **Implicit `Span<T>` conversions** — less ceremony at API boundaries.
- **`ref`/`out`/`in` in lambdas** without explicit parameter types.
- **Extension blocks** — static extension methods and properties in a dedicated syntax.
- **Null-conditional assignment** (`?.=`) and user-defined compound assignment operators.

### Runtime and libraries

- **JIT improvements** — better inlining, devirtualisation, and loop inversion.
- **AVX10.2** support for SIMD workloads.
- **Native AOT** enhancements and improved struct argument code generation.
- **JSON** — stricter serialisation options, `PipeReader` support, duplicate property handling.
- **Post-quantum cryptography** — expanded ML-DSA and related APIs.
- **`WebSocketStream`** — simpler WebSocket usage; TLS 1.3 on macOS clients.

### SDK and tooling

- **`dotnet test`** integrates **Microsoft.Testing.Platform**.
- **Container images from console apps** without a separate Dockerfile in simple scenarios.
- **`dotnet tool exec`** for one-shot tool runs.
- Native shell tab-completion scripts for the CLI.

### ASP.NET Core 10 and Blazor

- Blazor WebAssembly **preloading** and automatic memory pool eviction.
- **Passkey support** for ASP.NET Core Identity.
- OpenAPI and minimal API improvements.

One breaking change caught me when upgrading a Blazor WebAssembly app: **HttpClient response streaming is enabled by default**, which broke synchronous `Stream.Read` calls in generated API clients. I wrote about the fix in [Blazor and .NET 10](/posts/2025/blazor-and-dotnet10/) — either opt out with `<WasmEnableStreamingResponse>false</WasmEnableStreamingResponse>` or move to async reads.

### EF Core 10, MAUI, and desktop

- **EF Core 10** — named query filters, Cosmos DB improvements, and LINQ performance work.
- **.NET MAUI 10** — multi-file MediaPicker, WebView interception, Android API 35/36 support.
- **Windows Forms and WPF** — continued quality and Fluent-style updates.

## How to choose a version in 2026

| Scenario | Recommendation |
|----------|----------------|
| New production app, minimise upgrade churn | **.NET 10 LTS** |
| Existing app on .NET 8 LTS with no pressing need | Stay on 8 until you are ready; both 8 and 10 are supported |
| Experimenting with the latest features | **.NET 9** or **.NET 10** — check STS/LTS dates |
| Legacy maintenance | Upgrade anything still on 5, 6, or 7 — they are all end-of-life |

Microsoft's guidance has shifted over the years: LTS releases (6, 8, 10) alternate with STS releases (5, 7, 9) on an annual November cadence. STS now lasts two years; LTS lasts three. Remember there is no difference in quality between a LTS and STS release, it is only the support window that is different.

## Further reading

- [.NET download](https://dotnet.microsoft.com/download)
- [What's new in each .NET version](https://learn.microsoft.com/en-us/dotnet/core/whats-new/) — official docs
- [C# language version history](https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-version-history)
- My earlier posts: [Upgrading to .NET 7](/posts/2022/dotnet7/), [.NET 9](/posts/2024/dotnet9/), [Blazor and .NET 10](/posts/blazor-and-dotnet10/), and [Getting started with Aspire](/posts/2025/blazor-and-dotnet10/)

If you have been on the platform since .NET 5, you have lived through the best decade of .NET since the original framework shipped. The pace is relentless — but that November rhythm at least makes it predictable.
