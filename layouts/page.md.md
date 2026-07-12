# {{ .Title }}{{ with .Params.ja_term }}（{{ . }}）{{ end }}

> Source: {{ .Permalink }} — official.tokyo.jp, an independent, non-government guide.
> {{ with .Params.last_verified }}{{ i18n "lastVerified" }}: {{ . }}. {{ end }}If an official page differs from this page, the official page is correct.

{{ with .Params.summary }}{{ . }}
{{ end }}
{{ with .Params.numbers }}## Phone

{{ range . }}- **{{ .number }}** — {{ .label }}{{ with .note }}（{{ . }}）{{ end }}
{{ end }}{{ end }}
{{ .RawContent }}
{{ if .Params.show_glossary }}
{{ $lang := site.Language.Lang }}{{ range hugo.Data.glossary.terms }}## {{ .ja_word }}（{{ .romaji }}）

{{ index . $lang | default .en }}

{{ end }}{{ end }}
{{ with .Params.official_links }}## {{ i18n "officialLinks" }}

{{ range . }}- [{{ .label }}]({{ .url }}) — {{ .publisher }}（{{ i18n "verifiedOn" }} {{ .verified }}）
{{ end }}{{ end }}
