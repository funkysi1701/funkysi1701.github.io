+++
title = "Technology I want to learn more about"
date = "2019-03-05T20:00:45Z"
year = "2019"
month= "2019-03"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["C-Sharp", "Azure", "Security"]
category="tech"
keywords = ["", ""]
description = "Technology I want to learn more about"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/technology-i-want-to-learn-more-about-1ann",
    "/posts/technology-i-want-to-learn-more-about/",
    "/posts/technology-i-want-to-learn-more-about-1ann",
    "/posts/2019/03/05/technology-i-want-to-learn-more-about-1ann",
    "/posts/2019/03/05/technology-i-want-to-learn-more-about",
    "/2019/03/05/technology-i-want-to-learn-more-about-1ann",
    "/2019/03/05/technology-i-want-to-learn-more-about"
]
+++

While at [Microsoft Ignite](https://www.funkysi1701.com/2019/02/26/microsoft-ignite-the-tour-london) I heard about a lot of cool tech that I want to know more about. The best way to learn something is use it to solve a problem.

So what can I build that is both useful and will let me play with some new tech?

I have a Xamarin Forms app Pwned Pass that has over 500 downloads on [Google play](https://play.google.com/store/apps/details?id=pwnedpasswords.pwnedpasswords) and over 80 downloads on the [Microsoft Store](https://www.microsoft.com/en-gb/p/pwned-pass/9nm2whnztnlt?rtc=1). This has given me a small user base that I can use to make use of whatever I build.

My app makes use of the [HIBP API](https://haveibeenpwned.com/API/v3) created by Troy Hunt. I am going to build my own API, initially it will just make calls to the HIBP API. Building this will give me experience of building something with .net Core from design to deployment. I have made a start already on doing this, I have an empty .net core API project which deploys to an Azure web app using the build and release pipelines from Azure DevOps.

You may be wondering why I am not making use of Azure Functions to build this API. Azure functions is certainly a great technology that is worth learning about. However I have done a little bit with them in the past and I don’t believe I would be able to learn all the things I want to if I used Azure Functions. My primary goal is learning and sharing that learning via this blog. It may well be I move to using Azure Functions later on.

Another tech I am keen to learn more about is [Azure Key Vault](https://docs.microsoft.com/en-gb/azure/key-vault/). This is a technology that allows the securing of keys, connection strings and certificates. I want my app to securely get keys and security information without any of it having to be committed to source code or shared insecurely.

Monitoring my app is also a key learning from me. I use application insights already, but I would like to extend my understanding of this so telemetry can be fed back into the build and bad deployments stopped.

Below is my complete list of learning and tech I want to touch on. It is a long list and I imagine it will get longer as I work through it. I want to regularly blog and share what I have been working on. I currently have a working build and release pipeline but nothing of note to build or release. I know Key Vault needs looking at early as the identity of the website in Azure is key to getting that tech working correctly.

1) Build API with .net core
2) Add build and release pipeline
3) Make use of Azure KeyVault for secrets, connection strings etc
4) Plugin My Xamarin app to make use of it
5) Monitor my API with Application Insights
6) Secure it with CSPs and log this into [Report URI](https://report-uri.com/)
7) Consider building a web frontend to my API using a javascript library or framework. Maybe react but this can be decided later.
8) Dockerize the API and add the creation of docker images to the build/release pipeline
