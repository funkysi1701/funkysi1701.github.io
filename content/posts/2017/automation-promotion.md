+++
title = "Automation of the Promotion of my Blog"
date = "2017-04-17T20:00:45Z"
year = "2017"
month= "2017-04"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["Buffer", "Blogging", "XML",  "RSS"]
categories = ["tech"]
keywords = ["", ""]
description =  "Automation of the Promotion of my Blog"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/automation-of-the-promotion-of-my-blog-1ei0",
    "/posts/automation-promotion",
    "/posts/automation-of-the-promotion-of-my-blog-1ei0",
    "/posts/2017/04/17/automation-of-the-promotion-of-my-blog-1ei0",
    "/posts/2017/04/17/automation-promotion",
    "/2017/04/17/automation-of-the-promotion-of-my-blog-1ei0",
    "/2017/04/17/automation-promotion"
]
+++
I would like to automate the promotion of this blog. Currently to promote this blog on social media I use a few different services.
![](/images/2017/img-buffer-illustration-hub-960@2x.png)

Buffer ([buffer.com](https://buffer.com)) is a service that allows you to schedule updates to the main social media channels (Facebook, Twitter, LinkedIn and Google+)

IFTTT or If This Then That ([ifttt.com](https://ifttt.com)) is a service that allows you to connect different online services. You can send an email when a specific event occurs in your calendar for example.

I have been using a combination of these services to share to social media some of my past blog posts. I then add to my calendar details of my blog posts. Then I use IFTTT to add the event to Buffer, and then buffer tweets on a schedule.

This works great however it is a manual process to add my posts to my calendar. I have been using a spreadsheet to help me generate an ics calendar file which I import into my google calendar. There must be a better way of doing this.

I have written some code that reads the RSS feed of my blog and then shares that to Buffer using the Buffer API. The code I am creating is far from finished however I am trying to use the concepts of clean code to make it as flexible as possible.

I have an interface called ISocial which my buffer code implements, but it would be easy to add a class that implements the same interface but uses the twitter or facebook APIs. My code reads from a specific WordPress RSS feed, but it should be easy enough to adapt to read from a SQL database or any other data source.

I am currently unsure what kind of interface to use for this application. I could create a web page that controls the functionality, or maybe just a windows application, or maybe both of these are complicating things and all I need is just a console application that could be added as a scheduled task.