+++
title = "How do I add Power BI data to a webpage?"
date = "2017-06-12T20:00:45Z"
year = "2017"
month= "2017-06"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["PowerBI", ""]
categories = ["tech"]
keywords = ["", ""]
description = "Last week I talked about Power BI, what it is and some of the different services you can use with it. This week lets add some of that data to a simple web page."
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/how-do-i-add-power-bi-data-to-a-webpage-49f1",
    "/posts/how-do-i-add-power-bi-data-to-a-webpage/",
    "/posts/how-do-i-add-power-bi-data-to-a-webpage-49f1",
    "/posts/2017/06/12/how-do-i-add-power-bi-data-to-a-webpage-49f1",
    "/posts/2017/06/12/how-do-i-add-power-bi-data-to-a-webpage",
    "/2017/06/12/how-do-i-add-power-bi-data-to-a-webpage-49f1",
    "/2017/06/12/how-do-i-add-power-bi-data-to-a-webpage"    
]
+++

Last week I talked about [Power BI](https://www.funkysi1701.com/2017/06/05/businessintelligence/), what it is and some of the different services you can use with it. This week lets add some of that data to a simple web page.

For this example I am going to add the google analytics data from this website to this page.

First login to your Power BI https://app.powerbi.com/

Click the get data link at the bottom left.

Click My Organisation to bring up the app search box.

![Alt Text](/images/2017/46c1lyxy053xcq66fowf.jpg)

Click the Apps tab and search for “google” in the search box, you should then see Google Analytics, click into this and then click the get it now button.

Log into your google account. If you  have multiple google accounts I found it worked best to sign out of all of them or run this in an incognito window.

Once you are signed in you should see a list of the different google analytics data you have, select the one you want to use and click import.

Power BI will then go away and start loading the data.

Once loaded go to Reports and select the Google Analytics that has been loaded. If you have more than one, it is a good idea to rename each one eg Corporate Site Google Analytics, Blog Google Analytics so you won’t get mixed up.

In the file menu select Publish to web and agree that you are OK for this to be made public.

You will then be given a piece of HTML code that starts with &lt;iframe copy this onto your web page. Reload your webpage and you should see something similar to mine below.

It should be noted that while you can but the webpage containing the iframe behind a login page, the data could still be accessed if you knew the url contained within the iframe, this is why the link can be emailed and continue to work.
