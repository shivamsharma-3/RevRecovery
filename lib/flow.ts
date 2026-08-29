'use client';

import { db } from '@/firebase';
import { addDoc, collection, doc, getDocs, limit, query, updateDoc, where } from 'firebase/firestore';
import { logAuditAction } from '@/lib/audit';
import { parseAmount } from '@/lib/csv';

/**
 * Connective tissue between Claims, Patients and the Recovery queue.
 *
 * A triaged claim is the origin of everything downstream: when the engine
 * decides a balance is the patient's responsibility, that claim should become
 * a recovery case and a patient record without anyone retyping it. Without
 * this the three screens are independent lists that happen to share a nav.
 *
 * Patient references are never sent to the AI (see `lib/ai/api.ts`). They are
 * only ever written to the practice's own Firestore documents, which is why
 * it is safe to copy one between collections here.
 */

export type FlowClaim = {
  id: string;
  patientName?: string;
  patient?: string;
  amount?: number | string;
  date?: string;
  insurance?: string;
  denialReason?: string;
  aiPriority?: 'Low' | 'Medium' | 'High';
  aiRecoveryProbability?: number;
  aiPatientResponsibility?: boolean;
  recoveryCaseId?: string;
  patientId?: string;
};

/** Claims carry the reference under either key depending on when they were imported. */
export function claimPatientRef(claim: FlowClaim): string {
  return (claim.patientName || claim.patient || '').trim() || 'Unrecorded reference';
}

/**
 * Imported CSV amounts arrive as strings like "$1,240.00"; stored ones are
 * numbers. Delegates to the CSV parser rather than re-implementing it, so
 * accounting-negative values like "(120.00)" keep the same meaning here as
 * they had on import.
 */
export function claimAmount(claim: FlowClaim): number {
  if (typeof claim.amount === 'number') return Number.isFinite(claim.amount) ? claim.amount : 0;
  return parseAmount(String(claim.amount ?? '')) ?? 0;
}

export function daysOutstanding(dateStr?: string): number {
  if (!dateStr) return 0;
  const parsed = Date.parse(dateStr);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.round((Date.now() - parsed) / 86_400_000));
}

/** A claim belongs in the recovery queue once triage says the patient owes it. */
export function isRecoverable(claim: FlowClaim): boolean {
  return claim.aiPatientResponsibility === true && !claim.recoveryCaseId;
}

/**
 * Finds the patient this reference belongs to, or creates one. Balance is
 * incremented rather than overwritten so a patient with three outstanding
 * claims shows the real total. Callers must guard against sending the same
 * claim twice (see `isRecoverable`), or the balance will double-count.
 */
async function upsertPatient(uid: string, reference: string, amount: number) {
  const patientsRef = collection(db, 'users', uid, 'patients');
  const existing = await getDocs(query(patientsRef, where('name', '==', reference), limit(1)));

  if (!existing.empty) {
    const match = existing.docs[0];
    const previous = Number(match.data().balance) || 0;
    await updateDoc(match.ref, {
      balance: previous + amount,
      recoveryStatus: 'In Progress',
    });
    return { id: match.id, created: false };
  }

  const created = await addDoc(patientsRef, {
    name: reference,
    email: '',
    status: 'Active',
    recoveryStatus: 'In Progress',
    balance: amount,
    lastVisit: '',
    riskScore: 'Unscored',
    // Marks this as derived from a claim rather than entered by hand.
    source: 'claim',
  });
  return { id: created.id, created: true };
}

export type SendToRecoveryResult = {
  caseId: string;
  patientId: string;
  patientCreated: boolean;
  alreadyLinked: boolean;
};

/**
 * Moves one triaged claim into the recovery queue, creating the patient record
 * it implies. Idempotent: a claim already carrying a `recoveryCaseId` is
 * returned untouched rather than duplicated.
 */
export async function sendClaimToRecovery(
  uid: string,
  claim: FlowClaim,
  actor: string
): Promise<SendToRecoveryResult> {
  if (claim.recoveryCaseId) {
    return {
      caseId: claim.recoveryCaseId,
      patientId: claim.patientId ?? '',
      patientCreated: false,
      alreadyLinked: true,
    };
  }

  const reference = claimPatientRef(claim);
  const amount = claimAmount(claim);
  const patient = await upsertPatient(uid, reference, amount);

  const caseRef = await addDoc(collection(db, 'users', uid, 'recovery_cases'), {
    patient: reference,
    amount,
    days: daysOutstanding(claim.date),
    type: 'Patient responsibility',
    priority: claim.aiPriority || 'Medium',
    pipelineId: 'identified',
    // Back-references so the queue can show where a case came from.
    sourceClaimId: claim.id,
    sourceDenialReason: claim.denialReason || '',
    patientId: patient.id,
    createdAt: new Date().toISOString(),
  });

  await updateDoc(doc(db, 'users', uid, 'claims', claim.id), {
    recoveryCaseId: caseRef.id,
    patientId: patient.id,
  });

  await logAuditAction(uid, {
    user: actor,
    action: 'Sent Claim to Recovery Queue',
    target: `Claim ${claim.id} → case ${caseRef.id}`,
    status: 'Success',
    severity: 'Low',
    type: 'recovery',
    details: patient.created ? 'Created a new patient record' : 'Updated an existing patient record',
  });

  return { caseId: caseRef.id, patientId: patient.id, patientCreated: patient.created, alreadyLinked: false };
}
