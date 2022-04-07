+++
title = "Documenting your API"
date = "2019-03-27T20:00:45Z"
year = "2019"
month= "2019-03"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "https://storageaccountblog9f5d.blob.core.windows.net/blazor/wp-content/uploads/2019/03/image-3.png?w=662&ssl=1"
images = ['https://storageaccountblog9f5d.blob.core.windows.net/blazor/wp-content/uploads/2019/03/image-3.png?w=662&ssl=1']
tags = ["Swagger", "API"]
category="tech"
keywords = ["", ""]
description = "Documenting your API"
summary = "Documenting your API"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/documenting-your-api-4gcn",
    "/posts/documenting-your-api/",
    "/posts/documenting-your-api-4gcn",
    "/posts/2019/03/27/documenting-your-api-4gcn",
    "/posts/2019/03/27/documenting-your-api",
    "/2019/03/27/documenting-your-api-4gcn",
    "/2019/03/27/documenting-your-api"
]
+++
So you have created a super API that does something amazing. How do you document it so people will use it?

One way of easily documenting your API is to install the Swashbuckle package.

```
Install-Package Swashbuckle.AspNetCore
Install-Package Swashbuckle.AspNetCore.Swagger 
```

Then in you startup.cs add the following lines

```csharp
//In ConfigureServices

services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Info { Title = "API", Version = "v1", Description = "An API Description" });
    c.IncludeXmlComments(string.Format(@"{0}\API.xml", System.AppDomain.CurrentDomain.BaseDirectory));
});

//In Configure

app.UseSwagger();

app.UseSwaggerUI(c =>
{
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
        c.RoutePrefix = string.Empty;
});
```

Now when you browse to your API you will see the swagger documentation system.

![Image](https://storageaccountblog9f5d.blob.core.windows.net/blazor/wp-content/uploads/2019/03/image-3.png?w=662&ssl=1)

The RoutePrefix setting controls the path in which swagger will display. I have my docs at the root, but you might want them under the /docs or similar path.

The IncludeXmlComments setting from the ConfigureServices method allows you to load in any XML comments you have added to methods. For this to work you need to enable a setting to your build.

![Image](https://storageaccountblog9f5d.blob.core.windows.net/blazor/wp-content/uploads/2019/03/image-4.png?w=662&ssl=1)

The XML documentation file must be ticked and contain a path. Everytime you do a build, a XML file will be generated which contains all the comment blocks you have added to your code.

![Image](https://storageaccountblog9f5d.blob.core.windows.net/blazor/wp-content/uploads/2019/03/image-5.png?w=662&ssl=1)

Swagger will then use this XML documentation file to produce lovely looking documentation without you having to do anything extra.

![Image](https://storageaccountblog9f5d.blob.core.windows.net/blazor/wp-content/uploads/2019/03/image-6.png?fit=662%2C260&ssl=1)