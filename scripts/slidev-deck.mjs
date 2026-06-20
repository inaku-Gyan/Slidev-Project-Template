import { spawnSync } from "node:child_process";
import { relative } from "node:path";
import { root, slidevBin } from "./decks.mjs";

const modes = new Set(["dev", "serve"]);
const args = process.argv.slice(2);

let mode = "dev";

if (modes.has(args[0])) {
  mode = args.shift();
}

if (args[0] === "--") {
  args.shift();
}

const entry = args[0] && !args[0].startsWith("-") ? args.shift() : undefined;

if (!entry) {
  console.error(
    `Usage: node ${relative(root, process.argv[1])} ${mode} <slides.md> [-- <slidev-options>]`,
  );
  process.exit(1);
}

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
