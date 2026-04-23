export async function onRequestPost({ request }) {
  const body = await request.arrayBuffer();
  const upstream = new Request('https://pulse.katafract.io/api/event', {
    method: 'POST',
    headers: {
      'content-type': request.headers.get('content-type') || 'text/plain',
      'user-agent': request.headers.get('user-agent') || '',
      'x-forwarded-for':
        request.headers.get('cf-connecting-ip') ||
        request.headers.get('x-forwarded-for') ||
        '',
    },
    body,
  });
  return fetch(upstream);
}
