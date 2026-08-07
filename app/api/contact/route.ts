import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

/**
 * Resend requires a verified sending domain. Until one is set up, `onboarding@resend.dev`
 * works but will only deliver to the address that owns the Resend account.
 */
const FROM = process.env.CONTACT_FROM_EMAIL || 'RevRecover AI <onboarding@resend.dev>';
const TO = process.env.CONTACT_TO_EMAIL;

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string)
  );

type Payload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  organization?: string;
  message?: string;
  /** Honeypot — real users never fill this. */
  website?: string;
};

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !TO) {
    console.error('Contact form is not configured: RESEND_API_KEY or CONTACT_TO_EMAIL missing.');
    return NextResponse.json(
      { error: 'The contact form is not configured yet. Please email us directly.' },
      { status: 503 }
    );
  }

  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  // Silently accept and drop bot submissions so they don't retry.
  if (body.website) return NextResponse.json({ ok: true });

  const firstName = (body.firstName || '').trim();
  const lastName = (body.lastName || '').trim();
  const email = (body.email || '').trim();
  const organization = (body.organization || '').trim();
  const message = (body.message || '').trim();

  if (!firstName || !lastName || !email || !message) {
    return NextResponse.json(
      { error: 'Please fill in your name, email, and message.' },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }
  if (message.length > 5000) {
    return NextResponse.json({ error: 'That message is too long.' }, { status: 400 });
  }

  const html = `
    <h2>New enquiry from revrecovery.vercel.app</h2>
    <p><strong>Name:</strong> ${escapeHtml(`${firstName} ${lastName}`)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Organisation:</strong> ${escapeHtml(organization || 'Not provided')}</p>
    <hr />
    <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
  `;

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: email,
        subject: `RevRecover enquiry — ${firstName} ${lastName}${organization ? ` (${organization})` : ''}`,
        html,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error('Resend rejected the message:', res.status, detail);
      return NextResponse.json(
        { error: 'We could not send your message. Please email us directly.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact form send failed:', err);
    return NextResponse.json(
      { error: 'We could not send your message. Please email us directly.' },
      { status: 502 }
    );
  }
}
