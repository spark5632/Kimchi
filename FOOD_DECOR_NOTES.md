# Food Decoration Notes

This edition uses decorative food cutouts to make the Kimchi AI portfolio feel warmer and more appetizing without changing the project content.

## Source filenames
- `assets/images/kimchi-bowl.png`
- `assets/images/napa-cabbage.png`
- `assets/images/kimchi-spices.png`
- `assets/images/kimchi-onggi-jar.png`
- `assets/images/kimchi-ingredients.png`
- `assets/images/kimchi-splash.png`

## Optimized web assets
The site itself loads smaller WebP derivatives from `assets/images/decor/` for better performance.

## Main CSS controls
Search `FOOD DECOR / KIMCHI PANTRY EDITORIAL LAYER` near the end of `style.css`.

Useful variables on each `.food-decor` element:
- `--decor-size`
- `--decor-opacity`
- `--decor-rotate`
- `--decor-speed`
- `--decor-delay`

All decoration layers use `pointer-events: none`, and mobile rules reduce or hide extra objects.
