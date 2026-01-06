+++
title = "SQL Transaction Log Backups"
date = "2016-02-04T20:00:45Z"
year = "2016"
month= "2016-02"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["Database", "SQL",  "Backups"]
categories = ["tech"]
keywords = ["", ""]
description =  "SQL Transaction Log Backups"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/sql-transaction-log-backups-14em",
    "/posts/transaction-log-backups",
    "/posts/sql-transaction-log-backups-14em",
    "/posts/2016/02/04/sql-transaction-log-backups-14em",
    "/posts/2016/02/04/transaction-log-backups",
    "/2016/02/04/sql-transaction-log-backups-14em",
    "/2016/02/04/transaction-log-backups"
]
+++
Like many DBAs I spend a lot of time maintaining my SQL Server backups.

From SQL Server I maintain both full backups and transaction log backups. I have often restored my full backups but until recently I have never restored a transaction log backup. All backup strategy’s are only as good as the last time you tested the restore process.

## So what is a transaction log backup?

A transaction log backup contains all the transaction log records generated since the last full backup and is used to allow the database to be recovered to a specific point in time (usually the time right before a disaster strikes).  Since these are incremental, if you want to restore the database to a particular point in time, you need to have all the transaction log records necessary to replay database changes up to that point in time.

## How to do the restore.

First right click on Databases in SQL Management Studio and select restore database. You should then get a screen similar to this.

![](/images/2016/restore1.jpg)

In source click the ... to allow you to select your backup files.

Now normally I have only ever selected one file here, the *.bak file. Instead select the *.bak and all the *.trn files as well. After SQL Server has chugged for a few minutes (time will depend on number of transaction files and server/disk speed etc) the restore plan section should fill up with files.

In the destination database box, type in the name of the database you want to restore. I recommend using a different name to avoid overwriting the original database, appending Test or a datetime to the name is what I usually do.

On my test server I need to untick the take tail-log backups option off the options screen before I can execute the restore.

Now you can either check the tick boxes in the restore plan section or (more fun) click the timeline button to select at what point in time you want to restore to.

![](/images/2016/restore2.jpg)

You can either select the point in time with your mouse or specify the exact point in the time textbox. Alternatively you can just select the most recent point, probably the most likely option when disaster strikes.

Now that I have tried doing this on my test server I feel much more confident that when disaster does strike I can get things restored quickly and painlessly.

## How often should you run transaction backups?

The answer to this question depends on how critical your data is. Until very recently I ran mine ever 15 minutes, I have increased this to every 5 minutes, but I have seen recommendations of running it [every minute](https://www.brentozar.com/archive/2014/02/back-transaction-logs-every-minute-yes-really/). The more critical your data the more often you should run them.