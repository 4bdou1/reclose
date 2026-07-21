import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Phone, MessageSquare, Mail, Loader2, Plus, CheckCircle, Upload, X, AlertCircle, ImageIcon, Sparkles, Trash2 } from 'lucide-react';
import { googleSheetsAPI, Research as ResearchData, setCache, invalidateCache } from '../lib/googleSheets';
import { useSheetsData } from '../hooks/useSheetsData';
import { useGoogleAuth } from '../context/GoogleAuthContext';
import { useAuth } from '../context/AuthContext';
import { logDashboardActivity, supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { parseLeadsFromImages } from '../lib/parseLeadsFromImages';

type ResearchRow = ResearchData & { _rowIndex?: number };
type ResearchSyncPayload = {
  spreadsheetId: string;
  clientId: string;
  rowIndex?: number;
  reason: 'row-updated' | 'row-added';
  updatedAt: string;
};
type ResolvedSheetDate = {
  inputDate: string;
  sheetDate: string;
};

// All 10 fields that count toward "row completeness"
const REQUIRED_FIELDS: (keyof ResearchData)[] = [
  'date',
  'business_name',
  'category',
  'city',
  'contact_method',
  'time_of_contact',
  'researched_detail_(30s_note)',
  'response',
  'follow-up_due',
  'follow-up_sent?',
];

const COMPLETION_THRESHOLD = 0.8; // 80%
const RESEARCH_SYNC_EVENT = 'research-sync';

const countFilledFields = (row: ResearchData): number =>
  REQUIRED_FIELDS.filter(f => {
    const v = row[f];
    return v !== undefined && v !== null && String(v).trim() !== '';
  }).length;

const rowHasUnsavedChanges = (current: ResearchRow, saved: ResearchRow) =>
  (Object.keys(current) as (keyof ResearchRow)[]).some(
    key => key !== '_rowIndex' && current[key] !== saved[key]
  );

const mergeIncomingResearchRows = (
  currentRows: ResearchRow[],
  fetchedRows: ResearchRow[],
  dirtyRows: Set<number>
): ResearchRow[] => {
  const currentByRowIndex = new Map(
    currentRows
      .filter(row => row._rowIndex !== undefined)
      .map(row => [row._rowIndex as number, row])
  );
  const fetchedRowIndexes = new Set(
    fetchedRows
      .filter(row => row._rowIndex !== undefined)
      .map(row => row._rowIndex as number)
  );

  const mergedRows = fetchedRows.map(row => {
    const rowIndex = row._rowIndex;
    if (rowIndex !== undefined && dirtyRows.has(rowIndex)) {
      return currentByRowIndex.get(rowIndex) ?? row;
    }
    return row;
  });

  currentRows.forEach(row => {
    const rowIndex = row._rowIndex;
    if (rowIndex !== undefined && dirtyRows.has(rowIndex) && !fetchedRowIndexes.has(rowIndex)) {
      mergedRows.push(row);
    }
  });

  return mergedRows;
};

const getContactIcon = (method: string) => {
  switch (method?.toLowerCase()) {
    case 'call': return <Phone className="w-3 h-3" />;
    case 'dm': return <MessageSquare className="w-3 h-3" />;
    case 'email': return <Mail className="w-3 h-3" />;
    default: return null;
  }
};

const getResponseBadge = (response: string) => {
  switch (response?.toLowerCase()) {
    case 'no answer': return 'bg-gray-100 text-gray-600 border border-gray-200';
    case 'pending': return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
    case 'positive': return 'bg-green-50 text-green-700 border border-green-200';
    case 'negative': return 'bg-red-50 text-red-700 border border-red-200';
    default: return 'bg-gray-50 text-gray-500 border border-gray-100';
  }
};

const buildResolvedSheetDate = (year: string, month: string, day: string): ResolvedSheetDate | null => {
    const numericYear = Number(year);
    const numericMonth = Number(month);
    const numericDay = Number(day);

    if (
      !Number.isInteger(numericYear) ||
      !Number.isInteger(numericMonth) ||
      !Number.isInteger(numericDay) ||
      numericMonth < 1 ||
      numericMonth > 12 ||
      numericDay < 1 ||
      numericDay > 31
    ) {
      return null;
    }

    const paddedMonth = month.padStart(2, '0');
    const paddedDay = day.padStart(2, '0');

    return {
      inputDate: `${year}-${paddedMonth}-${paddedDay}`,
      sheetDate: `${year}/${paddedMonth}/${paddedDay}`,
    };
};

const resolveSheetDate = (sheetDate: string, allowAmbiguous: boolean): ResolvedSheetDate | null => {
  const trimmedValue = sheetDate.trim();
  if (!trimmedValue) return null;
  
  // Already in YYYY-MM-DD format
  if (trimmedValue.includes('-')) {
    const parts = trimmedValue.split('-');
    if (parts.length === 3 && parts[0].length === 4) {
      return buildResolvedSheetDate(parts[0], parts[1], parts[2]);
    }
  }

  const parts = trimmedValue.split('/');
  if (parts.length === 3) {
    // If first part is a year (e.g., 2026/07/17) -> YYYY/MM/DD
    if (parts[0].length === 4) {
      const resolvedDate = buildResolvedSheetDate(parts[0], parts[1], parts[2]);
      if (resolvedDate) return resolvedDate;
    }

    // If last part is a year, support both DD/MM/YYYY and MM/DD/YYYY.
    if (parts[2].length === 4) {
      const dmyDate = buildResolvedSheetDate(parts[2], parts[1], parts[0]);
      const mdyDate = buildResolvedSheetDate(parts[2], parts[0], parts[1]);

      if (dmyDate && !mdyDate) return dmyDate;
      if (mdyDate && !dmyDate) return mdyDate;
      if (allowAmbiguous && dmyDate) return dmyDate;
    }
  }

  // Fallback: try to parse arbitrary strings like "17 Jul 2026" using Date API
  const parsedDate = new Date(trimmedValue);
  if (!isNaN(parsedDate.getTime())) {
    const y = parsedDate.getFullYear();
    const m = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const d = String(parsedDate.getDate()).padStart(2, '0');
    return {
      inputDate: `${y}-${m}-${d}`,
      sheetDate: `${y}/${m}/${d}`,
    };
  }

  return null;
};

const getSafeNormalizedSheetDate = (sheetDate: string) =>
  resolveSheetDate(sheetDate, false)?.sheetDate ?? null;

const parseToInputDate = (sheetDate: string) => {
  if (!sheetDate) return '';
  return resolveSheetDate(sheetDate, true)?.inputDate ?? sheetDate;
};

const formatToSheetDate = (inputDate: string) => {
  if (!inputDate) return '';
  const parts = inputDate.split('-');
  if (parts.length === 3) {
    return `${parts[0]}/${parts[1]}/${parts[2]}`; // YYYY/MM/DD
  }
  return inputDate;
};

const parseToInputTime = (sheetTime: string) => {
  if (!sheetTime) return '';
  const match = sheetTime.trim().match(/^(\d{1,2}):?(\d{2})?\s*(am|pm)$/i);
  if (match) {
    let h = parseInt(match[1]);
    const m = match[2] || '00';
    const isPM = match[3].toLowerCase() === 'pm';
    if (isPM && h < 12) h += 12;
    if (!isPM && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${m}`;
  }
  const match24 = sheetTime.trim().match(/^(\d{2}):(\d{2})$/);
  if (match24) return sheetTime;
  return '';
};

const formatToSheetTime = (inputTime: string) => {
  if (!inputTime) return '';
  const [hStr, mStr] = inputTime.split(':');
  let h = parseInt(hStr);
  const ampm = h >= 12 ? 'PM' : 'AM';
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${h}:${mStr} ${ampm}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// EditableRow
// Props:
//   item             – the authoritative server snapshot (only updates after
//                      explicit refetch, NOT after every save)
//   onUpdate         – async fn that writes to Sheets and returns the saved row
//   completedRowsRef – shared ref<Set<number>> so the completion toast fires
//                      only once per row across re-renders
// ─────────────────────────────────────────────────────────────────────────────
interface EditableRowProps {
  item: ResearchRow;
  onUpdate: (row: ResearchRow) => Promise<boolean>;
  onDirtyChange: (rowIndex: number | undefined, isDirty: boolean) => void;
  completedRowsRef: React.MutableRefObject<Set<number>>;
}

const EditableRow = ({ item, onUpdate, onDirtyChange, completedRowsRef }: EditableRowProps) => {
  const [data, setData] = useState(item);
  const [isSyncing, setIsSyncing] = useState(false);

  // dataRef: latest draft (no stale closure issues in async callbacks)
  const dataRef = useRef(data);
  // lastSavedRef: the last value confirmed written to Google Sheets.
  // Used for change-detection so we never send a no-op write.
  const lastSavedRef = useRef(item);
  // Timer for debounced auto-save
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync from parent when item identity changes (explicit refetch / error revert).
  useEffect(() => {
    setData(item);
    dataRef.current = item;
    lastSavedRef.current = item;
    onDirtyChange(item._rowIndex, false);
  }, [item, onDirtyChange]);

  // ── Flush Save Function ───────────────────────────────────────────────────
  const flushSave = () => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    const saved = lastSavedRef.current;
    const next = dataRef.current;
    const hasChanges = rowHasUnsavedChanges(next, saved);
    // Use the syncToSheets function defined below
    if (hasChanges) syncToSheets(next);
  };

  // Flush saves on unmount (e.g., navigating away)
  useEffect(() => {
    return () => {
      flushSave();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Flush saves on visibility change (e.g., closing tab, app backgrounded)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') flushSave();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Core save function ────────────────────────────────────────────────────
  const syncToSheets = async (snapshot: ResearchData & { _rowIndex?: number }) => {
    setIsSyncing(true);
    try {
      const didSave = await onUpdate(snapshot);
      if (!didSave) return;
      lastSavedRef.current = snapshot; // mark as saved
      onDirtyChange(snapshot._rowIndex, false);

      // Smart completion notification (≥80% fields filled, once per row)
      const rowIdx = snapshot._rowIndex ?? -1;
      if (rowIdx > 0 && !completedRowsRef.current.has(rowIdx)) {
        const filled = countFilledFields(snapshot);
        const ratio = filled / REQUIRED_FIELDS.length;
        if (ratio >= COMPLETION_THRESHOLD) {
          completedRowsRef.current.add(rowIdx);
          toast.success('Lead fully researched ✓', {
            description: `${snapshot.business_name || 'This lead'} is ${Math.round(ratio * 100)}% complete.`,
            icon: <CheckCircle className="w-4 h-4 text-green-600" />,
            duration: 4000,
          });
        }
      }
    } finally {
      setIsSyncing(false);
    }
  };

  // ── Schedule debounced save ───────────────────────────────────────────────
  // Called on every onChange. Fires 800ms after the last keystroke so data
  // is written to Google Sheets well before the user might close the app.
  const scheduleSave = (next: ResearchData & { _rowIndex?: number }) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveTimerRef.current = null;
      const saved = lastSavedRef.current;
      const hasChanges = rowHasUnsavedChanges(next, saved);
      if (hasChanges) syncToSheets(next);
    }, 800);
  };

  // ── Event handlers ────────────────────────────────────────────────────────
  const handleChange = (field: keyof ResearchData, value: string) => {
    const next = { ...dataRef.current, [field]: value };
    dataRef.current = next;
    setData(next);
    onDirtyChange(next._rowIndex, rowHasUnsavedChanges(next, lastSavedRef.current));
    scheduleSave(next); // auto-save 800ms after last change
  };

  const handleBlur = (field: keyof ResearchData) => {
    // Flush the debounce immediately on blur (e.g. tab-away, nav click)
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    const latest = dataRef.current;
    if (latest[field] !== lastSavedRef.current[field]) {
      syncToSheets(latest);
    }
  };

  const handleSelectChange = (field: keyof ResearchData, value: string) => {
    const next = { ...dataRef.current, [field]: value };
    dataRef.current = next;
    setData(next);
    onDirtyChange(next._rowIndex, rowHasUnsavedChanges(next, lastSavedRef.current));
    // Selects save immediately (no need to debounce a single-click action)
    if (next[field] !== lastSavedRef.current[field]) {
      syncToSheets(next);
    }
  };



  return (
    <tr className="hover:bg-gray-50/50 transition-colors group relative">
      {/* Date */}
      <td className="p-2 border-b border-gray-100 relative">
        {isSyncing && (
          <div className="absolute top-2 left-2 z-10">
            <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
          </div>
        )}
        <input
          type="date"
          value={parseToInputDate(data.date)}
          onChange={e => handleChange('date', formatToSheetDate(e.target.value))}
          onBlur={() => handleBlur('date')}
          className="w-full bg-transparent text-xs text-gray-500 focus:bg-white focus:ring-1 focus:ring-black rounded px-2 py-1 outline-none"
        />
      </td>
      {/* Business Name */}
      <td className="p-2 border-b border-gray-100">
        <input
          type="text"
          placeholder="Business Name"
          value={data.business_name || ''}
          onChange={e => handleChange('business_name', e.target.value)}
          onBlur={() => handleBlur('business_name')}
          className="w-full bg-transparent font-semibold text-sm text-gray-900 focus:bg-white focus:ring-1 focus:ring-black rounded px-2 py-1 outline-none"
        />
      </td>
      {/* Category */}
      <td className="p-2 border-b border-gray-100">
        <input
          type="text"
          placeholder="Category"
          value={data.category || ''}
          onChange={e => handleChange('category', e.target.value)}
          onBlur={() => handleBlur('category')}
          className="w-full bg-transparent text-[10px] uppercase tracking-wider text-gray-500 font-bold focus:bg-white focus:ring-1 focus:ring-black rounded px-2 py-1 outline-none"
        />
      </td>
      {/* City */}
      <td className="p-2 border-b border-gray-100">
        <input
          type="text"
          placeholder="City"
          value={data.city || ''}
          onChange={e => handleChange('city', e.target.value)}
          onBlur={() => handleBlur('city')}
          className="w-full bg-transparent text-sm text-gray-600 focus:bg-white focus:ring-1 focus:ring-black rounded px-2 py-1 outline-none"
        />
      </td>
      {/* Contact Method */}
      <td className="p-2 border-b border-gray-100">
        <select
          value={data.contact_method || ''}
          onChange={e => handleSelectChange('contact_method', e.target.value)}
          className="w-full bg-transparent text-xs text-gray-600 focus:bg-white focus:ring-1 focus:ring-black rounded px-1 py-1 outline-none cursor-pointer"
        >
          <option value="">Select</option>
          <option value="Call">Call</option>
          <option value="DM">DM</option>
          <option value="Email">Email</option>
        </select>
      </td>
      {/* Time of Contact */}
      <td className="p-2 border-b border-gray-100">
        <input
          type="time"
          value={parseToInputTime(data.time_of_contact)}
          onChange={e => handleChange('time_of_contact', formatToSheetTime(e.target.value))}
          onBlur={() => handleBlur('time_of_contact')}
          className="w-full bg-transparent text-xs text-gray-500 focus:bg-white focus:ring-1 focus:ring-black rounded px-2 py-1 outline-none"
        />
      </td>
      {/* 30s Note */}
      <td className="p-2 border-b border-gray-100">
        <input
          type="text"
          placeholder="Researched detail..."
          value={data['researched_detail_(30s_note)'] || ''}
          onChange={e => handleChange('researched_detail_(30s_note)', e.target.value)}
          onBlur={() => handleBlur('researched_detail_(30s_note)')}
          className="w-full bg-transparent text-xs text-gray-600 focus:bg-white focus:ring-1 focus:ring-black rounded px-2 py-1 outline-none"
        />
      </td>
      {/* Response */}
      <td className="p-2 border-b border-gray-100">
        <select
          value={data.response || ''}
          onChange={e => handleSelectChange('response', e.target.value)}
          className={`w-full text-[10px] font-bold uppercase tracking-wider rounded px-1 py-1 outline-none cursor-pointer ${
            data.response
              ? getResponseBadge(data.response)
              : 'bg-transparent text-gray-500 hover:bg-gray-50 focus:bg-white focus:ring-1 focus:ring-black'
          }`}
        >
          <option value="">No Status</option>
          <option value="No Answer">No Answer</option>
          <option value="Pending">Pending</option>
          <option value="Positive">Positive</option>
          <option value="Negative">Negative</option>
        </select>
      </td>
      {/* Follow-Up Due */}
      <td className="p-2 border-b border-gray-100">
        <input
          type="date"
          value={parseToInputDate(data['follow-up_due'])}
          onChange={e => handleChange('follow-up_due', formatToSheetDate(e.target.value))}
          onBlur={() => handleBlur('follow-up_due')}
          className="w-full bg-transparent text-xs text-gray-600 focus:bg-white focus:ring-1 focus:ring-black rounded px-2 py-1 outline-none"
        />
      </td>
      {/* Follow-Up Sent? */}
      <td className="p-2 border-b border-gray-100">
        <select
          value={data['follow-up_sent?'] || ''}
          onChange={e => handleSelectChange('follow-up_sent?', e.target.value)}
          className="w-full bg-transparent text-xs text-gray-600 focus:bg-white focus:ring-1 focus:ring-black rounded px-1 py-1 outline-none cursor-pointer"
        >
          <option value="">-</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </td>
      {/* Outcome / Notes */}
      <td className="p-2 border-b border-gray-100">
        <input
          type="text"
          placeholder="Outcome notes..."
          value={data['outcome_/_notes'] || ''}
          onChange={e => handleChange('outcome_/_notes', e.target.value)}
          onBlur={() => handleBlur('outcome_/_notes')}
          className="w-full bg-transparent text-xs text-gray-600 focus:bg-white focus:ring-1 focus:ring-black rounded px-2 py-1 outline-none"
        />
      </td>
    </tr>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SmartImportModal
// ─────────────────────────────────────────────────────────────────────────────
interface SmartImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (rows: Partial<ResearchData>[]) => Promise<void>;
  todaySheetDate: string;
}

const SmartImportModal = ({ isOpen, onClose, onImport, todaySheetDate }: SmartImportModalProps) => {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [parsedRows, setParsedRows] = useState<Partial<ResearchData>[]>([]);
  const [checkedRows, setCheckedRows] = useState<boolean[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [ocrProgress, setOcrProgress] = useState<{ pct: number; detail: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setImages([]);
      setPreviews([]);
      setIsParsing(false);
      setIsImporting(false);
      setParsedRows([]);
      setCheckedRows([]);
      setParseError(null);
      setOcrProgress(null);
    }
  }, [isOpen]);

  const addFiles = (files: FileList | File[]) => {
    const valid = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (valid.length === 0) return;
    setImages(prev => [...prev, ...valid]);
    valid.forEach(file => {
      const url = URL.createObjectURL(file);
      setPreviews(prev => [...prev, url]);
    });
    setParsedRows([]);
    setCheckedRows([]);
    setParseError(null);
  };

  const removeImage = (idx: number) => {
    URL.revokeObjectURL(previews[idx]);
    setImages(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
    setParsedRows([]);
    setCheckedRows([]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleAnalyze = async () => {
    if (images.length === 0) return;
    setIsParsing(true);
    setParseError(null);
    setOcrProgress({ pct: 0, detail: 'Starting OCR…' });
    try {
      const rows = await parseLeadsFromImages(images, todaySheetDate, (pct, detail) => {
        setOcrProgress({ pct, detail });
      });
      setOcrProgress({ pct: 100, detail: 'Done!' });
      if (rows.length === 0) {
        setParseError('No leads were found in the image(s). Make sure the image contains a numbered list of businesses.');
      } else {
        setParsedRows(rows);
        setCheckedRows(new Array(rows.length).fill(true));
      }
    } catch (err: any) {
      setParseError(err?.message ?? 'Unknown error occurred.');
    } finally {
      setIsParsing(false);
      setOcrProgress(null);
    }
  };

  const handleRowChange = (idx: number, field: keyof ResearchData, value: string) => {
    setParsedRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  };

  const handleConfirm = async () => {
    const toImport = parsedRows.filter((_, i) => checkedRows[i]);
    if (toImport.length === 0) {
      toast.error('Please select at least one lead to import.');
      return;
    }
    setIsImporting(true);
    try {
      await onImport(toImport);
      onClose();
    } finally {
      setIsImporting(false);
    }
  };

  const selectedCount = checkedRows.filter(Boolean).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-900 to-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Smart Import</h2>
              <p className="text-xs text-gray-300">Upload images — OCR reads your leads automatically, no API needed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Step 1: Upload zone */}
          {parsedRows.length === 0 && (
            <div className="p-6 space-y-4">
              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-black bg-gray-50 scale-[1.01]'
                    : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={e => e.target.files && addFiles(e.target.files)}
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Drop images here or click to browse</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, HEIC — multiple images supported</p>
                  </div>
                </div>
              </div>

              {/* Thumbnail strip */}
              {images.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {previews.map((src, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={src}
                        alt={`img-${i}`}
                        className="w-24 h-28 object-cover rounded-xl border border-gray-200 shadow-sm"
                      />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-28 rounded-xl border-2 border-dashed border-gray-200 hover:border-gray-400 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Progress bar (shown while OCR is running) */}
              {isParsing && ocrProgress && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{ocrProgress.detail}</span>
                    <span>{ocrProgress.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-900 rounded-full transition-all duration-300"
                      style={{ width: `${ocrProgress.pct}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error */}
              {parseError && (
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-700">{parseError}</p>
                </div>
              )}

              {/* Analyze button */}
              <button
                onClick={handleAnalyze}
                disabled={images.length === 0 || isParsing}
                className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isParsing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Reading image{images.length > 1 ? 's' : ''} with OCR…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {images.length === 0 ? 'Upload images first' : `Extract leads from ${images.length} image${images.length > 1 ? 's' : ''}`}
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 2: Preview table */}
          {parsedRows.length > 0 && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {parsedRows.length} lead{parsedRows.length > 1 ? 's' : ''} extracted
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Edit any cell before importing. Uncheck rows to skip them.</p>
                </div>
                <button
                  onClick={() => { setParsedRows([]); setCheckedRows([]); setParseError(null); }}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-black transition-colors"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  Re-upload
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left text-xs border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="p-2 w-8"></th>
                      <th className="p-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider w-[130px]">Business Name</th>
                      <th className="p-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider w-[90px]">Category</th>
                      <th className="p-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider w-[70px]">Contact</th>
                      <th className="p-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider w-[100px]">Response</th>
                      <th className="p-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">30s Note</th>
                      <th className="p-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Phone / Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedRows.map((row, i) => (
                      <tr
                        key={i}
                        className={`border-b border-gray-100 transition-colors ${
                          checkedRows[i] ? 'bg-white hover:bg-gray-50/50' : 'bg-gray-50 opacity-50'
                        }`}
                      >
                        <td className="p-2">
                          <input
                            type="checkbox"
                            checked={checkedRows[i] ?? false}
                            onChange={e => setCheckedRows(prev => prev.map((v, j) => j === i ? e.target.checked : v))}
                            className="w-3.5 h-3.5 accent-black cursor-pointer"
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            value={row.business_name ?? ''}
                            onChange={e => handleRowChange(i, 'business_name', e.target.value)}
                            className="w-full bg-transparent font-semibold text-gray-900 focus:bg-white focus:ring-1 focus:ring-black rounded px-1.5 py-1 outline-none"
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            value={row.category ?? ''}
                            onChange={e => handleRowChange(i, 'category', e.target.value)}
                            className="w-full bg-transparent text-gray-600 focus:bg-white focus:ring-1 focus:ring-black rounded px-1.5 py-1 outline-none"
                          />
                        </td>
                        <td className="p-1">
                          <select
                            value={row.contact_method ?? ''}
                            onChange={e => handleRowChange(i, 'contact_method', e.target.value)}
                            className="w-full bg-transparent text-gray-600 focus:bg-white focus:ring-1 focus:ring-black rounded px-1 py-1 outline-none cursor-pointer"
                          >
                            <option value="">—</option>
                            <option value="Call">Call</option>
                            <option value="DM">DM</option>
                            <option value="Email">Email</option>
                          </select>
                        </td>
                        <td className="p-1">
                          <select
                            value={row.response ?? ''}
                            onChange={e => handleRowChange(i, 'response', e.target.value)}
                            className={`w-full text-[10px] font-bold uppercase tracking-wider rounded px-1 py-1 outline-none cursor-pointer ${
                              row.response ? getResponseBadge(row.response) : 'bg-transparent text-gray-500'
                            }`}
                          >
                            <option value="">No Status</option>
                            <option value="No Answer">No Answer</option>
                            <option value="Pending">Pending</option>
                            <option value="Positive">Positive</option>
                            <option value="Negative">Negative</option>
                          </select>
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            value={row['researched_detail_(30s_note)'] ?? ''}
                            onChange={e => handleRowChange(i, 'researched_detail_(30s_note)', e.target.value)}
                            className="w-full bg-transparent text-gray-600 focus:bg-white focus:ring-1 focus:ring-black rounded px-1.5 py-1 outline-none"
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            value={row['outcome_/_notes'] ?? ''}
                            onChange={e => handleRowChange(i, 'outcome_/_notes', e.target.value)}
                            className="w-full bg-transparent text-gray-600 focus:bg-white focus:ring-1 focus:ring-black rounded px-1.5 py-1 outline-none"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {parsedRows.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              {selectedCount} of {parsedRows.length} lead{parsedRows.length > 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isImporting || selectedCount === 0}
                className="px-5 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isImporting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Importing…</>
                ) : (
                  <><CheckCircle className="w-4 h-4" /> Import {selectedCount} Lead{selectedCount !== 1 ? 's' : ''}</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Research Page
// ─────────────────────────────────────────────────────────────────────────────
const Research: React.FC = () => {
  const { data: fetchedItems, loading, refetch } = useSheetsData(googleSheetsAPI.getResearch);
  const { spreadsheetId, accessToken } = useGoogleAuth();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // ── Local list state ──────────────────────────────────────────────────────
  // We manage a local copy of the list so successful saves can be applied
  // optimistically, without triggering a full re-fetch.
  const [researchItems, setResearchItems] = useState<ResearchRow[]>([]);

  // GATED sync: only apply fetchedItems → researchItems when we explicitly
  // requested a refetch (initial load, error revert, new row added).
  // This prevents the background re-fetches triggered by the 1-second
  // syncToken interval in GoogleAuthContext from clobbering local edits.
  const needsRefetchRef = useRef(true); // true = accept the next fetchedItems update

  useEffect(() => {
    if (!needsRefetchRef.current) return; // background refetch — ignore it
    if (loading) return;                  // still fetching — wait for completion
    needsRefetchRef.current = false;
    setResearchItems(currentItems => {
      const mergedItems = mergeIncomingResearchRows(
        currentItems,
        fetchedItems as ResearchRow[],
        dirtyRowsRef.current
      );
      setCache('Research', mergedItems);
      return mergedItems;
    });
  }, [fetchedItems, loading]);

  const completedRowsRef = useRef<Set<number>>(new Set());
  const dirtyRowsRef = useRef<Set<number>>(new Set());
  const refreshInFlightRef = useRef(false);
  const queuedRefreshRef = useRef(false);
  const researchChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const clientIdRef = useRef(
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `research-${Date.now()}-${Math.random().toString(36).slice(2)}`
  );

  // Always-current pointer to the list — used inside handleUpdateRow without
  // stale closure issues (the callback dep array stays stable).
  const researchItemsRef = useRef(researchItems);
  useEffect(() => { researchItemsRef.current = researchItems; }, [researchItems]);

  const handleDirtyChange = useCallback((rowIndex: number | undefined, isDirty: boolean) => {
    if (rowIndex === undefined) return;
    if (isDirty) {
      dirtyRowsRef.current.add(rowIndex);
      return;
    }
    dirtyRowsRef.current.delete(rowIndex);
  }, []);

  const requestResearchRefresh = useCallback(async () => {
    if (refreshInFlightRef.current) {
      queuedRefreshRef.current = true;
      return;
    }

    refreshInFlightRef.current = true;
    try {
      do {
        queuedRefreshRef.current = false;
        invalidateCache('Research');
        needsRefetchRef.current = true;
        await refetch();
      } while (queuedRefreshRef.current);
    } finally {
      refreshInFlightRef.current = false;
    }
  }, [refetch]);

  const publishResearchSync = useCallback(
    async (reason: ResearchSyncPayload['reason'], rowIndex?: number) => {
      if (!spreadsheetId) return;

      const channel = researchChannelRef.current;
      if (!channel) return;

      const result = await channel.send({
        type: 'broadcast',
        event: RESEARCH_SYNC_EVENT,
        payload: {
          spreadsheetId,
          clientId: clientIdRef.current,
          rowIndex,
          reason,
          updatedAt: new Date().toISOString(),
        } satisfies ResearchSyncPayload,
      });

      if (result !== 'ok') {
        console.error('Failed to broadcast research sync event:', result);
      }
    },
    [spreadsheetId]
  );



  useEffect(() => {
    if (!spreadsheetId) return;

    const channel = supabase.channel(`research-sync:${spreadsheetId}`, {
      config: { broadcast: { ack: true, self: false } },
    });

    researchChannelRef.current = channel;

    channel
      .on<ResearchSyncPayload>('broadcast', { event: RESEARCH_SYNC_EVENT }, ({ payload }) => {
        if (!payload || payload.spreadsheetId !== spreadsheetId) return;
        if (payload.clientId === clientIdRef.current) return;
        void requestResearchRefresh();
      })
      .subscribe();

    return () => {
      if (researchChannelRef.current === channel) {
        researchChannelRef.current = null;
      }
      void supabase.removeChannel(channel);
    };
  }, [spreadsheetId, requestResearchRefresh]);


  useEffect(() => {
    if (!spreadsheetId || !accessToken) return;

    const handleWindowFocus = () => {
      void requestResearchRefresh();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void requestResearchRefresh();
      }
    };

    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [spreadsheetId, accessToken, requestResearchRefresh]);

  // ── Derived data ──────────────────────────────────────────────────────────
  const uniqueCategories = Array.from(
    new Set(researchItems.map(r => r.category).filter(Boolean))
  );
  const categories = ['All', ...uniqueCategories];

  const filteredItems = researchItems.filter(item => {
    const matchesTab =
      activeTab === 'All' || item.category?.toLowerCase() === activeTab.toLowerCase();

    const searchLower = searchTerm.toLowerCase();
    const businessMatch = item.business_name?.toLowerCase()?.includes(searchLower) ?? false;
    const cityMatch = item.city?.toLowerCase()?.includes(searchLower) ?? false;
    const matchesSearch = searchTerm === '' || businessMatch || cityMatch;

    // Filter out rows that have no business name — these are ghost/blank rows
    // (e.g. date-only rows created by handleAddLead that were never filled in).
    // We intentionally require business_name specifically so that a row the user
    // is actively typing into (which auto-saves) doesn't flicker out mid-edit.
    const isNotEmpty = !!item.business_name?.trim();

    return matchesTab && matchesSearch && isNotEmpty;
  });

  // ── Update handler ────────────────────────────────────────────────────────
  const handleUpdateRow = useCallback(
    async (updatedData: ResearchRow) => {
      if (!spreadsheetId || !accessToken) {
        toast.error('Google Sheets not connected. Please reconnect your account.');
        return false;
      }
      if (!updatedData._rowIndex) {
        toast.error('Cannot update: row index missing. Try refreshing the page.');
        return false;
      }

      // ── Optimistic update (local state + cache) ───────────────────────────
      // Apply the change to BOTH local React state AND the in-memory apiCache
      // BEFORE the async write. This means:
      //   • The UI updates instantly with no lag.
      //   • If the user navigates away and back before the write completes,
      //     the remount refetch reads from the cache and gets our updated data
      //     instead of racing the in-flight PUT request.
      const updatedList = researchItemsRef.current.map(item =>
        item._rowIndex === updatedData._rowIndex ? { ...updatedData } : item
      );
      setResearchItems(updatedList);
      setCache('Research', updatedList);

      try {
        const rowData = { ...updatedData };
        delete rowData._rowIndex;

        await googleSheetsAPI.updateResearch(
          updatedData._rowIndex,
          rowData,
          spreadsheetId,
          accessToken
        );
        // updateRow() calls invalidateCache() internally after writing, which
        // would wipe our optimistic cache. Re-apply it so navigate-back still
        // reads our updated data and not a stale server response.
        setCache('Research', updatedList);
        await publishResearchSync('row-updated', updatedData._rowIndex);
        return true;
      } catch (error: any) {
        toast.error('Failed to sync: ' + error.message);
        // Clear the optimistic cache and revert to server state.
        await requestResearchRefresh();
        return false;
      }
    },
    [spreadsheetId, accessToken, publishResearchSync, requestResearchRefresh]
  );


  // ── Add new lead ──────────────────────────────────────────────────────────
  const handleAddLead = async () => {
    if (!spreadsheetId || !accessToken) return;

    // Guard: if there's already a completely blank row, don't add another one.
    // A row is considered blank when every meaningful field is empty.
    const MEANINGFUL_FIELDS: (keyof ResearchData)[] = [
      'business_name', 'category', 'city', 'contact_method',
      'time_of_contact', 'researched_detail_(30s_note)',
      'response', 'follow-up_due', 'follow-up_sent?', 'outcome_/_notes',
    ];
    const hasBlankRow = researchItemsRef.current.some(item =>
      MEANINGFUL_FIELDS.every(f => !String(item[f] ?? '').trim())
    );
    if (hasBlankRow) return; // silently stay — blank row already exists

    setIsAdding(true);

    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');

    const newLead: ResearchData = {
      date: `${y}/${m}/${d}`, // YYYY/MM/DD
      business_name: '',
      category: '',
      city: '',
      contact_method: '',
      time_of_contact: '',
      'researched_detail_(30s_note)': '',
      response: '',
      'follow-up_due': '',
      'follow-up_sent?': '',
      'outcome_/_notes': '',
    };

    try {
      await googleSheetsAPI.addResearch(newLead, spreadsheetId, accessToken);
      toast.success('New lead created', {
        style: { background: '#D6B36B', color: '#000', border: 'none' },
      });
      const ownerName = user?.user_metadata?.full_name || user?.email || 'Unknown User';
      await logDashboardActivity(ownerName, 'Research Added', 'Created a new blank lead');
      await requestResearchRefresh();
      await publishResearchSync('row-added');
    } catch (error: any) {
      toast.error('Failed to add lead: ' + error.message);
    } finally {
      setIsAdding(false);
    }
  };

  // ── Smart Import handler ──────────────────────────────────────────────────
  const handleSmartImport = async (rows: Partial<ResearchData>[]) => {
    if (!spreadsheetId || !accessToken) {
      toast.error('Google Sheets not connected.');
      return;
    }
    let successCount = 0;
    for (const row of rows) {
      try {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const fullRow: ResearchData = {
          date: row.date || `${y}/${m}/${d}`,
          business_name: row.business_name || '',
          category: row.category || '',
          city: row.city || '',
          contact_method: row.contact_method || '',
          time_of_contact: row.time_of_contact || '',
          'researched_detail_(30s_note)': row['researched_detail_(30s_note)'] || '',
          response: row.response || '',
          'follow-up_due': row['follow-up_due'] || '',
          'follow-up_sent?': row['follow-up_sent?'] || '',
          'outcome_/_notes': row['outcome_/_notes'] || '',
        };
        await googleSheetsAPI.addResearch(fullRow, spreadsheetId, accessToken);
        successCount++;
      } catch (err: any) {
        toast.error(`Failed to import "${row.business_name || 'row'}": ${err?.message}`);
      }
    }
    if (successCount > 0) {
      toast.success(`✨ Imported ${successCount} lead${successCount > 1 ? 's' : ''} successfully!`, {
        style: { background: '#D6B36B', color: '#000', border: 'none' },
      });
      const ownerName = user?.user_metadata?.full_name || user?.email || 'Unknown User';
      await logDashboardActivity(ownerName, 'Smart Import', `Imported ${successCount} leads from image(s)`);
      await requestResearchRefresh();
      await publishResearchSync('row-added');
    }
  };

  // ── Today's date in sheet format (YYYY/MM/DD) ─────────────────────────────
  const todaySheetDate = (() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}/${m}/${d}`;
  })();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Outreach Tracker</h1>
          <p className="text-sm text-gray-500">Manage your leads and sync directly with Google Sheets</p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search business or city..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
          />
        </div>
      </div>

      {categories.length > 1 && (
        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === cat
                  ? 'bg-[#050505] text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="w-full h-64 bg-gray-200 rounded-3xl animate-pulse" />
      ) : (
        <div className="premium-card overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px] bg-white">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-100/80">
                <th className="p-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-[120px]">Date</th>
                <th className="p-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-[180px]">Business Name</th>
                <th className="p-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-[120px]">Category</th>
                <th className="p-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-[120px]">City</th>
                <th className="p-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-[100px]">Contact</th>
                <th className="p-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-[100px]">Time</th>
                <th className="p-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-[220px]">30s Note</th>
                <th className="p-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-[110px]">Response</th>
                <th className="p-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-[120px]">Follow-Up Due</th>
                <th className="p-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-[90px]">Sent?</th>
                <th className="p-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider min-w-[200px]">Outcome / Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, idx) => (
                <EditableRow
                  // Use stable _rowIndex so row identity is preserved after
                  // optimistic updates; fall back to array idx only if missing.
                  key={item._rowIndex ?? idx}
                  item={item}
                  onUpdate={handleUpdateRow}
                  onDirtyChange={handleDirtyChange}
                  completedRowsRef={completedRowsRef}
                />
              ))}
            </tbody>
          </table>

          <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center gap-3">
            <button
              onClick={handleAddLead}
              disabled={isAdding}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black transition-colors disabled:opacity-50"
            >
              {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {isAdding ? 'Adding Lead...' : 'Add New Lead'}
            </button>

            <button
              onClick={() => setIsImportOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Smart Import
            </button>
          </div>
        </div>
      )}

      <SmartImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={handleSmartImport}
        todaySheetDate={todaySheetDate}
      />
    </div>
  );
};

export default Research;
