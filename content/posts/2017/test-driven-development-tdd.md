+++
title = "Test Driven Development or TDD"
date = "2017-03-13T20:00:45Z"
year = "2017"
month= "2017-03"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/2017/03/tdd_flow.gif"
images = ['/images/2017/03/tdd_flow.gif']
tags = ["Test Driven Development", "Testing",  "Visual Studio"]
categories = ["tech"]
keywords = ["", ""]
description =  "Test Driven Development or TDD"
showFullContent = false
readingTime = true
copyright = false
draft = false
aliases = [
    "/test-driven-development-or-tdd-2m06",
    "/posts/test-driven-development-tdd",
    "/posts/test-driven-development-or-tdd-2m06",
    "/posts/2017/03/13/test-driven-development-or-tdd-2m06",
    "/posts/2017/03/13/test-driven-development-tdd",
    "/2017/03/13/test-driven-development-or-tdd-2m06",
    "/2017/03/13/test-driven-development-tdd"
]
+++
A few weeks back I attended a talk at [Agile Yorkshire](https://www.agileyorkshire.org/event-announcements/tuesfebruary21st-drolivershawtestdrivendevelopmentthemostmisusedterminsoftwaredevelopmentandkeithwilliamsdependenciesinjectionandabstractionforfunandprofit) about Test Driven Development or TDD by Dr Oliver Shaw. I was impressed at how easy Oliver made it look, so as I have never tried it I thought I should give it a try.

![](/images/2017/tdd_flow.gif)

Test Driven Development or TDD is a way of development which starts with writing a Unit Test. First you write a failing test, then you write the code to make it pass, then you refactor your code. This can be remembered by thinking of **Red, Green, Refactor**. Red being the failing test, Green being getting the test to pass, and Refactor being the refactoring.

During the demonstration Oliver used a language called scala and a system that automatically reran all the tests after every change. I code with Visual Studio in C# is there a way I can get my tests to run automatically as well?

A bit of googling and configuring I can answer this as Yes.

The nuget package called [Giles](https://github.com/codereflection/Giles) is a watcher which will rerun your tests similar to how Oliver did it with his scalar environment. Fans of Buffy the Vampire Slayer will get the joke of why a watcher is called Giles. I couldn’t get this to work with MSTest but works fine with NUnit. There is a powershell script giles.ps1 which you need to run and will update every so often with how many tests have passed or failed. However you may not see this if you are coding in Visual Studio but there is a way to get a notification.

If you install the application Growl you can get notifications from Giles which pop up and then disappear. So whatever you have on screen you can find out almost instantly if you have broken tests.

Another thing that I wanted to configure is a way of viewing code coverage and which methods are tested and which aren’t. If you are familiar with VSTS after a build it gives you a percentage score for test coverage. I don’t find this overly useful as it doesn’t tell you what is covered and what isn’t. Also what if you want to use Github, how do you calculate the code coverage then?

The nuget packages [OpenCover](https://www.nuget.org/packages/OpenCover/) and [ReportGenerator](https://www.nuget.org/packages/ReportGenerator/) allow a html report of code coverage to be produced. I created a batch script that can be run whenever you require this information.

```
[path]\OpenCover.Console.exe -target:"[path]\nunit3-console.exe" -targetargs:"[path]\Test.dll" -output:"[path]\coverage.xml" -register:user

[path]\ReportGenerator.exe "-reports:[path]\coverage.xml" "-targetdir:[path]"
```

The commands are fairly straightforward, the only tricky bit is sorting out all the filepaths to the different programs.

Now that I have all this plumbing setup time to give TDD a try and see what I can build.