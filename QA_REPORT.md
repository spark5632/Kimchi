# QA Report — Prompt Comparison Edition

Date: 2026-09-10

## Structural checks

- HTML parsed successfully.
- No duplicate HTML IDs found.
- All local `src` / `href` asset references resolve to files in the project.
- JavaScript syntax validated with `node --check`.
- CSS parsed with no fatal syntax errors.
- `fristprompt.pdf` is present and reports 15 pages.
- `finalprompt.pdf` is present and reports 8 pages.
- `finalprompt.pdf` is byte-identical to the previously supplied `Mastering_Authentic_Kimchi.pdf`, so the existing 8 rendered slide previews remain exact for the latest-result PDF.

## Prompt comparison coverage

- Section 01 — AI Image Generation: first/latest prompts + before/after image results.
- Section 02 — Mathematical Modeling: first/latest prompts + result summaries.
- Section 03 — Process Diagram: first/latest prompts + result summaries.
- Section 04 — LaTeX Article: first/latest prompts + result summaries + final article preview/download.
- Section 05 — NotebookLM Presentation: exact first/latest prompts + actual PDF result covers + open/download actions.

## Responsive behavior

New comparison blocks use a 3-column editorial comparison on desktop and collapse to one column below 900px. Long NotebookLM prompts have contained scrolling regions to prevent extreme page width/height expansion, and all text wraps with `overflow-wrap` enabled.

## GitHub Pages

All new links are relative paths. No backend or build process is required.


## NotebookLM equal-alignment update
- Desktop comparison reserves an identical prompt area in both columns.
- First-page preview images are both 1280x714 source assets and render in identical 16:9 wrappers.
- The two PDF previews now begin on the same horizontal baseline.
- Mobile keeps natural stacked heights to avoid unnecessary blank space.
