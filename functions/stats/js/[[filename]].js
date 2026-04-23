export async function onRequestGet({ request, params }) {
  const filename = Array.isArray(params.filename)
    ? params.filename.join('/')
    : params.filename;
  if (!filename.endsWith('.js')) {
    return new Response('Not Found', { status: 404 });
  }
  const upstream = 'https://pulse.katafract.io/js/' + filename;
  const res = await fetch(upstream, {
    cf: { cacheTtl: 3600, cacheEverything: true },
  });
  return new Response(res.body, {
    status: res.status,
    headers: {
      'content-type': 'application/javascript; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
}
