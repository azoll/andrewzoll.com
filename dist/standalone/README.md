# Standalone HTML — RyleighWM Handover

Two self-contained files for Polina to drop onto the RyleighWM site.

## Files

| File | Purpose |
|---|---|
| `index.html` | Main landing page (hero, scorecard CTA, services, FAQs, schedule, free downloads, book email form) |
| `scorecard.html` | The Biblical Stewardship Scorecard assessment app |

Both files are fully self-contained: CSS is inlined in `<style>` tags, JS is inlined in `<script>` tags. No build step. Drop them on the server and they run.

## Recommended placement

Put both files in the same directory on the RyleighWM site so the in-page link from `index.html` to `scorecard.html` resolves naturally. Example:

```
/                  → index.html
/scorecard         → scorecard.html  (or /scorecard.html)
```

If `scorecard.html` lives at a different URL, update the `<a href="scorecard.html">` in `index.html` to match.

## Image and asset hosting

All images and assets are served from Andrew's live site:

```
https://andrewzoll.com/rwm/...
```

Polina does not need to copy any image files to the RyleighWM server. As long as andrewzoll.com is up, image URLs keep working.

## External services

These all route to Andrew's accounts intentionally — this is Andrew's content on the RyleighWM site, so submissions and tracking should land with Andrew. Listed here for reference only:

- **ConvertKit book form** (`form id 8106721`) — book PDF signups
- **Mailchimp scorecard signup** — scorecard results emails
- **Calendly** (`calendly.com/andrew-zoll/clarity-call`) — Stewardship Clarity Call booking
- **Meta Pixel** (`id 1447544912815924`) — conversion tracking

## PDF download on the scorecard

The scorecard generates the results PDF entirely in the browser using jsPDF (loaded from the unpkg CDN, with a GitHub-hosted fallback). No server side processing. The standalone `scorecard.html` produces the PDF on click anywhere it's hosted, as long as the user has JavaScript enabled.

## Calendly widget requirements

The schedule section uses Calendly's official inline widget. The standalone file already includes Calendly's widget CSS and JS (`https://assets.calendly.com/assets/external/widget.css` and `widget.js`) right above the embed div. Both load asynchronously and are required for the widget to render.

If the widget ever doesn't load, the most common causes are:
1. The user's browser is blocking third-party requests to `assets.calendly.com`.
2. A page-level Content Security Policy disallows external scripts.
3. The Calendly account is paused or the event link has changed.

## In-page anchors

Both files use `#schedule`, `#book`, `#scorecard`, `#faqs`, etc. for in-page navigation. These resolve correctly regardless of the file's hosting URL.

## Browser support

- Modern Chrome / Safari / Firefox / Edge: all features work.
- The scorecard requires JavaScript enabled.
- The PDF download generates client-side; iOS Safari may occasionally need a long-press on the resulting link to trigger the download.

## Update flow

If Andrew updates the source files in this repo, the assets (images / 5 Lies PDF / jsPDF fallback) auto-update on Polina's pages because they're served from GitHub. **The two HTML files do not auto-update.** When the source HTML changes, regenerate these standalone files and send Polina a refreshed copy.
