/**
 * Single source of truth for app metadata.
 *
 * Update this file whenever status, price, or App Store URL changes.
 * Every page that shows app status/badge/CTA must read from here —
 * never hardcode status text or App Store links in individual pages.
 *
 * Status values:
 *   live    — in App Store, real URL, show "Download on the App Store"
 *   review  — in Apple review queue, show "Coming soon · In review"
 *   ready   — builds uploaded (PREPARE_FOR_SUBMISSION), show "Coming soon"
 *   soon    — not yet built/submitted, show "Coming soon"
 *   profile — Haven: install DNS profile, no App Store app, show "Set up Haven →"
 *   stub    — Praetor: no public commitment yet, show "In development"
 */

export type AppStatus = 'live' | 'review' | 'ready' | 'soon' | 'profile' | 'stub';

export interface AppMeta {
  slug: string;              // url-safe, e.g. 'vaultyx'
  name: string;              // "Vaultyx"
  bundleId: string;          // com.katafract.vault
  status: AppStatus;
  statusBadge: string;       // human-readable label shown on all pages
  appStoreUrl: string | null; // null until live in App Store
  price: string;             // short label: "Free + $0.99 unlock", "Sovereign tier only", etc.
  accent: string;            // hex for app accent color (matches CSS vars)
  tagline: string;           // 1-line blurb for homepage cards
  description: string;       // 2-sentence blurb for meta/compare cards
  platforms: string[];       // ['iOS'] or ['iOS', 'Android-waitlist']
  hasDedicatedPage: boolean; // whether /apps/<slug> exists
  hasSupport: boolean;       // whether /support/<slug> exists
  hasTerms: boolean;         // whether /terms/<slug> exists
  featured: boolean;         // show on homepage grid?
  order: number;             // display order (lower = first)
}

// TODO(apps-lint): add a build-time script that asserts:
//   - every src/pages/apps/<slug>.astro has a matching APPS entry with hasDedicatedPage: true
//   - every support/<slug>.astro matches an entry with hasSupport: true
//   - every terms/<slug>.astro matches an entry with hasTerms: true

export const APPS: AppMeta[] = [
  {
    slug: 'exifarmor',
    name: 'ExifArmor',
    bundleId: 'com.katafract.exifarmor',
    status: 'live',
    statusBadge: 'Live on App Store',
    appStoreUrl: 'https://apps.apple.com/app/id6760979268',
    price: 'Free + $0.99 unlock · bundled with Enclave',
    accent: '#00F0FF',
    tagline: 'Share photos, not your location',
    description: 'Strips hidden GPS coordinates, device info, and timestamps from photos before you share. One tap, originals untouched.',
    platforms: ['iOS'],
    hasDedicatedPage: true,
    hasSupport: true,
    hasTerms: true,
    featured: true,
    order: 1,
  },
  {
    slug: 'parkarmor',
    name: 'ParkArmor',
    bundleId: 'com.katafract.ParkArmor',
    status: 'live',
    statusBadge: 'Live on App Store',
    appStoreUrl: 'https://apps.apple.com/app/id6760988040',
    price: 'Free + $0.99 unlock · bundled with Enclave',
    accent: '#4ADE80',
    tagline: 'Never lose your car again',
    description: 'One tap saves your parked spot. Walking directions back, timer, lock screen widget. Your location never leaves your device.',
    platforms: ['iOS'],
    hasDedicatedPage: true,
    hasSupport: true,
    hasTerms: true,
    featured: true,
    order: 2,
  },
  {
    slug: 'wraith',
    name: 'Wraith VPN',
    bundleId: 'com.katafract.wraith',
    status: 'review',
    statusBadge: 'Coming soon · In review',
    // NOTE: App Store URL exists in schema/proof section of wraith.astro (id6745785827)
    // but the app is not yet approved/live. Set to null until Apple approves.
    appStoreUrl: null,
    price: 'Enclave tier only ($8/mo)',
    accent: '#818CF8',
    tagline: 'Fast, private WireGuard VPN with Haven DNS built in',
    description: 'WireGuard VPN on Katafract-operated nodes. Haven DNS at every exit, kill switch, 5 devices, no logs.',
    platforms: ['iOS'],
    hasDedicatedPage: true,
    hasSupport: true,
    hasTerms: true,
    featured: false,
    order: 3,
  },
  {
    slug: 'safeopen',
    name: 'SafeOpen',
    bundleId: 'com.katafract.safeopen',
    status: 'review',
    statusBadge: 'Coming soon · In review',
    // NOTE: id6761782681 referenced in index.astro — not yet approved
    appStoreUrl: null,
    price: 'Free + credits · bundled with Enclave',
    accent: '#F97316',
    tagline: 'Know what you\'re opening before you tap',
    description: 'QR scanner and link inspector. On-device risk scoring, AI summaries via privacy relay. Free with consumable scan credits.',
    platforms: ['iOS'],
    hasDedicatedPage: true,
    hasSupport: true,
    hasTerms: true,
    featured: true,
    order: 4,
  },
  {
    slug: 'docarmor',
    name: 'DocArmor',
    bundleId: 'com.katafract.DocArmor',
    status: 'ready',
    statusBadge: 'Coming soon',
    appStoreUrl: null,
    price: '$7.99 one-time · bundled with Enclave',
    accent: '#E879F9',
    tagline: 'Your IDs, encrypted, on your device',
    description: 'AES-256 encrypted vault for IDs, insurance cards, and passports. Face ID protected. Cloud backup with Sovereign.',
    platforms: ['iOS'],
    hasDedicatedPage: true,
    hasSupport: true,
    hasTerms: true,
    featured: true,
    order: 5,
  },
  {
    slug: 'vaultyx',
    name: 'Vaultyx',
    bundleId: 'com.katafract.vault',
    status: 'ready',
    statusBadge: 'Coming soon',
    appStoreUrl: null,
    price: 'Sovereign tier only ($18/mo)',
    accent: '#FF006E',
    tagline: 'Zero-knowledge encrypted cloud storage',
    description: 'Client-side AES-256-GCM encryption. FastCDC delta sync. Auto VPN routing. We never see your files. 1TB included with Sovereign.',
    platforms: ['iOS'],
    hasDedicatedPage: true,
    hasSupport: true,
    hasTerms: true,
    featured: true,
    order: 6,
  },
  {
    slug: 'haven',
    name: 'Haven DNS',
    bundleId: '', // DNS profile, no app bundle
    status: 'profile',
    statusBadge: 'Free · Set up Haven →',
    appStoreUrl: null, // DNS profile at /dns, not App Store
    price: 'Free',
    accent: '#4ADE80',
    tagline: 'Encrypted DNS with ad, tracker, and malware blocking',
    description: 'Haven DNS blocks ads, trackers, and malware at the DNS layer. Free with no account. Works on any device that supports DoH.',
    platforms: ['iOS', 'Android', 'macOS', 'Windows', 'Router'],
    hasDedicatedPage: true,
    hasSupport: true,
    hasTerms: false,
    featured: false,
    order: 7,
  },
  {
    slug: 'praetor',
    name: 'Praetor',
    bundleId: 'com.katafract.praetor',
    status: 'stub',
    statusBadge: 'In development',
    appStoreUrl: null,
    price: 'Sovereign tier only (future)',
    accent: '#FF006E',
    tagline: 'Offline-first PIM and encrypted email',
    description: 'Personal information manager and email client. IMAP/SMTP sync, encrypted locally, never in the cloud. Not yet shipped.',
    platforms: ['iOS', 'macOS'],
    hasDedicatedPage: true,
    hasSupport: false,
    hasTerms: false,
    featured: false,
    order: 8,
  },
];

// Convenience accessors
export const appBySlug = (slug: string): AppMeta | undefined =>
  APPS.find((a) => a.slug === slug);

export const liveApps = (): AppMeta[] =>
  APPS.filter((a) => a.status === 'live');

export const featuredApps = (): AppMeta[] =>
  APPS.filter((a) => a.featured).sort((a, b) => a.order - b.order);

/** Maps status → badge colors for consistent rendering */
export const statusColors: Record<AppStatus, { bg: string; text: string; border: string }> = {
  live:    { bg: 'rgba(0,240,255,.1)',   text: '#00F0FF', border: 'rgba(0,240,255,.2)' },
  review:  { bg: 'rgba(249,115,22,.1)', text: '#F97316', border: 'rgba(249,115,22,.2)' },
  ready:   { bg: 'rgba(255,0,110,.1)',  text: '#FF006E', border: 'rgba(255,0,110,.2)' },
  soon:    { bg: 'rgba(139,92,246,.1)', text: '#8B5CF6', border: 'rgba(139,92,246,.2)' },
  profile: { bg: 'rgba(74,222,128,.1)', text: '#4ADE80', border: 'rgba(74,222,128,.2)' },
  stub:    { bg: 'rgba(100,100,120,.1)',text: '#8C94A6', border: 'rgba(100,100,120,.2)' },
};
