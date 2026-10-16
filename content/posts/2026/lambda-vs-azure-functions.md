+++
title = "Lambda vs Functions: AWS and Azure"
date = "2026-10-16T12:00:00Z"
year = "2026"
month = "2026-10"
author = "funkysi1701"
authorTwitter = "funkysi1701"
cover = "/images/2026/lambda-vs-azure-functions.jpg"
images = ['/images/2026/lambda-vs-azure-functions.jpg']
tags = ["Azure", "AWS", "Serverless", "DotNet", "Cloud", "DevOps"]
categories = ["tech"]
keywords = ["AWS Lambda", "Azure Functions", "serverless", "FaaS", "cloud comparison", ".NET"]
description = "I've used both AWS Lambda and Azure Functions. Here's how they compare on pricing, triggers, cold starts, .NET, and when I'd pick each."
showFullContent = false
readingTime = true
copyright = false
featured = false
draft = false
aliases = [
    "/lambda-vs-azure-functions",
    "/posts/lambda-vs-azure-functions",
    "/posts/2026/10/16/lambda-vs-azure-functions",
    "/2026/10/16/lambda-vs-azure-functions"
]
+++

I have been writing [Azure Functions](/posts/2017/azure-functions/) since the portal-first days, and I have used AWS Lambda enough that the differences surprise me every time I switch. After [comparing ACR and ECR](/posts/2026/acr-vs-ecr/), it felt fair to do the same for the serverless compute pair: **AWS Lambda** and **Azure Functions**.

## The basics

Both are **Functions as a Service**: you deploy code, the platform scales it, and you pay for what runs. Triggers wire them to HTTP, queues, timers, storage, and event buses. You can write them in several languages; for me that usually means **C#** / .NET.

### AWS Lambda

- Event-driven compute with a hard focus on short-lived handlers
- Deep ties to API Gateway, SQS, SNS, EventBridge, S3, and DynamoDB
- Packaging options: zip, container image, or Lambda layers
- Scales to zero; concurrency and reserved capacity are first-class ideas

### Azure Functions

- Event-driven compute built around Function Apps and a shared host
- Deep ties to Azure Storage, Service Bus, Event Hubs, Cosmos DB, and Static Web Apps
- Hosting plans: Consumption, Flex Consumption, Premium, and Dedicated (App Service)
- Scales to zero on Consumption; Premium keeps warm instances when you pay for them

Side projects like [Episode Atlas](https://www.episodeatlas.com/) sit happily on Azure Functions next to Blazor and Cosmos. Work that already lives on AWS tends to land on Lambda next to API Gateway and SQS. Same pattern as registries: pick the peer that matches where the rest of the stack already runs.

## Hosting and pricing shape

Pricing moves, so treat numbers as shape rather than a quote. What matters is **how** you get billed.

### Azure Functions

- **Consumption / Flex Consumption**: pay per execution and resource consumption; scales to zero
- **Premium**: always-on instances, VNet integration, no cold start tax in the same way—higher baseline cost
- **Dedicated**: runs on an App Service plan you already pay for

For tiny personal APIs, Consumption is usually the right starting point. Premium is what I reach for when cold starts or private networking stop being theoretical.

### AWS Lambda

- Pay for requests and duration (GB-seconds), with a free tier that still covers a lot of hobby traffic
- No “Function App” style shared plan by default—each function (or function group) is its own unit
- Provisioned concurrency if you need warm capacity; you pay for that reservation whether traffic arrives or not

**Winner for small side projects**: often Lambda’s free tier and simple pay-per-use, unless you are already deep in Azure and the Functions + Storage account is free enough in practice.

**Winner for Azure-native apps**: Functions on Consumption or Flex, especially when Static Web Apps, Key Vault, and managed identity are already in the picture.

## Triggers and integration

### Lambda

HTTP usually means **API Gateway** or **Function URLs**. Queues and topics are SQS/SNS. Schedules are EventBridge rules. Auth, throttling, and custom domains often live one hop away from the function itself.

That split is powerful and slightly noisy. You learn a small constellation of services, not one “HTTP trigger” checkbox.

### Azure Functions

HTTP, timer, queue, blob, Event Hub, Service Bus, and Cosmos change-feed bindings are first-class in the Functions model. Bindings reduce glue code: attribute a parameter and the host injects the message or blob.

For a .NET developer who wants an HTTP endpoint and a timer in one Function App, Azure still feels more “batteries included”. Lambda feels more “compose AWS primitives”.

**Winner**: Azure Functions for binding-heavy .NET apps; Lambda when the surrounding AWS event fabric is already the source of truth.

## Languages, .NET, and packaging

Both support Node, Python, Java, Go (Lambda more naturally), and .NET.

As a C# developer:

- **Azure Functions** isolated-worker model is the path I use now. It feels like a normal .NET host with triggers bolted on.
- **Lambda** .NET support is solid—especially with the native AOT and trimmed packaging work Amazon has pushed—but the mental model is still “handler + bootstrap”, not “ASP.NET-shaped host”, unless you deliberately put a web framework on top.

Container images work on both. Lambda’s container support is useful when the zip limit or native dependencies get awkward. Azure Functions containers fit naturally if you already deploy images to ACR.

**Winner for day-to-day .NET**: Azure Functions, for me. **Winner when the org is AWS-first**: Lambda—do not fight the platform.

## Cold starts and scaling

Cold starts are the perennial serverless tax.

- **Lambda**: cold starts vary by runtime and package size. Provisioned concurrency buys warmth. SnapStart helps some managed runtimes.
- **Azure Functions**: Consumption can chill; Premium / always-ready instances trade money for predictability. Flex Consumption sits between classic Consumption and Premium for many workloads.

Neither platform “solves” cold starts for free. If your API must reply in tens of milliseconds on a quiet endpoint, budget for warm capacity or stop pretending serverless is free.

For chatty internal tools and webhooks that tolerate a short pause, both are fine. For a public API with tight latency SLOs, measure before you commit—and be willing to pay for warm instances.

## Local development and tooling

### Azure Functions

- `func` Core Tools and Visual Studio / VS Code tooling are mature
- Local settings mirror `local.settings.json`; Azurite covers storage emulators
- Deploy from VS, Core Tools, GitHub Actions, or Azure DevOps with little ceremony

### AWS Lambda

- SAM, CDK, and the AWS Toolkit cover most flows
- Local invoke and containers work; API Gateway emulation is “good enough” until it is not
- Deploy stories are excellent inside AWS-native pipelines; outside AWS CI you install the CLI and wire credentials yourself (same friction I hit with [ECR](/posts/2026/acr-vs-ecr/))

**Winner**: Azure Functions if your editor life is Visual Studio or you live in Azure DevOps. Lambda if SAM/CDK is already how the team ships everything else.

## Feature snapshot

| Feature | AWS Lambda | Azure Functions |
|---------|------------|-----------------|
| Scale to zero | Yes | Yes (Consumption / Flex) |
| HTTP entry | API Gateway / Function URL | HTTP trigger (bindings) |
| Warm capacity | Provisioned concurrency | Premium / always ready |
| VNet / private access | VPC config | VNet integration (Premium+) |
| .NET experience | Strong | Strongest for me |
| Bindings / glue | SDK + event sources | First-class bindings |
| Free tier / hobby cost | Generous free tier | Consumption can be very cheap |
| Org fit | AWS event fabric | Azure + Entra + SWA |

## What I actually choose

### Choose Azure Functions if

- The app already sits in Azure (Static Web Apps, Cosmos, Service Bus, Key Vault)
- You want binding-driven .NET with minimal glue
- Your team’s muscle memory is Portal, `func`, and Azure Pipelines
- You need Premium features: VNet, predictable warm instances, longer execution

### Choose AWS Lambda if

- The event sources are already SQS, SNS, EventBridge, or S3
- You want pay-per-use with a strong free tier and no Function App plan to reason about
- The team deploys with SAM or CDK
- You are fine composing API Gateway (or Function URLs) as a separate piece

### Either is fine if

- The function is a thin webhook or nightly timer
- You measure cold starts and cost instead of arguing from blog posts (including this one)

## Conclusion

Lambda and Azure Functions solve the same problem with different gravity wells. Azure wins for me when the rest of the solution is Microsoft-shaped and I want bindings plus a familiar .NET host. Lambda wins when the work is already on AWS and the surrounding services are the product.

Same advice as ACR vs ECR: **match the cloud you are already paying for**, then optimise. Multi-cloud “just because” usually costs more in cognitive load than it saves in invoice line items.

What have you shipped on Lambda or Functions lately—and what made you pick one? Tell me in the comments.

## Resources

- [Azure Functions documentation](https://learn.microsoft.com/en-us/azure/azure-functions/)
- [AWS Lambda documentation](https://docs.aws.amazon.com/lambda/)
- [Azure Functions hosting plans](https://learn.microsoft.com/en-us/azure/azure-functions/functions-scale)
- [AWS Lambda pricing](https://aws.amazon.com/lambda/pricing/)
- [Azure Functions pricing](https://azure.microsoft.com/en-gb/pricing/details/functions/)
