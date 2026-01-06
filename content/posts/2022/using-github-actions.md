+++
title = "Using GitHub Actions"
date = "2022-01-10T20:00:45Z"
year = "2022"
month= "2022-01"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/2022/using-github-actions-banner.png"
images = ['/images/2022/using-github-actions-banner.png']
tags = ["GitHub", "DevOps"]
categories = ["tech"]
keywords = ["", ""]
description = "Using a GitHub Actions pipeline to deploy my Azure Static Web App"
showFullContent = false
readingTime = true
copyright = false
draft = false
aliases = [
    "/using-github-actions-3jo1",
    "/posts/using-github-actions/",
    "/posts/using-github-actions-3jo1",
    "/posts/2022/01/10/using-github-actions-3jo1",
    "/posts/2022/01/10/using-github-actions",
    "/2022/01/10/using-github-actions-3jo1",
    "/2022/01/10/using-github-actions",
]
+++

I've been running my website on Azure Static Web Apps for a while and it is pretty cool.

When you create a Static Web App on Azure you get asked for the github repo of your source code and even the branch to use.
![GitHub Repo for my Static Web App](/images/2022/static-web-app-github-repo.png)

Once you have selected this, you get asked for the type of code to deploy, mine is Blazor Web Assembly but you can use Angular, React or Vue.

![GitHub Actions workflow creation](/images/2022/github-actions-workflow-creation.png)
You now have three variables to fill in the location in your code of the Website, the location of your Azure Functions and the output location usually wwwroot. Once you have set these three you can preview the GitHub Actions file that will be created and added to your repository.

I get something like this

```
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - feature/tempbranch
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - feature/tempbranch

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v2
        with:
          submodules: true
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_<GENERATED_HOSTNAME> }}
          repo_token: ${{ secrets.GITHUB_TOKEN }} # Used for Github integrations (i.e. PR comments)
          action: "upload"
          ###### Repository/Build Configurations - These values can be configured to match your app requirements. ######
          # For more information regarding Static Web App workflow configurations, please visit: https://aka.ms/swaworkflowconfig
          app_location: "Client" # App source code path
          api_location: "Api" # Api source code path - optional
          output_location: "wwwroot" # Built app content directory - optional
          ###### End of Repository/Build Configurations ######

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        id: closepullrequest
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_<GENERATED_HOSTNAME> }}
          action: "close"
 
```
This github action will run when you create a Pull Request to the branch mentioned in the file, or if you push code into the branch. This code get added into the .github/workflows/ folder and is the location that all github action workflows live. 

I haven't done much with github actions, however I have used Azure DevOps quite a bit. Over on the Azure DevOps side I have created a pipeline that deploys to a Dev environment, then a Test environment and finally a production environment.

Lets have a look at the workflow that I ended up with and with can break down how it all works. Note I am new to Github actions so if there is a better way of doing this do let me know.

```
name: Azure Static Web Apps

on:
  push:
    branches:
      - main
      - develop
      - feature/*

jobs:
  dev:
    runs-on: ubuntu-latest
    environment: 
      name: Dev
    name: Dev
    steps:
      - uses: actions/checkout@v2
        with:
          submodules: true
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_<GENERATED_HOSTNAME>  }}
          repo_token: ${{ secrets.GITHUB_TOKEN }} # Used for Github integrations (i.e. PR comments)
          action: "upload"
          ###### Repository/Build Configurations - These values can be configured to match your app requirements. ######
          # For more information regarding Static Web App workflow configurations, please visit: https://aka.ms/swaworkflowconfig
          app_location: "Blog" # App source code path
          api_location: "Blog.Func" # Api source code path - optional
          output_location: "wwwroot" # Built app content directory - optional
          ###### End of Repository/Build Configurations ######
  test:
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    environment: 
      name: Test
    name: Test
    steps:
      - uses: actions/checkout@v2
        with:
          submodules: true
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_<GENERATED_HOSTNAME>  }}
          repo_token: ${{ secrets.GITHUB_TOKEN }} # Used for Github integrations (i.e. PR comments)
          action: "upload"
          ###### Repository/Build Configurations - These values can be configured to match your app requirements. ######
          # For more information regarding Static Web App workflow configurations, please visit: https://aka.ms/swaworkflowconfig
          app_location: "Blog" # App source code path
          api_location: "Blog.Func" # Api source code path - optional
          output_location: "wwwroot" # Built app content directory - optional
          ###### End of Repository/Build Configurations ######
  prod:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: 
      name: Prod
    name: Prod
    steps:
      - uses: actions/checkout@v2
        with:
          submodules: true
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_<GENERATED_HOSTNAME> }}
          repo_token: ${{ secrets.GITHUB_TOKEN }} # Used for Github integrations (i.e. PR comments)
          action: "upload"
          ###### Repository/Build Configurations - These values can be configured to match your app requirements. ######
          # For more information regarding Static Web App workflow configurations, please visit: https://aka.ms/swaworkflowconfig
          app_location: "Blog" # App source code path
          api_location: "Blog.Func" # Api source code path - optional
          output_location: "wwwroot" # Built app content directory - optional
          ###### End of Repository/Build Configurations ######     
```

The first thing I did was create three Azure Static Web Apps, I am using the free tier so while this is tripling my costs it is all still free! Doing this created three github action workflow files, I deleted two and edited the third, but before I deleted them I made a note of the AZURE_STATIC_WEB_APPS_API_TOKEN. If you look in your settings -> secrets for your repo you will see secrets have been created, this is the secure token that github uses to update your static web app.

While we are in settings we might as well look at environments. I created a Prod, Test and Dev environment that I was going to use in my github actions.

Environments can have various rules setup on them.

* Required reviewers - this is like an approver, a user specified here must approve for the workflow to be deployed
* Wait time - I didn't use this, but it looks like a certain amount of time can be set to pause the deployment. (I assume to do some kind of manual check)
* Deployment Branch - specify what branch are allowed to be deployed to what environments. I specified develop, main and feature branches could be deployed to the Dev environment, develop and main could go on Test and main could go on Prod 
* Environment secrets - I didn't use this as my secrets were already created, however it looks like your secrets can be associated with a specific environment

Now that we have the static web apps setup and the environments lets look at the github action file.

First of all I removed the PR stuff and just concentrated on pushes. I wanted my workflow to be.

1. Push to feature branch
2. Deploys to Dev env
3. PR feature branch to develop
4. Once merged code gets pushed into develop
5. Deploys to Test env
6. PR develop to main
7. Once merged code gets pushed into main
8. Deploys to Prod env (after approval)

The approval on deploying to production I think is probably overkill, but I still have it setup like that for now.

My gh action has three jobs defined as dev: test: and prod: they are all the same except they have the azure_static_web_apps_api_token that is correct for their environment.

They also each have a environment defined eg

```
environment:
  name: Prod
```

Lastly Test and Prod have an if test setup, if the test is false the job won't run. Importantly it won't fail it just won't run.

For Prod this needs to only run on main branch so we have

if: github.ref == 'refs/heads/main'

For Test this needs to only run on develop so

if: github.ref == 'refs/heads/develop'

I could have a test for develop to only run on feature/* but I have allowed it to run every time.

There is loads more you can do with github actions, but hopefully this gives you a taste of some of the things you can do. I currently have a mix of Azure DevOps and github actions so I will be working on getting github actions to do more.
