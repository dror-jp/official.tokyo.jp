---
title: "开放数据与API"
ja_term: "Open data"
summary: "驱动本网站的人工核实数据，任何人都可以免费使用。无需密钥。CC BY 4.0。"
last_verified: "2026-07-13"
translated: "2026-07-13"
---

本网站的内容全部来自人工核实的结构化数据。我们将这些数据公开，供应用程序、研究者、
其他城市——以及AI助手——直接使用，无需抓取网页。

## JSON API

无需认证，无速率限制，支持CORS。

- [/api/procedures.json](/api/procedures.json) — 所有手续（步骤、期限、人工核实的官方链接）
- [/api/wards.json](/api/wards.json) — 23区的区役所与外国人咨询窗口
- [/api/glossary.json](/api/glossary.json) — 官方文件用语解释（5种语言）
- [/api/emergency.json](/api/emergency.json) — 119、#7119、多语言咨询电话
- [/api/meta.json](/api/meta.json) — 数据新鲜度检查
- [OpenAPI](/api/openapi.yaml) · [JSON Schema](/api/procedures.schema.json)

每条数据都带有「人工核实日期（last_verified）」。

## Markdown版与 llms.txt

任何页面的URL末尾加上 `index.md`，即可获得便于AI阅读的纯文本版
（例: [/zh/moving-in/resident-registration/index.md](/zh/moving-in/resident-registration/index.md)）。
AI用索引位于 [/llms.txt](/llms.txt) 和 [/llms-full.txt](/llms-full.txt)。

## MCP服务器

AI代理可以直接调用这些数据，而不必搜索网页:

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

软件包: [@dror-jp/official-tokyo-mcp](https://www.npmjs.com/package/@dror-jp/official-tokyo-mcp)

## 数据为何不会过时

JSON、Markdown版和HTML页面全部在构建时**由同一份原稿**自动生成。
页面被修正的那一刻，数据也同时被修正。

## 许可

数据: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)（署名: official.tokyo.jp (DroR Corporation)）。
代码: [MIT，GitHub开源](https://github.com/dror-jp/official.tokyo.jp)。
数据结构特意没有做成东京专用——欢迎其他城市复制（fork）这套机制。
