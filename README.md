# andrewzoll.com

The marketing site for Andrew Zoll, AI efficiency audits for small business owners.

## Structure

```
/
├── index.html              # Entry point (renamed from "Andrew Zoll Site.html")
├── colors_and_type.css     # Design tokens: colors, type scale, fonts
├── assets/                 # Logos, favicons, headshot
└── components/             # React components (JSX, compiled in-browser)
    ├── SiteNav.jsx
    ├── SiteHero.jsx
    ├── Problem.jsx
    ├── TheAudit.jsx
    ├── HowItWorksNew.jsx
    ├── SamplePlan.jsx
    ├── WhoFor.jsx
    ├── AboutInline.jsx
    ├── FAQNew.jsx
    ├── CTABand.jsx
    ├── SiteFooter.jsx
    ├── BookingSheetNew.jsx
    └── tweaks.jsx
```

## Running locally

No build step. Any static file server works:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

Then open `http://localhost:8000`.

## Deploying

This is a static site. Any of these work out of the box:

- **GitHub Pages**: push to `main`, enable Pages in repo settings pointing at root
- **Vercel**: connect the repo, accept defaults
- **Netlify**: connect the repo, build command blank, publish directory `/`
- **Cloudflare Pages**: same as Netlify

## How it works

The site runs React in the browser with Babel Standalone compiling JSX on page load.
Simple, no tooling, deploys anywhere that serves static files.

If you want to upgrade to a real build (Vite + bundled React), the components are
already isolated per file and should port cleanly. Each component attaches itself
to `window`, which lets them work across Babel's per-script scoping. You'd convert
those to `export default` and swap the `<script src="...">` tags for imports.

## Booking

The "Book the audit" button opens a Google Calendar appointment schedule in a new
tab. The link is in `components/BookingSheetNew.jsx` as `BOOKING_URL`.

## Tweaks

The site has a live tweak panel for quick copy/style changes. It only activates
when viewed inside the design tool. On production, it's invisible.
