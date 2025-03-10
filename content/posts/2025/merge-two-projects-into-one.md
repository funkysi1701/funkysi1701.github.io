+++
title = "Merging Two Projects Into One Git Repository"
date = "2025-03-10T20:00:00Z"
year = "2025"
month= "2025-023"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/exceptions.png"
images =['/images/exceptions.png']
tags = ["Git", "Version Control", "Repository Management", "Development", "Tech", "Programming"]
category="tech"
description = "Learn how to merge two Git repositories into one while preserving commit history with a step-by-step guide."
showFullContent = false
readingTime = true
copyright = false
featured = false
draft = false
aliases = [
    "/git",
    "/posts/git",
    "/posts/2025/03/10/git",
    "/2025/03/10/git" 
]
+++
Recently I did some work to merge two separate projects into one. Each had its own git repository and I wanted to merge them into a single repository.

Initially, I copied the code from one project, pasted into the other and committed the changes. If anyone needed any information on the original commits, they could look at the original repo, however it was suggested to me that it was possible to copy over the history of the commits from the original repository.

Lets look at how we can do this.

I am going to call the two repositories `project1` and `project2`, and each has a separate git repository, located at `project1Url` and `project2Url` respectively.

## Step 1: Clone the original repository

```bash
git clone project1Url
```

## Step 2: Add the new repository as a remote

```bash
git remote add project2 project2Url
```

## Step 3: Fetch the commits from the new repository

```bash
git fetch project2
```

## Step 4: Merge the commits from the new repository

```bash
git merge project2/develop --allow-unrelated-histories
```

## Step 5: Fix merge conflicts

If there are the same files in both repositories you will need to resolve the conflicts. In my case this was mainly build files and scripts in the root of the repository. Most of the important code was in subfolders so this was minimal.

## Step 6: Push the changes to the original repository

I am pushing my code to a branch so it can be reviewed before merging into the main branch.

```bash
git checkout -b feature/merge-project2-into-project1
git push origin feature/merge-project2-into-project1
```

## Step 7: Clean up

Now test your code builds and everything runs as you expect now that it is all in one repository. Create a Pull Request and review all the changes so nothing gets changed that shouldn`t be.

When you look at your PR, it will look like a lot of code has been added, however if you look closely at the git history of those files you will see that the history has been preserved from the original repository. 

## Conclusion

This is a remarkably simple way to preserve the history of commits from one repository to another. It is a great way to merge two projects into one repository and keep the history of the commits. A similar process could be followed, if you want to create a new repository and merge other repositories into it.

If you have enjoyed this article and want to get a monthly email with all my latest articles, please sign up for my [newsletter](http://eepurl.com/i7pQno). If you have any questions or comments, please feel free to reach out or leave a comment below.
