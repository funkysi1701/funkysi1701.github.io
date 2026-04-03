+++
title = "Diagrams with Mermaid"
date = "2022-06-19T18:00:45Z"
year = "2022"
month= "2022-06"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/mermaid2.png"
images = ['/images/mermaid2.png']
tags = ["github", "mermaid", "documentation"]
categories = ["tech"]
description = "Learn how to create diagrams from code and text using Mermaid. This guide covers the basics of Mermaid, how to integrate it into your projects, and tips for generating clear and effective diagrams for your documentation."
showFullContent = false
readingTime = true
copyright = false
featured = false
aliases = [
    "/diagrams-with-mermaid-1d41",
    "/posts/diagrams",
    "/posts/2022/06/14/diagrams",
    "/posts/diagrams-with-mermaid-1d41",
    "/posts/2022/06/14/diagrams-with-mermaid-1d41",
    "/2022/06/14/diagrams-with-mermaid-1d41"    
]
+++
I have been wanting to produce a diagram of the architecture of my side project for some time, but I have put it off as never sure what the correct tools is for this job.

[Mermaid](https://mermaid.js.org/) is a tool that lets you create diagrams from code and text. I first came across this tool about a year ago for use in a project. I had forgotten about this tool until the other day, when I was thinking about this problem again.

Is it possible to embed a mermaid diagram in the markdown used in a github repo? Well the answer is yes, so lets look at how that works.

A simple mermaid diagram looks like this:

```
graph TD;
    A[fff]--->B;
    A--->C;
    B--->D;
    C--->D;
```

which renders like this:

![Mermaid](/images/mermaid.png)

Lets look at what it is doing.

TD means the chart is top down.

A is the name of a node in the chart, [fff] is a label being applied to it.

Then we just define the relationships between the different nodes, you can have <---, ---> or ---, or even<br/> <--->

Lets look at my architecture. I have a database (cosmosDB), I have a website running on Azure Static Web Apps, I have some Azure functions for getting data into and out of my database. I also have Application Insights monitoring the whole thing. I also have a console app for doing some data import stuff. This produces a diagram like this:

![Mermaid](/images/mermaid2.png)

The code to produce this and display it on my [github repo](https://github.com/funkysi1701/Blogv2/) is simply

```
```mermaid
graph TD
    A[Azure Static Web App]---B[Http Fn]
    B---D[Database]
    C[Timer Fn]---D
    D---E[Import Console App]
    F[App Insights]---A
    F---B
    F---C
```

Pretty nice for a few lines of code to show what system talks with what. 

There are improvements that can be made to the diagram, for example changing the shapes of the different services.

eg ![Mermaid](/images/mermaid3.png)

If you live in the AzureDevOps world you can add a mermaid diagram to your wiki pages (but I don't think to your markdown files). Just use the following syntax

```
::: mermaid
sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
    Alice-)John: See you later!
:::
```
For more info see the docs [here](https://docs.microsoft.com/en-us/azure/devops/project/wiki/wiki-markdown-guidance?view=azure-devops) 

What diagrams are you going to build?