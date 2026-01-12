+++
title = "Tidying my desktop"
date = "2015-03-11T20:00:45Z"
year = "2015"
month= "2015-03"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["PowerShell", "Desktop",  "ITAdmin"]
categories = ["tech"]
keywords = ["", ""]
description =  "My desktop is always a mess. I constantly download files there and forget all about them."
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/posts/tidying-my-desktop/",
    "/posts/tidying-my-desktop-2f1a",
    "/posts/2015/03/11/tidying-my-desktop-2f1a",
    "/posts/2015/03/11/tidying-my-desktop",
    "/2015/03/11/tidying-my-desktop-2f1a",
    "/2015/03/11/tidying-my-desktop"
]
+++
My desktop is always a mess. I constantly download files there and forget all about them.

Every now and then I copy files into sub directories, so my desktop looks sane for a day or two before it gets out of control again.

Why don’t I write a script that I can schedule to do this for me. Then my desktop will always be tidy.

I have written a few simple batch scripts, but of course the best scripting language out there at the moment is PowerShell. Lets use that.

Windows provides a nice little utility for writing scripts called the Windows PowerShell ISE, so let's start by loading that up.

PS has lots of help included to help you, just run **Get-Help [name of ps command]**

To move files you can use **Move-Item** which works very similar to copy, specify source and destination. In my case I moved files based on their file extension.

Move-Item \*.pdf folder

Now all I need to do is schedule this script to run either every day or so, or maybe every time I login or switch my computer on.

PowerShell can do lots more interesting things which hopefully I will blog about soon.