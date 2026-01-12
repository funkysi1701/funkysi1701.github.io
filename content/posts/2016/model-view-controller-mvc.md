+++
title = "Model View Controller (MVC)"
date = "2016-03-17T20:00:45Z"
year = "2016"
month= "2016-03"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = [ "MVC"]
categories = ["tech"]
keywords = ["", ""]
description =  "Model View Controller (MVC)"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/model-view-controller-mvc-236p",
    "/posts/model-view-controller-mvc",
    "/posts/model-view-controller-mvc-236p",
    "/posts/2016/03/17/model-view-controller-mvc-236p",
    "/posts/2016/03/17/model-view-controller-mvc",
    "/2016/03/17/model-view-controller-mvc-236p",
    "/2016/03/17/model-view-controller-mvc"
]
+++
![](/images/2016/27.jpg)

Model View Controller or MVC is a software architectural pattern for implementing user interfaces on computers. It divides a given software application into three interconnected parts, so as to separate internal representations of information from the ways that information is presented to or accepted from the user.

I have been trying to get my head around the concept of MVC for a while, hopefully writing this article will help solidify my understanding of it.

One of the core concepts of MVC is the ability to separate concerns so you can concentrate your energies on one aspect of the application.

**Model** This is the data. If your application uses a database the model often mirrors what you have in the database and concerns itself retrieving information from the database.

**View** This concerns itself with displaying the data to the user. Typically this is the html pages of your application.

**Controller** This concerns itself with actually doing things and deals with user interaction. Typically it will get data from the view and send data to the model.

The three concerns can be developed in isolation as they do not depend on each other, for larger development teams you can even divide up development much easier that a traditional app.

The basic concept of MVC I get and understand, however I find myself getting bogged down in the details.

The database doesn’t matter. I need to remember this and not get sidetracked in writing custom methods to connect to the database which end up unmanageable. I know SQL, so can easily write SQL commands to copy data into the format I need for my app. The app I am currently working on involves a large amount of existing data, and I need to concentrate on the MVC parts and worry about the database later.

In previous attempts I have tried to build my model against many tables, but instead I can write a query against many tables and insert that into one table which the Model can then use.

Changing the model often results in an error informing you that the context has changed since the database was created. The easy solution to this in my case is to drop the database and allow entity framework to recreate the database each time. As long as my database contains no new data, I won’t loose anything.

One of the core advantages of MVC is the ability to test it or even use test driven development (TDD). I haven’t really dabbled with testing yet as I am still trying to get my head around the fundamentals, but once I have made some progress with my app I want to test, so next time I get asked to add a new feature I have no fear about breaking stuff.

For the first time I have got an app with a working Authentication system from the start. And it is remarkably easy to implement with one keyword. Adding **[Authorize]** to the top of your controller is all that is needed. Building the actual Authentication system is relatively easy from Visual Studio, as it has templates for Azure AD, Forms Based, Open Auth like google/twitter etc.

It is still very early days for my MVC app and my understanding of it, but I feel I have turned the corner and can actually build something with it now, rather than be stuck in a downward spiral of confusion.

What do you think about MVC why not leave a comment below? For more info about MVC I have been looking at http://www.asp.net/mvc which has more information and tutorials.
