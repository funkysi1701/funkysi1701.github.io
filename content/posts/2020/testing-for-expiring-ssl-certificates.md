+++
title = "Testing for expiring SSL Certificates"
date = "2020-03-03T20:00:45Z"
year = "2020"
month= "2020-03"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["Security", "SSL", "Testing"]
categories = ["tech"]
keywords = ["", ""]
description =  "Testing for expiring SSL Certificates"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/testing-for-expiring-ssl-certificates-2dmj",
    "/posts/testing-for-expiring-ssl-certificates",
    "/posts/testing-for-expiring-ssl-certificates-2dmj",
    "/posts/2020/03/03/testing-for-expiring-ssl-certificates-2dmj",
    "/posts/2020/03/03/testing-for-expiring-ssl-certificates",
    "/2020/03/03/testing-for-expiring-ssl-certificates-2dmj",
    "/2020/03/03/testing-for-expiring-ssl-certificates"
]
+++
Let's Encrypt is amazing, you can easily add SSL certificates to any website and automate the renewal process. I have talked [before](https://www.funkysi1701.com/posts/let-s-encrypt-is-awesome-3f5j/) about how impressive it is.

Once you start adding SSL certificates to your production sites however you may want to check when they expire so you don't get caught out. You can always open your site in your favourite browser and view the certificate information and expiry date.

![SSL Cert](/images/2020/jb78re4fmm1ofx81f3mu.jpg)
However there is a way to automate this check.

```csharp
[Fact]
public void IsSSLExpiring()
{               
  var handler = new HttpClientHandler
  {
    ServerCertificateCustomValidationCallback = CustomCallback
  };
  var client = new HttpClient(handler);

  HttpResponseMessage response = client.GetAsync("https://www.example.com").GetAwaiter().GetResult();
  Assert.True(response.IsSuccessStatusCode);
}

private bool CustomCallback(HttpRequestMessage arg1, X509Certificate2 arg2, X509Chain arg3, SslPolicyErrors arg4)
{
  var now = DateTime.UtcNow;
  var expire = arg2.NotAfter;
  var diff = (expire - now).TotalDays;

  Assert.InRange(diff, 30, 1000);
  return arg4 == SslPolicyErrors.None;
}
```

This code gets the SSL expiry date from https://www.example.com and will fail the  xunit test if the expiry date is less than 30 days in the future. I then schedule my tests to run regularly on all my environments with a Let's Encrypt Certificate and this gives me advanced warning if a SSL certificate is about to expire.

The Assert.InRange(diff, 30, 1000) line will fail the test if the expiry date is less than 30 days or greater than 1000, but as the default expiry for Let's Encrypt certificates is three months it will never be greater than 1000 days even with a freshly installed certificate. These values can be tweaked to suit your use case, however 30 days is enough time for me to investigate what is happening.

To execute my tests I use a scheduled build in Azure DevOps, but anything that regularly can run your tests will do the job.

The code above is just a simple example to get your started for my purposes I have put all my URLs into config files and just pass these into my tests, so I don't need a custom test for every different URL.
