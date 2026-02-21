+++
title = "My git repository is too large!"
date = "2016-02-11T20:00:45Z"
year = "2016"
month= "2016-02"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["Git", "Source Control"]
categories = ["tech"]
keywords = ["", ""]
description =  "My git repository is too large!"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/my-git-repository-is-too-large-5c29",
    "/posts/my-git-repository-is-too-large",
    "/posts/my-git-repository-is-too-large-5c29",
    "/posts/2016/02/11/my-git-repository-is-too-large-5c29",
    "/posts/2016/02/11/my-git-repository-is-too-large",
    "/2016/02/11/my-git-repository-is-too-large-5c29",
    "/2016/02/11/my-git-repository-is-too-large"
]
+++
Today I did a clone of one of my git repositories and it took ages to download. Looking into what got downloaded it was easy to see why. The .git folder was over 500Mb in size.

I know how this has happened. This repository was created in 2013 and has been used by me as a dumping ground for lots of things related to the code which never should have been committed.

Since 2013 I have learnt a lot more about coding and git so the current version of the files in git isn’t too bad. But git keeps the history of changes for every file so bad practices like this are kept.

What can I do about this? Well what does google suggest? I found this `https://stevelorek.com/how-to-shrink-a-git-repository.html` (link no longer exists).

It suggests ways of listing all the large files that are stored in git and a way to remove them. As I am the only person that regularly commits to this repository I see no problem with giving it a go.

I will summarise the steps here.

```txt
git clone url
```

Now you need all the remote branches so there is a bash script to run

```bash
#!/bin/bash
for branch in `git branch -a | grep remotes | grep -v HEAD | grep -v master`; do
git branch –track ${branch##*/} $branch
done
```

Another bash script then lists the top 10 large files

```bash
#!/bin/bash
#set -x
# Shows you the largest objects in your repo’s pack file.
# Written for osx.
#
# @see https://stubbisms.wordpress.com/2009/07/10/git-script-to-show-largest-pack-objects-and-trim-your-waist-line/
# @author Antony Stubbs
# set the internal field spereator to line break, so that we can iterate easily over the verify-pack output
IFS=$’\n’;
# list all objects including their size, sort by size, take top 10
objects=`git verify-pack -v .git/objects/pack/pack-*.idx | grep -v chain | sort -k3nr | head`
echo “All sizes are in kB. The pack column is the size of the object, compressed, inside the pack file.”
output=“size,pack,SHA,location”
for y in $objects do
# extract the size in bytes
size=$((`echo $y | cut -f 5 -d ‘ ‘`/1024))
# extract the compressed size in bytes
compressedSize=$((`echo $y | cut -f 6 -d ‘ ‘`/1024))
# extract the SHA
sha=`echo $y | cut -f 1 -d ‘ ‘`
# find the objects location in the repository tree
other=`git rev-list –all –objects | grep $sha`
#lineBreak=`echo -e “\n”`
output=“${output}\n${size},${compressedSize},${other}”
done
echo -e $output
```

After running the script you will see details of your largest files. I had *.msi and *.exe files in the mix. To remove them run the following, where filename is the path to the file that needs removing.

```txt
git filter-branch –tag-name-filter cat –index-filter ‘git rm -r –cached –ignore-unmatch filename’ –prune-empty -f — –all
```

To reclaim the disk space run the following commands

```txt
rm -rf .git/refs/original/
git reflog expire –expire=now –all
git gc –prune=now
git gc –aggressive –prune=now
```

Now push your changes back to the remote server.

```txt
git push origin –force –all
git push origin –force –tags
```

Now if you do a clone it will be much smaller than before and you can get back to coding much quicker, without having to wait.
