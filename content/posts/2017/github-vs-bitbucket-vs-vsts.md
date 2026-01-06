+++
title = "Github Vs Bitbucket Vs Visual Studio Team Services"
date = "2017-03-06T20:00:45Z"
year = "2017"
month= "2017-03"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["Git", "Bitbucket", "DevOps",  "AzureDevOps", "Source Control"]
categories = ["tech"]
keywords = ["", ""]
description =  "Github Vs Bitbucket Vs Visual Studio Team Services"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/github-vs-bitbucket-vs-visual-studio-team-services-ial",
    "/posts/github-vs-bitbucket-vs-vsts",
    "/posts/github-vs-bitbucket-vs-visual-studio-team-services-ial",
    "/posts/2017/03/06/github-vs-bitbucket-vs-visual-studio-team-services-ial",
    "/posts/2017/03/06/github-vs-bitbucket-vs-vsts",
    "/2017/03/06/github-vs-bitbucket-vs-visual-studio-team-services-ial",
    "/2017/03/06/github-vs-bitbucket-vs-vsts"
]
+++
As a developer using source control and git is bread and butter of what we do. Github is probably the most popular and widely known hosting service for source control but I have also used Bitbucket and Visual Studio Team Services. Lets have a look at each one and what they offer. Note while I have included prices I have only tried out the free versions.

### Github

![](/images/2017/github-octocat.png)

- URL: https://github.com/
- Private Repositories: Not Available for free
- Public Repositories: Unlimited
- Team Size: Unlimited
- Prices: $7 per month for unlimited private repositories, $25 per month for 5 users then $9 per month per user

This is probably the most widely used service for hosting code. Over 13 million repositories of code. This is an ideal solution if you want your code to be publicly viewable, but take care not to publish passwords, private keys or your companies trade secrets. Every developer should have a Github account for displaying bits of code they are proud of.

There are a number of externally built APIs that link into Github for doing extra features, like building, code coverage etc

### Bitbucket

![](/images/2017/d8TRzzL.png)

- URL: https://bitbucket.org/
- Private Repositories: Unlimited
- Public Repositories: Unlimited
- Team Size: Less than 5
- Prices: $10 per month for 10 Users, $100 per month for 100 Users, $200 per month for Unlimited Users

At my last job we used Bitbucket extensively for all our projects. All the code was private so only the team could access it, however before I left we were approaching the 5 user limit (but looking at these prices cost seems very reasonable)

### Visual Studio Team Services

![](/images/2017/Visual-Studio-Team-Services.png)

- URL: https://www.visualstudio.com/team-services/
- Private Repositories: Unlimited
- Public Repositories: Not Available
- Team Size: Less than 5
- Prices: $30 per month for 10 users, and other features paid for via Azure Invoices

Visual Studio Team Services or VSTS is Microsoft’s version control solution and I have only just started using it, however what I have seen I like. There are lots of options for building your code so VSTS is more than just hosting your code it is verging on a Continuous Integration/Delivery solution. Being a Microsoft product there are numerous links to Azure and it is easy to deploy stuff to that platform.

All three have options for tracking issues but VSTS have options to add Stakeholder users which would allow none developers to add and keep track of issues and progress with them.

If I want to run tests, look at code coverage VSTS is probably the solution I would go for, if I want something that is public I would go for Github. What do you think which of these is your favourite?