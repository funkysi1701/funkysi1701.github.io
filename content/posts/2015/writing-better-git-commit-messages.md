+++
title = "Writing better Git commit messages"
date = "2015-07-25T20:00:45Z"
year = "2015"
month= "2015-07"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/2015/07/git_commit.png"
images = ['/images/2015/07/git_commit.png']
tags = ["Git",  "Source Control"]
categories = ["tech"]
keywords = ["", ""]
description =  "Writing better Git commit messages"
showFullContent = false
readingTime = true
copyright = false
draft = false
aliases = [
    "/posts/writing-better-git-commit-messages",
    "/posts/writing-better-git-commit-messages-o5i",
    "/posts/2015/07/25/writing-better-git-commit-messages-o5i",
    "/posts/2015/07/25/writing-better-git-commit-messages",
    "/2015/07/25/writing-better-git-commit-messages-o5i",
    "/2015/07/25/writing-better-git-commit-messages"
]
+++
![](/images/2015/07/git_commit.png)

I always use source control for my coding changes, however some of my commit messages leave something to be desired.

I always try to write a commit message but I often think that the change themselves should be enough to indicate what I did. I also don’t need to include who made the change or the time and date and that gets included automatically.

Here are some tips I have found that may help me in the future.

1) Ask yourself why you are making this change. The Who, When and What are already being covered so it is only the why that needs including in the commit message.

2) If your commit breaks something or causes side affects or a new dependency this should be included in the commit message. If your commit breaks functionality, consider if you really need to commit it yet, maybe only commit once fixed?

3) If your commit includes a long list of changes consider if the commit needs splitting into several commits. It is easy to only commit one or two files write a specific commit message and then commit the rest of the changes separately.

4) Consider including a subject for larger commits. The following comes from the git manual.
```
Though not required, it’s a good idea to begin the commit message with a single short 
(less than 50 character) line summarizing the change, followed by a blank line and then 
a more thorough description. The text up to the first blank line in a commit message 
is treated as the commit title, and that title is used throughout Git.
```
5) If you use a subject follow the following conventions:

- Limit of 50 characters
- Start with a capital letter
- Do not end with a full stop
- Use the imperative mood i.e. write as if issuing a command