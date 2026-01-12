+++
title = "Weakest Database Design"
date = "2015-04-21T20:00:45Z"
year = "2015"
month= "2015-04"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["Bad Design", "SQL",  "Database Design"]
categories = ["tech"]
keywords = ["", ""]
description =  "Weakest Database Design"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/posts/weakest-database-design",
    "/posts/weakest-database-design-pbp",
    "/posts/2015/04/21/weakest-database-design-pbp",
    "/posts/2015/04/21/weakest-database-design",
    "/2015/04/21/weakest-database-design-pbp",
    "/2015/04/21/weakest-database-design"
]
+++
I have been recently working on a database that hasn’t been designed but has been hacked together by lots of people over the years.

It started life as an Microsoft Access database created by my director to keep track of all the projects that our company does. It was not much more than one table listing everything. At some point the data and frontend was split with the data being stored in SQL Server and the front end being an Microsoft Access ADP.

Over the years more and more columns have been added to this table that it long ago became pretty much unmanageable. A few normalized tables exist but for the most part everything is stored in this one table which makes querying it very difficult. At the last count there were 81 columns in this one database table.

Attempts to improve this database have been tried before but due to the fact that the whole company basically runs off this database and no one person knows everything that the database needs to do causes any changes to be very difficult. I suspect it may be beyond my abilities but I am going to give it a go.

One advantage I have is version control. All the tables and the structure is in version control, so when I break things I can roll them back. Any changes to the front end are also in source control, these are harder to roll back in case of problems but not impossible.

I have met with department heads to try and establish which of the 81 columns are being used and which could be dropped. Database design shouldn’t be a democracy, your databases should be designed in a way to store your data most efficiently. In this case it felt a bit like the database was playing “the weakest link” with everyone voting off unpopular columns. “You are the weakest database column. Goodbye!” After much discussion I have over 30 columns that can be dropped and 10 or so that require further investigation.

Using the Visual Studio project of the database, I removed the columns. This generated thousands of errors as most columns are included in loads of views and stored procedures. All these references need removing, so not a small job. This is made worse by the fact that the views and stored procedures are in a mess, and it is very hard to read the T-SQL code and see what is doing what. Part of my next job is going to be tidying up all these queries so I can see what’s what.

The advantage of using the Visual Studio project to do these changes is that I can generate a SQL script of the changes and I can rerun a few times and test restoring different columns as it is unlikely to be a smooth deployment.