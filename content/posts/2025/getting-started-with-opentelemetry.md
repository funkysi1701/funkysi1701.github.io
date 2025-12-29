+++
title = "Getting Started with OpenTelemetry: Observability Made Easy"
date = "2025-05-05T20:00:00Z"
year = "2025"
month= "2025-05"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/open-telemetry.png"
images =['/images/open-telemetry.png']
tags = ["OpenTelemetry", "Observability", "Tracing", "Metrics", "Logging", "DotNet"]
category="tech"
description = "By reading this post, you'll learn how OpenTelemetry simplifies observability and how to collect traces, metrics, and logs for modern distributed applications, making it easier to monitor and debug your systems."
showFullContent = false
readingTime = true
copyright = false
featured = false
draft = false
aliases = [
    "/getting-started-with-opentelemetry",
    "/posts/getting-started-with-opentelemetry",
    "/posts/2025/05/05/getting-started-with-opentelemetry",
    "/2025/05/05/getting-started-with-opentelemetry"
]
+++
## What is OpenTelemetry?

OpenTelemetry is an open-source observability framework that provides a unified way to collect, process, and export telemetry data such as **traces**, **metrics**, and **logs**. It is designed to help developers monitor and debug distributed systems by providing insights into application performance and behavior.

With OpenTelemetry, you can instrument your applications to gain visibility into how requests flow through your system, identify bottlenecks, and troubleshoot issues effectively.

## Why Use OpenTelemetry?

Here are some key benefits of using OpenTelemetry:

1. **Unified Observability**: Collect traces, metrics, and logs using a single framework.
2. **Vendor-Neutral**: Export telemetry data to any backend, such as Azure Monitor, Grafana, or Prometheus.
3. **Standardized APIs**: Use consistent APIs and SDKs across multiple programming languages.
4. **Extensibility**: Easily extend OpenTelemetry to meet your specific observability needs.
5. **Community-Driven**: Backed by a large and active open-source community.

## Key Components of OpenTelemetry

OpenTelemetry consists of the following core components:

1. **Traces**: Capture the lifecycle of a request as it flows through your system. Traces help you understand dependencies and latency.
2. **Metrics**: Collect numerical data, such as request counts, CPU usage, and memory consumption, to monitor system health.
3. **Logs**: Record discrete events, such as errors or state changes, to provide additional context for debugging.

## Setting Up OpenTelemetry in .NET

Here’s how you can get started with OpenTelemetry in a .NET application:

### Step 1: Install the Required NuGet Packages

Run the following commands to install the OpenTelemetry libraries:

```bash
dotnet add package OpenTelemetry
dotnet add package OpenTelemetry.Extensions.Hosting
dotnet add package OpenTelemetry.Exporter.Console
```

### Step 2: Configure OpenTelemetry in Your Application

Add the following code to your Program.cs or Startup.cs file:

```csharp
using OpenTelemetry;
using OpenTelemetry.Trace;
using OpenTelemetry.Metrics;

var builder = WebApplication.CreateBuilder(args);

// Add OpenTelemetry tracing and metrics
builder.Services.AddOpenTelemetry()
    .WithTracing(tracerProviderBuilder =>
    {
        tracerProviderBuilder
            .AddAspNetCoreInstrumentation()
            .AddHttpClientInstrumentation()
            .AddConsoleExporter(); // Export traces to the console
    })
    .WithMetrics(metricsProviderBuilder =>
    {
        metricsProviderBuilder
            .AddAspNetCoreInstrumentation()
            .AddRuntimeInstrumentation()
            .AddConsoleExporter(); // Export metrics to the console
    });

var app = builder.Build();

app.MapGet("/", () => "Hello, OpenTelemetry!");

app.Run();
```

### Step 3: Run Your Application

Start your application and observe the telemetry data in the console. You’ll see traces and metrics being logged as requests are processed.

## Aspire and how to view Telemetry

If your .NET code is .Net 8 or higher you can use Aspire which configures OpenTelemetry for free! Check out [Getting started with .Net Aspire](/2024/aspire). Once Aspire is setup, you will be able to see Logs, Traces and Metrics in the Aspire Dashboard.

Another popular way to view your data is Grafana, where you can create custom dashboards. I have talked about adding [Logs](/2025/opentelemetry-logs/) to Grafana recently.

There are lots of other ways to view your data, like Application Insights, DataDog, Jaeger, New Relic and many more.

But you are not tied to one solution, you can send your data to more than one of these if you wish.

## Conclusion

OpenTelemetry simplifies observability by providing a unified framework for collecting traces, metrics, and logs. Whether you're building microservices, monitoring distributed systems, or debugging performance issues, OpenTelemetry is a powerful tool to have in your arsenal.

Start using OpenTelemetry today and gain deeper insights into your applications!

Have you tried OpenTelemetry? Share your experiences and tips in the comments below!
