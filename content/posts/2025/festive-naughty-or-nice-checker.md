+++
title = "Creating a Festive Naughty or Nice Checker Using Semantic Kernel and .NET"
date = "2025-12-12T10:00:00Z"
year = "2025"
month = "2025-12"
author = "funkysi1701"
authorTwitter = "funkysi1701"
cover = "/images/2025/festive-tech-calendar.png"
images = ['/images/2025/festive-tech-calendar.png']
tags = [".NET", "Semantic Kernel", "AI", "Christmas", "festive", "naughty or nice", "C-Sharp", "machine learning", "tutorial"]
category = "tech"
description = "By reading this post, you'll learn how to build a festive 'Naughty or Nice' checker web app using Semantic Kernel and .NET, and understand how to integrate AI into your own projects."
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
- An OpenAI API key - ⚠️ **Note**: API usage costs ~$0.01-0.05 per request

### OpenAI and Costs

For this example I have used an OpenAI API Key. This is not free, however while writing this example I have only spent a few pounds in tokens. For more information about OpenAI head over to https://platform.openai.com/

For this reason I have not provided a live demo, (I don't want you all using my API key), and no API keys are included in my example code.

## Step 1: Setting Up the Project

Create a new Blazor Web App:

```bash
dotnet new blazor -n NaughtyOrNiceChecker
cd NaughtyOrNiceChecker
```

Install the required NuGet packages: (Microsoft.SemanticKernel.Connectors.OpenAI Version 1.67.1 as I write this)

```bash
dotnet add package Microsoft.SemanticKernel.Connectors.OpenAI 
```

Add your OpenAI configuration to appsettings.json:

```json
{
  "OpenAI": {
    "Key": "your-api-key-here", // Head over to https://platform.openai.com/settings/organization/api-keys
    "Model": "gpt-5" // I am using gpt-5 but feel free to experiment with other models
  }
}
```

🔒 **Security**: Never commit API keys to GitHub. Use user secrets or environment variables.

The code for my project can be found on GitHub at [https://github.com/funkysi1701/FestiveTechCalendar2025](https://github.com/funkysi1701/FestiveTechCalendar2025).

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

## Step 3: Create the Blazor Component

Create a new file `Components/Pages/NaughtyOrNice.razor`:

```csharp
@page "/naughty-or-nice"
@inject Kernel _kernel
@rendermode InteractiveServer

<PageTitle>Naughty or Nice Checker</PageTitle>

<h3>🎅 Naughty or Nice Checker</h3>

<div class="card">
    <div class="card-body">
        <input @bind="input" 
               placeholder="Describe their behavior..." 
               class="form-control mb-3" />
        <button @onclick="CheckStatus" 
                class="btn btn-primary">
            Check Status
        </button>
        
        @if (!string.IsNullOrEmpty(response))
        {
            <div class="alert alert-@alertClass mt-3">
                <h4>@response</h4>
            </div>
        }
    </div>
</div>

@code {
    private string childsName = "";
    private string response = "";
    private string alertClass => response == "Naughty" ? "danger" : "success";
    private bool isLoading = false;

    public async Task CheckStatus()
    {
        isLoading = true;
        await InvokeAsync(StateHasChanged);
        response = string.Empty;
        try
        {
            var input = (childsName).Trim();
            if (string.IsNullOrEmpty(input))
            {
                return;
            }

            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30));
            var prompt = "You are Santa's assistant. Given the child's name or short description, " + 
            "decide if they are Naughty or Nice for Christmas. " + 
            "Respond only with one word: Naughty or Nice. " +
            "No punctuation, no explanation. Input: {{$input}}";
            var classifyFunc = _kernel.CreateFunctionFromPrompt(prompt);
            var aiResponse = await _kernel.InvokeAsync(
                classifyFunc, 
                new() 
                { 
                    ["input"] = input 
                }, 
                cts.Token
            );
            var text = aiResponse.GetValue<string>()?.Trim();

            // Normalize and enforce strict output
            if (string.Equals(text, "naughty", StringComparison.OrdinalIgnoreCase))
            {
                response = "Naughty";
            }
            else if (string.Equals(text, "nice", StringComparison.OrdinalIgnoreCase))
            {
                response = "Nice";
            }
            else
            {
                // Fallback: default to Naughty to avoid leaking other content
                response = "Naughty";
            }
        }
        finally
        {
            isLoading = false;
            await InvokeAsync(StateHasChanged);
        }
    }
}
```

Note: The _kernel is injected automatically because we registered it in Program.cs with builder.Services.AddKernel().

## Step 4: Crafting the Perfect Prompt

Getting AI to return exactly what you want requires iteration. I'll walk you through my prompt engineering journey from verbose outputs to production-ready responses.

### Iteration 1: Too Verbose

```csharp
var aiResponse = await _kernel.InvokePromptAsync(
    $"You are a tool to help Santa identify if children have been naughty or nice. " +
    $"Has {input} been naughty or nice this year?",
    cancellationToken: cancellationToken.Token
);
```

| Input | Output |
|-------|--------|
| Santa | Short answer: Nice. Why: - Spreads joy and generosity globally - Works hard with his team, treats elves and reindeer well - Answers letters and keeps promises (on-time deliveries) Minor demerits (lighthearted): - Excess cookie consumption - Occasional chimney soot prints Verdict: Firmly on the Nice List. Want a fun “Official Nice Report” for Santa you can share? |
| Darth Vader | Not exactly a child, but Santa checks everyone. Darth Vader’s record this year includes Force-choking subordinates and aiding Imperial oppression—firmly Naughty. Mitigating note: he did protect his son and turn against the Emperor, which earns a small mercy. Final verdict: Naughty list (with a tiny redemption candy cane). |
| James | I don’t have access to Santa’s list or personal data, so I can’t say for sure about James. But I can help you decide with a quick Naughty/Nice check: Score each item: - Kind and helpful to family/classmates most of the time? (Yes +2, Sometimes +1, No 0) - Tells the truth and takes responsibility? (Yes +2, Sometimes +1, No 0) - Apologizes and makes things right after mistakes? (Yes +2, Sometimes +1, No 0) - Respects rules and others (no bullying or deliberate harm)? (Yes +2, Sometimes +1, No 0; deduct 2 if there’s repeated serious harm) - Does generous things (sharing, chores, helping the community)? (Yes +2, Sometimes +1, No 0) Totals: - 8–10: Nice List - 5–7: Mostly Nice (keep it up) - 2–4: Mixed (needs a December boost) - 0–1 or repeated serious harm: Naughty-for-now (with room to improve) If James needs a boost: make amends where needed, do one unprompted kindness or chore daily, be honest about mistakes right away, and share/donate something or help someone weekly. Share a few examples of James’s year and I’ll help you make the call. |
| Skeletor | Verdict: Naughty. Why: - Repeated attempts to conquer Eternia and seize Castle Grayskull - Habitual scheming, lying, and bullying his own minions - Frequent unleashing of dangerous magic on innocents Path back to the Nice List: - Call a truce with He-Man and protect Eternia for a season - Return stolen artifacts and undo harmful spells - Treat his minions fairly and do a few good deeds without expecting power in return |

This is far too wordy, I really just want a Naughty or Nice response.

### Iteration 2: Constraining the Output

Then I tried:

```csharp
var aiResponse = await _kernel.InvokePromptAsync(
    $"Given the following description, decide if the person is Naughty or Nice for Christmas. " +
    $"Respond only with 'Naughty' or 'Nice'. " +
    $"Description: {input}",
    cancellationToken: cancellationToken.Token
);
```

| Input       | Output  |
|-------------|---------|
| Santa       | Nice    |
| Darth Vader | Naughty |
| James       | Nice    |
| Skeletor    | Naughty |

This is better but every name I tried is giving me a Nice, so let's see if we can try something a bit more clever. However if instead of only including a name, we include some naughty or nice actions we get some interesting results.

| Input                             | Output  |
|-----------------------------------|---------|
| Santa delivered some presents     | Nice    |
| Darth Vader destroyed Alderaan    | Naughty |
| James tidied his room             | Nice    |
| Skeletor got cross with Evil Lynn | Naughty |

### Version 3: Non-AI Approach (Plugin Example)

This version demonstrates Semantic Kernel's plugin system without using AI. While it doesn't actually help Santa (it just generates a hash-based result), it shows how you can integrate traditional .NET code into Semantic Kernel workflows.

**Why show this?** To illustrate that Semantic Kernel isn't just for AI—you can mix AI calls with regular code execution in the same pipeline.

```csharp
var aiResponse = await _kernel.InvokeAsync(
    pluginName, 
    "GenerateHash", 
    new KernelArguments
    {
        ["input"] = input
    }
);
```

This version invokes a semantic kernel plugin function called GenerateHash. The function itself is defined in a separate class with a KernelFunction attribute, it is really simple just generates a hash from the input string. This is just an example of how you can call .NET code from Semantic Kernel. The kernel function requires an extra line to wire up correctly I have placed this in the OnInitialized method.

```csharp
protected override void OnInitialized()
{
  var rngPlugin = new ExamplePlugin();
  _kernel.ImportPluginFromObject(rngPlugin, pluginName);
}
```

```csharp
public class ExamplePlugin
{
    [KernelFunction]
    public int GenerateHash(string input)
    {
        if (input == null)
        {
            throw new ArgumentNullException(nameof(input));
        }
        var hash = input.GetHashCode();

        return hash > 0 ? 0 : 1;
    }
}
```

### Final Version: Production-Ready Implementation

My last example is very similar to Version 2 but let's have a look at it.

```csharp
var prompt = "You are Santa's assistant. Given the child's name or short description, " + 
            "decide if they are Naughty or Nice for Christmas. Respond only with one word: Naughty or Nice. " +
            "No punctuation, no explanation. Input: {{$input}}";
            var classifyFunc = _kernel.CreateFunctionFromPrompt(prompt);
            var aiResponse = await _kernel.InvokeAsync(
                classifyFunc, 
                new() 
                { 
                    ["input"] = input 
                }, 
                cancellationToken.Token
            );
```

Here we have a bit more error checking to make sure we have entered a valid string before calling OpenAI. This time we use the CreateFunctionFromPrompt method to pass in a prompt, we then invoke the prompt along with the string that has been entered.

This time we check for naughty or nice in the response before returning that to the user, if neither is returned we return Naughty.

This works quite well if we enter a more descriptive input.

| Input                             | Output  |
|-----------------------------------|---------|
| Santa delivered some presents     | Nice    |
| Darth Vader destroyed Alderaan    | Naughty |
| James tidied his room             | Nice    |
| Skeletor got cross with Evil Lynn | Naughty |

As you can see if we describe the actions of someone we can categorize them as naughty or nice, which is basically what Santa does, so this tool should be a great help to him.

![Is Santa Naughty or Nice?](/images/2025/working-naughty-nice.png)

### Comparing All Versions

| Version | Approach | Pros | Cons | Use Case |
|---------|----------|------|------|----------|
| 1 | Open-ended prompt | Rich explanations | Too verbose | Learning/debugging |
| 2 | Constrained output | Concise | Needs context | Simple classifications |
| 3 | Hash-based (no AI) | No API costs | Not intelligent | Plugin example only |
| 4 | Validated prompts | Reliable, safe | More code | Production |

## Conclusion

In this tutorial, we built a festive AI-powered application using Semantic Kernel and .NET. Here's what we accomplished:

- ✅ Integrated OpenAI with Semantic Kernel in a Blazor app
- ✅ Learned prompt engineering through iteration (4 versions!)
- ✅ Implemented proper error handling and output validation
- ✅ Created a fun, interactive holiday application

I have tried to highlight some of the different ways that you can use Semantic Kernel that you could use in your own projects. Some of my examples could be accomplished without the use of Semantic Kernel, for example randomly generating Naughty and Nice doesn't need AI, however hopefully you can see that getting results from AI can then be augmented using traditional .NET code to execute other functions.

### Key Takeaways

- **Prompt engineering matters** - Notice how Version 4's explicit instructions produced better results
- **Validation is essential** - Always sanitize LLM outputs before displaying to users
- **Keep it simple** - Complex doesn't mean better (Version 3's random approach was overkill)

### Cost Considerations

During development, I spent only a few pounds on API tokens. For production:

- Use Azure OpenAI for predictable pricing
- Implement caching for common queries
- Set up rate limiting to prevent abuse

### Deployment Options

This Blazor app can be deployed to:

- **Azure Static Web Apps** (free tier includes 2 custom domains)
- **Azure App Service** (full .NET hosting)
- **Docker containers** (run anywhere)

### Next Steps

Want to extend this project? Try:

- Add a database to track naughty/nice history
- Implement user authentication
- Deploy to Azure Static Web Apps
- Add more context (age, location) for better AI decisions

Happy coding and Merry Christmas! 🎄

---

**References:**

- [Semantic Kernel GitHub](https://github.com/microsoft/semantic-kernel)
- [Microsoft Semantic Kernel Docs](https://learn.microsoft.com/en-us/semantic-kernel/)
- [OpenAI API](https://platform.openai.com/docs/api-reference)
- [Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-services/openai/)
