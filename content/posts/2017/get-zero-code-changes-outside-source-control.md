+++
title = "How to get Zero Code Changes outside of Source Control"
date = "2017-11-13T20:00:45Z"
year = "2017"
month= "2017-11"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["Git", "SQL","Visual Studio","SourceCode"]
categories = ["tech"]
keywords = ["", ""]
description =  "How to get Zero Code Changes outside of Source Control"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/how-to-get-zero-code-changes-outside-of-source-control-4iao",
    "/get-zero-code-changes-outside-source-control",
    "/posts/get-zero-code-changes-outside-source-control",
    "/posts/how-to-get-zero-code-changes-outside-of-source-control-4iao",
    "/posts/2017/11/13/how-to-get-zero-code-changes-outside-of-source-control-4iao",
    "/posts/2017/11/13/get-zero-code-changes-outside-source-control",
    "/2017/11/13/how-to-get-zero-code-changes-outside-of-source-control-4iao",
    "/2017/11/13/get-zero-code-changes-outside-source-control"
]
+++

Source control is bread and butter for web developers, however not so much for SQL developers and other business people. One of my goals for the coming year is to get the whole of my team using source control processes.

One of the arguments against using source control is there will always be a few exceptions where it won’t be used. Lets look at a few scenarios to help make the case for source control.

**Scenario One**

Web Dev 1 makes a change in production to fix an issue and doesn’t use source control. Web Dev 2 is working on a new feature and makes use of source control. He is given the sign-off to deploy his new feature and in the process undoes Web Dev 1’s fix.

Management blames Web Dev 2 as they “broke” stuff during the deployment. Web Dev 2 doesn’t understand what happened and Web Dev 1 is oblivious to the entire scenario despite in reality being part of the problem.

**Scenario Two**

A SQL Dev works all night to fix a problem. He deploy to production and doesn’t notice a missed where clause due to lack of sleep.

—

Let’s look at these two scenarios done with the whole team buying into source control.

**Scenario One**

Web Dev 1 makes a change in production to fix an issue and also commits to source control. This takes him an extra 5 minutes (if that!) Web Dev 2 is working on a new feature and makes use of source control. He is given the sign-off to deploy his new feature and in the process merges Web Dev 1’s fix before he deploys to production.

Management is happy with Web Dev 1, nothing is broken and new functionality has made the website better not worse.

**Scenario Two**

A SQL Dev works all night to fix a problem. He deploy to production and doesn’t notice a missed where clause due to lack of sleep, he also commits to source control this takes him an extra 5 minutes (if that!).

In the morning a colleague looks through the commits made during the night and queries the missing where clause. A fix is made in source control and deployed, management and the client are unaware that a problem was created and fixed.

—

These are simple scenarios but I cannot think of any situation where the outcome would be better to not use source control. These examples assume no continuous deployment, adding this to the system before every team has bought into source control would cause bugs and issues all over the place.

However with a team that is 100% behind source control continuous deployment can achieve an amazing productivity boost. After every commit code could be automatically tested, reviewed by other members of the team and deployed to test environments for further analysis. Only tested code that has been reviewed can get anywhere near production environments.

Having said all this there are ways especially on the SQL side to mitigate loosing changes while you work on training individuals and convincing management. Before any code is deployed to production do a schema compare. If you only see changes you have made you can proceed, if you don’t shout at your team.

**Advantages**

Code Reviews  
Team awareness of what is being changed  
History of changes  
Smoother Deployments  
Automation  
Better Teamwork  
Diff changes between different versions  
Many more

**Disadvantages**

Time to learn tools  
Remember to commit changes  
Technologies that use binary files harder to version control