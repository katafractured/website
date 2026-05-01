---
title: Why Katafract
description: A founder-voice essay on why this exists, what the moats actually are, and the problems that drove me to build a privacy stack I'd want to use myself.
pubDate: 2026-05-15
author: Tek
tags: [founder, philosophy, architecture]
draft: true
---

I built Katafract because I couldn't find a privacy product I actually trusted.

Not because the products on the market are bad — most of them aren't. Mullvad has the best no-logs posture in the VPN space, and proved it under a Swedish police raid. Bitwarden is cleanly zero-knowledge and you can host it yourself. iCloud+ Advanced Data Protection is a quietly excellent piece of engineering. Proton bundles are a good answer for a lot of people.

What I couldn't find was the *combination*.

A VPN that didn't ask for an email. A storage tier the operator can't peek into. A DNS resolver running on the same nodes I trust with my packets. A way to check whether a link is sketchy before I click it on my kid's phone. A way to strip the GPS coordinates out of a photo I'm sending to a stranger. All under one roof, owned by one entity I could read about and verify, with one identity I could carry across all of it without giving up an email address.

Every time I tried to assemble it from the existing privacy market, I had to make compromises I didn't want to make.

## The compromise tax

Here's what actually happened when I tried to put together "the privacy stack I want."

To get a VPN with no email signup → Mullvad. Great. But I want my home router on it too — that's a separate config. And I want a kill switch on my Mac without the app constantly reconnecting — that's a separate setting per OS. And I want my DNS to be a blocklist resolver running on the *same node* I'm exiting through, so my browsing destinations don't trickle out a side channel — that's not a Mullvad feature.

To get encrypted storage where the operator can't read my files → I considered Proton Drive, then realized the keys still live in Proton's account model. I looked at Tresorit, then realized the company changed hands and I don't know what that means for the product roadmap. I looked at running Nextcloud myself, then realized I'd be the operator, the sysadmin, and the security team for my own files for the rest of my life. I looked at Cryptomator on top of an existing cloud. That's a good answer if your threat model is "the cloud provider," but the moment you want share-a-folder, the threat model gets complicated.

To get a password manager → Bitwarden, fine. But that's a separate signup, separate identity, separate billing.

To get email → Tutanota or Proton Mail. Another signup. Another identity.

To get DNS blocking → NextDNS or self-hosted AdGuard. Another subscription, or another box in my closet.

To know whether a QR code on a flier was safe before scanning it → nothing, really. I'd just trust it or not.

To know whether a photo I was about to send had GPS coordinates baked in → I had to remember to scrub it manually, and even then most apps have edge cases I'd miss.

By the time I finished assembling the stack, I had six different vendors, six different identities, six different ways to log in, six different audit postures to track, and six different threat models to think about.

That's the compromise tax. And the thing about compromises is they compound. Each one looks small. The sum is what makes regular people give up and just go back to using the default tools their phone shipped with.

## What I wanted instead

A platform where the perimeter was the unit of design, not the individual product.

Where your *files* are encrypted with a key derived on your device, before any byte leaves it.

Where your *photos* shed their location data on the way out the door, automatically, without you remembering to flip a setting.

Where your *links* and *QR codes* get inspected before they open in your real browser.

Where your *connections* travel a network I could fully describe in a docs site you can read right now — every node, every region, every cluster zone.

Where your *identity* is a token, not an account. Paste it on any device. Lose a device without losing access. Abandon it when you want a new one.

Where the *infrastructure underneath* — every server, every storage cluster, every line of logging policy — is published, audited, and in the open.

That's Katafract. It's what I wanted to use, and I couldn't find it, so I built it.

## What's actually different about it

Three things, mostly.

**Token identity.** The login at every Katafract surface is a token you paste, not an email and password. The token is derived from your purchase — Apple, Google, Stripe, or crypto — and that's the only credential. We never see a username. There is no "forgot password" flow because there is no password to forget. If you lose the token, you recover by re-running the purchase signal (Apple's StoreKit receipt, Stripe's customer portal). For a Stripe-paid customer this means we have your email — Stripe needs it for billing — but the platform itself never indexes you by it. The Katafract identity is the token. The Stripe email is the billing identity. They live in different systems and don't cross-reference at the application layer.

**Zero-knowledge storage.** Vaultyx, our encrypted file storage, derives every encryption key from a 12-word phrase you write down once. Every file. Every filename. Every folder. The server holds chunked ciphertext and a manifest that's also encrypted with your key. There is no "view the filename" code path, because the server can't see the filename. There is no "lost-password recovery" code path, because the server can't reset what it never had. If you forget the phrase, the data is gone. That's the trade.

**Mesh-bound infrastructure, not closed mesh.** Some privacy bundles run on closed proprietary networks, where the bytes stay inside the vendor's edge for the whole hop. We don't do that. We run standard WireGuard with a public Shadowsocks fallback for hostile networks, and the mesh between our own boxes is Headscale — open-source, swappable, auditable. Our edges are documented; you can see every WraithGate exit on `docs.katafract.io` and verify the city, the cloud provider, the IP space, the AS number. Nothing's hidden. The reason to use us isn't that we're secret. The reason to use us is that we're public, and the architecture itself is the moat.

## What we don't claim

We don't claim military-grade encryption — that phrase is a marketing tell and means nothing. We use AES-256-GCM and Curve25519 because they're the public-standard ciphers everyone in this space uses, including the projects we built on top of (WireGuard, age, BIP-39).

We don't claim no-logs in some absolute sense. We claim, on `/trust/logs`, that DNS query logs are off, that VPN traffic isn't logged, that the file server can't read your filenames, and that our application logs only contain a truncated SHA-256 of your token in any line that needs to reference a user. Those are specific claims. They're verifiable when the source repo opens, and the warrant canary is what you have until then.

We don't claim to be the answer for everyone. The SaaS-native, "I'll trust the vendor's recovery flow" user is better served by iCloud+ or a Proton bundle. The DIY-it-all user is better served by a Tailscale + Nextcloud + Vaultwarden stack and a weekend. The user who wants a privacy posture that *behaves like one product* but is *built like a stack* — that's the Katafract user.

## What I actually use it for

I use Vaultyx for our family archive — birth certificates, passport scans, the photos I never want a cloud provider to be able to surface for ML training. I use WraithVPN as my default — single-hop on the laptop, multi-hop on the phone when I'm somewhere I don't recognize. I use Haven on every device my kid touches because I don't want their screen time funneled through ad networks. I use ExifArmor to strip GPS off the photos I send my mom of the kids in the backyard. I use SafeOpen any time I get a QR code from a flier or a parking sign that I can't quite trust.

That's the stack. That's what I built. And the only reason it has a price tag is that it costs me real money to run — the servers, the storage, the App Store cuts, the bandwidth. Everything beyond that is funded by paid customers so I don't have to fund it through your data.

If you've read this far, the rest of the docs are open. Start at [the architecture overview](/docs/architecture/overview) or [the trust pages](https://docs.katafract.io/trust/) and verify whatever you want to verify before you trust me on any of this.

That's the deal.

— Tek
