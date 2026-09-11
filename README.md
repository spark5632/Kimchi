# Kimchi AI Learning Project — Prompt Comparison Edition

Static portfolio website for GitHub Pages. No backend, database, build step, or Node.js runtime is required.

## Update: 10 Sep 2026

The website now makes **Prompt แรก vs Prompt ล่าสุด** visible in every numbered learning section:

1. **AI Image Generation** — interactive first/latest prompt tabs with the original before/after infographic results.
2. **Mathematical Modeling** — compares the broad Desmos/pH request with the more constrained educational exponential-decay prompt.
3. **Process Diagram** — compares the one-line Mermaid request with the detailed flowchart request containing substeps and a decision loop.
4. **LaTeX Academic Article** — compares the basic LaTeX request with the structured XeLaTeX/Overleaf document specification.
5. **NotebookLM Presentation** — compares the exact first/latest prompts and links to the actual result files:
   - `assets/pdf/fristprompt.pdf` — 15 pages
   - `assets/pdf/finalprompt.pdf` — 8 pages

The featured 8-slide viewer in Section 05 now points to `finalprompt.pdf`. The previous `Mastering_Authentic_Kimchi.pdf` is still kept in the assets folder for backward compatibility.

## Main files

```text
index.html
style.css
script.js
.nojekyll
assets/
  data/
  diagrams/
  images/
    prompt-results/
      notebook-first.webp
      notebook-final.webp
  pdf/
    fristprompt.pdf
    finalprompt.pdf
    Mastering_Authentic_Kimchi.pdf
    kimchi-ai-article-final.pdf
    kimchi-ai-article.tex
  slides/
```

## Run locally

You can open `index.html` directly, or use any static HTTP server. Example:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000/`.

## Deploy to GitHub Pages

1. Upload the contents of this folder to the repository root.
2. Commit and push to `main`.
3. Open GitHub → **Settings → Pages**.
4. Choose **Deploy from a branch**.
5. Select `main` and `/ (root)`.
6. Save.

No backend is required.

## Notes

- The pH graph is an educational model, not experimental data.
- Section 05 PDF result files are preserved locally so the comparison still works on GitHub Pages.
- `finalprompt.pdf` and the 8-slide viewer use the same 8-page presentation content.
- Prompt comparison text is copyable through the existing JavaScript copy controls.

## Kimchi cursor interaction

Desktop/laptop devices with a fine pointer use a custom kimchi cursor:

- Smooth follow using `requestAnimationFrame` and interpolation.
- 50% opacity over normal content.
- 100% opacity and 1.34x scale over clickable/interactive controls.
- Subtle tilt while moving, then easing back to neutral.
- Small red chili particles on left click.
- Touch devices keep native behavior.
- `prefers-reduced-motion` disables decorative particle motion.

Main files:

- `assets/images/kimchi-cursor.png` - 48x48 transparent PNG.
- `style.css` - section `CUSTOM KIMCHI CURSOR / SMOOTH INTERACTION`.
- `script.js` - section `KIMCHI CURSOR FX`.

## 2026-09-11 — Food Decor Edition
- Added decorative kimchi / ingredient cutouts around every major section.
- Added a Kimchi Pantry ribbon (배추 / 고춧가루 / 마늘 / 생강 / 발효).
- Decorations stay near outer edges, use pointer-events:none, and never cover interactive content.
- Added gentle floating motion with prefers-reduced-motion support.
- Added subtle pepper-speck / food-inspired micro-details to cards and footer.
- Added optimized WebP decoration assets under `assets/images/decor/` while keeping source PNG files under `assets/images/`.

## Zest-inspired food editorial edition (2026-09-11)

The latest edition uses oversized typography, high-contrast food color fields, larger ingredient imagery, a moving ingredient marquee, and subtle parallax while preserving the original learning content and interactive tools. See `ZEST_INSPIRED_REDESIGN.md` for the design-specific notes.

## Section 06 added — Website & GitHub Pages
The portfolio now includes the missing sixth case study: prompt evolution for website creation, a GitHub Pages publishing workflow, project file structure, deployment commands, and a live-site visual mockup. Navigation, hero metrics, and the project index now show all 6 learning tools.
