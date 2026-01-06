+++
title = "Monitoring Screens"
date = "2015-03-25T20:00:45Z"
year = "2015"
month= "2015-03"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/2015/03/perf.jpg"
images = ['/images/2015/03/perf.jpg']
tags = ["BigScreen", "Azure", "jQuery", "Javascript", "Nagios", "Monitoring"]
categories = ["tech"]
keywords = ["", ""]
description =  "Monitoring Screens"
showFullContent = false
readingTime = true
copyright = false
draft = false
aliases = [
    "/posts/monitoring-screens",
    "/posts/monitoring-screens-1gdf",
    "/posts/2015/03/25/monitoring-screens-1gdf",
    "/posts/2015/03/25/monitoring-screens",
    "/2015/03/25/monitoring-screens-1gdf",
    "/2015/03/25/monitoring-screens"
]
+++
We all know that it is important to monitor your servers and services, so you can spot issues before they become problems. I personally have spent a lot of time configuring [nagios](https://www.funkysi1701.com/2014/09/24/i-love-nagios/) to email me about issues and I have recently been configuring various different alerts in Azure.

My old boss has this idea that I should have a big monitor screen displaying all the vital stats of my servers and services, I personally disagree with this idea and think that notifications on my phone and email alerts are sufficient. He will no doubt correct my thinking when he reads this, but I believe part of his thinking is to make the monitoring of your infrastructure move visible and make it obvious to anyone that walks past that you have your eye on everything.

For the purpose of this blog post lets assume he has convinced me and I have convinced my actual boss to spend money on the required technology to do this (No easy feat). What exactly would I display on this screen?

I have Google Chromecast that I use for streaming various things to my TV, this is a relatively cheap bit of technology that could allow a TV or monitor to display a web page with the required stats displayed. 
![](/images/2015/03/perf.jpg)

The two main sources of information that I want to display are New Relic for monitoring my azure websites and Nagios for monitoring my internal servers. New Relic allows you to easily export live performance data as iframes so I quickly threw together a web page full of these graphs. However if you have a static screen on the wall you don’t want to have to scroll to see different information so I needed to come up with another way to display this information.

My first thought was a slide show. There are lots of javascript scripts that cycle through a series of images like a slideshow, this could be adapted to cycle through a series of iframes and display everything I want.

My script goes something like this and requires jquery as well as javascript. First of all the script waits for the page to load completely with the ready function, it then defines the urls which will be put into the iframe one at a time. It than counts the number of urls you have. It then loops through changing the contents of the src attribute in the iframe every few seconds, in my example it changes every 9 seconds but once this is used in production you may want to increase this.

```html
<script type="text/javascript">
$(document).ready(function(){
  var locations = ["URL1", "URL2", "etc"];
  var len = locations.length;
  var iframe = $('#frame'); 
  var i = 0;
  setInterval(function () {
    iframe.attr('src', locations[++i % len]);
  }, 9000);
});
</script>
```

Now what information wants to be included in a script like this? Showing too much performance data can almost be as bad as not doing it at all as problems gets drowned out in the noise. For me I have performance of my websites, followed by Nagios problems, followed by the azure status page, followed by memory usage of all my servers and lastly showing number of connections to my databases. Another question to consider is what time scales do you want to graph over, too long and you don’t see what is happening now, but too short and you may only worry about an intermittent issue?
