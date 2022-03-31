+++
title = "Game of Life"
date = "2015-02-11T09:00:45Z"
year = "2015"
month= "2015-02"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "https://storageaccountblog9f5d.blob.core.windows.net/blazor/wp-content/uploads/2015/02/Gospers_glider_gun2.gif"
images = ['https://storageaccountblog9f5d.blob.core.windows.net/blazor/wp-content/uploads/2015/02/Gospers_glider_gun2.gif']
tags = ["Java", "Programming"]
category="tech"
keywords = ["", ""]
description =  "Game of Life"
summary = "Game of Life"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/posts/game-of-life/",
    "/posts/source-code-for-game-of-life-2eo3",
    "/posts/2015/02/11/source-code-for-game-of-life-2eo3",
    "/posts/2015/02/11/game-of-life",
    "/2015/02/11/source-code-for-game-of-life-2eo3",
    "/2015/02/11/game-of-life"
]
+++

Many, many years ago I tried to learn Java. I didn’t get very far but one of the things I built was The Game of Life.

Unfortunately I can not find the code I wrote, probably a good things as it is probably amusingly bad.

Now you are probably asking what is the [Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)? The game of life, sometimes called cellular automation, is a simulation of cells being born and dying. It is sometimes called Conway’s Game of Life after the British mathematician who devised it in 1970.

![](https://upload.wikimedia.org/wikipedia/commons/e/e5/Gospers_glider_gun.gif)

The game has several rules:

1. Any cell with less than three neighbours will die on the next turn
2. Any cell with three neighbours lives on to the next turn
3. Any cell with more than three neighbours will die on the next turn
4. Any dead cell with three live neighbours will be born on the next turn

Now I had not thought about this game until the other day when I came across a [blog](https://chaosnil.wordpress.com/2015/02/09/new-project-conways-game-of-life-in-every-language/) and a [github page](https://github.com/chaomodus/gameoflife) which sparked my interest again. This version is written in javascript, but the blog mentions a desire to build this program in many different languages. I want to build this with visual studio in C# as it should provide a good training exercise.

There are several problems I need to overcome to achieve this, I am currently trying to work out how to "draw" the cells. My current thinking is that maybe I can code it using characters to display the cells and then replace with pixels once I have the logic correct. Well lots for me to learn!