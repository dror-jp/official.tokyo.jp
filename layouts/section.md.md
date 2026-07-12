# {{ .Title }}{{ with .Params.ja_term }}（{{ . }}）{{ end }}

> Source: {{ .Permalink }} — official.tokyo.jp, an independent, non-government guide.
> If an official page differs from this page, the official page is correct.

{{ with .Params.summary }}{{ . }}
{{ end }}
{{ with .Params.numbers }}## Phone

{{ range . }}- **{{ .number }}** — {{ .label }}{{ with .note }}（{{ . }}）{{ end }}
{{ end }}{{ end }}
{{ .RawContent }}

## Pages

{{ range .Pages }}- [{{ .Title }}]({{ .Permalink }}index.md){{ with .Params.summary }} — {{ . }}{{ end }}
{{ end }}
