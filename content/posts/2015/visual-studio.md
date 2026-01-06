+++
title = "Visual Studio"
date = "2015-05-26T20:00:45Z"
year = "2015"
month= "2015-05"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/2015/05/i1.png"
images = ['/images/2015/05/i1.png']
tags = ["CodeLens", "Azure",  "Visual Studio"]
categories = ["tech"]
keywords = ["", ""]
description =  "Visual Studio"
showFullContent = false
readingTime = true
copyright = false
draft = false
aliases = [
    "/posts/visual-studio",
    "/posts/visual-studio-307p",
    "/posts/2015/05/26/visual-studio-307p",
    "/posts/2015/05/26/visual-studio",
    "/2015/05/26/visual-studio-307p",
    "/2015/05/26/visual-studio"
]
+++
I recently replaced my installation of Visual Studio 2013 with Visual Studio 2015 RC.

I like the new version, I am not a Visual Studio expert so it will probably take me a while to find all the good stuff but here are some initial thoughts.

Being as my MSDN subscription is still valid I have installed the professional version to take advantage of its extra features like CodeLens.

One of the first things I spotted was that the integration with Azure has been improved. In the last version it was difficult to sign in to Azure with the correct credentials, especially if you have more than one Azure account. Now you can add multiple Accounts and Subscriptions.

![](/images/2015/05/i1.png)

CodeLens is a feature that has been around in Visual Studio since 2013, but in 2015 it is available in Professional meaning more people have access to it.

CodeLens gives coders useful information at a glance. Above each class/method is listed how many references there are. If you click on the number of references you can see where that class or method is referenced in the rest of your code. Useful to be able to see which methods or classes are not being used.

Next CodeLens shows who (according to git) last changed the class or method and how many days ago that was. Clicking on it shows a cool graph of when changes have happened and who did them.

Next you can see the number of changes that have been made, basically a source control history, but without having to load up your git client.

For code that doesn’t contain classes or methods such as T_SQL you can see at the bottom of your code window the last two CodeLens information to help you track down what changes have happened recently.

The last new feature that I have noticed is the Light Bulbs that keep showing up all over my code. I think the Light Bulbs might be called Quick Actions, but whatever they are called they are suggestions on how to improve your code. So far they have suggested to be to get rid of using references that are not used, simplify a fully qualified name, drop unneeded this keywords. I am sure more will popup as I do more coding.

These improvements to Visual Studio I like, and I am sure there are many more that I haven’t noticed. I expect support for the vNext .net framework is also in there somewhere which hopefully I can play around with soon.