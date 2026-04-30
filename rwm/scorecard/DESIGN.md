# Scorecard Design System — Stripe + Notion Hybrid (RWM brand)

This page combines two design systems on top of RWM's navy + gold brand palette:

- **Stripe** drives the *interaction* layer: typography rhythm (weight-300 display, ss-style precision), conservative 4–8px button radii, blue-tinted multi-layer elevation, focus rings.
- **Notion** drives the *content* layer: warm neutral palette, whisper borders (`1px solid rgba(0,0,0,0.1)`), pill badges (9999px), four-layer shadow stacks, generous vertical rhythm, section alternation between white and warm white (`#f6f5f4`).

Brand colors stay RWM: navy `#1B3A5C` substitutes for Stripe's deep navy / Notion's near-black headline, and gold `#C8962E` substitutes for Stripe's purple primary / Notion's blue CTA.

## 1. Color Tokens

| Token | Value | Role |
|---|---|---|
| `--navy` | `#1B3A5C` | Headings, primary brand surface, score card bg |
| `--navy-deep` | `#132942` | Header bar, hover states on dark surfaces |
| `--gold` | `#C8962E` | Primary CTA bg, accent overline, focus ring |
| `--gold-hover` | `#B58428` | CTA hover |
| `--gold-pale` | `#FDF3E0` | Selected option tint, badge bg |
| `--bg` | `#ffffff` | Default canvas |
| `--bg-warm` | `#f6f5f4` | Alternating section bg (Notion warm white) |
| `--ink` | `rgba(0,0,0,0.95)` | Body text (Notion near-black) |
| `--ink-muted` | `#615d59` | Secondary text (Notion warm gray 500) |
| `--ink-faint` | `#a39e98` | Placeholder, muted captions |
| `--whisper` | `rgba(0,0,0,0.10)` | Whisper border (Notion) |
| `--success` | `#15be53` / text `#108c3d` | Score-strong indicator |
| `--warn` | `#dd5b00` | Score-area-for-growth indicator |

## 2. Typography

- **Family:** `'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif`
- **OpenType:** `font-feature-settings: 'cv11', 'ss01', 'cv02'` (Inter approximations of Stripe's ss01)
- **Weights used:** 300 (display), 400 (body), 500 (UI), 600 (emphasis), 700 (score number only)

| Role | Size | Weight | Line | Tracking |
|---|---|---|---|---|
| Display Hero (landing/results) | 40–48px | 300 | 1.05 | -1.2px |
| Sub-headline | 26–28px | 300 | 1.20 | -0.5px |
| Question text | 22px | 400 | 1.40 | -0.25px |
| Body | 16px | 400 | 1.55 | normal |
| Body small | 14px | 400 | 1.55 | normal |
| Overline / Category | 12px | 600 | 1.0 | 1.5px (uppercase) |
| Score Number | 64px | 700 | 1.0 | -2px |
| Button | 16px | 500 | 1.0 | normal |

## 3. Components

**Primary button** — `var(--gold)` bg, white text, 4px radius, 12px 24px padding, hover `--gold-hover`, focus ring `2px solid var(--gold)` with 2px offset.

**Answer option** — white bg, `1px solid var(--whisper)`, 8px radius, 16px 20px padding. Hover: bg `--bg-warm`. Selected: `1px solid var(--gold)` + `--gold-pale` bg + 2px gold left accent stripe.

**Card** — white bg, `1px solid var(--whisper)`, 12px radius, Notion 4-layer shadow:
```
rgba(27,58,92,0.04) 0 4px 18px,
rgba(27,58,92,0.027) 0 2px 7.85px,
rgba(27,58,92,0.02) 0 0.8px 2.93px,
rgba(27,58,92,0.01) 0 0.175px 1.04px
```

**Score card / CTA card** — `--navy` bg, 16px radius, Stripe elevated shadow:
```
rgba(27,58,92,0.25) 0 30px 45px -30px,
rgba(0,0,0,0.10) 0 18px 36px -18px
```

**Tier badge / pill** — `--gold-pale` bg, `--gold` text shifted darker, 9999px radius, 4px 12px padding, 12px weight 600, +0.125px tracking.

**Inputs** — `1px solid var(--whisper)`, 4px radius, focus `1px solid var(--gold)` + `2px var(--gold)` outer glow.

## 4. Layout & Rhythm

- Container max 640px (mobile-first scorecard).
- Section vertical padding: 40–64px on results page (Notion generous rhythm).
- Section alternation: results page alternates `--bg` and `--bg-warm` between blocks.
- Borders are whispers — never 2px, never gray-200 hard lines.

## 5. PDF Mirror

PDF generation in `index.html` mirrors this system:
- Navy header bar, Inter helvetica fallback at weight equivalents.
- Score card in navy with 16pt radius and gold pill grade.
- Multi-layer shadow approximated via stacked light fills behind cards.
- Warm bg sections rendered as `#f6f5f4` fills.
- Priority cards: whisper border + 3pt gold left accent, no fill.

## 6. Don'ts

- No 2px borders. No hard `gray-200` dividers. Use whisper.
- No pill-shaped buttons (keep 4–8px radius for buttons).
- No pure-black text. Always `rgba(0,0,0,0.95)`.
- No cool-blue grays for body copy. Use warm grays (`#615d59`, `#a39e98`).
- No weight-700 on display headlines (the 64px score number is the only exception).
