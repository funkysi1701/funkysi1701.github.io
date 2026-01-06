+++
title = "My Love/Hate Relationship with Microsoft Access"
date = "2015-07-24T20:00:45Z"
year = "2015"
month= "2015-07"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["Database", "Access", "SQL", "VBA", "Microsoft Office"]
categories = ["tech"]
keywords = ["", ""]
description =  "My Love/Hate Relationship with Microsoft Access"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/posts/microsoft-access",
    "/posts/my-lovehate-relationship-with-microsoft-access-1ok8",
    "/posts/2015/07/24/my-lovehate-relationship-with-microsoft-access-1ok8",
    "/posts/2015/07/24/microsoft-access",
    "/2015/07/24/my-lovehate-relationship-with-microsoft-access-1ok8",
    "/2015/07/24/microsoft-access"
]
+++
For historical reasons I use Microsoft Access as the front-end for all my line of business databases.

Access allows you to create an ADP file that can connect to your SQL Server database. However Office has dropped support for this, so the last version of office that I can use is Office 2010.

Before I start hating on Access there are some good things about the platform. Users with very little knowledge can create a database fairly quickly. Development time is also fairly low as it doesn’t take long to create a new form, and add a few buttons which open different reports.

For the last 5 years or so I have built a range of different forms in Access, (and even if I do say so myself), I have got quite good at creating forms that users can be more productive with. Access has the concept of a subform which is a form embedded in a form, each form can be connected to a different query and can be connected to each other so it is relatively easy to create something quite powerful.

Access report are an easy way to create professional looking reports that can be sent out to clients, or used by management and they also have the concept of subreports, (same as subforms but embedded in a report), this means you don’t have to write one query to pull back every piece of data that shows up in a report.

VBA or Visual Basic for Access allows you easily do things programmatically, like run something if something is selected or a button is clicked. This is not the easiest programming language to work with, however once you have used it for a while you get used to its quirks. My favourite function is IIF, the syntax is fairly simple IIF(expr, truepart, falsepart), if expr evaluates to true the truepart is executed (executed can be as simple as displaying certain text in certain conditions), if it is false the falsepart is executed, and you can also chain them together which I have done to produce something very complex looking.

Now for the negative side of things. Access creates a binary ADP file, binary files can not be version controlled in git or subversion. This is a big problem as I want to keep track of every change I make. It also means that branching or working with others on big projects is also difficult.

One work around I have found to this problem is [AccessSVN](https://accesssvn.codeplex.com/). This program takes an ADP and creates text files of every form and report. It also can create an ADP from these files as well, however I have had varying success with this feature so I prefer to just create the text files if possible. What I do after I have made a change to the ADP is to run AccessSVN, create text files and commit these to source control. You can then see what controls have been changed or added. It also helps with bugs as I have found that sometimes while testing access will apply a filter to a form, which will break things if deployed, which is very annoying.

Access can only do what access was designed to do. There are some advanced features that we would like to add to our databases. Things like sending emails or uploading reports to a website. This is not Access fault as it was never designed to be able to do such things but I am often asked about what is possible.

End of support for Office 2010 is approaching and I have plans to stop using Access but until then I need to keep supporting our existing front ends.