import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const defaultEntry = "decks/template/slides.md";
const modes = new Set(["dev", "serve"]);
const args = process.argv.slice(2);
const slidevBin = join(
  root,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "slidev.cmd" : "slidev",
);

let mode = "dev";

if (modes.has(args[0])) {
  mode = args.shift();
}

if (args[0] === "--") {
  args.shift();
}

const entry = args[0] && !args[0].startsWith("-") ? args.shift() : defaultEntry;

if (args[0] === "--") {
  args.shift();
}

const modeArgs = mode === "serve" ? ["--port", "3030", "--remote"] : ["--open"];

const result = spawnSync(slidevBin, [entry, ...modeArgs, ...args], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
