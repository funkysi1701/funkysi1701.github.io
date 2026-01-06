+++
title = "Creating DNS records programmatically"
date = "2017-10-16T20:00:45Z"
year = "2017"
month= "2017-10"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["Azure", "DNS"]
categories = ["tech"]
keywords = ["", ""]
description =  "Creating DNS records programmatically"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/creating-dns-records-programmatically-26lp",
    "/posts/creating-dns-records-programmatically",
    "/posts/creating-dns-records-programmatically-26lp",
    "/posts/2017/10/16/creating-dns-records-programmatically-26lp",
    "/posts/2017/10/16/creating-dns-records-programmatically",
    "/2017/10/16/creating-dns-records-programmatically-26lp",
    "/2017/10/16/creating-dns-records-programmatically",
    "/creating-dns-records-programmatically"
]
+++
DNS is the backbone of the internet. It converts domain names into IP addresses. But how can we do clever things with it?

Making DNS changes has always been a pain. You have to remember what company you registered your domain name with, then locate the login details for their website, login and fill in some web form and wait for the changes to replicate across the internet.

There are various websites that assign you a custom subdomain name like name.domain.com, obviously they must do this programmatically, they don’t have a guy following the above process.

Lets see how we could do this.

My first thought was to make use of the DNSimple API. [https://developer.dnsimple.com/v2/](https://developer.dnsimple.com/v2/) The API allows all sort of DNS changes to be made, however this is a paid service so let’s look at other options.

Azure now has a DNS section. You can go to the portal, add a DNS zone, and then add as many A, CNAME and MX records as you need. This is of course no better than doing it manually.

Azure offers a [SDK](https://docs.microsoft.com/en-us/azure/dns/dns-sdk) and an example Visual Studio project. Lets look at how it works.

First you need to setup some credentials to use your Azure subscription. The easiest way to do this is with powershell.

```powershell
Login–AzureRmAccount
$sp = New-AzureRmADServicePrincipal –DisplayName exampleapp –Password "{provide-password}"
Sleep 20
New-AzureRmRoleAssignment –RoleDefinitionName Contributor –ServicePrincipalName $sp.ApplicationId
```

This will create a AD Service Principal which has access to your Azure subscription.

You need to get the following IDs from the Azure portal.

subscriptionId for your subscription  
tenantId or the Azure AD Directory ID  
applicationId of the service principal created above  
password you entered into the powershell script above

```csharp
var serviceCreds = await ApplicationTokenProvider.LoginSilentAsync(tenantId, clientId, secret);
var dnsClient = new DnsManagementClient(serviceCreds);
dnsClient.SubscriptionId = subscriptionId;

var recordSetParams = new RecordSet();
recordSetParams.TTL = 3600;
recordSetParams.ARecords = new List<ARecord>();
recordSetParams.ARecords.Add(new ARecord("1.2.3.4"));
var recordSet = await dnsClient.RecordSets.CreateOrUpdateAsync(resourceGroupName, "funkysi1701.com", "test", RecordType.A, recordSetParams);
```

The above code connects to Azure and creates an A record for test.funkysi1701.com that points at the ip address 1.2.3.4.

Other DNS records can be created in a similar way.

The above example creates a new RecordSet but you can use the following to delete or get existing records.

```csharp
var recordSet = dnsClient.RecordSets.Get(resourceGroupName, "funkysi1701.com", "test", RecordType.A);

dnsClient.RecordSets.Delete(resourceGroupName, "funkysi1701.com", "test", RecordType.A);
```

Now I have found out that I can write a console app to edit my DNS records I need to change the nameservers for all my domains so I can take advantage of this new feature.