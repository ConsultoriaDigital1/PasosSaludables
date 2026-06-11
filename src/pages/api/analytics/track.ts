import type { APIRoute } from 'astro';
import { db } from '../../../lib/database';
import { parseUserAgent } from '../../../lib/userAgent';

const ID_PATTERN = /^[a-z0-9-]{6,64}$/i;

function cleanPath(input: unknown): string {
  if (typeof input !== 'string') return '/';
  const path = input.trim().slice(0, 300);
  return path.startsWith('/') ? path : '/';
}

function cleanReferrer(input: unknown, requestUrl: URL): string {
  if (typeof input !== 'string' || !input.trim()) return '';
  try {
    const url = new URL(input.trim());
    // El trafico interno (navegacion dentro del propio sitio) cuenta como directo..
    if (url.hostname === requestUrl.hostname) return '';
    return url.hostname.slice(0, 120);
  } catch {
    return '';
  }
}

const EVENT_TYPES = ['pageview', 'heartbeat', 'add_to_cart'] as const;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => null);
    const eventType = EVENT_TYPES.includes(body?.type) ? body.type : 'pageview';
    const visitorId = typeof body?.visitorId === 'string' ? body.visitorId.trim() : '';
    const sessionId = typeof body?.sessionId === 'string' ? body.sessionId.trim() : '';

    if (!ID_PATTERN.test(visitorId) || !ID_PATTERN.test(sessionId)) {
      return new Response(JSON.stringify({ ok: false }), { status: 400 });
    }

    const parsed = parseUserAgent(request.headers.get('user-agent') || '');

    if (parsed.isBot) {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    const productId = Number(body?.productId);
    const productName =
      typeof body?.productName === 'string' ? body.productName.trim().slice(0, 200) : '';

    await db.analytics.track({
      eventType,
      visitorId,
      sessionId,
      path: cleanPath(body?.path),
      referrer: cleanReferrer(body?.referrer, new URL(request.url)),
      deviceType: parsed.deviceType,
      browser: parsed.browser,
      os: parsed.os,
      productId:
        eventType === 'add_to_cart' && Number.isInteger(productId) && productId > 0
          ? productId
          : null,
      productName: eventType === 'add_to_cart' ? productName : ''
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch {
    // El tracking nunca debe romper la navegacion del visitante.
    return new Response(JSON.stringify({ ok: false }), { status: 200 });
  }
};
