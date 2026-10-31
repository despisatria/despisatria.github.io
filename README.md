# despisatria.github.io

Resume and portfolio of Desphi Satria Nurjaya, served by GitHub Pages at https://despisatria.github.io/.

## How it works

- `content/resume.json` holds all the text: summary, experience, portfolio, skills, and recommendations.
- `scripts/build.mjs` turns that file into `index.html`. It has no dependencies.
- `assets/css/site.css` is the stylesheet, including the print layout used by the **Download CV** button.

## Updating the site

1. Edit `content/resume.json`. Inline formatting is supported in text fields: `**bold**`, `*italic*`, and `[label](url)`.
2. Rebuild the page:

   ```bash
   node scripts/build.mjs
   ```

3. Commit both `content/resume.json` and the regenerated `index.html`.

To preview locally, open `index.html` in a browser, or run `python3 -m http.server` and visit http://localhost:8000.

## Notes

- The page is always light themed (`color-scheme: light`), whatever the visitor's system setting.
- **Download CV** prints the page as a plain CV (summary, experience, skills, other experience, education). The case study, work samples, and recommendations stay on the site, which the printed header links to.
- The design brief and the reason behind each visual choice are written at the top of `assets/css/site.css`.
- `details-*.html` and the files under `assets/` that the new page does not use are left over from the previous template.
