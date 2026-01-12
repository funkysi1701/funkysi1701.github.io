+++
title = "Returning to Blogging: Why I’m Writing Again as a Developer"
date = "2020-09-25T20:00:45Z"
year = "2020"
month= "2020-09"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["Blogging", "Blazor", "DotNet"]
categories = ["tech"]
keywords = ["", ""]
description =  "Back to Blogging"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/back-to-blogging-1ako",
    "/posts/back-to-blogging/",
    "/posts/back-to-blogging-1ako",
    "/posts/2020/09/25/back-to-blogging-1ako",
    "/posts/2020/09/25/back-to-blogging",
    "/2020/09/25/back-to-blogging-1ako",
    "/2020/09/25/back-to-blogging"
]
+++

My last blog post was over six months ago.

Covid 19 has hit the world, and I will be honest I have found it a challenging time.

My Blog had gotten into a bit of a mess. It had become fragmented with different versions of the same thing; I will attempt to explain what has become of my blog.

The original WordPress site can currently be found at https://www.pwnedpass.com/ I would prefer it to be on a sub-domain of funkysi1701.com but for some reason I haven't been able to get that to work, not sure if it is a limitation of my hosting package. I like WordPress, it is very flexible, easy to get blog posts out there. But I want to write content about development and having a site I can tinker with is important to me.

Most of my WordPress blogs have been imported into dev.to and a few extra have been written on this platform. I like dev.to it is a wonderful place to share content and it has one or two extra features I like.

dev.to has an integration with Stackbit/Netlify and this became https://dev.funkysi1701.com. I like having a personal site, but having the same content as dev.to. To add content to this site all I need to do is write it on dev.to and some magic will go on behind the scenes and new content will be published.

However, as a developer I don't like magic, I want to understand what is going on a fiddle with all the settings and make it do what I want.

dev.to has an API, I can build a site in .Net Core and make API calls to fetch the content I want. I understand APIs, I understand .Net and can customise my site exactly how I want it, plus play about with a .net website. This is what https://www.funkysi1701.com is now.

So what have I built so far. I have a Server Side Blazor site running .Net 5. Why Server Side and not Client Side I hear you ask? Well only because I have more experience with Server Side and know how to quickly create a website with that technology, I may change it as time goes by, but we will see.

I have two pages a list of my blog posts and a page that displays the content. Both of these use the dev.to API. I lied, there is a third page I hacked together to do some page redirection from the WordPress URLs. This is something I will change as time goes on.

There are lots of improvements I want to do, there are probably also lots of broken images or links as well. Hopefully, this will result in a good platform to blog about as well as on.
