+++
title = "Content Security Policies"
date = "2018-02-12T00:00:00Z"
year = "2018"
month= "2018-02"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
copyright = false
cover = ""
tags = ["CSP", "ReportURI", "Security"]
categories = ["tech"]
keywords = ["", ""]
description = "Content Security Policies"
showFullContent = false
readingTime = true
aliases = [
    "/content-security-policies-30n2",
    "/posts/content-security-policies",
    "/posts/2018/02/12/content-security-policies",
    "/posts/content-security-policies-30n2",
    "/posts/2018/02/12/content-security-policies-30n2",
    "/2018/02/12/content-security-policies-30n2",
    "/2018/02/12/content-security-policies"
]
+++

A content Security Policy or CSP is a HTTP response header that defines what sources of content can be loaded on a web page. It is a way to combat Cross Site Scripting (XSS) attacks.

### What is a XSS attack then?

When you load a webpage it also loads various other resources like images, some css style sheets, various javascript files that you want to run and probably many other things.

How do you know that you can trust all of these things? If you created them and they live under you control then the answer is probably yes. However these days you will probably want to use resources from across the internet, like youtube videos, google analytics, disqus comments, jquery libraries from a cdn etc and you can’t be sure exactly what they are doing.

Imagine you had a page which you could add any text into a form which would then be displayed. A malicious user could add evil javascript or get the browser to load evil code from anywhere on the internet.

### CSP to the rescue!

A CSP allows the browser to only load from sources that you specify. You could specify that resources from your own site will load but the evil script will not.

Let’s look at some examples

```
Content-Security-Policy: script-src 'self'
```

This allows ```<script>``` tags to only load from the current webhost. script-src is not the only keyword you can use, let’s look at some of the others.

**script-src** – control what ```<script>``` tags will load  
**style-src** – control what css will load  
**img-src** – control what images will load  
**frame-src** – control what frames will load  
**font-src**  – control what fonts will load  
**object-src** – control what object tags will load  
**connect-src** – control what resources a script can connect to  
**media-src** – controls what media (audio/video) will load  
**default-src** – if no specific rule exists then the default directive will run

```
Content-Security-Policy: default-src https
```

This allows any content to be loaded from any site as long as it comes from a secure (https) site

```
Content-Security-Policy: default-src https://example.com
```

This allows any content to be loaded from https://example.com only.

### How do I use this on my site?

I have added CSPs into my web.config which works great for my .Net Framework code.

```
 <system.webServer> <httpProtocol> <customHeaders> <add name="Content-Security-Policy" value="default-src https://example.com" /> </customHeaders> </httpProtocol> </system.webServer>
```

For .net core it is a bit more complex as you don’t tend to use web.config files, however check out Anthony Chu’s [post](https://anthonychu.ca/post/aspnet-core-csp/), which has a solution to that problem.

### Report Only

One last thing about CSPs to mention is the Report Only flag.

```
Content-Security-Policy-Report-Only
```

This does the same as the above but doesn’t enforce anything, so you can fix any problems before you break anything.

To view your issues just look in the developer tools in your favourite browser. Or you can configure all your reports to be collated in one place with a report-uri directive.

```
Content-Security-Policy: default-src https://example.com; report-uri https://example.report-uri.com/r/d/csp/reportOnly;
```

Scott Helme and Troy Hunt have a site called [report-uri](https://report-uri.com/) which offer a service for collating and viewing all your CSP violations so check it out if you want to know more about CSPs.