+++
title = "Merge two Git projects, keep history"
date = "2025-03-10T20:00:00Z"
lastmod = "2026-07-31T20:00:00Z"
year = "2025"
month= "2025-03"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/git-merge.png"
images =['/images/git-merge.png']
tags = ["Git", "Version Control", "Repository Management", "Development", "Tech", "Programming"]
categories = ["tech"]
description = "Merge two separate Git repositories into one while preserving full commit history — clone, remote, fetch, allow-unrelated-histories, then review via PR."
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
I needed to merge two separate projects into one repository while keeping the full commit history from both sides. Copy-paste would have worked for the files, but history would have stayed trapped in the old remotes.

This approach adds the second repo as a remote, fetches it, and merges with `--allow-unrelated-histories` so Git keeps both lineages. I still refer to the repos as `project1` and `project2`, with remotes at `project1Url` and `project2Url`.

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

Merge the commits from the `project2` repository into `project1`. Point at the branch that holds the code you want (often `main` or `develop`):

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

Test your code to ensure everything builds and runs as expected now that it is all in one repository. Create a pull request and review all the changes to ensure nothing gets changed that shouldn't be.

When you look at your PR, it will look like a lot of code has been added. However, if you look closely at the Git history of those files, you will see that the history has been preserved from the original repository. You can remove the temporary `project2` remote once you no longer need it (`git remote remove project2`).

## Conclusion

This is still one of the simplest ways to combine two codebases without throwing away history. Use it when consolidating services or folding a spike repo into the main project; open a PR so reviewers can see the merge conflicts and folder layout before it lands on the default branch.

### Related on this blog

Once the histories live in one repo, automated promotion helps: see [automatic pull requests](/posts/2024/automatic-pull-requests/) for GitHub Actions and Azure DevOps patterns, and [using GitHub Actions](/posts/2022/using-github-actions/) if you are wiring CI around the merge.

If you have enjoyed this article and want to get a monthly email with all my latest articles, please sign up for my [newsletter](/newsletter). If you have any questions or comments, please feel free to reach out or leave a comment below.
