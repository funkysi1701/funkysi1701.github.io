+++
title = "Gated Release"
date = "2019-04-05T20:00:45Z"
year = "2019"
month= "2019-04"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/2019/04/image.png"
images = ['/images/2019/04/image.png']
tags = ["Azure", "API", "ApplicationInsights", "DevOps"]
categories = ["tech"]
keywords = ["", ""]
description = "Automated releases of software are great but how can we add an element of feedback so only good releases go live"
showFullContent = false
readingTime = true
copyright = false
draft = false
aliases = [
    "/gated-release-4772",
    "/posts/gated-release/",
    "/posts/gated-release-4772",
    "/posts/2019/04/05/gated-release-4772",
    "/posts/2019/04/05/gated-release",
    "/2019/04/05/gated-release-4772",
    "/2019/04/05/gated-release"
]
+++

Automated releases of software are great but how can we add an element of feedback so only good releases go live.

I have been using Azure DevOps to release my PwnedPass android app to the Google Play Store for a while now. There are options to deploy to the alpha, Beta or Production tracks and even to set % of users to target. For the full range of options check out the Google Play [extension](https://marketplace.visualstudio.com/items?itemName=ms-vsclient.google-play) for Azure DevOps.

My release starts by publishing to 10% of users on the production track, my next step makes use of the increase rollout option to increase this %, you can have as many of these additional steps as you want until you reach 100% of your users.

![Image](/images/2019/04/image.png)

Now if you run this release now it will just run through each of the steps one after the other. Now of course you can add a pre or post approval to your pipeline but this just adds a manual dependency to your release. Whoever does the approving needs to check things are working before approving or worse just approves regardless.

Azure DevOps has the concept of [gated releases](https://docs.microsoft.com/en-us/azure/devops/pipelines/release/deploy-using-approvals?view=azure-devops) which allows you to add automated checks before or after a release happens. These automated checks can be any of the following:

- An Azure Function
- A Rest API call
- Azure Monitor Alert
- Query Work Items
- Security and Compliance Assessment

We are going to make use of the Azure Monitor Alert, to create an alert from your Application Insights data and only continue the rollout if no failures are detected.

Open up your application insights resource in the Azure portal and look in alerts. Click add new alert rule.

![Image](/images/2019/04/image-1.png)

Select your application insights resource in Resource, In Condition choose a condition to check, I chose Failed Requests, so every time a failure is registered in my API I can stop the deployment. The exact criteria you want to use is entirely up to you.

Create an action group, I just set my alert to send an email to myself but there are other alert actions you may want to try. Give your alert a name and description and click save.

Now all we need to do is make Azure DevOps make use of this alert. In your release pipeline select the pre-deployment conditions of your second step and open up the Gates section.

![Image](/images/2019/04/image-2.png)

Choose a suitable time to evaluate, I have been using something long like 12 or 24 hours so if there are problems there is time for it to be noticed. Choose Version 1 of the task (I was not able to get it to work with Version 0)

Now select your Azure subscription and Resource Group and leave the rest of the settings as they are. Now your Deployment will stop and analyse application insights for any Failed requests and will halt if it finds any.

![Image](/images/2019/04/image-3.png)

I am still testing this out but it will take a few days to figure out if this what I want due to the large time scales involved. I feel this is going to be an improvement of manually approving release steps.