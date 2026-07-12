{{ $w := index hugo.Data.wards .Params.ward }}# {{ $w.name_en }}（{{ $w.name_local }}）

> Source: {{ .Permalink }} — official.tokyo.jp, an independent, non-government guide.
> {{ i18n "lastVerified" }}: {{ $w.last_verified }}. If an official page differs from this page, the official page is correct.

## {{ i18n "officialSite" }}

{{ $w.official_en_url }}
{{ with $w.official_en_note }}{{ . }}
{{ end }}
{{ with $w.foreign_desk }}## {{ i18n "foreignDesk" }}

- {{ .name_en }}（{{ .name_local }}）
- {{ i18n "addressLabel" }}: {{ .address }}
{{ with .phone }}- {{ i18n "phoneLabel" }}: {{ . }}
{{ end }}{{ with .hours }}- {{ i18n "hoursLabel" }}: {{ . }}
{{ end }}{{ with .languages }}- {{ i18n "languagesLabel" }}: {{ delimit . ", " }}
{{ end }}{{ with .languages_note }}- {{ . }}
{{ end }}{{ with .url }}- {{ . }}
{{ end }}{{ end }}
{{ with $w.garbage_guide_url }}## {{ i18n "garbageGuide" }}

- [{{ $w.garbage_guide_label | default . }}]({{ . }})
{{ end }}
## {{ i18n "wardOffice" }}

- {{ i18n "addressLabel" }}: {{ $w.office_address }}
{{ with $w.office_phone }}- {{ i18n "phoneLabel" }}: {{ . }}
{{ end }}{{ with $w.office_hours }}- {{ i18n "hoursLabel" }}: {{ . }}
{{ end }}
{{ with $w.moving_in_page_url }}## {{ i18n "movingInPage" }}

- {{ . }}
{{ with $w.moving_in_note }}- {{ . }}
{{ end }}{{ end }}
{{ .RawContent }}
