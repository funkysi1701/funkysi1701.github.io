+++
title = "Trying Out Azure Active Directory"
date = "2016-03-03T20:00:45Z"
year = "2016"
month= "2016-03"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/2016/arch.png"
images = ['/images/2016/arch.png']
tags = ["Active Directory", "Azure", "Authentication", "Azure Active Directory", "DevOps"]
categories = ["tech"]
keywords = ["", ""]
description =  "Trying Out Azure Active Directory"
showFullContent = false
readingTime = true
copyright = false
draft = false
aliases = [
    "/trying-out-azure-active-directory-46pe",
    "/posts/trying-out-azure-active-directory",
    "/posts/trying-out-azure-active-directory-46pe",
    "/posts/2016/03/03/trying-out-azure-active-directory-46pe",
    "/posts/2016/03/03/trying-out-azure-active-directory",
    "/2016/03/03/trying-out-azure-active-directory-46pe",
    "/2016/03/03/trying-out-azure-active-directory"
]
+++
One of my plans is to create new MVC Webapps for my companies databases. Once I publish these I will need to secure them so only staff have access.

The traditional way to do this would be insert membership tables into my database. The user then has to remember another username and password and I have to secure the storage of these credentials. Lots of work for everyone.

![](/images/2016/arch.png)

There is a better way by using Azure Active Directory. You have probably heard of Active Directory, if you are a SysAdmin you probably use it all the time to manage your corporate users and computers. Azure Active Directory is an extension of this into the Cloud.

I have blogged in the past about using Azure but this is the first time I have tried connecting my internal domain to Azure. There is a [Virtual Lab](https://vlabs.holsystems.com/vlabs/technet?eng=VLabs&auth=external&src=vlabs&altadd=true&labid=13535) which helped me try out some of these ideas.

The first thing I did was to create a new Directory in Azure. I did this via the old portal ([manage.windowsazure.com](https://manage.windowsazure.com/)) it might be possible via the new portal but I don’t know how yet.

Click New, select App Services > Active Directory > Directory and select Custom Create. Select Create new directory, give it a name and a domain name and select a region from the drop down. Then add a Global Admin for this directory.

There is a tool called [Azure Active Directory Connect](https://www.microsoft.com/en-us/download/details.aspx?id=47594). Download and Install this with express settings on one of your domain controllers. You need to specify a domain admin account to access your domain and the Azure Global Admin account you just created.

At this point I went to bed so I am not sure how long it tool to sync all the domain information but by morning it was all showing in the users list on Azure.

All my user accounts are showing with a @contoso.onmicrosoft.com, it is possible to use custom domains but I haven’t figured out that step yet. I made a change in my Active Directory and a while later that change was showing in Azure AD.

So now what? Open up Visual Studio and see if I can use Azure to Authenticate.

I selected to create a new MVC web project and clicked the change authenticate option. One of the options was Work and School Accounts, I then selected Cloud Single Organization and entered contoso.onmicrosoft.com. I then ran this app and it authenticated using Azure using my domain password. Really impressed at how easy that was.

The app then shows up on Azure in the old portal. In Applications you can see a list of which users have access to your app and configure few other app related settings.

This is a long way off being useful in my actual app, but it shows that the basics of what I am trying to do does work. Anyone done anything similar with Azure AD? How did you get on?
