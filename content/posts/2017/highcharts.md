+++
title = "HighCharts"
date = "2017-05-08T20:00:45Z"
year = "2017"
month= "2017-05"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = ""
tags = ["HighCharts", "Graphs",  "Javascript", "SQL"]
categories = ["tech"]
keywords = ["", ""]
description =  "High Charts is a javascript library that allows graphs and charts to easily be added to web pages."
showFullContent = false
readingTime = true
copyright = false
aliases = [
    "/highcharts-27cb",
    "/posts/highcharts",
    "/posts/highcharts-27cb",
    "/posts/2017/05/08/highcharts-27cb",
    "/posts/2017/05/08/highcharts",
    "/2017/05/08/highcharts-27cb",
    "/2017/05/08/highcharts"
]
+++
High Charts is a javascript library that allows graphs and charts to easily be added to web pages.

![](/images/2017/chart.jpeg)

A chart like this can easily be added with a few lines of html and javascript.

```html
<script src="https://code.highcharts.com/highcharts.js">
<script src="https://code.highcharts.com/modules/exporting.js">
<div id="container"></div>
```

This adds the highcharts library and a container for the chart to be displayed in.
```javascript
Highcharts.chart('container', {

  title: {
    text: 'Solar Employment Growth by Sector, 2010-2016'
  },
  subtitle: {
    text: 'Source: thesolarfoundation.com'
  },
  yAxis: {
    title: {
      text: 'Number of Employees'
    }
  },
  legend: {
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'middle'
  },
  plotOptions: {
    series: {
      pointStart: 2010
    }
  },
  series: [{
    name: 'Installation',
    data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
  }, {
    name: 'Manufacturing',
    data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
  }, {
    name: 'Sales & Distribution',
    data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
  }, {
    name: 'Project Development',
    data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
  }, {
    name: 'Other',
    data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
  }]

});
```
This adds the data and sets up various options for the charts. More details about the different charts and options you can set can be found at https://www.highcharts.com

I am quite a fan of the different gauges that you can put on your site, as you can add a bit of animation and make the needles bounce around. https://www.highcharts.com/demo/gauge-solid

![](/images/2017/chart-1.jpeg)

As most of the data I deal with lives in a SQL Server database, I have been spending quite a bit of time writing Stored Procedures and functions to mould the data so I can easily pass data from the database to javascript.

Highcharts are very flexible with lots of different options that allow you to display charts of almost any data you have, these charts are also exportable as PNG, JPEG, CSVs etc