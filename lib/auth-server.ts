import 'server-only';
import firebaseConfig from '@/firebase-applet-config.json';

/**
 * Verifies a Firebase ID token without requiring the Admin SDK / a service
 * account, by asking Identity Toolkit to resolve it. An invalid, expired, or
 * forged token yields no user record.
 *
 * This exists so the AI routes cannot be called anonymously — otherwise anyone
 * who finds the endpoint can burn the project's Gemini quota.
 */
export async function verifyIdToken(
  idToken: string | undefined | null
): Promise<{ uid: string; email?: string } | null> {
  if (!idToken) return null;

  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
        cache: 'no-store',
      }
    );

    if (!res.ok) return null;
    const data = await res.json();
    const account = data?.users?.[0];
    if (!account?.localId) return null;

    return { uid: account.localId, email: account.email };
  } catch {
    return null;
  }
}

/** Pulls the bearer token out of an Authorization header. */
export function bearerFrom(request: Request): string | null {
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice(7).trim() || null;
}

/**
 * Best-effort per-user rate limit. Serverless instances don't share memory, so
 * this caps abuse per warm instance rather than globally — enough to stop a
 * runaway client loop, not a substitute for a real limiter at scale.
 */
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return true;
}
