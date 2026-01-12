+++
title = "Revisiting Team City"
date = "2016-03-24T20:00:45Z"
year = "2016"
month= "2016-03"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["CI",  "DevOps", "Source Control" ]
categories = ["tech"]
keywords = ["", ""]
description =  "Revisiting Team City"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/revisiting-team-city-61o",
    "/posts/revisiting-teamcity",
    "/posts/revisiting-team-city-61o",
    "/posts/2016/03/24/revisiting-team-city-61o",
    "/posts/2016/03/24/revisiting-teamcity",
    "/2016/03/24/revisiting-team-city-61o",
    "/2016/03/24/revisiting-teamcity"
]
+++
Last year I blogged about [Team City](https://www.funkysi1701.com/2015/04/01/teamcity/), well I have been looking at it again recently. In that time they have even changed their logo!

Lets start with thinking about what I want my Continuous Integration server to do.

1. Check out my code from source control (usually master but all feature branches would be even better)
2. Configure specific setting for build
3. Build my code
4. Build my databases
5. Run any unit tests
6. (Optional) Run deployment to Azure Test/Live site

There are probably other things I want to achieve but I will start with these six.

1. Checking out code from source control is something Team City does out of the box, so I can safely say I have done this now. It even monitors a branch for changes and initiates a new check out.
2. Team City allows you to create specific build steps so in theory you can have multiple builds for every variation of settings that you want for your code. I have not tried this yet apart from building with the default config, but I don’t expect it will be too difficult.
3. I have managed to get my code to build with Team City, it took a bit of tweaking the different build steps but wasn’t too difficult. Team City has a visual studio build agent which takes you solution file and does what it needs to. The one problem I have found with this step is that I get errors with my tests if I select a Debug config instead of Release.
4. Databases are always the problem part of the deployment. So far I have manually deployed my databases but I intend on revisit this step. A [stackoverflow](https://stackoverflow.com/questions/21555038/how-can-i-execute-sql-scripts-using-teamcity) post suggests that I can run SQL code via Team City in the following way by creating a command line executable:

```bash
Command executable: c:\Program Files\Microsoft SQL Server\100\Tools\Binn\sqlcmd.exe
Command parameters: -S [ServerName] -i [PathToSQLScript]
```

I have yet to try this but I am hopefully that it will just work. Dropping a database and restoring a back and then running different SQL scripts is all possible from TSQL, so I should be OK. Watch this space for more details.

5. Running the unit tests got me stuck for a while. I tried setting it up using VSTest or MSTest neither worked mainly because a config file wasn’t being copied with the test binaries. When I tried using NUnit it just worked. The tests that failed gave me a few config settings to change.
6. I have powershell scripts that deploy to Azure websites, I think that these could form the basis of a deployment to Azure. Again the difficult step here may end up being deploying all the different databases to Azure. This is also the riskiest step as I need to connect to live servers which is why I will leave this to last, at the very least I could generate scripts that do a full deployment.

That’s it for now. Once I have this all working I will revisit again with details of the database steps as I am expecting a few challenges to overcome. What have you used a CI Server for? Are there other things I want to achieve from a project like this? Why not contact me or leave a comment below