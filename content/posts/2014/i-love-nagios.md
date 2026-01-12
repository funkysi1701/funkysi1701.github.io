+++
title = "I love Nagios"
date = "2014-09-24T20:00:45Z"
year = "2014"
month= "2014-09"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/2014/nagios.png"
images =['/images/2014/nagios.png']
tags = ["ITAdmin", "Monitoring", "Servers", "Nagios"]
categories = ["tech"]
keywords = ["", ""]
description = "An overview of Nagios, an open-source server monitoring tool, and its effectiveness in modern IT infrastructure."
showFullContent = false
readingTime = true
copyright = false
draft = false
aliases = [
    "/i-love-nagios-m6",
    "/posts/i-love-nagios",
    "/posts/i-love-nagios-m6",
    "/posts/2014/09/24/i-love-nagios-m6",
    "/posts/2014/09/24/i-love-nagios",
    "/2014/09/24/i-love-nagios-m6",
    "/2014/09/24/i-love-nagios",
    "/posts/2014/i-love-nagios/"
]
+++

![Nagios](/images/2014/nagios.png)

You may not have heard of Nagios but it has saved my bacon quite a few times.

Nagios is an open source server monitoring application that runs on many linux flavours.

I can’t remember exactly when I first installed nagios but I am guessing it was sometime in 2007/8. My boss gave me a book about it (which I never read) and told me to create a system to monitor the companies servers.

Nagios is not simple to set up. It relies on setting up various Hosts and services. Hosts are usually physical servers that you want to monitor and services are all the services you want to monitor. As this is a linux program all these can be configured by editing the right config file

Nagios is very flexible and can be expanded easily with the use of plugins, if you want to monitor something there is usually a plugin available. If you have a dell server running openmanage software there is even a plugin that allows the temperature of your server to be monitored.

If you want to monitor windows servers the use of nsclient++ is a real advantage. This is a simple client that runs as a service on your windows server. This allows nagios to track memory, cpu, disk space, performance and services, in fact almost everything that you would want to monitor.

Over the years I have kept a close eye on Nagios and added extra checks as new services were added or problems encountered. A few years ago I dabbled with sending alerts out via SMS message and once I got a smart phone found an app to keep track of Nagios 24/7.

But recently I have started wondering if Nagios is the best way to monitor modern servers like 2012 or remote services like Azure. I want something that is easy to expand as your IT infrastructure expands. Something that relies on running on a linux OS requires your IT staff have a knowledge of linux and you keep that server maintained and updated.

My question is: Is Nagios still the best way to monitor my servers?
