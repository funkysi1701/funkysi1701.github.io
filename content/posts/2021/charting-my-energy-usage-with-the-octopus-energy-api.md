+++
title = "Charting my Energy usage with the Octopus Energy API"
date = "2021-03-07T20:00:45Z"
year = "2021"
month= "2021-03"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/dev-to/63ep8hp6ipyn2l4emiop.png"
images = ['/images/dev-to/63ep8hp6ipyn2l4emiop.png']
tags = ["API", "OctopusEnergy"]
category="tech"
keywords = ["", ""]
description = "Discover how to track and visualize your energy consumption using the Octopus Energy API. Learn step-by-step methods to access and chart your smart meter data for better energy management."
showFullContent = false
featured = true
readingTime = true
copyright = false
draft = false
aliases = [
    "/charting-my-energy-usage-with-the-octopus-energy-api-em8",
    "/posts/charting-my-energy-usage-with-the-octopus-energy-api/",
    "/posts/charting-my-energy-usage-with-the-octopus-energy-api-em8",
    "/posts/2021/03/07/charting-my-energy-usage-with-the-octopus-energy-api-em8",
    "/posts/2021/03/07/charting-my-energy-usage-with-the-octopus-energy-api",
    "/2021/03/07/charting-my-energy-usage-with-the-octopus-energy-api-em8",
    "/2021/03/07/charting-my-energy-usage-with-the-octopus-energy-api"
]
+++

![image](/images/dev-to/63ep8hp6ipyn2l4emiop.png)
 
Back when I was a kid, I used to record our weekly gas and electricity meter readings in a little notebook. We then typed these reading into a spreadsheet (this was in the pre-Excel days), which allowed plotting as a line graph.

## How would I go about doing a similar thing today? 

First off, I have a smart meter that submits meter readings every 30 minutes or so. However, I do not know anyway to get access to these readings directly, short of manually recording them like I did 30 years ago!

Octopus Energy have a public API which allows you to pull your consumption readings. The smart meter sends your usage to your energy supplier, in my case Octopus, they then process these readings and allow them to be queried with an API they have created. It is not a direct connection to your data, but it is the next best thing.

Other energy suppliers will hopefully follow this example and allow users access to their consumption data.

## How do I use the API?

Using the API is straight forward. Octopus supply you with a secret which you use to authenticate against the API with Basic Auth, no password just a username. Then you just need to pass some details of your meters to get an object containing the last few days meter readings. 

[API Docs](https://developer.octopus.energy/rest/reference/)

* GET /v1/electricity-meter-points/{mpan}/meters/{serial_number}/consumption/
* GET /v1/gas-meter-points/{mprn}/meters/{serial_number}/consumption/

{mpan}/{mprn} of your gas or electricity meter, and {serial_number} is the serial number of the meters.

Something to be aware of, I initially collected the last days consumption, which worked, however on one day I encountered a gap in the data for electricity. So, I changed to collect and store the last month's data. I can then query this for what I need. 

Usually, the last 24 hours of data is available after midnight of that day. e.g. at midnight 2nd March all the data for 1st March should be available. This is not guaranteed so don't rely on it, however I see no problem with having a few days delay between charting your usage.

I am still testing this out but so far, I have three charts for gas (and the same for electricity), the first chart covers a 24-hour period, the next covers a day total over 2 weeks, the final chart covers a total for each month (as I write this I have less than a month's worth of data!)

For the day and 2 weeks charts, I plot a comparison line of the previous period so you can easily compare the current and previous usage. From my limited testing I have already discovered my usage is very similar day to day. 

Another point of interest is that gas consumption is in m^3 and electricity is in kW/h.
![image](/images/dev-to/r5d35ceh0q5zgc15vos8.png)

If you are interested in trying the Octopus Energy API, here is a referral [link](https://share.octopus.energy/amber-eel-810).
