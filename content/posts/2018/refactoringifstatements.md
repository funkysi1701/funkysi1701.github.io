+++
title = "Refactoring if statements"
date = "2018-02-26T00:00:00Z"
year = "2018"
month= "2018-02"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
copyright = false
cover = ""
tags = ["Design", "Class", "Interface"]
categories = ["tech"]
keywords = ["", ""]
description = "Refactoring if statements"
showFullContent = false
readingTime = true
aliases = [
    "/refactoring-if-statements-41od",
    "/posts/refactoringifstatements",
    "/posts/2018/02/26/refactoringifstatements",
    "/posts/refactoring-if-statements-41od",
    "/posts/2018/02/26/refactoring-if-statements-41od",
    "/2018/02/26/refactoring-if-statements-41od",
    "/2018/02/26/refactoringifstatements"
]
+++
The code base I am working on contains a huge if block. By huge I mean 77 if statements one after the other, each if checks to see what page id you are on and loads different content. This is not easy to maintain and I want to refactor it.

One option would be to replace the if statements with a switch block. However this is just as unmanageable as the huge if block. Lets look at a better option.

**Polymorphism** is where you create a base class and then create sub classes from it. In my case I created an interface IPage with a single method CreateContent.

```csharp
public interface IPage
{ 
  string CreatePageContent(); 
}
```

and then create 77 classes for each page which implemented this single method.

Now comes the fun bit how do I call the correct page class from my original code?

I created a dictionary than maps page ids to the class names.

```csharp
public static Dictionary<PageIds, Type> PageIdToClass = new Dictionary<PageIds, Type>() 
{ 
  { 
    PageIds.HomePage, 
    typeof(HomePage) 
  }, 
  { 
    PageIds.ContactPage, 
    typeof(ContactPage) 
  }, 
  //etc 
}
```

This is the one step I am not 100% happy with as I think it may be possible to remove or simplify this step.

Now I have a way to map ids to classes I can write a class to do this.

```csharp
public class MyPage 
{ 
  IPage _repo; 
  
  public MyPage(int pageId) 
  { 
    PageIds p = (PageIds)pageId; 
    Type t = PageIdToClass[p]; 
    ConstructorInfo constructor = t.GetConstructor(new Type[] { }); 
    _repo = (IPage)constructor.Invoke(null); 
  } 
  
  public string Create() 
  { 
    return _repo.CreatePageContent(); 
  } 
}
```

So in my constructor I take the pageId and pass it to my dictionary to get which subclass to load. I then get its Constructor and invoke it.

Now I can remove the huge if block and replace it with a single line of code.

```csharp
var page = new MyPage(pageId);
```

On the face of it this change might look like a lot of work for not much gain as we started off with one file and now we have the original file, an interface, 77 subclasses and the MyPage class. However the original file is a lot more manageable and each sub class can be altered independently of each other.

This is a big step towards making this code more maintainable, there is always more that can be done but that can wait for another day.