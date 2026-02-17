+++
title = "Merging Two Projects Into One Git Repository"
date = "2025-03-10T20:00:00Z"
year = "2025"
month= "2025-03"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/git-merge.png"
images =['/images/git-merge.png']
tags = ["Git", "Version Control", "Repository Management", "Development", "Tech", "Programming"]
categories = ["tech"]
description = "Learn how to merge two Git repositories into one while preserving commit history with a step-by-step guide."
showFullContent = false
readingTime = true
copyright = false
featured = false
draft = false
aliases = [
    "/merge-two-projects-into-one",
    "/posts/merge-two-projects-into-one",
    "/posts/2025/03/10/merge-two-projects-into-one",
    "/2025/03/10/merge-two-projects-into-one" 
]
+++
Recently, I worked on merging two separate projects into one. Each project had its own Git repository, and I wanted to combine them into a single repository while preserving the commit history.

Initially, I copied the code from one project, pasted it into the other, and committed the changes. If anyone needed information on the original commits, they could look at the original repo. However, it was suggested to me that it was possible to copy over the history of the commits from the original repository.

Let's look at how we can do this.

I will refer to the two repositories as `project1` and `project2`, each with its own Git repository located at `project1Url` and `project2Url`, respectively.


## Step 1: Clone the original repository

First, clone the repository of `project1`:

```bash
git clone project1Url
```

## Step 2: Add the new repository as a remote

Next, add the repository of `project2` as a remote:

```bash
git remote add project2 project2Url
```

## Step 3: Fetch the commits from the new repository

Fetch the commits from the `project2` repository:

```bash
git fetch project2
```

## Step 4: Merge the commits from the new repository

Merge the commits from the `project2` repository into `project1`:

```bash
git merge project2/develop --allow-unrelated-histories
```

## Step 5: Fix merge conflicts

If there are conflicts, you will need to resolve them. In my case, this was mainly build files and scripts in the root of the repository. Most of the important code was in subfolders, so this was minimal.

## Step 6: Push the changes to the original repository

Push the changes to a new branch for review before merging into the main branch:

```bash
git checkout -b feature/merge-project2-into-project1
git push origin feature/merge-project2-into-project1
```

## Step 7: Clean up

Test your code to ensure everything builds and runs as expected now that it is all in one repository. Create a Pull Request and review all the changes to ensure nothing gets changed that shouldn't be.

When you look at your PR, it will look like a lot of code has been added. However, if you look closely at the Git history of those files, you will see that the history has been preserved from the original repository.

## Conclusion

This is a remarkably simple way to preserve the history of commits from one repository to another. It is a great way to merge two projects into one repository and keep the history of the commits. A similar process could be followed if you want to create a new repository and merge other repositories into it.

If you have enjoyed this article and want to get a monthly email with all my latest articles, please sign up for my [newsletter](/newsletter). If you have any questions or comments, please feel free to reach out or leave a comment below.
