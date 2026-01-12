+++
title = "Writing your first test"
date = "2017-07-10T20:00:45Z"
year = "2017"
month= "2017-07"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["Act", "Arrange", "Assert",  "Testing"]
categories = ["tech"]
keywords = ["", ""]
description =  "Writing your first test"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/writing-your-first-test-2plo",
    "/posts/writing-your-first-test",
    "/posts/writing-your-first-test-2plo",
    "/posts/2017/07/10/writing-your-first-test-2plo",
    "/posts/2017/07/10/writing-your-first-test",
    "/2017/07/10/writing-your-first-test-2plo",
    "/2017/07/10/writing-your-first-test"
]
+++
Whenever I write a new test I have to think how best to do it. Hopefully I can summarise a few tips here to help get started.

### Arrange Act Assert

The first thing I think about when writing a test is Arrange, Act, Assert. Arrange, Act, Assert is a pattern for writing the tests.

**Arrange** – This gets things in order ready to execute the test.

**Act** – This executes the method you want to test.

**Assert** – This compares the value produced in the Act step with a known value typically with a method similar to the following

Assert.AreEqual(expected value, actual value)

Say for example you wanted to test a method called ReturnsTrue() which does nothing but returns a value of true. This method is in a class called ReturnsTrueClass

The Arrange step in this example would be.

```csharp
ReturnsTrueClass t = new ReturnsTrueClass();
```

The Act step in this example would be.

```csharp
var result = t.ReturnTrue();
```

The Assert step in this example would be.

```csharp
Assert.AreEqual(true, result);
```

This is a stupidly simple example but hopefully you get the idea of how you can build all your tests with these three steps.

Recently I saw a tweet complaining that someone has mixed up expected and actual in the Assert statement.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">There is a minor but special hell reserved for those who mix up the expected and actual parameters in Assert.Equals</p>&mdash; Keith Williams (@zogface) <a href="https://twitter.com/zogface/status/882737770095149056?ref_src=twsrc%5Etfw">July 5, 2017</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

At first glance this probably isn’t the worst mistake to make as if your tests are all passing actual and expected are the same.

However tests will fail, that is the whole point of them, you can then fix bits of code. If you have mixed up actual and expected it adds extra time to debugging and figuring out what values are produced from your code and what you are expecting it to produce. It may be your test uses a mocking framework and somewhere in there, there is an issue, with mixed up expected/actual you may assume a problem in your code rather than the test.

Also, how do you make such an error? When I type Assert.AreEquals() in Visual Studio, Visual Studio tells me what each parameter does, it takes a matter of seconds to do this, just by hovering over the code.

One last tip to say about tests. Write your tests to test the behaviour of your application.