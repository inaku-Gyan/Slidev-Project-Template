# Slidev Project Template

A reusable [Slidev](https://sli.dev/) template for building multiple presentation decks and publishing them as one static GitHub Pages site.

## Use This Template

1. Create a new repository from this template.
2. Edit `decks/demo-one/slides.md` or add a new deck under `decks/`.
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

Preview the full deck index with hot reload:

```bash
pnpm dev
```

This starts a local index at `http://localhost:3030/` and proxies each
discovered deck to its own Slidev dev server.

Preview a single deck by slug without the site proxy:

```bash
pnpm dev demo-one
```

Pass extra Slidev options after `--`:

```bash
pnpm dev demo-one -- --port 4040
```

Build the full static site:

```bash
pnpm run build
```

Preview the existing static site output:

```bash
pnpm preview
```

The preview server listens on all network interfaces, so devices on the same
network can open the printed network URL. `pnpm preview` does not rebuild; run
`pnpm run build` first after changing slides.

## Build

```bash
pnpm run build
```

The static site is generated in `dist/`.

The home page is generated at `dist/index.html`. Each deck is generated under its configured directory slug:

```text
dist/
├── index.html
├── 404.html
├── styles.css
├── demo-one.html
├── demo-one/
│   ├── index.html
│   └── assets/
├── demo-two.html
└── demo-two/
    ├── index.html
    └── assets/
```

GitHub Pages uses:

```bash
pnpm run build
```

The workflow sets `BASE_PATH` automatically:

- `https://<user>.github.io/` repositories build with `/`
- normal project repositories build with `/<repo-name>/`

## Routes

The generated site uses static file routes:

- `/` opens the deck index.
- `/demo-one/` opens the first demo deck.
- `/demo-two/` opens the second demo deck.
- `/demo-one` and `/demo-two` redirect to the matching trailing-slash route.
- Unknown paths such as `/unknown`, `/demo-one/foo`, and `/demo-two/foo` return 404.
- Slide routes use hash URLs, such as `/demo-one/#/1`, so page refreshes still request the real `/demo-one/` entry.

## Decks

Each deck lives in `decks/<slug>/`:

```text
decks/
├── demo-one/
│   ├── deck.json
│   └── slides.md
└── demo-two/
    ├── deck.json
    └── slides.md
```

`deck.json` provides the home page metadata:

```json
{
  "title": "Demo Two",
  "description": "A second demo deck that demonstrates multi-deck publishing.",
  "order": 2
}
```

- The directory name is the deck slug for commands, such as `pnpm dev demo-one`,
  and the public route, such as `/demo-one/`.
- `title` and `description` are shown on the home page.
- `order` controls home page sorting.

To add another deck, copy `decks/demo-two/` to `decks/my-talk/`, update `deck.json`, edit `slides.md`, then run `pnpm run build`.

## Export

```bash
pnpm export demo-one
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
│   ├── demo-one/
│   └── demo-two/
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
