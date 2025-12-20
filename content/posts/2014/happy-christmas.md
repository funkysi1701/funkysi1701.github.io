+++
title = "A Merry Christmas with a SQL Twist: Festive Coding Fun"
date = "2014-12-24T20:00:45Z"
year = "2014"
month= "2014-12"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/2014/Merry-Christmas-Hat.gif"
images = ['/images/2014/Merry-Christmas-Hat.gif']
tags = ["SQL", "Christmas"]
category="tech"
keywords = ["", ""]
description = "A festive post with a humorous take on SQL queries and Christmas wishes"
showFullContent = false
readingTime = true
copyright = false
draft = true
aliases = [
    "/happy-christmas-5cfj",
    "/posts/happy-christmas",
    "/posts/happy-christmas-5cfj",
    "/posts/2014/12/05/happy-christmas-5cfj",
    "/posts/2014/12/05/happy-christmas",
    "/2014/12/05/happy-christmas-5cfj",
    "/2014/12/05/happy-christmas"
]
+++
I saw this tweet on twitter.

```txt
He’s making a database,
He’s filtering twice
SELECT * FROM customers WHERE behaviour = Nice
Santa Clause is Coming to town.
```

This started me thinking surely in a normalized database structure behaviour wouldn’t be stored in the customer table, so I propose the following change.

```txt
He’s making a database,
He’s filtering twice
SELECT * FROM customers WHERE EXISTS (select * from behaviour where behaviour.CustomerId = customers.Id and behaviour.Type = Nice)
Santa Clause is Coming to town.
```

Happy Christmas everyone, hope you all have restful holidays.
