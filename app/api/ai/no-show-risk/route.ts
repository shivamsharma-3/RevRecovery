import { NextResponse } from 'next/server';
import { Type } from '@google/genai';
import { generateStructured, AiError, isAiConfigured } from '@/lib/ai/client';
import { NO_SHOW_SYSTEM } from '@/lib/ai/prompts';
import { verifyIdToken, bearerFrom, rateLimit } from '@/lib/auth-server';

export const runtime = 'nodejs';
export const maxDuration = 30;

const schema = {
  type: Type.OBJECT,
  properties: {
    riskScore: {
      type: Type.NUMBER,
      description: 'Probability between 0 and 1 that the patient does not attend.',
    },
    riskBand: { type: Type.STRING, enum: ['Minimal', 'Low', 'Medium', 'High'] },
    drivingFactors: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'The specific factors from the supplied data that drove this score.',
    },
    recommendedIntervention: {
      type: Type.STRING,
      description: 'One concrete action the front desk should take for this patient.',
    },
    confidence: {
      type: Type.STRING,
      enum: ['Low', 'Medium', 'High'],
      description: 'How much signal the supplied data actually carried.',
    },
  },
  required: ['riskScore', 'riskBand', 'drivingFactors', 'recommendedIntervention', 'confidence'],
};

export async function POST(request: Request) {
  if (!isAiConfigured) {
    return NextResponse.json({ error: 'AI is not configured on this server.' }, { status: 503 });
  }

  const user = await verifyIdToken(bearerFrom(request));
  if (!user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  if (!rateLimit(`noshow:${user.uid}`, 40, 60_000)) {
    return NextResponse.json({ error: 'Too many requests. Please slow down.' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  // patientName is intentionally destructured and discarded: it must never
  // reach the model. See lib/ai/client.ts header comment for why.
  const {
    appointmentType,
    appointmentDate,
    bookedDate,
    priorNoShows,
    priorCancellations,
    isNewPatient,
    outstandingBalance,
    lastVisit,
    confirmed,
    rescheduleCount,
  } = body as Record<string, unknown>;

  const leadTimeDays =
    appointmentDate && bookedDate
      ? Math.max(
          0,
          Math.floor(
            (new Date(String(appointmentDate)).getTime() - new Date(String(bookedDate)).getTime()) /
              86_400_000
          )
        )
      : null;

  const prompt = [
    'Estimate no-show risk for this scheduled appointment.',
    '',
    `Appointment type: ${appointmentType || 'Not recorded'}`,
    `Appointment date/time: ${appointmentDate || 'Not recorded'}`,
    leadTimeDays !== null ? `Lead time: ${leadTimeDays} days between booking and appointment` : 'Lead time: unknown',
    `Prior no-shows: ${priorNoShows ?? 'Not recorded'}`,
    `Prior late cancellations: ${priorCancellations ?? 'Not recorded'}`,
    `New patient: ${isNewPatient === undefined ? 'Not recorded' : isNewPatient ? 'Yes' : 'No'}`,
    `Outstanding balance: ${
      typeof outstandingBalance === 'number' ? `$${outstandingBalance.toFixed(2)}` : 'Not recorded'
    }`,
    `Last visit: ${lastVisit || 'Not recorded'}`,
    `Appointment confirmed: ${confirmed === undefined ? 'Not recorded' : confirmed ? 'Yes' : 'No'}`,
    `Times rescheduled: ${rescheduleCount ?? 'Not recorded'}`,
    '',
    'Where a field says "Not recorded", treat it as unknown and lower your confidence accordingly. Do not assume the worst.',
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const result = await generateStructured<Record<string, unknown>>({
      systemInstruction: NO_SHOW_SYSTEM,
      prompt,
      schema,
      temperature: 0.15,
    });

    const s = Number(result.riskScore);
    result.riskScore = Number.isFinite(s) ? Math.min(0.95, Math.max(0.03, s)) : 0.08;

    return NextResponse.json(result);
  } catch (err) {
    const status = err instanceof AiError ? err.status : 500;
    const message = err instanceof AiError ? err.message : 'Risk scoring failed.';
    if (status >= 500) console.error('no-show-risk failed:', err);
    return NextResponse.json({ error: message }, { status });
  }
}
