# 90% Desktop + Hero Ingredient Fix

## What changed

- Desktop (>= 1100px) uses `body { zoom: .90; }` so the site feels like a 90% browser view without asking visitors to change browser settings.
- Tablet/mobile remain at 100% for readability.
- The custom kimchi cursor gets inverse zoom so it remains aligned with the physical pointer.
- Hero napa cabbage now explicitly preserves natural aspect ratio (`height:auto`, `object-fit:contain`, `aspect-ratio:auto`) and is repositioned to look fuller behind the bowl.
- Right-side spice/ingredient cutouts were moved slightly outward for more breathing room.

## Important

CSS cannot change the browser's own Zoom menu/indicator from 100% to 90%. This implementation changes only the website's visual scale.

Look for the CSS comment:
`2026-09-11 — AIRIER 90% DESKTOP SCALE + HERO INGREDIENT FIX`
