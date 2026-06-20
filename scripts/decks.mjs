/**
 * Shared deck discovery and validation helpers.
 *
 * Both the production build and full-site dev proxy use this module so they
 * agree on which `decks/<slug>/` directories are valid Slidev decks.
 */
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const decksDir = resolve(root, "decks");
export const siteDir = resolve(root, "site");
export const distDir = resolve(root, "dist");
export const slidevBin = join(
  root,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "slidev.cmd" : "slidev",
);

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeBasePath(value) {
  const raw = value?.trim() || "/";
  const withLeadingSlash = raw.startsWith("/") ? raw : `/${raw}`;
  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash
    : `${withLeadingSlash}/`;
}

export function escapeHtml(value) {
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

export async function readDeck(slug) {
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
  return deck;
}

export function sortDecks(decks) {
  return decks.sort((left, right) => {
    const order = (left.order ?? 9999) - (right.order ?? 9999);
    return order || left.slug.localeCompare(right.slug);
  });
}

export async function discoverDecks() {
  const entries = await readdir(decksDir, { withFileTypes: true });
  const decks = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    decks.push(await readDeck(entry.name));
  }

  if (decks.length === 0) {
    throw new Error("No decks found. Add decks/<slug>/deck.json.");
  }

  return sortDecks(decks);
}
