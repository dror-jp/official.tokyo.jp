# {{ .Title }}{{ with .Params.ja_term }}（{{ . }}）{{ end }}

> Source: {{ .Permalink }} — official.tokyo.jp, an independent, non-government guide.
> {{ i18n "lastVerified" }}: {{ .Params.last_verified }}. If an official page differs from this page, the official page is correct.

{{ .Params.summary }}

{{ with .Params.deadline }}- {{ i18n "deadlineLabel" }}: {{ . }}
{{ end }}{{ with .Params.cost }}- {{ i18n "costLabel" }}: {{ . }}
{{ end }}{{ with .Params.place }}- {{ i18n "placeLabel" }}: {{ . }}
{{ end }}
## {{ i18n "whoNeeds" }}

{{ .Params.who }}

## {{ i18n "steps" }}

{{ range $i, $s := .Params.steps }}{{ add $i 1 }}. **{{ $s.title }}** — {{ $s.text }}
{{ end }}
{{ with .Params.bring }}## {{ i18n "whatToBring" }}

{{ range . }}- {{ .item }}{{ with .cond }}（{{ . }}）{{ end }}
{{ end }}{{ end }}
{{ if eq .Params.where_scope "ward" }}## {{ i18n "whereToGo" }}

{{ .Params.where_intro }}
Ward offices, phones, hours and foreign residents' desks (all 23 wards, machine-readable): {{ "api/wards.json" | absURL }}
{{ with .Params.counter_phrase }}
{{ i18n "showAtCounter" }}: 「{{ .ja }}」
{{ end }}{{ end }}
{{ with .Params.numbers }}## Phone

{{ range . }}- **{{ .number }}** — {{ .label }}{{ with .note }}（{{ . }}）{{ end }}
{{ end }}{{ end }}
{{ with .Params.official_links }}## {{ i18n "officialLinks" }}

{{ range . }}- [{{ .label }}]({{ .url }}) — {{ .publisher }}（{{ i18n "verifiedOn" }} {{ .verified }}）
{{ end }}{{ end }}
{{ with .Params.faq }}## {{ i18n "commonQuestions" }}

{{ range . }}**Q: {{ .q }}**
A: {{ .a }}

{{ end }}{{ end }}
{{ .RawContent }}
