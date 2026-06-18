---
theme: default
title: "Multi Deck Demo"
info: |
  A second Slidev deck that demonstrates multi-deck publishing.
class: text-center
drawings:
  persist: false
transition: fade
mdc: true
---

# Multi Deck Demo

This is a second Slidev deck in the same static site.

---

# Source Layout

```text
decks/
├── template/
│   ├── deck.json
│   └── slides.md
└── demo/
    ├── deck.json
    └── slides.md
```

Each directory is an independent deck.

---

# Public Routes

This deck is built from:

```text
decks/demo/slides.md
```

It is deployed to:

```text
/demo/
```

---

# Metadata

The home page reads this file:

```text
decks/demo/deck.json
```

It provides:

- Title
- Description
- Sort order

---

# Add Another Deck

1. Copy `decks/demo/` to `decks/my-talk/`
2. Update `decks/my-talk/deck.json`
3. Edit `decks/my-talk/slides.md`
4. Run `pnpm run build`

---
layout: center
class: text-center
---

# Two Decks, One Site

The root page links to every configured deck.
