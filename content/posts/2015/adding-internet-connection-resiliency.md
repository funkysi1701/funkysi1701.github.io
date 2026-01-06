+++
title = "Adding Internet Connection Resiliency"
date = "2015-09-24T20:00:45Z"
year = "2015"
month= "2015-09"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/2015/internet-connection-drops-every-couple-minutes-cable-sxchu-internet1.jpg"
images =['/images/2015/internet-connection-drops-every-couple-minutes-cable-sxchu-internet1.jpg']
tags = ["Fibre", "VPN", "Internet"]
categories = ["tech"]
keywords = ["", ""]
description = "Explore options for adding a failover internet connection to ensure business continuity and improve network resiliency."
showFullContent = false
readingTime = true
copyright = false
draft = false
aliases = [
    "/adding-internet-connection-resiliency-o1a",
    "/posts/adding-internet-connection-resiliency",
    "/posts/adding-internet-connection-resiliency-o1a",
    "/posts/2015/09/24/adding-internet-connection-resiliency-o1a",
    "/posts/2015/09/24/adding-internet-connection-resiliency",
    "/2015/09/24/adding-internet-connection-resiliency-o1a",
    "/2015/09/24/adding-internet-connection-resiliency"
]
+++

I have been asked to investigate adding a fail over internet connection to one of our offices.

Currently this office is connected via a wireless link with our head office. Unfortunately we have recently experienced some poor performance with this connection, this has now been corrected but like all technology there is the chance of it failing in some way in the future and causing loss of business because of it.

## Internet Connection

This is one of my first considerations. I need a reliable internet connection and there are a lot of options to consider, lets look at a few.

![Internet Connection](/images/2015/internet-connection-drops-every-couple-minutes-cable-sxchu-internet1.jpg)

**ADSL Connection** This is your standard internet connection that most homes have, you get around 20Mb/s download but only 2Mb/s upload for a fairly low price per month. Speeds are dependent on area and the quality and distance from your exchange, some rural areas have speeds much lower than this. As this connection is for an office I want the best connection I can afford so would rather not go down this option if I can avoid it.

**FTTC (Fibre to the Cabinet)** This is what ISPs typically mean when they say superfast broadband. The cables that have been laid to your exchange cabinet have been upgraded to fibre optic cables which are capable of much faster transfer speeds (eg 40Mb/s download and 10Mb/s upload). This is my ideal choice, however BT Openreach are responsible for upgrading the country to these cables and they are not very quick about it. A few years back when investigating this FTTC had almost reached our office, but when I investigated today nothing seems to have progressed. Both FTTC and ADSL require a phone line into the office to run on.

**Leased Line** This is where your ISP connects a dedicated line to your office which provides you a much faster connection (upload and download speeds are the same) but this is very expensive. We have this for our head office as this is where our servers are located and the faster speed benefits the entire company. We do not want to do this for every branch office as it will be too expensive.

**Spur from a Leased Line** It could be possible to branch or spur off the leased line to our second office. This would be one leased line that terminates in two locations instead of one. However due to the distances involved I do not think this will be possible in my case and may end up costing as much as a second leased line.

**ISP** As well as the type of connection I need to decide who will provide it. There are hundreds of ISPs out there but I like to use ISPs that have a good reputation or I have used in the past and have been happy with. I do not stick with one ISP for all my connections as I like to have some connections that continue to work should that ISP be experiencing problems. ISPs that I would recommend are YDS, Eclipse and PlusNet

**Money Off** While I am talking about internet connections the government has been offering a scheme offering businesses money off upgrading their connections to a superfast connection (either FTTC or Leased Line) More information can be found on your councils website, If you have an office in York have a look here for more details. We got £3000 off installation so worth investigating if you qualify.

## VPN Connection

Offices require access to far more resources than just the internet. This particular office requires access to our email and database servers as a bare minimum. One way to access a remote offices network resources is through a VPN (Virtual Private Network) connection. So my next consideration is how to establish a VPN link between our offices.

**Software** Windows Server includes RRAS (Routing and Remote Access Service) which you can use to configure a VPN connection. One important thing to note is that the server needs at least two network connections, one on the internet with a public IP and one on the internal network.

**Hardware** The more expensive routers often have settings that allow the configuration of a VPN connection.

I have used both of these methods in the past. RRAS is a pain to work with but has evolved with the newer versions of windows server, so may not be as bad as I remember. Using a router to do VPN introduces its own set of problems and there is no guarantee of avoiding RRAS, you may still need it to authenticate the VPN provided by your router.

## Multiple Connection Handling

Internet connectivity is being provided in two ways, the primary way is via a Wireless link and the second way is via one of the options above.

There are lots of options to deal with multiple connections, do I want to load balance both connections and use them all the time, do I want to fail over onto the second connection only if the first one fails, or do I want it to be a manual process or switching over to the backup network if problems occur.

As you can see there are lots of different technologies to consider before I can add resiliency to this office and I haven’t even started to think about if an additional server will be required.
