+++
title = "What is new with C#"
date = "2025-02-10T20:00:00Z"
year = "2025"
month= "2025-02"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/mads-csharp.jpg"
images =['/images/mads-csharp.jpg']
tags = ["C-Sharp", "Programming", "DotNet", "Language Features", "Development", "Tech"]
categories = ["tech"]
description = "Discover the latest features coming to C#, including dictionary expressions and more, as shared by Mads Torgersen at NDC London."
showFullContent = false
readingTime = true
copyright = false
featured = false
draft = false
aliases = [
    "/whats-new-csharp",
    "/posts/whats-new-csharp",
    "/posts/2025/02/10/whats-new-csharp",
    "/2025/02/10/whats-new-csharp" 
]
+++
I was lucky enough to hear Mads Torgersen (The Lead Designer of the C# language) speak at [NDC London](/posts/2025/volunteering-at-ndc/) about some of the plans the team has for the next version of C#. Many of these new features are in the preview stage, and can be enabled by using the c# preview flag in your csproj file. The C# team welcomes feedback on the different use cases for new feature, especially during these early previews. As this is a preview of new language features, don't blame me if this all changes before it all ships in Novembers release!

```xml
<PropertyGroup>
   <LangVersion>preview</LangVersion>
</PropertyGroup>
```

## Dictionary Expressions

This is an extension of the existing collection expressions that we have had since C# 12, but this time for dictionaries.

The syntax is going to look a bit like

```csharp
IList<int> foo = [1, 2, 3];
IDictionary<int, string> bar = [1: "one", 2: "two", 3: "three"];
```

[Dictionary Expressions](https://github.com/dotnet/csharplang/blob/main/proposals/dictionary-expressions.md)

## Simple lambda parameters with modifiers

```csharp
WithOut w1 = (string s) => s.Length;
WithOut w2 = (s) => s.Length;
WithOut w3 = (string s, out int i) => i = s.Length;
WithOut w4 = (s, out i) => i = s.Length;
```

[Simple lambda parameters with modifiers](https://github.com/dotnet/csharplang/blob/main/proposals/csharp-14.0/simple-lambda-parameters-with-modifiers.md)

## Unbound generic types in nameof

```csharp
var t = typeof(List<>);
var n = nameof(List<>);
```

[Unbound generic types in nameof](https://github.com/dotnet/csharplang/blob/main/proposals/csharp-14.0/unbound-generic-types-in-nameof.md)

## Null conditional assignment

```csharp
var c = C.GetOne();
c.P = "Hello";
c.E += () => { };
c?.P = "Hello";
c?.E += () => { };
```

[Null conditional assignment](https://github.com/dotnet/csharplang/blob/main/proposals/csharp-14.0/null-conditional-assignment.md)

## Partial events and constructors

```csharp
partial class Partials
{
  public partial void M(int i);
  public partial string P { get; }
  public partial string this[int i] { get; }
  public partial event Handler? E;
  public partial Partials();
}
```

[Partial events and constructors](https://github.com/dotnet/csharplang/blob/main/proposals/csharp-14.0/partial-events-and-constructors.md)

## Field access in auto properties

```csharp
class Fields
{
  public string? FirstName { get; set; }
  public string? LastName { get => field; set => field = value?.Trim(); }
}
```

note the field keyword is a potential breaking change if you have field variables in your code.

[Field access in auto properties](https://github.com/dotnet/csharplang/blob/main/proposals/csharp-14.0/field-keyword.md)

This last one revealed a couple of gems of information that I found interesting. Creating a class called var can essentially disable the var keyword, and if you declare a variable called _ it can disable the discard operator. Neither of these things I would want to do in production code, but interesting that the language allows them.

## Extensions

We have had extension methods for a while, but what about extension members?

[Extension members](https://github.com/dotnet/csharplang/blob/main/proposals/csharp-14.0/extensions.md)

```csharp
public static class Enumerable
{
    // New extension declaration
    extension(IEnumerable source) { ... }
    
    // Classic extension method
    public static IEnumerable<TResult> Cast<TResult>(this IEnumerable source) { ... }
    
    // Non-extension member
    public static IEnumerable<int> Range(int start, int count) { ... } 
}
```

This was a fascinating look at what is coming up for C#, and it will be interesting to see how these new ways of writing code will get adopted.

If you have enjoyed this article and want to get a monthly email with all my latest articles, please sign up for my [newsletter](/newsletter). If you have any questions or comments, please feel free to reach out or leave a comment below.
