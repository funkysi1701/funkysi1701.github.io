+++
title = "DotNet on a Raspberry Pi"
date = "2021-05-10T20:00:45Z"
year = "2021"
month= "2021-05"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/dev-to/e21z7vbamy6w6akhhiwd.jpg"
images = ['/images/dev-to/e21z7vbamy6w6akhhiwd.jpg']
tags = ["Raspberry Pi", "DotNet"]
categories = ["tech"]
keywords = ["", ""]
description = "DotNet on a Raspberry Pi"
showFullContent = false
readingTime = true
copyright = false
draft = false
aliases = [
    "/dotnet-on-a-raspberry-pi-3ldn",
    "/posts/dotnet-on-a-raspberry-pi/",
    "/posts/dotnet-on-a-raspberry-pi-3ldn",
    "/posts/2021/05/10/dotnet-on-a-raspberry-pi-3ldn",
    "/posts/2021/05/10/dotnet-on-a-raspberry-pi",
    "/2021/05/10/dotnet-on-a-raspberry-pi-3ldn",
    "/2021/05/10/dotnet-on-a-raspberry-pi"
]
+++

I have had a Raspberry Pi for a few years and recently I connected it up again, I plugged in the camera and everything worked.

To start off you can view photos from the camera with the raspistill command. With a bit of clever scripting and the crontab I got the Pi taking pictures every 60 seconds. Even managed to take a nice picture of a robin.

![Alt Text](/images/dev-to/e21z7vbamy6w6akhhiwd.jpg)

However scripting isn't really programming, and I would like to write a bit more code. Dotnet can run everywhere these days and it made sense to see if it would run on a Raspberry Pi.

@pete_codes has written a nice guide to getting started with dotnet on a Raspberry Pi https://www.petecodes.co.uk/install-and-use-microsoft-dot-net-5-with-the-raspberry-pi/ This guide and the nuget package https://www.nuget.org/packages/Unosquare.Raspberry.IO/ was all I needed to get started taking pictures with my Pi.

My initial goal is to take some wildlife pictures, stick my camera to a window and take pictures of what flies/crawls/jumps past the window.

The code I have written so far is available on github https://github.com/funkysi1701/RaspberryPiDotNet 

So far the code takes a picture, uploads this file to Azure Blob Storage (so as not to fill up the Pi with too many image files) and deletes the image locally.

Run a dotnet publish -c Release and then cron can run dotnet RaspberryPiDotNet.dll (with full paths to the relevant files)

I then use crontab to execute the code every 60 seconds.

My code has an appsetting.json file which has a couple of settings that need completing for my code to work.

Storage: This is the connection string for Azure Blob Storage
LocalPath: This is the path to where the camera will save its photos to, something like /home/pi/ is all you need but feel free to specify what you need.

Once the photos are in blob storage I plan to display them somewhere, add options to delete what I don't want, maybe do something timelapsey.  

I also don't have a proper release pipeline and this grates on me a bit. I have been doing a mixture of writing code in VS and pushing that to github and then doing git pull on the Pi, and also writing code directly on the Pi. (VS Code can connect via SSH which is pretty cool!)
