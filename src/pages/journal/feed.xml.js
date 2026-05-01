import { getCollection } from 'astro:content';

const SITE = 'https://katafract.com';
const TITLE = 'Katafract — Journal';
const DESC = 'Founder-voice writing on privacy architecture, the platform underneath, and what we ship and why.';

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const all = await getCollection('journal', ({ data }) => !data.draft);
  const posts = all.sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );

  const items = posts
    .map((p) => {
      const url = `${SITE}/journal/${p.slug}/`;
      return `    <item>
      <title>${escapeXml(p.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${p.data.pubDate.toUTCString()}</pubDate>
      <author>${escapeXml(p.data.author || 'Tek')}</author>
      <description>${escapeXml(p.data.description)}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(TITLE)}</title>
    <link>${SITE}/journal/</link>
    <description>${escapeXml(DESC)}</description>
    <language>en-us</language>
    <atom:link href="${SITE}/journal/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
      'cache-control': 'public, max-age=300',
    },
  });
}
