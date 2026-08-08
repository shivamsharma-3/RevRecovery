/**
 * Minimal RFC-4180-ish CSV handling.
 *
 * Practice management exports are messy: quoted fields containing commas,
 * embedded newlines in notes columns, currency symbols, and BOMs from Excel.
 * A naive split(',') mangles all of those, so we parse properly.
 */

export function parseCsv(text: string): string[][] {
  // Strip UTF-8 BOM that Excel loves to prepend.
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\r') {
      // handled by the \n branch
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }

  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.some((cell) => cell.trim() !== ''));
}

export function toCsv(rows: (string | number | null | undefined)[][]): string {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          const value = cell === null || cell === undefined ? '' : String(cell);
          return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
        })
        .join(',')
    )
    .join('\n');
}

/** Pulls a number out of "$1,234.50", "(120.00)", "1234.5" etc. */
export function parseAmount(raw: string): number | null {
  if (!raw) return null;
  const negative = /^\s*\(.*\)\s*$/.test(raw);
  const cleaned = raw.replace(/[^0-9.-]/g, '');
  if (!cleaned || cleaned === '-' || cleaned === '.') return null;
  const value = Number.parseFloat(cleaned);
  if (Number.isNaN(value)) return null;
  return negative ? -Math.abs(value) : value;
}

/** Best-effort date normalisation to ISO yyyy-mm-dd. Returns null if unparseable. */
export function parseDate(raw: string): string | null {
  if (!raw?.trim()) return null;
  const trimmed = raw.trim();

  // Disambiguate the common US export format explicitly — Date.parse treats
  // bare dd/mm/yyyy as mm/dd/yyyy and silently produces the wrong month.
  const slash = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (slash) {
    const [, a, b, y] = slash;
    const year = y.length === 2 ? 2000 + Number(y) : Number(y);
    const month = Number(a);
    const day = Number(b);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().split('T')[0];
}

/**
 * Column aliases seen across Open Dental / Dentrix / Eaglesoft exports and the
 * hand-rolled spreadsheets practices actually use.
 */
const FIELD_ALIASES: Record<string, string[]> = {
  patientName: ['patient', 'patient name', 'patientname', 'name', 'subscriber', 'guarantor'],
  amount: ['amount', 'billed', 'billed amount', 'charge', 'charges', 'balance', 'fee', 'claim amount', 'total'],
  status: ['status', 'claim status', 'state'],
  denialReason: [
    'denial reason', 'denialreason', 'reason', 'denial', 'remark', 'remarks',
    'adjustment reason', 'carc', 'rejection reason', 'note', 'notes',
  ],
  date: ['date', 'date of service', 'dos', 'service date', 'claim date', 'procedure date'],
  insurance: ['insurance', 'payer', 'carrier', 'plan', 'insurance carrier', 'primary insurance'],
  procedureCode: ['code', 'procedure', 'procedure code', 'cdt', 'cpt', 'proc code', 'service code'],
};

export type ClaimField = keyof typeof FIELD_ALIASES;

export const IMPORT_FIELDS: { key: ClaimField; label: string; required: boolean }[] = [
  { key: 'patientName', label: 'Patient', required: false },
  { key: 'amount', label: 'Amount', required: true },
  { key: 'denialReason', label: 'Denial reason', required: false },
  { key: 'date', label: 'Date of service', required: false },
  { key: 'insurance', label: 'Payer', required: false },
  { key: 'procedureCode', label: 'Procedure code', required: false },
  { key: 'status', label: 'Status', required: false },
];

/** Guesses which CSV column maps to which claim field, by header name. */
export function autoMapColumns(headers: string[]): Partial<Record<ClaimField, number>> {
  const mapping: Partial<Record<ClaimField, number>> = {};
  const normalised = headers.map((h) => h.trim().toLowerCase());

  for (const [field, aliases] of Object.entries(FIELD_ALIASES) as [ClaimField, string[]][]) {
    // Exact header match first, then substring, so "Billed Amount" doesn't
    // lose to a stray column that merely contains "amount".
    let index = normalised.findIndex((h) => aliases.includes(h));
    if (index === -1) {
      index = normalised.findIndex((h) => aliases.some((a) => h.includes(a)));
    }
    if (index !== -1 && !Object.values(mapping).includes(index)) {
      mapping[field] = index;
    }
  }

  return mapping;
}

const KNOWN_STATUSES = ['Pending', 'Recovered', 'Denied', 'In Review', 'In Progress'];

export function normaliseStatus(raw: string | undefined): string {
  if (!raw?.trim()) return 'Pending';
  const value = raw.trim().toLowerCase();
  const match = KNOWN_STATUSES.find((s) => s.toLowerCase() === value);
  if (match) return match;
  if (/den|reject/.test(value)) return 'Denied';
  if (/paid|recover|closed/.test(value)) return 'Recovered';
  if (/review|appeal/.test(value)) return 'In Review';
  if (/progress|work/.test(value)) return 'In Progress';
  return 'Pending';
}
