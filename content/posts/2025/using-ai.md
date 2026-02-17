+++
title = "Using AI to Automate Social Media Posts with .NET"
date = "2025-03-17T20:00:00Z"
year = "2025"
month= "2025-03"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/social-ai.png"
images =['/images/social-ai.png']
tags = ["AI", "OpenAI", "Semantic Kernel", "DotNet", "RSS", "Social Media", "Automation", "Programming", "Tech"]
categories = ["tech"]
description = "Learn how to use AI with .NET to automate social media posts from your blog's RSS feed using Semantic Kernel and OpenAI."
showFullContent = false
readingTime = true
copyright = false
featured = false
draft = false
aliases = [
    "/using-ai",
    "/posts/using-ai",
    "/posts/2025/03/17/using-ai",
    "/2025/03/17/using-ai" 
]
+++

Automating repetitive tasks is one of the best ways to save time and focus on what matters most. In this blog, I'll show you how I used AI with .NET to automate the creation of social media posts for my blog. By leveraging my blog's RSS feed, OpenAI, and Semantic Kernel, I was able to generate engaging posts effortlessly. Let's dive in!

## Using OpenAI for Social Media Posts

Let's look at a way to use AI for a practical use. For the last few weeks I have been using AI to help me write social media posts to promote my latest blog posts, let's look at how I might automate this using .NET code.

My blog publishes new posts to a rss feed, I can consume this from .NET code and pass it to AI, and create social media posts from them.

My blog is written in Hugo and it is already generating an rss feed, however I have made a slight tweak to it. I want the tags from the blog article to be used as hashtags in any social media posts. I am storing the tags in the rss field category.

```xml
<category term="tagname">tagname</category>
```

And here is the section of code that generates my rss feed, the key tags I will be using are title, link, category and description.

```xml
<item>
  <title>{{ .Title }}</title>
  <link>{{ .Permalink }}</link>
  <author>{{ with .Params.author }}{{ . }}{{ else }}{{ with $.Site.Author.name }}{{.}}{{end}}{{end}}</author>
  <pubDate>{{ .Date.Format "Mon, 02 Jan 2006 15:04:05 -0700" | safeHTML }}</pubDate>
  {{ with .Site.Author.email }}<author>{{.}}{{ with $.Site.Author.name }} ({{.}}){{end}}</author>{{end}}
  <guid>{{ .Permalink }}</guid>
  {{- range .Params.tags -}}
    <category term="{{ replace . " " "" }}">{{ replace . " " "" }}</category>
  {{ end }}
  <description>{{ .Content | html }}</description>
</item>
```

I am using the nuget package [CodeHollow.FeedReader](https://github.com/arminreiter/FeedReader/), this allows me to pass in a URL to my rss feed, and get an object out which contains all the items in the feed. Using a nuget package saves me doing a lot of parsing of XML. The method I am using takes an input string something like [https://www.funkysi1701.com/index.xml](https://www.funkysi1701.com/index.xml), and gives me an object I can query and do things with.

```csharp
var RSSFeed = await FeedReader.ReadAsync(FeedStringValue);
```

RSS feed contains the following properties I want to use: Title, Link, Categories and Description. All are strings, except Categories which is an ICollection&lt;string&gt; This matches what I said I wanted to use from the rss feed.

I want to pass the description to AI, and then combine the Response from AI with URL of the blog post and a comma separated list of 'hashtags' (the categories in my rss feed).

Initially I thought about using [ollama](https://ollama.com/), this is an example of a LLM (Large Language Model) that you can install on your laptop, sometimes called a Small Language Model (SLM). However, I found this to be unreliable with my laptop and caused several system wide crashes. I assume this is due to memory usage and the size of the model. LLMs or SLMs do require a lot of system resources so this is not completely surprising. I will revisit this at some point as I would like to learn more about ollama.

I already have an account on [OpenAI](https://platform.openai.com/) and some credit so let's try that instead. I have made a fair few requests using OpenAI and so far it has cost me 11p, I don't think for my usage it is going to break the bank. If I was going to put something on the public internet I may have to reconsider but for my own personal use I think this should be fine.

Next step, how do I talk to OpenAI from .NET. I know of two approaches, [Semantic Kernel](https://github.com/microsoft/semantic-kernel) and the new Microsoft.Extensions.AI libraries introduces in .NET 9 https://devblogs.microsoft.com/dotnet/introducing-microsoft-extensions-ai-preview/. Semantic Kernel is what I am using here, however I do want to explore the newer libraries at some point.

Semantic Kernel with OpenAI needs the following Nuget package: Microsoft.SemanticKernel.Connectors.OpenAI

In my Program.cs I had the following to register and add to dependency injection.

```csharp
if (builder.Configuration.GetValue<string>("OpenAI:Key") != string.Empty)
{
    builder.Services.AddOpenAIChatCompletion(
        modelId: builder.Configuration.GetValue<string>("OpenAI:Model") ?? string.Empty,
        apiKey: builder.Configuration.GetValue<string>("OpenAI:Key") ?? string.Empty
    );
}

builder.Services.AddTransient((serviceProvider) => new Kernel(serviceProvider));
```

OpenAI:Key is your API Key, which can be found from the OpenAI site, [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
OpenAI:Model is the model I am using, in my case "gpt-4o", I've added it as a config option as I may find I want to change it.

Now in the code where I want to call OpenAI I can just inject SemanticKernel and call its async methods. I am a backend developer, so I created a simple API that allows me to call it.

```csharp
public class AIHandler(Kernel kernel) 
{
    public async Task Handle(string request, CancellationToken cancellationToken)
    {
        var response = await kernel.InvokePromptAsync(request, cancellationToken);
        // Do something with the response...
    }
}
```

Now the only step I am missing is what string or prompt do I want to pass to OpenAI?

I want a social media post that will fit into a facebook/twitter/bluesky etc post, some of these services are character limited so I have included a character limit in my "prompt", however I am being clever and counting the number of characters taken up by the URL and hashtags and subtracting that first.

```csharp
string socialMediaPrompt = $"write a social media post under {240 - length} characters, excluding hash tags about {feedItem.Description}"
```

Now once I put is all together I have a page that loads my rss feed, and I can click a button to generate a social media post.

![Ai Example](/images/ai-example.png)

## Conclusion

By combining .NET, Semantic Kernel, and OpenAI, I was able to automate the creation of social media posts, saving time and effort. This approach can be adapted for other use cases, such as summarizing content or generating marketing copy. 

If you have enjoyed this article and want to get a monthly email with all my latest articles, please sign up to my [newsletter](/newsletter). If you have any questions or want to share your own experiences, feel free to leave a comment below!
