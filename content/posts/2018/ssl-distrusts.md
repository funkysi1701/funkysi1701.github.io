+++
title = "Chrome distrusts SSL Certificates"
date = "2018-02-19T00:00:00Z"
year = "2018"
month= "2018-02"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
copyright = false
cover = ""
tags = ["Certificates", "SSL", "Security", "DevOps"]
categories = ["tech"]
keywords = ["", ""]
description = "Chrome distrusts SSL Certificates"
showFullContent = false
readingTime = true
aliases = [
    "/chrome-distrusts-ssl-certificates-2eme",
    "/posts/ssl-distrusts",
    "/posts/2018/02/19/ssl-distrusts",
    "/posts/chrome-distrusts-ssl-certificates-2eme",
    "/posts/2018/02/19/chrome-distrusts-ssl-certificates-2eme",
    "/2018/02/19/chrome-distrusts-ssl-certificates-2eme",
    "/2018/02/19/ssl-distrusts"
]
+++

One of the websites I have been working on has been displaying an error in the console. The error reads as follows.

```txt
The SSL certificate used to load resources from https://example.com will be distrusted in M70. Once distrusted, users will be prevented from loading these resources. See https://g.co/chrome/symantecpkicerts for more information.
```

But what does this mean? Well let’s start by looking at the [link](https://security.googleblog.com/2017/09/chromes-plan-to-distrust-symantec.html) provided.

In January 2017 it was revealed that Certificate Authorities run by Symantec which include Thawte, VeriSign, Equifax, GeoTrust, and RapidSSL had been issuing certificates that did not comply with baseline standards.

Starting with Chrome 66, Google has decided to remove trust for these certificates. Chrome 66 is due for release around 17th April. My error mentions M70 so what does that refer to?

Chrome 70 which is due to be released in October 2018 will removed the trust for another batch of Symantec certificates.

If you are getting one of these errors because you are using a certificate that is going to be distrusted what will your site look like in Chrome 66 or Chrome 70?

Well Chrome 66 is now in the dev channel so we can give it a try.  ![](/images/2018/tempsnip.png.jpg)

Not very nice for your users is it? Now is the time to order a new SSL certificate to avoid this happening to your site.

I first saw this error a few months ago and have been reading up about it and waiting for Chrome 66 to reach the dev channel so I could test what it did to my site. However now that I have Chrome 66 installed I spotted the intranet for the company I work for is also affected. I do not directly work on the intranet so I notified the security team that they may want to look into this.

Unfortunately the response I received has been that Google needs to fix this before Chrome 66 is released. I am not criticising my employer or the security team, however this isn’t something Google can just “ **fix** “.

The certificates issued were issued by a CA that had issues so in order to maintain the trustworthiness of all certificates Google had little choice but to distrust them. Google and security experts need to be making more of a fuss about this and I am joining in on making a fuss by writing this blog. [Scott Helme](https://scotthelme.co.uk/are-you-ready-for-the-symantec-distrust/) estimates that there are about 7000 websites which may be affected by the M66 and M70 distrusts.
