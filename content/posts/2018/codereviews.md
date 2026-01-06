+++
title = "Code Reviews"
date = "2018-04-02T00:00:00Z"
year = "2018"
month= "2018-04"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
copyright = false
cover = ""
tags = ["Git", "Visual Studio"]
categories = ["tech"]
keywords = ["", ""]
description = "Code Reviews"
showFullContent = false
readingTime = true
aliases = [
    "/code-reviews-6fj",
    "/posts/codereviews",
    "/posts/2018/04/02/codereviews",
    "/posts/code-reviews-6fj",
    "/posts/2018/04/02/code-reviews-6fj",
    "/2018/04/02/code-reviews-6fj",
    "/2018/04/02/codereviews"
]
+++

Reviewing code is a great habit to get into. Code reviews help share knowledge between your team members and help catch bugs before they get into production. But how do you get into the habit of reviewing and avoid the we don’t have time to do this mentality?

Visual Studio Team Services (VSTS) has some great options that can help make code reviews second nature.

#### Pull Requests

A lot of source control systems have the concept of pull requests. This is where you request others to review your code usually in a branch and if they approve it, merge it into a main branch.

To create a pull request in VSTS go to the Code section and select Pull Requests. Often VSTS will make a suggestion of what branch to make a pull request for, if you don’t see this just click the New Pull request button.

Select a branch you want to merge from and a branch that should be merged into (usually you merge into master from a feature branch). Give your pull request a title and description and select who should review your code, this can either be an individual or a group of people. You can also review all the changes that will be reviewed so you can make any last minute changes before it is reviewed.

Now if you are anything like me you want your code merged in as soon as you have created your pull request and there is nothing stopping you reviewing your own code and clicking approve and merge on your own pull request. However [branch policies](https://docs.microsoft.com/en-us/vsts/git/branch-policies?view=vsts) is a way around this problem.

#### Branch Policies

![Branch Policy](/images/2018/save-policy-changes.png)

Branch policies allow you to specify how your code gets merged in.

Go to the list of branches in VSTS and select branch policy and you will see a whole host of options to customise the merge process. If you do this on the master branch you will not be able to commit any changes to master without it going through a pull request.

The first option enables you to select how many reviewers are needed on your code. If no one else works on your project best not setting this, but for everyone else setting at least one person to review your code is a great practice.

Next you can ensure that your pull request is linked to a work item, this helps keep ensure you are actually fixing issues and not just making change for the sake of it.

Check for comment resolution is a good setting to enable. This ensures that if your reviewer has commented about you needing to change this line here, it ensures that you do.

Enforce merge strategy allows you to choose between fast forward merge or squash merge.

Build validation enables the code to be built using a build definition you have configured. This is a great way to check code builds or tests pass before it gets merged in.

The last two options allow you to specify code reviewers and third party external services.