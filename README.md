# rakadityas.github.io

Personal portfolio for Raka Aditya Soenarno — a static, dependency-free single page
served by GitHub Pages at <https://rakadityas.github.io/>.

## Structure

```
index.html              markup, meta tags, and JSON-LD structured data
assets/css/style.css    design tokens, layout, light/dark themes, print styles
assets/js/main.js       theme toggle, mobile menu, scroll reveal, scrollspy
assets/img/             profile photo, company logos, favicon
robots.txt              crawler directives + sitemap pointer
sitemap.xml             single-URL sitemap
.nojekyll               tells GitHub Pages to serve files as-is
```

## Local development

No build step. Open `index.html` directly, or serve it so that absolute paths
and the theme's `localStorage` behave as they do in production:

```sh
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Deploying

Pushing to `main` publishes the site. GitHub Pages serves the repository root.

## Maintenance notes

- **Colors** live as CSS custom properties in `:root` at the top of `style.css`.
  Dark values are declared twice — once under `:root[data-theme="dark"]` (explicit
  toggle) and once under `@media (prefers-color-scheme: dark)` (system preference).
  Any new theme-dependent rule needs both, or it breaks for system-dark visitors.
- **Structured data** (`application/ld+json` in `index.html`) mirrors the visible
  résumé content. Update it whenever the role, employer, or links change, and
  re-check with the [Rich Results Test](https://search.google.com/test/rich-results).
- **Images** are pre-sized to roughly 2–3x their display size. Logos render at
  ~34px tall and are stored at 160px. Keep `width`/`height` attributes in sync
  with the actual files to avoid layout shift.
- **`sitemap.xml`** has a hardcoded `<lastmod>`; bump it on meaningful updates.
