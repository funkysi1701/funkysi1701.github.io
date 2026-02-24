+++
title = "Android App Development and the Visual Studio Mobile Centre"
date = "2017-08-07T20:00:45Z"
year = "2017"
month= "2017-08"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["App", "Azure", "Android"]
categories = ["tech"]
keywords = ["", ""]
description =  "Android App Development and the Visual Studio Mobile Centre"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/android-app-development-and-the-visual-studio-mobile-centre-2o2",
    "/posts/android-app-development-and-the-visual-studio-mobile-centre",
    "/posts/android-app-development-and-the-visual-studio-mobile-centre-2o2",
    "/posts/2017/08/07/android-app-development-and-the-visual-studio-mobile-centre-2o2",
    "/posts/2017/08/07/android-app-development-and-the-visual-studio-mobile-centre",
    "/2017/08/07/android-app-development-and-the-visual-studio-mobile-centre-2o2",
    "/2017/08/07/android-app-development-and-the-visual-studio-mobile-centre"    
]
+++
For the past week or so I have been playing around with Xamarin and creating an android app.

Well I now have an app in the Google Play Store. Check out [https://play.google.com/store/apps/dev?id=6148298088834956775](https://play.google.com/store/apps/dev?id=6148298088834956775). ![](/images/2017/Screenshot_20170806-190053.png)

Before you rush and download the app I must warn you that it doesn’t do much yet. It displays some content that is on my website and there are a few links to allow sharing of content. I have some ideas to display content from my blog and allow sharing. I also have some other ideas for apps that might actually be useful to people that are not me. If you have ideas or feature requests do let me know.

Ok how did I go about creating this app and getting it in the app store?

Xamarin is now part of Visual Studio so step one is install all the Xamarin features to Visual Studio and build an app.

Next I wanted to monitor my app. Now I know Application Insights doesn’t support apps so what tools are out there? HockeyApp is something I had heard of but they are in the process of being replaced with `https://appcenter.ms/apps`. (Edit: Visual Studio App Center was retired on March 31, 2025)



It was relatively easy to hook up my app to Visual Studio Mobile Centre. First install the required nuget packages. Then add using statements and the following line to your MainActivity.cs file (these instructions are available on the Mobile Centre)

```csharp
using Microsoft.Azure.Mobile;
using Microsoft.Azure.Mobile.Analytics;
using Microsoft.Azure.Mobile.Crashes;
using Microsoft.Azure.Mobile.Distribute;
using Microsoft.Azure.Mobile.Push;
```

```csharp
MobileCenter.Start("[Unique ID]",typeof(Analytics), typeof(Crashes), typeof(Distribute), typeof(Push));
```

Now you can connect the Mobile Centre to your source code (VSTS in my case) and get it to run a build for every commit.

One complexity of the build is that you need to supply a keystore file (basically a certificate to digitally sign your app). I found the best way to do this was to use Visual Studio to create the file.

In VS2017 there is a option called Archive Manager under the tools menu. In here click the distribute button and select Ad-hoc. In the signing identity section you can create a keystore file. Enter a few details and a keystore file will be created in AppData\Local\Xamarin\Mono for Android\Keystore\[keystore name]\[keystore name.keystore]

Once you have added the keystore file to your build you can enable the distribute option. Now you will get an email after every build with a link to install your app. 

Every time your app crashes the details will be logged in the crashes section for you to explore and fix the issues.

The Analytics section allows you to explore how your app is being used. You can also add Analytics.TrackEvent("Feature X") to measure the usage of different features.

There are more things you can do which I will explore more at another time along with how to get your app into the Google Play Store.