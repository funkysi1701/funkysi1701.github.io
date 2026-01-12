+++
title = "Top Electricity Consuming Devices in Your Home"
date = "2024-12-02T20:00:00Z"
year = "2024"
month= "2024-12"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
copyright = false
cover = "/images/elec-usage.png"
images =['/images/elec-usage.png']
tags = ["Electricity", "Smart Plugs", "Home Assistant", "Energy Monitoring", "Power Consumption"]
categories = ["tech"]
description = "Discover which devices in your home use the most electricity with smart plugs and Home Assistant. Learn about their power consumption and how to monitor it."
showFullContent = false
readingTime = true
aliases = [
    "/top-electricity-devices",
    "/posts/top-electricity-devices",
    "/posts/2024/12/02/top-electricity-devices",
    "/2024/12/02/top-electricity-devices",
]
+++
I have been wondering what devices in my house use the most electricity. I have a smart meter which tells me how much electricity I am using, but it doesn't tell me what devices are using the most electricity. 

Recently I purchased 12 of these [ANTELA Smart Plugs](https://www.amazon.co.uk/dp/B09VP5KNWM?ref=ppx_yo2ov_dt_b_fed_asin_title) (they come in packs of 4 so it hasn't broken the bank). They are straightforward to set up, you plug them into your power socket and plug your device you want to monitor into them, after that you connect to the wifi and can turn the device off/on and see how much power/current/voltage they are using. I have integrated them into Home Assistant and after about a day of usage I can reveal the following findings:

- 2 x Monitors attached to my Laptop. As I write this they are only using about 30W of power between them.
- Microwave - I cooked a potato and it used 1.2kWh of power.
- Washing Machine - Peaks at about 2kW of power, plus the cycle takes some time to complete. 
- Laptop - Laptop charger, looks to be using about 37W of power.
- Kettle - A massive electricity hog, only runs for a short time but reaches 2.9kW of power.
- My Routers/Switches/Servers - My home network has a few devices on it like Raspberry Pi's, a linux and windows server and a network switch etc. Between them they are using about 32W of power. Not a lot but it is on 24-7.
- Fridge - I have a fridge freezer, it uses about 72W of power.
- TV (and firestick) - This is a surprisingly large amount of power. TV is on quite a lot and is using 110W of power. There are other devices which contribute to this value, however when off the TV is still using 10W of power. I am assuming its age is a big factor.
- Tumble Dryer - Again no surprises that this is a big electricity user, it peaks at 2.3kW of power and as it runs for a good couple of hours or so, is a big contributor to my electricity.
- Dishwasher - I have put the dishwasher on a few times today and it peaks at 2.2kW of power. 

![Electricity Usage](/images/elec-usage.png)

I am not able to monitor 100% of my electricity usage, things like lights, my boiler and anything else wired directly in, won't have a plug and I can't monitor in this way. However over the last month or so I can see what is using the most electricity.

![Electricity Usage](/images/elec-usage2.png)

[Octopus Energy](https://octopus.energy/) who supply my energy have an agile tariff, which means the price of electricity changes every half hour depending on demand. I want to move the heavy usage of electricity to cheaper parts of the day, so I can save money. 

If you want to support me do check out my [referral links](/referral-links) we could both get £50 if you sign up with Octopus Energy to supply your energy.

## Now how did I get this all setup?

1 - Plug a smart plug into a power socket and start measuring power. The app "Smart Life" is used to connect to the smart plug and get the power readings and is available in the Android store.

2 - Integrate each smart plug into Home Assistant. The integration you need is the [Tuya](https://www.home-assistant.io/integrations/tuya) integration. A User Code from the Smart Life app is needed to add to Home Assistant.

3 - The Voltage, Power and Current sensors are all defaulted to off in Home Assistant, so you need to go and enable these, once that is done you can see the power usage in Home Assistant.

4 - Now you have Watts, Amps and Volts in Home Assistant but the Energy section of Home Assistant requires Wh or KWh. To get this you need to use the Integral helper to get the amount of time that the device is on for. Go to Add Integration and search for Integral (helper)

![Electricity Usage](/images/elec-usage3.png)

- Name is the user friendly name of the device.
- Metric prefix is the unit of measurement, in this case KWh.
- Time of Unit is Hours
- Entity is the sensor that is measuring the power usage.
- Integration method use Left Riemann sum
- Precision is the number of decimal places, so fine to use 0 here.
- Max Sub Interval is 5 minutes

This gives you an extra sensor in Home Assistant which is the energy usage of the device. In my case in kWh.

5 - Go to your Energy Dashboard in Home Assistant and go to Energy Configuration. Add the new sensor to the Individual Devices section and you can see the energy usage of the device over time.

The accuracy is not brilliant, sometimes it looks like I have used more energy in my devices than my smart meter says I have used in total. However it is a good indicator of what is using the most electricity in your house. Leave it running for a few days, you may have to tweak the Integral helper settings to get the best results.

The [Home Assistant Forums](https://community.home-assistant.io/t/added-tuya-smart-plugs-where-is-the-energy-monitoring/356746/16) are great for getting this sort of thing setup, I have found a lot of useful information on there. 