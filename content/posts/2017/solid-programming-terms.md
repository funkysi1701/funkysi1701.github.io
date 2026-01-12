+++
title = "SOLID and other programming terms"
date = "2017-03-20T20:00:45Z"
year = "2017"
month= "2017-03"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["Design Patterns", "DRY", "MVC",  "SOLID"]
categories = ["tech"]
keywords = ["", ""]
description =  "SOLID and other programming terms"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/solid-and-other-programming-terms-5533",
    "/posts/solid-programming-terms",
    "/posts/solid-and-other-programming-terms-5533",
    "/posts/2017/03/20/solid-and-other-programming-terms-5533",
    "/posts/2017/03/20/solid-programming-terms",
    "/2017/03/20/solid-and-other-programming-terms-5533",
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

![](/images/2017/SingleResponsibilityPrinciple2_71060858.jpg)

**O** is for Open/Closed Principle. Code should be open for extensions but closed for modifications. Often this refers to the way you can implement an interface and add extra functionality.

![](/images/2017/ocp.jpg)

**L** is for Liskov Substitution Principle. Objects in a program can be replaced with subtypes of that object with out changing functionality.

![](/images/2017/LiskovSubtitutionPrinciple_52BB5162.jpg)

**I** is for Interface Segregation Principle. Large interfaces should be split down into small interfaces so that clients only know about methods that are of interest.

![](/images/2017/isp.jpg)

**D** is for Dependency Inversion Principle. High and Low level modules should depend on abstractions.

![](/images/2017/dip.jpg)

I need to look into SOLID some more but here are some [examples](https://www.codeproject.com/Articles/703634/SOLID-architecture-principles-using-simple-Csharp).

### DRY

DRY is simply Don’t Repeat Yourself. It is often easy to spot when a function call will help you not have to use the same bit of code in different places. I am often spotting places where I can put this into action.