+++
title = "MakeCode and the BBC micro:bit"
date = "2022-08-21T18:00:45Z"
year = "2022"
month= "2022-08"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/blocks.png"
images = ['/images/blocks.png']
tags = ["Scratch", "kids", "MakeCode", "Microbit"]
categories = ["tech"]
description = "Explore MakeCode and the BBC micro:bit. Learn how to introduce kids to programming with fun and interactive projects using these powerful tools."
showFullContent = false
readingTime = true
copyright = false
featured = false
aliases = [
    "/makecode-and-the-bbc-microbit-584",
    "/posts/microbit",
    "/posts/2022/08/21/microbit",
    "/posts/makecode-and-the-bbc-microbit-584",
    "/posts/2022/08/21/makecode-and-the-bbc-microbit-584",
    "/2022/08/21/makecode-and-the-bbc-microbit-584"    
]
+++

Programming is in my DNA, so when I had children it was obvious that I would attempt to share my passion. It has taken a while, for some reason for loops don't interest toddlers! However my 7 year old son has got a taste for it now. 

<img src="/images/getcoding.jpg"  style="float:left; padding-right: 15px; " />

It was his birthday the other day and he got quite a few tech related things. First off he got some programming books. [Get Coding!](https://www.amazon.co.uk/gp/product/1406366846/ref=ppx_yo_dt_b_asin_title_o02_s01?ie=UTF8&psc=1), [Coding for Kids: Scratch:](https://www.amazon.co.uk/gp/product/1641522453/ref=ppx_yo_dt_b_asin_title_o02_s00?ie=UTF8&psc=1) and [Coding for Kids: Python:](https://www.amazon.co.uk/gp/product/1641521759/ref=ppx_yo_dt_b_asin_title_o01_s00?ie=UTF8&psc=1)

He has been reading an old Javascript book, so I wanted to get him something a bit more up to date, so the Get Coding book should give him the basics of creating webpages and doing things with Javascript. He has been also been playing with [Scratch](/posts/scratch) for a while so the second book will definitely interest him. He also keeps mentioning Python, which I know nothing about, so even if he never reads it, I have something new to learn!

As well as the books he got a BBC micro:bit (with some accessories!) from his grandparents. He has been playing with [MakeCode](https://makecode.microbit.org/#) which features a simulator of a micro:bit, so I thought he might like having a physical device in his hands. 

He has loved playing with it so far, and I have loved working with him. Already we are at the point where he knows where to find some of the blocks he needs to write the programs, and is telling me I am looking in the wrong place!

In case you are not familiar with MakeCode it is a block based programming language similar to Scratch. You drag blocks onto the screen which represent if statements or variables or loops etc. The micro:bit section of the site, simulates a [BBC micro:bit](https://microbit.org/new-microbit/) and allows you to write programs for it. There is a download feature which allows you to download the program you have written and run it on a physical device. The process of downloading and running your code on the micro:bit is really straight forward. The micro:bit can be connected to your pc/laptop with a micro usb cable, which also powers the device. The device then shows up as a drive and the programs can be downloaded directly onto the device.

The BBC micro:bit is a pocket-sized computer that introduces you to how software and hardware work together. It has an LED light display, buttons, sensors and many input/output features that, when programmed, let it interact with you and your world. There is a huge list of sensors from buttons, to accelerometer, to temperature and light. It really is an amazing device.

The MakeCode website is full of help pages, tutorials and videos, so whatever level or experience you are, you will be able to get started. Also you can get a lot out of the site without having a physical device as the simulator is rather good. However me and my boy, have really enjoyed having a physical device in our hands, that we can move around the house with. We programmed up a simple light sensor, and we could move around the house finding where was dark and what happened if we moved our hands in front of it. The website allows the same thing, however moving a slider is not the same experience.

Twenty five years ago (or so) my step father was getting me into electronics, by explaining capacitors, resistors and all the other components. So it is no surprise that he has loved setting things up for my boy. He has spent a great deal of time getting components that would work with the micro:bit and 3D printing boards and connectors (to make it easy to connect things up)

![](/images/microbit-accessories.jpg)

Pictured are a selection of the components. We have a selection of breadboards which we haven't tried yet, a selection of cables for connecting things up. Two battery boxes, (3V and 9V). A slider variable resistor, we experimented with using this as a volume control earlier. A board that makes it easy to connect components to the micro:bit. A joystick. A [NeoPixel](https://makecode.microbit.org/pkg/microsoft/pxt-neopixel) strip of ten colourful LEDs. A 8x8 LED [Matrix](https://makecode.microbit.org/pkg/alankrantas/pxt-max7219_8x8) for cool scrolling messages. The last two components, the NeoPixel and the Matrix require an extension to the standard controls but these are easily found on the MakeCode website.

![](/images/blocks.png)

I have featured on this page the code I helped write that uses the joystick to move a LED around the 5 x 5 grid that is on the micro:bit. To write this I started off by printing the X Co-ordinates to the screen. With the joystick in the centre position, it was about 500, when moved one way it was low teens, and the other way it was 1000+. Then I needed to figure out how to convert X, Y Co-ordinates for the joystick that could be 0 to 1000, to X, Y co-ordinates of the display that is 5 x 5. The Maths was a bit beyond my boy, but he just about understood what was going on. The clear screen step is needed so the previous position can be removed from the screen.

I am really enjoying learning about the micro:bit and seeing my boy engage with it and learn programming. I have been very impressed with his ability to retain knowledge of ifs and other programming concepts (however I am a bit biased being his father)