# Kimchi Formation Intro

The intro uses only local HTML/CSS/JavaScript and the existing project images.

## Sequence
1. Napa cabbage, spice cluster, and kimchi ingredient cluster enter from different sides.
2. The ingredients rotate and converge into the center.
3. The finished kimchi bowl appears in the center.
4. A transparent circular hole expands from the center and reveals the website underneath.
5. The intro DOM is removed so it cannot affect the rest of the page.

## Main files
- `index.html` — intro markup + image preloads
- `style.css` — layout, ingredient motion, circular mask and responsive rules
- `script.js` — animation timing, circular reveal, skip/failsafe

## Timing
In `script.js`, search for `KIMCHI FORMATION INTRO`.

- Normal circular reveal starts at `3180` ms.
- Reveal duration is `1180` ms.
- Skip intro uses a faster `520` ms circle reveal.
- `Escape` also skips the intro.

## Assets
- `assets/images/decor/napa-cabbage.webp`
- `assets/images/decor/kimchi-spices.webp`
- `assets/images/decor/kimchi-ingredients.webp`
- `assets/images/decor/kimchi-bowl.webp`

The intro respects `prefers-reduced-motion` and has a 6.5-second failsafe so the page can never remain blocked by the overlay.
