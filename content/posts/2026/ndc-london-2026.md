+++
title = "NDC London 2026"
date = "2026-01-31T15:46:00Z"
year = "2026"
month= "2026-01"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/2026/ndc-me.jpg"
images =['/images/2026/ndc-me.jpg']
tags = ["NDC London", "Conference", "DotNet", "Tech Events", "Software Development"]
categories = ["tech"]
description = "Updates and experiences from NDC London 2026."
showFullContent = false
readingTime = true
copyright = false
featured = false
draft = false
aliases = [
    "/ndc-london-2026",
    "/posts/ndc-london-2026",
    "/posts/2026/01/31/ndc-london-2026",
    "/2026/01/31/ndc-london-2026" 
]
+++

NDC London is one of the biggest software developer conferences in Europe, and I was fortunate enough to serve on the volunteer team for the second consecutive year. If you're interested in my first experience, check out my [2025 report](/posts/2025/volunteering-at-ndc/). 

The volunteer experience was just as rewarding as last year – the team was fantastic, the energy was incredible, and the sense of community was palpable. In this post, I'll focus on the talks I attended and the key insights I gained from them.

As I mentioned last year, volunteering gave me a **superpower**: increased confidence to network with speakers, vendors, fellow volunteers, and attendees. The connections you make at conferences like this are invaluable, and being part of the team made it even easier to engage with the community.

## Wednesday

My volunteer duties had me helping distribute conference hoodies at reception (a surprisingly popular task when you're handing out hundreds to eager attendees!), so I missed the opening keynote. However, my first session more than made up for it.

### Let's Break Some WCAG Rules
*Speaker: Elise Kristiansen*

This eye-opening talk examined how pervasively websites violate Web Content Accessibility Guidelines (WCAG). For those unfamiliar, WCAG provides a framework to make web content accessible to everyone, including people with disabilities. The guidelines are organized into three conformance levels:

- **Level A** - The bare minimum requirements
- **Level AA** - The legal requirement (what most laws mandate)
- **Level AAA** - The gold standard, aspirational but not legally required

The statistics Elise shared were sobering: 15-25% of people have some form of disability (whether permanent, temporary, or situational), yet a staggering **94.8% of websites contain at least one WCAG AA violation** – meaning they're actually breaking the law.

One of the most powerful demonstrations was a colour blindness test where only colour blind individuals could read certain numbers. It really drove home how design choices can inadvertently exclude significant portions of our users.

**Key Takeaways:**
- WCAG compliance isn't optional – it's a legal requirement and moral imperative
- Stop using `<div>` for everything; HTML is semantically rich for a reason
- Consider learning to use a screen reader to understand user experiences better
- Accessibility benefits everyone, not just those with disabilities

### Social Engineering: Hacking Humans
*Speaker: Pawel Sucholbiak*

A timely reminder that as soon as humans enter the equation, social engineering becomes a significant security risk. This talk explored various tactics malicious actors use to manipulate people into divulging confidential information or performing actions that compromise security. The human element remains the weakest link in any security chain.

### Supercharged Testing: AI-Powered Workflows with Playwright + MCP
*Speaker: Debbie O'Brien*

I'd heard Debbie and Carl Franklin discuss the Playwright MCP (Model Context Protocol) on .NET Rocks, but seeing it demonstrated live was transformative. This session showed how AI can dramatically enhance testing workflows by understanding test intent and generating Playwright test code.

**Key Takeaway:**
- Experiment with the Playwright MCP – it's a game-changer for test automation

### The Undersea Cable Network
*Speaker: Richard Campbell*

Richard took us on a fascinating journey through the history of undersea telecommunications cables – the literal backbone of the internet. He explored how these cables are laid, maintained, and the significant challenges when they're damaged (whether by ship anchors, earthquakes, or even shark bites!). It's humbling to realize that our globally connected world depends on physical cables crossing ocean floors.

### Java Sucks (So C# Didn't Have To)
*Speaker: Adele Carpenter*

An entertaining and insightful exploration of Java's history, examining how its early popularity locked in certain design decisions that became problematic over time. Adele showed how C# learned from Java's mistakes and made different choices that enabled better evolution. The key lesson: early success can create technical debt that's nearly impossible to pay down.

[View the slides](https://speakerdeck.com/97adele/java-sucks-so-c-number-didnt-have-to)

### Think Like a User: Practical UX Design Tips for Developers
*Speaker: Lex Lofthouse*

This session challenged developers to shift perspectives and consider user experience from the ground up. Lex provided practical, actionable advice for creating more intuitive interfaces.

**Recommended Reading:**
- *The Design of Everyday Things* by Don Norman

## Thursday

### OpenTelemetry At Scale 101: Intro to OpAMP
*Speakers: Aakansha Priya and Adriana Villela*

This session introduced OpAMP (Open Agent Management Protocol) for managing OpenTelemetry collectors at scale. While the scale discussed was beyond my current needs, it was valuable to understand the challenges and solutions for production observability in large distributed systems. The question of "which configuration should I run in production?" remains universal regardless of scale.

### A Defence of Technical Excellence
*Speaker: Chris Simon*

Chris made a compelling argument for maintaining high technical standards even under pressure to deliver quickly. Technical excellence isn't about perfectionism – it's about sustainable, maintainable code that serves the business long-term.

[Read more about this talk](https://chrissimon.au/speaking/talks/a-defence-of-technical-excellence/?read-more=1)

### How to Git Away with Murder
*Speaker: Sergès Goma*

A humorous yet practical look at Git workflows and how to recover from common (and not-so-common) Git disasters. The Q&A session at the end turned into a group therapy session where attendees shared their most spectacular Git mishaps and recovery stories. If you've ever accidentally force-pushed to main, this talk was for you!

### Networking Break: JetBrains Rider Team

I skipped one session to have an extended conversation with the JetBrains Rider team at their booth. These unstructured conversations are often where you get the most value at conferences – learning about upcoming features, sharing feedback, and understanding the roadmap directly from the team building the tools you use daily.

### Code That Writes Code: .NET Source Generators
*Speaker: Glenn F. Henriksen*

Source generators are one of .NET's most powerful yet underutilized features. Glenn demonstrated how they can eliminate boilerplate, improve performance by moving work to compile-time, and create type-safe code generation patterns. This is definitely an area I need to explore more for my own projects.

### Warm and Fuzzy: Semantic Search in .NET
*Speaker: Jonathan "J." Tower*

Jonathan delivered an excellent introduction to implementing semantic search using vector databases. He covered several options for .NET developers:
- **SQL Server 2025** with native vector support
- **Azure Cosmos DB** for NoSQL vector storage
- **Qdrant** as a specialized vector database

The talk also touched on **Semantic Kernel**, which is now part of the Microsoft Agent Framework – a significant development for building intelligent applications.

**Action Items:**
- Implement semantic search for my blog to improve content discovery
- Explore the [demo code on GitHub](https://github.com/trailheadtechnology/dotnet-semantic-search/tree/main/code)

### Coding 4 Fun: 8-bit Game Emulation in .NET
*Speaker: Alex Thissen*

Pure fun! Alex walked through building an 8-bit game emulator in .NET, demonstrating low-level programming concepts in a modern language. A great reminder that not everything we build needs to be "enterprise-ready" – sometimes coding is just about learning and enjoyment.

## Friday

### Keynote: AI-Powered App Development
*Speaker: Steve Sanderson*

Steve Sanderson (creator of Blazor and Knockout.js) delivered an inspiring keynote on how AI is transforming application development. Rather than focusing on the hype, he demonstrated practical ways AI tools are already enhancing developer productivity – from code completion to entire feature generation. The key message: AI is a tool that amplifies developers, not replaces them.

### What in the Hunger Games is Happening with Recruitment?
*Speaker: Suzi Edwards-Alexander*

A frank and often amusing look at the current state of tech recruitment. Suzi traced how we arrived at today's challenging hiring landscape – from the over-hiring during the pandemic to the current market correction. She provided practical advice for both job seekers and hiring managers navigating this difficult environment. The Hunger Games comparison was apt!

### The Great Brain Robbery: Navigating the Dark Future of Online Manipulation
*Speaker: Jeff Watkins*

A sobering examination of how online platforms use psychological manipulation and dark patterns to exploit users' attention and data. Jeff didn't just highlight the problems – he offered strategies for recognizing and resisting these tactics, both as developers and as users. This talk made me reconsider several design patterns I've implemented without questioning their ethical implications.

### Beyond the AI Hype: What's Real, What's Next
*Speaker: Richard Campbell*

Richard cut through the AI hype to examine what's genuinely transformative versus what's just marketing. He explored current capabilities, realistic near-term developments, and the fundamental limitations we need to understand. A perfect counterbalance to the morning's optimistic keynote – both perspectives are necessary for making informed decisions about AI adoption.

### Resilient by Design
*Speaker: Chris Ayers*

The final session I attended focused on building resilient systems from the ground up. Chris covered patterns like circuit breakers, bulkheads, and retry policies – but more importantly, the mindset shift required to design for failure rather than just success. In production, it's not *if* things will fail, but *when* and *how gracefully*.

## Final Thoughts

NDC London 2026 was another incredible experience. The breadth of topics – from accessibility and UX to AI, observability, and system resilience – reflects the diverse skills modern developers need. 

My key takeaways from this year:
1. **Accessibility is non-negotiable** – both legally and morally
2. **AI tools are here to stay** – learn to leverage them effectively
3. **Technical excellence matters** – shortcuts today become tomorrow's technical debt
4. **Community is everything** – the conversations between sessions were as valuable as the talks themselves

Huge thanks to the NDC organizing team, my fellow volunteers, all the speakers who shared their knowledge, and the attendees who made this such an engaging event. If you get the chance to attend (or volunteer at) NDC, I highly recommend it.

See you at NDC London 2027! 🚀
