+++
title = "How complex are my stored procedures?"
date = "2015-08-13T20:00:45Z"
year = "2015"
month= "2015-08"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/2015/08/complexity.jpg"
images = ['/images/2015/08/complexity.jpg']
tags = ["Complexity", "SQL"]
categories = ["tech"]
keywords = ["", ""]
description =  "How complex are my stored procedures?"
showFullContent = false
readingTime = true
copyright = false
draft = false
aliases = [
    "/posts/how-complex-are-my-stored-procedures",
    "/posts/how-complex-are-my-stored-procedures-5b3g",
    "/posts/2015/08/13/how-complex-are-my-stored-procedures-5b3g",
    "/posts/2015/08/13/how-complex-are-my-stored-procedures",
    "/2015/08/13/how-complex-are-my-stored-procedures-5b3g",
    "/2015/08/13/how-complex-are-my-stored-procedures"
]
+++
Recently me and my development team have been looking at performance and how to improve it.

One area of improvement we have identified is with our stored procedures, which we plan to rewrite. But how do we identify which are the easiest to rewrite and which are the hardest?

My first thought was maybe to count the number of times each keyword is used and rank them somehow. eg each JOIN gets 5, OUTER APPLY gets 20, each term in WHERE gets 1, and then combine that with the length of the query and how many parameters.

However doing a bit of googling I came across the following [blog](https://aalamrangi.wordpress.com/2012/12/24/calculate-tsql-stored-procedure-complexity) and [sql script](https://gallery.technet.microsoft.com/Calculate-TSQL-Stored-831b683a). This script analyses the stored procedures in terms of number of lines of code, number of parameters and number of dependencies.

The complexity is divided into SIMPLE, MEDIUM and COMPLEX.

```
WHEN NumberOfLines * NumberOfDependencies * NumberOfParameters < 5000 THEN ‘Simple’
WHEN NumberOfLines * NumberOfDependencies * NumberOfParameters < 10000 THEN ‘Medium’
ELSE ‘Complex’
```

![](/images/2015/08/reportscreenshot1.png)

This gives a fairly good estimate of which stored procedures are the most complex and which would probably take the longest time to rewrite.