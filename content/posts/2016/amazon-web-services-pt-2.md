+++
title = "Amazon Web Services Pt 2"
date = "2016-08-04T20:00:45Z"
year = "2016"
month= "2016-08"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["AWS", "Azure","Amazon",  "Clouds", "DevOps"]
categories = ["tech"]
keywords = ["", ""]
description =  "Amazon Web Services Pt 2"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/amazon-web-services-32h7",
    "/posts/amazon-web-services-pt-2",
    "/posts/amazon-web-services-32h7",
    "/posts/2016/08/04/amazon-web-services-32h7",
    "/posts/2016/08/04/amazon-web-services-pt-2",
    "/2016/08/04/amazon-web-services-32h7",
    "/2016/08/04/amazon-web-services-pt-2"
]
+++
Last time I started looking at Amazon Web Services and how it differed from Azure. I am going to continue looking at what it can do.

## Virtual Machines

Lets look at what you can do with Virtual Machines. I selected to create a new Virtual Machine (or as AWS calls them an EC2 Instance)

First you choose a name for your VM and then the OS that runs on it. There are 5 main OSes to choose from Windows Server, Amazon Linux and a selection of the most common Linux flavours.

You can then download a certificate to secure your VM.

Like Azure, AWS takes a few moments to create your VM. While I wait I can see that AWS has configured a firewall so only my current IP can connect to it.

Once the VM is ready you can download an RDP file. However to get the login details you need to decrypt the password using the certificate you downloaded when you created the VM.

It is interesting to compare the difference in security between Azure and AWS. Azure allows the resetting of passwords of VMs directly from its console, however I suspect that in AWS if you loose your certificate (AWS states they don’t keep a copy of this) you would have to recreate your VM.

Like with the Websites the default name of the VM is much less user-friendly than what you get from Azure. However I suspect there are other options I haven’t spotted that may customise these.

## Azure Portal vs AWS Console

I really like the Azure Portal. It feels like something that has been designed so you can easily access all the options for a specific Azure feature.

The AWS Console probably has all the same options as with Azure however I don’t think it looks half as good, and will take me a while looking through menus to find the equivalent options. Part of this is due to my unfamiliarity with AWS, so will get easier with time.
