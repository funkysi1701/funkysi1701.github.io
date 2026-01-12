+++
title = "Building a CI Server with TeamCity"
date = "2015-04-01T20:00:45Z"
year = "2015"
month= "2015-04"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["Continuous Integration", "DevOps",  "TeamCity", "Test"]
categories = ["tech"]
keywords = ["", ""]
description =  "Building a CI Server with TeamCity"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/posts/teamcity",
    "/posts/building-a-ci-server-with-teamcity-57ma",
    "/posts/2015/04/01/building-a-ci-server-with-teamcity-57ma",
    "/posts/2015/04/01/teamcity",
    "/2015/04/01/building-a-ci-server-with-teamcity-57ma",
    "/2015/04/01/teamcity"
]
+++
TeamCity is a Continuous Integration software package which is very easy to install and set up. So easy I managed it over a weekend.

First of all I fired up a VM in Azure. I found that a Basic A1 VM was sufficient so running a CI server doesn’t have to be expensive, alternatively you could always set a Virtual or Physical server on your own network, but that of course takes a bit longer to set up.

Before I get too far you are probably asking what is Continuous Integration. A Continuous Integration server takes your code from your source control repository, it then automatically builds it, runs automated tests against it and can even deploy it to production. The main advantages of this is that you can see the health of you code, you can also test different configurations.

So once you have a server ready, you need to install a few things. First [TeamCity](https://www.jetbrains.com/teamcity/download/), just install with the default settings. My project is a Visual Studio project so I also needed to install Visual Studio (They have a free edition which does everything I need now, Thank you Microsoft) and SQL Server Express Edition.

Once TeamCity is installed the rest of the config can be made via the web interface. To make it easier I pointed a domain at my VM (a CNAME record is probably better as an Azure IP address may change) and opened port 80 in the Azure config. First create a build config and then create a VCS Root, this is where you specify where your source control is. TeamCity supports Github and bitbucket and probably many others. You can specify which branch you want to checkout so you can test out the latest features you have written.

Next you need to configure the steps needed to build your project, whatever you do in Visual Studio can be configured here. You then need to configure how often the build should run, it can be scheduled at specific times, this is how I remember CI servers being configured but now you can also have builds being triggered after commits to source control, very clever.

That is just about all I have configured so far. My project has a few NUnit tests written for it, these are scheduled to run after every build. In my case 94 of them are currently failing so I now need to learn how my tests work.

There are additional deployment steps that can be configured but I have not investigated these yet. Notifications about what CI is doing is also possible usually by email but there are other options available.