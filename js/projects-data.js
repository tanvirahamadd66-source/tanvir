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
  { name: "PasselTerra",  slug: "passelterra",  category: "", image: "", description: "", link: "" },
  { name: "Prune",        slug: "prune",        category: "", image: "", description: "", link: "" },
  { name: "Skugistics",   slug: "skugistics",   category: "", image: "", description: "", link: "" },
  { name: "StewardsHQ",   slug: "stewardshq",   category: "", image: "", description: "", link: "" },
  { name: "TicketBliss",  slug: "ticketbliss",  category: "", image: "", description: "", link: "" },
  { name: "Cliqpiq",      slug: "cliqpiq",      category: "", image: "", description: "", link: "" },
  { name: "BrightScale",  slug: "brightscale",  category: "", image: "", description: "", link: "" },
  { name: "Hirearchical", slug: "hirearchical", category: "", image: "", description: "", link: "" }
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
