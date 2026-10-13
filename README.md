# Sigura Construction — independent architectural redesign

A complete static Astro website built in this directory. No original-site navigation, embeds, redirects, API keys, paid services, or live submission endpoint. Deployment target: https://jay-rtl.github.io/sigura/ (repository: jay-rtl/sigura).

## Preview locally

Requires Node.js 22.12+ (Node 24 used for validation).

```powershell
npm ci
npm run dev
```

Open the Local URL printed by Astro. If a port is already occupied, Astro selects another. For the production output:

```powershell
npm run build
npm test
npm run preview
```

## Completed pages

- Home, About, Services, Projects, Before & After, Process, Reviews, Awards, Service Areas, Journal, Contact, Privacy, and a custom 404.
- Ten individual services: custom homes, home remodeling (including kitchens and bathrooms), ADUs, home additions, outdoor living, pools & spas, restoration, insurance negotiation, 3D design, commercial construction.
- Six project stories: Gloria / Menlo Park, Eagle Drive / Sunnyvale, Ralph Lee / Morgan Hill, Englewood / West San Jose, Atherton landscape, Caesarstone showroom / San Leandro.
- Three original journal articles with individual routes. These are explicitly identified as editorial written for the concept, rather than company-authored posts.

Astro generates 32 HTML pages including the 404. All nested routes have their own index.html and can be opened directly on a static host.

## Design & motion

Warm ivory, charcoal, stone, and bronze; local Manrope and Instrument Serif; a bespoke architectural wordmark interpretation; image-led editorial layouts. Local responsive WebP assets, large asymmetric portfolio layouts, immersive service panels, a custom mobile menu, and a restrained closing invitation.

GSAP draws the one-time entrance linework, reveals headline lines through masks, scales and parallaxes the homepage photograph, reveals project images, animates process linework, and adds small magnetic interactions to desktop CTAs. Lenis drives GSAP’s ticker and ScrollTrigger updates. Astro ClientRouter supplies view transitions and browser-history navigation. Page swaps dispose GSAP scopes, Lenis, observers, listeners, and WebGL resources. Reduced motion bypasses decorative animation and smooth scrolling.

## 3D implementation

Three.js is dynamically imported near the viewport on desktop/tablet. A real perspective camera, structural geometry, material planes, glass, roof slabs, timber fins, directional lights, and a ground grid form a minimal house. Scroll progress and an accessible range control move the materials from line-focused to solid. Pointer movement adjusts the model orientation. Reset restores the neutral view.

Rendering is capped at 30 fps and device pixel ratio 1.5, with viewport and document-visibility checks. The renderer disposes geometries, materials, observers, and its animation frame on navigation. Mobile, reduced-motion, import failures, unavailable WebGL, and context loss retain an SVG architectural study. Its range control changes the built-form shading. The model is clearly labeled illustrative and is not represented as a real Sigura project.

## Interactions & contact form

The project library filters by category with live announcements. The two before-and-after sliders use actual matched pairs from the source collection and support pointer and arrow-key input. The mobile menu supports Escape, focus containment, inert main content, and automatic closing on navigation.

The contact form validates name, email, telephone, location, service, and project description. Budget and timeline are optional. A successful validation shows a reviewable inquiry, a copy action, and a mailto draft. **Nothing is sent automatically.** No personal form data is persisted. An installed email application is needed for mailto; copying the inquiry is the alternative.

To enable real production delivery, choose a legitimate form provider or owned server endpoint, configure credentials outside public source, implement server-side validation/spam protection, update the submit handler to await an actual delivery response, and update the privacy notice. Do not replace the current feedback with a false success message.

## Verification

`npm run build` runs Astro/TypeScript diagnostics then a static production build. `npm test` audits generated HTML for required routes, unique titles, metadata, h1 elements, image alt text, local files, original-domain navigation, and the configured base path.

`scripts/browser-qa.mjs` uses Playwright with installed Chrome. It checks all 31 navigable routes at 320, 375, 430, 768, 1024, and 1440px, then exercises navigation, browser history, category filters, keyboard comparison controls, form errors and email drafts, reduced-motion behavior, the fallback model, Three.js initialization, and reinitialization after navigation. Reports and screenshots are in `qa/`.

With a preview already running:

```powershell
$env:PREVIEW_URL = 'http://127.0.0.1:4322'
node scripts/browser-qa.mjs
```

The browser script uses the existing Chrome installation; it does not download a browser. Set PREVIEW_URL to the actual preview URL. For project-path testing, also set BASE_PATH as below. Automated checks do not substitute for assistive-technology testing or an independent Lighthouse/accessibility audit.

## GitHub Pages

The default build runs at `/`. For the requested example project URL:

```powershell
$env:BASE_PATH = '/sigura/'
$env:SITE_URL = 'https://jay-rtl.github.io'
npm run build
npm test
npm run preview
```

Preview at the printed origin plus `/sigura/`. `src/lib/paths.ts` makes all site links and image paths base-aware. Astro rewrites compiled CSS/JS asset paths. Canonicals, Open Graph URLs, sitemap, and robots use the configured site origin and base. Change SITE_URL and BASE_PATH for your account/repository. To return to a root preview:

```powershell
Remove-Item Env:BASE_PATH -ErrorAction SilentlyContinue
Remove-Item Env:SITE_URL -ErrorAction SilentlyContinue
npm run build
```

The included `.github/workflows/deploy.yml` runs on pushes to `main` and supports manual dispatch. It derives the account and repository name, builds, audits, uploads, and deploys using GitHub Pages actions. After asset permissions and deployment authorization are settled, push to the intended repository, select **GitHub Actions** as the Pages source in repository settings, and manually run **Deploy independent concept to GitHub Pages**. Subsequent pushes to main build, audit, and deploy the current source.

## Facts, photography & limitations

Research checked October 13, 2026:

- [Company source](https://siguraconstruction.com/): supplied contact information, founding year, published services, short review excerpt and attributed review summaries.
- [About and team](https://siguraconstruction.com/about/): founder and published team roles.
- [Portfolio](https://siguraconstruction.com/bay-area-home-remodeling-portfolio/): names, locations, project descriptions, design credits, and gallery photographs.
- [Matched transformations](https://siguraconstruction.com/bay-area-home-remodeling-before-and-after/): Morgan Hill living-room and Menlo Park kitchen pairs. No unrelated photographs are presented as a transformation.
- [Recognition](https://siguraconstruction.com/bay-area-award-winning-construction/): 2026 Best of Houzz Service and published credentials. The redesign links directly to CSLB, Houzz, Diamond Certified, and BBB profiles; it does not claim live certification status.
- [Service areas](https://siguraconstruction.com/service-areas/): listed Peninsula and South Bay communities.

Source image URLs are recorded in `research/assets.json`. Portfolio photography is used for the requested local concept only. Public availability does **not** establish redistribution permission. Obtain company/photographer permission or replace those assets before public publication. Original photographs remain in research/originals for reproducible optimization; public/images contains only the responsive WebP variants.

The homepage/custom-homes architectural inspiration photo is downloaded from [Unsplash](https://images.unsplash.com/photo-1600585154340-be6161a56a0c), under the [Unsplash License](https://unsplash.com/license), and visibly labeled concept photography. It is never assigned to a completed Sigura project. The house model is also illustrative. Manrope and Instrument Serif are from Google Fonts; SIL license files are included in public/fonts.

No invented budgets, dimensions, dates, guarantees, ratings, clients, or awards are added. The process and service copy are original planning guidance; actual deliverables, fees, permits, timelines, and insurance outcomes must be agreed with the company. Service imagery may illustrate another documented portfolio project and is not presented as proof that the image depicts that service’s completed scope.

No live form delivery, map embed, external review feed, analytics, consent banner, or live certification feed is configured. These are not needed for the independent demo. The site has no external runtime asset requests. Authentication and server infrastructure are not part of this static project.
