+++
title = "What should be in Source Control?"
date = "2016-11-24T20:00:45Z"
year = "2016"
month= "2016-11"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["Git", "SourceCode","Source Control",  "C-Sharp"]
categories = ["tech"]
keywords = ["", ""]
description =  "What should be in Source Control?"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/what-should-be-in-source-control-4f0d",
    "/posts/what-should-be-in-source-control",
    "/posts/what-should-be-in-source-control-4f0d",
    "/posts/2016/11/24/what-should-be-in-source-control-4f0d",
    "/posts/2016/11/24/what-should-be-in-source-control",
    "/2016/11/24/what-should-be-in-source-control-4f0d",
    "/2016/11/24/what-should-be-in-source-control"
]
+++
I am currently working on source code that is over 5Gb in size. This is mostly due to a poorly thought out folder structure, there are code files, images and Excel files all jumbled together. I think a clear distinction should be made between source code and data.

### Source Code

I will define source code as anything that is written in order to compile and run the project. If it is a webpage it will be all the HTML, CSS and Javascript or any file used to produce these. I would also include any configuration files and files used to build/deploy the website or project. Anything that is compiled from your source files can safely be ignored.

### Data

I would define data as anything that is added to the project during its life. So if you have an upload option, anything that is uploaded I would describe as data. The site should still function without (or very little) data.

### Images

Images can fit into both groups. Any icons or images attached to the functionality of the project I would class as source code. However anything that is uploaded should be classed as Data.

### Databases

The database should also be classed as both. The data, anything that is inside a database table should normally be classed as data. Stored Procedures, Functions and Views are all Source Code and would benefit from version control.

### Source Control != Backup

Source control is not an excuse not to backup things. Don’t just commit files to source control so you know you can restore them if you need to. Files in general in source control are there so you can see how they changed over time as the code base changed. Files in you backup are a snapshot of what the application was at a point in time and will include ALL the data.

One last point before I end. If you are hosting on a Cloud Computing platform like Azure it gives you an easy way to distinguish between Data and Code.

Anything in your

- Web App = Code
- Blob Storage = Data
- SQL = Data/Code

Each project is unique and there will always be exceptions to these suggestions but I think this is a good goal to have. What do you think?
