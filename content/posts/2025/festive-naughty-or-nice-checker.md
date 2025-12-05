+++
title = "Creating a Festive Naughty or Nice Checker Using Semantic Kernel and .NET"
date = "2025-12-12T07:00:00Z"
year = "2025"
month = "2025-12"
author = "funkysi1701"
authorTwitter = "funkysi1701"
cover = "/images/2025/festive-tech-calendar.png"
images = ['/images/2025/festive-tech-calendar.png']
tags = [".NET", "Semantic Kernel", "AI", "Christmas", "festive", "naughty or nice", "C-Sharp", "machine learning", "tutorial"]
category = "tech"
description = "Learn how to build a fun festive Naughty or Nice checker using Semantic Kernel and .NET."
showFullContent = false
readingTime = true
copyright = false
featured = true
draft = false
aliases = [
    "/festive-naughty-or-nice-checker",
    "/posts/festive-naughty-or-nice-checker",
    "/posts/2025/12/12/festive-naughty-or-nice-checker",
    "/2025/12/12/festive-naughty-or-nice-checker"
]
+++

![Festive Tech Calendar](/images/2025/festive-tech-calendar.png)

## Introduction

I'm excited to be taking part in this year's [Festive Tech Calendar](https://festivetechcalendar.com/), a community-driven advent calendar showcasing amazing technical content throughout December. Make sure to check out the other excellent posts created by developers from around the world!

In this festive tutorial, we'll build a fun "Naughty or Nice" checker using Microsoft's Semantic Kernel and .NET. This playful AI-powered tool analyzes text descriptions and delivers a verdict on whether someone has been naughty or nice this year—perfect for adding some holiday cheer to your portfolio! Whether you're new to AI integration or looking to explore Semantic Kernel, this beginner-friendly guide will walk you through creating a complete working application from scratch. By the end, you'll have a deployable web app and understand how to integrate large language models into your .NET projects.

## My Take on AI

Before diving into code, I want to share a quick perspective on using AI in development. While building this demo, I used [GitHub Copilot](https://github.com/copilot) to transform a basic UI into something more festive.

Starting with a simple, functional interface:

![boring looking application](/images/2025/before.png)

After a few prompts to Copilot, I had a Christmas-themed demo with loading spinners and festive icons:

![Christmas version](/images/2025/after.png)

Could I have coded this myself? Absolutely. But I'd rather focus my energy on the backend Semantic Kernel integration than wrestling with CSS animations. **This is where AI shines—handling the tedious parts so you can focus on the interesting problems.**

### The Reality Check

That said, AI isn't magic:

- **Hallucinations happen** - I've lost time chasing incorrect suggestions, so don't retire your search engine just yet
- **Ownership questions remain** - Who owns AI-generated code? This is still being figured out
- **It's a tool, not a replacement** - AI augments developers; it doesn't replace critical thinking

My approach: Use AI as a productivity multiplier, but always verify, understand, and own what you ship.

## What is Semantic Kernel?

Semantic Kernel is an open-source SDK from Microsoft that makes it easy to integrate AI models into your .NET applications. It allows you to use large language models (LLMs) for tasks like text analysis, summarization, and more.

## Project Overview

We'll create a simple web app that:

- Accepts a name or short description of someone's behaviour
- Uses Semantic Kernel to analyze the input
- Returns a festive verdict: Naughty or Nice

## Prerequisites

- .NET 10 (I am not using any .NET 10 specific features so could probably be rewritten with older versions)
- Semantic Kernel (NuGet package)
- An OpenAI API key (for LLM access)

## Step 1: Setting Up the Project

The code for my project can be found on GitHub at [https://github.com/funkysi1701/FestiveTechCalendar2025](https://github.com/funkysi1701/FestiveTechCalendar2025)
It is based on the default Blazor template, with a few extra NuGet packages installed to do the AI cleverness.

## Step 2: Integrate Semantic Kernel

Configure Semantic Kernel to use your LLM provider (OpenAI). In the `Program.cs` file you will see the following code, this loads the OpenAI key and model from your `appsettings.json` config file, and allows it to be used by Semantic Kernel.

```csharp
var key = builder.Configuration.GetValue<string>("OpenAI:Key");
var model = builder.Configuration.GetValue<string>("OpenAI:Model");
if (!string.IsNullOrEmpty(key))
{
    builder.Services.AddOpenAIChatCompletion(
        modelId: model ?? throw new ApplicationException("Missing OpenAI Config"),
        apiKey: key
    );
}
builder.Services.AddKernel();
```

## Step 3: Create the Naughty or Nice Prompt

For the prompt I am passing to OpenAI I went through a few iterations. To begin with I tried:

```csharp
  var aiResponse = await _kernel.InvokePromptAsync($"You are a tool to help Santa identify if children have been naughty or nice. Has {childName} been naughty or nice this year?", cancellationToken: cancellationToken.Token);
```

| Input | Output |
|-------|--------|
| Santa | Short answer: Nice. Why: - Spreads joy and generosity globally - Works hard with his team, treats elves and reindeer well - Answers letters and keeps promises (on-time deliveries) Minor demerits (lighthearted): - Excess cookie consumption - Occasional chimney soot prints Verdict: Firmly on the Nice List. Want a fun “Official Nice Report” for Santa you can share? |
| Darth Vader | Not exactly a child, but Santa checks everyone. Darth Vader’s record this year includes Force-choking subordinates and aiding Imperial oppression—firmly Naughty. Mitigating note: he did protect his son and turn against the Emperor, which earns a small mercy. Final verdict: Naughty list (with a tiny redemption candy cane). |
| James | I don’t have access to Santa’s list or personal data, so I can’t say for sure about James. But I can help you decide with a quick Naughty/Nice check: Score each item: - Kind and helpful to family/classmates most of the time? (Yes +2, Sometimes +1, No 0) - Tells the truth and takes responsibility? (Yes +2, Sometimes +1, No 0) - Apologizes and makes things right after mistakes? (Yes +2, Sometimes +1, No 0) - Respects rules and others (no bullying or deliberate harm)? (Yes +2, Sometimes +1, No 0; deduct 2 if there’s repeated serious harm) - Does generous things (sharing, chores, helping the community)? (Yes +2, Sometimes +1, No 0) Totals: - 8–10: Nice List - 5–7: Mostly Nice (keep it up) - 2–4: Mixed (needs a December boost) - 0–1 or repeated serious harm: Naughty-for-now (with room to improve) If James needs a boost: make amends where needed, do one unprompted kindness or chore daily, be honest about mistakes right away, and share/donate something or help someone weekly. Share a few examples of James’s year and I’ll help you make the call. |
| Skeletor | Verdict: Naughty. Why: - Repeated attempts to conquer Eternia and seize Castle Grayskull - Habitual scheming, lying, and bullying his own minions - Frequent unleashing of dangerous magic on innocents Path back to the Nice List: - Call a truce with He-Man and protect Eternia for a season - Return stolen artifacts and undo harmful spells - Treat his minions fairly and do a few good deeds without expecting power in return |

This is far too wordy, I really just want a Naughty or Nice response.

Then I tried:

```csharp
  var aiResponse = await _kernel.InvokePromptAsync($"Given the following description, decide if the person is Naughty or Nice for Christmas. Respond only with 'Naughty' or 'Nice'. Description: {childsName}", cancellationToken: cancellationToken.Token);
```

| Input | Output |
|-------|--------|
| Santa | Nice |
| Darth Vader | Naughty |
| James | Nice |
| Skeletor | Naughty |

This is better but every name I tried is giving me a Nice, so let's see if we can try something a bit more clever.

## Conclusion

With just a few lines of code, you can create a fun and interactive Naughty or Nice checker using Semantic Kernel and .NET. This is a great way to learn about AI integration in .NET while spreading some holiday cheer!

Happy coding and Merry Christmas! 🎄

---

**References:**

- [Semantic Kernel GitHub](https://github.com/microsoft/semantic-kernel)
- [Microsoft Semantic Kernel Docs](https://learn.microsoft.com/en-us/semantic-kernel/)
- [OpenAI API](https://platform.openai.com/docs/api-reference)
- [Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-services/openai/)
