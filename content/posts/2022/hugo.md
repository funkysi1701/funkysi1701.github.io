+++
title = "Hugo"
date = "2022-03-12T20:00:45Z"
year = "2022"
month= "2022-03"
author = "funkysi1701"
authorTwitter = "funkysi1701" #do not include @
cover = "https://scontent-lcy1-1.xx.fbcdn.net/v/t39.30808-6/275724473_4782390731879090_4047475489506580373_n.jpg?_nc_cat=100&ccb=1-5&_nc_sid=e3f864&_nc_ohc=rD9ROare7CkAX8pDsGb&_nc_ht=scontent-lcy1-1.xx&oh=00_AT9_35WnPvOw4GReYk-SvFiScmBDncC1gfEkTHADcA6fcw&oe=62325F29"
images=['https://scontent-lcy1-1.xx.fbcdn.net/v/t39.30808-6/275724473_4782390731879090_4047475489506580373_n.jpg?_nc_cat=100&ccb=1-5&_nc_sid=e3f864&_nc_ohc=rD9ROare7CkAX8pDsGb&_nc_ht=scontent-lcy1-1.xx&oh=00_AT9_35WnPvOw4GReYk-SvFiScmBDncC1gfEkTHADcA6fcw&oe=62325F29']
tags = ["website", ""]
category="tech"
keywords = ["", ""]
description = "Hugo"
summary = "Hugo"
showFullContent = false
readingTime = true
copyright = false
draft = true
aliases = [
    "/posts/hugo",
    "/posts/why-do-i-have-a-website-1m5l",
    "/posts/2022/03/12/why-do-i-have-a-website-1m5l",
    "/posts/2022/03/12/hugo",
    "/2022/03/12/why-do-i-have-a-website-1m5l",
    "/2022/03/12/hugo"
]
+++

I have been adding a few nice features to my website and learning a bit about Hugo along the way.

First up is the Tag Cloud.

![](https://scontent-lcy1-1.xx.fbcdn.net/v/t39.30808-6/275724473_4782390731879090_4047475489506580373_n.jpg?_nc_cat=100&ccb=1-5&_nc_sid=e3f864&_nc_ohc=rD9ROare7CkAX8pDsGb&_nc_ht=scontent-lcy1-1.xx&oh=00_AT9_35WnPvOw4GReYk-SvFiScmBDncC1gfEkTHADcA6fcw&oe=62325F29)

Lets look at the code.

```
{{- $order := default (slice "series" "categories" "tags") $.Site.Params.sidebarTaxonomies -}}
{{- range $expected := $order -}}
{{- range $key, $value := $.Site.Taxonomies -}}
  {{- if eq $key $expected -}}
  {{- $countPosts := default false $.Site.Params.countTaxonomyPosts -}}
  {{- $countParams := dict "categories" "categoryCount" "tags" "tagCount" "series" "seriesCount" -}}
  {{- $param := default "" (index $countParams $key) -}}
  {{- $taxonomyCount := default 20 ($.Site.Param $param) -}}
  {{- if $taxonomyCount -}}
    {{- with $value.ByCount -}}
    <section class="{{ $key }}-taxonomies row card component">
      <div class="card-header">
        <h2 class="card-title">
          <a href="{{ absLangURL (urlize $key) }}">{{ T $key }}</a>
        </h2>
      </div>
      <div class="card-body">
        <div class="py-2">
          <div class="container tagcloud">
            {{ if ne (len $.Site.Taxonomies.tags) 0 }}
              {{ $largestFontSize := 2.0 }}
              {{ $smallestFontSize := 0.7 }}
              {{ $fontSpread := sub $largestFontSize $smallestFontSize }}
              {{ $max := add (len (index $.Site.Taxonomies.tags.ByCount 0).Pages) 1 }}
              {{ $min := len (index $.Site.Taxonomies.tags.ByCount.Reverse 0).Pages }}
              {{ $spread := sub $max $min }}
              {{ $fontStep := div $fontSpread $spread }}
                {{ range $name, $taxonomy := $.Site.Taxonomies.tags }}
                  {{ $tagCount := len $taxonomy.Pages }}
                  {{ $currentFontSize := (add $smallestFontSize (mul (sub $tagCount $min) $fontStep) ) }}
                  {{ $weigth := div (sub (math.Log $tagCount) (math.Log $min)) (sub (math.Log $max) (math.Log $min)) }}
                  {{ $currentFontSize := (add $smallestFontSize (mul (sub $largestFontSize $smallestFontSize) $weigth)) }}
                    <a href="{{ "/tags/" }}{{ $name }}" 
                    class="tagcloud-item" style="font-size: {{ $currentFontSize }}rem;">
                      {{- $taxonomy.Page.Title -}}
                    </a>
                {{ end }}
            {{ end }}
        </div>
        </div>
      </div>
    </section>
    {{- end -}}
  {{- end -}}
  {{- end -}}
{{- end -}}
{{- end -}}
```