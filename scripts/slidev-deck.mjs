/**
 * Single-deck Slidev development runner.
 *
 * This is used by `pnpm dev <slides.md>` and `pnpm run dev:deck -- <slides.md>`
 * when the caller wants one deck with native Slidev hot reload and no site
 * proxy.
 */
import { spawnSync } from "node:child_process";
import { relative } from "node:path";
import { root, slidevBin } from "./decks.mjs";

const args = process.argv.slice(2);

if (args[0] === "dev") {
  args.shift();
}

if (args[0] === "--") {
  args.shift();
}

const entry = args[0] && !args[0].startsWith("-") ? args.shift() : undefined;

if (!entry) {
  console.error(
    `Usage: node ${relative(root, process.argv[1])} dev <slides.md> [-- <slidev-options>]`,
  );
  process.exit(1);
}

if (args[0] === "--") {
  args.shift();
}

const result = spawnSync(slidevBin, [entry, "--open", ...args], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
