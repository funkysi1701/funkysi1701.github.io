+++
title = "DNS for Developers"
date = "2018-04-09T00:00:00Z"
year = "2018"
month= "2018-04"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
copyright = false
cover = ""
tags = ["DNS", "DevOps"]
categories = ["tech"]
keywords = ["", ""]
description = "DNS for Developers"
showFullContent = false
readingTime = true
aliases = [
    "/dns-for-developers-3mmj",
    "/posts/dns-for-developers",
    "/posts/2018/04/09/dns-for-developers",
    "/posts/dns-for-developers-3mmj",
    "/posts/2018/04/09/dns-for-developers-3mmj",
    "/2018/04/09/dns-for-developers-3mmj",
    "/2018/04/09/dns-for-developers"
]
+++
DNS is the backbone of the internet and as such I believe every developer should know something about the basics and not just leave it for the sysadmin to sort.

### What is DNS?

DNS or Domain Name System is what translates Domain names to IP addresses and vice versa.

### Wait what is an IP address and what are domain names?

You do realise this is a developer blog? An IP address is a unique address on the internet and a domain name is a user friendly label for one or more of these.

An example might be google.com which for me resolves to 216.58.204.14

### How it works

![](/images/2018/dns-rev-1.gif)When your browser makes a request to google.com it makes a request to your ISPs DNS Servers. This resolves google.com to 216.58.204.14

In more detail your ISPs DNS server will forward the DNS query to another DNS server and will cache the results for a set amount of time. This is the TTL or Time To Live. Next time the ISP DNS Server will be able to reply directly without needing to forward requests.

This forwarding and caching is what makes making a DNS change not instantaneous. The TTL needs to be reached so that no results are still being fetched from the cache of DNS servers across the globe.

### DNS Records

Now we know roughly how DNS works let’s look at the most common type of records

#### A

A (Host) records are the most simple records which translate domain names to IPs

eg www.google.com to 216.58.204.14

#### CNAME

A CNAME (Canonical Name) record is different to an A record in that it maps a domain name to another domain name when no A record exists.

eg www.google.com to somethingelse.google.com

Typically Azure makes use of CNAMEs for many of its services especially adding a custom domain name

#### MX

MX stands for Mail Exchange and is used for configuring email

#### Name Server

Every domain has a number of Name Servers which tells you what servers control the DNS settings for that domain. If you change your Name Servers then the new Name servers will be where you can change your DNS settings.

If you want to use a service like [DNSimple](https://dnsimple.com/) instead of [123reg](https://www.123-reg.co.uk/) or where ever you registered your domain then all you need to do is change your Name servers.

#### AAAA

Like A record but for ipv6

### What next?

Want to put some different DNS records into practise? Buy a domain name and publish some content to it. Check out my previous post about [programmatically adding records](https://www.funkysi1701.com/creating-dns-records-programmatically). Want an SSL certificate? Get a wildcard one and then you can apply it to any subdomain you add to your domain.

If you have a new website you want to publish consider which of the following is better:

https://www.example.com/newsite

https://newsite.example.com

I much prefer the second option, it looks cleaner, there is no potential conflict with the parent site, no subfolder issues between production and development.