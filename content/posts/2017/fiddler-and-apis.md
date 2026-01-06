+++
title = "Fiddler and APIs"
date = "2017-06-19T20:00:45Z"
year = "2017"
month= "2017-06"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["", ""]
categories = ["tech"]
keywords = ["", ""]
description = "A while ago I blogged about promoting my blog with Buffer. At the time I made use of the nuget package BufferAPI but lets look at some improvements I can make."
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/fiddler-and-apis-1304",
    "/posts/fiddler-and-apis/",
    "/posts/fiddler-and-apis-1304",
    "/posts/2017/06/19/fiddler-and-apis-1304",
    "/posts/2017/06/19/fiddler-and-apis",
    "/2017/06/19/fiddler-and-apis-1304",
    "/2017/06/19/fiddler-and-apis"
]
+++

A while ago I blogged about [promoting](https://www.funkysi1701.com/2017/04/17/automation-promotion/) my blog with Buffer. At the time I made use of the nuget package [BufferAPI](https://www.nuget.org/packages/BufferAPI/) but lets look at some improvements I can make.

The BufferAPI package worked great from my console app, but when I tried to use it from a Controller in an MVC app I never got it to work. Lets look at the API docs and see if I can rewrite it.

There are two main types of API calls GET which gets data from the server and POST which posts data to the server. These come from the types of HTTP requests.  

![Alt Text](/images/2017/6wozrfdoqvtjaoxs7j1v.jpg)

I quickly figured out how to use the GET API call to authenticate using https://api.bufferapp.com/1/profiles.json?access_token=XXXX

However POST was defeating me. That was until I remembered [Fiddler](http://www.telerik.com/fiddler).

I had heard Troy Hunt (and others) talk of using Fiddler to examine what data is being passed among websites. Troy uses it to do a man in the middle test to see what information can be stolen.

It is really easy to setup, install Fiddler, click yes to a few security warnings and you can see what information is being passed from your code to remote APIs.

Once I had Fiddler installed I could compare what information is being passed between a successful API call using the BufferAPI nuget package and an unsuccessful API call using my code.

Fiddler also showed that passing my authentication token in a POST request is much better. Despite both GET and POST being encrypted when using HTTPS, anything at either end that logs URLs will have a log of your username and password.

If you have not tried Fiddler, give it a try especially if you are doing things with API calls.
