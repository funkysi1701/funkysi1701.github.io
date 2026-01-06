+++
title = "Version 9 of .Net is here"
date = "2024-11-18T20:00:00Z"
year = "2024"
month= "2024-11"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/bot-01.png"
images =['/images/bot-01.png']
tags = ["DotNet", "Blazor", "EFCore", "C-Sharp", "Visual Studio", "Aspire", "AI", "OpenTelemetry", ".NET 9", "Microsoft"]
categories = ["tech"]
description =  "Discover the new features and improvements in .NET 9, including updates to Visual Studio, Aspire, Blazor, AI integrations, and more. Learn how to upgrade smoothly and enhance your development experience."
showFullContent = false
readingTime = true
copyright = false
featured = false
draft = false
aliases = [
    "/dotnet-9",
    "/posts/dotnet-9",
    "/posts/2024/11/18/dotnet-9",
    "/2024/11/18/dotnet-9"    
]
+++
Every November it is like Christmas for .NET developers, as Microsoft releases the next version of .NET. This year is no different, and we have version 9 of .NET to play with. This release is packed with new features and improvements across the board. 

If you haven't already head on over to the [dotnet website](https://dotnet.microsoft.com/download/dotnet/9.0) and download the latest version.

Also we get a brand new version of Visual Studio, which is always a good thing, so head on over to the Visual Studio [website](https://visualstudio.microsoft.com/downloads/) and download the latest version (or the Preview version if you want to test what is coming out next).

Back when .Net 7 came out I wrote a [post](/posts/2022/dotnet7/) about what you needed to fix to get the latest version working with your existing code. However this time around the upgrade is really smooth.

## NuGet Audit

Back in .Net 8 NuGet Audit was introduced which told you if any of your packages had security vulnerabilities. This has been improved in .Net 9, and now defaults to tell you about transitive dependencies. This is a great feature, but if you would prefer to keep .Net 8's functionality you can add the following to your project (*.csproj) file.


```xml
 <NuGetAuditMode>direct</NuGetAuditMode>
```

## .Net Aspire

Released just after .Net 8 .Net Aspire is a suite of tools to help develop microservices. Gone are the days of specifying ports and connection strings for your services, Aspire can handle this all programmatically. 

Aspire adds two new projects to your solution. AppHost and ServiceDefaults. 
- AppHost is where you configure what service depends on what, you can configure all sorts of different dependencies, like databases (sql server, mysql, postgres etc), rabbitmq, redis and many others. It is open source so the community are busy adding everything you could possibly need. 
- ServiceDefaults is where you configure the defaults for your services, like how opentelemetry should be configured, or how logging should work. Microsoft have thought hard about this and come up with some opinionated defaults, but you can change these to suit your needs.

Starting the AppHost project will start up the Aspire Dashboard where you can start/stop containers, view logs and see the health of your services. This is primarily a devlopment tool, but there are some deployment tools, however I have not explored these much yet. More details about Aspire can be found [here](https://learn.microsoft.com/en-us/dotnet/aspire/get-started/aspire-overview)

## Blazor

I have been using Blazor since the first previews in the .Net 3.1 days. It has come a long way since then, and now with .Net 9 it is even better. 

There has been some optimization of the delivery of static assets. To take advantage of this improvement, replace the following line in your Program.cs file.
  
```csharp
  app.MapStaticAssets(); //Add this line
  app.UseStaticFiles(); //Remove this line
```

.Net 9 will then cache your static assets ang give them a unique filename. This will allow the browser to cache the files for longer, and only download them when they have changed. This will speed up your site and reduce the amount of data transferred.

In your razor pages use code similar to this:
```html
<link rel="stylesheet" href="@Assets["bootstrap/bootstrap.min.css"]" />
<link rel="stylesheet" href="@Assets["app.css"]" />
<link rel="stylesheet" href="@Assets["BlazorSample.styles.css"]" />
```

## AI

It will have not escaped your notice that AI is everywhere, and it is no different with .Net. I saw some very impressive demos at the [.Net Conf](https://www.dotnetconf.net/) online conference. I encourage you to check our the videos. But to summarize Microsoft have added a bunch of abstractions to make it easier to write code to talk to the different AI models, I haven't played about with AI much yet, but I am tempted to give it a go.

## SQL Management Studio

I have not used SQL Management Studio for a while as I have trying out Azure Data Studio. However a new Preview of SQL Server Management Studio is now [avaliable](https://learn.microsoft.com/en-us/sql/ssms/ssms-21/release-notes-21?view=sql-server-ver16). This version is 64bit and is based on Visual Studio engine, it even shares the same installer.

## Conclusion

This is only a small taste of the new features in .Net 9. Go check out .Net Conf to learn more or check out some of the links I have shared above.