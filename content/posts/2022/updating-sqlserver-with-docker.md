+++
title = "Updating SQL Server with Docker"
date = "2022-02-23T00:00:00Z"
year = "2022"
month= "2022-02"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
copyright = false
cover = "/images/header-01.png"
images =['/images/header-01.png']
tags = ["Docker", "SQL"]
categories = ["tech"]
keywords = ["", ""]
description = "Learn how to update SQL Server using Docker. This guide covers the steps to upgrade your SQL Server instances in a Docker environment, including best practices and tips for a smooth transition."
showFullContent = false
readingTime = true
aliases = [
    "/updating-sql-server-with-docker-5def",
    "/posts/updating-sqlserver-with-docker",
    "/posts/2022/02/23/updating-sqlserver-with-docker",
    "/posts/updating-sql-server-with-docker-5def",
    "/posts/2022/02/23/updating-sql-server-with-docker-5def",
    "/updating-sql-server-with-docker-5def",
    "/2022/02/23/updating-sql-server-with-docker-5def"
]
+++

This morning I was listening to a podcast where the new features coming out for SQL Server 2022 were being discussed. This starting me thinking about what would be involved in upgrading.

Upgrading production environments is complex and there are licensing considerations to take into account. However for non production workloads like development this isn't a problem so lets look at that first.

In the past I have installed SQL Server Devloper Edition onto my laptop, this is fine but I have found that unless you are very careful you may end up with multiple different versions of SQL Server sitting around, and it is difficult to cleanly remove them without a fresh install of the OS.

However in this day and age, Docker and Containers are king. My current development environment makes use of Docker and has a docker compose file which sets up SQL Server for this particular application, lets take a look.

```yml
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2019-latest
    container_name: Sql
    ports:
      - "5432:1433"
    networks:
      - my-network
    volumes:
      - sqlvolume:/var/opt/mssql
```

This defines which docker image to use, in this case 2019-latest, sets up ports and the name and saves the data on a docker volume.

If we then run SELECT @@VERSION on this instance of SQL Server we get told:

```txt
Microsoft SQL Server 2019 (RTM-CU13) (KB5005679) - 15.0.4178.1 (X64)   Sep 23 2021 16:47:49   Copyright (C) 2019 Microsoft Corporation  Developer Edition (64-bit) on Linux (Ubuntu 20.04.3 LTS) <X64>
```

What if we change the docker-compose file to use 2022-latest?

```txt
manifest for mcr.microsoft.com/mssql/server:2022-latest not found: manifest unknown: manifest tagged by "2022-latest" is not found
```

SQL Server 2022 hasn't been released yet so there is no docker image for it yet. Try this command again in a few months when it is available.

OK so what else can we try? What about a downgrade to 2017-latest? Will that work?

SQL Server 2017 starts but the following error gets logged.

```txt
2022-02-23 21:41:15.30 Server      Software Usage Metrics is disabled.

2022-02-23 21:41:15.30 spid6s      Starting up database 'master'.

2022-02-23 21:41:15.34 spid6s      Error: 948, Severity: 20, State: 1.

2022-02-23 21:41:15.34 spid6s      The database 'master' cannot be opened because it is version 904. This server supports version 869 and earlier. A downgrade path is not supported.
```

Doh we can't downgrade the existing database we have. Probably a good thing really.

Microsoft release regular updates for SQL Server called CU's (Cumulative Updates), you can see above we are on CU13. Is there a CU14 or CU15 we could try?

Update the docker compose to: mcr.microsoft.com/mssql/server:2019-CU14-ubuntu-20.04

At this point I actually got an error

```tct
2022-02-23 21:50:20.71 Server      Error: 17058, Severity: 16, State: 1.

2022-02-23 21:50:20.71 Server      initerrlog: Could not open error log file '/var/opt/mssql/log/errorlog'. Operating system error = 5(Access is denied.).
```

This is caused by trying to use SQL Server 2017 but it is easy to fix.

In docker desktop there is a volumes section, find the volume you are using with SQL Server and delete the errorlog mentioned above.

![Docker Desktop](/images/2022/docker-desktop1.png)

Now if you retry SQL will start OK.

Repeating the SELECT @@VERSION gives us a new CU

```txt
Microsoft SQL Server 2019 (RTM-CU14) (KB5007182) - 15.0.4188.2 (X64)   Nov  3 2021 19:19:51   Copyright (C) 2019 Microsoft Corporation  Developer Edition (64-bit) on Linux (Ubuntu 20.04.3 LTS) <X64>
```

```txt
Microsoft SQL Server 2019 (RTM-CU15) (KB5008996) - 15.0.4198.2 (X64)   Jan 12 2022 22:30:08   Copyright (C) 2019 Microsoft Corporation  Developer Edition (64-bit) on Linux (Ubuntu 20.04.3 LTS) <X64>
```

How much easier is this than manually installing updates and rebooting or attempting to uninstall and reinstall SQL Server. As SQL Server 2022 isn't out yet I can't say for certain what issues I may encounter but hopefully it will be as easier as this. And I don't need to backup or restore and databases they are all available as before!
