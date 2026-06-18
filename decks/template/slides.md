---
theme: dracula
title: "Slidev Project Template"
info: |
  A reusable Slidev template for static GitHub Pages deployment.
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Slidev Project Template

Build, present, and publish slides with GitHub Pages

---

# What This Template Includes

- Slidev starter deck
- pnpm-based dependency management
- Static production build
- GitHub Pages deployment workflow
- Optional project skills restored from a lockfile

---

# Local Development

```bash
corepack enable
pnpm install
pnpm run dev
```

Edit `decks/template/slides.md` and Slidev will update the preview automatically.

---

# Static Build

```bash
pnpm run build
```

The generated site is written to `dist/`.

For GitHub Pages project sites, the deployment workflow sets the correct base path automatically.

---

# Customize The Deck

Update the frontmatter at the top of `decks/template/slides.md`:

```yaml
theme: dracula
title: "My Presentation"
transition: slide-left
```

Then replace the starter slides with your own content.

---

# Resources

- Slidev: https://sli.dev/
- Theme gallery: https://sli.dev/resources/theme-gallery
- GitHub Pages: https://docs.github.com/pages

---
layout: center
class: text-center
---

# Start Presenting

Build the deck, push to GitHub, and enable Pages with GitHub Actions.
