+++
title = "Interfaces"
date = "2017-03-27T20:00:45Z"
year = "2017"
month= "2017-03"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["C-Sharp", "Interface"]
categories = ["tech"]
keywords = ["", ""]
description =  "Interfaces"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/interfaces-1kfa",
    "/interfaces",
    "/posts/interfaces",
    "/posts/interfaces-1kfa",
    "/posts/2017/03/27/interfaces-1kfa",
    "/posts/2017/03/27/interfaces",
    "/2017/03/27/interfaces-1kfa",
    "/2017/03/27/interfaces"
]
+++
I am trying to understand interfaces and when to use them in my code.

An interface defines a contract and any class that implements that interface agrees to fulfil that contract.

Lets look at an example as this tends to be how I learn best.

Most applications require some sort of data to work from so lets start by defining IData which can load data.

```csharp
public interface IData
{ 
  Blog LoadData(string Connectionstring);
}
```

My interface defines one method LoadData and outputs an object called Blog (I will explain why in a minute)

A common data source is a SQL database so we could define a SQL class that implements IData.

```csharp
public class SQL : IData
{ 
  public Blog LoadData(string Connectionstring) 
  { 
    Blog blog = new Blog(); 
    using (SqlConnection con = new SqlConnection(Connectionstring)) 
    { 
      con.Open(); 
      //etc
```

We could also get data from an RSS feed of a blog (hence why I called the object Blog earlier)

```csharp
public class XML : IData
{ 
  public Blog LoadData(string Connectionstring) 
  { 
    XmlDocument myXmlDocument = new XmlDocument(); 
    myXmlDocument.Load(Connectionstring); 
    Blog blog = new Blog(); 
    foreach (XmlNode RootNode in myXmlDocument.ChildNodes) 
    { 
      //etc
```

Both classes implement IData and have a method called LoadData which has a string parameter and outputs a blog object. The string parameter is either a connection string to a SQL database or the URL of the rss feed. Not sure if there is a better way of doing this bit, maybe the name of the string needs making more generic.

Now we have some classes that implement an interface what can we do with them. Lets write a class called GetData which gets data but doesn’t care if it comes form the rss feed or a SQL database.

```csharp
public class GetData    
{        
  private IData _repo;         
  public GetData(IData repo) 
  { 
    _repo = repo; 
  }         
  
  public Blog LoadData(string Connectionstring)        
  {            
    var original = _repo.LoadData(Connectionstring);            
    return original;        
  }    
}
```

When we call GetData we can either pass in XML or SQL as the class is not tied to either implementation. We could even write other classes that implement IData for testing purposes.

My full code can be found on [github](https://github.com/funkysi1701/InterfaceExample).

The advantages of writing code in this way include code that is easier to extend, easier to test and easier to maintain. This is only the start of my understanding and I am sure this is going to be a topic I come back to in the next few weeks.