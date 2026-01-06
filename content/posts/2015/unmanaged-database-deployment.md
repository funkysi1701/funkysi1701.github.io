+++
title = "Unmanaged Database Deployment"
date = "2015-09-10T20:00:45Z"
year = "2015"
month= "2015-09"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/2015/09/deploy.jpg"
images = ['/images/2015/09/deploy.jpg']
tags = ["SQL",  "Backups", "Deployment"]
categories = ["tech"]
keywords = ["", ""]
description =  "Unmanaged Database Deployment"
showFullContent = false
readingTime = true
copyright = false
draft = false
aliases = [
    "/posts/unmanaged-database-deployment",
    "/posts/unmanaged-database-deployment-5edl",
    "/posts/2015/09/10/unmanaged-database-deployment-5edl",
    "/posts/2015/09/10/unmanaged-database-deployment",
    "/2015/09/10/unmanaged-database-deployment-5edl",
    "/2015/09/10/unmanaged-database-deployment"
]
+++

For the past few months I have been deploying changes to my companies database every couple of weeks or so. Over a weekend when the database was not being used I would make a backup of the database, load up visual studio, deploy the database changes and copy a couple of front-end files.

My weekends and evenings have recently become a bit more precious to me since the arrival of my son James. At suitable times to run the database upgrade I am either, asleep, about to fall asleep or be spending time with James.

This entire deployment can be set to run at a time of my choosing using SQL Server Jobs, (not sure why I never thought of doing this before). I still need to check everything is working after it has run. The job can send me an email if it encounters any problems so I can still ensure the company has the minimum of problems but has more frequent changes.

## Unmanaged Database Deployment

OK so what do I need to do to set this up.

![](/images/2015/09/deploy.jpg)

1. Test all your code changes are working correctly on a backup of the database and everything is committed to source control.
2. Backup everything that is going to be changed so it can be rolled back in case of a problem. I don’t rely on the daily backup jobs for this, I do my own. Maybe I am a bit paranoid, or maybe I am just being cautious.

```sql
BACKUP DATABASE DBName TO DISK='E:\SQL Backups\Filename.bak'
```

I would include in the backup file name the date and time of the deployment for easy reference later on. For the front-end files these are backed up daily and only ever change during a deployment so I am going to rely on the day to day backups, plus they are in source control so in a worse case scenario I can look there.

3. From Visual Studio create a deployment script using the publish option and save as a file on your database server.
4. Create a SQL Server Job and give it a descriptive name.
5. In steps create a step called backup and enter the T-SQL code above. Set this to stop on failure and continue on success.
6. Create a second step called upgrade of type operating system with the following code.

```
sqlcmd -S (local) -i "E:\SQL Backups\deploy_test.sql"
```

The -S parameter is the name of your SQL Server instance and the -i parameter is the path to the sql script you generated from Visual Studio above. Set this job to quit reporting success or failure.

7. In schedule create a date time you want the job to run, make sure this is a one time job as you don’t want it to try and run again possibly causing problems.
8. In notifications I have set to email on completion, you can set it to email on failure only. I would prefer to know the outcome of the job regardless.
9. Using SQL Server jobs to copy files over the network is possible but is not trivial to setup so I am going to use windows task scheduler for this.
10. Create a job in task scheduler to copy all the ADPs or ADEs that have been changed. If the SQL job fails you will need to copy the old versions of these back but that is simple enough to do.

This process can be expanded to check code out of source control and do even more automated deployments but for now this is good enough for my purposes.