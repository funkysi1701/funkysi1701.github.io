+++
title = "To boldly go where no SQL has gone before"
date = "2014-10-12T20:00:45Z"
year = "2014"
month= "2014-10"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/2014/10/enterprise.jpg"
images = ['/images/2014/10/enterprise.jpg']
tags = ["StarTrek", "SQL", "Database"]
categories = ["tech"]
keywords = ["", ""]
description = "Exploring many-to-many relationships in SQL using Star Trek episodes as an example"
showFullContent = false
readingTime = true
copyright = false
draft = false
aliases = [
    "/to-boldly-go-where-no-sql-has-gone-before-4fe7",
    "/posts/to-boldly-go-where-no-sql-has-gone-before",
    "/posts/to-boldly-go-where-no-sql-has-gone-before-4fe7",
    "/posts/2014/10/12/to-boldly-go-where-no-sql-has-gone-before-4fe7",
    "/posts/2014/10/12/to-boldly-go-where-no-sql-has-gone-before",
    "/2014/10/12/to-boldly-go-where-no-sql-has-gone-before-4fe7",
    "/2014/10/12/to-boldly-go-where-no-sql-has-gone-before"
]
+++
My last post proved quite popular so I am wondering if I can combine a post about IT and Star Trek.

Years ago I used to have lists of Star Trek episodes, which included such information like original air date, production number, episode title and brief description.

One thing that was hard to keep track of was how many episodes were written by a specific person. This is because episodes are written by multiple people. A column called writer would then need to contain multiple people, another option would be to have columns called writer1, writer2 etc. This wouldn’t help either as you wouldn’t know which column a specific writer had been saved in.

![](/images/2014/10/manytomany.jpg)

The relationship between writer and episode is known as a many to many relationship. An episode can have many writers and a writer can have written many episodes. To achieve this structure in a SQL database you will need three database tables as it is not possible to create a many to many join between two tables. The first table will contain all the episodes, the second table will contain all the writers, the third table known as a junction table, will contain the relationship between the two.

Let’s do an example so we can see how this would work. Gene Roddenberry creator of Star Trek wrote the pilot episode ‘The Cage’. So Gene would be added to the writers table with an id of 1 and The Cage would be added to the episode table with an id of 1. In the junction table, it has two columns episode and writer, so we would enter 1 and 1 into these columns.

```sql
Select * from Episode e
Join EpisodeWriter ew on e.id = ew.EpisodeId
Join Writer w on w.id = ew.WriterId
```

But if Gene Coon and Gene Roddenberry had writing credits on The Cage we would need to add Gene Coon to the writing table and add an extra entry to the episodewriter table.

I am going to do more posts based on this as I expand the database structure to include other information, I may go on to create stored procedures for bringing back certain information or I may use this as an example to talk about coding a user interface.