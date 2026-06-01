{{- $defaultRevision := now.Unix -}}
{{- $pages := slice -}}
{{- range hugo.Sites -}}
  {{- range .Pages -}}
    {{- $revision := $defaultRevision -}}
    {{- with .File -}}
      {{- $revision = .UniqueID -}}
    {{- end -}}
    {{- $pages = $pages | append (dict "url" .Permalink "revision" $revision) -}}
  {{- end -}}
{{- end -}}

{{- partial "helpers/read-dir" (dict "Path" "/static" "Scratch" $.Scratch) -}}

{{ if eq (len hugo.Sites) 1 }}
  {{- $pages = $pages | append (dict "url" (printf "/%s" "manifest.json" | absURL) "revision" $defaultRevision) -}}
{{ else }}
  {{- range hugo.Sites -}}
    {{- $pages = $pages | append (dict "url" (printf "/%s/%s" .Language.Lang "manifest.json" | absURL) "revision" $defaultRevision) -}}
  {{- end -}}
{{ end }}

const pages = {{ $pages | jsonify }};
const assets = {{ $.Scratch.Get "hbs-assets" | jsonify }};
const config = {
    version: {{ now.Unix }},
    multilingual: {{ if eq (len hugo.Sites) 1 }}false{{ else }}true{{ end }},
    pages,
    assets
};
const config = {
    version: {{ now.Unix }},
    multilingual: {{ if eq (len hugo.Sites) 1 }}false{{ else }}true{{ end }},
    pages: pages,
    assets: assets
};
