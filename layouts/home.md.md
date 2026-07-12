# official.tokyo.jp — {{ i18n "whatDoYouNeed" }}

> {{ i18n "footNotGov" }}
> Every official link on this site was opened and checked by a human; the date is shown on every page. If an official page differs, the official page is correct.

{{ i18n "heroTagline" }}

## Sections

{{ range .Params.scenes }}{{ if .url }}- [{{ .title }}]({{ .url | absLangURL }}index.md) — {{ .desc }}
{{ end }}{{ end }}
## For AI agents (free, no key, CC BY 4.0)

- {{ "api/procedures.json" | absURL }} — all procedures: steps, deadlines, verified official links
- {{ "api/wards.json" | absURL }} — all 23 wards: offices, foreign residents' desks, languages
- {{ "api/glossary.json" | absURL }} — Japanese terms on official documents, explained
- {{ "api/emergency.json" | absURL }} — 119, #7119, multilingual helplines
- {{ "llms.txt" | absURL }} / {{ "llms-full.txt" | absURL }}

## Languages

- English: {{ site.BaseURL }}
- やさしい日本語: {{ "/ja/" | absURL }}
- 简体中文: {{ "/zh/" | absURL }}
- Tiếng Việt: {{ "/vi/" | absURL }}
- नेपाली: {{ "/ne/" | absURL }}

{{ .RawContent }}
