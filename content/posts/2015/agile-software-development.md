+++
title = "Agile Software Development"
date = "2015-07-04T20:00:45Z"
year = "2015"
month= "2015-07"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/2015/07/Agile-Marketing-Series-What-is-Agile-Marketing.png"
images = ['/images/2015/07/Agile-Marketing-Series-What-is-Agile-Marketing.png']
tags = ["Agile"]
categories = ["tech"]
keywords = ["", ""]
description = "An overview of Agile Software Development principles and personal experiences applying them in real-world projects."
showFullContent = false
readingTime = true
copyright = false
draft = false
aliases = [
    "/posts/agile-software-development",
    "/posts/agile-software-development-5fkk",
    "/posts/2015/07/04/agile-software-development-5fkk",
    "/posts/2015/07/04/agile-software-development",
    "/2015/07/04/agile-software-development-5fkk",
    "/2015/07/04/agile-software-development"
]
+++
I have heard the term **Agile Software Development** quite a bit, but lets see if we can define it and see if I do any of the processes involved with it.

![Agile Software Development](/images/2015/07/Agile-Marketing-Series-What-is-Agile-Marketing.png)

The dictionary defines ‘Agile’ as mentally quick, or nimble, or quick in movement.

In 2001 The Manifesto for Agile Software Development first introduced the term agile. The manifesto is based on 12 principles.

- Customer satisfaction by early and continuous delivery of useful software
- Welcome changing requirements, even late in development
- Working software is delivered frequently (weeks rather than months)
- Close, daily cooperation between business people and developers
- Projects are built around motivated individuals, who should be trusted
- Face-to-face conversation is the best form of communication (co-location)
- Working software is the principal measure of progress
- Sustainable development, able to maintain a constant pace
- Continuous attention to technical excellence and good design
- Simplicity—the art of maximizing the amount of work not done—is essential
- Self-organizing teams
- Regular adaptation to changing circumstance

Lets go through this list one by one and examine what I understand of it and how I might have used it in the past.

**Customer satisfaction by early and continuous delivery of useful software**

My boss bombards me with hundreds of changes that she wants straight away, I keep her reasonably happy by giving her regular small improvements. Yesterday I released some changes, and two weeks before that I released another chunk, on Monday I will find out that I haven’t included feature Y, so in another couple of weeks feature Y will be delivered. This is my understanding of delivering continuous improvements to my software.

**Welcome changing requirements, even late in development**

Lets ignore the word welcome, as changing requirements are really annoying. I designed a system to track how far through a 5 step process you were, after I deployed that change it was discovered that the process was actually 18 steps. Annoying as this was, my design allowed the easy addition of these extra stages.

**Working software is delivered frequently**

Yes, I do this, see my comments above. If you make a single change and then deploy it, bug fixes are easy as most of it is still in your head. If you spend 6 months making 1000 changes, it will take you extra time to remind yourself what you did and why.

**Close, daily cooperation between business people and developers**

I don’t do this daily but I regularly demo my changes to other departments and directors so I can gather feedback and further revise my changes. Before I start work I always try to understand what is needed and how they want it to work and try and figure out what they need not what they want (different things)

**Projects are built around motivated individuals, who should be trusted**

Not sure I understand this one. There are people that use my projects that I always go to, to find out how it is being used. There are also people that are not interested in change, it is always far more difficult to convince them of the value of what I am working on.

**Face-to-face conversation is the best form of communication**

When I was an IT support guy, I used to like going up to someone’s desk and seeing them experience the problem, it could usually be fixed in a couple of clicks. However when you had a call from a remote office and had to talk through trying different things it could take hours to fix. The same can be said of deploying a new feature, if you talk to your users and explain what has been added they are far more likely to use it, than if you send them an email listing what you have done.

**Working software is the principal measure of progress**

If a Manager can click two buttons to find out how busy their department is, when before they only had out of date spreadsheets, this is a clear measure of progress. Any time spent on code that never gets deployed doesn’t improve anything, its only when that code starts being used has progress been made.

**Sustainable development, able to maintain a constant pace**

I am pretty sure I don’t do this. I work harder at some times than others. Sometimes there are other projects or other demands on my time and so development on a particular project will decrease and there are times when I eat, sleep, dream about a project.

**Continuous attention to technical excellence and good design**

I do strive towards good design and with each deployment aim to improve the quality of code in production. However my limited knowledge means that I don’t always produce the best code but it is improving. If I look at some work I have done in the past, I would definitely do some of that differently if working on it now.

**Simplicity—the art of maximizing the amount of work not done—is essential**

When I first read this one, it made no sense to me. However I believe it can be restated as minimising the amount of work done. Recently I was writing SQL code and I had about 4 or 5 different queries to produce the report that was needed. Every time the requirements changed it was a long slog through each of these queries to update them. In the end I had to rewrite this whole process using one query, it took some time but was simpler and is now easier and quicker to maintain. The simpler the code is the easier and quicker it is to maintain, and you have less work to do.

**Self-organizing teams**

Not sure this applies to me as I work in a team of one. I do try and keep myself organised but not sure if that qualifies as self-organizing.

**Regular adaptation to changing circumstance**

Very similar to the second point about changing requirements but I think also includes changes required due to problems you encounter along the way. A simple example of this is when you encounter a problem, there are lots of different ways to solve it. If you can’t solve something in the database layer, then it might be solved with a script or in the user interface.

So in summary I am not only a developer but very close to being an Agile developer as well, assuming these 12 points are what is needed to be ‘Agile’