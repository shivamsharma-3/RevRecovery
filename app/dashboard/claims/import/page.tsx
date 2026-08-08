'use client';

import React, { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Upload, ArrowLeft, ArrowRight, FileSpreadsheet, CheckCircle2,
  AlertTriangle, Loader2, Download,
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { db } from '@/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { logAuditAction } from '@/lib/audit';
import {
  parseCsv, parseAmount, parseDate, autoMapColumns, normaliseStatus,
  IMPORT_FIELDS, toCsv, type ClaimField,
} from '@/lib/csv';

type ParsedClaim = {
  patientName: string;
  amount: number;
  denialReason: string;
  date: string;
  insurance: string;
  procedureCode: string;
  status: string;
};

const SAMPLE_CSV = toCsv([
  ['Patient', 'Date of Service', 'Payer', 'Procedure Code', 'Billed Amount', 'Status', 'Denial Reason'],
  ['Jane Doe', '2026-06-14', 'Delta Dental', 'D2740', '1240.00', 'Denied', 'Missing documentation'],
  ['John Smith', '2026-05-02', 'Aetna', 'D7210', '680.00', 'Denied', 'Timely filing'],
  ['Ana Ruiz', '2026-07-01', 'MetLife', 'D2392', '310.00', 'Denied', 'Coordination of benefits'],
]);

export default function ImportClaimsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [rows, setRows] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [hasHeaderRow, setHasHeaderRow] = useState(true);
  const [mapping, setMapping] = useState<Partial<Record<ClaimField, number>>>({});
  const [fileName, setFileName] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const dataRows = useMemo(() => (hasHeaderRow ? rows.slice(1) : rows), [rows, hasHeaderRow]);

  const handleFile = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('That file is larger than 5MB. Split it and import in batches.');
      return;
    }
    const text = await file.text();
    const parsed = parseCsv(text);

    if (parsed.length === 0) {
      toast.error('That file appears to be empty.');
      return;
    }

    setFileName(file.name);
    setRows(parsed);
    setHeaders(parsed[0]);
    setMapping(autoMapColumns(parsed[0]));
    setHasHeaderRow(true);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const buildClaims = (): { claims: ParsedClaim[]; skipped: number } => {
    const claims: ParsedClaim[] = [];
    let skipped = 0;

    for (const row of dataRows) {
      const cell = (field: ClaimField) => {
        const index = mapping[field];
        return index === undefined ? '' : (row[index] ?? '').trim();
      };

      const amount = parseAmount(cell('amount'));
      // A row without a usable amount can't be triaged or prioritised, so it
      // is reported rather than silently imported as $0.
      if (amount === null) {
        skipped++;
        continue;
      }

      claims.push({
        patientName: cell('patientName') || 'Unknown',
        amount,
        denialReason: cell('denialReason') || '',
        date: parseDate(cell('date')) || new Date().toISOString().split('T')[0],
        insurance: cell('insurance') || '',
        procedureCode: cell('procedureCode') || '',
        status: normaliseStatus(cell('status')),
      });
    }

    return { claims, skipped };
  };

  const preview = useMemo(() => {
    if (!rows.length || mapping.amount === undefined) return { claims: [], skipped: 0 };
    return buildClaims();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, mapping, hasHeaderRow]);

  const handleImport = async () => {
    if (!user?.uid) return;
    const { claims, skipped } = buildClaims();

    if (claims.length === 0) {
      toast.error('No importable rows found. Check the Amount column mapping.');
      return;
    }

    setIsImporting(true);
    try {
      const claimsRef = collection(db, 'users', user.uid, 'claims');

      // Firestore caps a batch at 500 writes.
      for (let i = 0; i < claims.length; i += 400) {
        const batch = writeBatch(db);
        for (const claim of claims.slice(i, i + 400)) {
          batch.set(doc(claimsRef), { ...claim, importedAt: new Date().toISOString() });
        }
        await batch.commit();
      }

      await logAuditAction(user.uid, {
        user: user.displayName || user.email || 'User',
        action: 'Imported Claims',
        target: `${claims.length} claims from ${fileName}`,
        status: 'Success',
        severity: 'Medium',
        type: 'claim',
      });

      toast.success(
        `Imported ${claims.length} claim${claims.length === 1 ? '' : 's'}${
          skipped ? ` — ${skipped} row${skipped === 1 ? '' : 's'} skipped` : ''
        }`
      );
      router.push('/dashboard/claims');
    } catch (error) {
      console.error('Import failed:', error);
      toast.error('Import failed. Nothing was saved for the remaining rows.');
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'revrecover-claims-template.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const missingRequired = IMPORT_FIELDS.filter((f) => f.required && mapping[f.key] === undefined);

  return (
    <main className="p-6 md:p-10 max-w-5xl mx-auto">
      <Link
        href="/dashboard/claims"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to claims
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-headline mb-2">
          Import claims
        </h1>
        <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">
          Export your outstanding or denied claims report from your practice management system as
          CSV and drop it here. Column names do not need to match — we will map them and you can
          correct anything we get wrong.
        </p>
      </header>

      {rows.length === 0 ? (
        <div className="space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-[2rem] p-16 text-center cursor-pointer transition-all ${
              isDragging ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-teal-400 hover:bg-slate-50'
            }`}
          >
            <Upload className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-lg font-bold text-slate-700 mb-1">Drop a CSV here, or click to browse</p>
            <p className="text-sm text-slate-500">Up to 5MB. Nothing is uploaded to us — parsing happens in your browser.</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
          </div>

          <button
            onClick={downloadTemplate}
            className="inline-flex items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-800 transition-colors"
          >
            <Download className="w-4 h-4" /> Download a template CSV
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200 flex-wrap">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-5 h-5 text-teal-600" />
              <div>
                <p className="text-sm font-bold text-slate-900">{fileName}</p>
                <p className="text-xs text-slate-500">{dataRows.length} data rows</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <input
                  type="checkbox"
                  checked={hasHeaderRow}
                  onChange={(e) => {
                    setHasHeaderRow(e.target.checked);
                    if (e.target.checked) setMapping(autoMapColumns(rows[0]));
                  }}
                  className="rounded"
                />
                First row is a header
              </label>
              <button
                onClick={() => { setRows([]); setMapping({}); setFileName(''); }}
                className="text-xs font-bold text-slate-500 hover:text-slate-700 uppercase tracking-widest"
              >
                Choose another file
              </button>
            </div>
          </div>

          {/* Column mapping */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Match your columns</h2>
            <p className="text-sm text-slate-500 mb-5">
              Only Amount is required — but the more you map, the better the AI triage gets.
              Denial reason and date matter most.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {IMPORT_FIELDS.map((field) => (
                <div key={field.key} className="bg-white p-4 rounded-2xl border border-slate-200">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field.key === 'patientName' && (
                    <p className="text-[11px] text-slate-400 leading-snug mb-2 -mt-1">
                      Never sent to our AI provider. Stays in your account only — a claim ID or
                      initials work just as well here.
                    </p>
                  )}
                  <select
                    value={mapping[field.key] ?? ''}
                    onChange={(e) =>
                      setMapping((prev) => ({
                        ...prev,
                        [field.key]: e.target.value === '' ? undefined : Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="">— not in my file —</option>
                    {(hasHeaderRow ? headers : headers.map((_, i) => `Column ${i + 1}`)).map((h, i) => (
                      <option key={i} value={i}>{h || `Column ${i + 1}`}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </section>

          {/* Preview */}
          {mapping.amount !== undefined && (
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Preview
                <span className="ml-2 text-sm font-medium text-slate-500">
                  {preview.claims.length} importable
                  {preview.skipped > 0 && `, ${preview.skipped} skipped`}
                </span>
              </h2>

              {preview.skipped > 0 && (
                <div className="flex gap-3 p-4 mb-4 bg-amber-50 border border-amber-100 rounded-2xl">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 font-medium leading-relaxed">
                    {preview.skipped} row{preview.skipped === 1 ? '' : 's'} had no readable amount
                    and will be skipped. If that seems wrong, check the Amount column mapping.
                  </p>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      {['Patient', 'Date', 'Payer', 'Code', 'Amount', 'Status', 'Denial reason'].map((h) => (
                        <th key={h} className="text-left p-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.claims.slice(0, 8).map((c, i) => (
                      <tr key={i} className="border-b border-slate-50 last:border-0">
                        <td className="p-3 font-medium text-slate-900 whitespace-nowrap">{c.patientName}</td>
                        <td className="p-3 text-slate-500 whitespace-nowrap">{c.date}</td>
                        <td className="p-3 text-slate-500 whitespace-nowrap">{c.insurance || '—'}</td>
                        <td className="p-3 text-slate-500 whitespace-nowrap">{c.procedureCode || '—'}</td>
                        <td className="p-3 font-bold text-slate-900 whitespace-nowrap">${c.amount.toFixed(2)}</td>
                        <td className="p-3 text-slate-500 whitespace-nowrap">{c.status}</td>
                        <td className="p-3 text-slate-500 max-w-[220px] truncate">{c.denialReason || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {preview.claims.length > 8 && (
                  <p className="p-3 text-xs text-slate-400 font-medium border-t border-slate-50">
                    …and {preview.claims.length - 8} more
                  </p>
                )}
              </div>
            </section>
          )}

          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={handleImport}
              disabled={isImporting || missingRequired.length > 0 || preview.claims.length === 0}
              className="px-8 py-4 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50 flex items-center gap-2"
            >
              {isImporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
              {isImporting ? 'Importing…' : `Import ${preview.claims.length} claim${preview.claims.length === 1 ? '' : 's'}`}
            </button>
            {missingRequired.length > 0 && (
              <p className="text-sm text-slate-500 font-medium">
                Map the {missingRequired.map((f) => f.label).join(' and ')} column to continue.
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
