+++
title = "Azure Key Vault"
date = "2019-03-19T20:00:45Z"
year = "2019"
month= "2019-03"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["Website", "Security", "Azure"]
categories = ["tech"]
keywords = ["", ""]
description = "Azure Key Vault"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/azure-key-vault-53ld",
    "/posts/azure-key-vault/",
    "/posts/azure-key-vault-53ld",
    "/posts/2019/03/19/azure-key-vault-53ld",
    "/posts/2019/03/19/azure-key-vault",
    "/2019/03/19/azure-key-vault-53ld",
    "/2019/03/19/azure-key-vault"
]
+++
[Azure Key Vault](https://docs.microsoft.com/en-gb/azure/key-vault/) is a secure way of storing your keys, certificates and secrets so your application can access everything it needs to but you don’t have them being stored insecurely anywhere such as in source control.

I have been wanting to give Azure Key Vault a try for a while now as it can make use of Azure Active Directory to give your web app an identity so it can authenticate itself into the key vault to access secrets. Pretty clever but with a lot of moving parts a bit complex.

For my example I am just going to connect to my Key Vault and get a secret and display it somewhere on a web page. This is of course not what you want to do as secrets are secret and shouldn’t be displayed just used to authenticate into whatever, however it is an easy way to prove I am connecting to the Key Vault and everything is working.

Lets look at some code. I have a .net core application and to start with lets install three nuget packages.

```txt
Microsoft.Azure.KeyVault
Microsoft.Azure.Services.AppAuthentication
Microsoft.Extensions.Configuration.AzureKeyVault
```

I’ve not include version numbers as these will no doubt get updated over time but hopefully it will still work.

Now in your Program.cs add the following code, replacing [KeyVaultName] with the name of your Key Vault.

```csharp
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((context, config) =>
            {
                    var builtConfig = config.Build();

                    var azureServiceTokenProvider = new AzureServiceTokenProvider();
                    var keyVaultClient = new KeyVaultClient(
                        new KeyVaultClient.AuthenticationCallback(
                            azureServiceTokenProvider.KeyVaultTokenCallback));

                    config.AddAzureKeyVault(
                        $"https://[KeyVaultName].vault.azure.net/",
                        keyVaultClient,
                        new DefaultKeyVaultSecretManager());
            })
            .UseApplicationInsights()
            .UseStartup<Startup>();
    }
```

Now all you need to do is look at your configuration to pull out secrets from your Azure Key Vault. If you have a secret called AppSecret then you can use the following code snippet to retrieve its value, assuming \_configuration is an implementation of Microsoft.Extensions.Configuration.IConfiguration.

```txt
_configuration["AppSecret"];
```

Now if you do all of this and run from an Azure Web App or run locally it will fail to pull anything from the Key Vault. You need to give your web app an identity and configure your key vault to allow access from that identity.

Once my code has been deployed to an Azure Web App I get the following error.

![Image](/images/2019/image.png)

Lets look at fixing that, first lets give my web app an Identity. Open up the Azure portal and find the identity section of your web app and turn the setting on.

![Image](/images/2019/image-1.png)

Now you need to grant that identity permission to your key vault. In the portal open up Access Policies in your key vault and click add Policy, select the identity of your web app in the principal box and select the following settings to grant access to your secret.

![Image](/images/2019/image-2.png)

Now you have a website that can pull secrets out of Key Vault but only that unique identity. Anyone who has access to your source code will not have access to your secrets, even if they push your code to a different Azure Web App.
