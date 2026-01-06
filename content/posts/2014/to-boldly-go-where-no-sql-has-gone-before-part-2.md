+++
title = "To boldly go where no SQL has gone before Part 2"
date = "2014-10-21T20:00:45Z"
year = "2014"
month= "2014-10"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/2014/10/c285ab50-86a9-44c3-a0ce-d790acae7db1.jpg"
images = ['/images/2014/10/c285ab50-86a9-44c3-a0ce-d790acae7db1.jpg']
tags = ["StarTrek", "SQL", "Database"]
categories = ["tech"]
keywords = ["", ""]
description = "Continuing the exploration of SQL database schema with Star Trek episodes, focusing on creative staff"
showFullContent = false
readingTime = true
copyright = false
draft = false
aliases = [
    "/to-boldly-go-where-no-sql-has-gone-before-part-2-3po5",
    "/posts/to-boldly-go-where-no-sql-has-gone-before-part-2",
    "/posts/to-boldly-go-where-no-sql-has-gone-before-part-2-3po5",
    "/posts/2014/10/21/to-boldly-go-where-no-sql-has-gone-before-part-2-3po5",
    "/posts/2014/10/21/to-boldly-go-where-no-sql-has-gone-before-part-2",
    "/2014/10/21/to-boldly-go-where-no-sql-has-gone-before-part-2-3po5",
    "/2014/10/21/to-boldly-go-where-no-sql-has-gone-before-part-2"
]
+++
Let’s continue looking at a database schema for storing details of every Star Trek Episode. If you are new to databases, a schema is just the design of the structure of the database.

We have three tables, Episode, EpisodeWriter and Writer. See my last post for more details of these. It has been suggested that a slight change to this structure would enable storage of more of the creative staff.

Lets rename Writer and call it Credit, and rename EpisodeWriter and call it EpisodeCredit. Now any creative staff member involved in an episode can be stored in the Credit table. Lets alter EpisodeCredit and add an extra column called CreditType. CreditType is just a text field that stores the role that creative person had on that episode, it can be anything from Director, Writer, Actor, Science Consultant etc.

We now have the ability to store information relating to the episode in the episode table and any creative people in the credit table. What else can we add to the database? How about a table that can be used to record when an episode was last watched. I am probably weird but sometimes I want to watch a Star Trek episode that I like but I haven’t watched in ages.

The last watched table is really simple and just have a datetime field and episodeId. This can be further expanded to have a userId field if you wanted to keep track of what episodes your friends had been watching.

Another idea could be to tag episodes with certain themes or topics like Klingon episodes or meaning of life episodes or Kirk talks a computer to death episodes. Again this is fairly simple table containing TagName and EpisodeId.