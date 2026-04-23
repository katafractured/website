#!/usr/bin/env python3
"""Convert a plain HTML marketing page to an Astro page using Base layout.

Usage: python3 convert-to-astro.py <source.html> <dest.astro> <section>

Extracts title, description, og:description, og:image, twitter:card, inline
<style>, JSON-LD schemas, and the body between </nav> and <footer>. Writes a
.astro file that uses the Base layout + slots.

Internal links: .html suffix stripped; platform/ prefix normalised; about.html,
privacy.html, etc. become /about, /privacy.

This is a one-way converter. Review output before trusting it.
"""
import re
import sys
from pathlib import Path
from html import escape

src = Path(sys.argv[1])
dest = Path(sys.argv[2])
section = sys.argv[3] if len(sys.argv) > 3 else "home"

html = src.read_text()

def extract_meta(name, attr="name"):
    m = re.search(rf'<meta\s+{attr}="{re.escape(name)}"\s+content="([^"]*)"', html)
    return m.group(1) if m else None

title_m = re.search(r"<title>([^<]*)</title>", html)
title = title_m.group(1) if title_m else src.stem.title()
description = extract_meta("description") or ""
og_description = extract_meta("og:description", "property") or description
og_image = extract_meta("og:image", "property")
twitter_card = extract_meta("twitter:card")

# Inline <style> — take the first block in <head>
style_blocks = re.findall(r"<style>(.*?)</style>", html, re.DOTALL)
# JSON-LD schemas
jsonld_blocks = re.findall(
    r'<script\s+type="application/ld\+json">(.*?)</script>', html, re.DOTALL
)

# Body content: between </nav> (last one in head area) and <footer>.
# Strategy: drop everything before the first </nav> closing tag AFTER <body>, and
# everything from the first <footer> to end.
body_start = html.find("</nav>")
if body_start < 0:
    print(f"[{src}] cannot find </nav>", file=sys.stderr)
    sys.exit(1)
body_start += len("</nav>")
body_end = html.find("<footer", body_start)
if body_end < 0:
    print(f"[{src}] cannot find <footer>", file=sys.stderr)
    sys.exit(1)
body = html[body_start:body_end].strip()

# Tail scripts (between </footer> and </body>) — often has IntersectionObserver etc.
tail_start = html.find("</footer>")
tail_end = html.find("</body>")
tail_scripts = ""
if tail_start >= 0 and tail_end > tail_start:
    tail = html[tail_start + len("</footer>") : tail_end].strip()
    # Keep only <script>...</script> blocks, drop stray whitespace
    scripts = re.findall(r"<script\b[^>]*>.*?</script>", tail, re.DOTALL)
    tail_scripts = "\n".join(scripts).strip()

def normalise_links(s: str) -> str:
    # 1. Strip .html from same-origin references
    s = re.sub(r'href="([^"]*?)\.html(#[^"]*)?"', r'href="\1\2"', s)
    # 2. Replace trailing /index references
    s = s.replace('href="index"', 'href="/"')
    # 3. Normalise relative prefixes → absolute
    # ../pricing -> /pricing, ../../platform/sigil -> /platform/sigil
    s = re.sub(r'href="(?:\.\./)+([^"]+)"', r'href="/\1"', s)
    # 4. Bare relative (not starting with /, http, #, mailto, tel) -> /
    def abs_link(m):
        url = m.group(1)
        if url.startswith(("http", "//", "#", "mailto:", "tel:", "/")):
            return f'href="{url}"'
        return f'href="/{url}"'

    s = re.sub(r'href="([^"]+)"', abs_link, s)
    return s

body = normalise_links(body)
jsonld_norm = [normalise_links(b) for b in jsonld_blocks]

# Astro uses {expression} syntax in JSX; we need to escape curly braces in raw
# HTML/CSS/JS that gets slotted directly. Easiest: wrap tricky content in
# `<Fragment set:html={`...`}>` OR use `is:raw` directive on parent. Astro's
# `<style>` and `<script>` blocks skip JSX parsing by default, but slotted
# content in JSX-parsed regions (the body) needs braces escaped or wrapped.
#
# We'll use the Fragment + set:html pattern for the body so it ships verbatim.

def jsify(s: str) -> str:
    # Escape backticks and ${ for template literal
    return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")

body_tpl = jsify(body)

# OG image prop — only pass if explicitly set and differs from default
og_image_prop = ""
if og_image and og_image not in (
    "https://katafract.com/images/og-home.jpg",
    "/images/og-home.jpg",
):
    og_image_prop = f'\n  ogImage="{og_image}"'

twitter_card_prop = ""
if twitter_card and twitter_card != "summary_large_image":
    twitter_card_prop = f'\n  twitterCard="{twitter_card}"'

og_desc_prop = ""
if og_description and og_description != description:
    og_desc_prop = f'\n  ogDescription={{`{jsify(og_description)}`}}'

# Build the .astro file
out = []
out.append("---")
abs_dest = dest.resolve()
rel_parts = abs_dest.relative_to(Path("/tmp/kw-astro/src/pages").resolve()).parts[:-1]
# one level to climb out of pages/, plus one per subdir
ups = [".."] * (len(rel_parts) + 1)
up = "/".join(ups)
out.append(f"import Base from '{up}/layouts/Base.astro';")
out.append("---")
out.append(f'<Base')
out.append(f'  title={{`{jsify(title)}`}}')
out.append(f'  description={{`{jsify(description)}`}}')
out.append(f'  section="{section}"{og_desc_prop}{og_image_prop}{twitter_card_prop}')
out.append(">")
out.append("  <link slot=\"head\" rel=\"stylesheet\" href=\"/style.css\" />")
# Inline styles as slotted head
for sb in style_blocks:
    out.append('  <style slot="head" is:global set:html={`' + jsify(sb) + '`}></style>')
# JSON-LD
for jb in jsonld_norm:
    out.append(
        '  <script slot="head" type="application/ld+json" is:inline set:html={`'
        + jsify(jb)
        + "`}></script>"
    )
# Body via Fragment so we don't re-parse the HTML
out.append('  <Fragment set:html={`' + body_tpl + '`} />')
# Tail scripts
if tail_scripts:
    out.append(
        '  <script slot="scripts" is:inline set:html={`'
        + jsify(tail_scripts.replace("<script>", "").replace("</script>", ""))
        + "`}></script>"
    )
out.append("</Base>")

dest.parent.mkdir(parents=True, exist_ok=True)
dest.write_text("\n".join(out) + "\n")
print(f"[ok] {src} -> {dest}  style={len(style_blocks)} jsonld={len(jsonld_blocks)} body={len(body)}b tail_scripts={bool(tail_scripts)}")
