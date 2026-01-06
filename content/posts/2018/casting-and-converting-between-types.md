+++
title = "Casting and Converting between types"
date = "2018-05-07T00:00:00Z"
year = "2018"
month= "2018-05"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
copyright = false
cover = ""
tags = ["C-Sharp", "Casting", "Convert"]
categories = ["tech"]
keywords = ["", ""]
description = "Casting and Converting between types"
showFullContent = false
readingTime = true
aliases = [
    "/casting-and-converting-between-types-4g3a",
    "/posts/casting-and-converting-between-types",
    "/posts/2018/05/07/casting-and-converting-between-types",
    "/posts/casting-and-converting-between-types-4g3a",
    "/posts/2018/05/07/casting-and-converting-between-types-4g3a",
    "/2018/05/07/casting-and-converting-between-types-4g3a"
]
+++
Recently I was asked how to convert a number to a string. Let's look at a few ways of approaching this problem.

Most objects in c# have a method called ToString() which displays the string representation of that object. This is because of inheritance, all objects inherit from System.Object which defines ToString().

Int32 is a struct so it inherits from System.ValueType which also inherits from System.Object

so in code

```csharp
int a = 9;
string b = a.ToString();
```

Now let's look at the reverse. However the reverse runs the risk of throwing an error, let's look at why.

```csharp
string b = "9";
string c = "a";
string d = "two";
```

All are valid strings but only one can be converted to a number. Use the TryParse method to convert to a number.

```csharp
int.TryParse("9", out int e);
```

TryParse will not throw an exception if the conversion fails, if it succeeds variable e will contain the result. Note an earlier version of c# required you to define the out parameter before using it with TryParse.

int.Parse exists to do the same thing however it will throw exceptions if a conversion is not possible. The same is true if you use Convert.ToInt32("two");

## Casting

Casting is a way to explicitly telling the compiler that a type is actually another type and you are aware data loss will occur.

```csharp
double x = 4.5;
int y = (int)x;
```

However it is not possible to cast a string to a number format as a string can contain any character not just number characters.