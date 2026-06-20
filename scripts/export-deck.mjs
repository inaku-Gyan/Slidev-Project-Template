/**
 * Single-deck Slidev export runner.
 *
 * This is used by `pnpm export <deck-slug>` to resolve a deck directory slug to
 * its `slides.md` entry before forwarding arguments to `slidev export`.
 */
import { spawnSync } from "node:child_process";
import { relative } from "node:path";
import { resolveDeckSlug, root, slidevBin } from "./decks.mjs";

const args = process.argv.slice(2);

if (args[0] === "--") {
  args.shift();
}

const slug = args[0] && !args[0].startsWith("-") ? args.shift() : undefined;

if (!slug) {
  console.error("Usage: pnpm export <deck-slug> [-- <slidev-export-options>]");
  process.exit(1);
}

if (args[0] === "--") {
  args.shift();
}

let deck;

try {
  deck = await resolveDeckSlug(slug, "export");
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

const result = spawnSync(
  slidevBin,
  ["export", relative(root, deck.entry), ...args],
  {
    cwd: root,
    stdio: "inherit",
    env: process.env,
  },
);

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
