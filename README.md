# Tanvir Creates — Portfolio Website

A fast, responsive, single-page portfolio for **Tanvir Ahamad** (freelance graphic &
brand-identity designer). Built with plain HTML + CSS + vanilla JS on the **Tanvir Creates**
design system. Light/dark mode, smooth-scroll nav, mobile menu, scroll-reveal animation, and a
no-backend contact form.

## Files
- `index.html` — the whole site (one page). *(Imported from Claude Design's `Tanvir Creates.html`;
  renamed to `index.html` so it serves at the domain root and on GitHub Pages.)*
- `assets/profile.jpg` — profile photo, reused in the hero and About sections.
- `assets/resume.pdf` — **placeholder to add** (Download résumé button links here).
- `_ds/…` — the design system (tokens + component styles). Keep this folder alongside the HTML.
- `.nojekyll` — **required for GitHub Pages.** GitHub's Jekyll build ignores folders that start
  with `_`, which would silently drop the entire `_ds/` stylesheet folder. This empty file turns
  Jekyll off so the site is served as-is. Don't delete it.

## Swap the placeholders
1. **Profile photo** — replace `assets/profile.jpg` with your own (keep the filename). It updates
   the hero and About automatically.
2. **Résumé** — export your résumé to PDF and save it as `assets/resume.pdf`.
3. **Project images** — the Work section has a clearly-commented `SWAPPABLE PROJECT GALLERY` block.
   Drop images into `assets/work/` and follow the comment to replace each placeholder tile.
4. **Contact form** — the form uses [Web3Forms](https://web3forms.com) (free, no backend):
   grab an access key and replace `YOUR_WEB3FORMS_ACCESS_KEY` in the HTML. Until you do, the form
   safely falls back to opening the visitor's email app pre-filled — nothing breaks.
5. **Social links** — LinkedIn / Instagram slots in the footer point to `#contact` for now. Swap in
   real URLs when ready (search for `on request` in the HTML).

## Deploy on GitHub Pages (this repo's target)
Repo: `git@github.com:tanvirahamadd66-source/tanvir.git`
1. Push these files to the repo root (see commands below).
2. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, pick
   `main` and folder `/ (root)`, then Save.
3. The site publishes at `https://tanvirahamadd66-source.github.io/tanvir/` within a minute.
4. **Custom domain:** Settings → Pages → Custom domain → enter your purchased domain, then add the
   DNS records GitHub shows (a `CNAME` for `www`, or `A`/`ALIAS` records for the apex) at your
   registrar. Enable "Enforce HTTPS" once DNS resolves.

> The `.nojekyll` file must stay at the repo root or the `_ds/` styles won't load on GitHub Pages.

### Netlify / Vercel alternative
Drag the whole folder onto [app.netlify.com](https://app.netlify.com), or import the repo at
[vercel.com](https://vercel.com); add your custom domain in the site's domain settings. HTTPS is
automatic. (`.nojekyll` is harmless there.)
