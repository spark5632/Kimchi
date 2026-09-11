# Zest-inspired Kimchi AI redesign

This version keeps all original Kimchi AI project content and functionality, but changes the visual language to a bold food-editorial direction inspired by the high-level design ideas of the Zest Framer template.

## What changed

- Full-screen dark hero with oversized **KIMCHI.** typography.
- Large central kimchi bowl with floating napa cabbage, spices, and ingredient cutouts.
- Subtle mouse parallax on hero ingredients (desktop only).
- Continuous ingredient/AI marquee strip.
- Larger editorial section headings and pill-style navigation/actions.
- Stronger food color blocks: warm cream, gochugaru red, mustard, and deep fermentation green.
- Larger ingredient cutouts along section edges.
- More rounded, menu/editorial-style content cards and stronger depth.
- NotebookLM section converted to a tomato-red showcase field while retaining the original PDF comparison and 8-slide viewer.
- Existing smooth kimchi cursor, hover scaling, rotation, 50% idle opacity, and pepper-particle click burst retained.
- Responsive behavior maintained; decorative elements reduce on small screens.
- `prefers-reduced-motion` still disables decorative motion.

## Main files changed

- `index.html` — redesigned hero and marquee markup.
- `style.css` — new Zest-inspired visual override layer appended near the end.
- `script.js` — subtle hero ingredient parallax appended at the end.

Search for `ZEST-INSPIRED KIMCHI REDESIGN` in `style.css` to tweak the new design quickly.
