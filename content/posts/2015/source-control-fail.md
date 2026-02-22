+++
title = "Source Control Fail"
date = "2015-03-16T00:00:00Z"
year = "2015"
month= "2015-03"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
copyright = false
cover = ""
tags = ["Git"]
categories = ["tech"]
keywords = ["", ""]
description = "Source Control Fail"
showFullContent = false
readingTime = true
aliases = [
    "/posts/source-control-fail",
    "/posts/2015/03/16/source-control-fail",
    "/posts/source-control-fail-dgn",
    "/posts/2015/03/16/source-control-fail-dgn",
    "/source-control-fail-dgn",
    "/2015/03/16/source-control-fail-dgn"
]
+++
Every developer uses source control, it is a great tool for keeping track of changes to your code, seeing who has done what.

However I keep messing up, my use of it. I am fairly disciplined when creating new features, all my changes will get committed to source control and when I am happy I will deploy these changes to the live system. But as soon as there is a bug, especially one where the client is chasing for a fix, I will deploy a fix as soon as humanly possible on to the live system.

At first glance there is nothing wrong with what I have described but what happens the next time I deploy a new feature. Yes the bug the client was complaining about gets deployed with the new feature as the fix was never committed into source control. The client gets angry as the bug he was screaming about is back again.

Every change you make to the system **MUST** be committed to source control. If it isn’t that change will look like it never existed. I have worked with source control for over 5 years why do I keep making this rookie mistake over and over.

Troy Hunt has a [blog post](https://www.troyhunt.com/2011/05/10-commandments-of-good-source-control.html) about the 10 commandments of using source control. His number two commandment is “If it’s not in source control, it doesn’t exist” He talks more about code you have written being not saved into source control, but the principal is the same for my example as his.

There are ways to automatically deploy from source control, however most of the time you don’t want your live database being rebuilt because you fixed a typo. Additional steps will need to be implemented and there is still the chance that you might want to bypass these steps to fix the urgent problem. The only way past this problem is for you and everyone on your team to be disciplined and only ever commit to source control first, and only after that deploy live (either automatically or manually)