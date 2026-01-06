+++
title = "Moving files into blob storage"
date = "2018-01-22T00:00:00Z"
year = "2018"
month= "2018-01"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
copyright = false
cover = ""
tags = ["DevOps", "Azure"]
categories = ["tech"]
keywords = ["", ""]
description = "Flexible Architecture with Interfaces"
showFullContent = false
readingTime = true
aliases = [
    "/moving-files-into-blob-storage-5136",
    "/posts/moving-blobs-cloud-suppliers",
    "/posts/2018/01/22/moving-blobs-cloud-suppliers",
    "/posts/moving-files-into-blob-storage-5136",
    "/posts/2018/01/22/moving-files-into-blob-storage-5136",
    "/2018/01/22/moving-files-into-blob-storage-5136",
    "/2018/01/22/moving-blobs-cloud-suppliers"
]
+++
We are in the process of moving our companies websites onto the Azure platform. One of the challenges was to move image files out of the website project into blob storage. This week I have moved 150,000 of them.

One thing I keep banging on about is that your source code should not contain data. If it does every time you do a deployment you need to consider where these images are located and ensure you don’t overwrite or loose any. It also goes without saying that deployments of a few Mb are a lot quicker than deployments of 100s of Mb.

Azure blob storage also gives you advantages like distributing storage across multiple datacenters which would be impossible with traditional files on a server.

So now that we have established that this is a good idea lets look at how we could move large amounts of data. In my case all the filenames are stored in a SQL database so the plan of action was to simply loop through the files in the database, download from current storage (either locally or other cloud storage), upload to Azure and tidy up afterwards. Due to the number of images I am going to update the database and mark when a file has been processed so I can do the move over several days.

This is my code

```csharp
var source = "https://example.com/images/";
var tmp = Server.MapPath("~/tmp/");
if (!Directory.Exists(tmp))
{
 Directory.CreateDirectory(tmp);
}
var fixturePhotos = db.Images.Where(x => x.Moved == null || x.Moved == 0).Take(id);

foreach (var photo in fixturePhotos)
{
 try
 {
  string path = getFilePath(photo.FileName);

  if (!Directory.Exists(Server.MapPath("~/tmp/" + path)))
  {
    Directory.CreateDirectory(Server.MapPath("~/tmp/" + path));
  }
  WebClient WebClient = new WebClient();
  WebClient.DownloadFile(source + photo.FileName, tmp + photo.FileName);
  FileUploader f = new FileUploader(tmp + photo.FileName, photo.FileName);
  System.IO.File.Delete(tmp + photo.FileName);
  photo.Moved = 1;
 }
 catch
 {
  photo.Moved = 0;
 }
}
db.SaveChanges();
if (Directory.Exists(tmp))
{
 Directory.Delete(tmp, true);
}
```

First of all I create a tmp folder in the root of my website if it doesn’t exist to store my images temporarily.

I then use an entity framework model to query the database that haven’t been moved, and I use the take() method to limit how many results I process. (I have been passing in 1000 at a time)

I then use a foreach loop over all these files to perform the following actions.

1. Create additional subfolders if the filename variable stored in the database isn’t actually a filename but a filepath, note you will have to split filename and filepath which I haven’t included code for here.
2. Download file from the original url and save into the temporary folder
3. Upload to Azure
4. Delete temporary file
5. Update database giving a success or fail

Once the foreach is finished I commit the database changes and delete the temporary folder. I am sure there must be other ways to do this transfer but this was quick and easy to setup and now I have a copy of all the files in Azure storage so I can test out other issues with my website.

One last tip about how to schedule this code. I called the above code from a MVC controller and then wrote a Azure Function to call this code on a schedule.