# Standalone HTML — RyleighWM Handover

Two self-contained files for Polina to drop onto the RyleighWM site.

## Files

| File | Purpose |
|---|---|
| `index.html` | Main landing page (hero, scorecard CTA, services, FAQs, schedule, free downloads, book email form) |
| `scorecard.html` | The Biblical Stewardship Scorecard assessment app |

Both files are fully self-contained: CSS is inlined in `<style>` tags and JS is inlined in `<script>` tags. No build step. Drop them on the server and they run.

## Recommended placement

Put both files in the same directory on the RyleighWM site so the in-page link from `index.html` to `scorecard.html` resolves naturally. Example:

```
/                  → index.html
/scorecard         → scorecard.html  (or /scorecard.html)
```

If `scorecard.html` lives at a different URL, update the `<a href="scorecard.html">` in `index.html` to match.

## Image and asset hosting

All images, logos, and the "5 Lies" PDF download are served from the canonical GitHub repo:

```
https://raw.githubusercontent.com/azoll/andrewzoll.com/main/rwm/...
```

This means **the page does not need any image files copied to the RyleighWM server**. As long as the GitHub repo stays public, image URLs keep working.

If you'd like a more performant CDN-backed alternative, replace `https://raw.githubusercontent.com/azoll/andrewzoll.com/main/rwm/` with `https://cdn.jsdelivr.net/gh/azoll/andrewzoll.com@main/rwm/` everywhere. jsDelivr serves the same files from a global CDN, no other changes needed.

## External services (work as-is, but routed to Andrew's accounts)

These will function on RyleighWM's site without code changes, but submissions/events go to **Andrew's accounts**, not the firm's:

| Service | Where it goes | Action if RWM wants its own |
|---|---|---|
| ConvertKit book form | Andrew's list (form id `8106721`) | Replace `https://app.kit.com/forms/8106721/subscriptions` in `index.html` with RWM's form action |
| Mailchimp scorecard signup | Andrew's list (constants `MAILCHIMP_U` and `MAILCHIMP_ID` in `scorecard.html`) | Update those two constants in `scorecard.html` |
| Calendly | `calendly.com/andrew-zoll/clarity-call` | Update all `calendly.com/andrew-zoll/clarity-call` links in both files |
| Meta Pixel | Andrew's pixel id `1447544912815924` | Replace the pixel id in both files (4 occurrences total) |
| Google Fonts (Inter) | Google CDN | Works as-is, no action |
| jsPDF (PDF download library) | unpkg CDN | Works as-is, no action |

## Things that are Andrew-specific (not just service routing)

These are content choices, not config. Decide before publishing:

- **Bio and personal voice** — `index.html` is written first-person as Andrew ("I'm Andrew Zoll," "I left full-time ministry," "I have four kids"). The scorecard PDF and CTAs say "Prepared for [name]" with `ANDREW ZOLL` as the header wordmark. If RyleighWM publishes this under the firm's name rather than Andrew's, the voice will read oddly.
- **Andrew's social links** — the LinkedIn and Facebook icons in the bio section link to Andrew's personal profiles.
- **Author/book** — links to Amazon and the ConvertKit form push Andrew's book *How to Master Your Money God's Way*.
- **The puppy-financing LinkedIn anecdote** in the FAQ links to Andrew's personal LinkedIn post.
- **Compliance disclosure** — the Kestra disclosure text mentions Ryleigh Wealth Management directly, so it's already correct for RWM context. Still worth running past compliance before publishing on the firm's domain.

## In-page anchors

Both files use `#schedule`, `#book`, `#scorecard`, `#faqs`, etc. for in-page navigation. These resolve correctly regardless of the file's hosting URL.

## Browser support

- Modern Chrome / Safari / Firefox / Edge: all features work.
- The scorecard requires JavaScript enabled (it's a multi-step interactive assessment).
- The PDF download in the scorecard uses jsPDF; it generates client-side and requires a desktop or modern mobile browser. iOS Safari has occasional download quirks; users on older iOS may need to long-press the PDF link.

## Notes on canonical update flow

If Andrew updates the source files in this repo, the assets (images / 5 Lies PDF) auto-update on Polina's pages because they're served from GitHub. **The two HTML files do not auto-update.** When the source HTML changes, regenerate these standalone files (or send Polina a refreshed copy).
