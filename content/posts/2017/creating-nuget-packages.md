+++
title = "Creating your own nuget packages with VSTS"
date = "2017-07-31T20:00:45Z"
year = "2017"
month= "2017-07"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["Nuget", "C-Sharp", "Visual Studio"]
categories = ["tech"]
keywords = ["", ""]
description =  "Creating your own nuget packages with VSTS"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/creating-your-own-nuget-packages-with-vsts-297p",
    "/posts/creating-nuget-packages",
    "/posts/creating-your-own-nuget-packages-with-vsts-297p",
    "/posts/2017/07/31/creating-your-own-nuget-packages-with-vsts-297p",
    "/posts/2017/07/31/creating-nuget-packages",
    "/2017/07/31/creating-your-own-nuget-packages-with-vsts-297p",
    "/2017/07/31/creating-nuget-packages"
]
+++
For a while I have found myself writing the same bits of code for different web projects. This annoys me as it goes against the DRY principle (don’t repeat yourself).

![Nuget](/images/2017/nuget.png)One possible solution is to write your own nuget packages. You can then add this piece of code to any project you work on.

[nuget.org](https://www.nuget.org/) is the public nuget feed where any developer can download nuget packages. You could publish your nuget package here, but your might want to restrict access so better to create a private nuget feed.

Lets look at how we create a nuget feed in Visual Studio. First thing you need to do is install the [Package Management](https://marketplace.visualstudio.com/items?itemName=ms.feed) extension to Visual Studio Team Services (its free for less than 5 users), this will add a packages section under the build menu.

Before you can start using this new feature you need to add a Package Management License in the users hub.

Once that is done you can create a feed. You need to give your feed a name, decide if only members of the current project or everyone in your account should have access to read and contribute to.

Now you have a feed you could use the nuget package command to create a nupkg file and then nuget push command to add it to your feed. A better way is to get Visual Studio Team Services to do all the hard work.

Create a new project in Visual Studio Team Service to house your nuget package. In the build section add an empty build definition. Choose a build agent, I am using the Hosted VS2017. Then add the following steps nuget restore, Visual Studio Build, nuget pack and nuget push.

- nuget restore – this step is only needed if your code depends on other packages. If it depends on other packages that are only in your feed you must specify your feed in the feeds and authentication section.
- Visual Studio Build – this builds your code like you would in Visual Studio. The only config I made to this step was to specify Release in configuration.
- nuget pack – this creates the nupkg file from your built project. In configuration to package specify the same as you specified in the previous step (in my case Release)
- nuget push – this publishes to your feed, so of course you need to specify your feed.

One last thing to configure is to enable the continuous integration option in triggers. This means whenever you push code all these steps will run and you have a new version of your nuget package.

In Visual Studio you need to create a \*.nuspec file, this contains all the meta data about your nuget package. Let look at an example.

```xml
<?xml version="1.0"?>
<package >
 <metadata>
 <id>$id$</id>
 <version>1.0.2</version>
 <title>Nuget</title>
 <authors>Simon Foster</authors>
 <owners>Simon Foster</owners>
 <requireLicenseAcceptance>false</requireLicenseAcceptance>
 <description>An example of a nuget package.</description>
 <releaseNotes>Release Notes</releaseNotes>
 <copyright>Copyright 2017</copyright>
 <projectUrl>https://[yourVSaccount].visualstudio.com/nuget/</projectUrl>
 </metadata>
</package>
```

One last thing to mention is version numbers. You can either change the version number in your \*.nuspec file everytime you push changes. This will create stable packages like 1.0, 1.1, 1.2 etc

However you can use the automatic version number setting in the nuget pack build step. However I have found this only ever creates pre-release packages and I haven’t found a way to upgrade a package from pre-release to stable.

This is a really neat way to reuse your code in multiple projects. I have only been looking at this for a few days and I have already extracted code to do with emails, creating excel downloads and database related methods. I suspect that doing this will also have a side benefit of forcing me to create code with fewer dependencies so more code can be turned into a nuget package.