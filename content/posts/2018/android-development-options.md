+++
title = "Android Development Options"
date = "2018-03-26T00:00:00Z"
year = "2018"
month= "2018-03"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
copyright = false
cover = ""
tags = ["Cordova", "Android", "Cross Platform", "Manifest", "Xamarin"]
categories = ["tech"]
keywords = ["", ""]
description = "Android Development Options"
showFullContent = false
readingTime = true
aliases = [
    "/android-development-options-55m2",
    "/posts/android-development-options",
    "/posts/2018/03/26/android-development-options",
    "/posts/android-development-options-55m2",
    "/posts/2018/03/26/android-development-options-55m2",
    "/2018/03/26/android-development-options-55m2",
    "/2018/03/26/android-development-options"
]
+++
A friend asked me how to get started in Android Development and I thought I might have a go at answering that question here.

I am by no means an expert in Android development, I do have an app in the play store so I know something.

#### Manifest File

This is probably the easiest option and also doesn’t actually create an android app so I am not sure if it should be included in this list of not.

If you have a website and you want to create an app for that you could just create a manifest file and add this to your website.

Once your website has a manifest file, if you visit your website using a mobile phone or tablet you will get the option to add a shortcut to the home screen. You then have an app like experience in that you can click an icon to launch your website.

A manifest file is a simple text file which specifies a few settings like the icon size, filename, what page loads when clicked and name of your “app”

[More information](https://developers.google.com/web/fundamentals/web-app-manifest/)

#### Visual Studio

This is the option I know most about as is what I have used.

If you are familiar with Visual Studio you can use the Xamarin Forms software to create your app in C#. Xamarin Forms allows you to easily create cross platform apps that run on Android, IOS and windows phone. So far I have only experimented with Android but it should be relatively easy to extend my code to run on other platforms.

Xamarin Forms allows you to write one a single codebase that can be compiled to run on the different platforms. Xamarin requires the use of XAML a XML like markup language for designing UI elements.

More Information on [Visual Studio](https://www.visualstudio.com/), [Xamarin Forms](https://www.xamarin.com/forms)

#### Android Studio

I don’t know much about this option so do correct me if I don’t get the details correct.

Android Studio can be downloaded from Google this allows you to create java code to run directly on an android device. From what I know this is fairly similar experience to Visual Studio but instead of writing your code in C# you use Android Studio and write it directly in java.

[More information](https://developer.android.com/studio/index.html)

#### Cordova

Cordova allows you to use HTML, CSS and javascript to create cross platform apps. I have no idea why I haven’t heard of this technology until today as it sounds very flexible especially if you know a little bit of javascript.

[More information](https://cordova.apache.org/docs/en/latest/guide/overview/)

To summarize there  are lots of different options available to create an android app. What you choose depends on what you want to build, what language and experience you have and if your app needs to be cross platform.