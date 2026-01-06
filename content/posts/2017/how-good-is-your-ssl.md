+++
title = "How good is your SSL?"
date = "2017-07-17T20:00:45Z"
year = "2017"
month= "2017-07"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["SSL", "Security"]
categories = ["tech"]
keywords = ["", ""]
description =  "How good is your SSL?"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/how-good-is-your-ssl-3ncf",
    "/posts/how-good-is-your-ssl",
    "/posts/how-good-is-your-ssl-3ncf",
    "/posts/2017/07/17/how-good-is-your-ssl-3ncf",
    "/posts/2017/07/17/how-good-is-your-ssl",
    "/2017/07/17/how-good-is-your-ssl-3ncf",
    "/2017/07/17/how-good-is-your-ssl"
]
+++

![Troy Hunt SSL expert](/images/2017/Troy-Hunt-Profile-Photo.jpg)

I recently watched Troy Hunt’s [What Every Developer Must Know about HTTPS](https://www.pluralsight.com/courses/https-every-developer-must-know) course on Pluralsight. Its very good and really make you think about SSL certificates and how to correctly implement them.

One thing in particular Troy mentions is the website [SSL Labs](https://www.ssllabs.com/ssltest/index.html). This website allows you to test a websites implementation of SSL. A grade of A to F is assigned with A being the best and F being the worst.

Troy Hunt has a [blog](https://www.troyhunt.com/do-you-really-want-bank-grade-security/) post where he discusses how Australian Banks score. Lets look at a few UK banks.

| **Bank** | **SSL Certificate** | **Grade** | **Home Page Under SSL** |
|---|---|---|---|
| HSBC | www.hsbc.co.uk | B | Y |
| Nationwide | onlinebanking.nationwide.co.uk | C | N |
| NatWest | www.nwolb.com | C | N |
| Barclaycard | www.barclaycard.co.uk | A- | Y |
| Barclays | bank.barclays.co.uk | A- | N |
| Lloyds Bank | www.lloydsbank.com | A | N |
| Royal Bank of Scotland | www.rbsdigital.com | C | N |
| Standard Chartered | www.sc.com | C | Y |
| Virgin Money | uk.virginmoney.com | A+ | Y |
| Santander | retail.santander.co.uk | A- | N |

On the whole the ratings are all quite good with all being in the range A-C. However I have also indicated if they have SSL on the home page. Only 4 out 10 website listed above have the home page load under SSL.

Why does this matter as long as the login is under SSL? Any page that loads over http is potentially at risk from a man in the middle attack. A fake malicious home page could contain links to any page and trick users into entering personal information.

If you want to test a bank or other website not listed here. Go to [https://www.ssllabs.com/ssltest/index.html](https://www.ssllabs.com/ssltest/index.html) and type the address that is on the SSL certificate in to the search. The good news is that this site scores a A.

Troy mentions that there is rapid growth in the adoption of SSL, there is also rapid growth in improving ratings. One of these banks went from a C to an A during the course of writing this blog.