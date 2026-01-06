+++
title = "Exchange Web Services"
date = "2016-04-21T20:00:45Z"
year = "2016"
month= "2016-04"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["EWS", "MVC", "Exchange"]
categories = ["tech"]
keywords = ["", ""]
description =  "Exchange Web Services"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/exchange-web-services-399o",
    "/posts/exchange-web-services",
    "/posts/exchange-web-services-399o",
    "/posts/2016/04/21/exchange-web-services-399o",
    "/posts/2016/04/21/exchange-web-services",
    "/2016/04/21/exchange-web-services-399o",
    "/2016/04/21/exchange-web-services"
]
+++
Where I work we use a really old fashioned way of recording where in the country employees are: Excel!

For years I have been trying to persuade staff to use calendars in Exchange. Outlook is great for looking at one or two people’s calendars at once but quickly gets unmanageable for looking at ten or more peoples availability.

Recently I have started looking into how easy it is to query this information to give a custom view.

Microsoft provide an API to query exchange information called Exchange Web Services or EWS. I have only used EWS with my Exchange 2010 setup, but the documentation mentions working with Exchange 2007 and older or Exchange online.

Here are the basics of what I have tried. Fire up Visual Studio and from nuget install EWS.

```powershell
Install-Package Microsoft.Exchange.WebServices
```

I started off with a simple Console App to see how it all worked, and then extended it to a MVC website. I found querying exchange directly was slow, but it is easy enough to cache information in a database.

To start you need to create an Exchange Service object, by specifying the version of Exchange you are using.

```csharp
ExchangeService service = new ExchangeService(ExchangeVersion.Exchange2010);
```

Next you need to pass the URL you are using to access Exchange.

```csharp
service.Url = new Uri("mail.example.com");
```

To access information from exchange you need to pass some Exchange credentials, ideally a username and password that has access to view all the calendars you want to look at.

```csharp
service.Credentials = new WebCredentials("username","password");
```

Next pass the email address of the user who owns the calendar you want to look at.

```csharp
service.ImpersonatedUserId = new ImpersonatedUserId(ConnectingIdType.SmtpAddress, "me@example.com");
```

My particular exchange server has a self signed SSL certificate which is not going to be trusted by remote clients.  The following line ignores this validation check and makes my program connect.

```csharp
System.Net.ServicePointManager.ServerCertificateValidationCallback = (sender, certificate, chain, sslPolicyErrors) => true;
```

Now that we have connected to exchange we just need a few lines to look for events in the calendars.

```csharp
// Initialize the calendar folder object with only the folder ID.
CalendarFolder calendar = CalendarFolder.Bind(service, WellKnownFolderName.Calendar, new PropertySet());

// Set the start and end time and number of appointments to retrieve.
CalendarView cView = new CalendarView(startDate, endDate);

// Limit the properties returned to the appointment's subject, start time, and end time.
cView.PropertySet = new PropertySet(AppointmentSchema.Subject, AppointmentSchema.Start, AppointmentSchema.End);

// Retrieve a collection of appointments by using the calendar view.
FindItemsResults<Appointment> appointments = calendar.FindAppointments(cView);
```

Now that you have an appointments object you can loop through each element with a foreach loop. In my case I assign each elements Subject to a variable, which I can then do what I like with (display in a console window, save to a database, display in an MVC website.)

```csharp
foreach (Appointment a in appointments)
{
    if (a.Subject != null)
    {
        subject += a.Subject.ToString();
    }
}
```

My website queries a SQL database which I can easily populate with a console app that runs at regular intervals throughout the day.

There is a lot more I want to do with this project as this is only the basics of what you can do with Exchange Web Services. So expect more blog posts on this subject as I expand its functionality and learn new ways of doing things.
