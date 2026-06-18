import { spawnSync } from "node:child_process";

const defaultEntry = "decks/template/slides.md";
const modes = new Set(["dev", "serve"]);
const args = process.argv.slice(2);

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

const result = spawnSync(
  "pnpm",
  ["exec", "slidev", entry, ...modeArgs, ...args],
  {
    stdio: "inherit",
    env: process.env,
  },
);

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
