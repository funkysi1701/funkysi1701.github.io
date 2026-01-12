+++
title = "SQL Server Management Studio"
date = "2015-12-03T00:00:00Z"
year = "2015"
month= "2015-12"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
copyright = false
cover = ""
tags = ["Database",  "SQL"]
categories = ["tech"]
keywords = ["", ""]
description = "SQL Server Management Studio"
showFullContent = false
readingTime = true
aliases = [
    "/posts/line-breaks-stored-in-sql-server",
    "/posts/sql-server-management-studio-5013",
    "/posts/2015/12/03/sql-server-management-studio-5013",
    "/posts/2015/12/03/line-breaks-stored-in-sql-server",
    "/2015/12/03/sql-server-management-studio-5013",
    "/2015/12/03/line-breaks-stored-in-sql-server"
]
+++
I use SQL Server Management Studio all the time for writing queries, getting data and general SQL development.

![SQL Server Management Studio](/images/2015/sql-server-2012-management-studio-splash-screen.png)

I have enjoyed seeing the improvements that each new version of SQL Server Management Studio (SSMS) introduced. One great improvement was intellisense.

This feature saves typing and reduces errors by automatically suggesting tables, column names or other database objects.

A common query that I get asked to write is provide a spreadsheet that gives the information that satisfies certain criteria. This is easy to do in SSMS, you can write the query, click execute and the rows that satisfy the criteria are displayed. These rows can then be easily copy/pasted into Excel or other spreadsheets.

A common data item that gets stored in databases is addresses and addresses often contain line breaks to make the data display better. In the earlier versions of SSMS, when you copied and pasted these line breaks were ignored and the data displayed the same in SSMS as it did in Excel. However in the more recent version, theses line breaks got copied across breaking your spreadsheet and making it hard to see what data corresponded with what.

Now I don’t know if this should be described as introducing a bug or fixing one. I can easily argue both sides. If your data contains a line break and you copy this data it should include the line break in the destination, but if it does that it displays badly in Excel.

The fix I have been using until recently is to use the following TSQL command in my queries.

```sql
SELECT REPLACE(REPLACE(@str, CHAR(13), "), CHAR(10), ")
```

This command replaces any line breaks with an empty string. Both Char(10) and Char(13) are needed because you can have different types of line breaks. This is great if you are writing the script from scratch but isn’t great if your are running a stored procedure or your query has a lot of columns.

The answer to this is to use Visual Studio to run your SQL query. In Visual Studio you can write and run queries via Server Explorer and the results produced don’t contain line breaks. I have only just discovered this solution, but so far it has worked and is very easy to do, plus as I do most of my development in Visual Studio anyway it saves me having to open SSMS to test my queries.
