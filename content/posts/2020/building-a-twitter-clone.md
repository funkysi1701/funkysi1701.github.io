+++
title = "Building a Twitter Clone"
date = "2020-12-22T20:00:45Z"
year = "2020"
month= "2020-12"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["Twitter", "Design", "Architecture"]
categories = ["tech"]
keywords = ["", ""]
description = "I saw a tweet about building a twitter clone being harder than you would think. So this of course started me thinking how I would go about building something like that."
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/building-a-twitter-clone-2h0c",
    "/posts/building-a-twitter-clone/",
    "/posts/building-a-twitter-clone-2h0c",
    "/posts/2020/12/22/building-a-twitter-clone-2h0c",
    "/posts/2020/12/22/building-a-twitter-clone",
    "/2020/12/22/building-a-twitter-clone-2h0c",
    "/2020/12/22/building-a-twitter-clone"
]
+++

I saw a tweet about building a twitter clone being harder than you would think. So this of course started me thinking how I would go about building something like that.

Ok so where would I start? First a few assumptions.

1) Development by a lone developer ie me
2) Tech stack will be dotnet and other tech I am familiar with
3) Database backend, probably SQL Server but I might use table storage for cost reasons should I try and actually build this. However if I design this well this should be something that could be swapped out as the system grows
4) User accounts on the system will be small as I can't imagine anyone ever signing up. Why sign up to a social media platform with no users?

## I guess the next question is what is Twitter?

A website that allows you to share 280 characters of text with your followers, allows you to follow other users updates and allows other user to follow your updates.

It also has an API that allow you to do almost everything that you can with the website.

Then there are of course mobile apps to consider but I am going to assume this is out of scope, however assuming a good enough API then this shouldn't be a problem for future development.

## First Steps

To start off with I would concentrate on the API, and then build a web client that makes use of the API.

So what would my MVP (minimum viable product) be?

1) User can authenticate with my API to get a token which allows access to other API endpoints
2) User can create a tweet
3) User can view own tweets
4) User can view tweets of another user
5) User can view tweets in their timeline
6) User can follow/unfollow other users
7) User can search for other users
8) User can search for keywords in tweets

I think that is probably sufficient to build my MVP for the API.

An interesting side note is that I could use the OAuth Twitter authentication to allow users to login to my twitter clone with the real twitter login details. However this makes no sense to me as we are essentially adding a dependency on the real twitter.

So what would I use for the frontend? I would start off with a Client Side Blazor frontend. Once I had a proof of concept that worked, I would think about styling and adding the UI elements that are familiar to twitter users.

The beauty of Client Side Blazor is that I can host cheaply in azure storage and distribute around the world via a CDN.

Due to the high number of times that follower and following count and other stats are queried I would consider storing these in the database and include a regular job to recalculate them so they don't get out of sync with the data.

Having said all of this I am very tempted to fire up Visual Studio and see how far I get, and what problems I encounter along the way.
