import { existsSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

import decks from "../decks.config.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function normalizeBasePath(value) {
  const raw = value?.trim() || "/";
  const withLeadingSlash = raw.startsWith("/") ? raw : `/${raw}`;
  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash
    : `${withLeadingSlash}/`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function validateDecks(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("decks.config.mjs must export at least one deck.");
  }

  const seen = new Set();

  for (const deck of items) {
    if (!deck || typeof deck !== "object") {
      throw new Error("Each deck must be an object.");
    }

    if (!slugPattern.test(deck.slug)) {
      throw new Error(
        `Invalid deck slug "${deck.slug}". Use lowercase letters, numbers, and single hyphens.`,
      );
    }

    if (seen.has(deck.slug)) {
      throw new Error(`Duplicate deck slug "${deck.slug}".`);
    }

    seen.add(deck.slug);

    if (!deck.title || typeof deck.title !== "string") {
      throw new Error(`Deck "${deck.slug}" must define a title.`);
    }

    if (!deck.entry || typeof deck.entry !== "string") {
      throw new Error(`Deck "${deck.slug}" must define an entry file.`);
    }

    const entryPath = resolve(root, deck.entry);
    if (!existsSync(entryPath)) {
      throw new Error(
        `Deck "${deck.slug}" entry does not exist: ${deck.entry}`,
      );
    }
  }
}

function runSlidevBuild(deck, basePath) {
  const outputDir = resolve(dist, deck.slug);
  const deckBase = `${basePath}${deck.slug}/`;
  const command = "pnpm";
  const args = [
    "exec",
    "slidev",
    "build",
    deck.entry,
    "--out",
    outputDir,
    "--base",
    deckBase,
  ];

  console.log(`Building ${deck.entry} -> dist/${deck.slug}/`);

  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    env: process.env,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`Slidev build failed for "${deck.slug}".`);
  }
}

function renderHomePage(items, basePath) {
  const deckCards = items
    .map((deck) => {
      const href = `${basePath}${deck.slug}/`;
      const description =
        deck.description || `Open the ${deck.title} presentation.`;

      return `<a class="deck-card" href="${escapeHtml(href)}">
  <span class="deck-eyebrow">Slidev deck</span>
  <strong>${escapeHtml(deck.title)}</strong>
  <span>${escapeHtml(description)}</span>
</a>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Slidev Decks</title>
    <style>
      :root {
        color-scheme: light dark;
        --bg: #f7f7f2;
        --panel: #ffffff;
        --text: #1f2933;
        --muted: #64707d;
        --line: #d8ded8;
        --accent: #136f63;
        --accent-strong: #0b4f47;
      }

      @media (prefers-color-scheme: dark) {
        :root {
          --bg: #16181d;
          --panel: #20242b;
          --text: #eef2f4;
          --muted: #a9b3bd;
          --line: #353b45;
          --accent: #6dd4bf;
          --accent-strong: #9ce5d5;
        }
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        background: var(--bg);
        color: var(--text);
        font-family:
          Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
          "Segoe UI", sans-serif;
      }

      main {
        width: min(1080px, calc(100% - 40px));
        margin: 0 auto;
        padding: 64px 0;
      }

      header {
        display: grid;
        gap: 16px;
        margin-bottom: 40px;
      }

      h1 {
        max-width: 780px;
        margin: 0;
        font-size: clamp(2.25rem, 7vw, 5.25rem);
        line-height: 0.95;
        letter-spacing: 0;
      }

      .intro {
        max-width: 620px;
        margin: 0;
        color: var(--muted);
        font-size: 1.1rem;
        line-height: 1.65;
      }

      .deck-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 18px;
      }

      .deck-card {
        display: grid;
        min-height: 190px;
        align-content: space-between;
        gap: 20px;
        padding: 24px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--panel);
        color: inherit;
        text-decoration: none;
        transition:
          border-color 160ms ease,
          transform 160ms ease;
      }

      .deck-card:hover,
      .deck-card:focus-visible {
        border-color: var(--accent);
        transform: translateY(-2px);
        outline: none;
      }

      .deck-card strong {
        font-size: 1.35rem;
        line-height: 1.2;
      }

      .deck-card span:last-child {
        color: var(--muted);
        line-height: 1.5;
      }

      .deck-eyebrow {
        color: var(--accent-strong);
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      @media (max-width: 640px) {
        main {
          width: min(100% - 28px, 1080px);
          padding: 40px 0;
        }

        .deck-card {
          min-height: 170px;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <header>
        <h1>Slidev Decks</h1>
        <p class="intro">Choose a presentation from this project.</p>
      </header>
      <section class="deck-grid" aria-label="Presentations">
${deckCards}
      </section>
    </main>
  </body>
</html>
`;
}

async function main() {
  validateDecks(decks);

  const basePath = normalizeBasePath(process.env.BASE_PATH);

  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });

  for (const deck of decks) {
    runSlidevBuild(deck, basePath);
  }

  await writeFile(resolve(dist, "index.html"), renderHomePage(decks, basePath));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
