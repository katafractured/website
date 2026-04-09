# katafract.com — Site Structure

Static site. Pure HTML/CSS/JS. Deploys to Cloudflare Pages (`katafract-web`) on push to `main`.
No build pipeline. All pages are standalone `.html` files.

---

## Product Status

| Product | Status | App Store ID | Page | Index badge |
|---|---|---|---|---|
| ExifArmor | **Live** | `id6760979268` | `apps/exifarmor.html` | `Live on App Store` (cyan) |
| ParkArmor | **Live** | `id6760988040` | `apps/parkarmor.html` | `Live on App Store` (green) |
| DocArmor | Planned | — | `apps/docarmor.html` | `Planned` (gray) |
| WraithVPN | In development | `id6745785827` | `apps/wraith.html` | not on index yet |
| Enclave | In development | — | `enclave.html` | not on index yet |

**When an app goes live:**
1. Change badge in `index.html` → `Live on App Store`
2. Add `<a href="https://apps.apple.com/app/id{ID}" class="btn-appstore">` to app page hero + bottom CTA
3. Remove "Coming soon" from all meta descriptions on the app page
4. Change `og:description` and `twitter:description` to remove future tense
5. Update `sitemap.xml` — bump `priority` to 0.8, add `<lastmod>` with today's date
6. Add JSON-LD `SoftwareApplication` schema to app page (see below)
7. Commit, push → CF Pages auto-deploys

---

## Page Inventory

### Root pages

| File | URL | Purpose | SEO priority |
|---|---|---|---|
| `index.html` | `/` | Main landing — hero, product grid, Enclave CTA | 1.0 |
| `enclave.html` | `/enclave` | Enclave product page | 0.9 |
| `pricing.html` | `/pricing` | Pricing tiers, Stripe links | 0.9 |
| `dns.html` | `/dns` | Haven DNS setup guide | 0.8 |
| `about.html` | `/about` | Company, philosophy, portfolio | 0.5 |
| `canary.html` | `/canary` | Warrant canary (updated monthly by bot) | 0.4 |
| `privacy.html` | `/privacy` | Platform privacy policy | 0.6 |
| `terms.html` | `/terms` | Platform terms | 0.5 |
| `support.html` | `/support` | General support hub | 0.7 |

### App pages (`apps/`)

| File | URL | Status |
|---|---|---|
| `apps/exifarmor.html` | `/apps/exifarmor` | Live |
| `apps/parkarmor.html` | `/apps/parkarmor` | Live |
| `apps/docarmor.html` | `/apps/docarmor` | Planned |
| `apps/wraith.html` | `/apps/wraith` | In development |

### Per-app legal/support pages

Each app has its own privacy, terms, and support pages. All follow the same pattern:

| Directory | URL pattern | Contains |
|---|---|---|
| `privacy/` | `/privacy/{app}` | App-specific privacy policy |
| `terms/` | `/terms/{app}` | App-specific terms of service |
| `support/` | `/support/{app}` | App-specific support FAQ |

Apps: `exifarmor`, `parkarmor`, `docarmor`, `wraith`

---

## SEO Architecture

### JSON-LD schema (add to every app page `<head>`)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "AppName",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "iOS",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "url": "https://apps.apple.com/app/idXXXXXXXX",
  "downloadUrl": "https://apps.apple.com/app/idXXXXXXXX"
}
</script>
```

This is what generates **Google rich results** (star ratings, download button in search).

### Meta checklist per page

- `<title>` — unique, <60 chars, keyword-first
- `<meta name="description">` — unique, 120–155 chars, action-oriented
- `<meta property="og:title">` — can match title
- `<meta property="og:description">` — can be slightly longer than meta desc
- `<meta property="og:url">` — canonical URL without `.html`
- `<meta property="og:image">` — TODO: add 1200×630 screenshots for each app
- `<link rel="canonical">` — always without `.html`

### og:image — TODO

Add 1200×630 app screenshots for:
- ExifArmor → `/images/og-exifarmor.jpg`
- ParkArmor → `/images/og-parkarmor.jpg`
- WraithVPN → `/images/og-wraith.jpg`

Without og:image, social shares show no preview thumbnail. This is the single highest-impact SEO/marketing asset missing.

---

## App Store Visibility Strategy

Getting on App Store front pages requires one of:

1. **Apple Editorial (Today tab / Category featured)** — invite-only. Apple reaches out to apps they discover. Requirements: native SwiftUI, follows HIG, delightful UI, no web views. Path: submit via App Store Connect → "Request App Store Feature" (in Sales & Trends). Best shot: WraithVPN (privacy category is curated heavily right now).

2. **Search Optimization (ASO)** — the practical lever:
   - App name: include keyword (`ParkArmor — Parking Spot Saver`)
   - Subtitle (30 chars): `Save your car. No cloud needed`
   - Keywords field (100 chars): non-overlapping terms not in title/subtitle
   - First 3 lines of description visible before "more" — make them count
   - Screenshots: first frame is a billboard, not a feature list
   - Ratings: prompt at the right moment (after a successful park save, not on launch)

3. **Press / Product Hunt** — launch day spike:
   - Product Hunt launch = AppStore algorithm boost (installs spike → Apple notices)
   - Privacy-focused press: Restore Privacy, Privacy Guides, The Privacy Dad newsletter
   - Target: a single newsletter placement with 10k+ subscribers converts better than broad press

4. **Review sites** — AppAdvice, MacStories, 9to5Mac app roundups
   - Cold email with a promo code and a 2-sentence pitch
   - "Privacy parking app, no location ever leaves your device" is a hook they'll use

5. **TikTok/Reels demos** — short "here's what your phone leaks" clips for ExifArmor have viral potential. No face required, screen recording only.

**Immediate actions (before heavy marketing):**
- Get WraithVPN on TestFlight (public link) → word-of-mouth in privacy communities (r/privacy, Techlore Discord, PrivacyGuides forum)
- Post ExifArmor on r/privacy, r/iosapps — "free, open to audit, no cloud" — this community downloads and reviews
- ParkArmor: post to r/mildlyinteresting, r/LifeProTips — "an app that never sends your location anywhere" is the hook

---

## Deployment

```bash
# Deploy manually (if GH Actions isn't set up)
cd /home/artemis/dev/website
git add -A && git commit -m "..." && git push
# CF Pages auto-deploys on push to main (~30s)

# The deploy workflow uses:
# npx wrangler pages deploy . --project-name katafract-web
```

**CF Pages project:** `katafract-web` (account: bab9d8a1edbf2d5f4882c4452534c860)

---

## Content Update Checklist

When any product status changes, update ALL of:
- [ ] `index.html` — badge, App Store button
- [ ] `apps/{app}.html` — meta description, og:description, twitter:description, App Store button, JSON-LD
- [ ] `sitemap.xml` — priority, lastmod
- [ ] `STRUCTURE.md` (this file) — Product Status table, App Store ID
- [ ] `about.html` if it references the product status
