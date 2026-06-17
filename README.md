# Slidev Project Template

A reusable [Slidev](https://sli.dev/) template for building multiple presentation decks and publishing them as one static GitHub Pages site.

## Use This Template

1. Create a new repository from this template.
2. Edit `slides.md` or add more decks in `decks.config.mjs`.
3. Push to `main`.
4. In GitHub, open `Settings` -> `Pages`, then set `Build and deployment` to `GitHub Actions`.

To make this repository itself a template, enable `Settings` -> `General` -> `Template repository` after pushing it to GitHub.

## Requirements

- Node.js 22
- pnpm 11.6.0

If Corepack is available:

```bash
corepack enable
pnpm install
pnpm run skills:install
```

## Local Development

Build the full static site and preview the home page:

```bash
pnpm run dev
```

The generated site is served at:

```text
http://127.0.0.1:4173/
```

For Slidev's interactive editor and hot reload, preview one deck directly:

```bash
pnpm run dev:deck
```

To preview another deck entry:

```bash
pnpm run dev:deck -- path/to/slides.md
```

To expose a deck preview on the local network:

```bash
pnpm run serve:deck
```

## Build

```bash
pnpm run build
```

The static site is generated in `dist/`.

The home page is generated at `dist/index.html`. Each deck is generated under its configured slug, for example:

```text
dist/
├── index.html
└── slides/
    ├── index.html
    └── assets/
```

GitHub Pages uses:

```bash
pnpm run build:pages
```

The workflow sets `BASE_PATH` automatically:

- `https://<user>.github.io/` repositories build with `/`
- normal project repositories build with `/<repo-name>/`

## Decks

Decks are declared in `decks.config.mjs`:

```js
export default [
  {
    slug: "slides",
    title: "Slidev Project Template",
    entry: "slides.md",
    description:
      "A reusable Slidev template for static GitHub Pages deployment.",
  },
];
```

- `slug` is the public subroute, such as `/slides/`.
- `title` and `description` are shown on the home page.
- `entry` points to the Slidev markdown file.

Add another object to the array to publish another deck.

## Export

```bash
pnpm run export
```

If Chromium is missing, install it with:

```bash
pnpm exec playwright install chromium
```

## Project Skills

This template treats project skills like generated dependencies.

- `skills-lock.json` is committed and is the source of truth.
- `.agents/skills/` is generated locally and ignored by Git.
- Restore skills manually after installing dependencies.
- CI does not install project skills because Slidev build does not need them.

Useful commands:

```bash
pnpm run skills:install
pnpm run skills:list
pnpm run skills:update
```

## Repository Structure

```text
.
├── decks.config.mjs
├── scripts/
│   ├── build-site.mjs
│   └── preview-dist.mjs
├── slides.md
├── package.json
├── pnpm-lock.yaml
├── skills-lock.json
└── .github/workflows/
    └── deploy-pages.yml
```

## Maintenance

- Edit slide content in `slides.md`.
- Add or reorder decks in `decks.config.mjs`.
- Keep dependencies reproducible with `pnpm-lock.yaml`.
- Run `pnpm run build` before pushing meaningful slide changes.
- Run `pnpm run skills:update` when intentionally refreshing project skills.
