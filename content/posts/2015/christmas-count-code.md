+++
title = "The Christmas count down with code"
date = "2015-12-17T20:00:45Z"
year = "2015"
month= "2015-12"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/adventofcode.jpg"
images = ['/images/adventofcode.jpg']
tags = ["Code", "Challenge", "Santa", "Happy Christmas"]
categories = ["tech"]
keywords = ["", ""]
description = "Join the festive coding fun with daily challenges from Advent of Code, perfect for programmers counting down to Christmas!"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/posts/christmas-count-code",
    "/posts/the-christmas-count-down-with-code-4371",
    "/posts/2015/12/17/the-christmas-count-down-with-code-4371",
    "/posts/2015/12/17/christmas-count-code",
    "/2015/12/17/the-christmas-count-down-with-code-4371",
    "/2015/12/17/christmas-count-code"
]
+++
In December we count down the days to Christmas. People often have advent calendars filled with chocolates or even Lego.

But what about if you are a programmer, how can you count down the days till Christmas? What about if you had a daily Christmas themed coding challenge? Well [www.adventofcode.com](https://www.adventofcode.com/) is the answer.
![](/images/adventofcode.jpg)

Each day a new challenge is available. So far the challenges are related to Christmas and Santa delivering his presents. The challenge is split into two closely linked parts. You are given a randomly generated input and your need to give an answer using a short string or number.

The challenges are getting harder, with some completely defeating me, (not surprising with my limited programming knowledge). The challenges are language independent so you could try them in javascript or c#. I have been using Visual Studio and C# and my code is viewable on [github](https://github.com/funkysi/AdventSolution).

So far I have completed Challenges 1 to 6 and also 10. Partly because I found challenge 7 very difficult but I am hoping to have another go at it.

While coding through these challenges I have done a fair amount of refactoring. I started off with a simple console app with most of my code in one method. As the number of challenges increased I started moving the code for each challenge into its own class, with methods and properties that were unique to the challenge. I also added a main menu so you can choose which challenge to run. Some of my code to answer the challenges takes some time to run so this was quite a time saver over running each challenge in order.

These challenges are very good at teaching me things about coding. I have got to think about data structures, what is the best way to store this information, classes and methods and return types, how to output data to the screen, how to input/import data.

Before I try and work on the next challenge lets have a look at the first challenge:

```
Santa is trying to deliver presents in a large apartment building, 
but he can’t find the right floor – 
the directions he got are a little confusing. 
He starts on the ground floor (floor 0) 
and then follows the instructions one character at a time.

An opening parenthesis, (, means he should go up one floor, and a closing parenthesis, ), 
means he should go down one floor.
```

This is a simple loop through a long string of ( and ) and keep track of the floor number you are on to calculate what floor Santa finishes on. The second part of the challenge asks at what point in your input string does santa reach the basement (floor -1)