+++
title = "Pwned Pass – Available from the Play Store"
date = "2017-08-14T20:00:45Z"
year = "2017"
month= "2017-08"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["Android", "Mobile", "App", "PwnedPass"]
categories = ["tech"]
keywords = ["", ""]
description =  "Pwned Pass – Available from the Play Store"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/pwned-pass-available-from-the-play-store-2fjp",
    "/pwned-pass-available-from-the-play-store",
    "/posts/pwned-pass-available-from-the-play-store",
    "/posts/pwned-pass-available-from-the-play-store-2fjp",
    "/posts/2017/08/14/pwned-pass-available-from-the-play-store-2fjp",
    "/posts/2017/08/14/pwned-pass",
    "/2017/08/14/pwned-pass-available-from-the-play-store-2fjp",
    "/2017/08/14/pwned-pass"
]
+++

Pwned Pass is now available from the [Google Play Store](https://play.google.com/store/apps/details?id=pwnedpasswords.pwnedpasswords).

![Pwned Pass](/images/2017/Screenshot_20170813-205152.png)

Pwned Pass is a simple android app that allows you to type in a password and tells you if it has been used in a data breach.

Troy Hunt of [Have I Been Pwned?](https://haveibeenpwned.com/) recently added a new API to his website which allows you to search his extensive database of pwned passwords, 306 million of them. I have simply created a Android frontend to this API.

The API itself takes a SHA1 hash of the password and either returns a HTTP 200 if the password is found or a HTTP 404 if the password does not exist in the HIBP database. For more details of how Troy Hunt created this check out his [blog post](https://www.troyhunt.com/introducing-306-million-freely-downloadable-pwned-passwords/).

My app simply generates a SHA1 hash of anything that is typed in and then passes this to Troy Hunt’s API. I then get the HTTP return code so I know if the password exists or not.

It should be noted that:  **Do not send any password you actively use to a third-party service – even this one!** I don’t log anything that you type into my app and all I am then doing is passing a SHA1 hash over SSL to HIBP. However you shouldn’t trust my word alone.

The app itself is written in Visual Studio with Xamarin Forms in a similar fashion to the app I talked about [last week](https://www.funkysi1701.com/posts/android-app-development-and-the-visual-studio-mobile-centre).

As I am using Xamarin Forms there is the potential that I may develop iPhone or UWP versions of this code in the future. With that in mind I have made use of interfaces for the android specific parts of the code.

I also make use of the [modernhttpclient](https://www.nuget.org/packages/modernhttpclient/)nuget package due to problems I encountered with httpclient and SSL. This is due to limitations of what libraries are available in mono and what has been implemented, I suspect there are better ways to solve this but that is all part of the fun.

Please do have a look at Pwned Pass and let me know what you think. Especially if it doesn’t work or throws errors. I would like to spend time making this app as good as I can make it.