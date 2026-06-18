import { existsSync } from "node:fs";
import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const decksDir = resolve(root, "decks");
const siteDir = resolve(root, "site");
const distDir = resolve(root, "dist");

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

async function readJson(filePath) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `${relative(root, filePath)} is not valid JSON: ${message}`,
    );
  }
}

function validateDeck(deck) {
  if (!slugPattern.test(deck.slug)) {
    throw new Error(
      `Invalid deck directory "${deck.slug}". Use lowercase letters, numbers, and single hyphens.`,
    );
  }

  if (!deck.title || typeof deck.title !== "string") {
    throw new Error(`${deck.slug}/deck.json must define a string title.`);
  }

  if (!deck.description || typeof deck.description !== "string") {
    throw new Error(`${deck.slug}/deck.json must define a string description.`);
  }

  if (
    deck.order !== undefined &&
    (!Number.isInteger(deck.order) || deck.order < 1)
  ) {
    throw new Error(`${deck.slug}/deck.json order must be a positive integer.`);
  }

  if (!existsSync(deck.entry)) {
    throw new Error(`${deck.slug} is missing slides.md.`);
  }
}

async function discoverDecks() {
  const entries = await readdir(decksDir, { withFileTypes: true });
  const decks = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const slug = entry.name;
    const deckDir = join(decksDir, slug);
    const metadataPath = join(deckDir, "deck.json");

    if (!existsSync(metadataPath)) {
      throw new Error(`${relative(root, deckDir)} is missing deck.json.`);
    }

    const metadata = await readJson(metadataPath);
    const deck = {
      slug,
      title: metadata.title,
      description: metadata.description,
      order: metadata.order,
      entry: join(deckDir, "slides.md"),
    };

    validateDeck(deck);
    decks.push(deck);
  }

  if (decks.length === 0) {
    throw new Error("No decks found. Add decks/<slug>/deck.json.");
  }

  return decks.sort((left, right) => {
    const order = (left.order ?? 9999) - (right.order ?? 9999);
    return order || left.slug.localeCompare(right.slug);
  });
}

function renderDeckCards(decks, basePath) {
  return decks
    .map((deck) => {
      const href = `${basePath}${deck.slug}/`;

      return `<a class="deck-card" href="${escapeHtml(href)}">
  <span class="deck-card__route">/${escapeHtml(deck.slug)}/</span>
  <strong>${escapeHtml(deck.title)}</strong>
  <span>${escapeHtml(deck.description)}</span>
</a>`;
    })
    .join("\n");
}

async function renderHomePage(decks, basePath) {
  const template = await readFile(join(siteDir, "index.html"), "utf8");

  return template
    .replaceAll("{{BASE_PATH}}", escapeHtml(basePath))
    .replace("{{DECK_CARDS}}", renderDeckCards(decks, basePath));
}

function runSlidevBuild(deck, basePath) {
  const outputDir = join(distDir, deck.slug);
  const deckBase = `${basePath}${deck.slug}/`;
  const entry = relative(root, deck.entry);
  const output = relative(root, outputDir);

  console.log(`Building ${entry} -> ${output}/`);

  const result = spawnSync(
    "pnpm",
    ["exec", "slidev", "build", entry, "--out", outputDir, "--base", deckBase],
    {
      cwd: root,
      stdio: "inherit",
      env: process.env,
    },
  );

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`Slidev build failed for "${deck.slug}".`);
  }
}

async function main() {
  const decks = await discoverDecks();
  const basePath = normalizeBasePath(process.env.BASE_PATH);

  await rm(distDir, { recursive: true, force: true });
  await mkdir(distDir, { recursive: true });
  await cp(join(siteDir, "styles.css"), join(distDir, "styles.css"));

  for (const deck of decks) {
    runSlidevBuild(deck, basePath);
  }

  await writeFile(
    join(distDir, "index.html"),
    await renderHomePage(decks, basePath),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
