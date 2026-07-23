# Tanvir Creates — Portfolio Website

A fast, responsive, static portfolio for **Tanvir Ahamad** — brand identity & logo designer
(behance.net/itztvr). Plain HTML/CSS/vanilla JS, no framework, no build step.

## Structure

```
index.html          # all page markup/content
css/style.css       # styling, theme tokens (light/dark), animations
js/main.js          # interactivity: theme toggle, nav, rendering, contact form
js/projects-data.js         # featured/additional projects + testimonials
js/behance-projects-data.js # real Behance project data
projects/           # generated case-study page per Behance project
scripts/generate-project-pages.js  # regenerates projects/*.html from behance-projects-data.js
scripts/dev-server.js              # zero-dependency local preview server
assets/             # profile photo, project images, resume
```

## Local preview

```
node scripts/dev-server.js 8080
```

Then open `http://localhost:8080`.

## Deployment

Served via GitHub Pages from the `main` branch root, with a custom domain
(`tanvircreates.com`, see `CNAME`). `.nojekyll` disables Jekyll processing so files/folders
starting with `_` (if any are added later) aren't silently dropped.

## Adding a new Behance project

1. Add an entry to `js/behance-projects-data.js` (title, category, description, tags, image paths).
2. Drop its images into `assets/img/projects/behance/<slug>/`.
3. Run `node scripts/generate-project-pages.js` to regenerate the detail page.
