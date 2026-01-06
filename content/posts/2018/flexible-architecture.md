+++
title = "Flexible Architecture with Interfaces"
date = "2018-01-29T00:00:00Z"
year = "2018"
month= "2018-01"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
copyright = false
cover = ""
tags = ["Architecture", "Azure"]
categories = ["tech"]
keywords = ["", ""]
description = "Flexible Architecture with Interfaces"
showFullContent = false
readingTime = true
aliases = [
    "/flexible-architecture-with-interfaces-25k1",
    "/posts/flexible-architecture",
    "/posts/2018/01/29/flexible-architecture",
    "/posts/flexible-architecture-with-interfaces-25k1",
    "/posts/2018/01/29/flexible-architecture-with-interfaces-25k1",
    "/2018/01/29/flexible-architecture-with-interfaces-25k1",
    "/2018/01/29/flexible-architecture"
]
+++
I have blogged a few times about [interfaces](https://www.funkysi1701.com/posts/2017/interfaces/), and how useful they are for producing good quality maintainable code. Let’s look at a problem and the solution I came up with which I am quite proud of.

As previously mentioned I am in the process of moving [images](https://www.funkysi1701.com/2018/01/22/moving-blobs-cloud-suppliers/) from AWS to Azure blob storage. Now that the actual files themselves have been moved I need to change the code that references them.

Now I could find all the code that uses the AWS API and replace it with the Azure API but I am not very good at predicting the future, we may stay on Azure for a while, we may move to AWS or Google Cloud, or we may want to go back to files sitting on a server.

Lets try and code a solution that is as flexible as possible. As you have probably guessed I am going to create an interface.

At first I thought about creating an interface called **ICloudStorage** , however this isn’t flexible enough as what happens if we go back to sticking files on a server so instead I created **IStorage**.

I created three classes that implemented IStorage, **AWSStorage** , **AzureStorage** and mostly for testing at the moment **FileStorage**. I then created a class Storage that would call these three classes. Initially I created it like this

```csharp
public class Storage
{
  private IStorage _repo;
  public Storage(IStorage repo)
  {
    _repo = repo;
  }
}

```

However this would require I call it like Storage(new AzureStorage()) and I would need to know everywhere in my code which implementation I want to use. This isn’t too bad as when we change from AWS to Azure we would need to do a find and replace throughout the code and replace all AWSStorage and make them AzureStorage.

However we can do better than that.

```csharp
public class Storage
{
  private IStorage _repo;
  public Storage()
  {
    Type obj = Type.GetType(ConfigurationManager.AppSettings["DefaultStorageRepository"]);
    ConstructorInfo constructor = obj.GetConstructor(new Type[] { });
    _repo = (IStorage)constructor.Invoke(null);
  }
}

```

This code will read from the web.config which implementation to use and that will decide which class to call. This means that to change from AWS to Azure we do not need to redeploy any code, all we need to do is change the web.config.

Let’s look at the three lines and see if we can understand what is happening.

**Type.GetType()** looks straight forward and gets the type from the web.config

**obj.GetConstructor()** This gets the constructor for the type we have just found.

**constructor.Invoke** This then invokes the constructor and it then gets cast to the interface so can be used by the \_repo variable.

This is all fairly simple and makes sense, however it has produced some very flexible code and allows the code to be extended without recompiling.

Let’s look at a hypothetical example. We want to add support for Google Cloud Storage. All we need to do is create a class library which implements the IStorage interface, place the compiled binary in the website and update the web.config to reference it. I haven’t tried this hypothetical example so it might be more complex than I think but in theory it should work.

I am pretty excited at how flexible this code can be, hopefully I will use code like this more often now I understand it.