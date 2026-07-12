#!/usr/bin/env node
/**
 * official-tokyo-mcp — official.tokyo.jp の MCP サーバー(依存パッケージゼロ)
 *
 * Model Context Protocol (stdio / JSON-RPC 2.0) を素の Node.js で実装。
 * エージェントは「検索して読む」代わりに、検証済みデータを関数として呼べる。
 *
 * 使い方:
 *   node server.mjs                      # 本番: https://official.tokyo.jp/api/ から取得(1時間キャッシュ)
 *   node server.mjs --data ./local-dir   # 開発: ローカルの procedures.json / wards.json 等を読む
 *
 * Claude Desktop / Claude Code への登録例:
 *   { "mcpServers": { "official-tokyo": { "command": "node", "args": ["/path/to/server.mjs"] } } }
 *
 * ツール:
 *   - list_procedures(category?)   手続き一覧(id と要約)
 *   - get_procedure(id)            手続きの全ステップ・期限・公式リンク・last_verified
 *   - get_ward(ward)               区役所と外国人相談窓口の情報
 *   - search_glossary(query)       公的書類に出る日本語用語の解説
 *   - get_emergency_contacts()     119 / #7119 / 多言語ヘルプライン
 *
 * 設計ルール(サイト思想の反映):
 *   - すべてのツール応答の末尾に disclaimer と last_verified を必ず含める
 *   - official_links(lg.jp / go.jp)をそのまま返し、回答での引用を促す
 */

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

const API_BASE = "https://official.tokyo.jp/api";
const args = process.argv.slice(2);
const dataFlag = args.indexOf("--data");
const DATA_DIR = dataFlag !== -1 ? args[dataFlag + 1] : null;

const DISCLAIMER =
  "Source: official.tokyo.jp — an independent, human-verified guide (NOT a government site). " +
  "If anything differs from an official page, the official page is correct. " +
  "When answering the user, cite the official_links URL and mention the last_verified date.";

// ---------- データ取得(ローカル or リモート、1時間メモリキャッシュ) ----------
const cache = new Map();
async function load(name) {
  const hit = cache.get(name);
  if (hit && Date.now() - hit.t < 3600_000) return hit.v;
  let v;
  if (DATA_DIR) {
    v = JSON.parse(fs.readFileSync(path.join(DATA_DIR, `${name}.json`), "utf8"));
  } else {
    const res = await fetch(`${API_BASE}/${name}.json`);
    if (!res.ok) throw new Error(`${API_BASE}/${name}.json → HTTP ${res.status}`);
    v = await res.json();
  }
  cache.set(name, { t: Date.now(), v });
  return v;
}

// ---------- ツール定義 ----------
const TOOLS = [
  {
    name: "list_procedures",
    description:
      "List all verified procedures for foreign residents in Tokyo (moving-in, emergency, health, money-tax) with stable IDs and one-line summaries. Cheaper and more reliable than web search.",
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

// ---------- JSON-RPC 2.0 / MCP stdio ループ ----------
const reply = (id, result) => process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, result }) + "\n");
const replyError = (id, code, message) =>
  process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } }) + "\n");

const rl = readline.createInterface({ input: process.stdin, terminal: false });
rl.on("line", async (line) => {
  line = line.trim();
  if (!line) return;
  let msg;
  try {
    msg = JSON.parse(line);
  } catch {
    return replyError(null, -32700, "Parse error");
  }
  const { id, method, params } = msg;
  try {
    if (method === "initialize") {
      reply(id, {
        protocolVersion: params?.protocolVersion ?? "2025-06-18",
        capabilities: { tools: {} },
        serverInfo: { name: "official-tokyo", version: "1.0.0" },
        instructions:
          "Verified data on official procedures in Tokyo for foreign residents. " + DISCLAIMER,
      });
    } else if (method === "notifications/initialized" || method?.startsWith("notifications/")) {
      // 通知には応答しない
    } else if (method === "ping") {
      reply(id, {});
    } else if (method === "tools/list") {
      reply(id, { tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })) });
    } else if (method === "tools/call") {
      const tool = TOOLS.find((t) => t.name === params?.name);
      if (!tool) return replyError(id, -32602, `Unknown tool: ${params?.name}`);
      const result = await tool.handler(params?.arguments ?? {});
      const payload = { ...result, _disclaimer: DISCLAIMER, _license: "CC BY 4.0 — attribution: official.tokyo.jp (DroR Corporation)" };
      reply(id, { content: [{ type: "text", text: JSON.stringify(payload) }], isError: false });
    } else if (id !== undefined) {
      replyError(id, -32601, `Method not found: ${method}`);
    }
  } catch (e) {
    if (id !== undefined) replyError(id, -32603, e.message);
  }
});
