+++
title = "LINQ"
date = "2016-10-06T20:00:45Z"
year = "2016"
month= "2016-10"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/2016/step30.jpg"
images = ['/images/2016/step30.jpg']
tags = ["LINQ", "SQL",  "C-Sharp"]
categories = ["tech"]
keywords = ["", ""]
description =  "LINQ"
showFullContent = false
readingTime = true
copyright = false
draft = false
aliases = [
    "/linq-5g67",
    "/posts/linq",
    "/posts/linq-5g67",
    "/posts/2016/10/06/linq-5g67",
    "/posts/2016/10/06/linq",
    "/2016/10/06/linq-5g67",
    "/2016/10/06/linq"
]
+++
![](/images/2016/step30.jpg)

### What is LINQ?

**LINQ** is an acronym for Language Integrated Query, which describes where it’s used and what it does. The Language Integrated part means that LINQ is part of programming language syntax. In particular, both C# and VB are languages that ship with .NET and have LINQ capabilities.

### How do I use LINQ in my C# code?

To use LINQ the first thing you need to do is add the LINQ using statement.

```csharp
using System.Linq;
```

In your code you need a datasource, for this example I am going to use a simple array, but it can be anything eg SQL, XML etc

```csharp
int[] data = new int[10] { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 };
```

Next you need a LINQ query. (Note I know the Q in LINQ means query, so I have just written query query, if you are one of those people who hates seeing PIN number you might not like this blog post.) A LINQ query is very similar to a T-SQL query, so if like me you are good with databases this should make sense to you.

In T-SQL you can have:

```sql
SELECT num
FROM data
WHERE num = 1
```

In LINQ this becomes:

```csharp
var query =
from num in data
where num == 1
select num;
```

Finally you need to do  something with the query you have written. I am just going to print the results of my query to console.

```csharp
foreach (var num in query)
{
  Console.Write(num);
}
```

### What other SQL like syntax can I use?

In T-SQL you can control ordering using ORDER BY, LINQ has a similar syntax orderby

```csharp
orderby num descending
```

In T-SQL you can use GROUP BY, to do something similar with LINQ

```csharp
group num by num.Type into type
select type
```

```csharp
foreach (var type in query)
{
  Console.Write(type.Key);
  foreach (var num in type)
  {
    Console.Write(num);
  }
}
```

### JOINS

So you thought joining tables was a SQL Server only thing. Think again you can do this in LINQ

```csharp
var joinquery =
from cust in customers
join prod in products on prod.CustomerId equals cust.Id
select new { ProductName = prod.Name, CustomerName = cust.CompanyName };
```

### Conclusion

There are loads more LINQ functionality that you can use. While writing this blog I found https://code.msdn.microsoft.com/101-LINQ-Samples-3fb9811b which has loads of examples of different queries that you can write with LINQ.

This has inspired me to use LINQ more in my code and learn more about the different queries that could be written.
