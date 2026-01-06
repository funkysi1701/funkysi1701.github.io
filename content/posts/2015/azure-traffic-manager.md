+++
title = "Azure Traffic Manager"
date = "2015-03-12T20:00:45Z"
year = "2015"
month= "2015-03"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["Azure", "DevOps", "ITAdmin"]
categories = ["tech"]
keywords = ["", ""]
description = "Explore Azure Traffic Manager's features to manage downtime effectively and ensure high availability for your websites."
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/posts/azure-traffic-manager/",
    "/posts/azure-traffic-manager-3k9k",
    "/posts/2015/03/12/azure-traffic-manager-3k9k",
    "/posts/2015/03/12/azure-traffic-manager",
    "/2015/03/12/azure-traffic-manager-3k9k",
    "/2015/03/12/azure-traffic-manager"    
]
+++
I have spent most of the day tweaking my Azure websites. Lots of fun!

Last week unfortunately Azure had some problems and many websites that were running in the North Europe data centre were unavailable for several hours. And you guessed it my websites were hosted here.

All hosting providers are going to have downtime from time to time and this is just something you have to take on the chin. The important thing to do in times like these is communicate with your customers about what is going on and that you are doing everything you can to restore service.

However Azure has some amazing features that you can configure to help manage when downtime occurs.

Azure is Microsoft’s global cloud platform. And it really is global, there are data centres in North Europe, West Europe, Brazil, Japan, two more in Asia and five in the US. In the event of problems it is highly unlikely that more than one of these would go down at once. If all of these are unavailable, I expect the planet earth is facing some kind of cataclysmic event and the fact that my website is down is not a priority.

![Azure Traffic Manager](/images/2015/IC750592.jpg) To take advantage of these multiple data centres, Azure has something called a Traffic Manager.

Traffic Manager has various settings but I am using it in failover mode. This means that if one website goes down, the next one is used.

All you need to do is create a traffic manager, add two or more websites to it (called endpoints) and choose a page that needs to be monitored so Azure knows which websites are up and which are down.

If you are using SSL or custom domain names, there are a few extra steps you need to do. Your custom domain name needs pointing at the traffic manager, not the individual websites. The websites themselves have three domain names, the traffic manager address, the azure address and the custom domain name. The SSL certificate can then be assigned to each website that you have added to the traffic manager.

That was easy wasn’t it, and now if a website goes down traffic manager will use the next one. While testing this, the transition to the next website was almost immediate. I did notice that if you had a browser showing the website open during a problem you sometimes got an error page, I think this was probably due to browser caching, reopening a tab or browser fixed this issue.