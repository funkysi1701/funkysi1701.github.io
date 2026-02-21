+++
title = "Rediscovering BASIC: Programming Nostalgia and Lessons Learned"
date = "2021-12-28T20:00:45Z"
year = "2021"
month= "2021-12"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/FHi_NyOXEAo9YbG.jfif"
images = ['/images/FHi_NyOXEAo9YbG.jfif']
tags = ["BASIC", "History", "Lynx"]
categories = ["tech"]
keywords = ["", ""]
description =  "Writing BASIC for the Lynx"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/back-to-basic-3c83",
    "/posts/back-to-basic/",
    "/posts/back-to-basic-3c83",
    "/posts/2021/12/28/back-to-basic-3c83",
    "/posts/2021/12/28/back-to-basic",
    "/2021/12/28/back-to-basic-3c83",
    "/2021/12/28/back-to-basic"
]
+++

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">How exciting my Lynx Computer from my childhood has come home, all 96k of it <a href="https://t.co/aeN38KBiS8">pic.twitter.com/aeN38KBiS8</a></p>&mdash; Simon Foster (@funkysi1701) <a href="https://twitter.com/funkysi1701/status/1475139125154037760?ref_src=twsrc%5Etfw">December 26, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

I can't remember the syntax for BASIC, luckily I have been able to find the [Manual](https://elborg.dk/books.html).

All the commands are listed inside so lets see what we can do.

The Lynx presents you with a command prompt in which you can type text. Back in the 80s we had a tape player to load programs from tape, however I don't have one today so only programs I write can be run.

PRINT - To write Hello World, you can just type PRINT "Hello World" and Hello World appears on the screen. To Write a program that displays Hello World, you just write the line number first.
```
10 PRINT "Hello World"
```
To run this you type RUN
To view the code you type LIST

To Edit a specific Line you can use Ctrl+E and type the line number, or you can just write the line out again.

CLS - This command clears the screen

INPUT N - stores text typed by the user and stores it in the variable N

GOTO N - Execution of code continues at Line Number N

The first Program I wrote with a bit of help from my boys.
```
10 CLS
20 PRINT "What is your Age?"
30 INPUT N
40 IF N>5 AND N<41 THEN PRINT "a good age" 
50 ELSE IF N<6 THEN PRINT "a spaceman"
60 ELSE IF N>40 THEN PRINT "too old"
```
My 4yo didn't like being "too young" in the original version, so my 6yo helped me change him to be a "spaceman".

Not bad and it was fun pair programming with a 6yo, all my typos were quickly spotted, and he easily understood the logic of IF/ELSE/THEN statements.

The Lynx comes from 1983 and has just 96k of memory. I am very lucky it actually still works, however I have been able to find an emulator so I can write Lynx BASIC from the comfort of my laptop. [jynxemulator](https://jynxemulator.wordpress.com/), it is also on [github](https://github.com/jonathan-markland/Jynx) but it doesn't include the ROMs so getting from the website is a better option.

The developer experience today is so much nicer than it must have been in the 1980s, however back then distractions must have been much reduced.

- No internet or google to get answers to your questions
- No Copy/Paste of text
- No Load/Save (unless you have a working disk drive or tape player!)
- No IDE
- No Build or Release process just type RUN

I then have additional sites, that I use as my playground for learning new tech. I can easily link between them and I can tweak the style so they "fit" nicely together.

I am still considering what to do with dev.to. I like that I am using it as the backend for my blog posts, and its API gives me that flexibility to display that content where I want.