+++
title = "Expiring Azure AD Client Secrets"
date = "2022-10-18T18:00:45Z"
year = "2022"
month= "2022-10"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/AzureADSecret.png"
images = ['/images/AzureADSecret.png']
tags = ["DotNet", "Azure", "Active Directory", "Secret"]
categories = ["tech"]
description = "Learn how to handle expiring Azure AD client secrets in your applications. This guide covers troubleshooting steps, best practices for managing client secrets, and how to avoid common pitfalls to ensure your applications remain secure and functional."
showFullContent = false
readingTime = true
copyright = false
featured = false
aliases = [
    "/expiring-azure-ad-client-secrets-22m2",
    "/posts/expiring-azuread-client-secrets",
    "/posts/2022/10/18/expiring-azuread-client-secrets",
    "/posts/expiring-azure-ad-client-secrets-22m2",
    "/posts/2022/10/18/expiring-azure-ad-client-secrets-22m2",
    "/2022/10/18/expiring-azure-ad-client-secrets-22m2"    
]
+++
This morning the client complains that the website is not working. I do some checking and I confirm that there is indeed an error.

The error they are seeing is:

```
An unhandled exception occurred while processing the request.
MsalServiceException: A configuration issue is preventing authentication 
- check the error message from the server for details. 
You can modify the configuration in the application registration portal. 
See https://aka.ms/msal-net-invalid-client for details. 
Original exception: AADSTS7000222: The provided client secret keys for 
app '00000000-0000-0000-0000-000000000000' are expired. 
Visit the Azure portal to create new keys for your app: https://aka.ms/NewClientSecret, 
or consider using certificate credentials for added security: https://aka.ms/certCreds.
```

The fix for this is relatively simple, generate a new client secret in Azure AD and update the website config to make use of it.

The problem is that this problem will reoccur in 3, 6, 12, 18 or 24 months, depending on what expiry date you set on the secret.

![Add a client secret](/images/AzureADSecret.png)

A suggestion from twitter is that Logic Apps and Event Grid might help solve this problem. Lets see how this might work.

Logic Apps have a consumption plan, so this kind of solution shouldn't break the bank as will only cost per run eg daily/weekly etc

But first here is a powershell script that lists all the secrets that are due to expire in the next 30 days.

```powershell
#secret expiration date filter (for example 30 days)
$LimitExpirationDays = 30

#Retrieving the list of secrets that expires in the above range of days
$SecretsToExpire = Get-AzureADApplication -All:$true | ForEach-Object {
    $app = $_
    @(
        Get-AzureADApplicationPasswordCredential -ObjectId $_.ObjectId
        Get-AzureADApplicationKeyCredential -ObjectId $_.ObjectId
    ) | Where-Object {
        $_.EndDate -lt (Get-Date).AddDays($LimitExpirationDays)
    } | ForEach-Object {
        $id = "Not set"
        if($_.CustomKeyIdentifier) {
            $id = [System.Text.Encoding]::UTF8.GetString($_.CustomKeyIdentifier)
        }
        [PSCustomObject] @{
            App = $app.DisplayName
            ObjectID = $app.ObjectId
            AppId = $app.AppId
            Type = $_.GetType().name
            KeyIdentifier = $id
            EndDate = $_.EndDate
        }
    }
}

#Printing the list of secrets that are near to expire
if($SecretsToExpire.Count -EQ 0) {
    Write-Output "No secrets found that will expire in this range"
}
else {
    Write-Output "Secrets that will expire in this range:"
    Write-Output $SecretsToExpire.Count
    Write-Output $SecretsToExpire
}
```

This works quite well, but I have to manually run it every so often. I have not found a way to automate this as I don't know how to get past the MFA that is configured on my Azure AD tenant.

Now lets look at how a Logic App might help us. First of all we need somewhere to query the expiry dates, and Azure Key Vault is the ideal place to store them.

Create a Key Vault if you don't already have one and add a new Secret. Manually add the Client Secret from Azure AD and give it a name you can identify it with. Tick the Set expiration date and save the expiry date of your secret. 

Now Create a Logic App, I am going to use Consumption, so it only costs you when it runs.

Using the Logic Apps Designer, start with a Recurrence trigger. This lets you queue up your logic app on a schedule, I've set mine to run every 30 days.

Next run a Get Secret command from your Key Vault. Select the identifying name you saved the secret with earlier. This will retrieve the secret from the Key Vault, if you go into the settings you can hide the output as you are only really interested in the expiry date.

I am doing a low tech solution for now, and just emailing myself the expiry date. It is easy to add the expiry date of the secret to an email.

Later on I might add a bit more logic to only email myself when the expiry is less than 30 days, a reminder to create a new secret. When creating a new secret in Azure AD, I also need to add the secret and expiry date into Key Vault.

At the very least this solution will give me an early warning of when my secrets are about to expire. It is possible to get my website to read information from Key Vault directly which I may well investigate.