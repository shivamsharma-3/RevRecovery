'use client';

import { auth } from '@/firebase';

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
  patientName?: string;
  amount: number;
  status?: string;
  denialReason?: string;
  date?: string;
  payer?: string;
  procedureCode?: string;
  notes?: string;
}) => callAi<ClaimAnalysis>('/api/ai/analyze-claim', payload);

export const generateAppealLetter = (payload: {
  patientName?: string;
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

export const scoreNoShowRisk = (payload: {
  patientName?: string;
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
