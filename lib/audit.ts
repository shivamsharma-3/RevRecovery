import { db } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export type AuditLogSeverity = 'Low' | 'Medium' | 'High' | 'Info';
export type AuditLogType = 'security' | 'system' | 'user' | 'claim' | 'campaign' | 'patient' | 'recovery' | 'clinic';

interface AuditLogData {
  user: string;
  action: string;
  target: string;
  status: 'Success' | 'Failed';
  severity: AuditLogSeverity;
  type: AuditLogType;
  ip?: string;
  details?: string;
}

export async function logAuditAction(userId: string, data: AuditLogData) {
  try {
    const logsRef = collection(db, 'users', userId, 'audit_logs');
    await addDoc(logsRef, {
      ...data,
      date: new Date().toISOString(),
      timestamp: serverTimestamp(),
      ip: data.ip || 'internal'
    });
  } catch (error) {
    console.error('Failed to log audit action:', error);
  }
}
