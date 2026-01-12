+++
title = "Uploading Files to AWS"
date = "2017-07-03T20:00:45Z"
year = "2017"
month= "2017-07"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["AWS", "C-Sharp"]
categories = ["tech"]
keywords = ["", ""]
description =  "Uploading Files to AWS"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/uploading-files-to-aws-1koo",
    "/posts/uploading-files-to-aws/",
    "/posts/uploading-files-to-aws-1koo",
    "/posts/2017/07/03/uploading-files-to-aws-1koo",
    "/posts/2017/07/03/uploading-files-to-aws",
    "/2017/07/03/uploading-files-to-aws-1koo",
    "/2017/07/03/uploading-files-to-aws"
]
+++

I am a fan of Azure but today I have been looking at AWS. Specifically how to upload and download files.

AWS S3 stores files in Buckets. I already had an AWS S3 account setup with a Bucket. I am going to assume you have got a bucket setup and concentrate on the code to get files in and out.

First step is to use nuget to install the AWS packages. In nuget the packages you want are called AWSSDK.Core and AWSSDK.S3.

The using statements you want to use are called Amazon.S3 and Amazon.S3.Transfer, not sure why this doesn’t match nuget, this difference caught me out a couple of times.

Now to the code that uploads files

```c#
AmazonS3Client AWSclient = new AmazonS3Client(accessKeyID, secretAccessKeyID, Amazon.RegionEndpoint.EUWest1);  
TransferUtility fileTransferUtility = new TransferUtility(AWSclient);  
using (FileStream streamWriter = new FileStream(path, FileMode.Open))  
{  
  TransferUtilityUploadRequest fileTransferUtilityRequest = new TransferUtilityUploadRequest  
  {  
    BucketName = "flawlessimages",  
    InputStream = streamWriter,  
    Key = fileName  
  };  
  fileTransferUtility.Upload(fileTransferUtilityRequest);  
}
```

Lets break it down and look at what it does.

```c#
AmazonS3Client AWSclient = new AmazonS3Client(accessKeyID, secretAccessKeyID, Amazon.RegionEndpoint.EUWest1);
```

This creates an instance of AmazonS3Client, we are passing the Access Key and Secret Access Key both of which can be found from your Amazon S3 account My Security Credentials section. Amazon.RegionEndpoint.EUWest1 specifies the amazon data centres that your bucket is located in.

```c#
TransferUtility fileTransferUtility = new TransferUtility(AWSclient);
```

This creates an instance of TransfterUtility using the AmazonS3Client instance we created in the previous step.

```c#
using (FileStream streamWriter = new FileStream(path, FileMode.Open))  
{
```

This opens up a filestream from a files path and specifies that the file should be opened.

```c#
TransferUtilityUploadRequest fileTransferUtilityRequest = new TransferUtilityUploadRequest  
{  
  BucketName = "flawlessimages",  
  InputStream = streamWriter,  
  Key = fileName  
};  
fileTransferUtility.Upload(fileTransferUtilityRequest);  
```

This last step specifies which bucket to upload to, what input stream to upload and the Key to use. Key is just AWS way of referring to files, more commonly referred to as the filename.

This is all you need to do to upload a file to your Bucket. The file will be located at https://s3-eu-west-1.amazonaws.com/[bucketname]/[filename], however by default it will not be downloadable until you set Read permission to everyone, once you do that anyone who has the link will be able to download your file.

This is the same permission level as any file you have on your webserver, however AWS has a better way.

```c#
using (s3Client = new AmazonS3Client(accessKeyID, secretAccessKeyID, Amazon.RegionEndpoint.USEast1))  
{  
  GetPreSignedUrlRequest request1 = new GetPreSignedUrlRequest  
  {  
    BucketName = bucketName,  
    Key = filename,  
    Expires = DateTime.Now.AddMinutes(5)  
  };  
  urlString = s3Client.GetPreSignedURL(request1);  
}
```

Here we are generating a url to download the file, but we are specifying that it is only valid for 5 minutes. This means that if you share the url it will only work for 5 minutes, after that AWS will give an access denied message.

This is much better security than you have on a typical web server, and easy to implement, every time a user clicks on a download link you generate a new presigned url and send the download to the browser, as long as this process doesn’t take longer than 5 minutes the user will never know.