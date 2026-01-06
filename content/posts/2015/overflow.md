+++
title = "Overflow"
date = "2015-05-22T20:00:45Z"
year = "2015"
month= "2015-05"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/2015/05/error.jpg"
images = ['/images/2015/05/error.jpg']
tags = ["Database", "Access", "Integer", "SQL", "Overflow", "Variables"]
categories = ["tech"]
keywords = ["", ""]
description =  "Overflow"
showFullContent = false
readingTime = true
copyright = false
draft = false
aliases = [
    "/posts/overflow",
    "/posts/overflow-24f8",
    "/posts/2015/05/22/overflow-24f8",
    "/posts/2015/05/22/overflow",
    "/2015/05/22/overflow-24f8",
    "/2015/05/22/overflow"
]
+++
Today I encountered a new error.

![](/images/2015/05/error.jpg)

Run-time error ‘6’: Overflow doesn’t really tell me much. The error was occurring in the Access ADP front-end of our main database. It was only occurring for one particular Id number which was really confusing me.

First thing I tried was to remove the most recent changes I had made, this made no difference. So time to look at the VBA code that was run just before the error.

```
Dim iPropertyId As Integer
iPropertyId = DLookup(“PropertyId”, “Survey”, “[ProjectNo]=” & Me.ProjectNo)
```

All looks good, even running the Dlookup query in SQL Management Studio threw no errors.

```sql
SELECT PropertyId FROM dbo.Survey WHERE ProjectNo =
```

Next thing I tried was explicitly setting iPropertyId to the problematic Id, still the same error.

This made me look at the error message again. Overflow suggest something being too big, but what could it be.

Integer has a size limit of 32,767 and the value I was trying to pass into iProperty was 32779. This was what was causing the problem, my database had grown to such a size that Integer was too small, I needed to change it to a Long Integer. Long has a size of 2,147,483,647 so my database should keep working for a while more.

The famous programming help website [Stack Overflow](https://stackoverflow.com/) is named after such an error. This error shows how difficult it is to decide what variable type to use, as you don’t know how quickly your database will grow.