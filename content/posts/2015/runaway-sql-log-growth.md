+++
title = "Runaway SQL Log growth"
date = "2015-06-12T20:00:45Z"
year = "2015"
month= "2015-06"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["ITAdmin", "Backups", "SQL"]
categories = ["tech"]
keywords = ["", ""]
description = "Runaway SQL Log growth"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/posts/runaway-sql-log-growth",
    "/posts/runaway-sql-log-growth-10ip",
    "/posts/2015/06/12/runaway-sql-log-growth-10ip",
    "/posts/2015/06/12/runaway-sql-log-growth",
    "/2015/06/12/runaway-sql-log-growth-10ip",
    "/2015/06/12/runaway-sql-log-growth"
]
+++

Today is my day off, but I wake up and have a quick look at [nagios](https://www.funkysi1701.com/posts/i-love-nagios/) to see if there is anything I need to worry about. Yes there is, SQL Server has run out of disk space on its data disk.

I race downstairs and VPN onto the server to find out what has happened. One of my monitoring databases has had runaway log growth and is over 80Gb is size.

```sql
BACKUP LOG [DBName] WITH TRUNCATE_ONLY  
DBCC SHRINKFILE('DBName_Log')
```
Free disk space is back to normal, all users will be unaware of the problem and everything is fine again. I create a daily job that runs the above code, that way it should stay a manageable size.

Next I need to find out why it happened and to prevent it happening again in the future (Next time I have a day off I want to lie in!)

I check the SQL logs and notice

BACKUP LOG WITH TRUNCATE_ONLY or WITH NO_LOG is deprecated. The simple recovery model should be used to automatically truncate the transaction log.

Then I remember what I have done to cause this issue. I have a separate disk for my backup files and earlier in the week I noticed this disk was filling up, a large amount of space was taken up by transactional backup files. I thought I don’t need to backup the transactions for this non critical database, I will just do a full backup at the start of everyday.

However what I forgot is that a transactional backup keeps the log file under control, once this backup was stopped the log file grew uncontrollably. The answer, change the database from FULL mode to SIMPLE. ![image002](/images/2015/image002-300x270.png)

This is my understanding of how backups work in FULL mode. A full backup is done at the start of the day which resets the log file, then changes in the database are stored in the log file, this is backed up into a transactional backup and the log file gets reset. If you have regular transactional backups throughout the day the log file doesn’t grow too much, however with no transactional backups your log file contains an entire days worth of changes and so for a monitoring database this could be quite large.

In SIMPLE mode you can’t do transactional backups and the log doesn’t grow uncontrollably. This shouldn’t be used for production databases as if there is a problem you could loose data.
