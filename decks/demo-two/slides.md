---
theme: default
title: "Demo Two"
info: |
  A second demo deck that demonstrates multi-deck publishing.
class: text-center
drawings:
  persist: false
transition: fade
mdc: true
---

# Demo Two

This is a second Slidev deck in the same static site.

---

# Source Layout

```text
decks/
├── demo-one/
│   ├── deck.json
│   └── slides.md
└── demo-two/
    ├── deck.json
    └── slides.md
```

Each directory is an independent deck.

---

# Public Routes

This deck is built from:

```text
decks/demo-two/slides.md
```

It is deployed to:

```text
/demo-two/
```

---

# Metadata

The home page reads `title` and `info` from:

```text
decks/demo-two/slides.md
```

The deck config file only controls sorting:

```text
decks/demo-two/deck.json
```

---

# Add Another Deck

1. Copy `decks/demo-two/` to `decks/my-talk/`
2. Update `order` in `decks/my-talk/deck.json`
3. Edit `title` and `info` in `decks/my-talk/slides.md`
4. Run `pnpm run build`

---
layout: center
class: text-center
---

# Two Decks, One Site

The root page links to every configured deck.
