+++
title = "Automatic Git Tagging"
date = "2016-06-16T20:00:45Z"
year = "2016"
month= "2016-06"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["DevOps",  "Source Control", "Git", "TeamCity" ]
categories = ["tech"]
keywords = ["", ""]
description =  "Automatic Git Tagging"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/automatic-git-tagging-3cmo",
    "/posts/automatic-git-tagging",
    "/posts/automatic-git-tagging-3cmo",
    "/posts/2016/06/16/automatic-git-tagging-3cmo",
    "/posts/2016/06/16/automatic-git-tagging",
    "/2016/06/16/automatic-git-tagging-3cmo",
    "/2016/06/16/automatic-git-tagging"
]
+++
One of the features of git is the ability to tag a point in my change history with a tag. For a while now I have been manually tagging my code whenever I do a release, so I can easily work out what has changed by doing a diff between two tags.

Now that I am automating my release process with TeamCity I am thinking about how to manage my tags better.

TeamCity has a setting called VCS Labeling which comes in very handy.
![](/images/2016/Untitled.jpg)

Configuring it is fairly simple as it only has three settings.

**VCS root to label**: This is obviously the url to your git repository
**Labeling pattern**: This is the text of the label to be added.
**Label successful builds only**: Do you really want to add a tag if the build failed?

A tag needs to have a unique name, so adding a tag just called **deployed** won’t work. When I used to add tags manually I used the naming convention of **deployedyyyymmdd**.  While this naming convention is possible with TeamCity I use something a bit more complex to provide more information about what has been deployed.

TeamCity provides lots of parameters that can be used in your build steps and also in the Labeling pattern box. I started off using **deployed-build-%system.build.number%** as my tag which just marks git with the TeamCity build number.

When I run a TeamCity deployment I don’t always use the same configuration options, I deploy locally, to a test server or to production and sometimes I just deploy the frontend or the backend. How cool would it be to include this information in the tag text?

Well the next step was to change my Labeling pattern to **deployed-build-%system.build.number%-%ServerName%-%DatabaseName%-%FrontEndPath%**, this adds the backend database config settings and the path the frontend was deployed to. Now when looking at git you can see commits marked with multiple tags, one for each deployment that succeeded and the tag will indicate the settings used during that deployment.

Now I will never forget to add the tag after a release as the adding of a tag is part of the deployment process, if the deployment fails the tag won’t be added. I can test my deployment to test and git will show if this has been successful, and when I deploy live this will also show up.

How do you use tags? Do you mark successful builds with a tag? Why not let me know or leave a comment below.
