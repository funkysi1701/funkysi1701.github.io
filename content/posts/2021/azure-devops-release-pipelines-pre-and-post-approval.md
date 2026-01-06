+++
title = "Azure DevOps Release Pipelines Pre and Post Approval"
date = "2021-02-14T20:00:45Z"
year = "2021"
month= "2021-02"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/dev-to/9k6vo6pfv434u7yq3mt4.png"
images = ['/images/dev-to/9k6vo6pfv434u7yq3mt4.png']
tags = ["AzureDevOps", "DevOps", "Azure"]
categories = ["tech"]
keywords = ["", ""]
description = "Azure DevOps release pipelines have lots of options to do things how you want. One of my favourites is the option for approval."
showFullContent = false
readingTime = true
copyright = false
draft = false
aliases = [
    "/azure-devops-release-pipelines-pre-and-post-approval-4095",
    "/posts/azure-devops-release-pipelines-pre-and-post-approval/",
    "/posts/azure-devops-release-pipelines-pre-and-post-approval-4095",
    "/posts/2021/02/14/azure-devops-release-pipelines-pre-and-post-approval-4095",
    "/posts/2021/02/14/azure-devops-release-pipelines-pre-and-post-approval",
    "/2021/02/14/azure-devops-release-pipelines-pre-and-post-approval-4095",
    "/2021/02/14/azure-devops-release-pipelines-pre-and-post-approval"
]
+++

Azure DevOps release pipelines have lots of options to do things how you want. One of my favourites is the option for approval. 

There are two ways you can do approvals Pre and Post deployment. Lets look at both.

## Pre Deployment Approval

![image](/images/dev-to/9k6vo6pfv434u7yq3mt4.png)

Lets imagine you have a simple deployment pipeline that deploys to a test/development environment before deploying to a production environment. 

Pre Deployment Approval happens immediately before the release so in this example, click in the ellipse before the Prod release step. 

You will get a screen like the above, you can select what users need to approve it and how long approval waits before timing out, the default is 30 days, but I tend to use a shorter time out of 3 days.

## Post Deployment Approval
![image](/images/dev-to/reiulrhinzqyyon6mrqi.png)
 
Post Deployment Approval happens immediately after the release so in this example, click in the circle after the Test release step.

You will get a screen like the above, with the same settings as before.

That is pretty much all there is to approvals so either option will prompt you to approve before anything gets deployed to your production environment.   

## Deployment Hours
To complicate matters I make use of the following setting to define deployment hours.
![image](/images/dev-to/aku2z0dl3m3xkvfvh7wd.png)
 
This setting will start the Prod deployment at 3am Mon-Fri. 

If I configure Post Deployment Approval, as soon as my deploy to Test has completed a request for Approval is sent.

If I configure Pre Deployment Approval, at 3am Mon-Fri a request for Approval is sent (not ideal if you tend to be asleep at 3am)

So it looks like Post Deployment Approval is more useful for my use case. However if you deny approval either in Pre or Post approval this will mark the deployment as failed and show Red in your list of deployments. 

![image](/images/dev-to/vichyb1srgc1ln85hj0o.png)

From a casual glance it looks like the deployment to Test is failing, it isn't I am just opting to not continue my deployment to production.

## My Pipeline

![image](/images/dev-to/9kprp90t59owfmsmqkcp.png)

This is how I have my pipeline setup. Deployment happens on Test and doesn't have a post approval step. 

After Test an empty stage called Approval runs and that has a post deployment approval, this happens immediately after Test so you get asked straight away for approval. 

Prod does not start as I have my deployment hours configured. Once it is time for deployment to Prod to start it executes.

Now a casual look at my past releases, you can easily see which have been stopped by approval and which have failed due to whatever issue, and which have run all the way through to Prod. 

And deployments to Prod can only ever run during my defined deployment window.

I am interested to hear how you have your deployment pipeline setup. Do you make use of Pre or Post Approvals? Do you ensure deployments always happen at specific times? 
