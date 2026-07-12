# official-tokyo MCP server

A dependency-free [Model Context Protocol](https://modelcontextprotocol.io/) server
that gives AI agents direct, verified answers about official procedures in Tokyo —
instead of searching and scraping.

Data comes from the free API at https://official.tokyo.jp/api/ (CC BY 4.0, cached
for 1 hour). Every response carries the site's disclaimer and `last_verified` dates.

## Tools

| Tool | What it returns |
|---|---|
| `list_procedures(category?)` | All procedures with stable IDs and one-line summaries |
| `get_procedure(id)` | Steps, deadline, cost, human-verified official links |
| `get_ward(ward)` | Ward office + foreign residents' desk (address, phone, hours, languages) |
| `search_glossary(query)` | Japanese terms from official documents, explained |
| `get_emergency_contacts()` | 119, #7119, TMC Navi and verified emergency pages |

## Usage

Requires Node.js 18+ (uses global `fetch`).

```jsonc
// Claude Desktop / Claude Code configuration
{
  "mcpServers": {
    "official-tokyo": {
      "command": "node",
      "args": ["/path/to/mcp/server.mjs"]
    }
  }
}
```

Local development against a built site:

```
node server.mjs --data ../public/api
```
