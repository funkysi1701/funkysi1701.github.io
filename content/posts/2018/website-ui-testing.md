+++
title = "Website UI Testing"
date = "2018-01-15T00:00:00Z"
year = "2018"
month= "2018-01"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
copyright = false
cover = ""
tags = ["Testing", "Website", "UI"]
categories = ["tech"]
keywords = ["", ""]
description = "Website UI Testing"
showFullContent = false
readingTime = true
draft = false
aliases = [
    "/website-ui-testing-2a9n",
    "/posts/website-ui-testing",
    "/posts/2018/01/15/website-ui-testing",
    "/posts/website-ui-testing-2a9n",
    "/posts/2018/01/15/website-ui-testing-2a9n",
    "/2018/01/15/website-ui-testing-2a9n",
    "/2018/01/15/website-ui-testing"
]
+++
Last week I looked at testing the [UI of mobile apps](https://dev.to/funkysi1701/mobile-app-ui-testing-jgg-temp-slug-9433902), this week lets look at how we could do a similar thing for websites.

Testing the user interface is not an excuse for a lack of [unit tests](https://dev.to/funkysi1701/writing-your-first-test-53gi-temp-slug-2645725). Testing the user interface takes longer so for keep creating your small unit tests that can be run after ever build. That said lets look at how you create a UI test.

Create a Unit Test project as normal. Now install the following nuget packages

```csharp
Selenium.WebDriver.ChromeDriverSelenium.WebDriverSelenium.WebDriver.PhantomJS.Xplatform
```

I am going to be using Selenium to achieve my website testing and I am going to concentrate on the Chrome browser. However packages exist for other browsers so have a look at the following and I expect there are others as well.

```csharp
Selenium.WebDriver.IEDriverSelenium.Firefox.WebDriver
```

[Selenium](http://www.seleniumhq.org/) started life as a plugin for Firefox to help create automated tests, however the latest version of Firefox is not compatible with the plugin as I write this. I have not had to install any plugins or extensions to my browsers to achieve my testing.

Enough talk lets write a test. First we create two instance variables to store the baseURL and the driver for the browser you are using.

```csharp
private string baseURL = "https://www.example.com/";
private RemoteWebDriver driver;
```

Next we need to set things up for the test to run. This creates an instance of the chrome driver, maximizes the window and sets it to wait 30 seconds before timing out.

```csharp
[TestInitialize()]
public void MyTestInitialize()
{    
  driver = new ChromeDriver();    
  driver.Manage().Window.Maximize();    
  driver.Manage().Timeouts().ImplicitlyWait(TimeSpan.FromSeconds(30));
}
```

Now comes the actual test. We navigate to a URL and then compare the title of the page loaded with a know value with a Assert statement like you would find in a unit test.

```csharp
[TestMethod]
public void CheckBrowserTitle()
{    
  driver.Navigate().GoToUrl(this.baseURL);    
  Assert.AreEqual("Home Page", driver.Title);
}
```

Finally we need to tidy up after ourselves.

```csharp
[TestCleanup()]
public void MyTestCleanup()
{    
  driver.Quit();
}
```

If you are used to writing tests you will know that the are usually constructed in three sections Arrange, Act and Assert. The Arrange is done in the initialize method, which makes the actual test much simpler, the first line does the Act and the last line does the Assert.

Now we have written a simple test lets look at something more complex.

```csharp
driver.FindElementByLinkTest("click")
```

This finds any Link on the page which is click. Be careful as the string need to be exactly what appears on screen it may well be easier to specify by id or class or something that doesn’t change as often. By adding .click() on the end of this command Selenium will click on the link and you can navigate to a new page.

**What about submitting form data?** Well you can find the element you want to fill in and add .SendKeys("example text") or .Submit() and this will fill in and submit form data.

**What about a screenshot?**

```csharp
Screenshot ss = driver.GetScreenshot();
ss.SaveAsFile("test.jpg",System.Drawing.Imaging.ImageFormat.Jpeg);
```

I have only just started playing around with web UI tests but you can see there is a fair bit you can do.