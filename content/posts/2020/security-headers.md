+++
title = "Security Headers"
date = "2020-09-26T00:00:00Z"
year = "2020"
month= "2020-09"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
copyright = false
cover = ""
tags = ["DotNet", "Security"]
categories = ["tech"]
keywords = ["", ""]
description = "Check the security headers of your site"
showFullContent = false
readingTime = true
aliases = [
    "/security-headers-3ec3",
    "/posts/security-headers/",
    "/posts/security-headers-3ec3",
    "/posts/2020/09/26/security-headers-3ec3",
    "/posts/2020/09/26/security-headers",
    "/2020/09/26/security-headers-3ec3",
    "/2020/09/26/security-headers"
]
+++
Have you wondered what info you are leaking via your response headers?, do you want some kind of guide about what headers to set or remove altogether?

Head on over to https://securityheaders.com/ This is a site created by security expert [Scott Helme](https://scotthelme.co.uk) that rates a URL based on what response headers it can see.

I am pleased to say https://www.funkysi1701.com is now getting an A.![Alt Text](/images/2020/07rwumi94fz141hwessu.png)

So how do you add/remove headers in dotnet core?

In my configure method in Startup.cs I have the following code block.

```csharp
app.Use(
    next =>
    {
        return async context =>
        {
            context.Response.OnStarting(
                () =>
                {
                    context.Response.Headers.Add("Permissions-Policy", "microphone=()");     
                    context.Response.Headers.Remove("Server");
                    context.Response.Headers.Remove("X-Powered-By");
                    context.Response.Headers.Remove("X-AspNet-Version");
                    return Task.CompletedTask;
                });

             await next(context);
         };
     });
```

I have only included a few of the headers I am adding as the excellent https://securityheaders.com/ can tell you which headers you should add and what options you might want.
