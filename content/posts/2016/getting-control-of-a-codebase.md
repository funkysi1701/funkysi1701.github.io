+++
title = "Getting control of a codebase"
date = "2016-11-17T20:00:45Z"
year = "2016"
month= "2016-11"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["Javascript", "AzureDevOps","SQL","Visual Studio",  "C-Sharp"]
categories = ["tech"]
keywords = ["", ""]
description =  "Getting control of a codebase"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/getting-control-of-a-codebase-1bci",
    "/posts/getting-control-of-a-codebase",
    "/posts/getting-control-of-a-codebase-1bci",
    "/posts/2016/11/17/getting-control-of-a-codebase-1bci",
    "/posts/2016/11/17/getting-control-of-a-codebase",
    "/2016/11/17/getting-control-of-a-codebase-1bci",
    "/2016/11/17/getting-control-of-a-codebase"
]
+++
So recently I started working on a new codebase. I will be honest when I first saw it, it was a mess. Here are a few of the things I did to try and regain control.

I was given access to the source code on Visual Studio Team Services. However this consisted of a single commit 3 months ago. When I looked at what was running on the production server it was clear that changes were being made live with no regard for source control.

The first thing I did was commit everything that was running live into source control.

Next I created a SQL Server Data Tools (SSDT) project to keep track of all the database objects. Previously there was a folder with some stored procedures in it, but these did not match with what was currently running.

![SQL Server 2012 Management Studio Splash Screen](/images/2016/sql-server-2012-management-studio-splash-screen.png)

I now had in source control the current state of the website and the database, so I knew I could get things back to this state if I made some bad changes.

Lets start by looking at the website code I had. There was no solution file, the only way to look at the website was to setup my local IIS to run what was in the website folder. I could then use Visual Studio to "open" my local IIS website and attach to process to debug it.

Next I Looked at Default.aspx to see how the website worked. The majority of the website code was stored in the database stored procedures. After the tag there was a <% %> which contained a Response.Write(RunSP.RunStoredProcedure(Parameter1, Parameter2, ...) command, which executed a stored procedure and the results of the stored procedure was the html code including any javascript that the webpage needed to display. I will be honest I have never seen any code like it. My guess is that the developer was secretly a DBA and wanted to make any web page changes by just changing how the stored procedures work.

This meant that the website is not going to do anything without a backup of the database running, and meant my SSDT project was going to be vital. However the database was in a bad state, it consisted of a fair few broken objects and SSDT would not build.

Using find I went through each of the broken database objects to find where in the code they were being used. Luckily most were referenced in commented out code, so I just removed all the broken database objects. The database could now be built. However there was a dependency on the users table of another database. (This was the developers solution to sharing logins between websites) As I was using SSDT I added a database dependency, problem solved for now.

Next I tried publishing my database. SQL CMD encountered a parsing error.  The reason for this was my SPs contained javascript eg $(document), SQL CMD uses $(DatabaseName) as variables for different database so it was getting itself confused.

My solution was to use Find and Replace to replace all the $ with ' + CHAR(36) + '

So I now have a SSDT project that builds and publishes but still no website project.

To get the website running from Visual Studio I started off creating a .Net 4 website project and added Entity Framework 5 and MVC 3 via nuget. I then copied all the website code into the new project, and with a bit of work I got it to build. Most of the work was relating to namespaces and referencing the correct one and moving the EF model from AppCode to a custom named folder. A bit of trial and error later I had a version of the website that could be run from Visual Studio.

I have not deployed my new version of the website as it needs further testing. No automated testing or even a smoke test checklist currently exist.

![](/images/2016/Visual-Studio-Team-Services.png)

As my source code is hosted on Visual Studio Team Services (VSTS), I can get VSTS to build each commit and check I haven’t broken the build. This is not that helpful at the moment, hopefully one day I will have automated tests that can be run here as well.

Wow, I feel like I have done loads with this code so far but there is loads more still to do. I need to understand more about the business processes behind the code with a hope to understand why some architectural decisions have been made. I want to refactor the code as much as is possible, I would like to remove much of the html/javascript from the stored procedures as I can’t see that there is any advantage to running a website like this. Please correct my if I am wrong.