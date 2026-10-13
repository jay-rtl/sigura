# Verification record

Validated with Node 24.18.0, Astro 7.3.8, and installed Chrome 154.0.8037.97.

- Production builds passed at `/` and `/sigura-construction/`.
- TypeScript/Astro diagnostics: no errors or warnings.
- Static audit: 32 HTML pages, 1,263 local references, 107 image elements, required routes, unique titles, metadata, and image alt text passed for both base paths.
- All 31 navigable pages opened directly and passed layout checks at 320, 375, 430, 768, 1024, and 1440px under both base paths: 372 layout checks.
- Mobile menu, Escape, internal navigation, browser Back/Forward, category filters, comparison keyboard control, form errors, email draft, reduced motion, fallback model, real Three.js rendering, and model reinitialization passed.
- Browser console: no errors or warnings in either full audit.
- An additional image and text-bounds check at 320px decoded 34 images across representative routes without failures or clipped text bounds.
- Dependency installation after updates: 0 npm vulnerabilities.
- No push, publishing, deployment, or changes to the original website were performed.

`browser-report-root.json` records the root-hosting run. `browser-report.json` records the repository-path run. `assets-report.json` records the extra image/text check. Screenshots show desktop/mobile home and the actual Three.js scene.

Limits: automated browser testing used Chrome only. No independent Lighthouse score, full assistive-technology review, real mobile device testing, live certification lookup, or email delivery is claimed. The current site is an independent local concept; original portfolio image permissions require confirmation before publishing.
