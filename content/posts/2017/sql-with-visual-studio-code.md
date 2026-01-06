+++
title = "SQL with Visual Studio Code"
date = "2017-11-06T20:00:45Z"
year = "2017"
month= "2017-11"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["Database", "SQL","Visual Studio"]
categories = ["tech"]
keywords = ["", ""]
description = "SQL with Visual Studio Code"
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/sql-with-visual-studio-code-1k3p",
    "/posts/sql-visual-studio-code",
    "/posts/sql-with-visual-studio-code-1k3p",
    "/posts/2017/11/06/sql-with-visual-studio-code-1k3p",
    "/posts/2017/11/06/sql-visual-studio-code",
    "/2017/11/06/sql-with-visual-studio-code-1k3p",
    "/2017/11/06/sql-visual-studio-code"
]
+++

Writing SQL queries is typically done with SQL Management Studio (SSMS). However this tool is a bit of a beast so let’s look at how you could use Visual Studio Code instead.

Visual Studio Code is a free text editor but it is so much more than just a text editor. VS Code can be downloaded from [https://code.visualstudio.com/Download](https://code.visualstudio.com/Download)

To work with SQL Server download the mssql extension. Press  **CTRL+SHIFT+P** and then Select  **Install Extension**  and type  **mssql**.

Intellisense in Visual Studio Code is brilliant, better than SSMS. Lets look at how to get it all set up.

Create a new file and set the language type to SQL (Press  **CTRL+K,M** )

Open the command palette, **CTRL+SHIFT+P** and type SQL to show the mssql commands. Select the Connect command.

Then select **Create Connection Profile** , this creates a profile to connect with your SQL Server. Follow the prompts to get it all setup.

Look in the bottom right corner of the status bar and you should see you are connected.

Now if you type sql you will see a long list of SQL code snippets that you could use.

![SQL Code snippets](/images/2017/vscode-sql-snippets.png)

Choose a snippet to create, and edit it as required. When you are happy press  **CTRL+SHIFT+E ** to execute.

This is basically all there is to it. However this is an incredibly powerful way of working, the intellisense instantly tells you what database objects you can use in your query and there is a wealth of different snippets you can use.

When returning data you get a similar view to SSMS but you can save as Excel, CSV or JSON.

SSMS is a very graphical way of doing things, you can double click a table and see its columns or indexes. VS Code relies on TSQL commands but you have access to exactly the same information.

For more information about VS Code and the mssql extension check out [https://docs.microsoft.com/en-us/sql/linux/sql-server-linux-develop-use-vscode](https://docs.microsoft.com/en-us/sql/linux/sql-server-linux-develop-use-vscode)
