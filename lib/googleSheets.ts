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

export interface Activity {
  id: string;
  action_type: string;
  description: string;
  owner: string;
  category: string;
  timestamp: string;
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

/**
 * Fetch a specific sheet tab using the Google Sheets API v4.
 */
export async function fetchSheet<T>(sheetName: string, spreadsheetId: string, accessToken: string, headerRowIndex: number = 0): Promise<T[]> {
  if (!spreadsheetId || !accessToken) return [];
  
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
  return parseSheetData<T>(data.values || [], headerRowIndex);
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
  const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!${startColLetter}:${startColLetter}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  
  const appendResponse = await fetch(appendUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      range: `${sheetName}!${startColLetter}:${startColLetter}`,
      majorDimension: 'ROWS',
      values: [slicedRow],
    }),
  });

  if (!appendResponse.ok) {
    const errText = await appendResponse.text();
    throw new Error(`Failed to append to sheet ${sheetName}: ${errText}`);
  }

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
  const range = `${sheetName}!${startColLetter}${rowIndex}:${endColLetter}${rowIndex}`;

  const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;
  const updateResponse = await fetch(updateUrl, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ range, majorDimension: 'ROWS', values: [slicedRow] })
  });

  if (!updateResponse.ok) throw new Error(`Failed to update row: ${await updateResponse.text()}`);
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
  return true;
}

export const googleSheetsAPI = {
  getTasks: (id: string, token: string) => fetchSheet<Task>('Tasks', id, token),
  getResearch: (id: string, token: string) => fetchSheet<Research>('Research', id, token, 3),
  getFiles: (id: string, token: string) => fetchSheet<FileData>('Files', id, token),
  getGoals: (id: string, token: string) => fetchSheet<Goal>('Goals', id, token),
  getActivity: (id: string, token: string) => fetchSheet<Activity>('Activity', id, token),
  
  addTask: (taskObj: Record<string, any>, id: string, token: string) => appendRow('Tasks', taskObj, id, token),
  addResearch: (data: Record<string, any>, id: string, token: string) => appendRow('Research', data, id, token, 3),
  updateTask: (rowIndex: number, taskObj: Record<string, any>, id: string, token: string) => updateRow('Tasks', rowIndex, taskObj, id, token),
  updateResearch: (rowIndex: number, data: Record<string, any>, id: string, token: string) => updateRow('Research', rowIndex, data, id, token, 3),
  deleteTask: (rowIndex: number, id: string, token: string) => deleteRow('Tasks', rowIndex, id, token),
};
