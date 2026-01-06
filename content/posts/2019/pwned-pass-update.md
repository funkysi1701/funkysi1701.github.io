+++
title = "Pwned Pass Update"
date = "2019-01-23T20:00:45Z"
year = "2019"
month= "2019-01"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/2019/01/image.png"
images = ['/images/2019/01/image.png']
tags = ["Xamarin", "Android", "PwnedPass"]
categories = ["tech"]
keywords = ["", ""]
description = "Its been a while since I first released Pwned Pass so lets have a look at where we are"
showFullContent = false
readingTime = true
copyright = false
draft = false
aliases = [
    "/pwned-pass-update-55io",
    "/posts/pwned-pass-update/",
    "/posts/pwned-pass-update-55io",
    "/posts/2019/01/23/pwned-pass-update-55io",
    "/posts/2019/01/23/pwned-pass-update",
    "/2019/01/23/pwned-pass-update-55io",
    "/2019/01/23/pwned-pass-update"
]
+++

Its been a while since I first released Pwned Pass so lets have a look at where we are now.

We are very close to 500 Downloads from [Google Play](https://play.google.com/store/apps/details?id=pwnedpasswords.pwnedpasswords) and we have recently smashed past 100 active installs, peaking at 116 and even now we are still over 100. I have had 9 reviews (6 x 5*, 2 x 1 * and a 4 *) which averages out at 4 *
![Alt Text](/images/2019/01/image.png)
Over Christmas I released a UWP version that can be found in the [Microsoft Store](https://www.microsoft.com/store/apps/9NM2WHNZTNLT). This has currently had 9 downloads and even had a download to windows mobile (someone out there still likes the platform!)
![Alt Text](/images/2019/01/image-1.png)
I have a fairly smooth deployment process using Azure DevOps. After every check in of code a build runs which compiles the UWP and Android versions. The build also increments the version numbers that is required to deploy to either of the app stores.

Every successful build of the master branch will kick off a release to the Beta track of Google Play. If I am happy I then release to 10% of the Production track, which can then be increased to 100% (or halted). The release to Microsoft Store happens after the Beta track of Google Play. Only reason for this order is that there isn’t a beta area for UWP apps so I want to quickly test change on android before rolling out for windows.

All these steps require confirmation by me before proceeding and often don’t get further than the beta track.

A further development is that I have open sourced the source code to [github]() do take a look if you are curious or want to contribute. With the purchase by Microsoft there are easy ways to connect github repositories to Azure DevOps. Once I create a Pull Request in github it creates a build in Azure DevOps and all the build and release steps can happen.

I am still not 100% sure if I want to keep my bug and issue tracking in github or Azure DevOps as both have features for doing so.

One future improvement I want to make is to automate the creation of screenshots. When I create a new feature and it gets checked in. I would like to automatically created screenshots of the key pages and submit them to the different app stores. Currently I am not sure if this is possible or how to go about it. I have some ideas to experiment with so we will see what I can do.