+++
title = "Using Azure WebJobs to Automate Stuff"
date = "2017-06-26T20:00:45Z"
year = "2017"
month= "2017-06"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["Automate", "Azure","Cron"]
categories = ["tech"]
keywords = ["", ""]
description =  "Using Azure WebJobs to Automate Stuff"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/using-azure-webjobs-to-automate-stuff-38mj",
    "/posts/using-azure-webjobs-to-automate-stuff/",
    "/posts/using-azure-webjobs-to-automate-stuff-38mj",
    "/posts/2017/06/26/using-azure-webjobs-to-automate-stuff-38mj",
    "/posts/2017/06/26/using-azure-webjobs-to-automate-stuff",
    "/2017/06/26/using-azure-webjobs-to-automate-stuff-38mj",
    "/2017/06/26/using-azure-webjobs-to-automate-stuff"
]
+++

I keep hearing about Azure WebJobs but I have never used them. Time to change this.

WebJobs are a feature of Azure App Service that can run a script at a specific time. In my case I would like to hit a specific url of my website at the same time every day.

![WebJobs](/images/2017/addkeepalivewebjob.png)To the right you can see an example of the WebJobs form on the Azure portal that you need to fill in.

You need to supply a name for your webjob.

You need to upload the script that will run in my case I used a powershell script. My script consisted of which basically just loads the url specified.

```powershell
$progressPreference = "silentlyContinue";
$result = Invoke-WebRequest -Uri ("https://www.google.com") -Method Get -UseBasicParsing;
```

Type refers to if your job will be triggered or run continuously, I want it to be triggered.

Triggers refers to if you want it to be scheduled or manual, something that you can run on an ad hoc basis. I of course want scheduled.

If you are familiar with the linux CRON then the next box will make sense to you for everyone else I will try and make sense of it. The box consists of 6 numbers which can either have a value or a \*. The numbers correspond to the following {second} {minute} {hour} {day} {month} {day of the week}.

A hourly job would be expressed as 0 0 \* \* \* \*, ie every day of week, every month, every day, every hour and only when minute and second equals zero. For more help with this check out the [MSDN docs](https://docs.microsoft.com/en-us/azure/app-service-web/web-sites-create-web-jobs#CreateScheduledCRON) about it. I want to use 0 30 21 \* \* \* to run daily at 9.30pm.

That’s it everything setup, now time to wait and see if it works.

**Oh no!**

It failed to run at the specified time.

The reason for this is the scheduler requires the feature Always On to be turned on which is not available in the free App Service. Before you reach for your wallets, I found a solution on this [blog post](https://tomssl.com/2016/12/20/how-to-get-azure-webjobs-to-run-indefinitely-for-free/) that allows them to run on the free tier.

The thinking behind this solution is you need to keep the website alive throughout the day so Tom has created a script that does this. His script can be found on his blog or on his [github page](https://github.com/TomChantler/Self-KeepAlive).

Set this script up to run every 5 minutes (0 \*/5 \* \* \* \*) like the example above.

The nextthing you need to do is create a Custom connection string in the Application Settings blade called SecretThing. Tom’s script references this to access the website and keep it alive. The password you need to put in SecretThing can be found in you publish profile (downloaded from the Overview blade in the Azure portal). For more details and a better explanation check out [Tom’s blog](https://tomssl.com/2016/12/20/how-to-get-azure-webjobs-to-run-indefinitely-for-free/).

One last thing to mention about WebJobs is that you can see details about when they have run at https://[YourWebAppName].scm.azurewebsites.net/azurejobs/#/jobs and this can be a great place to help debug your scripts.