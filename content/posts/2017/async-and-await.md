+++
title = "Async and Await"
date = "2017-07-24T20:00:45Z"
year = "2017"
month= "2017-07"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["Async", "Await",  "C-Sharp"]
categories = ["tech"]
keywords = ["", ""]
description =  "Async and Await"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/async-and-await-4he2",
    "/posts/async-and-await",
    "/posts/async-and-await-4he2",
    "/posts/2017/07/24/async-and-await-4he2",
    "/posts/2017/07/24/async-and-await",
    "/2017/07/24/async-and-await-4he2",
    "/2017/07/24/async-and-await"
]
+++
For a while the Async and Await commands in c# have confused me.

Like most things the best way to learn about something is to use it in a real world example. I am currently adding an email alert feature to a website. This is an ideal example of something that would benefit from Asynchronous programming. There is no need for the webpage to wait to send 1000s of emails, lets just send a call to get started and allow the browser to carry on as normal.

This is my first try at using async and await so feel free to suggest best practises in the comments.

Lets start with a Send method in my EmailController.

```csharp
public ActionResult Send(int id, int pageId, int userID)
{
 if (!Authorize.checkPageIsAuthorised(userID, (Authorize.PageIds)pageId))
 {
   return Redirect("/login");
 }
 else
 {
   Task<string> t = SendNotifications(id,userID);
   return Redirect(Request.UrlReferrer.ToString());
 }
}
```

This simply checks to see if you have permission to the page. If not redirects to the login page otherwise it makes a method call and redirects back to the page it came from.

Lets have a look at that method call in more detail.

Task<string> t = SendNotification(id, userid);

SendNotification doesn’t return a normal string it returns a Task<string>, so lets look at how we are creating this.

```csharp
public async Task<string> SendNotifications(int id,string type,int userid)
{
 //logic ommitted
 await ef.SendEmail(model, emailHtmlBody);
 return "OK";
}
```

The return type is set to Task but it has the aysnc keyword appended to it. It also makes a call with the await keyword.

```csharp
public async Task SendEmail(EmailModel model,string emailHtmlBody)
{
 //logic removed
 await smtp.SendMailAsync(message);
}
```

So that is it. My first bit of code that uses Async and Await. My controller calls a method asynchronously which then calls another method asynchronously which sends emails asynchronously.

Async – This enables the Await keyword to be used in the method

Await – This is where things get asynchronous. The await keyword allows the code to wait asynchronously for the long running code to complete.