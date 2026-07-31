/**
 * Mobile-first responsive audit.
 *
 * Loads every key route at phone / tablet / desktop widths and reports:
 *   - horizontal overflow (the page scrolling sideways)
 *   - the specific elements sticking out past the viewport
 *   - tap targets smaller than the 44px accessibility minimum
 *   - text smaller than 12px
 * Screenshots land in scripts/audit/shots/.
 *
 * Run: node scripts/audit/responsive-audit.mjs
 */
import { chromium } from "/Applications/MAMP/htdocs/FredCMs/node_modules/.pnpm/playwright@1.58.0/node_modules/playwright/index.mjs";
import fs from "fs";
import path from "path";

const BASE = process.env.AUDIT_BASE || "http://localhost:3001";
const OUT = path.join(process.cwd(), "scripts/audit/shots");
fs.mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: "phone", width: 390, height: 844, mobile: true },
  { name: "tablet", width: 768, height: 1024, mobile: true },
  { name: "desktop", width: 1440, height: 900, mobile: false },
];

const ROUTES = process.env.AUDIT_ROUTES
  ? process.env.AUDIT_ROUTES.split(",")
  : [
      "/",
      "/products",
      "/products/natural-envelopes",
      "/products/category/envelopes",
      "/quote",
      "/templates",
      "/services",
      "/services/digital-printing",
      "/finishing",
      "/about",
      "/contact",
      "/blog",
    ];

const PROBE = () => {
  const vw = document.documentElement.clientWidth;
  const describe = (el) => {
    const cls = (el.className || "").toString().replace(/\s+/g, " ").slice(0, 90);
    return `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}${cls ? "." + cls : ""}`;
  };

  const overflowing = [];
  const seen = new Set();
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.right > vw + 1 || r.left < -1) {
      const style = getComputedStyle(el);
      if (style.position === "fixed") continue;
      const key = describe(el);
      if (seen.has(key)) continue;
      seen.add(key);
      overflowing.push({
        el: key,
        left: Math.round(r.left),
        right: Math.round(r.right),
        width: Math.round(r.width),
        overBy: Math.round(Math.max(r.right - vw, -r.left)),
      });
    }
  }

  const smallTargets = [];
  for (const el of document.querySelectorAll("a, button, [role=button], input, select")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (getComputedStyle(el).display === "none") continue;
    if (r.height < 40 || r.width < 24) {
      const label = (el.innerText || el.getAttribute("aria-label") || el.tagName).trim().slice(0, 40);
      smallTargets.push({ el: describe(el).slice(0, 70), label, h: Math.round(r.height), w: Math.round(r.width) });
    }
  }

  const tinyText = [];
  for (const el of document.querySelectorAll("p, span, li, dd, dt, td, label, a")) {
    if (!el.innerText || !el.innerText.trim()) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs && fs < 12) tinyText.push({ el: describe(el).slice(0, 60), size: fs, text: el.innerText.trim().slice(0, 30) });
  }

  return {
    vw,
    scrollWidth: document.documentElement.scrollWidth,
    horizontalOverflow: document.documentElement.scrollWidth > vw + 1,
    overflowing: overflowing.slice(0, 12),
    smallTargets: smallTargets.slice(0, 10),
    tinyText: tinyText.slice(0, 8),
  };
};

const browser = await chromium.launch({ channel: "chrome" });
const report = [];

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
  });
  const page = await context.newPage();

  for (const route of ROUTES) {
    try {
      await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 45000 });
      await page.waitForTimeout(1200);
      const result = await page.evaluate(PROBE);
      const slug = route === "/" ? "home" : route.replace(/\//g, "_").replace(/^_/, "");
      if (vp.name !== "desktop") {
        await page.screenshot({
          path: path.join(OUT, `${vp.name}-${slug}.png`),
          fullPage: false,
        });
      }
      report.push({ viewport: vp.name, route, ...result });
    } catch (err) {
      report.push({ viewport: vp.name, route, error: String(err).slice(0, 160) });
    }
  }
  await context.close();
}

await browser.close();

fs.writeFileSync(
  path.join(process.cwd(), "scripts/audit/responsive-report.json"),
  JSON.stringify(report, null, 2),
);

// Console summary — only what needs attention.
for (const r of report) {
  if (r.error) {
    console.log(`✗ ${r.viewport} ${r.route} — ${r.error}`);
    continue;
  }
  const issues = [];
  if (r.horizontalOverflow) issues.push(`OVERFLOW scrollW=${r.scrollWidth} vw=${r.vw}`);
  if (r.overflowing.length) issues.push(`${r.overflowing.length} elements past edge`);
  if (r.smallTargets.length) issues.push(`${r.smallTargets.length} small tap targets`);
  if (r.tinyText.length) issues.push(`${r.tinyText.length} tiny text`);
  if (issues.length) {
    console.log(`\n● ${r.viewport} ${r.route}: ${issues.join(" | ")}`);
    r.overflowing.slice(0, 4).forEach((o) => console.log(`    ↔ +${o.overBy}px  ${o.el}`));
    r.smallTargets.slice(0, 3).forEach((t) => console.log(`    ⊙ ${t.h}x${t.w}  "${t.label}"  ${t.el}`));
  }
}
console.log("\nreport: scripts/audit/responsive-report.json");
