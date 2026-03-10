+++
title = "AI Blog Post Title TBC"
date = "2026-03-10T09:00:00Z"
year = "2026"
month = "2026-03"
author = "funkysi1701"
authorTwitter = "funkysi1701"
cover = "/images/2026/welcome-2026.png"
images = ['/images/2026/welcome-2026.png']
tags = []
categories = ["tech"]
description = ""
showFullContent = false
readingTime = true
copyright = false
featured = false
draft = false
aliases = [
  "/2025-in-review-and-2026-goals",
  "/posts/2025-in-review-and-2026-goals"
]
+++

## Introduction – The Shift We are Living Through

As I write this I have just been made redundant. AI is not being used to explain this particular redundancy but many across the industry are.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I just got laid off..... Again...... I am still in shock. I loved my new job and was creating great impact but here we are again. Layoffs are not personal so I am ok but yeh will be looking for something new...... Again......</p>&mdash; Debbie O&#39;Brien (@debs_obrien) <a href="https://twitter.com/debs_obrien/status/2027171846743892254?ref_src=twsrc%5Etfw">February 27, 2026</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

I listened to an excellent talk at [NDC London](/ndc-london-2026) by Debbie O'Brien about using AI to do amazing things with [Playwright MCP](https://youtu.be/Numb52aJkJw). If people that are using AI to its fullest are losing their jobs to AI, what hope is their for our industry, are we all going to be writing AI prompts and that's it?

But lets stop for a minute. Software Development is an ever changing industry. There is always something new to learn and this AI craze is no different.

The role of the developer has always shifted as tools improved. We moved from writing assembly to high-level languages, from manual deployments to automated pipelines, and from managing servers to deploying infrastructure with a few commands.

The real question is how our role is changing and how we need to adapt and make the most of the new tools available to us.

## What's Actually Changed?

There's a lot of noise around AI in software development. Headlines swing between "AI will replace developers" and "AI is just autocomplete." The truth, as usual, sits somewhere in the middle.

But something real has changed. Not just the tools we use, but the speed, shape, and workflow of software development.

### From Autocomplete to Autonomous

For years, developer productivity tools focused on helping us type faster.

We had IntelliSense, snippets, code generation tools, and IDE refactorings. These were useful, but they were fundamentally reactive. They waited for the developer to start typing and then offered suggestions.

AI coding tools have crossed a different threshold.

Instead of simply completing the next line, they can:

- Generate entire classes or modules
- Suggest architecture patterns
- Write tests
- Perform multi-file refactors
- Explain unfamiliar codebases
- Propose fixes for bugs

The important shift is this:

The tool is no longer just responding to the code — it's responding to the intent.

You describe a goal, and the AI attempts to produce the implementation.

This moves AI from being an autocomplete engine to something closer to an execution partner.

It's not autonomous in the sense of replacing developers, but it does change the relationship between the developer and the code.

We're no longer writing every line ourselves. Increasingly, we are directing the creation of code rather than manually constructing it.

### The Cost of a First Draft Has Collapsed

Historically, one of the hidden costs of software development was simply getting started.

Creating a prototype involved:

- Setting up project structure
- Writing boilerplate
- Defining models
- Creating basic tests
- Wiring components together

None of this work was intellectually difficult, but it took time.

AI tools have dramatically reduced the cost of that first draft.

You can now describe a feature and quickly get:

- A rough implementation
- Basic unit tests
- A starting architecture
- A prototype that actually runs

This doesn't mean the output is perfect. In fact, it often isn't. But the barrier to experimentation has dropped significantly.

Ideas that might have taken half a day to prototype can now be explored in minutes.

And that has a subtle but powerful effect on development culture:

**When experimentation becomes cheap, developers try more ideas.**

This encourages iteration, exploration, and rapid feedback in ways that previously required more discipline and effort.

### Writing Code Is No Longer the Bottleneck

One of the most surprising outcomes of AI coding tools is that they reveal something many experienced developers already suspected:

**Typing code was never the hardest part of software development.**

The real difficulty lies elsewhere:

- Understanding the problem
- Designing a clean solution
- Managing complexity
- Communicating intent to other developers
- Maintaining systems over time

AI can produce large volumes of code very quickly. But that doesn't automatically translate into good software.

If anything, it shifts the constraint.

The bottleneck is no longer how fast code can be written.

The bottleneck is now:

- How clearly can problems be defined
- How well can systems be designed
- How effectively can code be reviewed and maintained

In other words, AI accelerates the mechanical part of development, but the thinking part becomes even more important.

## What Hasn't Changed (But People Think It Has)

With every major technological shift, there's a temptation to assume everything is different now. AI has amplified that feeling in software development. When tools can generate large amounts of code in seconds, it's easy to believe the fundamentals of the profession have been rewritten.

But when you look closely at real software projects, something interesting appears: many of the hardest parts of software development haven't changed at all.

AI has accelerated the mechanics of coding, but the underlying challenges of building reliable, useful software are still very much human problems.

### Understanding Requirements Is Still the Hardest Problem

Software projects rarely fail because developers can't write code. They fail because the problem wasn't clearly understood in the first place.

AI tools can generate implementations, but they rely entirely on the input they're given. If the requirement is vague, incomplete, or contradictory, the output will reflect that.

Consider how requirements often arrive in real projects:

- A stakeholder describes a problem in business language.
- Important edge cases are discovered later.
- Different teams have slightly different expectations.
- Requirements evolve as users interact with the system.

None of this has changed with AI.

The ability to ask the right questions, clarify ambiguity, and translate business needs into technical solutions remains one of the most valuable skills a developer can have.

In fact, as code generation becomes easier, clear problem definition becomes even more important.

### Architecture and Trade-Offs Still Matter

AI can suggest design patterns, propose architectures, and generate project structures. But good software architecture isn't just about picking the right pattern.

It's about making trade-offs.

Questions like these still require human judgment:

- Should this be a microservice or part of the monolith?
- Is the added complexity of caching worth the performance gain?
- What level of abstraction will make this system maintainable in five years?
- Where should the boundaries between components sit?

These decisions depend heavily on context:

- Team size
- Deployment environment
- Operational constraints
- Long-term maintenance costs

AI can offer suggestions, but it cannot fully understand the organisational and operational realities of the system it's helping to build.

That responsibility still sits with the developer.

### Accountability Doesn't Disappear

One thing that definitely hasn't changed is ownership.

When software breaks in production, nobody blames the IDE. The same principle applies to AI.

If an AI-generated query deletes the wrong data, or a generated implementation introduces a subtle performance issue, the responsibility still lies with the developer who reviewed and shipped the code.

Production systems still require:

- Careful testing
- Monitoring and observability
- Security awareness
- Performance tuning
- Ongoing maintenance

AI can assist with many of these areas, but it doesn't remove the need for human accountability.

At the end of the day, someone has to understand the system well enough to take responsibility for it.

And that hasn't changed at all.

## The New Developer Skill Stack

If we accept that AI has collapsed the cost of a first draft, then the skill stack shifts upward.

Not because the old skills are irrelevant, but because they're no longer the limiting factor as often.

Syntax still matters. Fundamentals still matter. But the competitive advantage moves towards the parts of the job that are hard to automate: precision, judgment, and system-level thinking.

Think of it as an evolution of the same craft.

### Prompting as a Technical Skill

"Prompting" sounds fluffy until you realise what it actually is in practice: specifying a problem clearly enough that another agent (human or machine) can make progress without guessing.

The better you are at being precise, the more useful the tool becomes.

That means getting specific about:

- The goal (what "done" looks like)
- The constraints (performance, security, backwards compatibility, tech stack)
- Inputs/outputs and edge cases
- The environment (language version, framework, database, deployment model)
- The trade-offs you care about (simplicity vs flexibility, latency vs cost)

The second part is breaking down problems.

If you ask an AI to "build a feature", you'll get a lot of code, but it will almost always bake in assumptions you didn't mean to make.

The best results come when you treat it like a junior developer with infinite typing speed:

- Ask it to propose an approach first
- Get it to list assumptions and risks
- Then implement one slice at a time (and keep the changes small)

Finally, iterative refinement becomes the workflow.

You rarely get the best output on the first prompt. But you can converge quickly if you review the result, point out what is wrong or missing, and re-run with tighter guidance.

In other words, prompting is less about "magic words" and more about feedback loops.

### Code Review Becomes Critical Thinking

When AI can generate 200 lines of code in seconds, reviewing becomes the high-leverage skill.

That review can't just be "does it compile" or "does it look idiomatic". It has to be critical thinking.

AI-generated code often fails in ways that are subtle:

- It handles the happy path beautifully and ignores weird real-world inputs
- It silently changes behaviour (especially around dates, nulls, and defaults)
- It introduces concurrency bugs that only show up under load
- It uses a library/API incorrectly but convincingly
- It passes tests that are too shallow to be meaningful

The most important thing to review is not the code itself, but the assumptions underneath it.

I find it useful to explicitly ask:

- What does this code assume about the data?
- What does it assume about ordering, timing, and retries?
- What happens when dependencies fail?
- What would I see in logs/metrics if this breaks in production?
- What tests would convince me this is correct?

This is where experienced developers become even more valuable: not because they can type faster, but because they've seen how systems fail.

### Systems Thinking > Syntax Knowledge

AI is good at syntax and local patterns. It is much worse at understanding the bigger picture.

The developers who thrive in this shift will be the ones who can hold the system in their head:

- How data flows through the application
- Where the boundaries are between components
- What needs to be observable in production (logs, metrics, traces)
- What makes the codebase maintainable for the next person

Systems thinking is what stops an AI-generated "solution" from becoming a future incident.

It's also why the old advice from [The Pragmatic Programmer](/pragmatic-programmer) matters even more now: remember the big picture.

Not "can we generate this function", but:

- Is this the simplest thing that could work?
- Can we operate it at 2am?
- Can we change it safely in six months?
- Are we making the system easier to understand or harder?

AI accelerates output, but it doesn't automatically improve outcomes and that leads to a real risk if we aren't careful.

## The Risk: Shallow Engineers

## The Opportunity: 10x Leverage (For the Right People)

## Practical Advice for Developers (Actionable Section)

## What This Means for Juniors vs Seniors

## The Big Question: Are We Becoming Directors Instead of Builders?

## Conclusion – My Opinion

## CTA

As mentioned at the start of this article I am .NET Developer who is looking for work so if you can help at all please reach out. Also if you are in the same position do reach out, together we can help each other.