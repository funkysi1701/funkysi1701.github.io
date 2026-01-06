+++
title = "Office Move"
date = "2017-05-01T20:00:45Z"
year = "2017"
month= "2017-05"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["ITAdmin", "Routers", "Servers", "OfficeMove"]
categories = ["tech"]
keywords = ["", ""]
description = "Office Move"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/office-move-2khb",
    "/office-move",
    "/posts/office-move",
    "/posts/office-move-2khb",
    "/posts/2017/05/01/office-move-2khb",
    "/posts/2017/05/01/office-move",
    "/2017/05/01/office-move-2khb",
    "/2017/05/01/office-move"
]
+++

![New Rack](/images/2017/20170422_191127-e1493403982560-169x300.jpg)For the past few weeks my software developing has been taking a back seat as I planned and coordinated the IT requirements of an office move.

The company I work for has been working out of a converted barn, but as the company has grown we have outgrown the building and for quite a while it has been a real squeeze to get everyone in. We now have a shiny new offices with plenty of room for growth.

It was at the start of the year when I first started getting involved with the new office. At that time building work was about to begin. The office had concrete floors so in order to get network and power points in the floor, channels would have to be cut into the concrete for the floor boxes and cable runs.

At the old office our servers were in a cabinet in the corner of the room which meant they could be quite loud especially when the fans were going full pelt. Our American owners were supplying brand new IT equipment and we would have a dedicated server room.

Soon a weekly conference call was setup so we could coordinate with the IT people in America and the various different contractors that would help deliver our new office.

One thing I was particularly proud of was YDS. York Data Services (YDS) is an ISP I have worked with in the past at a previous job and I was able to continue my relationship with them and they were contacted and became our primary internet supplier.

Unfortunately most ISPs have to deal with BTOpenreach who have a bit of a monopoly on getting phone lines or leased lines installed. The initial estimate we were given was two weeks after we were due to move in. It was looking like we would move in and two weeks later we would get an internet connection. We were in the process of getting quotes for a temporary internet connection when BT contacted us and could get us connected up. ![New Office](/images/2017/18121045_1302238519862436_8711390769620542649_o.jpg)

Soon afterwards a huge cabinet and two pallets full of equipment was delivered. Two days later a team was dispatched to rack everything up. On the rack we had the following equipment: 4 x UPS, 4 x Network Switches, 2 x Routers (for 2 x Leased Lines from different providers, the secondary connection has not been installed yet), 2 x Palo Alto Firewall devices, 2 x New Servers.

Just prior to our move we had a rack full of equipment but no patch cables, nothing connected up and I was beginning to get concerned that we would not be ready in time.

Thankfully a team was dispatched to help out over the weekend of the move, with the patch cables being delivered only hours beforehand. I worked closely with them and we worked late into the night. By the end of the Friday night our domain controller had been moved and its IP address updated. DHCP scopes had been setup for the new network. Once that was done we could get the WiFi points connected up (These had already been fitted to the ceiling).

The following day we moved our existing servers and updated their IP addresses and got everything patched up. Furniture started arriving so desks could start being setup and phones connected up. Everything was slotting into place, and for the first time our new office was starting to look like an office.

By the time it got to Monday the only problem was the phone number had not transferred as requested (something else to blame on BT) All staff could either connect via an Ethernet cable or connect to our brand new WiFi network and had access to all the IT services they had at the old office. Another minor issue was the NAS we used for backups had to be reset as it couldn’t communicate with the domain so no one could login, luckily this didn’t affect the data on it.

From my perspective the move was a massive success considering how complex and how many different people had been involved.
