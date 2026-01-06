+++
title = "Weekly Update #001"
date = "2020-11-14T00:00:00Z"
year = "2020"
month= "2020-11"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
copyright = false
cover = ""
tags = ["DotNet"]
categories = ["tech"]
keywords = ["", ""]
description = "Dotnet 5, dotnetconf and adding devops buildID and hash"
showFullContent = false
readingTime = true
aliases = [
    "/weekly-update-001-33d0",
    "/posts/weekly-update-001/",
    "/posts/weekly-update-001-33d0",
    "/posts/2020/11/14/weekly-update-001-33d0",
    "/posts/2020/11/14/weekly-update-001",
    "/2020/11/14/weekly-update-001-33d0",
    "/2020/11/14/weekly-update-001"
]
+++
One of my favourite podcasts is Troy Hunts weekly update. In it he discusses stuff that he has been working on, plus some personal stuff. I am going to attempt to do something similar. It will probably take me a few of these before we get a look and feel that works.

#### Monday

A week off work, mainly to use it up before year end, plus want to get a few jobs around the house done. 

I did ask the following question on Twitter. 

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Hey <a href="https://twitter.com/hashtag/azurefamily?src=hash&amp;ref_src=twsrc%5Etfw">#azurefamily</a> and <a href="https://twitter.com/hashtag/dotnet?src=hash&amp;ref_src=twsrc%5Etfw">#dotnet</a> developers how do I get more involved in mentoring?</p>&mdash; Simon Foster (@funkysi1701) <a href="https://twitter.com/funkysi1701/status/1325742644014829568?ref_src=twsrc%5Etfw">November 9, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

As a one person dev team, my biggest weakness is working with others so any ideas of how to change that are great.

#### Tuesday

Dotnet 5 is out! The latest version of dotnet is released by Microsoft and to celebrate there is [dotnetconf](https://www.dotnetconf.net/) to listen to. Due to time zones and family commitments, I haven't listened to an awful lot of it but I did see the keynote and loved the 3 Scott's chat.

#### Wednesday

My youngest son was 3 today, due to Coronavirus we didn't do much but we celebrated as a family, and he even had a zoom call.

#### Thursday

Blazor has a new feature [Virtualize](https://docs.microsoft.com/en-us/aspnet/core/blazor/components/virtualization?view=aspnetcore-5.0) where a list of items can only load the ones on screen. I have been trying to get this to work on my blog, works great running locally but not working in production yet.

Think I know what might be happening. I use Cloudflare to do my SSL, as Custom SSL certs for the cheaper Azure Web Apps is not supported. Something in Cloudflare is caching or interfering.

https://zimmergren.net/solved-asp-net-core-blazor-web-sites-does-not-work-with-cloudflare-html-minification/

Turning off HTML minification fixed my issue!

One additional thing I added to my Blog is the config page which details some of the config settings. I think this probably came from https://www.hanselman.com/blog/adding-a-git-commit-hash-and-azure-devops-build-number-and-build-id-to-an-aspnet-website but it was a while ago when I first did this on another project.

At the moment we have .net Version, Commit and Build links.

The .Net Version is obtained from

```csharp
@System.Runtime.InteropServices.RuntimeInformation.FrameworkDescription
```

A few other bits of info can be obtained from System.Runtime.InteropServices.RuntimeInformation which I have included on the page for fun. There are probably security concerns with exposing all this info publicly so something to bear in mind if you try this.

Build Info is passed to my code by a build step

```yml
- script: '(echo $(Build.BuildNumber) && echo $(Build.BuildId)) > .buildinfo.json'
  displayName: "Emit build number"
  workingDirectory: '$(Build.SourcesDirectory)/src/WebBlog'
  failOnStderr: true
```

This simply passed the build id and number which are stored as variabled and saves them in a text file.

I then have a class that reads them and constructs a link.

```csharp
using Microsoft.Extensions.Hosting;
using System;
using System.IO;
using System.Linq;
using System.Reflection;

namespace WebBlog
{
    public class AppVersionInfo
    {
        private const string _buildFileName = ".buildinfo.json";
        private readonly string _buildFilePath;
        private string _buildNumber = string.Empty;
        private string _buildId = string.Empty;
        private string _gitHash = string.Empty;
        private string _gitShortHash = string.Empty;

        public AppVersionInfo(IHostEnvironment hostEnvironment)
        {
            _buildFilePath = Path.Combine(hostEnvironment.ContentRootPath, _buildFileName);
        }

        public string BuildNumber
        {
            get
            {
                if (string.IsNullOrEmpty(_buildNumber))
                {
                    if (File.Exists(_buildFilePath))
                    {
                        var fileContents = File.ReadLines(_buildFilePath).ToList();

                        if (fileContents.Count > 0)
                        {
                            _buildNumber = fileContents[0];
                        }
                        if (fileContents.Count > 1)
                        {
                            _buildId = fileContents[1];
                        }
                    }

                    if (string.IsNullOrEmpty(_buildNumber))
                    {
                        _buildNumber = DateTime.UtcNow.ToString("yyyyMMdd") + ".0";
                    }

                    if (string.IsNullOrEmpty(_buildId))
                    {
                        _buildId = "123456";
                    }
                }

                return _buildNumber;
            }
        }

        public string BuildId
        {
            get
            {
                if (string.IsNullOrEmpty(_buildId))
                {
                    var _ = BuildNumber;
                }

                return _buildId;
            }
        }

        public string GitHash
        {
            get
            {
                if (string.IsNullOrEmpty(_gitHash))
                {
                    var version = "1.0.0+LOCALBUILD";
                    var appAssembly = typeof(AppVersionInfo).Assembly;
                    var infoVerAttr = (AssemblyInformationalVersionAttribute)appAssembly
                        .GetCustomAttributes(typeof(AssemblyInformationalVersionAttribute)).FirstOrDefault();

                    if (infoVerAttr != null && infoVerAttr.InformationalVersion.Length > 6)
                    {
                        version = infoVerAttr.InformationalVersion;
                    }
                    _gitHash = version[(version.IndexOf('+') + 1)..];
                }

                return _gitHash;
            }
        }

        public string ShortGitHash
        {
            get
            {
                if (string.IsNullOrEmpty(_gitShortHash))
                {
                    _gitShortHash = GitHash.Substring(GitHash.Length - 6, 6);
                }
                return _gitShortHash;
            }
        }
    }
}
```

The BuildId and BuildNumber properties just fetch the details saved into the text file during the build. This can then be passed to build the build link.

```html
<a href="https://dev.azure.com/{OrgName}/{RepoName}/_build/results?buildId=@appInfo.BuildId&view=results">
    @appInfo.BuildNumber
</a>
```

Finally, the GitHash properties need to fetch the hash and shorthash of the commit which is a bit more complex. This is achieved using the following line in your build.

```yml
- task: DotNetCoreCLI@2
  displayName: 'Publish'
  inputs:
    command: 'publish'
    publishWebProjects: true
    arguments: '--output $(Build.ArtifactStagingDirectory) /p:SourceRevisionId=$(Build.SourceVersion)'
```

/p:SourceRevisionId=$(Build.SourceVersion) add the revision hash to [assembly: AssemblyInformationalVersion] during the build which can then be extracted using the gitHash property above, before being passed into the commit link.

```html
<a href="https://github.com/{OrgName}/{RepoName}/commit/@appInfo.GitHash">
    @appInfo.ShortGitHash
</a>
```
