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
import { createServer } from "./core.mjs";

const API_BASE = "https://official.tokyo.jp/api";
const args = process.argv.slice(2);
const dataFlag = args.indexOf("--data");
const DATA_DIR = dataFlag !== -1 ? args[dataFlag + 1] : null;

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

// ---------- JSON-RPC 2.0 / MCP stdio ループ(ツール定義と応答は core.mjs と共通) ----------
const server = createServer(load);
const send = (obj) => process.stdout.write(JSON.stringify(obj) + "\n");

const rl = readline.createInterface({ input: process.stdin, terminal: false });
rl.on("line", async (line) => {
  line = line.trim();
  if (!line) return;
  let msg;
  try {
    msg = JSON.parse(line);
  } catch {
    return send({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } });
  }
  const res = await server.handle(msg);
  if (res) send(res);
});
