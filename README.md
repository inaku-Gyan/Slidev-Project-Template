# Slidev Project Template

A reusable [Slidev](https://sli.dev/) template for building presentation decks and publishing them as static GitHub Pages sites.

## Use This Template

1. Create a new repository from this template.
2. Edit `slides.md`.
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
```

## Local Development

```bash
pnpm run dev
```

Slidev opens a local preview at:

```text
http://localhost:3030
```

To expose the preview on the local network:

```bash
pnpm run serve
```

## Build

```bash
pnpm run build
```

The static site is generated in `dist/`.

GitHub Pages uses:

```bash
pnpm run build:pages
```

The workflow sets `BASE_PATH` automatically:

- `https://<user>.github.io/` repositories build with `/`
- normal project repositories build with `/<repo-name>/`

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
- `pnpm install` restores skills locally through `postinstall`.
- CI skips skill restoration automatically.

Useful commands:

```bash
pnpm run skills:install
pnpm run skills:list
pnpm run skills:update
```

To skip local skill restoration:

```bash
SKIP_SKILLS_INSTALL=1 pnpm install
```

## Repository Structure

```text
.
├── slides.md
├── package.json
├── pnpm-lock.yaml
├── skills-lock.json
├── scripts/
│   └── install-skills.mjs
└── .github/workflows/
    └── deploy-pages.yml
```

## Maintenance

- Edit slide content in `slides.md`.
- Keep dependencies reproducible with `pnpm-lock.yaml`.
- Run `pnpm run build` before pushing meaningful slide changes.
- Run `pnpm run skills:update` when intentionally refreshing project skills.
