/*
  Generates portfolio-site/sitemap.xml from js/behance-projects-data.js so it
  always lists every project page. Run alongside generate-project-pages.js
  whenever behance-projects-data.js changes:
    node scripts/generate-sitemap.js
*/

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PROJECTS = require(path.join(ROOT, "js", "behance-projects-data.js"));
const SITE = "https://tanvircreates.com";
const today = new Date().toISOString().slice(0, 10);

const staticUrls = [{ loc: `${SITE}/`, changefreq: "monthly", priority: "1.0" }];

const projectUrls = PROJECTS.map((p) => ({
  loc: `${SITE}/projects/${p.slug}.html`,
  changefreq: "yearly",
  priority: "0.7",
}));

const urls = [...staticUrls, ...projectUrls];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

fs.writeFileSync(path.join(ROOT, "sitemap.xml"), xml, "utf8");
console.log(`Generated sitemap.xml with ${urls.length} URLs`);
