+++
title = "Weekly Update #004"
date = "2020-12-06T20:00:45Z"
year = "2020"
month= "2020-12"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["SQL"]
categories = ["tech"]
keywords = ["", ""]
description = "dynamic sql"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/weekly-update-004-341p",
    "/posts/weekly-update-004/",
    "/posts/weekly-update-004-341p",
    "/posts/2020/12/06/weekly-update-004-341p",
    "/posts/2020/12/06/weekly-update-004",
    "/2020/12/06/weekly-update-004-341p",
    "/2020/12/06/weekly-update-004",
    "/posts/2020/weekly-update-004"
]
+++

I use sp_send_dbmail to send results of sql queries by email to business users. Recently an issue was raised that data was being cut off after 255 characters. To fix this I added @query_no_truncate =  1, however this stopped the column headings from being included. No idea why you can't have all the data and column headings but there you have it.

What I am doing now is running 2 queries, one to get the headings, and one to get the data. In theory you should be able to combine them with a Union however you then have datatype issues for non text columns so I gave up with that idea.

My results have 60 something columns (don't ask its for a data import into a third party system!) so I am not typing them all out. I can shove query results into a temporary table and then execute to get a list of columns.

```sql
SELECT name 
FROM tempdb.sys.columns 
WHERE object_id = object_id('tempdb..#TempTable')
```

However I need my list to be horizontal so I can use as column headers. I can use dynamic SQL and a pivot to flip them round.

```sql
DECLARE @cols AS NVARCHAR(MAX), @query  AS NVARCHAR(MAX)

SELECT @cols = STUFF((SELECT ',' + QUOTENAME(name) 
    FROM tempdb.sys.columns 
    WHERE object_id = object_id('tempdb..#TempTable') 
    FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'),1,1,'')

SET @query = N'SELECT ' + @cols + N' FROM 
(
    SELECT name 
    FROM tempdb.sys.columns 
    WHERE object_id = object_id(''tempdb..#TempTable'')
) x
PIVOT 
(
    MAX(name)
    FOR name IN (' + @cols + N')
) y'

```
