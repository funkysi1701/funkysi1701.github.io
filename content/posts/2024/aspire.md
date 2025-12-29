+++
title = "Getting started with .Net Aspire"
date = "2024-11-25T20:00:00Z"
year = "2024"
month= "2024-11"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/aspire-ga-what-is-aspire.png"
images =['/images/aspire-ga-what-is-aspire.png']
tags = ["DotNet", "Blazor", "C-Sharp", "Visual Studio", "Aspire", "OpenTelemetry", ".Net 9", "Microsoft"]
category="tech"
description = "Learn how to get started with .Net Aspire, a comprehensive set of tools, templates, and packages that simplify cloud-native application development using .Net. Explore its key features like orchestration, integrations, and tooling to build observable, production-ready applications with consistent patterns."
description = "By reading this post, you'll learn how to get started with .Net Aspire, its key features, and how it simplifies building cloud-native, observable, and production-ready applications."
showFullContent = false
readingTime = true
copyright = false
featured = true
draft = false
aliases = [
    "/aspire",
    "/posts/aspire",
    "/posts/2024/11/25/aspire",
    "/2024/11/25/aspire"    
]
+++
## What is .Net Aspire?

.Net Aspire is a comprehensive set of tools, templates, and packages designed to simplify the development of cloud-native applications using .Net. It focuses on building observable, production-ready apps by providing a consistent and opinionated set of [tools and patterns](https://learn.microsoft.com/en-us/dotnet/aspire/get-started/aspire-overview).

The key features of .Net Aspire:

- Orchestration: Enhances the local development experience by simplifying the management of your app's configuration and interconnections. It helps with app composition, service discovery, and connection string management.
- Integrations: Offers NuGet packages for commonly used services like Redis and Postgres, ensuring they connect consistently and seamlessly with your app.
- Tooling: Comes with project templates and tooling experiences for Visual Studio, Visual Studio Code, and the .Net CLI to help you create and interact with .Net Aspire projects.

Overall, [.Net Aspire](https://devblogs.microsoft.com/dotnet/introducing-dotnet-aspire-simplifying-cloud-native-development-with-dotnet-8/) aims to improve the experience of building .Net cloud-native apps by providing a robust framework for developing distributed applications.

![Aspire](/images/aspire-ga-what-is-aspire.png)

## Getting started with .Net Aspire

I touched on .Net Aspire last week, when I talked about what was new in [dotnet 9](/posts/2024/dotnet9), but let's walk through an example.

Lets say you have a simple application. It has a Blazor web front end, it communicates with a .Net API and that API retrieves data from a SQL Server database. Before Aspire came along I would create a docker compose file and configure ports so the FE could call the API, and add connection strings so the API could access the database.

```docker-compose.yml
services:
  Api:
    image: ${DOCKER_REGISTRY-}api
    container_name: api
    ports:
      - 12345:80
      - 44338:443
    networks:
      - my-network
    build:
      context: .
      dockerfile: API/Dockerfile
    depends_on:
      - sqlserver

  Ui:
    image: ${DOCKER_REGISTRY-}ui
    container_name: ui
    ports:
      - 44330:443
    networks:
      - my-network
    build:
      context: .
      dockerfile: UI/Dockerfile
    environment:
      - APIPath=http://Api:80

  sqlserver:
    image: ${DOCKER_REGISTRY-}sql
    container_name: sql
    volumes:
      - sqlvol:/var/opt/mssql
    ports:
      - "5432:1433"
    networks:
      - my-network
    build:
      context: .
      dockerfile: Database/Dockerfile
```
As you can see from this docker compose file, there is a lot of specifying ports and other plumbing to get these three parts of my system to work together.

Now in Visual Studio, right-click on the API project and select add **.Net Aspire Orchestrator Support** this will add two new Visual Studio projects to the solution, AppHost and ServiceDefaults.
- AppHost is where you configure what service depends on what, you can configure all sorts of different dependencies, like databases (sql server, mysql, postgres etc), rabbitmq, redis and many others.
- ServiceDefaults is where you configure the defaults for your services, like how opentelemetry should be configured, or how logging should work.

Now right click on the Blazor project and select the same option to get that wired up as well. 

```program.cs
var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.UI>("ui");

builder.AddProject<Projects.API>("api");

builder.Build().Run();
```
Your Program.cs file inside your AppHost project will look something like this now, with both your API and UI/Blazor projects referenced.

There is one more component we need to wire up, but we don't have a project to right click on for the database. It is fairly straightforward to do, update it to look like the following:

```program.cs
var builder = DistributedApplication.CreateBuilder(args);

var sqldb = builder.AddSqlServer("sql")
    .WithDataVolume("sql-data")
    .AddDatabase("Context", "Project");

var api = builder.AddProject<Projects.API>("api")
    .WaitFor(sqldb)
    .WithReference(sqldb);

builder.AddProject<Projects.UI>("ui")
    .WaitFor(api)
    .WithReference(api);

await builder.Build().RunAsync();
```
You also need to install a couple of nuget packages. **Aspire.Hosting.SqlServer** and **Aspire.Microsoft.EntityFrameworkCore.SqlServer** the second one is because my project is using Entity Framework. Lets look at what we have, we are defining a SQL Server called sql, with a data volume called sql-data, and a database called Project, which we can refer to as Context. We then configure API to reference the sql server we have just configured, and wait for sql server to be ready before starting the API. Next the Blazor project depends on the API and will wait for that to be ready before starting. Pretty powerful stuff.

OK lets look at the API project, what do I need to configure in my connectionstrings? Not much, Aspire will fill all of this in for you.
```appsettings.json
  "ConnectionStrings": {
    "Context": ""
  }
```
In your API project, your Program.cs will need a nuget package **Aspire.Microsoft.EntityFrameworkCore.SqlServer** and the following line, and no need for any pulling config and passing in connection strings.
```program.cs
builder.AddSqlServerDbContext<Context>("Context");
```

One more clever thing we can do with Aspire is seed some data into my database before starting the project. Update the code that sets up your database in the AppHost project as follows.
```program.cs
var sqldb = builder.AddSqlServer("sql")
    .WithBindMount("./sqlserverconfig", "/usr/config")
    .WithBindMount("../API/data/sqlserver", "/docker-entrypoint-initdb.d")
    .WithEntrypoint("/usr/config/entrypoint.sh")
    .WithDataVolume("sql-data")
    .AddDatabase("Context", "Project")
```
Add a sqlserverconfig folder inside your AppHost project and add the following two files. I have found entrypoint.sh being a bit picky with its line endings (windows vs linux) 

```entrypoint.sh
#!/bin/bash

# Adapted from: https://github.com/microsoft/mssql-docker/blob/80e2a51d0eb1693f2de014fb26d4a414f5a5add5/linux/preview/examples/mssql-customize/entrypoint.sh

# Start the script to create the DB and user
/usr/config/configure-db.sh &

# Start SQL Server
/opt/mssql/bin/sqlservr
```

```configure-db.sh
#!/bin/bash

# set -x

# Adapted from: https://github.com/microsoft/mssql-docker/blob/80e2a51d0eb1693f2de014fb26d4a414f5a5add5/linux/preview/examples/mssql-customize/configure-db.sh

# Wait 60 seconds for SQL Server to start up by ensuring that
# calling SQLCMD does not return an error code, which will ensure that sqlcmd is accessible
# and that system and user databases return "0" which means all databases are in an "online" state
# https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-databases-transact-sql?view=sql-server-2017

dbstatus=1
errcode=1
start_time=$SECONDS
end_by=$((start_time + 60))

echo "Starting check for SQL Server start-up at $start_time, will end at $end_by"

while [[ $SECONDS -lt $end_by && ( $errcode -ne 0 || ( -z "$dbstatus" || $dbstatus -ne 0 ) ) ]]; do
    dbstatus="$(/opt/mssql-tools18/bin/sqlcmd -h -1 -t 1 -U sa -P "$MSSQL_SA_PASSWORD" -C -Q "SET NOCOUNT ON; Select SUM(state) from sys.databases")"
    errcode=$?
    sleep 1
done

elapsed_time=$((SECONDS - start_time))
echo "Stopped checking for SQL Server start-up after $elapsed_time seconds (dbstatus=$dbstatus,errcode=$errcode,seconds=$SECONDS)"

if [[ $dbstatus -ne 0 ]] || [[ $errcode -ne 0 ]]; then
    echo "SQL Server took more than 60 seconds to start up or one or more databases are not in an ONLINE state"
    echo "dbstatus = $dbstatus"
    echo "errcode = $errcode"
    exit 1
fi

# Loop through the .sql files in the /docker-entrypoint-initdb.d and execute them with sqlcmd
for f in /docker-entrypoint-initdb.d/*.sql
do
    echo "Processing $f file..."
    /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -C -d master -i "$f"
done
```

The second BindMount line mounts a folder inside your API project, so add a data folder with a subfolder called sqlserver. Inside that add a sql script called init.sql. Put all your CREATE DATABASE and CREATE TABLES sql commands inside this. And if everything works you will have a seeded DB ready to test your application with.

## Conclusion

This is just a few things I have done with Aspire. Go check out the docs on [MS learn](https://learn.microsoft.com/en-us/dotnet/aspire/get-started/aspire-overview) or the some of the sessions from [dotnet conf](https://www.youtube.com/watch?v=fiePiEc1qcU&list=PLdo4fOcmZ0oXeSG8BgCVru3zQtw_K4ANY&index=2).