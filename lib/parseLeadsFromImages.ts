import { createWorker } from 'tesseract.js';
import type { Research as ResearchData } from './googleSheets';

// ─── Response keyword mapping ────────────────────────────────────────────────
const NEGATIVE_KEYWORDS = [
  'not interested', 'not decision maker', 'already has someone',
  'not the decision', 'no interest', 'rejected', 'solar type',
];
const NO_ANSWER_KEYWORDS = [
  'no pick up', 'no pickup', 'switched off', 'busy right now',
  'busy now', 'not reachable', 'no answer', 'not available',
  'unreachable',
];
const PENDING_KEYWORDS = [
  'keep in touch', 'call tomorrow', 'would reach out', 'call back',
  'reach out', 'text me', 'follow up', 'follow-up', 'whatsapp',
];

function classifyResponse(note: string): string {
  const lower = note.toLowerCase();
  if (NEGATIVE_KEYWORDS.some(k => lower.includes(k))) return 'Negative';
  if (NO_ANSWER_KEYWORDS.some(k => lower.includes(k))) return 'No Answer';
  if (PENDING_KEYWORDS.some(k => lower.includes(k))) return 'Pending';
  return '';
}

// ─── Contact method mapping ───────────────────────────────────────────────────
function classifyContactMethod(note: string): string {
  const lower = note.toLowerCase();
  if (lower.includes('whatsapp') || lower.includes('text me') || lower.includes('dm')) return 'DM';
  if (lower.includes('email') || lower.includes('mail')) return 'Email';
  return 'Call'; // default for phone-based outreach
}

// ─── Phone number extraction ──────────────────────────────────────────────────
const PHONE_RE = /(\+?[\d][\d\s\-()]{7,16}\d)/g;

function extractPhone(text: string): string {
  const matches = text.match(PHONE_RE);
  if (!matches) return '';
  // Return the longest/most plausible one (international numbers are longest)
  return matches
    .map(m => m.trim())
    .sort((a, b) => b.replace(/\D/g, '').length - a.replace(/\D/g, '').length)[0] || '';
}

// ─── Strip phone from text ────────────────────────────────────────────────────
function stripPhone(text: string, phone: string): string {
  if (!phone) return text;
  return text.replace(phone, '').replace(/\s{2,}/g, ' ').trim();
}

// ─── Clean parenthetical notes ────────────────────────────────────────────────
const PAREN_RE = /\(([^)]+)\)/g;

function extractParens(text: string): string[] {
  const found: string[] = [];
  let m;
  while ((m = PAREN_RE.exec(text)) !== null) {
    found.push(m[1].trim());
  }
  return found;
}

// ─── Parse a single raw entry line into a lead object ────────────────────────
function parseSingleEntry(raw: string, todaySheetDate: string): Partial<ResearchData> | null {
  const trimmed = raw.trim();
  if (!trimmed || trimmed.length < 3) return null;

  const phone = extractPhone(trimmed);
  const noPhone = stripPhone(trimmed, phone);

  // Collect all notes from parentheses
  const parenNotes = extractParens(noPhone);
  const combinedNote = parenNotes.join(' | ');

  // Business name = text before first phone number or first '('
  const businessRaw = noPhone
    .replace(PAREN_RE, '') // strip parens
    .replace(/\s{2,}/g, ' ')
    .trim();

  // Clean up any trailing punctuation
  const businessName = businessRaw.replace(/[,.\-:]+$/, '').trim();

  if (!businessName && !phone) return null;

  const response = classifyResponse(combinedNote);
  const contactMethod = classifyContactMethod(combinedNote);

  // 30s note: the parenthetical content that describes the business/situation
  // (filter out pure status notes)
  const note30s = parenNotes
    .filter(n => {
      const l = n.toLowerCase();
      return (
        !NO_ANSWER_KEYWORDS.some(k => l.includes(k)) &&
        !NEGATIVE_KEYWORDS.some(k => l.includes(k)) &&
        !PENDING_KEYWORDS.some(k => l.includes(k)) &&
        l.length > 5
      );
    })
    .join('; ');

  return {
    date: todaySheetDate,
    business_name: businessName,
    category: '',
    city: '',
    contact_method: contactMethod,
    time_of_contact: '',
    'researched_detail_(30s_note)': note30s,
    response,
    'follow-up_due': '',
    'follow-up_sent?': '',
    'outcome_/_notes': phone ? `${phone}${combinedNote ? ' — ' + combinedNote : ''}` : combinedNote,
  };
}

// ─── Split OCR text into individual numbered entries ─────────────────────────
//
// Handles formats like:
//   "1-Business name +234..."
//   "1. Business name"
//   "1 Business name"
//   "1)\nBusiness name"
//
function splitIntoEntries(text: string): string[] {
  // Normalise line endings
  const normalised = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Split on patterns like: newline followed by a number and separator
  // or a number-separator at the start of a segment
  const parts = normalised
    .split(/\n(?=\d{1,2}[\s\-–—.)\]:])/);

  return parts
    .map(p => {
      // Remove the leading "1-" / "1." / "1)" prefix
      return p.replace(/^\d{1,2}[\s\-–—.)\]:]+/, '').trim();
    })
    .filter(p => p.length > 3);
}

// ─── OCR a single image file using Tesseract.js ──────────────────────────────
async function ocrImage(file: File): Promise<string> {
  const worker = await createWorker('eng', 1, {
    // Suppress verbose Tesseract logs in production
    logger: () => {},
  });

  try {
    const { data } = await worker.recognize(file);
    return data.text;
  } finally {
    await worker.terminate();
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Extract structured Research lead rows from one or more image files.
 * Uses Tesseract.js for OCR — runs entirely in the browser, no external API.
 */
export async function parseLeadsFromImages(
  imageFiles: File[],
  todaySheetDate: string,
  onProgress?: (pct: number, detail: string) => void,
): Promise<Partial<ResearchData>[]> {
  if (imageFiles.length === 0) return [];

  const allLeads: Partial<ResearchData>[] = [];

  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i];
    onProgress?.(
      Math.round((i / imageFiles.length) * 80),
      `Reading image ${i + 1} of ${imageFiles.length}…`,
    );

    let rawText: string;
    try {
      rawText = await ocrImage(file);
    } catch (err: any) {
      throw new Error(`OCR failed on "${file.name}": ${err?.message ?? err}`);
    }

    onProgress?.(
      Math.round(((i + 0.5) / imageFiles.length) * 80),
      `Parsing leads from image ${i + 1}…`,
    );

    const entries = splitIntoEntries(rawText);
    for (const entry of entries) {
      const lead = parseSingleEntry(entry, todaySheetDate);
      if (lead) allLeads.push(lead);
    }
  }

  onProgress?.(95, 'Finalising…');
  return allLeads;
}
