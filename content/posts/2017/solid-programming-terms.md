+++
title = "SOLID and other programming terms"
date = "2017-03-20T20:00:45Z"
year = "2017"
month= "2017-03"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["Design Patterns", "DRY", "MVC", "Programming", "SOLID"]
category="tech"
keywords = ["", ""]
description =  "SOLID and other programming terms"
summary = "SOLID and other programming terms"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/automation-of-the-promotion-of-my-blog-1ei0",
    "/posts/solid-programming-terms",
    "/posts/automation-of-the-promotion-of-my-blog-1ei0",
    "/posts/2017/03/20/automation-of-the-promotion-of-my-blog-1ei0",
    "/posts/2017/03/20/solid-programming-terms",
    "/2017/03/20/automation-of-the-promotion-of-my-blog-1ei0",
    "/2017/03/20/solid-programming-terms"
]
+++
This week I have been looking at improving my understanding of a few programming terms, like SOLID and I will try and define them so I can look back here when I get confused.

### MVC

I have previously blogged about [MVC](https://www.funkysi1701.com/2016/03/17/model-view-controller-mvc/), but my understanding was not 100% correct so I will refine this here.

**Model** – Now this is where my understanding was not quite correct. I thought the model was the actual source data, eg an XML file, SQL database etc. The model is the business logic so this is a processed version of the source data. MVC does not care where data is stored it can be flat files, SQL, XML or anything really.

**View** – This displays data to the user and typically is the HTML/CSS markup. Only display related logic would get included in the view.

**Controller** – This is another place I had got a bit confused. I had thought all the logic lived here. This is incorrect controllers are only concerned with getting data between Model and View.

### SOLID

SOLID are five principles of object oriented programming and design.

**S** is for Single Responsibility Principle. A class or piece of code should be responsible for doing one thing.

![](https://storageaccountblog9f5d.blob.core.windows.net/blazor/wp-content/uploads/2017/03/SingleResponsibilityPrinciple2_71060858.jpg?resize=300%2C240&ssl=1)

**O** is for Open/Closed Principle. Code should be open for extensions but closed for modifications. Often this refers to the way you can implement an interface and add extra functionality.

![](https://storageaccountblog9f5d.blob.core.windows.net/blazor/wp-content/uploads/2017/03/ocp.jpg?resize=300%2C240&ssl=1)

**L** is for Liskov Substitution Principle. Objects in a program can be replaced with subtypes of that object with out changing functionality.

![](https://storageaccountblog9f5d.blob.core.windows.net/blazor/wp-content/uploads/2017/03/LiskovSubtitutionPrinciple_52BB5162.jpg?resize=300%2C240&ssl=1)

**I** is for Interface Segregation Principle. Large interfaces should be split down into small interfaces so that clients only know about methods that are of interest.

![](https://storageaccountblog9f5d.blob.core.windows.net/blazor/wp-content/uploads/2017/03/isp.jpg?resize=300%2C240&ssl=1)

**D** is for Dependency Inversion Principle. High and Low level modules should depend on abstractions.

![](https://storageaccountblog9f5d.blob.core.windows.net/blazor/wp-content/uploads/2017/03/dip.jpg?resize=300%2C240&ssl=1)

I need to look into SOLID some more but here are some [examples](https://www.codeproject.com/Articles/703634/SOLID-architecture-principles-using-simple-Csharp).

### DRY

DRY is simply Don’t Repeat Yourself. It is often easy to spot when a function call will help you not have to use the same bit of code in different places. I am often spotting places where I can put this into action.