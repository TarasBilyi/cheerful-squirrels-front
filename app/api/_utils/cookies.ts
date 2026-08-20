import { cookies } from 'next/headers';
import { parse } from 'cookie';

// Attribute keys `cookie.parse` may pick up from a raw Set-Cookie string
// alongside the actual cookie name — everything else in the parsed object
// is the cookie's own name=value pair.
const ATTRIBUTE_KEYS = new Set(['path', 'expires', 'max-age', 'domain', 'samesite']);

// The backend's own auth cookie names (confirmed via DevTools ->
// Network -> /auth/login -> Set-Cookie). Only these are re-issued as
// first-party cookies; anything else the backend might send is ignored.
const BACKEND_AUTH_COOKIE_NAMES = new Set(['accessToken', 'refreshToken', 'sessionId']);

/** Cookie header to send to the backend, forwarding whatever the browser sent us. */
export async function cookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.toString();
}

/**
 * Re-sets the backend's auth cookies (accessToken/refreshToken/sessionId)
 * from a `Set-Cookie` response header as this app's own cookies. Because
 * we don't forward the backend's `Domain` attribute (we just don't read
 * it), the browser scopes the cookie to *this* app's own host —
 * first-party, immune to third-party cookie blocking (notably iOS
 * Safari/WebKit, which blocks cross-site cookies by default on every
 * mobile browser there, unlike most desktop browsers).
 *
 * `cookie.parse` only captures key=value pairs, so flag-only attributes
 * like `HttpOnly`/`Secure` on the original cookie aren't visible here —
 * we re-apply that security posture explicitly instead, since these are
 * always auth cookies that must never be readable by browser JS.
 *
 * Returns true if at least one recognized auth cookie was set.
 */
export async function forwardSetCookies(
  setCookieHeader: string | string[] | undefined
): Promise<boolean> {
  if (!setCookieHeader) return false;

  const cookieStore = await cookies();
  const cookieArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
  let didSet = false;

  for (const cookieStr of cookieArray) {
    const parsed = parse(cookieStr);
    const nameEntry = Object.entries(parsed).find(
      ([key]) => !ATTRIBUTE_KEYS.has(key.toLowerCase()) && BACKEND_AUTH_COOKIE_NAMES.has(key)
    );
    if (!nameEntry) continue;

    const [name, value] = nameEntry;
    const maxAgeRaw = parsed['Max-Age'];

    cookieStore.set(name, value ?? '', {
      path: parsed.Path ?? '/',
      expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
      maxAge: maxAgeRaw !== undefined ? Number(maxAgeRaw) : undefined,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    didSet = true;
  }

  return didSet;
}
