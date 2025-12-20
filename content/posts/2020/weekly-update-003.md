+++
title = "Developer Weekly Update #003: Progress, Challenges, and Insights"
date = "2020-11-28T00:00:00Z"
year = "2020"
month= "2020-11"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
copyright = false
cover = ""
tags = ["OpenSource", "PHP"]
category="tech"
keywords = ["", ""]
description = "My first PR and PHP"
showFullContent = false
readingTime = true
aliases = [
    "/weekly-update-003-3nfl",
    "/posts/weekly-update-003/",
    "/posts/weekly-update-003-3nfl",
    "/posts/2020/11/28/weekly-update-003-3nfl",
    "/posts/2020/11/28/weekly-update-003",
    "/2020/11/28/weekly-update-003-3nfl",
    "/2020/11/28/weekly-update-003"
]
+++

Been a quiet week, so wasn't expecting to have much to write on here, however a few things happened worth talking about.

### My First PR

A comment was made to me to do something with the postcodes that are in the system I am developing. Find out what projects have postcodes near each other, and that way work can be grouped together and reduce potential mileage costs of staff that need to visit these projects.

A quick google search found https://postcodes.io/ which has an API that returns nearby postcodes. It also has a C# wrapper https://github.com/markembling/MarkEmbling.PostcodesIO

A comparison of what was being returned from the wrapper and what the API said should be returned revealed that the distance between postcodes wasn't being returned.

As the code was on GitHub I could easily see how easy or difficult it might be to add the missing bit of information. It was easy! So, I forked the repo and made the change. I published the change to a private NuGet repo in my Azure Dev Ops account. That way I could try my revised package to check it did what I wanted. 

I left a message on the GitHub project letting the owner know I had a potential fix for an issue. The project hadn't been updated in over a year, so the owner may not be interested, or the project may have been abandoned. 

I was in luck just 17 hours after I left a message the project owner said to create a Pull Request, which I did and shortly afterwards my code had been merged in and an updated version of the package existed in the public NuGet feed. 

I have been thinking about contributing to open source for a while. However, I had not seen a project I wanted to contribute to, or a problem that I knew how to fix until now that is.

### PHP

This week I had a call asking me if I knew PHP?

I did, over ten years ago, before I got my first IT job, I spent time learning PHP and MySQL. I created a blog, and I also created a website for my Dad's camera club. The code I created back then was awful. No shared code, all the code was associated with the page, or sorts of bugs occurred and as time went by it became increasingly hard to update. The site was well liked but I eventually lost interest and moved on to learn other things.

This call led to me talking with the head of IT, and later a couple of the developers who have since granted me access to the codebase of a project.

I haven't had time to spend a lot of time looking at the code so far, however this is nothing like the PHP I had built before.

The project makes use of the [laravel](https://laravel.com/) framework and the first file I opened had methods and classes, so apart from the syntax you could think you were looking at C#.

Another thing that interested me was the project used docker containers, it has automated builds as well. Lots of modern programming ideas that I had some ideas about. I am looking forward to learning more about this project and how I might contribute to it.
