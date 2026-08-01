/*
  Project data — edit this file to update the work shown on the site.
  No HTML/CSS knowledge needed: just fill in the fields below.

  For each project:
    name        - client/project name
    slug        - lowercase, no spaces, used for internal keys only
    category    - e.g. "Brand Identity", "Logo Design", "Social Media" (leave "" if unknown)
    image       - path to an image in assets/img/projects/, e.g. "assets/img/projects/passelterra-cover.jpg"
                  Leave "" to show the elegant typographic placeholder card instead.
    description - one or two sentences about the project. Leave "" to omit.
    link        - URL to a live case study / Behance link. Leave "" to omit the link.

  Nothing breaks if fields are left empty — the layout adapts automatically.
*/

const FEATURED_PROJECTS = [
  { name: "Cliqpiq",      slug: "cliqpiq",      category: "Brand Identity", image: "assets/img/projects/behance/cliqpiq-brand-identity/cover.jpg", description: "Bold, tech-forward brand identity for Cliqpiq, a smart camera app.", link: "projects/cliqpiq-brand-identity.html", coverFit: "contain", coverBg: "#153FB7" },
  { name: "Skugistics",   slug: "skugistics",   category: "Brand Identity", image: "assets/img/projects/behance/skugistics-brand-identity/cover.jpg", description: "Enterprise logistics brand identity for Skugistics, a smart logistics platform.", link: "projects/skugistics-brand-identity.html", coverFit: "contain", coverBg: "#01081a" },
  { name: "StewardsHQ",   slug: "stewardshq",   category: "Brand Identity", image: "assets/img/projects/behance/stewardshq-brand-identity/cover.jpg", description: "Smart parcel management brand identity for StewardsHQ, built for residential buildings.", link: "projects/stewardshq-brand-identity.html", coverFit: "contain", coverBg: "#ffffff" },
  { name: "PasselTerra",  slug: "passelterra",  category: "Brand Identity", image: "assets/img/projects/behance/passelterra-brand-identity/cover.jpg", description: "Warm, trustworthy brand identity for PasselTerra, a land-for-sale platform.", link: "projects/passelterra-brand-identity.html", coverFit: "contain", coverBg: "#ffffff" },
  { name: "Prune",        slug: "prune",        category: "Brand Identity", image: "assets/img/projects/behance/prune-brand-identity/cover.jpg", description: "Warm, editorial brand identity built around a hand-drawn plum mark.", link: "projects/prune-brand-identity.html", coverFit: "contain", coverBg: "#ffffff" },
  { name: "TicketBliss",  slug: "ticketbliss",  category: "Brand Identity", image: "assets/img/projects/behance/ticketbliss-brand-identity/cover.jpg", description: "Trustworthy, guardian-themed brand identity for TicketBliss, a ticket resale platform.", link: "projects/ticketbliss-brand-identity.html", coverFit: "contain", coverBg: "#ffffff" },
  { name: "AMÉ",          slug: "ame",          category: "Brand Identity", image: "assets/img/projects/behance/ame-brand-identity/cover.jpg", description: "Ornate, regal brand identity for AMÉ, a luxury fashion house.", link: "projects/ame-brand-identity.html", coverFit: "contain", coverBg: "#f6f3ee" },
  { name: "Hirearchical", slug: "hirearchical", category: "Brand Identity", image: "assets/img/projects/behance/hirearchical-brand-identity/cover.jpg", description: "Fairness-first brand identity for Hirearchical, an AI-driven recruiting intelligence platform.", link: "projects/hirearchical-brand-identity.html", coverFit: "contain", coverBg: "#ffffff" }
];

const ADDITIONAL_PROJECTS = [
  "NovaCore", "BluePeak", "ZenithWorks", "BrightNest", "UrbanPulse", "PixelCraft",
  "SkyBridge", "VertexOne", "PrimeVista", "ElevateHub", "NextOrbi", "AlphaSpark",
  "VisionGrid", "GreenAxis", "SilverEdge", "QuantumNest", "TrueWave", "ApexFlow",
  "BoldFusion", "CoreLogic Labs", "MetroHive", "FusionPoint", "CrystalPeak", "Ame"
].map((name) => ({ name, slug: name.toLowerCase().replace(/\s+/g, "-") }));

/*
  Testimonials — real client feedback (paraphrased/reconstructed from Fiverr,
  WhatsApp and email). Add more objects here as new reviews come in; the
  section renders automatically from this array (falls back to a "coming
  soon" empty state if it's ever emptied out).
*/
const TESTIMONIALS = [
  {
    quote: "Tanvir was incredibly easy to work with. He understood my vision from the beginning and delivered a clean, modern logo that exceeded my expectations. Communication was excellent throughout the project.",
    author: "Rohan",
    rating: 5
  },
  {
    quote: "Amazing attention to detail! The branding package looked professional and perfectly matched our company's identity. I would definitely work with Tanvir again.",
    author: "Sarah Mitchell",
    rating: 5
  },
  {
    quote: "Fast delivery, great communication, and high-quality work. Every revision was handled quickly, and the final design was exactly what I was looking for.",
    author: "Daniel Carter",
    rating: 5
  },
  {
    quote: "Very creative designer with a great eye for aesthetics. The final result was modern, minimal, and polished. Highly recommended for branding projects.",
    author: "Emily Johnson",
    rating: 5
  },
  {
    quote: "Professional from start to finish. Tanvir listened carefully to every requirement and delivered a premium design that helped elevate our brand.",
    author: "Ahmed Hassan",
    rating: 5
  },
  {
    quote: "One of the best freelance designers I've worked with. Responsive, talented, and committed to delivering excellent results. Looking forward to future collaborations.",
    author: "Lucas Martin",
    rating: 5
  }
];
