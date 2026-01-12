+++
title = "DDD East Midlands"
date = "2023-10-09T00:00:00Z"
year = "2023"
month= "2023-10"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
copyright = false
cover = "/images/ddd_avatar_300.jpg"
images = ['/images/ddd_avatar_300.jpg']
tags = ["DotNet", "Community", "Conference", "DDD East Midlands"]
categories = ["tech"]
keywords = ["", ""]
description = "On Saturday 7th October I attended DDD East Midlands"
showFullContent = false
readingTime = true
draft = false
aliases = [
    "/ddd-east-midlands-16hh",
    "/2023/10/09/ddd-east-midlands"
]
+++
On Saturday 7th October I attended [DDD East Midlands](https://dddeastmidlands.com/). It is a community run conference for Developers (the D's stand for Developer) and I had a great time, I have been to DDD North before but this was the first time going to Nottingham for a conference (I grew up in Nottingham, or a town not far from). As I have said before there is nothing quite like chatting over coffee or lunch with fellow Developers about the tech you are learning about, this was probably my favourite thing about conferences. Now on to the talks:

## Dungeons, Dragons and Developers

[Matt Brunt](https://twitter.com/Brunty) gave an excellent keynote talk, comparing the role playing game Dungeons and Dragons with working on Software projects. A good D&D game involves team work, very like a good Software Team. A team of all wizards isn't going to get you very far, the same way a team full of developers that excel at algorithms, won't be good at testing, talking to customers etc. A wizard that has a secret spell to defeat the Troll under the bridge, is almost as bad as a developer that hordes his knowledge and "saves the day" when things go wrong.  Keeping connected with your team as you go out on your quest so no one gets lost is as important as keeping connected with your software team. 

![](/images/F701q6xXEAAgZk3.jpg)

## Microservice Mistakes

[Matt Hunt](https://twitter.com/DoesDotNet) talked about microservice mistakes he had made.

1) Long lived small teams
2) Can't test by **only** interacting with the frontend
3) Use events as well as API calls
4) Need to be able to deploy independently of each other
5) Have a specific reason for using microservices, a problem to solve

## The Art of the Bad Code Review

A 15 minute lightning talk with [Martyn Kilbryde](https://twitter.com/makitdev) A fun talk showing some examples of bad code reviews, a few takeaways from this:

 - Explain what is being fixed with a link to the ticket
 - Give specific, actionable feedback
 - Balance the boy scout rule of leaving the code better than when you found it with do one thing rule
 - Don't make assumptions -> have a conversation instead
 - Be helpful and constructive, not dismissive and negative
 - Use a branch per ticket, don't tie them together
 - Refer to the requirements
 - No room for ego, code belongs to the team not an individual
 - Avoid overly verbose comments
 - Pragmatism is important
 - If urgent, raise additional tickets with tech debt issues
- Challenge if necessary, but do so respectfully
- Don't do a piecemeal review

## Git Under the covers

Another 15 minute lightning talk with [Dan Clarke](https://twitter.com/dracan) This looked at the inner workings of git, this was fascinating as every part points at another part which is obviously part of the reason git is so powerful. It was quite technical and I am sure some of it went over my head.

![](/images/F71PCBEXsAA4_aJ.jpg)

## This talk could have been a blog post

Another 15 minute lightning talk with [Jamie Tanna](https://twitter.com/JamieTanna). This was a good talk about the importance of blogging. He used the phrase **blogumentation**, now I have heard of this before but not its name. It is where you use your blog to document what you have learnt, it can be anything a new command or a new language or technology. This talk inspired me to write this blog post, Thank you Jamie. His blog can be found at https://www.jvt.me/posts/2023/10/07/why-blog/

## How to create the conditions where happy people do their best work

[Paul Bailey](https://twitter.com/paul_bailey_) introduced the concept of Communities of Practice. Lots of the features of a Community of Practice I have heard of or been in teams that implement. *"Communities of Practice are groups of people who share a concern or passion for something they do and learn how to do it better as they interact regularly"*

![](/images/F71n4uiWYAA4KHL.jpg)

## Building Robots for Complete Beginners

Last talk of the day was my favourite (because it was about Robots) [Mark Goodwin](https://www.linkedin.com/in/mark4security/) talked about building Robots using Rasbery Pi Pico (a microcontroller board), most of his examples used python. His demo can be found at https://github.com/computerist/robot-demos This fascinated me as I have already dipped my toe into this area when playing with [microbits](/posts/2022/microbit/)