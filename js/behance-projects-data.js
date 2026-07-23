/*
  Real published Behance projects — sourced from behance.net/itztvr.
  Images live in assets/img/projects/behance/<slug>/. Paths here are
  relative to the SITE ROOT (as used by index.html); the page generator
  script (scripts/generate-project-pages.js) prefixes "../" automatically
  when building the standalone /projects/<slug>.html pages.

  Some galleries on Behance contain more images than shown here — capped
  at 10 per project to keep page weight reasonable. `totalOnBehance` records
  the real count; the generated project page links back to the full
  Behance case study.

  To add a newly published Behance project: add an object below (download
  its images into assets/img/projects/behance/<new-slug>/ first), then
  re-run: node scripts/generate-project-pages.js
*/

const BEHANCE_PROJECTS = [
  {
    slug: "dog-jacks-brand-identity",
    title: "Dog Jacks — Brand Identity & Style Guide",
    category: "Brand Identity",
    shortDescription: "Complete brand identity and style guide for Dog Jacks, a premium dog-care brand.",
    description: "DOG JACKS is a premium dog-care brand focused on providing complete solutions for dogs under one roof. The identity system includes a logo with an integrated paw icon, a color palette of deep green (#0F4C38) and orange (#E77817), and typography guidelines built around Acumin Variable Concept — extended across packaging, billboards, merchandise, outdoor flags, mobile interface, stickers and lanyards for a consistent brand experience.",
    tags: ["Brand Identity", "Brand Style Guide", "Logo Design", "Pet Branding", "Visual Identity"],
    behanceUrl: "https://www.behance.net/gallery/243866957/Dog-Jacks-Brand-And-Brand-Style-Guide-Full-Branding",
    totalOnBehance: 12,
    gallery: [
      "assets/img/projects/behance/dog-jacks-brand-identity/01.webp",
      "assets/img/projects/behance/dog-jacks-brand-identity/02.webp",
      "assets/img/projects/behance/dog-jacks-brand-identity/03.webp",
      "assets/img/projects/behance/dog-jacks-brand-identity/04.webp",
      "assets/img/projects/behance/dog-jacks-brand-identity/05.webp",
      "assets/img/projects/behance/dog-jacks-brand-identity/06.webp",
      "assets/img/projects/behance/dog-jacks-brand-identity/07.webp",
      "assets/img/projects/behance/dog-jacks-brand-identity/08.webp",
      "assets/img/projects/behance/dog-jacks-brand-identity/09.webp",
      "assets/img/projects/behance/dog-jacks-brand-identity/10.webp"
    ]
  },
  {
    slug: "neurahire-logo-design",
    title: "NeuraHire — Logo Design",
    category: "Logo Design",
    shortDescription: "Full brand identity system for NeuraHire, an AI-driven recruitment platform.",
    description: "NeuraHire is a modern, technology-driven recruitment brand that leverages Artificial Intelligence to make hiring smarter, fairer and faster. The mark combines a brain icon symbolizing neural networks with curved abstract shapes representing connection and balance, using a palette of cyan, violet-blue and deep navy to convey creativity, intelligence and professionalism. Tagline: \"Intelligence with Integrity.\" The system extends across stationery, signage, apparel, packaging and digital touchpoints for a consistent brand presence everywhere it appears.",
    tags: ["AI Branding", "Logo Design", "Brand Identity", "Visual Identity", "Brand Guidelines"],
    behanceUrl: "https://www.behance.net/gallery/237796361/NeuraHire-Logo-Design",
    totalOnBehance: 27,
    gallery: [
      "assets/img/projects/behance/neurahire-logo-design/29.jpg",
      "assets/img/projects/behance/neurahire-logo-design/26.jpg",
      "assets/img/projects/behance/neurahire-logo-design/28.jpg",
      "assets/img/projects/behance/neurahire-logo-design/01.jpg",
      "assets/img/projects/behance/neurahire-logo-design/03.jpg",
      "assets/img/projects/behance/neurahire-logo-design/04.jpg",
      "assets/img/projects/behance/neurahire-logo-design/05.jpg",
      "assets/img/projects/behance/neurahire-logo-design/06.jpg",
      "assets/img/projects/behance/neurahire-logo-design/07.jpg",
      "assets/img/projects/behance/neurahire-logo-design/08.jpg",
      "assets/img/projects/behance/neurahire-logo-design/09.jpg",
      "assets/img/projects/behance/neurahire-logo-design/10.jpg",
      "assets/img/projects/behance/neurahire-logo-design/11.jpg",
      "assets/img/projects/behance/neurahire-logo-design/12.jpg",
      "assets/img/projects/behance/neurahire-logo-design/13.jpg",
      "assets/img/projects/behance/neurahire-logo-design/14.jpg",
      "assets/img/projects/behance/neurahire-logo-design/15.jpg",
      "assets/img/projects/behance/neurahire-logo-design/16.jpg",
      "assets/img/projects/behance/neurahire-logo-design/17.jpg",
      "assets/img/projects/behance/neurahire-logo-design/18.jpg",
      "assets/img/projects/behance/neurahire-logo-design/19.jpg",
      "assets/img/projects/behance/neurahire-logo-design/20.jpg",
      "assets/img/projects/behance/neurahire-logo-design/21.jpg",
      "assets/img/projects/behance/neurahire-logo-design/22.jpg",
      "assets/img/projects/behance/neurahire-logo-design/23.jpg",
      "assets/img/projects/behance/neurahire-logo-design/24.jpg",
      "assets/img/projects/behance/neurahire-logo-design/25.jpg"
    ]
  },
  {
    slug: "sarl-logo-design",
    title: "SARL — Sleek And Revolutionary Look",
    category: "Logo Design",
    shortDescription: "Geometric monogram logo design for the SARL brand identity.",
    description: "SARL — Sleek And Revolutionary Look. The concept merges the letters S, A, R and L into a unified monogram through geometric construction, with a gradient transitioning from red to pink symbolizing energy, creativity and the courage to evolve. Bold sans-serif typography carries the wordmark and tagline, built around a design philosophy of clarity, innovation and movement.",
    tags: ["Logo Design", "Branding", "Visual Identity", "Modern Abstract Logo"],
    behanceUrl: "https://www.behance.net/gallery/229002781/Geometric-Gradient-Logo-for-Branding-Excellence",
    totalOnBehance: 7,
    gallery: [
      "assets/img/projects/behance/sarl-logo-design/01.webp",
      "assets/img/projects/behance/sarl-logo-design/02.webp",
      "assets/img/projects/behance/sarl-logo-design/03.webp",
      "assets/img/projects/behance/sarl-logo-design/04.webp",
      "assets/img/projects/behance/sarl-logo-design/05.webp",
      "assets/img/projects/behance/sarl-logo-design/06.webp",
      "assets/img/projects/behance/sarl-logo-design/07.webp"
    ]
  },
  {
    slug: "dogford-email-design",
    title: "Dogford — Premium Dog Food Email Design",
    category: "Email Design",
    shortDescription: "Email newsletter design for Dogford, a premium dog food brand.",
    description: "A newsletter design created for Dogford, a premium dog food brand under Petsplay, introducing a new product line to dog owners in a visually engaging and informative way. The design follows a clean, nature-inspired style using green tones to represent freshness, health and natural ingredients — with sections for header branding, product display with pricing, feature benefits (Natural Ingredients, Vet Approved, Improves Coat & Energy), customer testimonials and a social engagement footer.",
    tags: ["Email Design", "Newsletter Design", "Pet Branding", "Brand Identity"],
    behanceUrl: "https://www.behance.net/gallery/237265839/EmailDesign-Dogford-Premium-Dog-Food",
    totalOnBehance: 1,
    gallery: [
      "assets/img/projects/behance/dogford-email-design/01.webp"
    ]
  },
  {
    slug: "headphone-social-media-post-design",
    title: "Headphone Social Media Post Design",
    category: "Social Media Design",
    shortDescription: "Social media post design promoting premium headphones.",
    description: "A modern social media post design concept created for promoting premium headphones, focused on minimal aesthetics, a clean layout and professional product presentation that highlights the product's features while keeping the brand identity strong.",
    tags: ["Social Media Design", "Product Design", "Ads Design", "Brand Identity"],
    behanceUrl: "https://www.behance.net/gallery/233947253/headphone-social-media-post-design",
    totalOnBehance: 2,
    gallery: [
      "assets/img/projects/behance/headphone-social-media-post-design/01.webp",
      "assets/img/projects/behance/headphone-social-media-post-design/02.webp"
    ]
  },
  {
    slug: "orange-drink-social-media-post-design",
    title: "Orange Drink Social Media Post Design",
    category: "Social Media Design",
    shortDescription: "Vibrant social media post design for an orange drink brand.",
    description: "A social media post design created for an orange drink brand, built around bold color and a clean layout for marketing and brand-awareness campaigns.",
    tags: ["Social Media Design", "Marketing", "Brand Identity", "Banner Design"],
    behanceUrl: "https://www.behance.net/gallery/225594033/Orange-Drink-Social-Media-Post-Design",
    totalOnBehance: 2,
    gallery: [
      "assets/img/projects/behance/orange-drink-social-media-post-design/01.webp",
      "assets/img/projects/behance/orange-drink-social-media-post-design/02.webp"
    ]
  },
  {
    slug: "body-lotion-social-media-post-design",
    title: "Body Lotion Social Media Post Design",
    category: "Social Media Design",
    shortDescription: "Social media marketing post design for a body lotion brand.",
    description: "A marketing-focused social media post design created for a body lotion brand, aimed at clean product presentation and consistent brand visuals.",
    tags: ["Social Media Design", "Marketing Design", "Brand Identity"],
    behanceUrl: "https://www.behance.net/gallery/220750475/body-lotion-marketing-social-media-post-design",
    totalOnBehance: 1,
    gallery: [
      "assets/img/projects/behance/body-lotion-social-media-post-design/01.webp"
    ]
  },
  {
    slug: "creative-nature-logo-design",
    title: "Creative Nature Logo Design",
    category: "Logo Design",
    shortDescription: "Nature-inspired logo design exploring organic shapes and brand identity.",
    description: "A nature-themed logo design exploring organic forms and a clean logotype, developed as part of a broader brand identity exploration.",
    tags: ["Logo Design", "Nature Branding", "Brand Identity", "Logotype"],
    behanceUrl: "https://www.behance.net/gallery/213582633/Creative-Nature-Logo-Design-",
    totalOnBehance: 11,
    gallery: [
      "assets/img/projects/behance/creative-nature-logo-design/01.webp",
      "assets/img/projects/behance/creative-nature-logo-design/02.webp",
      "assets/img/projects/behance/creative-nature-logo-design/03.webp",
      "assets/img/projects/behance/creative-nature-logo-design/04.webp",
      "assets/img/projects/behance/creative-nature-logo-design/05.webp",
      "assets/img/projects/behance/creative-nature-logo-design/06.webp",
      "assets/img/projects/behance/creative-nature-logo-design/07.webp",
      "assets/img/projects/behance/creative-nature-logo-design/08.webp",
      "assets/img/projects/behance/creative-nature-logo-design/09.webp",
      "assets/img/projects/behance/creative-nature-logo-design/10.webp"
    ]
  },
  {
    slug: "creative-solar-logo-design",
    title: "Creative Solar Logo Design",
    category: "Logo Design",
    shortDescription: "Modern logo concept for a solar energy brand.",
    description: "A modern, minimalist logo concept designed for a solar energy company, developed through an extensive set of exploration and presentation mockups.",
    tags: ["Logo Design", "Company Branding", "Brand Design", "Minimalist Logo"],
    behanceUrl: "https://www.behance.net/gallery/212158533/Creative-solar-logo-design",
    totalOnBehance: 23,
    gallery: [
      "assets/img/projects/behance/creative-solar-logo-design/01.webp",
      "assets/img/projects/behance/creative-solar-logo-design/02.webp",
      "assets/img/projects/behance/creative-solar-logo-design/03.webp",
      "assets/img/projects/behance/creative-solar-logo-design/04.webp",
      "assets/img/projects/behance/creative-solar-logo-design/05.webp",
      "assets/img/projects/behance/creative-solar-logo-design/06.webp",
      "assets/img/projects/behance/creative-solar-logo-design/07.webp",
      "assets/img/projects/behance/creative-solar-logo-design/08.webp",
      "assets/img/projects/behance/creative-solar-logo-design/09.webp",
      "assets/img/projects/behance/creative-solar-logo-design/10.webp"
    ]
  },
  {
    slug: "creative-2-brain-podcast-logo-design",
    title: "Creative 2 Brain Podcast Logo Design",
    category: "Logo Design",
    shortDescription: "Logo design for the \"2 Brain\" podcast brand.",
    description: "A creative logo design for the \"2 Brain\" podcast, developed as a company/brand mark with a modern, minimalist approach.",
    tags: ["Logo Design", "Podcast Branding", "Company Branding", "Minimalist Logo"],
    behanceUrl: "https://www.behance.net/gallery/212336855/Creative-2-Brain-podcast-logo-design",
    totalOnBehance: 16,
    gallery: [
      "assets/img/projects/behance/creative-2-brain-podcast-logo-design/01.webp",
      "assets/img/projects/behance/creative-2-brain-podcast-logo-design/02.webp",
      "assets/img/projects/behance/creative-2-brain-podcast-logo-design/03.webp",
      "assets/img/projects/behance/creative-2-brain-podcast-logo-design/04.webp",
      "assets/img/projects/behance/creative-2-brain-podcast-logo-design/05.webp",
      "assets/img/projects/behance/creative-2-brain-podcast-logo-design/06.webp",
      "assets/img/projects/behance/creative-2-brain-podcast-logo-design/07.webp",
      "assets/img/projects/behance/creative-2-brain-podcast-logo-design/08.webp",
      "assets/img/projects/behance/creative-2-brain-podcast-logo-design/09.webp",
      "assets/img/projects/behance/creative-2-brain-podcast-logo-design/10.webp"
    ]
  },
  {
    slug: "water-supply-logo",
    title: "Water Supply Logo",
    category: "Logo Design",
    shortDescription: "Minimalist logo design for a water supply company.",
    description: "A minimalist logo design created for a water supply company, focused on clean typography and a simple, memorable mark.",
    tags: ["Logo Design", "Brand Identity", "Minimalist Logo", "Typography"],
    behanceUrl: "https://www.behance.net/gallery/211656905/Water-supply-logo",
    totalOnBehance: 2,
    gallery: [
      "assets/img/projects/behance/water-supply-logo/01.webp",
      "assets/img/projects/behance/water-supply-logo/02.webp"
    ]
  },
  {
    slug: "nutrition-logo-design",
    title: "Nutrition Logo Design",
    category: "Logo Design",
    shortDescription: "Minimalist logo design for a nutrition and healthy food brand.",
    description: "A minimalist, modern logo design created for a nutrition and healthy food brand, focused on a clean logotype and simple iconography.",
    tags: ["Logo Design", "Healthy Food Branding", "Brand Identity", "Logotype"],
    behanceUrl: "https://www.behance.net/gallery/211869289/Nutrition-Logo-Design",
    totalOnBehance: 2,
    gallery: [
      "assets/img/projects/behance/nutrition-logo-design/01.jpg",
      "assets/img/projects/behance/nutrition-logo-design/02.jpg"
    ]
  }
];

// Node-readable export for scripts/generate-project-pages.js; harmless in the browser.
if (typeof module !== "undefined") module.exports = BEHANCE_PROJECTS;
