+++
title = "How much does it cost?"
date = "2023-02-04T00:00:00Z"
year = "2023"
month= "2023-02"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
copyright = false
cover = "/images/monthly-costs.png"
images = ['/images/monthly-costs.png']
tags = ["Azure", "Website", "Side Project", "Costs" ]
categories = ["tech"]
keywords = ["", ""]
description = "How much does it cost?"
showFullContent = false
readingTime = true
aliases = [
    "/how-much-does-it-cost-2b3d",
    "/posts/how-much-does-it-cost/",
    "/posts/how-much-does-it-cost-2b3d",
    "/posts/2023/02/04/how-much-does-it-cost-2b3d",
    "/posts/2023/02/04/how-much-does-it-cost",
    "/2023/02/04/how-much-does-it-cost-2b3d",
    "/2023/02/04/how-much-does-it-cost"
]
+++

How much does it Cost to run my side projects? This is going to be an interesting look at my spending, hopefully it can show you can do a lot without breaking the bank!

I have a personal Azure subscription that I pay for myself. I don't use anything connected to my work, as jobs change and I don't want to have to shift stuff if I change employers (which happened quite recently). I like Azure, and I like learning what I can do with it, so spending small amounts on a personal subscription is not a problem for me.

This is how much Azure is costing me daily, I like to keep an eye on this chart fairly often so I can see if I get any increases, especially if I have added a new service.

![](/images/daily-costs.png)

This is my monthly charges over the last few months. In Sept/Oct I switched from CosmosDB to Mongo DB Atlas as my database backend. Experience has told me that my biggest charge is data storage, websites are cheap but any database or storage is what tends to cost the most.

![](/images/monthly-costs.png)

This website you are reading this on (assuming you are not on DevTo or Hashnode) is running Hugo which runs on an Azure Static Web App, the free tier so almost free. I have two of these, a production one and a test one. Source code is on Github (another free service), and auto deploys via Github actions. I have a load of images which I have stuffed in blob storage from when I used to run a wordpress site, the cost for file storage is minimal.

I also have a service I built using Azure Functions and Static Web Apps which makes use of public APIs like (Twitter/Mastodon/GitHub etc), data for this is stored in the free tier of Mongo DB Atlas. I then use consumption tier Azure Functions and Free Static Web App to do stuff. The definition of what I have deployed is all setup in Pulumi, so I have identical environments for Dev/Test/Prod mostly because I can rather than it being business critical or getting a lot of traffic. 

I currently have 240Mb of data in my free MongoDb database, I have 512 Mb max storage to play with. I have plenty of data to play with at this tier, but I may investigate other options that involve storing less or what costs might be. I previously made use of cosmosDB, which was costing me between £10-£20 per month, so not breaking the bank, but also cheaper to use MongoDB.

Interrogating the Azure Cost Analysis tool reveals that my biggest cost is file storage (67p Prod, 101p Test and 93p Dev), I may investigate this a bit and see what is using this, but its not breaking the bank so I am pretty happy.

So what else does it cost to run my things?

My domains live on CloudFlare, I recently got a bill for £8.04 for a couple of renewals for the next 12 months. But I am struggling to think what else costs me to run my digital things.
