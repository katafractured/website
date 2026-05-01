---
title: Tailscale vs Katafract — different problems, same primitive
description: Tailscale is the best mesh-networking primitive on the market. Katafract is a consumer privacy stack that uses the same primitive. Where they overlap, where they don't, which one to use when.
pubDate: 2026-05-29
author: Tek
tags: [comparison, networking, tailscale, wireguard]
draft: true
---

I'll get to the comparison in a moment. First, an admission:

**Katafract uses Tailscale's open-source backend.** Specifically, we run Headscale — the open-source coordination server that speaks Tailscale's protocol — as the mesh layer between our own boxes. It's how artemis (the control plane) reaches argus (the database) reaches the WraithGate exits reaches the Garage S3 cluster. Without it, the platform doesn't run.

So this is not a "Tailscale is bad, use my thing instead" post. It's a "Tailscale and Katafract solve different problems, here's which one you want when" post.

## What Tailscale actually is

Tailscale is a **mesh-networking product**. It gives you:

- A WireGuard-based overlay network between every device you sign in
- Magic DNS so you can reach `laptop.tailnet-name.ts.net` from your phone
- ACLs so you can restrict which devices can talk to which
- Subnet routing so a node can advertise "I can also reach 192.168.1.0/24 inside this house"
- Exit nodes — designate one Tailscale node as your egress, and route all your traffic through it
- A coordination server that handles key exchange, NAT punching, identity (via Google / Microsoft / GitHub OAuth)

It is, design-wise, a brilliant product. The hard problem in mesh VPNs is making them transparent — making "now I'm connected to my own network from anywhere" feel as normal as Wi-Fi. Tailscale solved that.

It is **not** a consumer privacy product. That's not what it was built for, and the company doesn't pretend otherwise.

## What Katafract actually is

Katafract is a **consumer privacy stack** built for individuals and households who want their digital perimeter to behave coherently:
- VPN exits in cities you choose, with no email signup
- Encrypted file storage where the operator can't read your filenames
- DNS-level blocking on every node
- Photo-metadata stripping, link-safety scanning, parking helpers — utility apps bundled in
- An anonymous token-based identity that paste-recovers across devices
- A pricing model that's funded by paid customers, not by mining your data

The mesh layer (which Tailscale also addresses) is one piece of how Katafract works internally. But Katafract is *not* sold as "a mesh network for your own devices." It's sold as a privacy posture for everyday consumer life.

## Where they overlap

They both:

- Use WireGuard as the underlying tunnel cipher
- Provide exit-node functionality (route all traffic through a remote node)
- Run on iOS, Android, macOS, Windows, Linux

You could conceivably use Tailscale for some Katafract use cases, and vice versa.

## Where they diverge — sharply

| Question | Tailscale | Katafract |
|---|---|---|
| **What identity model do I get?** | Email-bound OAuth login (Google, Microsoft, GitHub, Apple, OIDC) | Anonymous token paste — no email needed |
| **Who runs the exit nodes?** | You do. Designate one of *your* devices, or rent a VPS and join it. | Katafract does. WraithGate exits in NBG, HEL, ASH, HIL, SIN ×2, EWR, NRT, BOM, plus a US-West backup. |
| **What about file storage?** | Not Tailscale's job. Use whatever cloud you already use. | Vaultyx — zero-knowledge, BIP39-derived keys. |
| **What about DNS blocking?** | Tailscale Magic DNS routes name resolution; doesn't block ads/trackers by default. | Haven runs AdGuard + Unbound on every WraithGate node. |
| **What about photo EXIF / link safety?** | Not Tailscale's scope. | ExifArmor + SafeOpen — bundled into the same identity. |
| **Pricing.** | Free for personal up to 3 users / 100 devices; $6/user/mo personal Pro; $6/user/mo Premium for teams; $18/user/mo for Enterprise. Storage / VPN-exit / DNS-blocking are not part of the price. | $8/mo Enclave (VPN + DNS + utility apps), $18/mo Sovereign (adds 1 TB Vaultyx + multi-hop + cross-device sync + future apps). |
| **What's the threat model?** | "Your devices need to talk to each other across networks; you trust the device owner; the coordination server should not be a routing point." | "Your devices need to talk to the open internet privately; you don't trust ad networks, you don't trust photo metadata, you don't want a 'forgot password' email leak vector, you do trust open-source crypto on standard ciphers." |
| **What happens when you cancel?** | Your nodes disconnect from the tailnet. Your devices keep working; they just can't reach each other through Tailscale anymore. | Your token expires. Peers stop authenticating. Vaultyx files stay on your devices; the cloud copy is removed after a 30-day grace period. |

The threat-model row is the load-bearing one. **Tailscale is for trusting your own infrastructure across networks. Katafract is for distrusting the open internet.** The same WireGuard primitive, two very different uses.

## When you should use Tailscale (and not Katafract)

- You want to reach your home server from your laptop, anywhere.
- You want a small team to share a private network with strict ACLs.
- You want to expose a single internal app over a mesh-only ingress.
- You want to bind a remote dev environment to your VS Code.
- You want a simple way for a kid in college to reach the family Plex from their dorm.
- You're a self-hoster who needs the *primitive* and is happy to assemble the rest yourself.

In every one of these cases, Tailscale is a better answer than Katafract. We'd lose money trying to be Tailscale, and you'd find Katafract too consumer-shaped for what you actually need.

## When you should use Katafract (and not Tailscale)

- You want a VPN that doesn't ask for an email and runs on someone else's infrastructure with a no-log posture.
- You want zero-knowledge file storage where the server can't read your filenames, with a recovery model that's a 12-word phrase.
- You want DNS blocking on every device, not as a separate signup but as part of the same identity.
- You want a privacy bundle for a household, not a mesh primitive for a small team of admins.
- You don't want to be the operator of your own infrastructure.

In every one of these cases, Tailscale is the wrong shape. The exit-node functionality exists, but you'd be the one renting and configuring the exit. The DNS blocking would be a separate decision. The storage would be your existing cloud, with your existing trust trade-offs.

## When you might use both

This is real, and we expect it to be common.

- Tailscale on your laptop to reach your home server.
- Katafract on your phone to keep the VPN + DNS + utility-app perimeter.
- Vaultyx for the family archive.
- Plex over Tailscale for the home media library.

There's no conflict. They live in different layers. We don't try to be a mesh primitive; Tailscale doesn't try to be a consumer privacy stack. Use what fits.

## A note on Headscale

Since I mentioned it earlier: Headscale is the open-source implementation of the Tailscale coordination protocol. It's not Tailscale Inc. — it's a community project, MIT licensed, that lets you self-host the coordination layer.

We use Headscale internally. We don't expose it to customers — Katafract customers don't operate Tailscale-style mesh networks; they connect to our edge over standard WireGuard with token-based identity.

If Tailscale Inc. ever changed their licensing posture in a way that would have hurt Headscale, that would be a thing to think about. They haven't, and they've been good citizens about open-source-the-client + closed-the-control-plane balance. Worth watching, not worth panicking over.

## The bottom line

If you want a mesh networking primitive — your devices, your network, your rules — use Tailscale.

If you want a privacy posture for everyday consumer life — VPN + DNS + storage + utility apps + an anonymous identity — use Katafract.

If you want both, run both. They don't fight.

## Where to start with Katafract

- [Architecture overview](https://docs.katafract.io/architecture/overview) — the whole platform on one page
- [WraithVPN](https://katafract.com/apps/wraith) — the consumer-facing VPN with no email signup
- [Pricing](https://katafract.com/pricing) — Enclave $8/mo, Sovereign $18/mo
- [Trust → logs](https://docs.katafract.io/trust/logs/) — what the server sees, what it doesn't, how to verify each claim

— Tek
