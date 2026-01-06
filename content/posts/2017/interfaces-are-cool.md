+++
title = "Interfaces are cool!"
date = "2017-10-31T20:00:45Z"
year = "2017"
month= "2017-10"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["BadDesign", "Interface"]
categories = ["tech"]
keywords = ["", ""]
description =  "Interfaces are cool!"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/interfaces-are-cool-dde",
    "/posts/interfaces-are-cool",
    "/posts/interfaces-are-cool-dde",
    "/posts/2017/10/31/interfaces-are-cool-dde",
    "/posts/2017/10/31/interfaces-are-cool",
    "/2017/10/31/interfaces-are-cool-dde",
    "/2017/10/31/interfaces-are-cool",
    "/posts/2017/interfaces-are-cool"
]
+++
A while back I [blogged](https://www.funkysi1701.com/posts/interfaces/) about learning about interfaces as I didn’t really understand the value of them. I do now.

I created an application that used interfaces so I could learn how it worked. I created a Logger Interface and created multiple classes that implemented that interface so I could swap out the different implementations easily. I created a SQL Logger and a File Logger and my code could be written and be completely unaware of which implementation it was using.

This application uses SQL Azure and so I have a monthly bill to pay. Wouldn’t it be cool if I could reduce this bill? How about using the cheaper table storage instead?

**Easy!**

Create a new class that implements my interface and all I need to do is write the three methods defined in my interface and I can swap from SQL Azure to table storage.

Another benefit to interfaces is testing. Say I have an interface called inotification for sending notifications, I can have several implementations of this email, twitter, slack etc

None of these implementations should be used in unit tests, as you don’t want a tweet being sent every time you run your tests. Why not create an implementation that simply returns something for each method call and doesn’t actually do anything. I can then run my tests with my fake implementation which tests my code logic but not the implementation I have chosen (this can be tested later on with integration tests or user testing if required).

This is pretty much all I have to say about interfaces. I just like how I can swap different implementations.

It does take a bit of work to get the interface setup. I found that when writing the second implementation the interface would need to change slightly, mostly as it was badly designed to begin with. I think for beginners there may be some value to writing multiple implementations of an interface so you can be sure your interface is good, however I am sure with experience this will not be required.
