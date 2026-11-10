/**
 * official-tokyo-mcp core — shared by the stdio server (server.mjs) and the
 * remote Streamable HTTP server (../remote-mcp/). No Node-only imports here.
 *
 * createServer(load) returns { handle(msg) } where load(name) resolves to the
 * parsed /api/<name>.json and handle() turns one JSON-RPC message into a
 * response object (or null for notifications).
 */

export const VERSION = "1.0.4";
export const SUPPORTED_PROTOCOL_VERSIONS = ["2025-11-25", "2025-06-18", "2025-03-26", "2024-11-05"];

export const DISCLAIMER =
  "Source: official.tokyo.jp — an independent, human-verified guide (NOT a government site). " +
  "If anything differs from an official page, the official page is correct. " +
  "When answering the user, cite the official_links URL and mention the last_verified date.";


// Human-readable tool titles. Every tool only reads public data, so all carry the same
// read-only annotations (MCP tool annotations; required by some directories, and they let
// clients run the tools without a per-call confirmation).
export const TOOL_TITLES = {
  "list_procedures": "List procedures",
  "get_procedure": "Get a procedure",
  "get_ward": "Get ward office info",
  "search_glossary": "Search glossary",
  "get_emergency_contacts": "Get emergency contacts"
};
const READ_ONLY = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };

export function createServer(load) {
  const TOOLS = [
    {
      name: "list_procedures",
      description:
        "List all verified procedures for foreign residents in Tokyo (moving-in, emergency, health, money-tax) with stable IDs and one-line summaries.",
      inputSchema: {
        type: "object",
        properties: {
          category: { type: "string", enum: ["moving-in", "emergency", "health", "money-tax"], description: "Optional filter." },
        },
      },
      handler: async ({ category }) => {
        const d = await load("procedures");
        const items = d.procedures
          .filter((p) => !category || p.category === category)
          .map((p) => ({ id: p.id, category: p.category, title: p.title_en, summary: p.summary, status: p.status }));
        return { count: items.length, procedures: items };
      },
    },
    {
      name: "get_procedure",
      description:
        "Get one procedure by ID: steps in order, deadline, where to go, human-verified official government links (lg.jp/go.jp) and the last_verified date. Use list_procedures first to find the ID.",
      inputSchema: {
        type: "object",
        required: ["id"],
        properties: { id: { type: "string", description: "Stable slug, e.g. 'resident-registration'." } },
      },
      handler: async ({ id }) => {
        const d = await load("procedures");
        const p = d.procedures.find((x) => x.id === id);
        if (!p) {
          const ids = d.procedures.map((x) => x.id);
          return { error: `Unknown id '${id}'.`, available_ids: ids };
        }
        return p;
      },
    },
    {
      name: "get_ward",
      description:
        "Get ward office and foreign residents' consultation desk info (address, phone, hours, supported languages, garbage guide) for one of Tokyo's 23 wards.",
      inputSchema: {
        type: "object",
        required: ["ward"],
        properties: { ward: { type: "string", description: "Ward name in English, e.g. 'Shinjuku', 'Adachi'." } },
      },
      handler: async ({ ward }) => {
        const d = await load("wards");
        const key = Object.keys(d.wards).find((k) => k.toLowerCase() === ward.toLowerCase().trim());
        if (!key) return { error: `Unknown ward '${ward}'.`, available: Object.keys(d.wards) };
        return { ward: key, ...d.wards[key] };
      },
    },
    {
      name: "search_glossary",
      description:
        "Look up Japanese terms that appear on official documents (住民票, 転入届, 在留カード, マイナンバー...). Matches Japanese, romaji reading, or English.",
      inputSchema: {
        type: "object",
        required: ["query"],
        properties: { query: { type: "string" } },
      },
      handler: async ({ query }) => {
        const d = await load("glossary");
        // fold: lowercase + strip diacritics so "juminhyo" matches "jūminhyō"
        const fold = (s) => (s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
        const q = fold(query);
        const hits = d.terms.filter(
          (t) =>
            t.term_local.includes(query.trim()) ||
            fold(t.reading).includes(q) ||
            fold(t.term_en).includes(q) ||
            fold(t.explanation).includes(q)
        );
        return hits.length ? { matches: hits } : { matches: [], hint: "No match. Try the Japanese term or its English name." };
      },
    },
    {
      name: "get_emergency_contacts",
      description:
        "Emergency numbers for Tokyo: 119 (ambulance/fire, multilingual), #7119 (should-I-call-an-ambulance consultation), TMC Navi 0120-142-142 (any life problem, ~15 languages).",
      inputSchema: { type: "object", properties: {} },
      handler: async () => {
        const d = await load("procedures");
        const em = d.procedures.filter((p) => p.category === "emergency");
        return {
          contacts: em.flatMap((p) => (p.phone ?? []).map((ph) => ({ ...ph, guide_url: p.guide_url }))),
          pages: em.map((p) => ({ title: p.title_en, url: p.guide_url, last_verified: p.last_verified })),
        };
      },
    },
  ];

  const ok = (id, result) => ({ jsonrpc: "2.0", id, result });
  const err = (id, code, message) => ({ jsonrpc: "2.0", id, error: { code, message } });

  async function handle(msg) {
    if (!msg || typeof msg !== "object" || msg.jsonrpc !== "2.0") return err(null, -32600, "Invalid Request");
    const { id, method, params } = msg;
    const isNotification = id === undefined;
    // Responses from the client (to server requests we never send) are ignored.
    if (method === undefined && ("result" in msg || "error" in msg)) return null;
    // A message without an id is a notification: never answered.
    if (isNotification) return null;
    try {
      if (method === "initialize") {
        const requested = params?.protocolVersion;
        return ok(id, {
          protocolVersion: SUPPORTED_PROTOCOL_VERSIONS.includes(requested) ? requested : SUPPORTED_PROTOCOL_VERSIONS[0],
          capabilities: { tools: {} },
          serverInfo: { name: "official-tokyo", title: "official.tokyo.jp", version: VERSION },
          instructions: "Verified data on official procedures in Tokyo for foreign residents. " + DISCLAIMER,
        });
      }
      if (method === "ping") return ok(id, {});
      if (method === "tools/list") {
        return ok(id, {
          tools: TOOLS.map(({ name, description, inputSchema }) => ({
            name,
            title: TOOL_TITLES[name],
            description,
            inputSchema,
            annotations: { title: TOOL_TITLES[name], ...READ_ONLY },
          })),
        });
      }
      if (method === "tools/call") {
        const tool = TOOLS.find((t) => t.name === params?.name);
        if (!tool) return err(id, -32602, `Unknown tool: ${params?.name}`);
        let result;
        try {
          result = await tool.handler(params?.arguments ?? {});
        } catch (e) {
          // Tool execution errors (bad arguments, data fetch failures) go back as a tool result
          // with isError so the model can see and correct them.
          const text = `Error in ${tool.name}: ${e.message}. Check the arguments against the inputSchema (tools/list).`;
          return ok(id, { content: [{ type: "text", text }], isError: true });
        }
        const payload = { ...result, _disclaimer: DISCLAIMER, _license: "CC BY 4.0 — attribution: official.tokyo.jp (DroR Corporation)" };
        return ok(id, { content: [{ type: "text", text: JSON.stringify(payload) }], isError: false });
      }
      return err(id, -32601, `Method not found: ${method}`);
    } catch (e) {
      return err(id, -32603, e.message);
    }
  }

  return { handle, tools: TOOLS };
}
