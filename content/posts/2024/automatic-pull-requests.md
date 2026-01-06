+++
title = "Automatic Pull Requests"
date = "2024-12-16T20:00:00Z"
year = "2024"
month= "2024-12"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
copyright = false
cover = "/images/automatic-pull-requests.png"
images =['/images/automatic-pull-requests.png']
tags = ["AzureDevOps", "Pull Requests", "Automation", "PowerShell", "CI/CD", "DevOps"]
categories = ["tech"]
description = "Learn how to automate the creation of pull requests in Azure DevOps using PowerShell scripts to streamline your CI/CD workflow."
showFullContent = false
readingTime = true
aliases = [
    "/automatic-pull-requests",
    "/posts/automatic-pull-requests",
    "/posts/2024/12/16/automatic-pull-requests",
    "/2024/12/16/automatic-pull-requests",
]
+++
Creating pull requests is part of the development process when working with version control systems like Git. Pull requests allow developers to propose changes to a codebase and collaborate with team members to review and merge those changes. 

When you have long running branches, it can be challenging to keep them up to date with the main branch. This is where automatic pull requests come in. Automatic pull requests are a way to automate the process of updating long running branches with changes from the main branch. For my example I am going to automate creating PRs (Pull Requests) from the development branch to the main (or master) branch. This means if I update my develop branch with a new feature or bug fix, a PR will be created to merge those changes into the main branch.

I am going to look at two ways of doing this, one for GitHub and one for Azure DevOps.

### GitHub

GitHub Actions are the way to automate tasks in your GitHub repository. You can create workflows that run on specific triggers, such as when a pull request is created or when code is pushed to a specific branch. Create a new GitHub action with the following code in it:

```yml
name: Auto PR
on:
  push:
    branches:
    - develop

jobs:
  create-pr:
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          ref: develop
      - name: create pull request
        run: gh pr create -B main -H develop --title 'Merge develop into main' --body 'Created by GitHub action'
        env:
            GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

This action will run when code is pushed to the develop branch. It will then check out the code from the develop branch and create a pull request to merge the changes into the main (or master) branch. It does have a flaw in that it will generate an error if the PR already exists, but as the PR already exists, it is not a big problem.

This action uses the GitHub CLI to create the PR. For more information on the GitHub CLI, see the [GitHub CLI documentation](https://cli.github.com/). The gh pr create command creates a pull request with the specified title and body. There is also a gh pr edit command, so combining the two could be used to update the PR if it already exists.

```yml
run: gh pr create -B main -H develop --title 'Merge develop into main' --body 'Created by GitHub action' || gh pr edit -B main --title "Merge develop into main" --body 'Created by GitHub action'
```

### Azure DevOps

Azure DevOps has a similar feature to GitHub Actions called Azure Pipelines. You can create pipelines that run on specific triggers, such as when code is pushed to a specific branch. For Azure DevOps I have a powershell scripts that does most of the work, lets have a look at it:

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

This makes use of the Azure DevOps REST API to create a PR. The script takes in the repository name, source branch, target branch, PR title and PR description as parameters. It then checks if there are any changes between the source and target branches, and if there are, it creates a PR. If there is already an active PR between the two branches, it will output the PR ID and not create a new PR. This script can be run as a step in an Azure DevOps pipeline.

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

I only run this step on the develop branch, and you can see I supply all the parameters that are defined in my powershell script. I include the System.AccessToken so the step has permission to do the creation of the PR, and can get details of my Azure DevOps setup and where to make the REST API calls to.