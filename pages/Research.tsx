import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Phone, MessageSquare, Mail, Loader2, Plus, CheckCircle } from 'lucide-react';
import { googleSheetsAPI, Research as ResearchData, setCache, invalidateCache } from '../lib/googleSheets';
import { useSheetsData } from '../hooks/useSheetsData';
import { useGoogleAuth } from '../context/GoogleAuthContext';
import { useAuth } from '../context/AuthContext';
import { logDashboardActivity } from '../lib/supabase';
import { toast } from 'sonner';

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

const countFilledFields = (row: ResearchData): number =>
  REQUIRED_FIELDS.filter(f => {
    const v = row[f];
    return v !== undefined && v !== null && String(v).trim() !== '';
  }).length;

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

const parseToInputDate = (sheetDate: string) => {
  if (!sheetDate) return '';
  const parts = sheetDate.split('/');
  if (parts.length === 3) {
    const d = parts[0].padStart(2, '0');
    const m = parts[1].padStart(2, '0');
    const y = parts[2];
    return `${y}-${m}-${d}`;
  }
  return sheetDate;
};

const formatToSheetDate = (inputDate: string) => {
  if (!inputDate) return '';
  const parts = inputDate.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
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
  item: ResearchData & { _rowIndex?: number };
  onUpdate: (row: ResearchData & { _rowIndex?: number }) => Promise<void>;
  completedRowsRef: React.MutableRefObject<Set<number>>;
}

const EditableRow = ({ item, onUpdate, completedRowsRef }: EditableRowProps) => {
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
  }, [item]);

  // Cleanup debounce timer on unmount
  useEffect(() => () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
  }, []);

  // ── Core save function ────────────────────────────────────────────────────
  const syncToSheets = async (snapshot: ResearchData & { _rowIndex?: number }) => {
    setIsSyncing(true);
    try {
      await onUpdate(snapshot);
      lastSavedRef.current = snapshot; // mark as saved

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
      const hasChanges = (Object.keys(next) as (keyof typeof next)[]).some(
        k => k !== '_rowIndex' && next[k] !== saved[k]
      );
      if (hasChanges) syncToSheets(next);
    }, 800);
  };

  // ── Event handlers ────────────────────────────────────────────────────────
  const handleChange = (field: keyof ResearchData, value: string) => {
    const next = { ...dataRef.current, [field]: value };
    dataRef.current = next;
    setData(next);
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
// Research Page
// ─────────────────────────────────────────────────────────────────────────────
const Research: React.FC = () => {
  const { data: fetchedItems, loading, refetch } = useSheetsData(googleSheetsAPI.getResearch);
  const { spreadsheetId, accessToken } = useGoogleAuth();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // ── Local list state ──────────────────────────────────────────────────────
  // We manage a local copy of the list so successful saves can be applied
  // optimistically, without triggering a full re-fetch.
  const [researchItems, setResearchItems] = useState<(ResearchData & { _rowIndex?: number })[]>([]);

  // GATED sync: only apply fetchedItems → researchItems when we explicitly
  // requested a refetch (initial load, error revert, new row added).
  // This prevents the background re-fetches triggered by the 1-second
  // syncToken interval in GoogleAuthContext from clobbering local edits.
  const needsRefetchRef = useRef(true); // true = accept the next fetchedItems update

  useEffect(() => {
    if (!needsRefetchRef.current) return; // background refetch — ignore it
    if (loading) return;                  // still fetching — wait for completion
    needsRefetchRef.current = false;
    setResearchItems(fetchedItems as (ResearchData & { _rowIndex?: number })[]);
  }, [fetchedItems, loading]);

  // Tracks which rows have already shown the "completed" toast (by _rowIndex)
  const completedRowsRef = useRef<Set<number>>(new Set());

  // Always-current pointer to the list — used inside handleUpdateRow without
  // stale closure issues (the callback dep array stays stable).
  const researchItemsRef = useRef(researchItems);
  useEffect(() => { researchItemsRef.current = researchItems; }, [researchItems]);

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

    // Filter out fully-empty rows at the bottom of the spreadsheet
    const isNotEmpty = !!(item.business_name || item.date || item.city || item.contact_method);

    return matchesTab && matchesSearch && isNotEmpty;
  });

  // ── Update handler ────────────────────────────────────────────────────────
  const handleUpdateRow = useCallback(
    async (updatedData: ResearchData & { _rowIndex?: number }) => {
      if (!spreadsheetId || !accessToken) {
        toast.error('Google Sheets not connected. Please reconnect your account.');
        return;
      }
      if (!updatedData._rowIndex) {
        toast.error('Cannot update: row index missing. Try refreshing the page.');
        return;
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
      } catch (error: any) {
        toast.error('Failed to sync: ' + error.message);
        // Clear the optimistic cache and revert to server state.
        invalidateCache('Research');
        needsRefetchRef.current = true;
        refetch();
      }
    },
    [spreadsheetId, accessToken, refetch]
  );


  // ── Add new lead ──────────────────────────────────────────────────────────
  const handleAddLead = async () => {
    if (!spreadsheetId || !accessToken) return;
    setIsAdding(true);

    const newLead: ResearchData = {
      date: new Date().toLocaleDateString('en-GB'), // DD/MM/YYYY
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
      // Pull the newly appended row so it gets its _rowIndex.
      // Mark that the next fetchedItems update should be applied.
      needsRefetchRef.current = true;
      refetch();
    } catch (error: any) {
      toast.error('Failed to add lead: ' + error.message);
    } finally {
      setIsAdding(false);
    }
  };

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
                  completedRowsRef={completedRowsRef}
                />
              ))}
            </tbody>
          </table>

          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <button
              onClick={handleAddLead}
              disabled={isAdding}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black transition-colors disabled:opacity-50"
            >
              {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {isAdding ? 'Adding Lead...' : 'Add New Lead'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Research;
