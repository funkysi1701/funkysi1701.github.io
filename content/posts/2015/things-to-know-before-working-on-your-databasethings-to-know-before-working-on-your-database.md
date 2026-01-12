+++
title = "Things to know before working on your database"
date = "2015-07-20T20:00:45Z"
year = "2015"
month= "2015-07"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/2015/07/uf010206.jpg"
images =['/images/2015/07/uf010206.jpg']
tags = ["Backups", "SQL",  "Disaster Recovery"]
categories = ["tech"]
keywords = ["", ""]
description =  "Things to know before working on your database"
showFullContent = false
readingTime = true
copyright = false
draft = false
aliases = [
    "/posts/things-to-know-before-working-on-your-database",
    "/posts/things-to-know-before-working-on-your-database-1aa3",
    "/posts/2015/07/20/things-to-know-before-working-on-your-database-1aa3",
    "/posts/2015/07/20/things-to-know-before-working-on-your-database",
    "/2015/07/20/things-to-know-before-working-on-your-database-1aa3",
    "/2015/07/20/things-to-know-before-working-on-your-database"
]
+++
I recently saw this blog [post](http://www.brentozar.com/archive/2015/07/questions-to-ask-before-you-touch-a-database-server/) by [Brent Ozar](http://www.brentozar.com/team/brent-ozar/) that I thought I might discuss.

Brent listed 13 questions to ask about a database before you start working with it. I am going to go through these 13 questions and expand on them based on my experiences.

1. **Is this database in production now?**

I think it should go without saying that the first thing you should find out is if your database is in production. If its not in production you can do what you like and no one will notice.
I know what databases are in production and which aren’t where I work so I can answer this one.

2. **If this goes down, what apps go down with it?**

What apps are running on what databases is a good second question. I have at least one database which has multiple front end apps. At first glance you would think that that these two apps are not connected but they are, I need to be careful with both of these apps to make sure they don’t break each other.
I know what apps run off what databases.

3. **When those apps go down, is there potential for loss of life or money?**

This is a difficult question so I will split it into two. Loss of life, my databases don’t control life support machines or nuclear weapons so my first instinct would be to say no. However it is not that straightforward, what if your app allowed contractors to know the location of dangers inside a property they were working in. Once your app goes down, they could have an accident due to lack of information.
Loss of money, this one is more straightforward. Time is money in the business world so any time that your app is down and your employees are not able to work is a loss of money. If your database is linked to an eCommerce site, the loss of money could be extremely high.
I know what affect downtime will have on my users and business.

4. **How sensitive are these apps to temporary slowdowns?**

Similar to the previous question, a slowdown can be as serious as downtime for some applications.
Luckily most of my apps are internal only so are not seriously affected by slowness.

5. **When was the last successful backup?**

I manage the backup schedule for all my databases so I know exactly when each one was last backed up. When ever I do anything to a production database I will run a backup so I can roll back in case of problems. As part of developing changes I run my changes on a backup of the data. I can script all my changes and repeatedly run them against a backup until I am sure no problems will occur.

![](/images/2015/07/uf010206.jpg)

6. **When was the last successful restore test?**

More important than a backup is testing restoring your databases. If you can’t restore data then your backup is useless. I try to test restoring my backups at least weekly so I know that I can rely on my backups.

7. **Is everyone okay losing data back to the last successful backup?**

If disaster strikes you could loose all data between now and the time of your last backup. But all is not lost transactional backups can be scheduled throughout the day, in my case the most data we could loose is 15 minutes. This could be configured to be more or less frequent depending on your data. But remember the previous question and make sure you test a restore of your transactional backups, if you can’t restore from them you will be forced to restore from the last successful backup.

8. **When was the last successful clean corruption test?**

Corruption can be a killer if it is not found quickly. If you need to restore to the last backup before corruption occurred this could result in a significant amount of data loss. To check for corruption you need to run DBCC regularly.

9. **Do we have a development or staging environment where I can test my changes first?**

If the answer to this is no, then your next job is to setup a development or staging area. Having a development environment makes development a lot easier and I don’t think I could manage to do all the changes I have done recently without one.

10. **Is there any documentation for why the server was configured this way?**

I really wish we had more documentation about configurations as it would make finding out why thing were setup the way they are. So unfortunately the answer to this question is No.

11. **What changes am I not allowed to make?**

Depending on what your app does, where it is hosted, how quick the changes are needed and many other factors will all restrict what changes you can make. Historical decisions on the database can also affect what changes can be made, if the database has been structured in a certain way, it may be very difficult to restructure it in a more efficient way.

12. **Who can test that my changes fixed the problem?**

This is an interesting question, from experience the best people to speak to about problems with the database are the users. If they can show you how to reproduce a problem, you should be able to fix this problem, after that you can probably get them to verify that it has been fixed.

13. **Who can test that the apps still work as designed, and that my changes didn’t have unintended side effects?**

This is an extension of the previous question. The main users of your app should be your first port of call to find out if the app works as expected. However exploring side affects and undesired features is something that I would test as part of the development process. It has taken a while but I have constructed a detailed check list that can be used for testing so I know that most bugs can be found before release.