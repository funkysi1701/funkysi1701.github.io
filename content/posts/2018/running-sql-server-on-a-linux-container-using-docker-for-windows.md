+++
title = "Running SQL Server on a Linux Container using Docker for Windows"
date = "2018-11-05T00:00:00Z"
year = "2018"
month= "2018-11"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
copyright = false
cover = ""
tags = ["Windows", "Docker", "SQL", "Linux"]
categories = ["tech"]
keywords = ["", ""]
description = "Running SQL Server on a Linux Container using Docker for Windows"
showFullContent = false
readingTime = true
aliases = [
    "/running-sql-server-on-a-linux-container-using-docker-for-windows-24k3",
    "/posts/running-sql-server-on-a-linux-container-using-docker-for-windows",
    "/posts/2018/11/05/running-sql-server-on-a-linux-container-using-docker-for-windows",
    "/posts/running-sql-server-on-a-linux-container-using-docker-for-windows-24k3",
    "/posts/2018/11/05/running-sql-server-on-a-linux-container-using-docker-for-windows-24k3",
    "/2018/11/05/running-sql-server-on-a-linux-container-using-docker-for-windows-24k3"
]
+++
Recently I have been investigating what all the fuss is about Docker and it has been well worth my time as Docker is pretty awesome for automating stuff.

My development environment has typically required installing SQL Server. SQL is a bit of a beast with lots of options and takes time to setup how you want.

However since Microsoft have now created a version of SQL Server that runs on Linux you can run SQL Server in a Linux container with only a few commands. 

I am going to assume you already have Docker for windows installed on your development machine. If not head over to [Docker](https://docs.docker.com/docker-for-windows/install/#where-to-go-next) and find out how. 

The Microsoft guide to setting up SQL Server in a Linux container can be found [here](https://docs.microsoft.com/en-us/sql/linux/quickstart-install-connect-docker?view=sql-server-2017). 

First you need to download the image. In a powershell window run:

```
docker pull mcr.microsoft.com/mssql/server:2017-latest
```
This downloads the latest sql server image.

To run this image run the following:

```
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=password"
-p 1433:1433 --name sql
-d mcr.microsoft.com/mssql/server:2017-latest
```

To run a SQL Server image you are required to accept the terms and conditions and set a default sa password. These are added as environment variables with the -e flag.

You also need to set the ports that your container will run on (1433 is the default SQL port) and give your container a name, in this case "sql".

If you have already installed SQL Server you will not be able to run the container on the same port as your local install. To solve this you can select a different port.

```
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=password" 
-p 1434:1433 --name sql
-d mcr.microsoft.com/mssql/server:2017-latest
```

-p 1434:1433 maps the 1433 port on the container to port 1434 of your local environment.

Once you have run this command you can connect SQL Server Management Studio (SSMS) to (local) or (local),1434 if you are using a different port using the credentials you provided and execute any SQL you like.

If your development environment requires windows authentication this of course is not for you, if it doesn’t you are good to go.

The development environment I have been using has various powershell scripts for setting things up. These assume windows auth. However I have adapted them to take custom credentials.

```
$credential = Get-Credential $server.ConnectionContext.LoginSecure=$false 
$server.ConnectionContext.set_Login($credential.UserName) 
$server.ConnectionContext.set_SecurePassword($credential.Password)
```

The Get-Credential command creates a dialog where you can enter SQL credentials, this is then stored in a variable and used in the rest of the script.

**How do I restore a backup file to my container?**

Run:

```
docker exec -it sql mkdir /var/opt/mssql/backup
docker cp database.bak sql:/var/opt/mssql/backup
```

This creates a backup folder and copies a backup file from your local environment to the container. You can then use management studio to restore the backup file (or you could write a sql script to do it). One thing to note when restoring databases, make sure the files are restored to Linux locations not windows locations.

The only issues I have encountered so far are the lack of support for SSIS packages and no windows auth. There are sql server windows images available which I haven’t tried yet which may work better with some of these options.