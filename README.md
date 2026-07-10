# official.tokyo.jp

**Independent, non-government navigation to official Tokyo life procedures, for foreign residents.**

This site does one thing: it gives you the 3–5 steps of each procedure in plain English,
then links you to the genuine official source (lg.jp / go.jp domains) — with the date a
human last verified every link.

> This is not a government website. We link to official sources.
> Run by [DroR Corporation](https://dror.co.jp) (株式会社DroR) as a non-commercial,
> public-interest project. No ads, no tracking.

## Open data

- **`data/wards.yaml`** — verified data for all 23 Tokyo wards: official English pages,
  consultation desks for foreign residents (address, hours, languages, phone),
  garbage-sorting guides, ward office details. Every ward carries a `last_verified` date.
- Published at [`/api/wards.json`](https://official.tokyo.jp/api/wards.json) —
  license **CC BY 4.0**, attribution *official.tokyo.jp (DroR Corporation)*.

The schema is deliberately city-agnostic. If you want to build this for another city,
fork it — that is the point.

## Contributing

Found a broken link or outdated hours? [Open an issue](../../issues) or send a PR
against `data/wards.yaml`. Corrections from residents who know their ward are the most
valuable input this project can get.

Two rules for contributions:

1. **Never write a URL from memory.** Every URL must be opened and confirmed before it
   lands in the data, and `last_verified` updated.
2. Unverifiable information stays out. `TODO: verify` is an acceptable value; a
   plausible guess is not.

## Development

Built with [Hugo](https://gohugo.io/) (extended). No CSS framework, one small JS file
(the ward selector). UI strings live in `i18n/`, ward data in `data/`, four page
templates in `layouts/`.

```
hugo server        # local preview
hugo               # build to public/
pwsh scripts/Check-Links.ps1   # verify every published external URL
```

A GitHub Actions workflow re-verifies all external links weekly — link rot is this
project's main operational risk, and the "Last verified" promise depends on it.

## License

- Code (templates, styles, scripts): [MIT](LICENSE)
- Ward data (`data/wards.yaml`, `/api/wards.json`): [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- Site text content: © DroR Corporation
