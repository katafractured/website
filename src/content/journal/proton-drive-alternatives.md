---
title: Proton Drive alternatives — an honest comparison
description: Where Proton Drive is genuinely good, where it isn't, and the alternatives — including Vaultyx — laid out by what actually matters for zero-knowledge cloud storage.
pubDate: 2026-05-22
author: Tek
tags: [comparison, storage, vaultyx, proton]
draft: true
---

I'll start with the part most comparison posts skip: **Proton Drive is fine.** It's not the answer for everyone, but it's a real zero-knowledge product from a company that's earned its privacy reputation honestly.

The reason to write this post isn't to dunk on Proton. It's to lay out — accurately — where Proton Drive's design choices show, where they pinch, and what the alternatives actually do differently. So you can pick the one that fits your threat model instead of the one whose marketing reached you first.

## What Proton Drive does well

- **End-to-end encryption with audited code.** Proton publishes their crypto white papers and the encryption library is open source. This is unusual in the cloud-storage market and it matters.
- **Bundled identity with the rest of the Proton stack** — same login as Mail, Calendar, VPN, Pass. If you already live in the Proton ecosystem, Drive slots in cleanly.
- **Sharing flow that works.** You can share a folder, set an expiry, set a password. The sharing crypto involves a wrapped key and a recipient public key, the kind of design that survives a hostile audit.
- **Legitimate Swiss jurisdiction.** Proton is based in Switzerland; Swiss data protection law is genuinely stronger than US or UK law on this dimension.
- **Apps on every platform.** iOS, Android, macOS, Windows, web, Linux (sort of, via the web client and rclone).

If you want a cloud-storage product that's part of an ecosystem, Swiss-jurisdictioned, with end-to-end encryption you can read the source for, Proton Drive is a defensible answer.

## Where it pinches

A few specific design choices show up if you push on it.

**Identity is account-bound, not key-bound.** Your Drive's encryption keys are stored encrypted under credentials Proton holds. If you lose your password, Proton's recovery options can sometimes recover the keys (if you set up recovery files / phrases) and sometimes can't. The threat model assumes you trust Proton's account-server side enough to do the password-derivation routing correctly. This is a fair assumption in 99% of cases — but it does mean that "I have the key, you don't" isn't quite the right description of the system. The key is *unwrapped* with a password Proton's server is involved in checking.

**Filename and metadata exposure.** Proton encrypts the file content end-to-end. It also encrypts filenames. But the file *structure* (folder hierarchy size, file count per folder, modification times, sometimes file sizes) is visible to the server. This is the same trade-off most "encrypted cloud" products make. It's a real trade-off — for most threat models it's fine, for some it isn't.

**Pricing scales by storage tier, not by capability.** You pay $9.99/month for the Drive Plus tier (200 GB). To get Drive's full feature set you usually buy the bundle (Proton Unlimited is $9.99/mo for 500 GB plus Mail, VPN, Calendar, Pass). Storage-only at the higher tiers is more expensive than market rate, because you're partially paying for the bundle.

**The cloud-only model.** Proton Drive doesn't really have a "your home node is a cache, the cloud is the durability" model. It's cloud-first, sync-second. If you want a self-hosted cache or a hybrid where the cloud is just durable backup and your laptop is the source of truth, you're fighting the design.

**Web upload speed.** This is petty but real: web client uploads have historically been slow, particularly for large files, particularly compared to native sync clients. The native sync client on macOS / Windows is fine; the web is the soft underbelly.

## The alternatives, by category

### If your goal is "one bundle, one bill, end-to-end" — but Proton's specific trade-offs aren't right for you

**Vaultyx (Katafract Sovereign).** What I'm shipping. Disclosure: this is my product. The honest comparison:

- Encryption: AES-256-GCM, key derived from a 12-word BIP-39 phrase you generate on-device. Server stores ciphertext only.
- Filenames + folder structure: encrypted, including the manifest. Server does not have a "view filename" path, because the manifest itself is encrypted.
- Identity: Sigil token. No email-to-account binding. Stripe handles billing email separately; the file system knows nothing about it.
- Recovery: 12-word phrase. Lose it, the data is gone. There is no support-side reset.
- Pricing: $18/mo Sovereign tier includes 1 TB Vaultyx, plus the rest of the Katafract stack (multi-hop VPN, all utility apps, MeritMosaic unlimited, future apps). Standalone Vaultyx tiers run $1.99 / $9.99 / $39.99 monthly for 100 GB / 1 TB / 5 TB.
- Limits: Vaultyx is younger than Proton Drive. Sharing is read-only at present (V1); collaborative-edit / shared-folder is V2 and not yet shipped. Mac Finder selective-sync extension is V2. macOS only (no native Linux client yet). Be honest about the gaps; the core file storage is solid, the surrounding workflow is still being built out.
- Where Vaultyx is genuinely different from Proton Drive: the *manifest* is encrypted (Proton's manifest contents are encrypted but the structural metadata is visible to the server), and the identity is decoupled from the storage entirely (in Proton, Drive identity is a Proton account; in Vaultyx, it's an anonymous token).

### If your goal is "I want to host this myself"

**Cryptomator on top of any cloud.** Cryptomator gives you client-side encryption layered over Dropbox / Google Drive / iCloud / S3 / whatever. Free, open source. Works. Trade-off: the cloud provider sees the directory structure pattern Cryptomator creates, which is recognizable as "encrypted vault" — adversaries who care can see *that* you're using encrypted cloud storage, even though they can't read the contents. Sharing is awkward.

**Nextcloud + E2EE app.** Self-host the server, run the End-to-End Encryption app. You own the box. Trade-off: you also own the operations. If you ever stop maintaining it, your files go with the server. The audit posture depends on you doing the audit.

**Borg + rclone + B2.** Encrypted backups (not file sync) to Backblaze. Cheap, deeply rugged, technical to set up. Trade-off: it's a backup tool, not a "view this file from another device" tool.

### If your goal is "I want bigger storage, end-to-end isn't the priority"

**Backblaze B2 + Cryptomator** for cheap-as-it-gets storage with client-side encryption. **iDrive** is fine. **Tresorit** has end-to-end but the company has been acquired and re-acquired; track current ownership before committing.

### If your goal is "I want a VPN-bundled storage product but I don't want Proton"

**Mega.** Zero-knowledge cloud storage with generous free tier. The 2013 ownership history is checkered (Kim Dotcom, founder departure, settlement). Modern Mega is a different operation. Their crypto has had bugs in the past — the 2022 Mega leak showed flaws in their implementation that have since been patched. Worth knowing but not disqualifying.

**Internxt.** Zero-knowledge, Spain-based, smaller team, growing. Direct Vaultyx peer.

**iCloud+ Advanced Data Protection.** If you live entirely on Apple, this is genuinely the best zero-knowledge option for an Apple-native life. Opt-in, well-engineered, free above the standard iCloud tier (you pay for storage, not for ADP). Trade-off: Apple-only. ADP doesn't help you on Android or Linux, and certain categories (Mail, Contacts, Calendar) are *never* end-to-end even with ADP on.

## How to pick

A short decision tree.

| If you... | Look at |
|---|---|
| Are deep in the Apple ecosystem and only use Apple devices | iCloud+ with Advanced Data Protection on |
| Are deep in the Proton ecosystem and want one bill | Proton Unlimited (Drive included) |
| Want zero-knowledge with anonymous identity, no email signup, willing to write down a recovery phrase | Vaultyx (Katafract Sovereign) |
| Want a single bill for VPN + storage + utilities + DNS, prepared to evaluate a smaller-than-Proton company | Katafract Sovereign |
| Want full control, willing to be the operator | Nextcloud + E2EE OR Cryptomator + your existing cloud |
| Want cheap durable backup, no live sync | Borg + B2 OR Backblaze Personal |

If your threat model is "the cloud provider can never see filenames or structure," Vaultyx is the strict design choice. If your threat model is "Proton is in Switzerland, my account is tied to my identity, and I trust the recovery flow," Proton Drive is the cleaner answer.

Both are real products. Both have honest design trade-offs. Pick the one whose trade-off matches your threat model — not the one whose ad reached you first.

## Where to start with Vaultyx if you're curious

- [Vaultyx app page](https://katafract.com/apps/vaultyx) — what the app does in plain language
- [Vaultyx module docs](https://docs.katafract.io/modules/vaultyx/) — the architecture, the cipher choice, the chunk format
- [Pricing](https://katafract.com/pricing) — Sovereign tier ($18/mo) includes 1 TB, or standalone Vaultyx tiers
- [Trust → logs](https://docs.katafract.io/trust/logs/) — what the server does and doesn't see

— Tek
