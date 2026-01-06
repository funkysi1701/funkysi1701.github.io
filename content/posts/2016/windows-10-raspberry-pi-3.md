+++
title = "Running Windows on Raspberry Pi"
date = "2016-05-05T20:00:45Z"
year = "2016"
month= "2016-05"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["C-Sharp", "Raspberry Pi", "Visual Studio" ]
categories = ["tech"]
keywords = ["", ""]
description =  "Running Windows on Raspberry Pi"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/running-windows-on-raspberry-pi-2868",
    "/posts/windows-10-raspberry-pi-3",
    "/posts/running-windows-on-raspberry-pi-2868",
    "/posts/2016/05/05/running-windows-on-raspberry-pi-2868",
    "/posts/2016/05/05/windows-10-raspberry-pi-3",
    "/2016/05/05/running-windows-on-raspberry-pi-2868",
    "/2016/05/05/windows-10-raspberry-pi-3"
]
+++
Last year you may remember me talking about playing with a Raspberry Pi. Well since then my Raspberry Pi has been sat on a desk collecting dust.

This week I attended Leeds Sharp and the topic was **Running Windows on Raspberry Pi** and this has inspired me again to do something with a Pi.

But first what did I learn.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Here are a couple more of pics of last nights <a href="https://twitter.com/LeedsSharp?ref_src=twsrc%5Etfw">@LeedsSharp</a> <a href="https://t.co/QvlsYjNFvB">https://t.co/QvlsYjNFvB</a> <a href="https://twitter.com/hashtag/RaspberryPi?src=hash&amp;ref_src=twsrc%5Etfw">#RaspberryPi</a> <a href="https://twitter.com/hashtag/MSIoT?src=hash&amp;ref_src=twsrc%5Etfw">#MSIoT</a> <a href="https://t.co/60o4wiiPSv">pic.twitter.com/60o4wiiPSv</a></p>&mdash; Richard Tasker 🇬🇧 (@ritasker) <a href="https://twitter.com/ritasker/status/725970415189909504?ref_src=twsrc%5Etfw">April 29, 2016</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

I had heard that a cut down version of Windows 10 could be installed on the newer Raspberry Pi’s, but I hadn’t really understood how cut down the version of windows is. Having now seen it demonstrated the OS consists of a single page with a few menu options.

The real power of Windows 10 IoT is when you connect remotely to it. There are a couple of ways to do this, PowerShell (check out https://github.com/MicrosoftDocs/windows-iotcore-docs/blob/main/windows-iotcore/manage-your-device/CommandLineUtils.md for a few commands), and of course connecting Visual Studio to your Pi.

When I had previously played with a Pi, it had been with bash scripts and linux commands. The beauty of installing Windows IoT is that you can write c# code, something I do in my day job so theoretically I should find it easier.

The demonstration at Leeds Sharp was pretty impressive. If you are a fan of the Big Bang Theory you may recall Sheldon playing a Theremin. Well it is actually possible to construct a Theremin from a couple of sensors and a Raspberry Pi. The code for which is on [github](https://github.com/ritasker/IoTDemos).

Now that I have been inspired what shall I do?

My Raspberry Pi won’t support Windows 10 IoT, so I need to buy the latest version. I am thinking of buying a kit so I can play about with a breadboard, LEDs and resistors. Maybe not build a robot straight away but certainly try doing something that connects to the GPIO pins.

If you have any suggestions leave a comment below.
