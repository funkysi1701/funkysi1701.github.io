+++
title = "Blazor and .NET 10: Breaking Changes, Fixes, and New Features"
date = "2025-11-17T20:00:00Z"
year = "2025"
month = "2025-11"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/2025/Android Small.png"
images =['/images/2025/Android Small.png']
tags = ["Blazor", ".NET 10", "WebAssembly", "Wasm", "HttpClient", "breaking change", "DotNet", "Visual Studio", "release", "streaming response", "C-Sharp"]
category="tech"
description = "By reading this post, you'll learn about the latest features in .NET 10, changes in Blazor WebAssembly, and how to fix breaking HttpClient streaming issues in your projects."
showFullContent = false
readingTime = true
copyright = false
featured = false
draft = false
aliases = [
    "/blazor-and-dotnet10",
    "/posts/blazor-and-dotnet10",
    "/posts/2025/11/17/blazor-and-dotnet10",
    "/2025/11/17/blazor-and-dotnet10" 
]
+++

## What's New in .NET 10?

.NET 10 was released this week and it is full of awesome new features. Check it out at [.NET Download](https://dotnet.microsoft.com/download/dotnet/10.0), there is also a new version of [Visual Studio](https://visualstudio.microsoft.com/) which you should also check out.

I quickly upgraded my .NET projects to take advantage of the new version, but my Blazor WebAssembly (Wasm) project encountered the following error in the browser console:

```txt
System.NotSupportedException: net_http_synchronous_reads_not_supported
   at System.Net.Http.BrowserHttpReadStream.Read(Byte[] buffer, Int32 offset, Int32 count)
   at System.IO.DelegatingStream.Read(Byte[] buffer, Int32 offset, Int32 count)
   at System.IO.StreamReader.ReadBuffer(Span`1 userBuffer, Boolean& readToUserBuffer)
   at System.IO.StreamReader.ReadSpan(Span`1 buffer)
   at System.IO.StreamReader.Read(Char[] buffer, Int32 index, Int32 count)
   at Newtonsoft.Json.JsonTextReader.ReadData(Boolean append, Int32 charsRequired)
   at Newtonsoft.Json.JsonTextReader.ReadData(Boolean append)
   at Newtonsoft.Json.JsonTextReader.ParseValue()
   at Newtonsoft.Json.JsonTextReader.Read()
   at Newtonsoft.Json.JsonReader.ReadAndMoveToContent()
   at Newtonsoft.Json.JsonReader.ReadForType(JsonContract contract, Boolean hasConverter)
   at Newtonsoft.Json.Serialization.JsonSerializerInternalReader.Deserialize(JsonReader reader, Type objectType, Boolean checkAdditionalContent)
   at Newtonsoft.Json.JsonSerializer.DeserializeInternal(JsonReader reader, Type objectType)
   at Newtonsoft.Json.JsonSerializer.Deserialize(JsonReader reader, Type objectType)
   at Newtonsoft.Json.JsonSerializer.Deserialize[MyResult](JsonReader reader)
   at MyAPI.Client.MyClient.<ReadObjectResponseAsync>d__57`1[[MyAPI.Client.MyResult, MyAPI.Client, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null]].MoveNext()
   at MyAPI.Client.MyClient.MyAsync(MyRequest body, CancellationToken cancellationToken)
   
```

This error was getting thrown on a Blazor Wasm page when it tried to make a call to my API. This worked fine in .NET 9 so my suspicion was this might be a breaking change.

The list of new features for .NET 10 can be found [.NET 10 Release Notes](https://learn.microsoft.com/en-us/aspnet/core/release-notes/aspnetcore-10.0?view=aspnetcore-9.0)

## HttpClient Response Streaming: Breaking Change in Blazor

I found the following new feature which I suspect is related to my issue: 

HttpClient response streaming enabled by default

In prior Blazor releases, response streaming for HttpClient requests was opt-in. Now, response streaming is enabled by default.

This is a breaking change because calling `HttpContent.ReadAsStreamAsync` for an `HttpResponseMessage.Content` (`response.Content.ReadAsStreamAsync()`) returns a `BrowserHttpReadStream` and no longer a `MemoryStream`. `BrowserHttpReadStream` doesn't support synchronous operations, such as `Stream.Read(Span<Byte>)`. If your code uses synchronous operations, you can opt-out of response streaming or copy the `Stream` into a `MemoryStream` yourself.

To opt-out of response streaming globally, use either of the following approaches:

Add the &lt;WasmEnableStreamingResponse&gt; property to the project file with a value of false:

```xml
<WasmEnableStreamingResponse>false</WasmEnableStreamingResponse>
```

Set the DOTNET_WASM_ENABLE_STREAMING_RESPONSE environment variable to false or 0.

To opt-out of response streaming for an individual request, set `SetBrowserResponseStreamingEnabled` to false on the `HttpRequestMessage` (`requestMessage` in the following example):

```csharp
requestMessage.SetBrowserResponseStreamingEnabled(false);
```

For more information, see HttpClient and HttpRequestMessage with Fetch API request options (Call web API article).

## How to Fix the Streaming Issue in Blazor

To test out if this was the culprit I added `<WasmEnableStreamingResponse>false</WasmEnableStreamingResponse>` to my csproj file and sure enough this fixed my issue.

Do check out the docs for a complete list of new features and any other potential breaking changes. [.NET 10 Release Notes](https://learn.microsoft.com/en-us/aspnet/core/release-notes/aspnetcore-10.0?view=aspnetcore-10.0)
