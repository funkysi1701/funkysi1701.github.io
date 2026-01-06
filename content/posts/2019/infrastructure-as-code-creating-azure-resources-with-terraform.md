+++
title = "Infrastructure as Code - Creating Azure Resources with Terraform"
date = "2019-05-11T20:00:45Z"
year = "2019"
month= "2019-05"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["Azure", "Infrastructure", "Terrafrom", "DevOps"]
categories = ["tech"]
keywords = ["", ""]
description = "Infrastructure as Code - Creating Azure Resources with Terraform"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/infrastructure-as-code-creating-azure-resources-with-terraform-2kdn",
    "/posts/infrastructure-as-code-creating-azure-resources-with-terraform",
    "/posts/infrastructure-as-code-creating-azure-resources-with-terraform-2kdn",
    "/posts/2019/05/11/infrastructure-as-code-creating-azure-resources-with-terraform-2kdn",
    "/posts/2019/05/11/infrastructure-as-code-creating-azure-resources-with-terraform",
    "/2019/05/11/infrastructure-as-code-creating-azure-resources-with-terraform-2kdn",
    "/2019/05/11/infrastructure-as-code-creating-azure-resources-with-terraform"
]
+++
Terraform is a way to script the creation of Azure Resources. By scripting the creation of your resources you can run them again and again and be certain that everything is configured exactly the same as the script has specified. No more forgetting to tick the tick box, if it’s in your script then it will be deployed with exactly the same configuration.

The process of executing a terraform script follows this basic process.

**terraform init** – Initialises the terraform directory
**terraform plan** – generates and displays what will be executed
**terraform apply** – applies the terraform script to your Azure subscription
**terraform destroy** – deletes your Azure resource that were created in the previous step

Lets look at how you might execute a terraform script from your build or release pipeline.

I am executing my terraform scripts from my release pipeline and as I don’t want to check binaries into my source code I am going to add a bit of plumbing to get things in the right places. The terraform binary can be obtained from https://www.terraform.io/downloads.html.

To start with I am executing a Powershell script to download the terraform binary, this is in the form of a zip file, so i need to download and unzip it.

```powershell
#Download
$url = "https://releases.hashicorp.com/terraform/0.11.13/terraform_0.11.13_windows_amd64.zip"
$output = "terraform.zip"
(New-Object System.Net.WebClient).DownloadFile($url, $output)

#Unzip
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::ExtractToDirectory($output, Get-Location)
```

Now that I have the terraform binaries I can just run Azure Cli and execute the terraform commands above.

Now it is time to look at the the terraform script. This particular script creates a resource group, an app service plan and a webapp.

```
# Configure the Microsoft Azure Provider
provider "azurerm" {
  subscription_id = ""
  client_id       = ""
  client_secret   = ""
  tenant_id       = ""
}

resource "azurerm_resource_group" "rg" {
        name = "resource-group"
        location = "northeurope"
}

resource "azurerm_app_service_plan" "plan" {
  name                = "planname"
  location            = "${azurerm_resource_group.rg.location}"
  resource_group_name = "${azurerm_resource_group.rg.name}"

  sku {
    tier = "Standard"
    size = "S1"
  }
}

resource "azurerm_app_service" "webapp" {
  name                = "example-app-service"
  location            = "${azurerm_resource_group.rg.location}"
  resource_group_name = "${azurerm_resource_group.rg.name}"
  app_service_plan_id = "${azurerm_app_service_plan.plan.id}"
}
```
There are four guids that you need to fill in from your azure subscription and to find these you need to run a few commands from Azure Cli. Check out
https://docs.microsoft.com/en-us/azure/virtual-machines/linux/terraform-install-configure for more detail on these commands.

Run these either from Azure Cloud Shell or from Powershell command prompt after Azure Cli has been installed.

az login – to login to azure a browser window will open up.

az account show –query "{subscriptionId:id, tenantId:tenantId}"
This will show you your subscription id.

az account set –subscription="${SUBSCRIPTION_ID}"
Where ${SUBSCRIPTION_ID} is the subscription id you found in the last step.

az ad sp create-for-rbac –role="Contributor" –scopes="/subscriptions/${SUBSCRIPTION_ID}"
Where ${SUBSCRIPTION_ID} is the subscription id you found in the last step and assumes you have permission to the subscription.

This last command will about a series of Guids which you need to fill in at the top of your terraform file appId = client_id, password = client_secret, tenant = tenant_id and subscription_id you already have.

This just gives you a taste of what you can do with terraform. Looking at the [Azure Terraform docs](https://docs.microsoft.com/en-us/azure/terraform/) there are loads of different resources you can create and even a [github repo](https://github.com/terraform-providers/terraform-provider-azurerm) with some samples.