# Responsive Audit — mobile-first

**Date:** 2026-07-31
**Method:** Playwright driving real viewports (phone 390×844, tablet 768×1024,
desktop 1440×900) with `isMobile`/`hasTouch` and DPR 2, across 12 routes.
Reproduce with `node scripts/audit/responsive-audit.mjs`; screenshots land in
`scripts/audit/shots/`, raw data in `scripts/audit/responsive-report.json`.

This replaces an earlier guess-based pass: the in-browser tooling could not
change the viewport (it stayed pinned at 1824px and media queries never
flipped), so the first attempt was static source analysis only.

---

## Fixed

| Issue | Measured | Fix |
|---|---|---|
| Mobile menu button had no hit area | **24×24px** | 44×44 (`h-11 w-11`) box around the same icon, plus `aria-label` and `aria-expanded`, which were missing entirely |
| Hero slide dots unhittable | **8×8px** / 8×32 | Pill kept visually; wrapped in a 44px-tall touch box (`h-11 px-1.5`) |
| Footer social icons | **36×36px** | 44×44 (`h-11 w-11`) |
| Top-bar phone / email links | **16px tall** | `min-h-11` + `py-1` |
| Consent checkbox | **16×13px** | 20×20 box, label made `cursor-pointer` with padding so the whole row is tappable |
| Hero badge escaped viewport at tablet | **+40px past edge** | `md:-left-16` pushed it 4rem outside its container at 768px; now `md:left-0 md:-bottom-10`, reverting to the offset design at `lg` |
| Trust badges cramped on phone | 3 cols ≈ 110px each | `grid-cols-2 sm:grid-cols-3` |
| Quote review specs | 2 cols, no base | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` |
| Services stat cards, 3 checkmark lists | locked 2 cols | `grid-cols-1 sm:grid-cols-2` |
| At-a-glance divider stole width at tablet | `sm:pl-8` | moved to `lg:` where there is room |
| Tab strip scrolled with no affordance | — | scrollbar hidden cleanly, edge padding so the first/last tab is not clipped |

**No page has horizontal overflow at any of the three widths.**

---

## Known and accepted

- **Category carousel and product tab strip report elements past the viewport.**
  Both live inside horizontal scroll containers (`overflow-x-hidden` /
  `overflow-x-auto`), so the document itself never scrolls sideways. The probe
  measures against the viewport and cannot tell the difference — these are
  correct behaviour, not defects.
- **Inline text links measure 17–20px tall** (breadcrumbs, "Terms of Service",
  "Back to Services"). The 44px minimum is intended for controls, not inline
  prose links; enlarging them would break the text flow. Left as-is
  deliberately.

---

## Not verified

Real-device testing. Everything above is Chromium emulation at DPR 2 — it
catches layout, overflow and hit-target problems, but not iOS Safari quirks
(100vh, momentum scroll, input zoom on focus). Worth one pass on a real phone
before launch.
