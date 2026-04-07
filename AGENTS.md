# katafract.com Website — Agent Instructions

## Project Purpose

katafract.com marketing site. Static HTML pages for the Katafract/Enclave product line — no build pipeline, no framework, no dependencies. Privacy-first: no external CDNs, no tracking pixels, self-hosted fonts.

## Tech Stack

- Pure HTML5, CSS3, vanilla ES6 JavaScript
- Self-hosted WOFF2 fonts: Cormorant Garamond, DM Sans, JetBrains Mono (in `fonts/`)
- CSS custom properties for design tokens
- Color palette: cyan `#00F0FF`, magenta `#FF006E`, dark navy background
- No npm, no build tools, no framework

## Key Pages

| File | Purpose |
|---|---|
| `index.html` | Landing page — hero, philosophy, product overview, CTA |
| `enclave.html` | Enclave product page (Haven DNS + Veil VPN bundle) |
| `dns.html` | Haven DNS setup guide with tabs (iPhone / Mac / Android) |
| `pricing.html` | Pricing tiers with monthly/annual toggle, Stripe integration |
| `about.html` | Company story, philosophy, app portfolio (DocArmor, ExifArmor, ParkArmor, Wraith) |
| `support.html` | Support page |
| `privacy.html` | Privacy policy |
| `terms.html` | Terms of service |
| `canary.html` | Warrant canary |

## How to Deploy

No build step. Copy files directly to the static serving path:

```bash
rsync -av --delete . artemis:/opt/katafract-platform/apps/client-portal/
```

nginx on artemis serves `apps/client-portal/` as static files for `connect.katafract.com`. Cloudflare proxies katafract.com.

## Asset Structure

```
fonts/           # WOFF2 font files (do not link external CDNs)
fonts.css        # @font-face declarations
apps/            # Sub-pages for individual apps
privacy/         # Privacy policy directory mirror
terms/           # Terms directory mirror
support/         # Support directory mirror
favicon.svg      # SVG favicon
robots.txt
sitemap.xml
```

## Constraints

- **Do NOT add a build pipeline** — file is deployed as-is
- **Do NOT refactor to React/Vue/Svelte** — static HTML is intentional
- **Do NOT link external CDNs** (Google Fonts, jsDelivr, etc.) — privacy-first philosophy
- **Do NOT add client-side routing** — each page is a standalone HTML file
- Pricing values are hardcoded in `pricing.html` — update manually when prices change
- Maintain the dark navy + cyan/magenta color scheme
- Keep font loading self-hosted via `fonts/` directory
