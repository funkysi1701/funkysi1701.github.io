+++
title = "Mobile App UI Testing"
date = "2018-01-08T00:00:00Z"
year = "2018"
month= "2018-01"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
copyright = false
cover = "/images/2018/01/01-newproject-vs.png"
images = ['/images/2018/01/01-newproject-vs.png']
tags = ["Android", "Azure", "App"]
categories = ["tech"]
keywords = ["", ""]
description = "Mobile App UI Testing"
showFullContent = false
readingTime = true
draft = false
aliases = [
    "/mobile-app-ui-testing-4p8h",
    "/posts/mobile-app-ui-testing",
    "/posts/2018/01/08/mobile-app-ui-testing",
    "/posts/mobile-app-ui-testing-4p8h",
    "/posts/2018/01/08/mobile-app-ui-testing-4p8h",
    "/mobile-app-ui-testing-4p8h",
    "/2018/01/08/mobile-app-ui-testing-4p8hn"
]
+++

Since I started creating an android app I have been writing simple UI tests.

I have been taking advantage of the Visual Studio App Center which allows you to test against hundreds of different devices in the **Test Cloud**.  
  
 ![Xamarin UI tests](/images/2018/01/01-newproject-vs.png)In order to write a UI test create a UI Test App, this makes use of the nuget package Xamarin UI Test. By default you will now have a test called AppLaunches which will take a screenshot of you app after it starts.

You can now run this test against any device from Visual Studio assuming you have it physically plugged into your machine. However, how do you run against the Test Cloud?

To run against the Test Cloud you need to first install node.js. Now you can install the appcenter cli with the following command.

```
**npm** install -g appcenter-cli
```

To run the tests in the Test Cloud run the following command

```
**appcenter** test run uitest --app "<username>/<appname>" --devices "<username>/<deviceset>" --app-path _pathToFile.apk_ --test-series "master" --locale "en_US" --build-dir _pathToUITestBuildDir_
```

where <username> is your appcenter username, is the name of your app in appcenter and is the group of apps you have created in app center to test against.

Look at device sets in the test section of the appcenter and click the new device set button. You can then search for any device you like and add it to a set, as I write this there are 244 devices you can test against.

It is currently not possible within app center to run tests against a new build, however if you build your app in VSTS as well you can create build or release step that runs it. As the Visual Studio app center is still under development I wouldn’t be surprised if it is added at some point.

In VSTS look for Mobile Center Test in the definitions and you can specify the same variables as specified in the command line above.

Now how do you actually write a useful UI test? I mentioned above you get a default test which contains the following code, this takes a screenshot of your app. However you don’t have to include this when using the Test Cloud as screenshots are included for free.

```
app.Screenshot("First screen.");
```

Lets look at what else is included in app

```
app.Repl();
```

This starts an interactive REPL (Read-Eval-Print-Loop) which lets you explore what is on screen in your app and pauses execution. I don’t include this in my tests, however I do make use of it to explore what is on screen and what tests I might make use of.

```
app.Tap(c => c.Marked("Button"));
```

This taps an element on screen called Button. There is also a method called TapCoordinates which would allow you to click anywhere you like.

```
app.WaitForElement(c => c.Marked("View"));
```

After clicking a button you are probably going to want to wait for the app to load extra data or a new screen. The WaitForElement waits for an element to appear on screen. There are also methods that wait a period of time or wait until an element no longer exists.

These are the main methods I have used so far, however there is an extensive list including methods for scrolling, swiping, pinching and adjusting the volume buttons. So  you should be able to test all manner of app functionality and if you make use of the Test Clouds will know which devices are causing problems.
