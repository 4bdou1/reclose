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
}

export interface Research {
  id: string;
  title: string;
  type: string;
  summary: string;
  owner: string;
  source_link: string;
  tags: string;
  date_added: string;
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
function parseSheetData<T>(values: any[][]): T[] {
  if (!values || values.length < 2) return [];
  
  const headers = values[0];
  const rows = values.slice(1);
  
  return rows.map(row => {
    const obj: any = {};
    headers.forEach((header: string, index: number) => {
      const key = header.toLowerCase().trim().replace(/ /g, '_');
      obj[key] = row[index] || '';
    });
    return obj as T;
  });
}

/**
 * Fetch a specific sheet tab using the Google Sheets API v4.
 */
export async function fetchSheet<T>(sheetName: string, spreadsheetId: string, accessToken: string): Promise<T[]> {
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
  return parseSheetData<T>(data.values || []);
}

/**
 * Append a row to a specific sheet tab, intelligently mapping object keys to the sheet's column headers.
 */
export async function appendRow(sheetName: string, rowData: Record<string, any>, spreadsheetId: string, accessToken: string): Promise<boolean> {
  if (!spreadsheetId || !accessToken) throw new Error('Missing spreadsheet ID or access token');

  // 1. Fetch the headers (Row 1) first to know where to put each piece of data
  const headerUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!1:1`;
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

  // 2. Map the rowData object into an array ordered exactly like the headers
  const orderedRow = headers.map(header => {
    // lowercase the header to make matching case-insensitive and robust
    const key = header.toLowerCase().trim().replace(/ /g, '_');
    return rowData[key] !== undefined ? rowData[key] : '';
  });

  // 3. Append the ordered array
  const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!A:A:append?valueInputOption=USER_ENTERED`;
  
  const appendResponse = await fetch(appendUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      range: `${sheetName}!A:A`,
      majorDimension: 'ROWS',
      values: [orderedRow],
    }),
  });

  if (!appendResponse.ok) {
    const errText = await appendResponse.text();
    throw new Error(`Failed to append to sheet ${sheetName}: ${errText}`);
  }

  return true;
}

export const googleSheetsAPI = {
  getTasks: (id: string, token: string) => fetchSheet<Task>('Tasks', id, token),
  getResearch: (id: string, token: string) => fetchSheet<Research>('Research', id, token),
  getFiles: (id: string, token: string) => fetchSheet<FileData>('Files', id, token),
  getGoals: (id: string, token: string) => fetchSheet<Goal>('Goals', id, token),
  getActivity: (id: string, token: string) => fetchSheet<Activity>('Activity', id, token),
  
  addTask: (taskObj: Record<string, any>, id: string, token: string) => appendRow('Tasks', taskObj, id, token),
};
