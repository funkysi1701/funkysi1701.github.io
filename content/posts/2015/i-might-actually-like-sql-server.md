+++
title = "I might actually like SQL Server"
date = "2015-04-23T20:00:45Z"
year = "2015"
month= "2015-04"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/2015/download.jpg"
images = ['/images/2015/download.jpg']
tags = ["Learning", "SQL"]
categories = ["tech"]
keywords = ["", ""]
description =  "I might actually like SQL Server"
showFullContent = false
readingTime = true
copyright = false
draft = false
aliases = [
    "/posts/i-might-actually-like-sql-serveri-might-actually-like-sql-server",
    "/posts/i-might-actually-like-sql-server-34j0",
    "/posts/2015/04/23/i-might-actually-like-sql-server-34j0",
    "/posts/2015/04/23/i-might-actually-like-sql-server",
    "/2015/04/23/i-might-actually-like-sql-server-34j0",
    "/2015/04/23/i-might-actually-like-sql-server"
]
+++
How did this happen I think I may actually like SQL Server now?

![](/images/2015/download.jpg)

I remember a few years back when I used to grumble about writing a SQL query that included a JOIN. For some reason back then I could never get my head around JOINs.

Today is a totally different story. I wrote a deployment script that did the following:

1) dropped a database,
2) restored a database from a backup file,
3) Created a database table,
4) copied the contents of a table into this table,
5) disabled and re-enabled some triggers,
6) dropped some constraints and columns from a table
7) and renamed some columns.

It’s not like I woke up this morning with SQL Server knowledge. For many years I have been adding extra features and changing functionality to our line of business database and over time my SQL confidence has grown.

For every single one of the steps above I googled and looked up the SQL syntax (every time I write an insert or update statement I look up the syntax, one day it will stick in my brain!) I think the main reason is once you have used SQL for a while you get to see how it works and can split it down into small steps.

As I [blogged](https://www.funkysi1701.com/2015/04/21/weakest-database-design/) the other day I am currently working on improving a bad database and today I wanted to test the deployment process. All my changes are in a SSDT project so I took a backup of my database and tried to publish.

Error! Your changes will result in data loss, no surprises there as I was expecting that error. The main culprit for this was a trigger I wrote but I didn’t find that out until the end of the day.

As I was working on a backup I could do what I like including destructive changes. I tried creating a pre deployment script. I thought if that runs first, I can persuade SSDT that it matches SQL Server and therefore no data is being lost.

This didn’t work, but I had created the start of my script mentioned above. I had steps 3 and 4. Lets try running my script first and then try running the deployment of my SSDT project. To get this to work I am going to have to rebuild my database a few times, I did this manually with SQL Management studio a couple of times until I thought, I could add this to my script – that’s step 1 and 2 done.

Then I got some errors about triggers so I tried disabling them and re-enabling them after it had finished. That’s step 5.

Finally I needed to drop some columns, this resulted in an error about a constraint. A few trial and error run through’s to find out which constraints I needed to drop and then I could drop the columns.

The last step was to rename some columns. I thought after this I can run publish from visual studio. No it still complained about data loss. I dropped another trigger and then I could run everything without any errors.

Wohoo! Aren’t I clever. A simplified version of my code is below

```sql
USE master -–can’t drop the database if its open!
–-Step 1
DROP DATABASE DBName

–-Step 2
RESTORE DATABASE DBName FROM DISK=’E:\DBName.bak’
WITH
MOVE ‘DBName_dat’ TO ‘C:\Program Files (x86)\Microsoft SQL Server\MSSQL12.MSSQLSERVER\MSSQL\DATA\DBName.mdf’,
MOVE ‘DBName_log’ TO ‘C:\Program Files (x86)\Microsoft SQL Server\MSSQL12.MSSQLSERVER\MSSQL\DATA\DBName.ldf’,
REPLACE,
STATS=10
USE DBName –-swap back to the database you just restored

–-Step 3
CREATE TABLE TName2 (
ID INT NOT NULL,
Name NVARCHAR(50) NOT NULL,
Address NVARCHAR(50) NOT NULL,
City NVARCHAR(50) NOT NULL,
Postcode NVARCHAR(50) NOT NULL)

-–Step 5
DISABLE TRIGGER TR_Trigger ON TName1
GO

–-Step 4
INSERT INTO TName2 (Id,Name)
SELECT Id, Name FROM TName1
GO

–-Step 6
ALTER TABLE TName1
DROP CONSTRAINT [DF_Id], [DF_Name]
GO
ALTER TABLE TName1
DROP COLUMN Id, Name
GO

–-Step 7
sp_RENAME ‘TName1.City’, ‘Area’ , ‘COLUMN’
GO

–-drop that last trigger
DROP TRIGGER TR_Trigger2
GO

–-Step 5
ENABLE TRIGGER TR_Trigger ON TName1
```
