import { NextResponse } from 'next/server';
import { Type } from '@google/genai';
import { generateStructured, AiError, isAiConfigured } from '@/lib/ai/client';
import { CLAIM_ANALYST_SYSTEM } from '@/lib/ai/prompts';
import { verifyIdToken, bearerFrom, rateLimit } from '@/lib/auth-server';

export const runtime = 'nodejs';
export const maxDuration = 30;

const schema = {
  type: Type.OBJECT,
  properties: {
    recoveryProbability: {
      type: Type.NUMBER,
      description: 'Probability between 0 and 1 that this claim is recoverable from the payer.',
    },
    priority: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
    denialCategory: {
      type: Type.STRING,
      description: 'The denial category this claim falls into.',
    },
    rootCause: {
      type: Type.STRING,
      description: 'One or two sentences on why this claim was denied or is unpaid.',
    },
    recommendedAction: {
      type: Type.STRING,
      description: 'The specific next step a biller should take. Name the payer, document, or code involved.',
    },
    isPatientResponsibility: {
      type: Type.BOOLEAN,
      description: 'True when this is a contractual denial that should be billed to the patient rather than appealed.',
    },
    missingInformation: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Facts that were not supplied and would change the assessment. Empty array if none.',
    },
  },
  required: [
    'recoveryProbability',
    'priority',
    'denialCategory',
    'rootCause',
    'recommendedAction',
    'isPatientResponsibility',
    'missingInformation',
  ],
};

export async function POST(request: Request) {
  if (!isAiConfigured) {
    return NextResponse.json({ error: 'AI is not configured on this server.' }, { status: 503 });
  }

  const user = await verifyIdToken(bearerFrom(request));
  if (!user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  if (!rateLimit(`analyze:${user.uid}`, 30, 60_000)) {
    return NextResponse.json({ error: 'Too many requests. Please slow down.' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { patientName, amount, status, denialReason, date, payer, procedureCode, notes } = body as {
    patientName?: string;
    amount?: number;
    status?: string;
    denialReason?: string;
    date?: string;
    payer?: string;
    procedureCode?: string;
    notes?: string;
  };

  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    return NextResponse.json({ error: 'A numeric claim amount is required.' }, { status: 400 });
  }

  const ageDays = date ? Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000)) : null;

  const prompt = [
    'Analyse this claim and return the structured assessment.',
    '',
    `Amount billed: $${amount.toFixed(2)}`,
    `Current status: ${status || 'Unknown'}`,
    `Denial / hold reason: ${denialReason || 'Not recorded'}`,
    `Date of service: ${date || 'Not recorded'}`,
    ageDays !== null ? `Claim age: ${ageDays} days` : 'Claim age: unknown',
    `Payer: ${payer || 'Not recorded'}`,
    `Procedure code: ${procedureCode || 'Not recorded'}`,
    patientName ? `Patient reference: ${patientName}` : '',
    notes ? `Additional notes: ${notes}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const result = await generateStructured<Record<string, unknown>>({
      systemInstruction: CLAIM_ANALYST_SYSTEM,
      prompt,
      schema,
      temperature: 0.15,
    });

    // The schema constrains the shape but not the range.
    const p = Number(result.recoveryProbability);
    result.recoveryProbability = Number.isFinite(p) ? Math.min(1, Math.max(0, p)) : 0;

    return NextResponse.json(result);
  } catch (err) {
    const status = err instanceof AiError ? err.status : 500;
    const message = err instanceof AiError ? err.message : 'Claim analysis failed.';
    if (status >= 500) console.error('analyze-claim failed:', err);
    return NextResponse.json({ error: message }, { status });
  }
}
