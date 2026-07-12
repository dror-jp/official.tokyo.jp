---
title: "オープンデータとAPI"
ja_term: "Open data"
summary: "このサイトを動かしている 検証済みのデータを、だれでも 無料で使えます。CC BY 4.0。"
last_verified: "2026-07-13"
---

このサイトの中身は、人間が確認した 構造化データから できています。そのデータを
公開しているので、アプリ・研究・ほかの街・AIアシスタントが、そのまま使えます。

## JSON API

登録も 認証も いりません。

- [/api/procedures.json](/api/procedures.json) — すべての手続き（ステップ・期限・確認済みの公式リンク）
- [/api/wards.json](/api/wards.json) — 23区の区役所と外国人相談窓口
- [/api/glossary.json](/api/glossary.json) — 役所の言葉の説明（5言語）
- [/api/emergency.json](/api/emergency.json) — 119・#7119・多言語相談電話
- [/api/meta.json](/api/meta.json) — データの新しさの確認用
- [OpenAPI](/api/openapi.yaml) · [JSONスキーマ](/api/procedures.schema.json)

すべてのデータに「人間が確認した日付（last_verified）」が ついています。

## Markdown版と llms.txt

どのページも、URLの最後に `index.md` を つけると、AIが読みやすい テキスト版になります
（例: [/ja/moving-in/resident-registration/index.md](/ja/moving-in/resident-registration/index.md)）。
AI向けの目次は [/llms.txt](/llms.txt) と [/llms-full.txt](/llms-full.txt) にあります。

## MCPサーバー

AIエージェントは、Webを検索するかわりに、このデータを直接 使えます:

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

パッケージ: [@dror-jp/official-tokyo-mcp](https://www.npmjs.com/package/@dror-jp/official-tokyo-mcp)

## データが古くならない理由

JSONも Markdown版も HTMLページも、ぜんぶ **同じ原稿から** 自動で作られます。
ページを直すと、データも 同じ瞬間に 直ります。

## ライセンス

データ: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)（出典: official.tokyo.jp (DroR Corporation)）。
コード: [MIT・GitHubで公開](https://github.com/dror-jp/official.tokyo.jp)。
データの形は 東京専用に していません。ほかの街で 同じものを作りたい人を 歓迎します。
