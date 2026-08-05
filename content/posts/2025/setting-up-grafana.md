+++
title = "Setting Up Grafana for Monitoring .NET Apps with Docker"
date = "2025-01-27T20:00:00Z"
lastmod = "2026-07-31T20:00:00Z"
year = "2025"
month= "2025-01"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/grafana-dashboard.png"
images =['/images/grafana-dashboard.png']
tags = ["Grafana", "Monitoring", "Analytics", "Docker", "Prometheus", "DotNet", "DevOps", "Metrics"]
categories = ["tech"]
description = "Run Grafana and Prometheus in Docker Compose, scrape a .NET /metrics endpoint, and import the ASP.NET Core Grafana dashboard for live application monitoring."
showFullContent = false
readingTime = true
copyright = false
featured = false
draft = false
aliases = [
    "/setting-up-grafana-for-monitoring-net-applications-with-docker",
    "/posts/setting-up-grafana-for-monitoring-net-applications-with-docker",
    "/posts/2025/01/27/setting-up-grafana-for-monitoring-net-applications-with-docker",
    "/2025/01/27/setting-up-grafana-for-monitoring-net-applications-with-docker" 
]
+++
Grafana is an open-source analytics and monitoring platform that lets you query, visualise, and alert on metrics. It pairs well with Prometheus for scraping application endpoints. This post walks through a Docker Compose stack that monitors a simple .NET API.

## Setting up Grafana

To visualise metrics data, we need a few components. The .NET application exposes a `/metrics` endpoint. Prometheus scrapes it on an interval and stores the samples. Grafana then queries Prometheus and renders dashboards.

### Docker Compose File

Start with a Compose file for Prometheus and Grafana. Pin image tags so rebuilds stay reproducible (bump them when you deliberately upgrade):

```yaml
services:
  prometheus:
    image: prom/prometheus:v3.4.0
    ports:
    - 5431:9090
    volumes:
      - ./prometheus/:/etc/prometheus/
      - prometheus:/prometheus   
      
  grafana:
    image: grafana/grafana:11.6.0
    expose:
      - "3000"
    ports:
      - 3000:3000  
    volumes:
      - grafana:/var/lib/grafana

volumes:
  prometheus:
  grafana:

```

This brings up Grafana and Prometheus, maps ports, and mounts config/data volumes.

### Prometheus Configuration

Next, create a **prometheus.yml** file to configure Prometheus:

```yaml
global:
  scrape_interval:     15s
  evaluation_interval: 15s 

scrape_configs:
  - job_name: 'api'
    scheme: 'https'
    tls_config:
      insecure_skip_verify: true 
    scrape_interval: 10s
    scrape_timeout: 5s
    static_configs:
    - targets: ['api.example.com:443']       
```

This configures how often the `/metrics` endpoint should be scraped. By default Prometheus expects something like `http://api.example.com/metrics`. Because my API ran under HTTPS I set `scheme` to `https` and skipped TLS verification in this lab setup. `scrape_interval` is how often the endpoint is scraped; if `scrape_timeout` is omitted the global value is used.

More information about configuring Prometheus can be found [here](https://prometheus.io/docs/prometheus/latest/configuration/configuration/).

### Grafana Config

You can now log into Grafana on <http://localhost:3000> with the default username and password of `admin`/`admin`. You will be prompted to change the password. Add a Prometheus data source next. Prometheus is published on the host as <http://localhost:5431>, but from another container you usually cannot use `localhost` for a sibling service.

If Grafana needs to reach Prometheus on the **host** (for example when Prometheus is published only to the host network), use **host.docker.internal** (Docker Desktop and many Linux setups with the host-gateway mapping): <http://host.docker.internal:5431>. Prefer the Compose service name (`http://prometheus:9090`) when both services share the same Compose network.

### Dashboard

The next thing we need to do is build a dashboard — the .NET team has done much of the hard work. They published a [Grafana dashboard](https://devblogs.microsoft.com/dotnet/introducing-aspnetcore-metrics-and-grafana-dashboards-in-dotnet-8/) you can import.

You can also build panels yourself in the Grafana UI (graphs, gauges, and other visualisations).

![Dashboard](/images/2025/dashboard-screenshot.png)

## Metrics endpoint

If your .NET application is using .NET Aspire, this `/metrics` endpoint is often already set up for you. Look in `Extensions.cs` in your ServiceDefaults project for something like the following (you need the NuGet package `OpenTelemetry.Exporter.Prometheus.AspNetCore`):

```csharp
public static WebApplication MapDefaultEndpoints(this WebApplication app)
{
  // The following line enables the Prometheus endpoint (requires the OpenTelemetry.Exporter.Prometheus.AspNetCore package)
  app.MapPrometheusScrapingEndpoint();
}
```

If you are not using .NET Aspire, you can add `app.MapPrometheusScrapingEndpoint()` to your `Program.cs` file (with the same package referenced).

## Conclusion

With Compose, Prometheus, and Grafana in place you can scrape a .NET `/metrics` endpoint and watch live dashboards — useful for latency, exceptions, and ASP.NET Core built-in meters. Happy monitoring!

### Related on this blog

Prefer classic host and service checks? Try [monitoring with Nagios in Docker](/posts/2025/monitoring-with-nagios-docker/). If Aspire already wires OpenTelemetry for you, [getting started with Aspire](/posts/2024/aspire/) is a useful companion to the metrics endpoint notes above.

If you have enjoyed this article and want to get a monthly email with all my latest articles, please sign up to my [newsletter](/newsletter). If you have any questions or comments, please feel free to reach out or leave a comment below.
