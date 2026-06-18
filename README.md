# Slidev Project Template

A reusable [Slidev](https://sli.dev/) template for building multiple presentation decks and publishing them as one static GitHub Pages site.

## Use This Template

1. Create a new repository from this template.
2. Edit `decks/template/slides.md` or add a new deck under `decks/`.
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

Preview the default template deck with Slidev hot reload:

```bash
pnpm run dev
```

Preview another deck entry:

```bash
pnpm run dev:deck -- decks/demo/slides.md
```

To expose a deck preview on the local network:

```bash
pnpm run serve:deck -- decks/demo/slides.md
```

Build and preview the full static site:

```bash
pnpm run preview
```

## Build

```bash
pnpm run build
```

The static site is generated in `dist/`.

The home page is generated at `dist/index.html`. Each deck is generated under its configured directory slug:

```text
dist/
├── index.html
├── styles.css
├── template/
│   ├── index.html
│   └── assets/
└── demo/
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

Each deck lives in `decks/<slug>/`:

```text
decks/
├── template/
│   ├── deck.json
│   └── slides.md
└── demo/
    ├── deck.json
    └── slides.md
```

`deck.json` provides the home page metadata:

```json
{
  "title": "Multi Deck Demo",
  "description": "A second Slidev deck that demonstrates multi-deck publishing.",
  "order": 2
}
```

- The directory name is the public route, such as `/demo/`.
- `title` and `description` are shown on the home page.
- `order` controls home page sorting.

To add another deck, copy `decks/demo/` to `decks/my-talk/`, update `deck.json`, edit `slides.md`, then run `pnpm run build`.

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
├── decks/
│   ├── template/
│   └── demo/
├── site/
│   ├── index.html
│   └── styles.css
├── scripts/
│   └── build-site.mjs
├── package.json
├── pnpm-lock.yaml
├── skills-lock.json
└── .github/workflows/
    └── deploy-pages.yml
```

## Maintenance

- Edit slide content in `decks/<slug>/slides.md`.
- Edit deck metadata in `decks/<slug>/deck.json`.
- Keep dependencies reproducible with `pnpm-lock.yaml`.
- Run `pnpm run build` before pushing meaningful slide changes.
- Run `pnpm run skills:update` when intentionally refreshing project skills.
