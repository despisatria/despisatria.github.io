# despisatria.github.io

Resume and portfolio of Desphi Satria Nurjaya, served by GitHub Pages at https://despisatria.github.io/.

## How it works

- `content/resume.json` holds all the text: summary, availability, how I work, experience, portfolio, skills, and recommendations.
- `scripts/build.mjs` turns that file into four pages: `overview.html`, `experience.html`, `portfolio.html`, and `testimonials.html`, plus `index.html`, which only sends the bare domain to `/overview`. It has no dependencies.
- Links leave out `.html` (`/overview`, `/experience`, ...). GitHub Pages serves `/overview` from `overview.html`.
- The logo and the circles around the latest metrics are one pen stroke, kept as SVG paths in `scripts/build.mjs` and `assets/css/site.css`. The favicons in `assets/img/` are rendered from the same stroke.
- Images live in `assets/img/`: company logos in `logos/`, earlier project screens and redacted samples in `work/`.
- `assets/css/site.css` is the stylesheet, including the print layout used by the **Download CV** button.

## Updating the site

1. Edit `content/resume.json`. Inline formatting is supported in text fields: `**bold**`, `*italic*`, and `[label](url)`.
2. Rebuild the page:

   ```bash
   node scripts/build.mjs
   ```

3. Commit `content/resume.json` together with the regenerated pages.

To preview locally, run `node scripts/serve.mjs` and visit http://localhost:8000. It serves the extensionless URLs the same way GitHub Pages does. Opening the files directly or using `python3 -m http.server` breaks the links, because those do not map `/overview` to `overview.html`, and page transitions only run over HTTP.

## Notes

- The page is always light themed (`color-scheme: light`), whatever the visitor's system setting.
- **Download CV** downloads the PDF CV from Google Drive (`cvUrl` in `content/resume.json`). Replace the file on Drive, or change `cvUrl`, when the CV changes. Printing the experience page by hand still gives a plain CV.
- Pages cross-fade when you move between them (cross-document view transitions) and in-page links scroll smoothly. Both are off for visitors who prefer reduced motion.
- Screenshots in `assets/img/work/` have internal links, colleagues' names, and test credentials blacked out. Check any new screenshot for the same before adding it.
- The design brief and the reason behind each visual choice are written at the top of `assets/css/site.css`.
- The link preview image (`og:image`) is `assets/img/og-card.png`. The build writes its source, `scripts/og-card.html`, from the same headline, logo, and photo. After changing those, open http://localhost:8000/scripts/og-card.html with `node scripts/serve.mjs` running, take a 1200 × 630 screenshot, and save it over `assets/img/og-card.png`.
