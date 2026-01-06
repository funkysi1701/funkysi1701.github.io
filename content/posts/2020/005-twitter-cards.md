+++
title = "#005: Twitter Cards"
date = "2020-12-12T20:00:45Z"
year = "2020"
month= "2020-12"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["Twitter"]
categories = ["tech"]
keywords = ["", ""]
description = "It has been a bit of a mad week this week."
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/005-twitter-cards-46eb",
    "/posts/005-twitter-cards/",
    "/posts/005-twitter-cards-46eb",
    "/posts/2020/12/12/005-twitter-cards-46eb",
    "/posts/2020/12/12/005-twitter-cards",
    "/2020/12/12/005-twitter-cards-46eb",
    "/2020/12/12/005-twitter-cards"
]
+++

It has been a bit of a mad week this week. I joined a new team so lots of time learning what's what and also being pulled in two directions as usual demands come through on top of that.

My blog runs on Blazor and I have been making use of JavaScript interop to update the html headers and update the page title to match the blog post article. This works great, I load the page and check the headers and they were saying what I wanted.

The problem was I wanted to add tags for [twitter cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started) This means that when I paste a link to my blog on twitter you get a nice preview and pic of me in the tweet. This was not working at all even though I had the correct headers.

I eventually figured out that the problem was the fact I was using JavaScript to update my headers after the page had been initially loaded. Twitter was fetching my page before these headers got added and therefore couldn't see the twitter card headers. 

My solution was to use invalid html. Not ideal but it works. I added the required html tags in the body of my page using Blazor/C# instead of using JavaScript to add them into the header. Twitter appears to not be fussy in finding them in the wrong place. 

Twitter provides a validator tool at [Twitter Card Validator](https://cards-dev.twitter.com/validator) which my website now passes.

Not much else to say this week, apart from I am missing Visual Studio and C#, I have been mostly using VS Code on Linux and looking at php which isn't as much fun as my usual day job.
