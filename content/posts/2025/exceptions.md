+++
title = "Understanding and Handling Exceptions in .NET"
date = "2025-02-17T20:00:00Z"
year = "2025"
month= "2025-02"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/exceptions.png"
images =['/images/exceptions.png']
tags = ["Exceptions", "DotNet", "Error Handling", "Programming", "Development", "Tech"]
categories = ["tech"]
description = "Learn about different types of exceptions in .NET and how to handle them effectively to build robust and reliable applications."
showFullContent = false
readingTime = true
copyright = false
featured = false
draft = false
aliases = [
    "/exceptions",
    "/posts/exceptions",
    "/posts/2025/02/17/exceptions",
    "/2025/02/17/exceptions" 
]
+++
While at [NDC London](/posts/2025/volunteering-at-ndc/) I heard a great talk by [Matt Burke](https://mattburke.dev/talks/youre-doing-exceptions-wrong/) about exceptions. I will share some of the points here.

The talk was based in part on the blog post [Vexing Exceptions](https://ericlippert.com/2008/09/10/vexing-exceptions/) by Eric Lippert.

It defined four types of exceptions:

1. **Fatal Exceptions**
2. **Boneheaded Exceptions**
3. **Vexing Exceptions**
4. **Exogenous Exceptions**

## Fatal Exceptions

These are exceptions that are thrown when the application is in an unrecoverable state. Examples of these are OutOfMemoryException and StackOverflowException. Don't try and catch these kind of exceptions, just let the application crash.

## Boneheaded Exceptions

These are exceptions that are caused by a bug in the code. These are the easiest to fix, as you just need to fix the bug. Examples of these are NullReferenceException and IndexOutOfRangeException. Boneheaded exceptions are a gift and it is the code telling you, that you have a bug to fix. Do throw these kind of exceptions, when someone messes up. They can be especially useful when someone else is consuming your API, you can throw an exception with a message that tells them what they did wrong.

## Vexing Exceptions

These are exceptions that are thrown by the framework, and are hard to avoid. Examples of these are FormatException and InvalidOperationException. These are the hardest to fix, as they are thrown by the framework. You can't fix the framework, so you have to work around them. You can't avoid them, so you have to catch them. You can't ignore them, so you have to handle them. You can't fix them, so you have to work around them.

One example of this is the int.Parse() method, it will throw a FormatException if the string is not a valid integer. You can't avoid this, so you have to catch it. Of course a better way to do this is to use int.TryParse() which will return a boolean if the parse was successful.

## Exogenous Exceptions

These are exceptions that are thrown by external systems. Examples of these are IOException and SocketException. These are the hardest to fix, as they are thrown by external systems. You can't fix the external system, so you have to work around them.

A recent example is concurrency problems, if you are processing data in a database and other systems could update it at the same time, you could get a concurrency exception. The data you have in memory might not reflect the real state of that data. You can't avoid this, so you have to catch it. You can't ignore it, so you have to handle it.  

```csharp
try
{
    // Do something that could throw an exception
}
catch (Exception ex) 
{
    // Log the exception
    Log.Error(ex);
    throw ex; // Bad resets the stack trace
    throw; // Good keeps the stack trace 
}
```

Also don't hide Exogenous Exceptions, if you catch an exception and don't rethrow it, you are hiding the exception from the caller. I have seen code that uses the mediator pattern, it will call a method and not return to the original caller that something went wrong. This is bad, as the original caller needs to know that something went wrong.

If you have enjoyed this article and want to get a monthly email with all my latest articles, please sign up for my [newsletter](http://eepurl.com/i7pQno). If you have any questions or comments, please feel free to reach out or leave a comment below.