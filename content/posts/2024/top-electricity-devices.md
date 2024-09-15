+++
title = "Top Electricity using Devices"
date = "2024-09-15T20:00:00Z"
year = "2024"
month= "2024-09"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
copyright = false
cover = "/images/elec-usage.png"
images =['/images/elec-usage.png']
tags = [ ]
category=""
keywords = ["", ""]
description = "Top Electricity using Devices"
summary = "Top Electricity using Devices"
showFullContent = false
readingTime = true
aliases = [
    "/top-electricity-devices",
]
+++
I have been wondering what devices in my house use the most electricity. I have a smart meter which tells me how much electricity I am using, but it doesn't tell me what devices are using the most electricity. 

Recently I purchased 12 of these [ANTELA Smart Plugs](https://www.amazon.co.uk/dp/B09VP5KNWM?ref=ppx_yo2ov_dt_b_fed_asin_title) (they come in a packs of 4 so it hasn't broken the bank). They are straight forward to set up, you plug them into your power socket and plug your device you want to monitor into them, after that you connect to the wifi and can turn the device off/on and see how much power/current/voltage they are using. I have integrated them into Home Assistant and after about a day of usage I can reveal the following findings:

- 2 x Monitors attached to my Laptop. As I write this they are only using about 30W of power between them.
- Microwave - I cooked a potatoe and it used 1.2kWh of power.
- Washing Machine - Peaks at about 2kW of power, plus the cycle takes some time to complete. 
- Laptop - Laptop charger, looks to be using about 37W of power.
- Kettle - A maasive electricity hog, only runs for a short time but reaches 2.9kW of power.
- My Routers/Switches/Servers - My home network has a few devices on it like Raspberry Pi's, a linux and windows server and a network switch etc. Between them they are using about 32W of power. Not a lot but it is on 24-7.
- Fridge - I have a fridge freezer, it uses about 72W of power.
- TV (and firestick) - This is a surprisingly large amount of power. TV is on quite a lot and is using 110W of power. There are other devices which contribute to this value, however when off the TV is still using 10W of power, so TV is the big one here. I am assuming its age is a big factor.
- Tumble Dryer - Again no surprises that this is a big electricity user, it peaks at 2.3kW of power and as it runs for a good hour or so, is a big contributer to my electricity.
- Dishwasher - I have put the dishwasher on a few times today and it peaks at 2.2kW of power. It is also a few years old, I wonder if a newer model would be more efficient?

![](/images/elec-usage.png)

Now I have only just set this all up, so it will be interesting to monitor my usage over the weeks/months and see what it looks like. Are there other big electricity users in my home I need to think about monitoring? I am not able to monitor 100% of my electricity usage, things like lights, my boiler and anything else wired directly in, won't have a plug and I can't monitor in this way. 

[Octopus Energy](https://share.octopus.energy/amber-eel-810) who supply my energy have an agile tariff, which means the price of electricity changes every half hour depending on demand. I want to move the heavy usage of electricity to cheaper parts of the day, so I can save money. 

Now how did I get this all setup?

