+++
title = "Learning R"
date = "2017-02-27T20:00:45Z"
year = "2017"
month= "2017-02"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/2017/Exchange-Rate-Calculator.jpg"
images = ['/images/2017/Exchange-Rate-Calculator.jpg']
tags = ["ExchangeRates", "R"]
categories = ["tech"]
keywords = ["", ""]
description =  "Learning R"
showFullContent = false
readingTime = true
copyright = false
draft = false
aliases = [
    "/learning-r-2p31",
    "/learning-r",
    "/posts/learning-r",
    "/posts/learning-r-2p31",
    "/posts/2017/02/27/learning-r-2p31",
    "/posts/2017/02/27/learning-r",
    "/2017/02/27/learning-r-2p31",
    "/2017/02/27/learning-r"
]
+++

![R](/images/2017/Exchange-Rate-Calculator.jpg)Today I spent some time learning the R language.

The problem I was trying to solve was to convert local prices of some items into Euros. I had been using a fixed exchange rate for all data, but as exchange rates fluctuate so much this is incorrect.

My first though was to find a free API that I could query to get the values I wanted. The first API I found didn’t cover all the currencies, the next one I found I burnt through the free allowance in one pass.

A colleague of mine mentioned using R to solve this, he sent me some links and I set out to write my first piece of R code.

My finished code can be found on [github](https://github.com/funkysi1701/ExchangeRate/blob/master/script.R) and I will attempt to explain some of it.

R defines functions fairly simply

```r
nameoffunction <- function(arg1, arg2)  
{  
  arg1 * arg2  
}
```

I have created a function that takes 2 parameters date and currency. I know I have about 10 different currencies that I want to get currencies for and I want to loop through each day so I will need to pass in a date.

The source of my exchange rate information is the www.xe.com website, its historical exchange rate page passes currency and date into the query string so I should be able to build up a string containing all the different elements.

All programming language can concatenate strings and R is no different. R uses paste()

```r
var <- paste("Hello", "World")
```

However R has an annoying feature in this function. I would expect that var in the above example would contain "HelloWorld", it doesn’t it contains "Hello World". Why it automatically adds a space I don’t know?

```r
var <- paste("Hello", "World", sep="")
```

I am not entirely sure what all of the code does but I can take a good guess.

read_html() I would guess loads a html page, html_nodes() finds all the html tags of a certain type on the page, in my case \<table>, html_table() reads the first table it finds.

table1[2] selects the second column, and head() selects a specific number of rows. I want the first row and second column so I combine these two as head(table1[2],1)

Now that I have found my exchange rate what do I do with it? R can read and write to SQL Server so why not store this info in a SQL lookup table. I can then use this data in a stored procedure when I process my data.

To query sql you can use sqlQuery(), it has two parameters, a sql connection and a TSQL command (eg a SELECT, INSERT, UPDATE statement)

I use a while loop to loop through every day between 1st October 2016 and today and look up the exchange rate for each currency.

For now I am manually running this R script, however there are ways to run R directly from SQL Server which I may well investigate. I could then have a SQL job to run this on a schedule, maybe once a day to get the latest exchange rates. I also would like to do something a bit cleverer like only getting exchange rates for the days that I need them by querying existing database tables.