+++
title = "Weekly Update #002"
date = "2020-11-21T00:00:00Z"
year = "2020"
month= "2020-11"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
copyright = false
cover = ""
tags = ["Docker", "Azure"]
categories = ["tech"]
keywords = ["", ""]
description = "Time sync in docker containers"
showFullContent = false
readingTime = true
aliases = [
    "/weekly-update-002-1021",
    "/posts/weekly-update-002/",
    "/posts/weekly-update-002-1021",
    "/posts/2020/11/21/weekly-update-002-1021",
    "/posts/2020/11/21/weekly-update-002",
    "/2020/11/21/weekly-update-002-1021",
    "/2020/11/21/weekly-update-002"
]
+++
I know Active Directory is fussy about clocks being in sync however not sure how todays issue happened.

I run my docker compose file from Visual Studio and I get a weird error.

```txt
SecurityTokenNotYetValidException: IDX10222: Lifetime validation failed. The token is not yet valid. ValidFrom: 'System.DateTime', Current time: 'System.DateTime'.
```

I deleted my containers, open and close Visual Studio a few times, nothing helps. Eventually I think to find out what the time is on my container. It has yesterday's date. What has happened here? Surely recreating containers would have caused them to have todays date? I reboot and everything is fine again.

Turns out that it is a know issue, see https://thorsten-hans.com/docker-on-windows-fix-time-synchronization-issue I am using WSL2 and I have now changed back to using Hyper-V and the issue hasn't come back.

Earlier in the week I spotted my build step was failing.

```yaml
  - task: NuGetToolInstaller@0
```

Swapping to the next version of the step is all I needed to do to fix it.

```yaml
  - task: NuGetToolInstaller@1
```

My guess is that support was dropped for this earlier version or there is some other incompatability with .Net 5.
