/*
  Tanvir Creates — site behavior. Vanilla JS, no dependencies.
  Sections: config, theme, mobile nav, scroll spy, reveal animations,
  hero rotator, marquee, about tabs, work tabs + rendering, testimonials,
  back-to-top, contact form.
*/

/* ---------- Config ----------
   Set FORM_ENDPOINT to a Formspree/Web3Forms endpoint URL to enable
   real form delivery (see README.md). Left empty, the form falls back
   to opening the visitor's email client with the message pre-filled. */
const CONFIG = {
  web3formsAccessKey: "3b52acb0-16a5-4035-88eb-4aea2375db9b",
  contactEmail: "tanvirahamadd66@gmail.com"
};

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMobileNav();
  initScrollSpy();
  initRotator();
  initMarquee();
  initCountUp();
  initAboutTabs();
  initWorkTabs();
  renderBehanceProjects();
  renderUiuxProjects();
  renderFeaturedProjects();
  renderAdditionalProjects();
  renderTestimonials();
  initReveal(); // must run after render*() so dynamically-injected .reveal cards get observed
  initBackToTop();
  initContactForm();
  document.getElementById("year").textContent = new Date().getFullYear();
});

/* ---------- Theme ---------- */
function initTheme() {
  const btn = document.getElementById("themeToggle");
  const root = document.documentElement;

  btn.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
}

/* ---------- Mobile nav ---------- */
function initMobileNav() {
  const menu = document.getElementById("mobileMenu");
  const openBtn = document.getElementById("navToggle");
  const closeBtn = document.getElementById("navClose");

  openBtn.addEventListener("click", () => menu.classList.add("open"));
  closeBtn.addEventListener("click", () => menu.classList.remove("open"));
  menu.querySelectorAll(".mobile-link").forEach((link) => {
    link.addEventListener("click", () => menu.classList.remove("open"));
  });
}

/* ---------- Scroll spy ---------- */
function moveNavIndicator(link) {
  const indicator = document.querySelector(".nav-indicator");
  const nav = document.querySelector(".nav-links");
  if (!indicator || !nav || !link) return;
  const navRect = nav.getBoundingClientRect();
  const linkRect = link.getBoundingClientRect();
  indicator.style.left = linkRect.left - navRect.left + "px";
  indicator.style.width = linkRect.width + "px";
  indicator.classList.add("visible");
}

function initScrollSpy() {
  const links = document.querySelectorAll(".nav-links a");
  const sections = Array.from(links)
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if (!("IntersectionObserver" in window) || sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = "#" + entry.target.id;
          links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === id));
          const activeLink = Array.from(links).find((a) => a.getAttribute("href") === id);
          if (activeLink) moveNavIndicator(activeLink);
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((s) => observer.observe(s));

  window.addEventListener("resize", () => {
    const active = document.querySelector(".nav-links a.active");
    if (active) moveNavIndicator(active);
  });
}

/* ---------- Reveal on scroll ---------- */
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("in-view"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  els.forEach((el) => observer.observe(el));
}

/* ---------- Hero rotator ---------- */
function initRotator() {
  const el = document.getElementById("rotator");
  if (!el) return;
  const words = ["Brand Identities", "Logo Designs", "Visual Systems", "Digital Graphics", "Website Designs"];
  let i = 0;
  setInterval(() => {
    i = (i + 1) % words.length;
    el.style.opacity = 0;
    setTimeout(() => {
      el.textContent = words[i];
      el.style.opacity = 1;
    }, 260);
  }, 2600);
  el.style.transition = "opacity 260ms ease";
}

/* ---------- Marquee ---------- */
function initMarquee() {
  const track = document.getElementById("marqueeTrack");
  if (!track) return;
  const items = [
    "Logo Design", "Brand Identity", "Social Media Design", "Company Profiles",
    "Packaging Design", "Presentation Design", "Print Design", "Email Design",
    "Website Design", "UI/UX Design"
  ];
  const html = items.map((i) => `<span>${i}</span>`).join("");
  track.innerHTML = html + html; // duplicated for seamless loop
}

/* ---------- Stat count-up ----------
   Parses each .stat-num's own text (e.g. "500+", "4.8/5") into a numeric
   target plus any prefix/suffix, then animates 0 → target with an ease-out
   curve once the hero stats row scrolls into view. Runs once per page load. */
function initCountUp() {
  const container = document.querySelector(".hero-stats");
  const els = document.querySelectorAll(".stat-num");
  if (!container || !els.length) return;

  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const parsed = new Map();

  els.forEach((el) => {
    const match = el.textContent.trim().match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
    if (!match) return;
    const [, prefix, numStr, suffix] = match;
    const target = parseFloat(numStr);
    const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
    parsed.set(el, { prefix, suffix, target, decimals });
    if (!reduceMotion) el.textContent = `${prefix}${(0).toFixed(decimals)}${suffix}`;
  });

  if (reduceMotion || !("IntersectionObserver" in window)) return;

  function animate(el) {
    const data = parsed.get(el);
    if (!data) return;
    const { prefix, suffix, target, decimals } = data;
    const duration = 2000;
    const start = performance.now();

    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      el.textContent = `${prefix}${(target * eased).toFixed(decimals)}${suffix}`;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      parsed.forEach((_, el) => animate(el));
      obs.disconnect();
    });
  }, { threshold: 0.3 });

  observer.observe(container);
}

/* ---------- About tabs ---------- */
function initAboutTabs() {
  const tabs = document.querySelectorAll(".about-tab");
  const panels = document.querySelectorAll(".about-panel");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      const target = tab.dataset.tab;
      panels.forEach((p) => p.classList.toggle("active", p.dataset.panel === target));
    });
  });
}

/* ---------- Work tabs ---------- */
function initWorkTabs() {
  const tabs = document.querySelectorAll(".work-tab");
  const panels = document.querySelectorAll(".work-panel");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.dataset.worktab;
      panels.forEach((p) => p.classList.toggle("active", p.dataset.workpanel === target));
      // Live-preview iframes in the newly shown panel load/play on their own
      // once visible — see initLivePreviewLifecycle.
    });
  });
}

/* Renders the embedded site at a real desktop width (so it lays out exactly
   like the full "Live Website Preview" embed — no mobile-breakpoint reflow),
   then scales the whole iframe down with a CSS transform to fit the small
   card. Rescales on card resize since the grid is responsive. */
function initLivePreviewScale(frame, designW, designH) {
  const DESIGN_W = designW || 1280, DESIGN_H = designH || 960;
  frame.style.width = DESIGN_W + "px";
  frame.style.height = DESIGN_H + "px";
  const card = frame.closest(".project-card");
  if (!card) return;

  // On mobile, the browser chrome (address bar) showing/hiding as the page
  // scrolls fires ResizeObserver repeatedly with sub-pixel width changes —
  // reapplying the transform every time made the thumbnail visibly judder.
  // Coalesce bursts with rAF and ignore noise below 1px so the scale only
  // actually updates for a real size change (rotation, breakpoint, etc).
  let lastWidth = 0;
  let lastHeight = 0;
  let rafId = null;
  function applyScale() {
    rafId = null;
    const w = card.clientWidth, h = card.clientHeight;
    if (w <= 0 || h <= 0 || (Math.abs(w - lastWidth) < 1 && Math.abs(h - lastHeight) < 1)) return;
    lastWidth = w;
    lastHeight = h;
    // Scale by whichever axis needs more zoom so the frame always fully
    // covers the card, edge to edge — same as the object-fit: cover crop
    // every other card's plain cover image already gets from the browser
    // (the card's aspect ratio, e.g. 4/3.4, and the design's, e.g. 4/3,
    // rarely match exactly). Keeps card sizes uniform across the grid.
    frame.style.transform = `scale(${Math.max(w / DESIGN_W, h / DESIGN_H)})`;
    frame.style.top = "0";
  }
  function scheduleScale() {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(applyScale);
  }

  applyScale();
  if ("ResizeObserver" in window) {
    new ResizeObserver(scheduleScale).observe(card);
  } else {
    window.addEventListener("resize", scheduleScale);
  }
}

/* Each live preview is a whole website rendered at desktop size and scrolling
   on a loop. Running all of them at once from page load (plus the huge email
   images inside them) exhausted phone memory and crashed the tab. So a frame
   only loads (from data-src) once its card is near the viewport — which also
   covers cards in a hidden tab panel, since display:none never intersects —
   and its showcase loop is paused via postMessage whenever the card is off
   screen (see the showcase script in each projects/*-site/index.html). */
function initLivePreviewLifecycle(frame) {
  const card = frame.closest(".project-card") || frame;
  const targetOrigin = location.origin === "null" ? "*" : location.origin;
  const post = (state) => {
    try { if (frame.contentWindow) frame.contentWindow.postMessage({ showcase: state }, targetOrigin); } catch (e) {}
  };
  const load = () => {
    if (!frame.dataset.src) return;
    frame.src = frame.dataset.src;
    frame.removeAttribute("data-src");
  };
  if (!("IntersectionObserver" in window)) { load(); return; }

  let visible = false;
  new IntersectionObserver((entries) => {
    visible = entries[entries.length - 1].isIntersecting;
    if (visible) load();
    post(visible ? "play" : "pause");
  }, { rootMargin: "200px 0px" }).observe(card);
  // A frame can finish loading after its card has already scrolled away.
  frame.addEventListener("load", () => { if (!visible) post("pause"); });
}

/* ---------- Live-preview posters ----------
   Live previews are whole websites running inside iframes. Even lazy-loaded
   and paused off screen, a few of them at once crashed phone browsers (out of
   memory) and made the Work section lag badly on ordinary PCs. So on every
   device a card with a `livePoster` gets a single pre-rendered screenshot that
   pans top-to-bottom with a CSS transform instead — no iframe, no embedded
   page scripts. The live sites stay one click away on each project page.
   Set to false only to bring the home-page iframes back. */
const LITE_PREVIEWS = true;

// Card images: add a srcset to the card-sized thumbnail from js/card-thumbs.js
// (generated by scripts/generate-card-thumbs.js) so phones decode ~1000px
// images instead of the 1600px originals.
function cardImgAttrs(src) {
  const t = typeof CARD_THUMBS !== "undefined" && CARD_THUMBS[src];
  return t
    ? `src="${src}" srcset="${t[0]} ${t[1]}w, ${src} ${t[2]}w" sizes="(max-width: 900px) 92vw, 420px"`
    : `src="${src}"`;
}

function renderLivePoster(src, alt) {
  // The card-sized version (700-1000px) is plenty for a ~400px card on any screen.
  const t = typeof CARD_THUMBS !== "undefined" && CARD_THUMBS[src];
  if (t) src = t[0];
  return `<div class="card-live-poster"><img src="${src}" alt="${alt}" loading="lazy" decoding="async" /></div>`;
}

// Sets --card-h (so the pan ends exactly at the image's bottom edge) and only
// runs the pan animation while the card is on screen.
function initLivePoster(poster) {
  const card = poster.closest(".project-card") || poster;
  const setH = () => poster.style.setProperty("--card-h", card.clientHeight + "px");
  setH();
  if ("ResizeObserver" in window) new ResizeObserver(setH).observe(card);
  if (!("IntersectionObserver" in window)) { poster.classList.add("is-playing"); return; }
  new IntersectionObserver((entries) => {
    poster.classList.toggle("is-playing", entries[entries.length - 1].isIntersecting);
  }).observe(card);
}

/* ---------- Behance project rendering (real published work) ---------- */
function renderBehanceProjects() {
  const grid = document.getElementById("behanceGrid");
  if (!grid || typeof BEHANCE_PROJECTS === "undefined") return;

  grid.innerHTML = BEHANCE_PROJECTS.map((p) => {
    const containClass = p.coverFit === "contain" ? " contain-cover" : "";
    // A live-preview card's aspect ratio is set to match its design's own
    // (see .has-live-preview in style.css) so the width-fit scale in
    // initLivePreviewScale covers it exactly — no crop, no letterboxing.
    const livePreviewClass = p.livePreview ? " has-live-preview" : "";
    const bgAttr = p.coverBg ? ` style="background:${p.coverBg}"` : "";
    const thumb = renderCardThumb(p);
    return `
    <a class="project-card reveal has-image${containClass}${livePreviewClass}" href="projects/${p.slug}.html" data-category="${p.category}"${bgAttr}>
      ${thumb}
      <div class="card-overlay">
        <div class="tag">${p.category}</div>
        <div class="wordmark">${p.title}</div>
        <span class="view-link">View Project <span class="link-arrow">&rarr;</span></span>
      </div>
    </a>`;
  }).join("");

  // Each live-preview frame carries its own design width/height (a full website like
  // Startup.Ready needs its real desktop width; a narrow email design fits
  // a much smaller frame) via data-design-w/h, set in renderCardThumb.
  grid.querySelectorAll(".card-live-preview").forEach((frame) => {
    const w = Number(frame.dataset.designW) || 640;
    const h = Number(frame.dataset.designH) || 480;
    initLivePreviewScale(frame, w, h);
    initLivePreviewLifecycle(frame);
  });
  grid.querySelectorAll(".card-live-poster").forEach(initLivePoster);

  // Multi-image projects (Dog Jacks, Orange Drink, NeuraHire, Water Supply
  // Logo, etc.) cycle their first few gallery shots as a crossfading
  // thumbnail slideshow instead of sitting on one static cover image. A slide
  // marked "scroll" (see cardSlides in the data) is a tall image that pans
  // top-to-bottom while active instead of just crossfading in.
  grid.querySelectorAll(".project-card").forEach((card) => {
    const slides = card.querySelectorAll(".card-slide");
    if (slides.length > 1) initCardSlideshow(slides, card);
  });

  initCategoryFilters(grid);
}

// Builds a card's thumbnail markup: a live-preview iframe when the project
// has one; an explicit hand-picked `cardSlides` sequence when set (each entry
// `{ src, scroll? }` — `scroll: true` pans the (tall) image top-to-bottom
// instead of just crossfading in); otherwise a single static cover image.
// Cycling is opt-in via `cardSlides` only (not automatic for every
// multi-image gallery) so it can be scoped to specific cards.
function renderCardThumb(p) {
  if (p.livePreview && p.livePoster && LITE_PREVIEWS) {
    return renderLivePoster(p.livePoster, `${p.title} — portfolio project by Tanvir Ahamad`);
  }
  if (p.livePreview) {
    return `<iframe class="card-live-preview" data-src="${p.livePreview}" data-design-w="${p.livePreviewW || 640}" data-design-h="${p.livePreviewH || 480}" tabindex="-1" aria-hidden="true"></iframe>`;
  }
  if (p.cardSlides && p.cardSlides.length > 1) {
    const slideTag = (src, i, scroll) =>
      scroll
        ? `<div class="card-slide card-slide-scroll${i === 0 ? " active" : ""}"><img class="scroll-img" ${cardImgAttrs(src)} alt="${p.title} — portfolio project by Tanvir Ahamad, screen ${i + 1}" loading="lazy" /></div>`
        : `<img class="card-slide${i === 0 ? " active" : ""}" ${cardImgAttrs(src)} alt="${p.title} — portfolio project by Tanvir Ahamad, screen ${i + 1}" loading="lazy" />`;
    return p.cardSlides.map((s, i) => slideTag(s.src, i, s.scroll)).join("");
  }
  return `<img ${cardImgAttrs(p.coverImage || p.gallery[0])} alt="${p.title} — portfolio project by Tanvir Ahamad" loading="lazy" />`;
}

// Cycles through a card's `.card-slide` elements on a timer, looping forever.
// Plain slides crossfade in for a short dwell; a `.card-slide-scroll` slide
// dwells longer and restarts its pan animation each time it becomes active.
// Respects reduced-motion by leaving the first slide showing statically, and
// only ticks while its card is on screen (no timers churning off-screen cards).
function initCardSlideshow(slides, card) {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const DWELL_PLAIN = 2200;
  const DWELL_SCROLL = 6000;
  let idx = 0;
  let timer = null;
  let visible = !("IntersectionObserver" in window);

  function dwellFor(slide) {
    return slide.classList.contains("card-slide-scroll") ? DWELL_SCROLL : DWELL_PLAIN;
  }
  function restartScrollAnim(slide) {
    const img = slide.querySelector(".scroll-img");
    if (!img) return;
    img.style.animation = "none";
    void img.offsetWidth; // force reflow so the animation restarts from 0%
    img.style.animation = "";
  }

  function step() {
    slides[idx].classList.remove("active");
    idx = (idx + 1) % slides.length;
    const next = slides[idx];
    next.classList.add("active");
    if (next.classList.contains("card-slide-scroll")) restartScrollAnim(next);
    schedule();
  }
  function schedule() {
    clearTimeout(timer);
    timer = visible ? setTimeout(step, dwellFor(slides[idx])) : null;
  }

  if (visible) { schedule(); return; }
  new IntersectionObserver((entries) => {
    const nowVisible = entries[entries.length - 1].isIntersecting;
    if (nowVisible === visible) return;
    visible = nowVisible;
    schedule();
  }, { rootMargin: "100px 0px" }).observe(card);
}

function initCategoryFilters(grid) {
  const wrap = document.getElementById("categoryFilters");
  if (!wrap || typeof BEHANCE_PROJECTS === "undefined") return;

  const categories = ["All", ...new Set(BEHANCE_PROJECTS.map((p) => p.category))];
  wrap.innerHTML = categories
    .map((c, i) => `<button class="category-filter-btn${i === 0 ? " active" : ""}" data-filter="${c}">${c}</button>`)
    .join("");

  const cards = grid.querySelectorAll(".project-card");
  wrap.querySelectorAll(".category-filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      wrap.querySelectorAll(".category-filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      cards.forEach((card) => {
        card.hidden = !(filter === "All" || card.dataset.category === filter);
      });
    });
  });
}

/* ---------- UI/UX client projects (full live-website case studies) ---------- */
function renderUiuxProjects() {
  const grid = document.getElementById("uiuxGrid");
  if (!grid || typeof UIUX_PROJECTS === "undefined") return;

  grid.innerHTML = UIUX_PROJECTS.map((p) => {
    const thumb = p.livePreview && p.livePoster && LITE_PREVIEWS
      ? renderLivePoster(p.livePoster, `${p.name} — ${p.category} by Tanvir Ahamad`)
      : p.livePreview
      ? `<iframe class="card-live-preview" data-src="${p.livePreview}" tabindex="-1" aria-hidden="true"></iframe>`
      : `<img ${cardImgAttrs(p.image)} alt="${p.name} — ${p.category} by Tanvir Ahamad" loading="lazy" />`;
    return `
      <a class="project-card reveal has-image" href="${p.link}">
        ${thumb}
        <div class="card-overlay">
          <div class="tag">${p.category}</div>
          <div class="wordmark">${p.name}</div>
          <span class="view-link">View Project <span class="link-arrow">&rarr;</span></span>
        </div>
      </a>`;
  }).join("");

  grid.querySelectorAll(".card-live-preview").forEach((frame) => {
    initLivePreviewScale(frame);
    initLivePreviewLifecycle(frame);
  });
  grid.querySelectorAll(".card-live-poster").forEach(initLivePoster);
}

/* ---------- Project rendering ---------- */
function renderFeaturedProjects() {
  const grid = document.getElementById("featuredGrid");
  if (!grid || typeof FEATURED_PROJECTS === "undefined") return;

  grid.innerHTML = FEATURED_PROJECTS.map((p) => {
    const hasImage = Boolean(p.image);
    const linkHtml = p.link
      ? `<span class="view-link">View Case Study <span class="link-arrow">&rarr;</span></span>`
      : "";
    const tag = p.category || "Brand &amp; Visual Identity";
    const desc = p.description ? `<div class="tag">${p.description}</div>` : `<div class="tag">${tag}</div>`;
    const tagName = p.link ? "a" : "div";
    const linkAttrs = p.link ? ` href="${p.link}"` : "";
    const containClass = p.coverFit === "contain" ? " contain-cover" : "";
    const bgAttr = p.coverBg ? ` style="background:${p.coverBg}"` : "";

    return `
      <${tagName} class="project-card reveal${hasImage ? " has-image" : ""}${containClass}"${linkAttrs}${bgAttr}>
        ${hasImage ? `<img ${cardImgAttrs(p.image)} alt="${p.name} — ${tag} by Tanvir Ahamad" loading="lazy" />` : ""}
        <div class="card-overlay">
          ${desc}
          <div class="wordmark">${p.name}</div>
          ${linkHtml}
        </div>
      </${tagName}>`;
  }).join("");
}

function renderAdditionalProjects() {
  const grid = document.getElementById("additionalGrid");
  if (!grid || typeof ADDITIONAL_PROJECTS === "undefined") return;

  grid.innerHTML = ADDITIONAL_PROJECTS.map((p) => `<div class="mini-card reveal">${p.name}</div>`).join("");
}

/* ---------- Testimonials ---------- */
function renderTestimonials() {
  const area = document.getElementById("testimonialArea");
  if (!area) return;

  if (typeof TESTIMONIALS === "undefined" || TESTIMONIALS.length === 0) {
    area.innerHTML = `
      <div class="testimonial-empty">
        <p>Client testimonials are coming soon. Reviews from completed projects will appear here.</p>
      </div>`;
    return;
  }

  area.innerHTML = `<div class="testimonial-grid">${TESTIMONIALS.map((t) => `
    <div class="testimonial-card reveal">
      <div class="testimonial-stars" aria-label="${t.rating || 5} out of 5 stars">${renderStars(t.rating || 5)}</div>
      <p class="quote">${t.quote}</p>
      <div class="testimonial-footer">
        <div class="author">${t.author}</div>
        ${t.role ? `<div class="role">${t.role}</div>` : ""}
      </div>
    </div>`).join("")}</div>`;
}

function renderStars(count) {
  return Array.from({ length: 5 }, (_, i) =>
    `<span class="star${i < count ? " filled" : ""}">&#9733;</span>`
  ).join("");
}

/* ---------- Back to top ---------- */
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 600);
  });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ---------- Contact form ---------- */
function showToast(type, title, message) {
  const toast = document.getElementById("formToast");
  if (!toast) return;
  const icon = document.getElementById("toastIcon");
  const titleEl = document.getElementById("toastTitle");
  const messageEl = document.getElementById("toastMessage");

  toast.classList.remove("success", "error");
  toast.classList.add(type);
  icon.textContent = type === "success" ? "✓" : "!";
  titleEl.textContent = title;
  messageEl.textContent = message;
  toast.classList.add("visible");

  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove("visible"), 6000);
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const toast = document.getElementById("formToast");
  const toastClose = document.getElementById("toastClose");
  if (toastClose) toastClose.addEventListener("click", () => toast.classList.remove("visible"));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const projectType = form.projectType.value;
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      showToast("error", "Missing information", "Please fill in your name, email and project details.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("error", "Invalid email", "Please enter a valid email address so I can reply to you.");
      return;
    }

    const submitBtn = form.querySelector("button[type=submit]");
    submitBtn.classList.add("is-loading");
    submitBtn.disabled = true;

    try {
      // Sent as FormData (not JSON) so the request stays a CORS "simple request" —
      // a JSON content-type here triggers a preflight that Web3Forms doesn't answer,
      // which silently fails every submission in the browser.
      const formData = new FormData();
      formData.append("access_key", CONFIG.web3formsAccessKey);
      formData.append("subject", `New project inquiry: ${projectType}`);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("Project Type", projectType);
      formData.append("message", message);

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || "Request failed");

      showToast("success", "Message sent!", "Thanks for reaching out — I'll reply within 24 hours.");
      form.reset();
    } catch (err) {
      showToast(
        "error",
        "Something went wrong",
        "Your message couldn't be delivered. Please try again, or reach me directly via WhatsApp or email below."
      );
    } finally {
      submitBtn.classList.remove("is-loading");
      submitBtn.disabled = false;
    }
  });
}
