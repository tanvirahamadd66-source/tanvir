/*
  Generates portfolio-site/projects/<slug>.html for every entry in
  js/behance-projects-data.js, reusing the same nav/footer/theme markup
  as index.html so the standalone pages stay visually consistent.

  Run whenever behance-projects-data.js changes:
    node scripts/generate-project-pages.js
*/

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PROJECTS = require(path.join(ROOT, "js", "behance-projects-data.js"));
const OUT_DIR = path.join(ROOT, "projects");

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// Escapes text for safe use inside an HTML attribute value (double-quoted).
function escAttr(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Escapes text for safe use inside a JSON string embedded in a <script> tag.
function escJson(str) {
  return String(str).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function page(p) {
  const title = escAttr(p.title);
  const shortDescription = escAttr(p.shortDescription);
  const category = escAttr(p.category);
  const description = escAttr(p.description);

  const tagBadges = p.tags.map((t) => `<span class="badge">${escAttr(t)}</span>`).join("\n            ");
  const moreNote =
    p.totalOnBehance > p.gallery.length
      ? `<p class="project-gallery-note">Showing ${p.gallery.length} of ${p.totalOnBehance} images from this project — see the full case study on Behance for the complete gallery.</p>`
      : "";
  // galleryAspect: optional override (e.g. "1 / 1") for projects whose
  // grouped (2/3-col) images aren't the default 4:3 the shared CSS assumes —
  // without this, square or other-ratio images get cropped by object-fit:cover.
  // Gallery entries are normally a plain src string; pass {src, maxWidth} instead
  // to constrain/center an item that would otherwise look oversized at full
  // container width (e.g. a narrow email/portrait screenshot next to wide shots).
  let galleryImgIndex = 0;
  const galleryImgTag = (item, aspect) => {
    galleryImgIndex += 1;
    const src = typeof item === "string" ? item : item.src;
    const maxWidth = typeof item === "object" && item.maxWidth ? item.maxWidth : null;
    const styleParts = [];
    if (aspect) styleParts.push(`aspect-ratio:${aspect}`);
    if (maxWidth) styleParts.push(`max-width:${maxWidth}px`, `width:100%`, `margin-inline:auto`);
    const style = styleParts.length ? ` style="${styleParts.join(";")};"` : "";
    const alt = `${title} — portfolio project by Tanvir Ahamad, screen ${galleryImgIndex}`;
    return `      <img src="../${src}" alt="${alt}" loading="lazy"${style} />`;
  };
  let galleryImgs;
  if (p.galleryGroups) {
    // Flexible layout: an array of group sizes partitioning the gallery in order.
    // Size 1 renders full-width; size 3 renders as a .project-gallery-3col row;
    // any other size 2+ renders as a .project-gallery-2col row.
    const parts = [];
    let idx = 0;
    for (const size of p.galleryGroups) {
      const chunk = p.gallery.slice(idx, idx + size).map((src) => galleryImgTag(src, size >= 2 ? p.galleryAspect : null));
      if (size === 3) {
        parts.push(`      <div class="project-gallery-3col">`, ...chunk, `      </div>`);
      } else if (size >= 2) {
        parts.push(`      <div class="project-gallery-2col">`, ...chunk, `      </div>`);
      } else {
        parts.push(...chunk);
      }
      idx += size;
    }
    galleryImgs = parts.join("\n");
  } else if (p.twoColumnFrom) {
    const startIdx = p.twoColumnFrom - 1;
    const endIdx = p.twoColumnTo || p.gallery.length;
    galleryImgs = [
      ...p.gallery.slice(0, startIdx).map((src) => galleryImgTag(src, null)),
      `      <div class="project-gallery-2col">`,
      ...p.gallery.slice(startIdx, endIdx).map((src) => galleryImgTag(src, p.galleryAspect)),
      `      </div>`,
      ...p.gallery.slice(endIdx).map((src) => galleryImgTag(src, null)),
    ].join("\n");
  } else {
    galleryImgs = p.gallery.map((src) => galleryImgTag(src, null)).join("\n");
  }

  const canonicalUrl = `https://tanvircreates.com/projects/${p.slug}.html`;
  const ogImage = `https://tanvircreates.com/${p.coverImage || p.gallery[0]}`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title} — Tanvir Ahamad | Tanvir Creates</title>
<meta name="description" content="${shortDescription}" />
<meta name="robots" content="index, follow" />
<meta name="author" content="Tanvir Ahamad" />
<meta name="theme-color" content="#0d0d0d" />
<link rel="canonical" href="${canonicalUrl}" />
<link rel="icon" type="image/svg+xml" href="../assets/favicon.svg" />

<!-- Open Graph -->
<meta property="og:title" content="${title} — Tanvir Creates" />
<meta property="og:description" content="${shortDescription}" />
<meta property="og:type" content="article" />
<meta property="og:url" content="${canonicalUrl}" />
<meta property="og:site_name" content="Tanvir Creates" />
<meta property="og:image" content="${ogImage}" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title} — Tanvir Creates" />
<meta name="twitter:description" content="${shortDescription}" />
<meta name="twitter:image" content="${ogImage}" />

<!-- Structured data: Breadcrumbs -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://tanvircreates.com/" },
    { "@type": "ListItem", "position": 2, "name": "Work", "item": "https://tanvircreates.com/#work" },
    { "@type": "ListItem", "position": 3, "name": "${escJson(p.title)}", "item": "${canonicalUrl}" }
  ]
}
</script>

<!-- Structured data: CreativeWork -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "${escJson(p.title)}",
  "description": "${escJson(p.shortDescription)}",
  "image": "${ogImage}",
  "url": "${canonicalUrl}",
  "keywords": "${escJson(p.tags.join(", "))}",
  "creator": { "@type": "Person", "name": "Tanvir Ahamad", "url": "https://tanvircreates.com/" }
}
</script>

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@500;600;700;800&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="../css/style.css" />
<script>
  (function () {
    try {
      var saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") document.documentElement.setAttribute("data-theme", saved);
    } catch (e) {}
  })();
</script>
</head>
<body>

<header class="nav">
  <div class="container nav-inner">
    <a href="../index.html#home" class="logo">
      <span class="logo-text">Tanvir <span class="logo-accent">Creates</span></span>
    </a>
    <nav class="nav-links" aria-label="Primary">
      <a href="../index.html#about">About</a>
      <a href="../index.html#services">Services</a>
      <a href="../index.html#work">Work</a>
      <a href="../index.html#process">Process</a>
      <a href="../index.html#contact">Contact</a>
      <span class="nav-indicator" aria-hidden="true"></span>
    </nav>
    <div class="nav-actions">
      <button class="icon-btn theme-toggle" id="themeToggle" type="button" aria-label="Toggle dark mode">
        <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
        <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/></svg>
      </button>
      <a href="../index.html#contact" class="btn btn-primary">Get in Touch</a>
      <button class="icon-btn nav-toggle" id="navToggle" type="button" aria-label="Open menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>
    </div>
  </div>
</header>

<div class="mobile-menu" id="mobileMenu">
  <div class="mobile-menu-top">
    <span class="logo">
      <span class="logo-text">Tanvir <span class="logo-accent">Creates</span></span>
    </span>
    <button class="icon-btn" id="navClose" type="button" aria-label="Close menu">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
    </button>
  </div>
  <nav aria-label="Mobile">
    <a href="../index.html#about" class="mobile-link">About</a>
    <a href="../index.html#services" class="mobile-link">Services</a>
    <a href="../index.html#work" class="mobile-link">Work</a>
    <a href="../index.html#process" class="mobile-link">Process</a>
    <a href="../index.html#contact" class="mobile-link">Contact</a>
  </nav>
  <div class="mobile-menu-footer">
    <a href="../index.html#contact" class="btn btn-primary btn-block mobile-link">Get in Touch</a>
  </div>
</div>

<main id="main">
  <section class="section project-detail-header" style="border-bottom:none;">
    <div class="container">
      <a class="back-link" href="../index.html#work">&larr; Back to all work</a>
      <div class="project-detail-intro">
        <span class="eyebrow">${category}</span>
        <h1 class="project-detail-title" style="margin-top:0.75rem;">${title}</h1>
        <div class="project-detail-meta">
              ${tagBadges}
        </div>
        <p class="project-detail-desc">${description}</p>
        <div class="project-detail-cta">
          ${
            p.behanceUrl
              ? `<a href="${p.behanceUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">View on Behance &rarr;</a>`
              : `<span class="btn btn-outline" style="pointer-events:none;">${p.projectBadge || "Client Project"}</span>`
          }
          <a href="../index.html#contact" class="btn btn-primary">Start a Similar Project</a>
        </div>
      </div>
    </div>
  </section>

  <section class="section" style="border-bottom:none;${p.gallerySectionBg ? ` background:${p.gallerySectionBg};` : ""}">
    <div class="container">
      <div class="project-gallery-head">
        <span class="eyebrow">${p.liveEmbedSite ? "Live Email Preview" : "Project Gallery"}</span>
      </div>
      ${
        p.liveEmbedSite
          ? `<div class="project-live-embed">
        <iframe id="siteEmbedFrame" src="${p.liveEmbedSite}" title="${title} — live preview">
          <div class="project-live-embed-fallback">Your browser can't display this embedded preview — <a href="${p.liveEmbedSite}">open the live design directly</a> instead.</div>
        </iframe>
      </div>`
          : `<div class="project-gallery">
${galleryImgs}
      </div>
      ${moreNote}`
      }

      <div class="action-row" data-slug="${p.slug}">
        <button type="button" class="action-card" id="clapBtn" aria-label="Appreciate this project" aria-pressed="false">
          <svg class="action-icon heart-icon" viewBox="0 0 24 24"><path d="M12 21s-7.5-4.35-10-9.28C.5 8.5 2 5 5.6 5 8 5 9.5 6.5 12 9c2.5-2.5 4-4 6.4-4C22 5 23.5 8.5 22 11.72 19.5 16.65 12 21 12 21z"/></svg>
        </button>
        <button type="button" class="action-card" id="saveBtn" aria-label="Save this project" aria-pressed="false">
          <svg class="action-icon save-icon" viewBox="0 0 24 24"><path d="M6 3.5h12a.5.5 0 0 1 .5.5v16.2a.5.5 0 0 1-.77.42L12 16.9l-5.73 3.72a.5.5 0 0 1-.77-.42V4a.5.5 0 0 1 .5-.5z"/></svg>
        </button>
        <a class="action-card" href="../index.html#contact" aria-label="Get in touch">
          <svg class="action-icon contact-icon" viewBox="0 0 24 24"><path d="M4 4h16v16H4z"/><path d="m4 4 8 8 8-8"/></svg>
        </a>
      </div>
    </div>
  </section>
</main>

<footer class="footer">
  <div class="container">
    <div class="footer-top">
      <a href="../index.html#home" class="logo">
        <span class="logo-text">Tanvir <span class="logo-accent">Creates</span></span>
      </a>
      <nav class="footer-links" aria-label="Footer">
        <a href="../index.html#about">About</a>
        <a href="../index.html#services">Services</a>
        <a href="../index.html#work">Work</a>
        <a href="../index.html#contact">Contact</a>
        <a href="https://www.behance.net/itztvr" target="_blank" rel="noopener noreferrer">Behance</a>
      </nav>
    </div>
    <div class="footer-bottom">
      <span class="footer-copyright">&copy; <span id="year"></span> Tanvir Creates. All rights reserved.</span>
    </div>
  </div>
</footer>

<button class="icon-btn back-to-top" id="backToTop" type="button" aria-label="Back to top">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
</button>

<script>
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("year").textContent = new Date().getFullYear();

    document.getElementById("themeToggle").addEventListener("click", () => {
      const root = document.documentElement;
      const current = root.getAttribute("data-theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      const next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });

    const menu = document.getElementById("mobileMenu");
    document.getElementById("navToggle").addEventListener("click", () => menu.classList.add("open"));
    document.getElementById("navClose").addEventListener("click", () => menu.classList.remove("open"));
    menu.querySelectorAll(".mobile-link").forEach((l) => l.addEventListener("click", () => menu.classList.remove("open")));

    const backToTop = document.getElementById("backToTop");
    window.addEventListener("scroll", () => backToTop.classList.toggle("visible", window.scrollY > 600));
    backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
${
  p.liveEmbedSite
    ? `
    // Give the embedded design a visible, styled scrollbar instead of hiding
    // it, so visitors can see there's more below as they scroll (same
    // treatment as the Startup.Ready live-website embed).
    function styleFrameScrollbar(frame) {
      try {
        const doc = frame.contentWindow.document;
        if (doc.getElementById("__scrollbarStyle")) return;
        const style = doc.createElement("style");
        style.id = "__scrollbarStyle";
        style.textContent = "html{scrollbar-width:thin; scrollbar-color:rgba(255,255,255,0.35) transparent;} html::-webkit-scrollbar{width:9px;} html::-webkit-scrollbar-track{background:transparent;} html::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.35); border-radius:8px;} html::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.55);}";
        doc.head.appendChild(style);
      } catch (e) {}
    }
    document.getElementById("siteEmbedFrame").addEventListener("load", () => styleFrameScrollbar(document.getElementById("siteEmbedFrame")));
`
    : ""
}  });
</script>
<script src="../js/project-actions.js"></script>
</body>
</html>
`;
}

let count = 0;
for (const p of PROJECTS) {
  // Some entries (e.g. Startup.Ready, cross-listed here from
  // UIUX_PROJECTS purely so it also shows up in the "Projects" grid) link to
  // a hand-authored showcase page instead of one generated from this
  // template — never overwrite it.
  if (p.noGeneratedPage) continue;
  const outPath = path.join(OUT_DIR, `${p.slug}.html`);
  fs.writeFileSync(outPath, page(p), "utf8");
  count++;
}

console.log(`Generated ${count} project pages in ${OUT_DIR}`);
