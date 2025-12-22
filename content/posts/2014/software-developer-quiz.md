+++
title = "Ultimate Software Developer Quiz: Test Your Programming Skills"
date = "2014-12-05T20:00:45Z"
year = "2014"
month= "2014-12"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/2014/12/Quiz-e1354812026198.jpg"
images = ['/images/2014/12/Quiz-e1354812026198.jpg']
tags = ["Quiz", ""]
category="tech"
keywords = ["", ""]
description = "A fun software developer quiz with questions and answers on various programming challenges"
showFullContent = false
readingTime = true
copyright = false
draft = false
aliases = [
    "/software-developer-quiz-3p8d",
    "/posts/software-developer-quiz",
    "/posts/software-developer-quiz-3p8d",
    "/posts/2014/12/05/software-developer-quiz-3p8d",
    "/posts/2014/12/05/software-developer-quiz",
    "/2014/12/05/software-developer-quiz-3p8d",
    "/2014/12/05/software-developer-quiz"
]
+++
Moving house, lack of internet and lack of inspiration has caused a lack of posts recently but hopefully more to come. Been doing some filing and found an old software developer quiz. Thought I would have a go.

Many thanks to <a href="https://twitter.com/zogface">Keith</a> for originally writing the quiz.

**Questions:**

1. Write a function that determines if a string starts with an upper-case letter A-Z
2. Write a function that determines the area of a circle given the radius
3. Add up all the values in an array of integers
4. Given a table called "Nodes" with the following structure and sample data (see below after questions):
…where ID is the primary key,andParentID references ID, complete the following:
    - write a stored procedure to return all nodes beneath a given node ID
    - describe how you might write a query to return all nodes at any depth below a given node ID (i.e. recursively)
5. Write a function to get the prime numbers up to 1,000,000
6. You’ve been given the following code to review (below table)– what comments would you give back to the developer?


|ID|ParentID|Name|Type|Depth|
|---|----|----|----|----|
|1|	NULL|My Documents|Folder|0|
|2|1|My Pictures|Folder|1|
|3|1|My CV|Document|1|
|4|2|Photo of me|Document|2|

```sql
CREATE PROCEDURE GetNode
@NodeId INT
AS

DECLARE @ID INT, @ParentID INT, @Name NVARCHAR(255)
DECLARE @Type NVARCHAR(20), @Depth INT

SELECT @ID = ID FROM Nodes WHERE ID = @ID
SELECT @ParentID = ParentID FROM Nodes where ID = @ID
IF (EXISTS(SELECT NULL FROM Nodes WHERE ID = @ID AND Name = NULL))
SELECT @Name = ''
ELSE
SELECT @Name = Name FROM Nodes WHERE ID = @ID

SELECT @Type = Type FROM Nodes WHERE ID = @ID
SELECT @Depth = Depth FROM Nodes WHERE ID = @ID

SELECT @ID, @ParentID, @Name, @Type, @Depth
```

**My Answers:**

```csharp
static bool GetUpper(string var)
{
  if (char.IsUpper(var[0]))
  {
    return true;
  }
  else
  {
    return false;
  }
}
```

```csharp
static double AreaOfCircle(int radius)
{
  double area = 0;
  area = Math.PI * radius * radius;
  return area;
}
```

```csharp
static int SumArray()
{
  int[] MyArray = new int[10] { 1, 2, 5, 12, 4, 9, 8, 18, 9, 6 };
  int Sum = MyArray.Sum();
  return Sum;
}
```

```sql
create procedure getnodes
(
  @node int
)
select * from dbo.nodes where parentid = @node
```

For a recursive query I would write something along the lines of, but it would need to be customised depending on the depth, eg more joins for higher depths
```sql
select * from dbo.nodes n1
join dbo.nodes n2 on n1.id = n2.ParentId
join dbo.nodes n3 on n2.id = n3.ParentId
where n1.parentid = 4544054
```

```csharp
static void prime()
{
  Console.WriteLine("Prime: 1");
  for (long i = 3; i <= 1000000;i++ )
  {
    bool isprime = true;
    for (long j = 2; j <i; j++)
    {
      if(i%j==0)
      {
        isprime = false;
        break;
      }
    }
    if (isprime)
    {
      Console.WriteLine("Prime: "+i);
    }
  }
}
```

No Brackets around parameters, @NodeId parameter never used, select @id = id from dbo.nodes where id = @id is pointless as same id that is passed it being set, Name = NULL should be Name is NULL, no from specified in last query. There are probably more issues as well.