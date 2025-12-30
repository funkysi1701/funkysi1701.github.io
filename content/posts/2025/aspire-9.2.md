+++
title = "What's New in .NET Aspire 9.2: Infrastructure Diagrams Made Easy"
date = "2025-04-21T20:00:00Z"
year = "2025"
month= "2025-04"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/work.PNG"
images =['/images/work.PNG']
tags = ["DotNet", "Aspire", "Infrastructure Diagrams", "Visual Studio", "Docker", "Microservices", "Grafana", "Programming"]
category="tech"
description = "Explore the new features in .NET Aspire 9.2, including the ability to create infrastructure diagrams effortlessly with simple code examples."
showFullContent = false
readingTime = true
copyright = false
featured = false
draft = false
aliases = [
    "/what-is-new-in-aspire-9.2",
    "/posts/what-is-new-in-aspire-9.2",
    "/posts/2025/04/21/what-is-new-in-aspire-9.2",
    "/2025/04/21/what-is-new-in-aspire-9.2" 
]
+++
.NET Aspire 9.2 is here, bringing exciting new features to simplify infrastructure visualization. Whether you're managing microservices or exploring Docker-based architectures, this release makes it easier than ever to create detailed infrastructure diagrams with minimal effort. Let’s dive into the highlights and see how you can use these tools to streamline your workflow.

For details of what .NET Aspire is, check out my [post](/posts/2024/aspire) from last year. For the official announcement see [What's new in .NET Aspire 9.2](https://learn.microsoft.com/en-us/dotnet/aspire/whats-new/dotnet-aspire-9.2)

My favourite feature from this release is the ability to quickly and easily spin up infrastructure diagrams like this:

![Aspire Diagram](/images/aspire-9.2.jpg)

*An example infrastructure diagram created using .NET Aspire 9.2.*

I also created one last week for my blog about [Grafana](/posts/2025/opentelemetry-logs/):

![Grafana Example](/images/grafana-loki-arch.png)

## So what code is needed to create one of these diagrams?

1) Open Visual Studio and create a new project of type ".NET Aspire App Host"
2) Edit the Program.cs and add docker containers for anything you want to display on the diagram
3) The syntax for this is is shown in my Grafana example:

```csharp
var builder = DistributedApplication.CreateBuilder(args);

// Add a .NET application container
var dotnet = builder.AddContainer("dotnet-application", "anyimage")
    .WithHttpEndpoint(port: 80, targetPort: 80); // Expose HTTP port 80

// Add a Loki container for log aggregation
var loki = builder.AddContainer("loki", "grafana/loki", "3.4.3")
    .WithHttpEndpoint(port: 3100, targetPort: 3100); // Expose HTTP port 3100

// Add an Alloy container for telemetry processing
var alloy = builder.AddContainer("alloy", "grafana/alloy", "v1.8.1")
    .WithHttpEndpoint(port: 12345, targetPort: 12345, name: "UI") // Expose UI
    .WithHttpEndpoint(port: 4317, targetPort: 4317, name: "gRPC") // Expose gRPC
    .WithHttpEndpoint(port: 4318, targetPort: 4318, "http"); // Expose HTTP

// Add a Grafana container for visualization
var grafana = builder.AddContainer("grafana", "grafana/grafana", "11.6.0")
    .WithHttpEndpoint(port: 3000, targetPort: 3000); // Expose HTTP port 3000

// Define relationships between containers
dotnet.WithReferenceRelationship(alloy); // Logs flow from .NET app to Alloy

alloy.WithReferenceRelationship(loki); // Logs flow from Alloy to Loki

loki.WithReferenceRelationship(grafana); // Logs flow from Loki to Grafana

builder.Build().Run();
```

The parameters for **AddContainer()** are a name that gets displayed on the diagram, the docker image name, and the tag. The tag is optional and it will use latest if omitted. For my Grafana example, the first docker container I added is for any dotnet application. I can use any docker image for this, as all I want is a container labelled "dotnet-application". The **.WithHttpEndpoint** is for public ports to be displayed so you can see how communication is flowing between containers.

**.WithReferenceRelationship()** is how you define what calls what. So dotnet.WithReferenceRelationship(alloy) adds an arrow pointing from my dotnet application to alloy, suggesting that open telemetry logs flow from my application to alloy. You can also add calls in both directions by adding alloy.WithReferenceRelationship(dotnet) this will change the arrow to point in both directions.

At my work we use a microservice architecture so I thought it might be fun to try and map out what calls what:

![Work Architecture](/images/work.PNG)

*A simplified view of a microservices architecture at work (service names anonymized).*

I made a start mapping a few of our services, but this doesn't cover everything and I have replaced the names of the services so no commerical secrets can be identified. I was surprised at how complex the system is.

### Real-World Applications

The ability to generate infrastructure diagrams is invaluable for:

- **Microservices Architecture**: Visualize how services interact and identify bottlenecks.
- **Debugging**: Quickly understand communication flows to troubleshoot issues.
- **Documentation**: Create up-to-date diagrams for team collaboration and onboarding.

## Conclusion

.NET Aspire 9.2 makes it easier than ever to create detailed infrastructure diagrams, saving time and improving collaboration. Whether you're managing microservices or exploring Docker-based architectures, these tools can help you visualize and optimize your systems. Give it a try and see how it can enhance your workflow!

Have you tried .NET Aspire 9.2? What features are you most excited about? Share your thoughts and experiences in the comments below!
