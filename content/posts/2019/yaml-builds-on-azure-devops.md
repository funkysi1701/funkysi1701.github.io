+++
title = "Yaml Builds on Azure DevOps"
date = "2019-01-31T20:00:45Z"
year = "2019"
month= "2019-01"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["CI", "Build", "Azure", "DevOps", "AzureDevOps"]
categories = ["tech"]
keywords = ["", ""]
description = "Yaml Builds on Azure DevOps"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/yaml-builds-on-azure-devops-3e32",
    "/posts/yaml-builds-on-azure-devops",
    "/posts/yaml-builds-on-azure-devops-3e32",
    "/posts/2019/01/31/yaml-builds-on-azure-devops-3e32",
    "/posts/2019/01/31/yaml-builds-on-azure-devops",
    "/2019/01/31/yaml-builds-on-azure-devops-3e32",
    "/2019/01/31/yaml-builds-on-azure-devops"
]
+++
I have been using Azure DevOps (Or VSTS or VSO etc) for a while now and one of the great features is doing automatic builds with every check-in. This is more commonly known as a CI (continuous integration) build.

More recently I have started playing about with creating my build using YAML files instead of using the web user interface to create my build.

## Why?

You may wonder why go to the effort of learning the YAML syntax when you can just create the build in Azure DevOps and then forget about it.

Mostly it is because the build changes over time and you shouldn’t just forget about it. If something changes over time then you might want to version control it, or look at a previous version.

Lets say you create a pull request that replaces a .net 4.7 web service with a .net core web service. If you have a CI build this PR will fail because it won’t build. If you change the build first any other builds going on will fail. What you want in this case is the build to be associated with that branch or PR. Any builds before you merge this change in will continue to work and any after this change will also work.

## How?

How do you get started with YAML builds? Well the first thing is to make sure that YAML builds are turned on, as I write this I believe they are still a feature you can turn on or off. Have a look in Preview features and make sure they are turned on.

Next look at any of your existing builds and click the View YAML link. This will show you an example YAML file of your existing build. You could just save this as azure-pipelines.yml and checkin to the root of your project. You can also click the add new build pipeline option, this will give you some templates to start you off.

The YAML file consists of a series of build steps usually called tasks, with a few settings before to configure things like parameters or build agents. Detailed docs about the syntax of the file can be found [here](https://learn.microsoft.com/en-us/azure/devops/pipelines/yaml-schema?view=azure-devops&tabs=schema).

For my mobile app my YAML files consist of downloading nuget packages, building the solution, building specific projects with desired settings, running powershell or other scripts to set things up and finally publishing the results of the build as artifacts so that they can be used in any releases.

## Secure It!

Avoid committing passwords and secure keys into source control. I have found you can upload secure files via Azure DevOps and then add a download secure files step at the start of your build. This allows the secure file to be used during the build but the contents of the file can’t be viewed by anyone with access to the source code.

I find it often takes a bit of thinking about how to achieve this, but it is usually possible to keep keys and secrets secure.