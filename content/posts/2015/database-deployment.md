+++
title = "Database Deployment"
date = "2015-03-05T20:00:45Z"
year = "2015"
month= "2015-03"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["Deployment", "Database", "SQL"]
categories = ["tech"]
keywords = ["", ""]
description = "Learn how to safely deploy database changes using SSDT and Visual Studio to minimize risks and ensure smooth production updates."
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/posts/database-deployment",
    "/posts/database-deployment-5331",
    "/posts/2015/03/05/database-deployment-5331",
    "/posts/2015/03/05/database-deployment",
    "/2015/03/05/database-deployment-5331",
    "/2015/03/05/database-deployment"
]
+++
One of my jobs is adding extra features to our internal databases. There is a fair amount of risk in doing this. I could make a change to one of the queries in the database that stops the rest of the company using it as they need to. This could be a costly mistake, almost as bad as the database server being inaccessible.

One way to reduce this risk is to test, test and test the database. First I take a backup of the database and make my changes to that. I can do anything I like to my backup database without worrying that it will affect anyone else. Once I have finished making my changes and I have tested that everything is working exactly as I want, I need to apply my changes to the production database.

Until recently I made a note of every change that I have made and then made the same change to the production database. But what if I forget to apply one of my changes to production, I have a broken database on my hands, disaster!

But there is a better way to track database changes. SSDT or SQL Server Data Tools.

Create a Database project with Visual Studio, you can then point this at your live database. This will scan the database and save scripts for all the Tables, Views, Stored Procedures, Triggers and any other object in the database. This doesn’t import the data, just the structures that contain the data. So no data protection issues or problems because your database is terabytes in size.

Now comes the really cool part, Visual Studio allows you to build a copy of the database from these scripts. All you need to do is edit the scripts and test like you did before. Once you are happy with your changes and everything is working as you want, you can point your visual studio project back at your production database and it will magically deploy all your changes, or if you are as paranoid as me about breaking things, it will create a script that you can thoroughly analyse before running on your production database.

I do not know why I never thought of setting this up until recently, it will reduce the number of times I roll out my changes but forget to setup permissions, (these can be scripted) or forget that tiny change I did weeks ago but never rolled out.

And of course all the changes that you make can be saved in source control, so easy to see what changes have been made and by whom.

This process even works with complicated database structures, in my case I needed to setup three database projects that depend on each other. Dependencies can be setup, and the test databases can even be built with different names for testing on the production server, (although I wouldn’t recommend it!)