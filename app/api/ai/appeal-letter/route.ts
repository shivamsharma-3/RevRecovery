import { NextResponse } from 'next/server';
import { generateText, AiError, isAiConfigured } from '@/lib/ai/client';
import { APPEAL_LETTER_SYSTEM } from '@/lib/ai/prompts';
import { verifyIdToken, bearerFrom, rateLimit } from '@/lib/auth-server';

export const runtime = 'nodejs';
export const maxDuration = 45;

export async function POST(request: Request) {
  if (!isAiConfigured) {
    return NextResponse.json({ error: 'AI is not configured on this server.' }, { status: 503 });
  }

  const user = await verifyIdToken(bearerFrom(request));
  if (!user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  if (!rateLimit(`appeal:${user.uid}`, 12, 60_000)) {
    return NextResponse.json({ error: 'Too many requests. Please slow down.' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const {
    patientName,
    amount,
    denialReason,
    date,
    payer,
    procedureCode,
    practiceName,
    providerName,
    claimNumber,
    clinicalNotes,
  } = body as Record<string, string | number | undefined>;

  if (!denialReason) {
    return NextResponse.json(
      { error: 'A denial reason is required to draft an appeal.' },
      { status: 400 }
    );
  }

  const prompt = [
    'Draft an appeal letter for the following denied claim.',
    '',
    `Patient: ${patientName || '[PATIENT NAME]'}`,
    `Payer: ${payer || '[PAYER NAME]'}`,
    `Claim number: ${claimNumber || '[CLAIM NUMBER]'}`,
    `Date of service: ${date || '[DATE OF SERVICE]'}`,
    `Procedure code: ${procedureCode || '[PROCEDURE CODE]'}`,
    `Billed amount: ${typeof amount === 'number' ? `$${amount.toFixed(2)}` : '[AMOUNT]'}`,
    `Denial reason given by payer: ${denialReason}`,
    `Practice: ${practiceName || '[PRACTICE NAME]'}`,
    `Treating provider: ${providerName || '[PROVIDER NAME]'}`,
    clinicalNotes ? `Clinical detail supplied by the practice: ${clinicalNotes}` : '',
    '',
    'Use bracketed placeholders for anything not supplied above. Do not invent clinical facts.',
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const letter = await generateText({
      systemInstruction: APPEAL_LETTER_SYSTEM,
      prompt,
      temperature: 0.4,
    });
    return NextResponse.json({ letter });
  } catch (err) {
    const status = err instanceof AiError ? err.status : 500;
    const message = err instanceof AiError ? err.message : 'Appeal generation failed.';
    if (status >= 500) console.error('appeal-letter failed:', err);
    return NextResponse.json({ error: message }, { status });
  }
}
