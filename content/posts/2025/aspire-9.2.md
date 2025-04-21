+++
title = ".Net Aspire 9.2 improvements"
date = "2025-04-21T20:00:00Z"
year = "2025"
month= "2025-04"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/exceptions.png"
images =['/images/exceptions.png']
tags = []
category="tech"
description = ""
showFullContent = false
readingTime = true
copyright = false
featured = false
draft = false
aliases = [
    "/aspire-9.2",
    "/posts/aspire-9.2",
    "/posts/2025/04/21/aspire-9.2",
    "/2025/04/21/aspire-9.2" 
]
+++
.Net Aspire 9.2 is available now. For details of what .Net Aspire is, check out my [post](/posts/2024/aspire) from last year. For the official announcement see [What's new in .NET Aspire 9.2](https://learn.microsoft.com/en-us/dotnet/aspire/whats-new/dotnet-aspire-9.2)

My favourite feature from this release is the ability to quickly and easily spin up infrastructure diagrams like this:

![Aspire Diagram](/images/aspire-9.2.jpg)

I also created one last week for my blog about [grafana](/posts/2025/opentelemetry-logs/):

![Grafana Example](/images/grafana-loki-arch.png)

## So what code is needed to create one of these diagrams?

1) Open Visual Studio and create a new project of type ".Net Aspire App Host"
2) Edit the Program.cs and add docker containers for anything you want to display on the diagram
3) The syntax for this is is shown in my Grafana example:

```csharp
var builder = DistributedApplication.CreateBuilder(args);

var dotnet = builder.AddContainer("dotnet-application", "anyimage")
    .WithHttpEndpoint(port: 80, targetPort: 80);

var loki = builder.AddContainer("loki", "grafana/loki", "3.4.3")
    .WithHttpEndpoint(port: 3100, targetPort: 3100);

var alloy = builder.AddContainer("alloy", "grafana/alloy", "v1.8.1")
    .WithHttpEndpoint(port: 12345, targetPort: 12345, name: "UI")
    .WithHttpEndpoint(port: 4317, targetPort: 4317, name: "gRPC")
    .WithHttpEndpoint(port: 4318, targetPort: 4318, "http");

var grafana = builder.AddContainer("grafana", "grafana/grafana", "11.6.0")
    .WithHttpEndpoint(port: 3000, targetPort: 3000);

dotnet.WithReferenceRelationship(alloy);

alloy.WithReferenceRelationship(loki);

loki.WithReferenceRelationship(grafana);

builder.Build().Run();
```

The parameters for **AddContainer()** are a name that gets displayed on the diagram, the docker image name, and the tag. The tag is optional and it will use latest if omitted. For my grafana example, the first docker container I added is for any dotnet application. I can use any docker image for this, as all I want is a container labelled "dotnet-application". The **.WithHttpEndpoint** is for public ports to be displayed so you can see how communication is flowing between containers.

**.WithReferenceRelationship()** is how you define what calls what. So dotnet.WithReferenceRelationship(alloy) adds an arrow pointing from my dotnet application to alloy, suggesting that open telemetry logs flow from my application to alloy. You can also add calls in both directions by adding alloy.WithReferenceRelationship(dotnet) this will change the arrow to point in both directions.

At my work we use a microservice architecture so I thought it might be fun to try and map out what calls what:

![](/images/work.png)

I made a start mapping a few of our services, but this doesn't cover everything and I have replaced the names of the services so no commerical secrets can be identified. I was surprised at how complex the system is.

