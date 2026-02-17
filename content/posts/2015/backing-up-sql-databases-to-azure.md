+++
title = "Backing up SQL databases to Azure"
date = "2015-10-15T20:00:45Z"
year = "2015"
month= "2015-10"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["DevOps", "Backups", "Azure", "SQL"]
categories = ["tech"]
keywords = ["", ""]
description = "Learn how to back up SQL databases to Azure using various methods, including PowerShell scripting for automated backups."
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/posts/backing-up-sql-databases-to-azure",
    "/posts/backing-up-sql-databases-to-azure-noe",
    "/posts/2015/10/15/backing-up-sql-databases-to-azure-noe",
    "/posts/2015/10/15/backing-up-sql-databases-to-azure",
    "/2015/10/15/backing-up-sql-databases-to-azure-noe",
    "/2015/10/15/backing-up-sql-databases-to-azure"
]
+++
I recently read a blog post by [Pinal Dave](https://blog.sqlauthority.com/2015/10/06/sql-server-steps-to-backup-to-windows-azure-storage/) about how you can backup straight to Azure Storage. The procedure he described is only available for SQL Server 2014 or later.

I won’t go into detail of this method as Pinal describes it better than I can, but the basic of it requires setting up credentials and then running a backup command that includes the URL of the storage container on Azure.

Unfortunately I am running SQL Server 2005 so this process will not work for me but it did start me thinking of what ways there might be for me to use.

The next thing I tried was [Microsoft SQL Server Backup to Microsoft Azure Tool](https://www.microsoft.com/en-us/download/details.aspx?id=40740&WT.mc_id=Blog_SQL_Announce_DI). Unfortunately I did not get this tool to work correctly on my setup. However it sounds like a flexible tool that allows compression and encryption of your backup files. This tool redirects your backup files to your Azure Storage so even if I had got it to work correctly it would not have been an ideal solution as I want local copies of my backup files as well.

After this I started to look at powershell again. Following on from my recent success with [powershell](https://www.funkysi1701.com/2015/10/01/copying-settings-to-an-azure-website/) I know how to connect to my Azure account so all I needed to script was copying a file from my server to Azure.

```
Get-ChildItem *.bak -File -Recurse | Set-AzureStorageBlobContent -Container $DestContainer -Force
```
This command gets all the backup files in a directory (the recurse switch looks in sub directories as well) and then pipes them to the Set-AzureStorageBlobContent command. This command uploads them to the storage container defined in $DestContainer. I have added the Force switch so that it will replace any files on Azure which have the same name.

I have only been using this script for the last few days but so far it has been working well. Now if I completely loose all data from the office I can restore from any other location using the data saved on Azure. A great improvement to my disaster recovery policy.
