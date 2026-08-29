'use client';

import { auth } from '@/firebase';

/**
 * None of these payload types accept a patient name — that's deliberate, not
 * an oversight. The public Gemini API has no HIPAA BAA, so no identifier may
 * ever be sent to it. Do not add `patientName` back to these types; if a
 * caller needs a personalised appeal letter, use
 * `personaliseAppealLetter` below, which fills the name in locally instead.
 */

export type ClaimAnalysis = {
  recoveryProbability: number;
  priority: 'Low' | 'Medium' | 'High';
  denialCategory: string;
  rootCause: string;
  recommendedAction: string;
  isPatientResponsibility: boolean;
  missingInformation: string[];
};

export type NoShowRisk = {
  riskScore: number;
  riskBand: 'Minimal' | 'Low' | 'Medium' | 'High';
  drivingFactors: string[];
  recommendedIntervention: string;
  confidence: 'Low' | 'Medium' | 'High';
};

/**
 * Statuses worth trying again. 502/500 are what the server returns when the
 * upstream model is briefly unavailable or hands back malformed JSON — those
 * clear on their own. Deliberately absent: 400/401/403 (the request itself is
 * wrong), 503 (AI is not configured on this server) and 429 (rate limited or
 * out of quota — retrying immediately only makes it worse).
 */
const RETRYABLE_STATUSES = new Set([408, 500, 502, 504]);

const RETRY_DELAY_MS = 1_200;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Thrown when the response carried a status; lets callers reason about it. */
class AiRequestError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'AiRequestError';
    this.status = status;
  }
}

async function attemptAi<T>(path: string, payload: unknown, token: string): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new AiRequestError(
      data?.error || 'The AI engine could not complete that request.',
      res.status
    );
  }
  return data as T;
}

/**
 * Calls a protected AI route with the caller's Firebase ID token attached.
 *
 * Retries once on a transient failure. Every route behind this is a read-only
 * analysis or a draft generation, so replaying a request is safe — nothing is
 * written server-side. A single automatic retry is enough to stop a blip in
 * the model provider reading to the user as a broken product.
 */
async function callAi<T>(path: string, payload: unknown, retries = 1): Promise<T> {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('You need to be signed in to use the AI engine.');

  const token = await currentUser.getIdToken();

  for (let attempt = 0; ; attempt += 1) {
    try {
      return await attemptAi<T>(path, payload, token);
    } catch (error) {
      const isLastAttempt = attempt >= retries;
      // A thrown fetch (rather than a bad status) means the request never
      // landed — a dropped connection or a flaky network. Worth one retry.
      const isNetworkError = !(error instanceof AiRequestError);
      const isTransient =
        isNetworkError || RETRYABLE_STATUSES.has((error as AiRequestError).status);

      if (isLastAttempt || !isTransient) {
        if (isNetworkError) {
          throw new Error('Could not reach the AI engine. Check your connection and try again.');
        }
        throw new Error((error as AiRequestError).message);
      }

      await wait(RETRY_DELAY_MS);
    }
  }
}

export const analyzeClaim = (payload: {
  amount: number;
  status?: string;
  denialReason?: string;
  date?: string;
  payer?: string;
  procedureCode?: string;
  notes?: string;
}) => callAi<ClaimAnalysis>('/api/ai/analyze-claim', payload);

const APPEAL_LETTER_PLACEHOLDER = '[PATIENT NAME]';

/**
 * Drafts an appeal letter. The server always writes the literal placeholder
 * `[PATIENT NAME]` — it never receives a real one to write in its place.
 */
const generateAppealLetterRaw = (payload: {
  amount?: number;
  denialReason: string;
  date?: string;
  payer?: string;
  procedureCode?: string;
  practiceName?: string;
  providerName?: string;
  claimNumber?: string;
  clinicalNotes?: string;
}) => callAi<{ letter: string }>('/api/ai/appeal-letter', payload);

/**
 * Drafts an appeal letter and fills the patient's name in locally, in the
 * browser, so it never crosses the network to the AI provider. `patientName`
 * is optional on purpose: leave it out (or pass an anonymised reference) and
 * the returned letter keeps the bracketed placeholder for the practice to
 * fill in by hand instead.
 */
export async function generateAppealLetter(
  payload: Parameters<typeof generateAppealLetterRaw>[0] & { patientName?: string }
): Promise<{ letter: string }> {
  const { patientName, ...rest } = payload;
  const { letter } = await generateAppealLetterRaw(rest);

  if (!patientName?.trim()) return { letter };

  return { letter: letter.split(APPEAL_LETTER_PLACEHOLDER).join(patientName.trim()) };
}

export const scoreNoShowRisk = (payload: {
  appointmentType?: string;
  appointmentDate?: string;
  bookedDate?: string;
  priorNoShows?: number;
  priorCancellations?: number;
  isNewPatient?: boolean;
  outstandingBalance?: number;
  lastVisit?: string;
  confirmed?: boolean;
  rescheduleCount?: number;
}) => callAi<NoShowRisk>('/api/ai/no-show-risk', payload);
