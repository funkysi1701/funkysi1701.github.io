+++
title = "Adding Elasticsearch with .Net Aspire"
date = "2025-01-20T20:00:00Z"
year = "2025"
month= "2025-01"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/elastic-search.jpg"
images =['/images/elastic-search.jpg']
tags = ["Elasticsearch", "DotNet", "Aspire", "Search", "Indexing", "Development", "Tech"]
categories = ["tech"]
description = "Learn how to integrate Elasticsearch with .NET Aspire to enhance your application's search capabilities using powerful indexing and search features."
showFullContent = false
readingTime = true
copyright = false
featured = true
draft = false
aliases = [
    "/adding-elasticsearch-with-aspire",
    "/posts/adding-elasticsearch-with-aspire",
    "/posts/2025/01/20/adding-elasticsearch-with-aspire",
    "/2025/01/20/adding-elasticsearch-with-aspire" 
]
+++
A few weeks ago I talked about [.Net Aspire](/posts/2024/aspire/), well lets take a look at how we can use it with Elasticsearch. Elastic search is a powerful search engine that can be used to index and search data. It is built on top of Lucene and provides a powerful way to search through your data.

Aspire allows dependencies like elasticsearch to be added to a project programmatically. Lets look at how this can work.

Add this nuget package to your AppHost project (as of writing this is a preview package):

```xml
<PackageReference Include="Aspire.Hosting.Elasticsearch" Version="9.0.0-preview.5.24551.3" />
```

In your AppHost project, add the following code to your `Program.cs` file:

```csharp
var elasticsearch = builder
    .AddElasticsearch("elasticsearch");
```

Now if you run your project it will add an elasticsearch containter to your project. A common way to administer elasticsearch is to use Kibana. You can add this to your project by adding the following code to your `Program.cs` file:

```csharp
var kibana = builder
    .AddContainer("kibana", "kibana", "8.15.3") // Add Kibana from the image kibana, and tag 8.15.3 and give it a name kibana
    .WithReference(elasticsearch) // Add a reference to the elasticsearch container
    .WithEndpoint(5601, 5601); // Expose a port so you can connect
```

Now if you run your project you will have an elasticsearch and kibana container running. You can access kibana by going to `http://localhost:5601`, and elasticsearch by going to `http://localhost:9200`.

## Troubleshooting Kibana

However when I do that I get the error `Kibana server is not ready yet`. Looking at the kibana container logs, I see the following error:

```log
2025-01-19T21:42:13 [2025-01-19T21:42:13.558+00:00][WARN ][plugins.security.config] Generating a random key for xpack.security.encryptionKey. To prevent sessions from being invalidated on restart, please set xpack.security.encryptionKey in the kibana.yml or use the bin/kibana-encryption-keys command.
Unable to retrieve version information from Elasticsearch nodes. security_exception
```

This is due to the security settings in Elasticsearch. To fix this, you can turn off this security feature by enabling an environment variable:

```csharp
var elasticsearch = builder
    .AddElasticsearch("elasticsearch")
    .WithEnvironment("xpack.security.enabled", "false");
```

As Aspire is only running locally, this is fine, but in a production environment, you would want to secure your Elasticsearch and Kibana instances.

## Using Elasticsearch in Your Project

Now that you have Elasticsearch added to your project, how can you use it? In the .NET project that wants to connect and interact with Elasticsearch, you can add the following NuGet package:

```txt
Aspire.Elastic.Clients.Elasticsearch (version 9.0.0-preview.5.24551.3 as of writing)
```

In the `Program.cs` file of your .NET project you can add the following code:

```csharp
builder.AddElasticsearchClient("elasticsearch");
```

No need to specify any complex connection strings or settings, Aspire will handle all of that for you.

This is pretty much all of the Aspire specific code you need, but lets have a quick look at indexing some data and returning it with a search. Elastic Search has extensive [documentation](https://www.elastic.co/guide/en/elasticsearch/client/net-api/current/examples.html) on how to do this with the dotnet libraries.

To index some data you can use the following code:

```csharp
  await _client.Indices.CreateAsync("searchindex", cancellationToken); // Create an index called searchindex

  var documents = context.Episode.ToList(); // Get the documents you want to index from Entity Framework or any other source

  await _client.IndexManyAsync(documents, index: "searchindex", cancellationToken); // Index the documents into the searchindex index
```

ElasticsearchClient can be injected in via dependency injection, again no need to specify any connection strings or settings.

To search for data you can use the following code:

```csharp
  // Create a search request with a wildcard query which searches in the title field of your indexed documents.
  var searchRequest = new ESSearchRequest("searchindex")
  {
    From = 0,
    Size = 10,
    Query = new WildcardQuery("title") { Value = $"*{SearchQuery}*" },
  };
  // Execute the search request and get the response.
  var response = await _client.SearchAsync<Episode>(searchRequest, cancellationToken);

  if (response.IsValidResponse)
  {
      // Return the documents from the response.
      return response.Documents.ToList();
  }
```

## Conclusion

By following these steps, you can successfully integrate Elasticsearch and Kibana into your .NET Aspire project. This setup allows you to leverage powerful search and analytics capabilities in your application. Remember to secure your instances in a production environment to ensure data safety.
