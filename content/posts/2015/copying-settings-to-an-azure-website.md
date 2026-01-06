+++
title = "Copying settings to an Azure Website"
date = "2015-10-01T20:00:45Z"
year = "2015"
month= "2015-10"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/2015/09/2275.app-1.png"
images = ['/images/2015/09/2275.app-1.png']
tags = ["Clouds", "Azure", "DevOps", "Powershell"]
categories = ["tech"]
keywords = ["", ""]
description = "Learn how to use PowerShell to automate copying settings to an Azure Website, making administration easier and more efficient."
showFullContent = false
readingTime = true
copyright = false
draft = false
aliases = [
    "/posts/copying-settings-to-an-azure-website",
    "/posts/copying-settings-to-an-azure-website-50ec",
    "/posts/2015/10/01/copying-settings-to-an-azure-website-50ec",
    "/posts/2015/10/01/copying-settings-to-an-azure-website",
    "/2015/10/01/copying-settings-to-an-azure-website-50ec",
    "/2015/10/01/copying-settings-to-an-azure-website"
]
+++
The Software as a Service (SaaS) website that I work on has been sold to lots of clients now. Which is great news.

![](/images/2015/09/2275.app-1.png)

However the more Azure websites we have, the more websites we have to administer, especially if like us you take advantage of Traffic Manager which requires multiple website in different regions. Azure has some great options for making this administration easier. One job is adding all the settings onto the Azure portal, so far I have been manually adding these, but a quicker way is to use powershell.

## PowerShell

PowerShell is everywhere these days. You can use it to control Servers, Active Directory and Exchange. So it is no surprise that you can use it to control Azure.

Open a powershell window and run the following command.

```
Get-AzurePublishSettingsFile
```
This command opens an IE window which you can login to Azure and download a file which contains settings that Azure can use. Save the *.publishsettings file and run the following command.

```
Import-AzurePublishSettingsFile "C:\MyPublishSettings\mysubscriptions.publishsettings"
```
This imports your Azure settings so that PowerShell can do clever things.

```
Select-AzureSubscription -Default "mysubscription"
```
This selects which of your Azure subscriptions to use. Now run the following to import settings into PowerShell.

```
$s = @{"DebugEmailAccount"="test@example.com";"SiteWarningBannerText"=""}
```
And finally run the following to import this settings into the Azure website you specified.

```
Set-AzureWebsite azure-websitename -AppSettings $s
```
Sounds easy doesn’t it. Well it is. The hardest part is getting the settings in the correct format to be imported but this is only string manipulation.

For my project I already have a build script which populates a settings.config file with all these settings, so I have just duplicated this to create a settings.config.importtoAzure file. Next time I have a website to create, I can create it on Azure and run the above script, pasting in the settings file that my build has already produced for me.

This only scratches the surface of what you can do with Azure and PowerShell, hopefully I will do far more in the future.