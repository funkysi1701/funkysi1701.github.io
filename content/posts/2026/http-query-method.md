+++
title = "HTTP QUERY Explained: Safe Requests That Include a Body"
date = "2026-07-14T07:30:00Z"
year = "2026"
month = "2026-07"
author = "funkysi1701"
authorTwitter = "funkysi1701"
cover = "/images/2026/http-query-method.png"
images = ["/images/2026/http-query-method.png"]
tags = ["HTTP", "QUERY", "RFC 10008", "REST", "ASP.NET Core", "API Design", "OpenAPI", "DotNet"]
categories = ["tech"]
keywords = ["HTTP QUERY method", "RFC 10008", "safe HTTP method with body", "ASP.NET Core MapMethods QUERY"]
description = "HTTP QUERY is now an IETF standard. Here is why GET with a body was never right, how QUERY differs from POST, and how ASP.NET Core supports it."
showFullContent = false
readingTime = true
copyright = false
featured = false
draft = false
aliases = [
  "/http-query-method",
  "/posts/http-query-method",
  "/posts/2026/07/14/http-query-method",
  "/2026/07/14/http-query-method"
]
+++

For years, API designers have had an awkward choice when a search got too complex for a URL. Stuff it into a `GET` query string and hit practical URI length limits, or send a body with `POST` and pretend a read-only filter is a write. Neither option felt right.

In June 2026 the IETF published [RFC 10008](https://www.rfc-editor.org/rfc/rfc10008.html), which defines **QUERY** — a new HTTP method that is safe and idempotent like `GET`, but carries request content like `POST`. That long-standing gap finally has a standard answer.

## The problem QUERY solves

`GET` is the right semantic for "please return something, and I am not asking you to change state." It is safe, idempotent, and cacheable. The catch is where the input lives: in the URI. Complex filters, GraphQL-style documents, Elasticsearch queries, or large multi-field search payloads do not always fit comfortably in a URL. RFC 9110 suggests supporting request targets of at least 8,000 octets, but browsers, proxies, and gateways vary — and overflowing those limits is a practical failure, not a theoretical one.

`POST` accepts a body with a clear media type, which is perfect for structured input. The semantic cost is high: `POST` is not safe, not idempotent, and is not treated like a repeatable read. Intermediaries cannot safely retry a failed `POST` the way they can a `GET`. Shared caches need special handling. Tooling that assumes "POST means mutate" treats a catalogue search as if it wrote data.

People sometimes tried `GET` *with* a body. RFC 9110 is blunt about that: content on a `GET` has no generally defined semantics, must not change the meaning of the request, and some implementations reject it because of request-smuggling concerns. That was never the answer.

QUERY is the method that says what we meant all along: *process this enclosed content as a query, safely and idempotently, and return the result.*

## What RFC 10008 actually defines

From the abstract:

> A QUERY requests that the request target process the enclosed content in a safe and idempotent manner and then respond with the result of that processing.

Compared with `GET`, you are not asking for a representation of the target URI by itself. You are asking the target resource to run a query *within its scope*, using the request body and `Content-Type` to define that query. Servers must fail the request if `Content-Type` is missing or inconsistent with the content.

Key properties:

| Property | Meaning for QUERY |
|----------|-------------------|
| **Safe** | The client does not request or expect a state change on the target resource |
| **Idempotent** | The same request can be retried after a connection failure |
| **Cacheable** | Successful responses may be stored and reused for subsequent QUERY requests |
| **Body required for the query** | The query lives in the content, not forced into the URI |

A `200 OK` means the query was processed successfully and the results are in the response content. That matches how people already think about search endpoints — now with HTTP semantics that intermediaries can trust.

## How it compares to GET and POST

| | GET | QUERY | POST (as a "search") |
|--|-----|-------|----------------------|
| Request body for the query | No (undefined) | Yes | Yes |
| Safe | Yes | Yes | No |
| Idempotent | Yes | Yes | No |
| Typically cacheable as a read | Yes | Yes | No |
| Fits large / structured input | Poorly (URI limits) | Yes | Yes |
| Auto-retry after failure | Safe | Safe | Risky |

You still use `GET` when the URI alone identifies what you want. You still use `POST` when you are creating or changing something. QUERY is for the awkward middle: *read-only operations whose input belongs in a body.*

## Caching, Location, and Accept-Query

Caching QUERY is a bit more work than caching `GET`, because the cache key **must** incorporate the request content (and related metadata). Some caches may normalise insignificant differences when building that key; clients that care can send `Cache-Control: no-transform` as advisory guidance.

The RFC also gives servers a way to hand clients a simpler follow-up:

- **`Content-Location`** — a URI for a resource that holds the *results* of this query (temporary storage of what you just got).
- **`Location`** — a URI for an *equivalent resource* that repeats the same query via `GET`, without resending the body.

That last point matters for CDNs and clients that are still catching up: after the first QUERY, subsequent hits can become ordinary `GET`s against a stored-query URI.

Discovery uses the new **`Accept-Query`** response field. A resource can advertise which query media types it understands, for example:

```http
Accept-Query: application/json, application/sql
```

If you send an unsupported type, expect `415 Unsupported Media Type`, and you may use `Accept-Query` (or `Accept` on error responses) to learn what to try next.

## CORS and security notes

QUERY is **not** a CORS-safelisted method. Browser `fetch` calls will trigger a preflight `OPTIONS` check, the same way `PUT` or `DELETE` do. That is intentional: you do not want a body-carrying cross-origin method sliding past CORS just because it is "read-like."

As always with search APIs, treat sensitive filter values carefully if you mint temporary URIs in `Location` or `Content-Location` — the RFC warns that those URIs should not echo sensitive request content into logs or bookmarkable paths.

## Using QUERY with ASP.NET Core

Routing in ASP.NET Core already accepts arbitrary method strings via `MapMethods`, so you can expose a QUERY endpoint today:

```csharp
app.MapMethods("/api/products/search", ["QUERY"], (ProductSearchRequest request) =>
{
    var results = ProductCatalogue.Search(request);
    return TypedResults.Ok(results);
});
```

A thin helper keeps call sites readable:

```csharp
public static class HttpQueryExtensions
{
    public static IEndpointConventionBuilder MapQuery(
        this IEndpointRouteBuilder endpoints,
        string pattern,
        Delegate handler) =>
        endpoints.MapMethods(pattern, ["QUERY"], handler);
}
```

On the OpenAPI side, QUERY became a first-class Path Item operation in **OpenAPI 3.2**. In .NET 11, ASP.NET Core's document generator recognises QUERY when you opt into that version:

```csharp
builder.Services.AddOpenApi(options =>
{
    options.OpenApiVersion = OpenApiSpecVersion.OpenApi3_2;
});
```

With OpenAPI 3.2, the operation appears as a sibling of `get` / `post`. On older document versions, generators may fall back to an extension such as `x-oai-additionalOperations` so the endpoint is not silently dropped.

Clients can call it with curl once the server understands the verb:

```bash
curl -X QUERY https://api.example.com/api/products/search \
  -H "Content-Type: application/json" \
  -d '{"category":"laptops","minPrice":500,"tags":["ultrabook","16gb"]}'
```

## What to watch for in the real world

Standards land before the entire ecosystem catches up. Worth checking before you announce QUERY as your public search API:

- **Proxies, API gateways, and WAFs** — some still allow-list only a handful of methods.
- **Browser and CDN behaviour** — caching QUERY responses is more complex than `GET`; temporary `Location` URIs help.
- **Client libraries and OpenAPI codegen** — support is improving, but pin versions carefully.
- **Logs and analytics** — make sure QUERY is counted as a read, not lumped in with mutating `POST`s.

For service-to-service APIs under your control, QUERY is already useful. For public browser-facing APIs, validate your edge stack and CORS setup first.

## Why this matters

HTTP methods are how we communicate intent to every hop between the client and your app. When intent and method disagree — a read shaped as `POST`, or a body bolted onto `GET` — caches, retries, and security tooling all have to guess.

QUERY closes that gap with a small, carefully designed verb: safe, idempotent, cacheable, and allowed to carry a body. After more than a decade of drafts, [RFC 10008](https://www.rfc-editor.org/rfc/rfc10008.html) makes that contract official. If you maintain search or filter endpoints that never belonged in a URI, it is time to start planning for QUERY.
