+++
title = "Automating develop to main PRs"
date = "2024-12-16T20:00:00Z"
lastmod = "2026-07-31T20:00:00Z"
year = "2024"
month= "2024-12"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
copyright = false
cover = "/images/automatic-pull-requests.png"
images =['/images/automatic-pull-requests.png']
tags = ["AzureDevOps", "Pull Requests", "Automation", "PowerShell", "CI/CD", "DevOps"]
categories = ["tech"]
description = "Automate develop-to-main pull requests with GitHub Actions (create or update) or an Azure DevOps PowerShell script so release PRs stay open without manual work."
showFullContent = false
readingTime = true
aliases = [
    "/automatic-pull-requests",
    "/posts/automatic-pull-requests",
    "/posts/2024/12/16/automatic-pull-requests",
    "/2024/12/16/automatic-pull-requests",
]
+++
Creating pull requests is part of day-to-day Git work: you propose changes, review them, and merge. Long-lived integration branches make that tedious if someone has to open the release PR by hand every time.

Automatic pull requests keep a develop → main (or master) PR open and refreshed when develop moves. Below are two patterns I use: GitHub Actions with the GitHub CLI, and Azure DevOps with a PowerShell script against the REST API.

## GitHub

GitHub Actions can run whenever code is pushed to `develop`. Prefer **create or update** so a second push does not fail when the PR already exists — the same idea this site uses in [`.github/workflows/auto-pr.yml`](https://github.com/funkysi1701/funkysi1701.github.io/blob/main/.github/workflows/auto-pr.yml):

```yml
name: Auto PR
on:
  push:
    branches:
    - develop
  workflow_dispatch:

permissions:
  contents: read
  pull-requests: write

jobs:
  create-pr:
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          ref: develop
      - name: Create or update pull request
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          TITLE='Merge develop into main'
          BODY='Created by GitHub Actions.'
          if gh pr create -B main -H develop --title "$TITLE" --body "$BODY"; then
            exit 0
          fi
          PR=$(gh pr list --head develop --base main --state open --json number -q '.[0].number')
          if [ -n "$PR" ] && [ "$PR" != "null" ]; then
            gh pr edit "$PR" --title "$TITLE" --body "$BODY"
          else
            echo "No open PR found to update."
            exit 1
          fi
```

This runs on push to `develop`, checks out that branch, then creates a PR into `main` or edits the existing open develop → main PR. Pin `actions/checkout` to a major tag (or a full commit SHA in production workflows) and grant `pull-requests: write`.

The workflow uses the [GitHub CLI](https://cli.github.com/). `gh pr create` opens the PR; `gh pr edit` refreshes title and body when create fails because one already exists. You can also fold create-or-edit into a one-liner if you prefer:

```yml
run: gh pr create -B main -H develop --title 'Merge develop into main' --body 'Created by GitHub action' || gh pr edit -B main --title "Merge develop into main" --body 'Created by GitHub action'
```

## Azure DevOps

Azure DevOps has a similar feature to GitHub Actions called Azure Pipelines. You can create pipelines that run on specific triggers, such as when code is pushed to a specific branch. For Azure DevOps I have a PowerShell script that does most of the work; let’s have a look at it:

```powershell
param (
    [Parameter(Mandatory=$true)][string]$repoName,
    [Parameter(Mandatory=$true)][string]$sourceBranch,
    [Parameter(Mandatory=$true)][string]$targetBranch,
    [Parameter(Mandatory=$true)][string]$prTitle,
    [Parameter(Mandatory=$true)][string]$prDescription
)

# Construct base URLs
$collectionUri = $env:SYSTEM_TEAMFOUNDATIONCOLLECTIONURI.TrimEnd('/')
$projectName = $env:SYSTEM_TEAMPROJECT
$apisUrl = "$collectionUri/$projectName/_apis"
$apiVersionQs = "?api-version=7.0"

# Create common headers
$headers = @{
    "Authorization" = "Bearer $env:SYSTEM_ACCESSTOKEN"
    "Content-Type"  = "application/json"
}

# Step 1: Fetch the repository GUID using its name
$repositoryUrl = "$apisUrl/git/repositories/$repoName$apiVersionQs"
$repositoryResponse = Invoke-RestMethod -Uri $repositoryUrl -Method GET -Headers $headers
$repoGuid = $repositoryResponse.id  # Extract the repository GUID

if (-not $repoGuid) {
    throw "Failed to retrieve repository GUID for repository '$repoName'"
}

# Now construct the project URL using the repository GUID
$projectUrl = "$apisUrl/git/repositories/$repoGuid"

# Construct full ref names
$sourceBranchRef = "refs/heads/$sourceBranch"
$targetBranchRef = "refs/heads/$targetBranch"

# Step 2: Prepare the body for the commit comparison using GetCommitsBatch API
$body = @{
    "itemVersion" = @{
        "version" = "$targetBranch"
        "versionType" = "branch"
    }
    "compareVersion" = @{
        "version" = "$sourceBranch"
        "versionType" = "branch"
    }
} | ConvertTo-Json

# Step 3: Call the Azure DevOps API to compare the branches using GetCommitsBatch
$diffUrl = "$projectUrl/commitsBatch$apiVersionQs"
$commitResponse = Invoke-RestMethod -Uri $diffUrl -Method POST -Headers $headers -Body $body

# Step 4: Check if there are any changes between the branches
if ($commitResponse.count -gt 0) {
    Write-Output "There are changes between $sourceBranch and $targetBranch."
} else {
    Write-Output "No changes between $sourceBranch and $targetBranch."
    return
}

# Check for existing active pull requests between source and target branches
$encodedSourceBranchRef = [System.Web.HttpUtility]::UrlEncode($sourceBranchRef)
$encodedTargetBranchRef = [System.Web.HttpUtility]::UrlEncode($targetBranchRef)
$checkPrUrl = "$projectUrl/pullrequests$apiVersionQs&searchCriteria.sourceRefName=$encodedSourceBranchRef&searchCriteria.targetRefName=$encodedTargetBranchRef&searchCriteria.status=active"
Write-Output "Checking for existing active pull requests between $sourceBranch and $targetBranch"
$existingPrs = Invoke-RestMethod -Method GET -Headers $headers -Uri $checkPrUrl
if ($existingPrs.count -gt 0) {
    # An active pull request already exists
    $existingPr = $existingPrs.value[0] # Assuming we take the first one if multiple exist
    $pullRequestId = $existingPr.pullRequestId
    Write-Output "An active pull request already exists between $sourceBranch and $targetBranch."
    Write-Output "Pull Request ID: $pullRequestId"
    Write-Output "##vso[task.setvariable variable=prId]$pullRequestId"    
    return 
}

# Create a Pull Request
$pullRequestUrl = "$projectUrl/pullrequests$apiVersionQs"
$pullRequest = @{
    "sourceRefName" = "$sourceBranchRef"
    "targetRefName" = "$targetBranchRef"
    "title"         = "$prTitle"
    "description"   = "$prDescription"
}

$pullRequestJson = ($pullRequest | ConvertTo-Json -Depth 5)

Write-Output "Sending a REST call to create a new pull request from $sourceBranch to $targetBranch"

# REST call to create a Pull Request
$pullRequestResult = Invoke-RestMethod -Method POST -Headers $headers -Body $pullRequestJson -Uri $pullRequestUrl

# Ensure the pull request ID exists
if (-not $pullRequestResult.pullRequestId) {
    throw "Pull request creation failed. No pull request ID returned."
}

$pullRequestId = $pullRequestResult.pullRequestId
Write-Output "Pull request created. Pull Request Id: $pullRequestId"
Write-Output "##vso[task.setvariable variable=prId]$pullRequestId"

```

This uses the Azure DevOps REST API to create a PR. The script takes the repository name, source branch, target branch, PR title, and PR description. It compares the branches, creates a PR when there are commits to merge, and reuses an existing active PR when one is already open. Run it as a pipeline step.

My pipeline has a step that looks a bit like:

```yml
  - task: PowerShell@2
    displayName: Create PR
    condition: eq(variables['Build.SourceBranch'], 'refs/heads/develop')
    inputs:
      targetType: 'inline'
      script: 'build/CreatePR.ps1 -repoName ProjectX -sourceBranch develop -targetBranch main -prTitle "Release $(Build.Number.Major).$(Build.Number.Minor).x" -prDescription "Dev to Prod"'
    env:
      SYSTEM_ACCESSTOKEN: $(System.AccessToken)
```

I only run this step on the develop branch, and you can see I supply all the parameters that are defined in my PowerShell script. I include the `System.AccessToken` so the step can call the REST APIs for the project.

### Related on this blog

For combining repositories before you automate promotion, see [merge two projects into one](/posts/2025/merge-two-projects-into-one/). For a broader GitHub Actions walkthrough, start with [using GitHub Actions](/posts/2022/using-github-actions/).

If you have enjoyed this article and want to get a monthly email with all my latest articles, please sign up for my [newsletter](/newsletter). If you have any questions or comments, please feel free to reach out or leave a comment below.
