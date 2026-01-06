+++
title = "A brief history of Source Control"
date = "2022-07-25T18:00:45Z"
year = "2022"
month= "2022-07"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/svn.jpg"
images=['/images/svn.jpg']
tags = ["Source Control", "History", "Bitbucket", "AzureDevOps", "GitHub", "Git", "Subversion"]
categories = ["tech"]
description = "Explore the evolution of source control systems from their early beginnings to modern tools like Git, Bitbucket, and Azure DevOps. Learn about the history, key developments, and how these tools have shaped software development practices."
showFullContent = false
readingTime = true
copyright = false
featured = false
aliases = [
    "/a-brief-history-of-source-control-2ggc",
    "/posts/source-control",
    "/posts/2022/07/25/source-control",
    "/posts/a-brief-history-of-source-control-2ggc",
    "/posts/2022/07/25/a-brief-history-of-source-control-2ggc",
    "/2022/07/25/a-brief-history-of-source-control-2ggc"    
]
+++
I have been thinking back to when I started using source control and some of the different tools I have used over the years.

When I was learning to code it was some time after I had learned the basics that I learnt about source control. Back when I started writing webpages I would have a folder containing all my html, css, images etc and I would FTP these up to my web server. If I made a change to a file I would reupload the file I changed, or reupload all my files to make sure I didn't miss anything.

It was sometime later that I learnt about source control. I can't remember exactly when, but I suspect it was after I had used it at work. (between 2006 and 2010 as a best guess, my oldest repo says it is 12 years old!)

Source control (or version control) is the practice of tracking and managing changes to code. These tools provide a running history of code development and help to resolve conflicts when merging.

<img src="/images/svn.jpg" width="400px" align="left" />

The first source control tool I remember using was subversion. The windows client for this was called [TortoiseSVN](https://tortoisesvn.net/downloads.html) and is still available today. I know this as my current job has some legacy code which still uses it.

Back then, to use Subversion you needed to set up a linux server with subversion on it, and you would then connect over your LAN to it from your development machine. This was before the days of github, where everything was hosted on a SaaS service somewhere. I do not remember the process of getting everything setup, but with it being linux, there was no doubt a load of config files to edit, and different dependencies to install.

Over the years I installed various web interfaces to allow "*browsing*" of source code, some even had bug trackers built in. The ones I can remember are [Trac](https://trac.edgewall.org/) and [Redmine](https://www.redmine.org/). Both look to still be available and you can probably install them if you want to remember way back when.

<img src="/images/2022/github-octocat.png" width="400px" align="right" />

The first hosted source control tool I remember using was [bitbucket](https://bitbucket.org/product/) and this as far as I can tell has only ever supported git. So I am guessing I imported my subversion repos into git ones at this point. The reason for bitbucket was chosen was it allowed private repositories for free, at that point github was probably available but only provided public repositories.

After bitbucket the git repos where moved to Azure DevOps or Visual Studio Team Services as it was called back then. This move was mainly to take advantage of the builds and releases feature and to decommission some aging build servers.

<img src="/images/azuredevops.png" align="left" width="400px" />

This brings me to today where I have a mix of public repos on github and private repos on Azure DevOps. For building my code I use a mix of github actions and Azure Pipelines. As Microsoft own both services now, there is a fair amount of crossover between the two services, however it is far from certain which service is the future.

Wow, my code has moved around a lot over the years. From no source control, to subversion, to git, to Bitbucket to Azure DevOps!