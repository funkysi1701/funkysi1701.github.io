+++
title = "Integrating OpenTelemetry Logs with Grafana Using Loki and Alloy"
date = "2025-04-14T20:00:00Z"
year = "2025"
month= "2025-04"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/social-ai.png"
images =['/images/social-ai.png']
tags = ["OpenTelemetry", "Grafana", "Loki", "Alloy", "Logging", "Monitoring", "Docker", "DotNet", "Tech"]
category="tech"
description = "Learn how to integrate OpenTelemetry logs with Grafana using Loki and Alloy for efficient log aggregation and monitoring in your .NET applications."
showFullContent = false
readingTime = true
copyright = false
featured = false
draft = false
aliases = [
    "/adding-opentelemetry-logs-to-grafana",
    "/posts/adding-opentelemetry-logs-to-grafana",
    "/posts/2025/04/14/adding-opentelemetry-logs-to-grafana",
    "/2025/04/14/adding-opentelemetry-logs-to-grafana" 
]
+++
I have blogged about [Grafana](/posts/2025/setting-up-grafana/) before but until now I haven't added logs to Grafana lets have a look at how that works.

My dotnet application makes use of OpenTelemetry. I have been sending this telemetry to an Aspire Dashboard running in Docker. This allows me to view logs, metrics and traces.

Grafana has several tools that can help with logs, loki and alloy.

Loki is a log aggregation system designed to store and query logs from all your applications and infrastructure.

Alloy is an OpenTelemetry collector.

I am using Alloy to collect OpenTelemetry from my application and send it to Loki, The logs in Loki can then be read by Grafana.

To start off lets add Alloy and Loki to my docker compose file.

```docker-compose.yml
  loki:
    image: grafana/loki:3.4.3
    container_name: monitoring_loki2
    ports:
      - "3100:3100"
    command: -config.file=/etc/loki/local-config.yaml    

  alloy:
    image: grafana/alloy:v1.8.1
    container_name: monitoring_alloy
    ports:
      - 12345:12345
      - 4317:4317
      - 4319:4318
    volumes:
      - ./config.alloy:/etc/alloy/config.alloy
      - /var/run/docker.sock:/var/run/docker.sock
    command: run --server.http.listen-addr=0.0.0.0:12345 --storage.path=/var/lib/alloy/data /etc/alloy/config.alloy
    depends_on:
      - loki
```

Both Loki and Alloy have config files so lets have a look at them as well.

```alloy.config
otelcol.receiver.otlp "default" {
  http {}
  grpc {}

  output {
    logs    = [otelcol.processor.batch.default.input]
  }
}

otelcol.processor.batch "default" {
    output {
        logs = [
          otelcol.exporter.otlphttp.loki.input,
        ]
    }
}

otelcol.exporter.otlphttp "loki" {
  client {
    endpoint = "http://loki:3100/otlp"
  }
}
```

Lets talk through the flow of information.

- My .Net application generates logs and sends them to port 4317
- Alloy receives these logs and starts processing them
- Alloy sends them to loki on port 3100
- Grafana adds Loki as a data source and allows me to query any log stored in loki

But doing all this means that my Aspire Dashboard no longer recieves the logs as they are now being sent to Alloy/Loki.

```Extensions.cs
if (useOtlpExporter)
{
    // The following lines enable the OTLP exporter (requires the OpenTelemetry.Exporter.OpenTelemetryProtocol package)
    builder.Services.AddOpenTelemetry()
    .WithLogging(logging => logging.AddOtlpExporter(options =>
    {
        options.Endpoint = new Uri(builder.Configuration["OTEL_EXPORTER_OTLP_ENDPOINT"]);
    }))
    .WithLogging(logging => logging.AddOtlpExporter(options =>
    {
        options.Endpoint = new Uri(builder.Configuration["GrafanaExporter"]);
    }))
    .WithMetrics(metrics => metrics.AddOtlpExporter(options =>
    {
        options.Endpoint = new Uri(builder.Configuration["OTEL_EXPORTER_OTLP_ENDPOINT"]);
    }))
    .WithTracing(tracing => tracing.AddOtlpExporter(options =>
    {
        options.Endpoint = new Uri(builder.Configuration["OTEL_EXPORTER_OTLP_ENDPOINT"]);
    }));
}
```

If I update the AddOpenTelemetryExporters method in my Extensions.cs file in my .Net Aspire ServiceDefaults project, I can get my logs (or traces/metrics) to be sent to as many different places as I want. In my case I am sending to Allot and Aspire Dashboard.
