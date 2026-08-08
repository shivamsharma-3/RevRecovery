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

/** Calls a protected AI route with the caller's Firebase ID token attached. */
async function callAi<T>(path: string, payload: unknown): Promise<T> {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('You need to be signed in to use the AI engine.');

  const token = await currentUser.getIdToken();

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
    throw new Error(data?.error || 'The AI engine could not complete that request.');
  }
  return data as T;
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
