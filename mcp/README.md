# @dror-jp/official-tokyo-mcp

A dependency-free [Model Context Protocol](https://modelcontextprotocol.io/) server
that gives AI agents direct, verified answers about official procedures in Tokyo —
instead of searching and scraping.

Data comes from the free API at https://official.tokyo.jp/api/ (CC BY 4.0, cached
for 1 hour). Every response carries the site's disclaimer and `last_verified` dates.
official.tokyo.jp is an independent, non-government guide run by
[DroR Corporation](https://dror.co.jp); if anything differs from an official page,
the official page is correct.

## Setup

Requires Node.js 18+.

```jsonc
// Claude Desktop / Claude Code / any MCP client
{
  "mcpServers": {
    "official-tokyo": {
      "command": "npx",
      "args": ["-y", "@dror-jp/official-tokyo-mcp"]
    }
  }
}
```

## Tools

| Tool | What it returns |
|---|---|
| `list_procedures(category?)` | All procedures with stable IDs and one-line summaries |
| `get_procedure(id)` | Steps, deadline, cost, human-verified official links |
| `get_ward(ward)` | Ward office + foreign residents' desk (address, phone, hours, languages) |
| `search_glossary(query)` | Japanese terms from official documents, explained |
| `get_emergency_contacts()` | 119, #7119, TMC Navi and verified emergency pages |

## Local development

Run against a locally built copy of the site:

```
node server.mjs --data ../public/api
```

## License

MIT (server code). The data it serves is CC BY 4.0 —
attribution: *official.tokyo.jp (DroR Corporation)*.
