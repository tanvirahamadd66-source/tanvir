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
  formEndpoint: "",
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
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((s) => observer.observe(s));
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
  const words = ["Brand Identities", "Logo Designs", "Visual Systems", "Digital Graphics"];
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
    "Packaging Design", "Presentation Design", "Print Design", "Email Design"
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
    });
  });
}

/* ---------- Behance project rendering (real published work) ---------- */
function renderBehanceProjects() {
  const grid = document.getElementById("behanceGrid");
  if (!grid || typeof BEHANCE_PROJECTS === "undefined") return;

  grid.innerHTML = BEHANCE_PROJECTS.map((p) => `
    <a class="project-card reveal has-image" href="projects/${p.slug}.html" data-category="${p.category}">
      <img src="${p.gallery[0]}" alt="${p.title} — cover image" loading="lazy" />
      <div class="card-overlay">
        <div class="tag">${p.category}</div>
        <div class="wordmark">${p.title}</div>
        <span class="view-link">View Project <span class="link-arrow">&rarr;</span></span>
      </div>
    </a>`).join("");

  initCategoryFilters(grid);
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

/* ---------- Project rendering ---------- */
function renderFeaturedProjects() {
  const grid = document.getElementById("featuredGrid");
  if (!grid || typeof FEATURED_PROJECTS === "undefined") return;

  grid.innerHTML = FEATURED_PROJECTS.map((p) => {
    const hasImage = Boolean(p.image);
    const linkHtml = p.link
      ? `<a class="view-link" href="${p.link}" target="_blank" rel="noopener noreferrer">View Case Study <span class="link-arrow">&rarr;</span></a>`
      : "";
    const tag = p.category || "Brand &amp; Visual Identity";
    const desc = p.description ? `<div class="tag">${p.description}</div>` : `<div class="tag">${tag}</div>`;

    return `
      <div class="project-card reveal${hasImage ? " has-image" : ""}">
        ${hasImage ? `<img src="${p.image}" alt="${p.name} project preview" loading="lazy" />` : ""}
        <div class="card-overlay">
          ${desc}
          <div class="wordmark">${p.name}</div>
          ${linkHtml}
        </div>
      </div>`;
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
function initContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const projectType = form.projectType.value;
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      status.textContent = "⚠ Please fill in your name, email and project details.";
      return;
    }

    const submitBtn = form.querySelector("button[type=submit]");
    submitBtn.disabled = true;
    status.textContent = "Sending...";

    if (CONFIG.formEndpoint) {
      try {
        const res = await fetch(CONFIG.formEndpoint, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, projectType, message })
        });
        if (!res.ok) throw new Error("Request failed");
        status.textContent = "✓ Thanks! Your message has been sent — I'll reply within 24 hours.";
        form.reset();
      } catch (err) {
        status.textContent = "⚠ Something went wrong. Please email me directly or use WhatsApp below.";
      } finally {
        submitBtn.disabled = false;
      }
      return;
    }

    // No form backend configured yet — fall back to opening the visitor's email client.
    const subject = encodeURIComponent(`New project inquiry: ${projectType}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nProject Type: ${projectType}\n\n${message}`);
    window.location.href = `mailto:${CONFIG.contactEmail}?subject=${subject}&body=${body}`;
    status.textContent = "Opening your email app to send this message...";
    submitBtn.disabled = false;
  });
}
