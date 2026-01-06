+++
title = "Let’s Encrypt is awesome"
date = "2018-04-30T00:00:00Z"
year = "2018"
month= "2018-04"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
copyright = false
cover = ""
tags = ["DevOps", "SSL", "Security"]
categories = ["tech"]
keywords = ["", ""]
description = "Let’s Encrypt is awesome"
showFullContent = false
readingTime = true
aliases = [
    "/lets-encrypt-is-awesome-5d23",
    "/posts/lets-encrypt-is-awesome",
    "/posts/2018/04/30/lets-encrypt-is-awesome",
    "/posts/lets-encrypt-is-awesome-5d23",
    "/posts/2018/04/30/lets-encrypt-is-awesome-5d23",
    "/2018/04/30/lets-encrypt-is-awesome-5d23",
    "/posts/let-s-encrypt-is-awesome-3f5j/"
]
+++
Let’s Encrypt is a free way to get a SSL certificate onto your website and until recently I had never tried it. It is very easy and I think it is awesome.

IIS is the web server software the Microsoft include with Windows 10 and Windows Server. I have it installed on my laptop and it displays the default IIS page.

![](/images/2018/iis.jpg)

It is not really a good idea to host websites on your laptop, use a dedicated web server, or host with a hosting company, however the techniques are the same and it gives me something to write about!

In order to point a domain name at what IIS on my machine was serving up I did the following:

- Do a google search for “whats my IP”, this will return your public IP. Most residential ISPs use dynamic IPs so it may change over time, (which is another reason not to host a website on your laptop!)
- Add an A record on a domain with the IP address you have just got
- Your public IP most likely points at your router not your laptop so enable port forwarding of port 80 and port 443 to the internal IP of your laptop (something like 192.168.0.11 etc)

Now comes the fun Let’s Encrypt stuff!

First you need a Let’s Encrypt client, there are a lot of them out there mostly for linux flavours, however a bit of googling found a windows one. Go to [https://github.com/PKISharp/win-acme/releases](https://github.com/PKISharp/win-acme/releases) and download the zip file and unzip it.

Run the executable from the zip file and follow the onscreen prompts.

![](/images/2018/letsencrypt.jpg)

Press N to create a new certificate.

Then press 1 to bind to single website found in your IIS setup

![](/images/2018/letsencrypt2.jpg)

And now magically Let’s Encrypt knows what you have setup in IIS.

Now all you need to do is enter an email address incase a renewal fails and agree to the let’s encrypt terms and you are all setup.

![](/images/2018/letsencrypt3.jpg)

How awesome and easy is that for getting your websites working with a SSL certificate. If you have IIS configured on a server, give it a try and you can SSL all your things.