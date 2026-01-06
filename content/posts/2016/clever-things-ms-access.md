+++
title = "Clever things with MS Access"
date = "2016-07-07T20:00:45Z"
year = "2016"
month= "2016-07"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["Database", "Access", "DevOps",  "Source Control" ]
categories = ["tech"]
keywords = ["", ""]
description =  "Clever things with MS Access"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/clever-things-with-ms-access-40e",
    "/posts/clever-things-ms-access",
    "/posts/clever-things-with-ms-access-40e",
    "/posts/2016/07/07/clever-things-with-ms-access-40e",
    "/posts/2016/07/07/clever-things-ms-access",
    "/2016/07/07/clever-things-with-ms-access-40e",
    "/2016/07/07/clever-things-ms-access"
]
+++
I hate MS Access and especially developing with it as you can’t do any thing clever with it.

**Wrong, Wrong, Wrong!**

There are a few clever things I have been able to script to make developing with it passable. I still would rather use Visual Studio but this improves the experience a fair bit.

## Source Control

Access files are binary (I use the ADP/ADE file format but I assume other Access file formats have the same problem) and so you can’t diff them to see what has changed. This is bad.

However there is a solution to this. A tool called Access SVN and can be downloaded from https://accesssvn.codeplex.com/, this gives you a way to extract to text files all the forms and reports that are in Access. Before every commit I would manually run this tool on my ADP file and extract to text files, then I would commit these text files to source control and could easily see what had changed in each commit.

Despite the name Access SVN, the tool is not tied to subversion, you can use any source control system, I use git.

Also included in this tool is a way to do this with the command line, so you can make this a build step on your build server. I have not used this extensively yet, but the syntax is fairly simple

```bash
asvn.exe e "path to Access file" "path to txt files" "*.*"
```

The filter at the end *.* allows you to specify what to extract so you could extract all forms/reports beginning with D with "*.D*". I had trouble using *.* because the names of my forms/reports contain characters not allowed in a windows file name. I am sure there is a way round this but I haven’t had chance to look into it further yet.

## Testing MS Access

Surely testing is not possible with MS Access? I would have agreed with that statement the other day until I found a neat way of testing if a feature is enabled.

Firstly a bit of background. I develop using MS Access 2003 because the design view is far easier to use, however because it is out of support all my users use MS Access 2010. MS Access 2010 has a feature called Tabbed Documents which allows all forms and reports to open in new tabs so you can easily switch between them. This feature can only be enabled in MS Access 2010 and has no effect if opening with MS Access 2003.

If you use Access SVN on your Access file with tabbed documents turned on and off you will see UseMDIMode: 0 and UseMDIMode: 1 show up in the Database properties file. UseMDIMode: 0 means that tabbed documents is turned on.

In powershell I can now write a test to see if UseMDIMode: 0 can be found in the database properties file

```powershell
Get-Content "General\Database properties.dbp.txt" | Select-String "UseMDIMode: 0" -quiet
```

If the test passes True will be returned, if it fails null will be returned.

On my build server I scripted the extraction of Database properties.dbp.txt from the ADP file with asvn.exe before running this test. While not strictly needed as Database properties.dbp.txt should be in source control, it is possible that someone could forget to extract the text files from the ADP, with this step you are always testing what is enabled in the binary file.

## MS Access Connection Strings

While developing with MS Access I often swap the database connection to point to my local machine or a build server. I always try and remember to only ever commit with this set to the live database to avoid obvious problems.

The other day I found on [stackoverflow](https://stackoverflow.com/questions/16411430/change-access-server-connection-from-command-line) a way to script this. I love this! I can include this step in my deployment process and it will overwrite what ever the connection string is in source control with what your production environment needs.

All you need to run this step is, (note it is spaces between the parameters not commas)

```bash
cscript connect.vbs Project.adp "ServerName" "DatabaseName"
```

The contents of connect.vbs can be found on the [stackoverflow article](https://stackoverflow.com/questions/16411430/change-access-server-connection-from-command-line). It is also possible to pass username and password if your environment requires this.

## Compiled ADE

The last clever thing I do with MS Access is convert my ADP file into the compiled ADE version. To manually do this there is an option in the tools menu.

To automate this I run

```bash
cscript createADE.vbs "path to ADP" "path to ADE"
```

The contents of createADE came from this [forum post](https://social.msdn.microsoft.com/Forums/office/en-US/01fd48a9-258e-4405-86f1-adfb2f1057ee/create-an-access-2007-ade-from-a-adp-via-commandline?forum=accessdev), the only change I made was to comment out some of the echo statements so it would run silently as part of my build process. It should be noted that cscript and wscript are almost identical and either will run these scripts however in a command line environment cscript is preferable, and wscript should be used in a windows environment.

I am quite surprised at how much I have managed to do in terms of scripting the build and deployment process for MS Access. I still don’t like developing with Access but this has definitely improved things.