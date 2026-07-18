export interface Task {
  id: string;
  task: string;
  user: string;
  role: string;
  status: string;
  priority: string;
  deadline: string;
  progress: string;
  category: string;
  last_updated: string;
  notes: string;
  completed_at?: string;
  _rowIndex?: number;
}

export interface Research {
  date: string;
  business_name: string;
  category: string;
  city: string;
  contact_method: string;
  time_of_contact: string;
  'researched_detail_(30s_note)': string;
  response: string;
  'follow-up_due': string;
  'follow-up_sent?': string;
  'outcome_/_notes': string;
}

export interface FileData {
  id: string;
  file_name: string;
  category: string;
  file_url: string;
  uploaded_by: string;
  date_added: string;
}

export interface Goal {
  id: string;
  goal_name: string;
  total_tasks: string;
  completed_tasks: string;
  target_date: string;
  status: string;
}

export interface TeamMember {
  email: string;
  role?: string;
  added_at?: string;
}

export interface Activity {
  id: string;
  action_type: string;
  description: string;
  owner: string;
  category: string;
  timestamp: string;
}

export interface AnalyticsData {
  overview: {
    totalOutreaches: string;
    totalResponses: string;
    noAnswerRate: string;
    responseRate: string;
    followUpsPending: string;
  };
  byCategory: { category: string; total: string; yes: string; noAnswer: string; responseRate: string }[];
  byContactMethod: { method: string; total: string; yes: string; noAnswer: string; responseRate: string }[];
  byTimeSlot: { timeSlot: string; total: string; yes: string; noAnswer: string; responseRate: string }[];
}

/**
 * Parses a 2D array from Google Sheets API into an array of objects based on the header row.
 */
function parseSheetData<T>(values: any[][], headerRowIndex: number = 0): T[] {
  if (!values || values.length <= headerRowIndex) return [];
  
  const headers = values[headerRowIndex];
  const rows = values.slice(headerRowIndex + 1);
  
  return rows.map((row, rIdx) => {
    const obj: any = {};
    headers.forEach((header: string, index: number) => {
      if (!header) return;
      const key = header.toLowerCase().trim().replace(/ /g, '_');
      obj[key] = row[index] || '';
    });
    // Add implicit row index (+2 because values.slice(headerRowIndex + 1) means rIdx 0 is row headerRowIndex+2)
    obj._rowIndex = headerRowIndex + rIdx + 2; 
    return obj as T;
  });
}

const apiCache: Record<string, { data: any, timestamp: number }> = {};
const CACHE_TTL = 60000; // 60 seconds

export const invalidateCache = (sheetName?: string) => {
  if (sheetName) {
    delete apiCache[sheetName];
    // Special case: if Tasks changes, Analytics might also change
    if (sheetName !== 'Analytics') delete apiCache['Analytics'];
  } else {
    for (const key in apiCache) delete apiCache[key];
  }
};

/**
 * Optimistically write data into the in-memory cache so that a
 * navigate-away / navigate-back reads our latest local state instead of
 * racing against an in-flight write to Google Sheets.
 */
export const setCache = (sheetName: string, data: any[]) => {
  apiCache[sheetName] = { data, timestamp: Date.now() };
};

/**
 * Fetch a specific sheet tab using the Google Sheets API v4.
 */
export async function fetchSheet<T>(sheetName: string, spreadsheetId: string, accessToken: string, headerRowIndex: number = 0): Promise<T[]> {
  if (!spreadsheetId || !accessToken) return [];
  
  if (apiCache[sheetName] && Date.now() - apiCache[sheetName].timestamp < CACHE_TTL) {
    return apiCache[sheetName].data as T[];
  }
  
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!A:Z`;
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch sheet ${sheetName}: ${response.statusText}`);
  }

  const data = await response.json();
  const parsed = parseSheetData<T>(data.values || [], headerRowIndex);
  apiCache[sheetName] = { data: parsed, timestamp: Date.now() };
  return parsed;
}

/**
 * Fetch and parse the highly-custom Analytics Dashboard tab.
 */
export async function getAnalyticsDashboard(spreadsheetId: string, accessToken: string): Promise<AnalyticsData | null> {
  if (!spreadsheetId || !accessToken) return null;
  
  if (apiCache['Analytics'] && Date.now() - apiCache['Analytics'].timestamp < CACHE_TTL) {
    return apiCache['Analytics'].data as AnalyticsData;
  }
  
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Analytics!A:K`;
  
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    if (response.status === 400) return null; // Sheet probably doesn't exist
    throw new Error(`Failed to fetch Analytics sheet: ${response.statusText}`);
  }

  const data = await response.json();
  const values = data.values || [];
  
  const analytics: AnalyticsData = {
    overview: { totalOutreaches: '0', totalResponses: '0', noAnswerRate: '0%', responseRate: '0%', followUpsPending: '0' },
    byCategory: [],
    byContactMethod: [],
    byTimeSlot: []
  };

  let currentSection = '';

    const findMetric = (label: string): string | null => {
      for (let r = 0; r < values.length; r++) {
        const rVals = values[r] || [];
        for (let c = 0; c < rVals.length; c++) {
          const cellStr = String(rVals[c]).trim();
          if (cellStr.includes(label)) {
            // Check immediately to the right
            const rightCell = String(rVals[c + 1] || '').trim();
            if (rightCell && !isNaN(parseFloat(rightCell))) return rightCell;
            
            // Check immediately below
            const belowRow = values[r + 1] || [];
            const belowCell = String(belowRow[c] || '').trim();
            if (belowCell && !isNaN(parseFloat(belowCell))) return belowCell;

            // Check row below, first valid column
            const belowRowNums = belowRow.map(v => String(v).trim()).filter(v => v !== '');
            if (belowRowNums.length > 0 && !isNaN(parseFloat(belowRowNums[0]))) return belowRowNums[0];
            
            // Check same row, next valid columns
            const sameRowNums = rVals.slice(c + 1).map(v => String(v).trim()).filter(v => v !== '');
            if (sameRowNums.length > 0 && !isNaN(parseFloat(sameRowNums[0]))) return sameRowNums[0];
          }
        }
      }
      return null;
    };

    analytics.overview.totalOutreaches = findMetric('Total Outreaches') || '0';
    analytics.overview.totalResponses = findMetric('Responses') || '0';
    analytics.overview.noAnswerRate = findMetric('No Answer Rate') || '0%';
    analytics.overview.responseRate = findMetric('Response Rate') || '0%';
    analytics.overview.followUpsPending = findMetric('Follow-Ups Pending') || '0';

  for (let i = 0; i < values.length; i++) {
    const row = values[i];
    if (!row || row.length === 0) {
      currentSection = '';
      continue;
    }
    
    const cells = row.map(c => String(c).trim()).filter(c => c !== '');
    const firstCell = String(row[0] || '').trim();

    // 3. Identify Sections
    if (firstCell === 'By Category') { currentSection = 'category'; i++; continue; }
    if (firstCell === 'By Contact Method') { currentSection = 'method'; i++; continue; }
    if (firstCell === 'By Time Slot') { currentSection = 'time'; i++; continue; }

    // 4. Parse Section Data
    if (currentSection && cells.length >= 5 && !cells[0].includes('Category') && !cells[0].includes('Method') && !cells[0].includes('Time Slot')) {
      const entry = {
        name: cells[0],
        total: cells[1],
        yes: cells[2],
        noAnswer: cells[3],
        responseRate: cells[4]
      };
      
      if (currentSection === 'category') analytics.byCategory.push({ category: entry.name, total: entry.total, yes: entry.yes, noAnswer: entry.noAnswer, responseRate: entry.responseRate });
      if (currentSection === 'method') analytics.byContactMethod.push({ method: entry.name, total: entry.total, yes: entry.yes, noAnswer: entry.noAnswer, responseRate: entry.responseRate });
      if (currentSection === 'time') analytics.byTimeSlot.push({ timeSlot: entry.name, total: entry.total, yes: entry.yes, noAnswer: entry.noAnswer, responseRate: entry.responseRate });
    }
  }

  apiCache['Analytics'] = { data: analytics, timestamp: Date.now() };
  return analytics;
}

/**
 * Append a row to a specific sheet tab, intelligently mapping object keys to the sheet's column headers.
 */
export async function appendRow(sheetName: string, rowData: Record<string, any>, spreadsheetId: string, accessToken: string, headerRowIndex: number = 0): Promise<boolean> {
  if (!spreadsheetId || !accessToken) throw new Error('Missing spreadsheet ID or access token');

  // 1. Fetch the headers first to know where to put each piece of data
  const headerUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!${headerRowIndex + 1}:${headerRowIndex + 1}`;
  const headerResponse = await fetch(headerUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!headerResponse.ok) {
    const errText = await headerResponse.text();
    throw new Error(`Failed to fetch headers for ${sheetName}: ${errText}`);
  }

  const headerData = await headerResponse.json();
  const headers: string[] = (headerData.values && headerData.values[0]) ? headerData.values[0] : [];

  if (headers.length === 0) {
    throw new Error(`No headers found in row 1 of sheet ${sheetName}. Please ensure your sheet has headers (e.g. Task, User, Status).`);
  }

  // Find where the headers actually start (in case Column A is empty)
  let startColIndex = 0;
  while (startColIndex < headers.length && !headers[startColIndex].trim()) {
    startColIndex++;
  }

  if (startColIndex >= headers.length) {
    throw new Error(`No valid headers found in row 1 of sheet ${sheetName}.`);
  }

  const startColLetter = String.fromCharCode(65 + startColIndex);

  // 2. Map the rowData object into an array ordered exactly like the headers
  const orderedRow = headers.map(header => {
    if (!header.trim()) return '';
    const key = header.toLowerCase().trim().replace(/ /g, '_');
    return rowData[key] !== undefined ? rowData[key] : '';
  });

  // Only send data starting from the first actual column so Google Sheets doesn't scan an empty Column A and insert at Row 1
  const slicedRow = orderedRow.slice(startColIndex);

  // 3. Append the ordered array using the specific column letter so it finds the true bottom of the table
  const appendRange = `${sheetName}!${startColLetter}:${startColLetter}`;
  const encodedAppendRange = `${encodeURIComponent(sheetName)}!${startColLetter}:${startColLetter}`;
  const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedAppendRange}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  
  const appendRes = await fetch(appendUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      range: appendRange,
      majorDimension: 'ROWS',
      values: [slicedRow]
    })
  });

  if (!appendRes.ok) {
    const errText = await appendRes.text();
    throw new Error(`Failed to append row to ${sheetName}: ${errText}`);
  }

  invalidateCache(sheetName);
  return true;
}

/**
 * Update a specific row in a sheet tab.
 */
export async function updateRow(sheetName: string, rowIndex: number, rowData: Record<string, any>, spreadsheetId: string, accessToken: string, headerRowIndex: number = 0): Promise<boolean> {
  if (!spreadsheetId || !accessToken) throw new Error('Missing spreadsheet ID or access token');

  // Fetch headers to map the row correctly
  const headerUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!${headerRowIndex + 1}:${headerRowIndex + 1}`;
  const headerResponse = await fetch(headerUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
  
  if (!headerResponse.ok) throw new Error(`Failed to fetch headers: ${await headerResponse.text()}`);
  
  const headerData = await headerResponse.json();
  const headers: string[] = (headerData.values && headerData.values[0]) ? headerData.values[0] : [];

  if (headers.length === 0) throw new Error(`No headers found in sheet ${sheetName}.`);

  // Check if we need to add "Completed At"
  if (rowData.completed_at && !headers.map(h => h.toLowerCase()).includes('completed at')) {
    headers.push('Completed At');
    // Update the header row
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!${headerRowIndex + 1}:${headerRowIndex + 1}?valueInputOption=USER_ENTERED`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [headers] })
    });
  }

  // Find where headers start
  let startColIndex = 0;
  while (startColIndex < headers.length && !headers[startColIndex].trim()) startColIndex++;
  const startColLetter = String.fromCharCode(65 + startColIndex);

  // Map to array
  const orderedRow = headers.map(header => {
    if (!header.trim()) return '';
    const key = header.toLowerCase().trim().replace(/ /g, '_');
    return rowData[key] !== undefined ? rowData[key] : '';
  });

  const slicedRow = orderedRow.slice(startColIndex);
  
  // End column letter
  const endColLetter = String.fromCharCode(65 + startColIndex + slicedRow.length - 1);
  const updateRange = `${encodeURIComponent(sheetName)}!${startColLetter}${rowIndex}:${endColLetter}${rowIndex}`;

  const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${updateRange}?valueInputOption=USER_ENTERED`;
  const updateRes = await fetch(updateUrl, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      range: updateRange,
      majorDimension: 'ROWS',
      values: [slicedRow]
    })
  });

  if (!updateRes.ok) throw new Error(`Failed to update row in ${sheetName}: ${await updateRes.text()}`);
  
  invalidateCache(sheetName);
  return true;
}

/**
 * Physically delete a row from a sheet.
 */
export async function deleteRow(sheetName: string, rowIndex: number, spreadsheetId: string, accessToken: string): Promise<boolean> {
  if (!spreadsheetId || !accessToken) throw new Error('Missing spreadsheet ID or access token');

  // 1. Get the sheetId (numeric ID of the tab)
  const metaUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties(sheetId,title))`;
  const metaRes = await fetch(metaUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
  
  if (!metaRes.ok) throw new Error(`Failed to fetch spreadsheet metadata: ${await metaRes.text()}`);
  
  const metaData = await metaRes.json();
  const sheet = metaData.sheets?.find((s: any) => s.properties?.title === sheetName);
  
  if (!sheet) throw new Error(`Sheet tab named "${sheetName}" not found.`);
  const sheetId = sheet.properties.sheetId;

  // 2. Perform batchUpdate to delete the row (0-indexed, so row 2 is startIndex: 1)
  const batchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`;
  const batchRes = await fetch(batchUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: sheetId,
              dimension: 'ROWS',
              startIndex: rowIndex - 1, // 0-indexed inclusive
              endIndex: rowIndex        // 0-indexed exclusive
            }
          }
        }
      ]
    })
  });

  if (!batchRes.ok) throw new Error(`Failed to delete row: ${await batchRes.text()}`);
  
  invalidateCache(sheetName);
  return true;
}

export const googleSheetsAPI = {
  getTasks: (id: string, token: string) => fetchSheet<Task>('Tasks', id, token),
  getResearch: (id: string, token: string) => fetchSheet<Research>('Research', id, token, 3),
  getFiles: (id: string, token: string) => fetchSheet<FileData>('Files', id, token),
  getGoals: (id: string, token: string) => fetchSheet<Goal>('Goals', id, token),
  getActivity: (id: string, token: string) => fetchSheet<Activity>('Activity', id, token),
  getAnalytics: (id: string, token: string) => getAnalyticsDashboard(id, token),
  getTeamMembers: (id: string, token: string) => fetchSheet<TeamMember>('Team', id, token),
  
  addTask: (taskObj: Record<string, any>, id: string, token: string) => appendRow('Tasks', taskObj, id, token),
  addResearch: (data: Record<string, any>, id: string, token: string) => appendRow('Research', data, id, token, 3),
  addTeamMember: (data: Record<string, any>, id: string, token: string) => appendRow('Team', data, id, token),
  updateTask: (rowIndex: number, taskObj: Record<string, any>, id: string, token: string) => updateRow('Tasks', rowIndex, taskObj, id, token),
  updateResearch: (rowIndex: number, data: Record<string, any>, id: string, token: string) => updateRow('Research', rowIndex, data, id, token, 3),
  deleteTask: (rowIndex: number, id: string, token: string) => deleteRow('Tasks', rowIndex, id, token),
};
