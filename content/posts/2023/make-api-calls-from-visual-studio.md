+++
title = "Make API calls from Visual Studio or Visual Studio Code"
date = "2023-11-19T22:50:00Z"
year = "2023"
month= "2023-11"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
copyright = false
cover = "/images/endpoint-explorer.png"
images = ['/images/endpoint-explorer.png']
tags = ["Visual Studio", "API" ]
categories = ["tech"]
keywords = ["", ""]
description = "Learn how to make API calls directly from Visual Studio or Visual Studio Code using the new Endpoint Explorer feature. This guide covers how to view, manage, and test your API endpoints efficiently within your development environment."
showFullContent = false
readingTime = true
draft = false
aliases = [
    "/make-api-calls-from-visual-studio-or-visual-studio-code-89n",
    "/make-api-calls-from-visual-studio",
    "/2023/11/16/make-api-calls-from-visual-studio"
]
+++
It is that exciting time of year where Microsoft announce a new version of .Net (Version 8 this time) and Visual Studio. There have been lots of announcements which I am still digesting, but one that caught my eye was a new window in Visual Studio that shows all your API endpoints.

The new window is called **Endpoint Explorer** and can be added from the menu **View > Other Windows > Endpoint Explorer**.

![Endpoint Explorer](/images/endpoint-explorer.png)

If you right click on one of the endpoints you can view the code or send a request. It works with minimal APIs or standard MVC APIs. If you select send a request a .http file will be created, this is a feature that has been in Visual Studio for a while but I haven't taken much notice.

The syntax for writing these API calls is fairly simple

```
GET {{Catalog.API_HostAddress}}/api/v1/catalog/items
```

Or something more complex, this one is a POST with a body and a header. This is how you might call APIs which require authentication. Just include a header with your auth token.


```
POST {{Catalog.API_HostAddress}}/api/v1/catalog/items
Accept: application/json

{
    "name": "Test",
    "description": "Test",
    "price": 1.99,
    "pictureFileName": "test.png",
    "pictureUri": "https://picsum.photos/200/300"

}

```

You can also set up various variables at the top of your .http files by prefixing with an @, by default you get one that defines your base URL, but you can add more. 

eg @variable = value

Full docs of how you use .http files can be found [here](https://learn.microsoft.com/en-us/aspnet/core/test/http-files?view=aspnetcore-8.0) 

A hyperlink above each API call in your .http file is labelled Send request. This initiates the API call and your window splits in half with the right hand side displaying the response.

The response has four tabs, a nicely json formatted response, a raw response, a headers tab and a request tab.

Now you will notice an env box underneath your file tabs, where the method dropdown is in a normal c# class file. It took me a while to figure out how to setup environments, but you can add a file that contain environment specific config, like base URL for test/prod/dev etc.

This blog post tells me about it [here](https://devblogs.microsoft.com/visualstudio/safely-use-secrets-in-http-requests-in-visual-studio-2022/) but the main thing is you need to add a json file called **http-client.env.json** and create some json like this:

```
  "local": {
    "Api_HostAddress": "http://localhost:44338"
  },
  "dev": {
    "Api_HostAddress": "https://dev.example.com"
  },
  "test": {
    "Api_HostAddress": "https://test.example.com"
  },
  "prod": {
    "Api_HostAddress": "https://prod.example.com"
  }
```

Other environment specific variables can be added in the same way. Now you can easily call your API in different environments without having to change the URL each time.

## But what about VS Code? 

Well it turns out that VS Code has a similar feature, but it is not enabled by default. You need to install the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension. Once installed you can create a .http file and start making API calls. The syntax is very similar to Visual Studio.

VS Code has a similar concept of environments. Go to Extensions > REST Client > Extension Settings and click on Edit in settings.json. Add the same settings we used with VS to your settings.json file. You can now switch environments from the command palette "Rest Client: Switch Environment" and select the environment you want to use.

You can make use of the response of one API call in the request of another.

```
### 1st API Call
# @name login
POST {{Catalog.API_HostAddress}}/api/v1/identity/login
Content-Type: application/json

{
    "user": "username",
    "password": "password"
}

### 2nd API Call
GET {{Catalog.API_HostAddress}}/api/v1/catalog/items
Authorization: Bearer {{login.response.body.token}}
Content-Type: application/json

```

The last feature of VS Code I want to mention is that it can make GQL calls.

```
POST {{Catalog.API_HostAddress}}/graphql
X-REQUEST-TYPE: GraphQL
Content-Type: application/json
Authorization: Bearer {{login.response.body.token}}

query ($name: String!, $owner: String!) {
  repository(name: $name, owner: $owner) {
    name
    fullName: nameWithOwner
    description
    diskUsage
    forkCount
    stargazers(first: 5) {
        totalCount
        nodes {
            login
            name
        }
    }
    watchers {
        totalCount
    }
  }
}

{
    "name": "vscode-restclient",
    "owner": "Huachao"
}
```

Sorry postman but I think I have a new favourite tool for making API calls.
