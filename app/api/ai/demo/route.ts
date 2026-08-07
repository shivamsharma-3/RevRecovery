import { NextResponse } from 'next/server';
import { Type } from '@google/genai';
import { generateStructured, AiError, isAiConfigured } from '@/lib/ai/client';
import { CLAIM_ANALYST_SYSTEM } from '@/lib/ai/prompts';
import { rateLimit } from '@/lib/auth-server';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * Public, unauthenticated demo of the claim analyser.
 *
 * This exists so a prospect can judge the product before creating an account.
 * It is deliberately tighter than the authenticated route: capped input,
 * a small per-IP quota, and no appeal-letter generation (the expensive call).
 */

const schema = {
  type: Type.OBJECT,
  properties: {
    recoveryProbability: { type: Type.NUMBER },
    priority: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
    denialCategory: { type: Type.STRING },
    rootCause: { type: Type.STRING },
    recommendedAction: { type: Type.STRING },
    isPatientResponsibility: { type: Type.BOOLEAN },
  },
  required: [
    'recoveryProbability', 'priority', 'denialCategory',
    'rootCause', 'recommendedAction', 'isPatientResponsibility',
  ],
};

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

export async function POST(request: Request) {
  if (!isAiConfigured) {
    return NextResponse.json({ error: 'The demo is temporarily unavailable.' }, { status: 503 });
  }

  let body: { amount?: unknown; denialReason?: unknown; ageDays?: unknown; payer?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const amount = Number(body.amount);
  const denialReason = String(body.denialReason ?? '').trim().slice(0, 300);
  const ageDays = Number.isFinite(Number(body.ageDays)) ? Math.max(0, Math.min(3650, Number(body.ageDays))) : null;
  const payer = String(body.payer ?? '').trim().slice(0, 80);

  if (!Number.isFinite(amount) || amount <= 0 || amount > 1_000_000) {
    return NextResponse.json({ error: 'Enter a claim amount between $1 and $1,000,000.' }, { status: 400 });
  }
  if (denialReason.length < 3) {
    return NextResponse.json({ error: 'Enter the denial reason from the remittance advice.' }, { status: 400 });
  }

  // Charged only once the request is well-formed, so a typo doesn't cost a
  // prospect one of their demo runs.
  if (!rateLimit(`demo:${clientIp(request)}`, 15, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: "That's the demo limit for now. Sign in to run this across your whole denial list." },
      { status: 429 }
    );
  }

  const prompt = [
    'Analyse this claim and return the structured assessment.',
    '',
    `Amount billed: $${amount.toFixed(2)}`,
    'Current status: Denied',
    `Denial / hold reason: ${denialReason}`,
    ageDays !== null ? `Claim age: ${ageDays} days` : 'Claim age: unknown',
    payer ? `Payer: ${payer}` : 'Payer: Not recorded',
    '',
    'Do not include any patient-identifying information in your response.',
  ].join('\n');

  try {
    const result = await generateStructured<Record<string, unknown>>({
      systemInstruction: CLAIM_ANALYST_SYSTEM,
      prompt,
      schema,
      temperature: 0.15,
    });

    const p = Number(result.recoveryProbability);
    result.recoveryProbability = Number.isFinite(p) ? Math.min(1, Math.max(0, p)) : 0;

    return NextResponse.json(result);
  } catch (err) {
    const status = err instanceof AiError ? err.status : 500;
    const message = err instanceof AiError ? err.message : 'The demo could not complete that request.';
    if (status >= 500) console.error('demo analyse failed:', err);
    return NextResponse.json({ error: message }, { status });
  }
}
