+++
title = "Sudoku Challenge"
date = "2015-06-26T20:00:45Z"
year = "2015"
month= "2015-06"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/2015/06/2000px-Sudoku-by-L2G-20050714.svg_.png"
images =['/images/2015/06/2000px-Sudoku-by-L2G-20050714.svg_.png']
tags = ["Dojo", "C-Sharp", "LeedsSharp"]
categories = ["tech"]
keywords = ["", ""]
description =  "Sudoku Challenge"
showFullContent = false
readingTime = true
copyright = false
draft = false
aliases = [
    "/posts/sudoku-challenge",
    "/posts/sudoku-challenge-1gdd",
    "/posts/2015/06/26/sudoku-challenge-1gdd",
    "/posts/2015/06/26/sudoku-challenge",
    "/2015/06/26/sudoku-challenge-1gdd",
    "/2015/06/26/sudoku-challenge"
]
+++
Last night I went to a Code Dojo at Leeds Sharp (the coding user group I have started going to). A Code Dojo is a programming challenge that people work on usually in pairs.

The challenge that we worked on was to code a solution to the puzzle game Sudoku. The code we worked with can be found on github.

![](/images/2015/06/2000px-Sudoku-by-L2G-20050714.svg_.png)

I don’t know much about Sudoku but the game goes like this. You start with a 9×9 grid, and the idea is to fill in all the missing numbers.

Each Row can only use each digit 1 to 9 once, each column can only use each digit 1 to 9 once and each subgrid (3×3) can only use each digit once.

I worked with Richard one of the Leeds Sharp organisers, we started by trying to loop through each empty cell and insert values in a brute force attack, but this approach didn’t get us very far (literally as the application crashed!)

The approach that we needed to use was to loop through calculating possible values.

It was only when I sat down at this dojo did I realise how much I still have to learn, but while talking with Richard about different approaches and different coding structures I started to learn.