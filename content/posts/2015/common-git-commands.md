+++
title = "Common git commands"
date = "2015-08-06T20:00:45Z"
year = "2015"
month= "2015-08"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["Git",  "Source Control"]
categories = ["tech"]
keywords = ["", ""]
description = "A quick reference guide to common Git commands for everyday use, including clone, add, commit, push, pull, and more."
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/posts/common-git-commands",
    "/posts/common-git-commands-2b3c",
    "/posts/2015/08/06/common-git-commands-2b3c",
    "/posts/2015/08/06/common-git-commands",
    "/2015/08/06/common-git-commands-2b3c",
    "/2015/08/06/common-git-commands"
]
+++
I use git as my source control system. Here are some of the most common git commands in no particular order.

- Check Out a git Repository	**git clone /path/to/repository**
- Add files to commit	**git add <filename>**
- Commit files to **git	git commit -m “Commit message”**
- Push changes to server	**git push origin master**
- Show status	**git status**
- Create new branch	**git checkout -b <branchname>**
- Switch to a branch	**git checkout <branchname>**
- Get remote changes	**git pull**
- Merge a different branch into the current one	**git merge <branchname>**
- View merge conflicts	**git diff**
- Temporarily stash uncommitted changes	**git stash**
- Undo a commit	**git reset –hard <commit>**
- Show details about a commit	**git show <commit>**
- Show version history of current branch	**git log**
- Gets all remote branches	**git fetch origin**

Most of the time I use the [git extensions](https://sourceforge.net/projects/gitextensions/) tools to do my git work, but there are times when only the command line will do.