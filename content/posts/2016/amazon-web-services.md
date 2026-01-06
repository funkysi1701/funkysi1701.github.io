+++
title = "Amazon Web Services"
date = "2016-07-21T20:00:45Z"
year = "2016"
month= "2016-07"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/2016/07/aws-300x169.png"
images = ['/images/2016/07/aws-300x169.png']
tags = ["AWS", "Azure","Amazon",  "Clouds"]
categories = ["tech"]
keywords = ["", ""]
description =  "Amazon Web Services"
showFullContent = false
readingTime = true
copyright = false
draft = false
aliases = [
    "/amazon-web-services-32h7",
    "/posts/amazon-web-services/",
    "/posts/amazon-web-services-32h7",
    "/posts/2016/07/21/amazon-web-services-32h7",
    "/posts/2016/07/21/amazon-web-services",
    "/2016/07/21/amazon-web-services-32h7",
    "/2016/07/21/amazon-web-services"
]
+++

I am a big fan of Azure but I know zero about its biggest rival – Amazon Web Services or AWS.

So lets sign up for a free trial and see what it can do. ![Amazon Web Services](/images/2016/07/aws-300x169.png)

The AWS free trial is available from https://aws.amazon.com/free/ and lasts for 12 months. From memory I think the Azure free trial lasted only one month.

To start you need to login with your amazon account and create an AWS account. This requires your name and address and your payment info (you will only get billed if use services not covered by your free trial).

Interestingly AWS requires you to verify your identity via an automated phone call. (I don’t recall doing anything like this for Azure but please correct me if I am wrong.)

Once you are logged in you get a series of links displaying all the different services that are available. First impression is this is a simpler view to Azure’s portal with a similar amount of services. At the top right is an option to select which region you want to use, in Azure I use North Europe and West Europe, AWS has Ireland and Frankfurt.

## Create a Web App

First thing to try is setting up a website. I selected create a web app and I get a page asking me for its basic details (very similar to Azure, however AWS asked what language your code is written in, Azure handles all of these) AWS websites appear to support a host of different options similar to Azure.

The actual creation of your website takes a few moments (like on Azure). However the default URL for websites is similar to http://test.vjbbimyv7w.eu-central-1.elasticbeanstalk.com/ which is not quite as nice as the Azure equivalent http://test.azurewebsites.net

Azure has a host of command lines available via powershell. AWS has a similar command line interface called AWS CLI, including the option to deploy from git to your website.

AWS Toolkit for Visual Studio is an extension that allows for the publishing of websites to AWS. (Just like you can publish to Azure)

As I learn more about AWS I will continue to blog about it. [Amazon Web Services Pt 2](https://www.funkysi1701.com/2016/08/04/amazon-web-services-pt-2/)