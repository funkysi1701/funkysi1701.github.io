+++
title = "Upgrading to .Net 7"
date = "2022-10-01T18:00:45Z"
year = "2022"
month= "2022-10"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "/images/coverage.png"
images = ['/images/coverage.png']
tags = ["DotNet", "Blazor", "EFCore"]
categories = ["tech"]
description =  "I have a Blazor application that was built with .Net Core 3, and I have updated it to .Net 5 and later .Net 6 when those versions of were released. In November .Net 7 is released so I have been testing it with the .Net 7 previews."
showFullContent = false
readingTime = true
copyright = false
featured = true
aliases = [
    "/upgrading-to-net-7-1mon",
    "/posts/dotnet7",
    "/posts/2022/10/01/dotnet7",
    "/posts/upgrading-to-net-7-1mon",
    "/posts/2022/10/01/upgrading-to-net-7-1mon",
    "/2022/10/01/upgrading-to-net-7-1mon"    
]
+++
I have a Blazor application that was built with .Net Core 3, and I have updated it to .Net 5 and later .Net 6 when those versions of were released. In November .Net 7 is released so I have been testing it with the .Net 7 previews.

However for this update I encountered a few more issues than I remember from the other updates.

## Automapper

The first issue I encountered was with Automapper. My Unit tests failed with the following error

```
Error Message:
   System.ArgumentException : GenericArguments[0], 'System.Char', on 'T MaxFloat[T](System.Collections.Generic.IEnumerable`1[T])' violates the constraint of type 'T'.
---- System.Security.VerificationException : Method System.Linq.Enumerable.MaxFloat: type argument 'System.Char' violates the constraint of type parameter 'T'.
  Stack Trace:
     at System.RuntimeType.ValidateGenericArguments(MemberInfo definition, RuntimeType[] genericArguments, Exception e)
   at System.Reflection.RuntimeMethodInfo.MakeGenericMethod(Type[] methodInstantiation)
   at AutoMapper.Internal.TypeDetails.<>c__DisplayClass25_1.<GetPublicNoArgExtensionMethods>b__10(MethodInfo extensionMethod)
   at System.Linq.Enumerable.WhereSelectArrayIterator`2.MoveNext()
   at System.Linq.Enumerable.ConcatIterator`1.MoveNext()
   at System.Linq.Enumerable.SelectManyIterator[TSource,TCollection,TResult](IEnumerable`1 source, Func`2 collectionSelector, Func`3 resultSelector)+MoveNext()
   at System.Linq.Enumerable.WhereSelectEnumerableIterator`2.MoveNext()
   at System.Linq.Enumerable.UnionIterator`1.GetNext()
   at System.Linq.Enumerable.UnionIterator`1.MoveNext()
   at System.Linq.Enumerable.ConcatIterator`1.MoveNext()
   at AutoMapper.Internal.TypeDetails.PossibleNames()
   at AutoMapper.Internal.TypeDetails.GetMember(String name)
   at AutoMapper.Configuration.Conventions.DefaultName.GetMatchingMemberInfo(TypeDetails sourceTypeDetails, Type destType, Type destMemberType, String nameToSearch)
   at AutoMapper.Configuration.Conventions.ParentSourceToDestinationNameMapper.GetMatchingMemberInfo(TypeDetails sourceTypeDetails, Type destType, Type destMemberType, String nameToSearch)
   at AutoMapper.Configuration.Conventions.DefaultMember.MapDestinationPropertyToSource(ProfileMap options, TypeDetails sourceTypeDetails, Type destType, Type destMemberType, String nameToSearch, List`1 resolvers, IMemberConfiguration parent, Boolean isReverseMap)
   at AutoMapper.Configuration.Conventions.MemberConfiguration.MapDestinationPropertyToSource(ProfileMap options, TypeDetails sourceType, Type destType, Type destMemberType, String nameToSearch, List`1 resolvers, Boolean isReverseMap)
   at AutoMapper.Configuration.Conventions.NameSplitMember.MapDestinationPropertyToSource(ProfileMap options, TypeDetails sourceType, Type destType, Type destMemberType, String nameToSearch, List`1 resolvers, IMemberConfiguration parent, Boolean isReverseMap)
   at AutoMapper.Configuration.Conventions.MemberConfiguration.MapDestinationPropertyToSource(ProfileMap options, TypeDetails sourceType, Type destType, Type destMemberType, String nameToSearch, List`1 resolvers, Boolean isReverseMap)
   at AutoMapper.ProfileMap.MapDestinationPropertyToSource(TypeDetails sourceTypeDetails, Type destType, Type destMemberType, String destMemberName, List`1 members, Boolean reverseNamingConventions)
   at AutoMapper.TypeMap..ctor(Type sourceType, Type destinationType, ProfileMap profile, Boolean isReverseMap)
   at AutoMapper.ProfileMap.BuildTypeMap(IGlobalConfiguration configurationProvider, ITypeMapConfiguration config)
   at AutoMapper.ProfileMap.Register(IGlobalConfiguration configurationProvider)
   at AutoMapper.MapperConfiguration.Seal()
   at AutoMapper.MapperConfiguration..ctor(MapperConfigurationExpression configurationExpression)
   at AutoMapper.MapperConfiguration..ctor(Action`1 configure)
   at System.RuntimeType.CreateInstanceDefaultCtor(Boolean publicOnly, Boolean wrapExceptions)
----- Inner Stack Trace -----
   at System.RuntimeMethodHandle.GetStubIfNeeded(RuntimeMethodHandleInternal method, RuntimeType declaringType, RuntimeType[] methodInstantiation)
   at System.Reflection.RuntimeMethodInfo.MakeGenericMethod(Type[] methodInstantiation)
```

At first I didn't realise it was an issue with Automapper and I started searching for breaking changes in dotnet 7. Eventually this lead to finding that a change to .Net had created an issue with version 11 of Automapper. The following github issues explains more about what was involved in fixing this.

https://github.com/dotnet/runtime/issues/69119

https://github.com/AutoMapper/AutoMapper/pull/3999

This week [version 12](https://github.com/AutoMapper/AutoMapper/releases/tag/v12.0.0) of Automapper was released and it fixed this issue for me.

## Code Coverage

My build includes the calculation of code coverage of my unit tests. For some reason this step was failing.

```
    - task: DotNetCoreCLI@2
      displayName: 'Running API Tests'
      inputs:
        command: 'test'
        arguments: '--no-restore --no-build --configuration $(buildConfiguration) --runtime win-x64 /p:CollectCoverage=true /p:CoverletOutputFormat=opencover'
        projects: 'Path To csproj file'
        nobuild: true    
```

For .Net 6 this step would run my unit tests and include a section that looked a bit like this.

```
Calculating coverage result...
  Generating report 'D:\a\1\s\WhatEver\coverage.opencover.xml'

+---------------------------+--------+--------+--------+
| Module                    | Line   | Branch | Method |
+---------------------------+--------+--------+--------+
| Something                 | 50.91% | 48.77% | 65.44% |
+---------------------------+--------+--------+--------+
| Something.Core            | 41.79% | 6.92%  | 47.2%  |
+---------------------------+--------+--------+--------+
| Something.Core.Email      | 96.55% | 50%    | 100%   |
+---------------------------+--------+--------+--------+

+---------+--------+--------+--------+
|         | Line   | Branch | Method |
+---------+--------+--------+--------+
| Total   | 49.46% | 44.2%  | 53.55% |
+---------+--------+--------+--------+
| Average | 63.08% | 35.22% | 70.88% |
+---------+--------+--------+--------+

```

However for .Net 7 the unit tests would pass but the coverage bit above would not run, and no visible errors to help me.

Testing dotnet test locally I discovered that if I included the path and filename to the csproj file the coverage would not run, if I removed this it would work as per .Net 6. No idea why this was happening.

I did some testing with the DotNetCoreCLI@2 task, but I couldn't get the coverage to work. However I was testing this locally via the command line so it was a simple thing to swap DotNetCoreCLI@2 for a command line step. After I did that the coverage started working again!

Here is the command line step I added

```
    - task: CmdLine@2
      displayName: 'Running API Tests'
      inputs:
        script: |
          "C:\Program Files\dotnet\dotnet.exe" test --logger trx --results-directory D:\a\_temp --no-restore --no-build --configuration Release --runtime win-x64 /p:CollectCoverage=true /p:CoverletOutputFormat=opencover
        workingDirectory: '$(Build.SourcesDirectory)/PathToWhereEver'  
```

## SQL Server tables with triggers

My build was all working so now time to test the application was working. But an error was being thrown if I tried to save any data to the SQL Server database.

```
Could not save changes because the target table has database triggers. Please configure your entity type accordingly, see https://aka.ms/efcore-docs-sqlserver-save-changes-and-triggers for more information. The target table 'Something' of the DML statement cannot have any enabled triggers if the statement contains an OUTPUT clause without INTO clause. 
```

A nice error, as it gives me a link to the change and what to do to fix.

```csharp
protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
{
    configurationBuilder.Conventions.Add(_ => new BlankTriggerAddingConvention());
}
```

```csharp
public class BlankTriggerAddingConvention : IModelFinalizingConvention
{
    public virtual void ProcessModelFinalizing(
        IConventionModelBuilder modelBuilder,
        IConventionContext<IConventionModelBuilder> context)
    {
        foreach (var entityType in modelBuilder.Metadata.GetEntityTypes())
        {
            var table = StoreObjectIdentifier.Create(entityType, StoreObjectType.Table);
            if (table != null
                && entityType.GetDeclaredTriggers().All(t => t.GetDatabaseName(table.Value) == null))
            {
                entityType.Builder.HasTrigger(table.Value.Name + "_Trigger");
            }

            foreach (var fragment in entityType.GetMappingFragments(StoreObjectType.Table))
            {
                if (entityType.GetDeclaredTriggers().All(t => t.GetDatabaseName(fragment.StoreObject) == null))
                {
                    entityType.Builder.HasTrigger(fragment.StoreObject.Name + "_Trigger");
                }
            }
        }
    }
}
```

Adding the following to my DBContext allowed data to be saved even if triggers existed on my database.

A longer term fix, should be to investigate if the triggers on the database are still needed and remove if not. From reading the docs, it sounds like a performance gain would be had after doing this!

## Conclusion

These are the issues I have encountered so far updating to .Net 7. A few more than for .Net 5 or 6. However so far I have managed to find a solution for all issues. I expect one more release candidate, with the final version of .Net 7 coming out in November.
