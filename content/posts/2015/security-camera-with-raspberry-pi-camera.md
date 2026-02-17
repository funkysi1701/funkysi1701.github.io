+++
title = "Security Camera with Raspberry Pi Camera"
date = "2015-04-15T20:00:45Z"
year = "2015"
month= "2015-04"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["PHP", "Camera", "Bash", "Raspberry Pi", "Project"]
categories = ["tech"]
keywords = ["", ""]
description =  "Security Camera with Raspberry Pi Camera"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/posts/security-camera-with-raspberry-pi-camera",
    "/posts/security-camera-with-raspberry-pi-camera-be7",
    "/posts/2015/04/15/security-camera-with-raspberry-pi-camera-be7",
    "/posts/2015/04/15/security-camera-with-raspberry-pi-camera",
    "/2015/04/15/security-camera-with-raspberry-pi-camera-be7",
    "/2015/04/15/security-camera-with-raspberry-pi-camera"
]
+++
So my first Raspberry Pi project is a security camera. If you have read my previous Raspberry Pi posts you will know that I have been playing  about with the camera but I had one or two problems with Pidora so I am using Raspbian for this example.

To take a photo with the camera module you can use the command raspistill, this has lots of options you can view the full list by just running the command with no arguments. I will list a few options I have used.

-o filename : this outputs an image to a file with name filename
-vf : vertical flip
-hf: horizontal flip these are useful if the camera is upside down etc
-q number: quality of jpg image between 0 and 100, the default image size is around 3 Mb, I reduced it to quality = 10 which gave me an image size of 300Kb which is more reasonable
-a text: annotate you image with some text, I found that the text needed to start with a character, numbers only failed for me.

I want to script the creation of images, so I decided to name the files my script created with the time and date.

This is fairly easy with a bash script.

```
DATE=$(date +”%Y-%m-%d_%H%M”)
raspistill -q 10 -vf -hf -a a$DATE -o /var/www/$DATE.jpg
```

The first $DATE is the date I have added to the image itself, because of the problem I encountered with annotating numbers only I have added an extra a to the start of this.

It is now very easy to get CRON to run this script every few minutes, I decided to run it every 2 minutes.

My next script tidies up so you don’t get overrun with images.

```
cd /var/www
ls *.jpg > stills.txt
mencoder -nosound -ovc lavc -lavcopts vcodec=mpeg4:aspect=16/9:vbitrate=8000000 -vf scale=1920:1080 -o timelapse.avi -mf type=jpeg:fps=24 mf://@stills.txt
rm /var/www/*.jpg
```

The third line in this script does something really rather clever it creates a video from all the images you have taken. In order for this to work you will need to install mencoder (sudo apt-get install mencoder)

This is all rather good but wouldn’t it be rather cool if this images were uploaded somewhere. If someone was up to no good and they might want to disable your security camera. My first thought was to use something like DropBox, but unfortunately it is not supported by the processor on a raspberry pi. However I have found [copy.com](https://copy.com/) to be rather good for syncing files.

To install just run wget `http://copy.com/install/linux/Copy.tgz` and extract the file to install the client on your raspberry pi.

```
./CopyConsole -daemon -u=gary@example.com -p=’mypass’ -root=/home/pi/Copy
```

This command syncs the folder you have set in -root with copy.com.

The last thing I did was create a php file running on the webserver that allows you to scroll through the different images. I experimented with using javascript to auto scroll through the images but I found the manual way more useful. All the files I have written I have added to my [github](https://github.com/funkysi/RaspberryPi) page.