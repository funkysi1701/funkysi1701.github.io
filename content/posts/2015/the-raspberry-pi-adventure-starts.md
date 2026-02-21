+++
title = "The Raspberry Pi Adventure Starts"
date = "2015-04-11T20:00:45Z"
year = "2015"
month= "2015-04"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["Linux", "Fedora", "Camera", "Raspberry Pi", "Pidora"]
categories = ["tech"]
keywords = ["", ""]
description =  "The Raspberry Pi Adventure Starts"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/posts/the-raspberry-pi-adventure-starts",
    "/posts/the-raspberry-pi-adventure-starts-551d",
    "/posts/2015/04/11/the-raspberry-pi-adventure-starts-551d",
    "/posts/2015/04/11/the-raspberry-pi-adventure-starts",
    "/2015/04/11/the-raspberry-pi-adventure-starts-551d",
    "/2015/04/11/the-raspberry-pi-adventure-starts"
]
+++
I am currently buzzing with excitement about my Raspberry Pi. I will try to document here what I have done so far.

I decided to buy the camera module along with my Pi. It was straightforward to connect them up, lift the connector behind the network port, insert the ribbon cable, push connector back down.

Next I connected up Keyboard, Mouse, Monitor, SD Card and Power. And my Pi had life.

I was then given a screen full of options to install, Pidora is an OS which is based on Fedora which I have some experience of so I went with that one.

After that was installed I was presented with a standard desktop with various programs installed.

So far I had not plugged in a network cable because that would mean sitting in the hall next to the router, I thought before I do that lets see if wifi will work. I have a usb wifi adapter that I use with my PC, so I plugged that in.

Nothing happened, having some experience of linux I wasn’t surprised. I went to network connections filled in the name of my wifi connection and its password and it connected. WOW! That was easy.

So I then installed [webmin](https://www.webmin.com/download.html) so I could remotely administer it and updated it with YUM. I also started the SSH service so I can use putty to login to my Pi from the comfort of my laptop. Even better than that I found a SSH client for my smart phone so I can even control my Pi from my phone!

EDIT: I forgot that in order to get webmin to work I needed to do the following.

mv /etc/redhat-release /etc/redhat-release.bak
echo “Fedora release 20 (Heisenbug)” > /etc/redhat-release

OK So now I am able to configure settings on my Pi from a browser or use SSH (Secure SHell) to login to run any command I like.

Now lets lookup how to use the camera. The [documentation](https://www.raspberrypi.org/documentation/configuration/camera.md) says that the camera first needs enabling using the command raspi-config. This command doesn’t exist in Pidora. Lets skip it and see if it works anyway. It does! The command raspistill -v -o test.jpg took a picture of my ceiling.

Now how do I look at this picture remotely. SSH is a command line only interface, so I can see a 2Mb file has been created. How about installing a web server on my Pi?

yum install httpd

This install apache which is the default (and very popular) web server.

service httpd start

This starts the web server. Going to https://[IP] where [IP] is the ip address of your raspberry pi will show you the default apache page.

Now if you run raspistill -v -o /var/www/html/image1.jpg it will create your photo on the web server.

Not bad for my first steps, the command above could be scheduled and images taken every hour. There is also options for recording video.