+++
title = "Getting started with Azure Table Storage"
date = "2017-12-17T20:00:45Z"
year = "2017"
month= "2017-12"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["Azure", "SQL","Table Storage","Database"]
categories = ["tech"]
keywords = ["", ""]
description =  "Getting started with Azure Table Storage"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/getting-started-with-azure-table-storage-ih7",
    "/azure-table-storage",
    "/posts/gazure-table-storage",
    "/posts/getting-started-with-azure-table-storage-ih7",
    "/posts/2017/12/17/getting-started-with-azure-table-storage-ih7",
    "/posts/2017/12/17/azure-table-storage",
    "/2017/12/17/getting-started-with-azure-table-storage-ih7",
    "/2017/12/17/azure-table-storage"
]
+++
Azure Table storage is cheap way to store data, however it has some drawbacks that you should be aware of.

Azure Table storage is a simple way to store NoSQL data with key/attribute pairs. I am very familiar with storing data in SQL databases and would still choose SQL over Table storage, however Table storage is significantly cheaper so could be worth investigating depending on your project.

[Troy Hunt](https://www.troyhunt.com/working-with-154-million-records-on/) makes use of Table storage for his Have I been pwned? website so there are projects out there that make use of it to great affect.

To work with Table storage you need to use a nuget package **WindowsAzure.Storage**

**Install-Package WindowsAzure.Storage**

To load data from a Table in Azure Table storage I use the following code

```csharp
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(connectionString);
CloudTableClient tableClient = storageAccount.CreateCloudTableClient();
CloudTable table = tableClient.GetTableReference("tablename");
TableOperation retrieveOperation = TableOperation.Retrieve<Entity>(PartitionKey, Rowkey);
table.CreateIfNotExists();
TableResult retrievedResult = table.Execute(retrieveOperation);
 
Example eg = new Example();
if (retrievedResult.Result != null)
{
 eg.ID = ((Entity)retrievedResult.Result).Id;
 eg.Date = ((Entity)retrievedResult.Result).Date;
}
return eg;
```

You need to create a class (called Entity in the example above) derived from TableEntity which defines the Partitionkey and Rowkey, plus and other columns you want to store in table storage. The row key and partition key uniquely identify the data in the table, think of this as the primary key of the table if you are used to SQL. This class must also contain a parameterless constructor.

This is the only way to retrieve data, using the partitionkey and rowkey. If you want to retrieve a specific piece of data you would need to retrieve all rows and then search them for what you need. For me this is not a big problem as I only have 150 rows but if you have millions of rows you may need to think carefully how to use this.

To save data I use a very similar piece of code

```csharp
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(path);
CloudTableClient tableClient = storageAccount.CreateCloudTableClient();
CloudTable table = tableClient.GetTableReference("tablename");
Entity post = new Entity(ID, DateTime.Now); 
TableOperation insertOperation = TableOperation.InsertOrReplace(post);
table.CreateIfNotExists();
table.Execute(insertOperation);
```

I create a Entity object and then pass this as a parameter into the InsertOrReplace method.

To delete data it is also very similar, you create an entity object and pass this as a parameter to the Delete method.

When debugging my table storage code I found the [Azure Storage Explorer](https://azure.microsoft.com/en-gb/features/storage-explorer/) very useful for seeing what data actually existed in the table and what might be throwing an error, usually something wrong with my Entity.

I mentioned earlier that Table Storage was cheaper than SQL Azure. Well for my simple playing about with things I have found my monthly charge of £10+ has been reduced to £1+ If I were to build anything that is more than just me learning about how it works I would probably continue to use SQL but for the cost of learning new tech it is well worth giving table storage a try.