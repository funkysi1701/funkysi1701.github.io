+++
title = "Why Every Developer Should Have a Personal Website"
date = "2022-01-25T20:00:45Z"
year = "2022"
month= "2022-01"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/WHAT-IS-THE-CORPORATE-WEBSITE.jpg"
images = ['/images/WHAT-IS-THE-CORPORATE-WEBSITE.jpg']
tags = ["website", ""]
categories = ["tech"]
keywords = ["", ""]
description = "Is it to share my ideas? Is it to learn new technologies and techniques? Is it to create a following? Is it to educate others? Is it to build some kind of service? Is it some combination of all of these."
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/why-do-i-have-a-website-1m5l",
    "/posts/why-do-i-have-a-website/",
    "/posts/why-do-i-have-a-website-1m5l",
    "/posts/2022/01/25/why-do-i-have-a-website-1m5l",
    "/posts/2022/01/25/why-do-i-have-a-website",
    "/2022/01/25/why-do-i-have-a-website-1m5l",
    "/2022/01/25/why-do-i-have-a-website"
]
+++

Is it to share my ideas? Is it to learn new technologies and techniques? Is it to create a following? Is it to educate others? Is it to build some kind of service? Is it some combination of all of these.

## History 

Back when the web was young and I was first learning HTML.  I hand crafted web pages, adding photos I had taken with captions. If I needed a new page I just added a new html page and linked to it from another page.

As time went on I started to learn mysql and php and my website became a hand crafted php nightmare. I also applied what I learned to help my father run the website for his camera club.

At some point I started playing with WordPress. I have had various WordPress websites or blogs over the years. WordPress is very powerful you can do so many things, install so many plugins. WordPress runs on php and mysql and as my career started to centre around the .net space, I started to want something that was similar, so I could apply things I had learnt to my own website. 

This has led me to the current state of my website. I have a WordPress blog, with most of my oldest content, my newer content lives on dev.to and I have a Blazor webassembly site that uses the dev.to api to run my new website.

Blazor webassembly is great, however it has some limitations which I am starting to push against. To host this as cheaply as possible I am using Azure static web apps, so no .net backend all the website is front end. I have some Azure Functions that does the backend bits that I need.

Google and other bots are not able to find any of my pages except index, due to the way Blazor works. I have got round this by pre rendering the content using https://prerender.io/ 

My next difficulty is how to generate a sitemap.xml or a rss feed for my blog. This has started to make me question my architecture decisions.

I could use a hosted solution like [ghost](https://ghost.org/) which is popular with a some of my peers. This would solve many of the problems I am currently facing but I wouldn't be able to play with everything as it is hosted and therefore someone else's problem. How important that is I will look at later.

Another option would be to use github pages, there are quite a few ways to publish a github page, [Jekyll](https://jekyllrb.com/) and [Hugo](https://gohugo.io/) appear to be the most popular. Both produce static content and both are a new for me to learn. Interestingly I could also publish either to Azure Static Web apps if github pages ends up not being suitable.

## Split in two

I think my website needs to be split in two. I need a stable blog platform probably using Hugo and github pages. This is what I want to get indexed by the search engines and be the primary way people find out about what I am doing.

I then have additional sites, that I use as my playground for learning new tech. I can easily link between them and I can tweak the style so they "fit" nicely together.

I am still considering what to do with dev.to. I like that I am using it as the backend for my blog posts, and its API gives me that flexibility to display that content where I want.

