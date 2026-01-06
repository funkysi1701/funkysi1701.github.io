+++
title = "Azure Functions"
date = "2017-09-12T20:00:45Z"
year = "2017"
month= "2017-09"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["Azure", "DevOps"]
categories = ["tech"]
keywords = ["", ""]
description =  "Azure Functions"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/azure-functions-301k",
    "/posts/azure-functions",
    "/posts/azure-functions-301k",
    "/posts/2017/09/12/azure-functions-301k",
    "/posts/2017/09/12/azure-functions",
    "/2017/09/12/azure-functions-301k",
    "/2017/09/12/azure-functions"
]
+++
I recently blogged about using [Azure Web Jobs](https://www.funkysi1701.com/posts/using-azure-webjobs-to-automate-stuff), Azure Function is another way of doing the same thing, lets look at how they work.

(Sorry its been a while since I blogged but I suspect an erratic schedule will continue for the next few months.)

To create an Azure Function go to the Azure portal and click add new and search for "Function App"

Give your app a name and select the usual resource group and location settings.

Now when you open Function Apps you should see your new app.

I want my Function App to run on a schedule so I clicked the + next to functions and selected TimerTrigger. I am a c# programmer so I selected this option as well.

Give your function a name and specify using the usual cron notation how often it should run. I want mine to run at 9.30pm each night so use 0 30 21 \* \* \*

Now comes the code bit. By default you get a window with the following code in it

```csharp
using System;

public static void Run(TimerInfo myTimer, TraceWriter log)
{
 log.Info($"C# Timer trigger function executed at: {DateTime.Now}");
}
```

It is entirely up to you what you get your function to do. In my case I just wanted to call a URL on a schedule so I created some code that used httpclient.

```csharp

using System;
using System.Net.Http;

public static async Task Run(TimerInfo myTimer, TraceWriter log)
{
 log.Info($"Buffer 0 function executed at: {DateTime.Now}");
 HttpClient client = new HttpClient();
 var result = await client.GetAsync("URL");
 string resultContent = await result.Content.ReadAsStringAsync();
 log.Info(resultContent);
}
```

Once you have created your app and it has run you can use the monitor section to view success and failures.

There is loads more you can do with Azure Function but this is a good place to start.