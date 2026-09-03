/*
  UI/UX client projects — full website design case studies (as opposed to the
  static Behance gallery posts above). Each entry links to a hand-authored
  showcase page in /projects/ that embeds the live, fully interactive site
  via iframe, so visitors can scroll, click, and see the real animations —
  not just a screenshot.

  To add a new one: drop the finished site's index.html into
  projects/<slug>-site/index.html (self-contained, no external deps), add a
  cover image to assets/img/projects/, then add an entry below and write a
  showcase page projects/<slug>.html (copy an existing one as a template).
*/

const UIUX_PROJECTS = [
  {
    slug: "startup-ready-website-design",
    name: "Startup.Ready",
    category: "Website Design (UI/UX)",
    image: "assets/img/projects/startup-ready-cover.jpg",
    // When present, the card's thumbnail is a live, auto-scrolling iframe of
    // the real site instead of a static image (the ?showcase=1 flag runs the
    // site's own short scroll-loop script — see startup-ready-site/index.html).
    livePreview: "projects/startup-ready-site/index.html?showcase=1",
    description: "Full website design and build for Startup.Ready — a startup-readiness assessment platform. Complete multi-section site with custom illustrations, animated scoring rings, and interaction design.",
    link: "projects/startup-ready-website-design.html"
  }
];
