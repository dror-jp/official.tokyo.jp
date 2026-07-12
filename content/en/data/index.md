---
title: "Open data & API"
ja_term: "オープンデータ"
summary: "The same verified data that powers this site — free, machine-readable, no key required. CC BY 4.0."
last_verified: "2026-07-13"
---

Everything on this site is built from structured, human-verified data. We publish
that data openly, so that apps, researchers, other cities — and AI assistants —
can use it directly instead of scraping pages.

## JSON API

No authentication, no rate limits, CORS enabled. Please cache responses.

- [/api/procedures.json](/api/procedures.json) — every procedure as structured steps,
  with deadlines and human-verified official links
- [/api/wards.json](/api/wards.json) — all 23 wards: offices and foreign residents'
  desks (address, phone, hours, languages)
- [/api/glossary.json](/api/glossary.json) — Japanese terms from official documents,
  explained in 5 languages
- [/api/emergency.json](/api/emergency.json) — 119, #7119 and multilingual helplines
- [/api/meta.json](/api/meta.json) — freshness check (generated date, oldest verification)
- [OpenAPI spec](/api/openapi.yaml) · [JSON Schema](/api/procedures.schema.json)

Every record carries a `last_verified` date — the date a human opened and checked it.

## Markdown mirrors & llms.txt

Every page on this site has a plain-Markdown twin: add `index.md` to any page URL
(for example [/moving-in/resident-registration/index.md](/moving-in/resident-registration/index.md)).
Site indexes for AI live at [/llms.txt](/llms.txt) and [/llms-full.txt](/llms-full.txt).

## MCP server

AI agents can call this data as tools instead of searching the web:

```
{
  "mcpServers": {
    "official-tokyo": {
      "command": "npx",
      "args": ["-y", "@dror-jp/official-tokyo-mcp"]
    }
  }
}
```

Package: [@dror-jp/official-tokyo-mcp](https://www.npmjs.com/package/@dror-jp/official-tokyo-mcp) —
dependency-free, five tools (procedures, wards, glossary, emergency contacts).

## Why it never goes stale

The JSON, the Markdown mirrors and the HTML pages are all generated **from the same
source files** at build time. There is no separate database to fall out of sync —
if a page is corrected, the API is corrected in the same moment.

## License

Data: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — attribution
*official.tokyo.jp (DroR Corporation)*. Code:
[MIT, open source on GitHub](https://github.com/dror-jp/official.tokyo.jp).
The data structure is deliberately not Tokyo-specific — if you want to build this
for another city, fork it. That is the point.
