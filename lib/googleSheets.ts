export interface Task {
  id: string;
  task: string;
  owner: string;
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
      obj[header] = row[index] || '';
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
 * Append a row to a specific sheet tab using the Google Sheets API v4.
 */
export async function appendRow(sheetName: string, rowData: any[], spreadsheetId: string, accessToken: string): Promise<boolean> {
  if (!spreadsheetId || !accessToken) return false;

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!A:A:append?valueInputOption=USER_ENTERED`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      range: `${sheetName}!A:A`,
      majorDimension: 'ROWS',
      values: [rowData],
    }),
  });

  if (!response.ok) {
    console.error(`Failed to append to sheet ${sheetName}:`, await response.text());
    return false;
  }

  return true;
}

export const googleSheetsAPI = {
  getTasks: (id: string, token: string) => fetchSheet<Task>('Tasks', id, token),
  getResearch: (id: string, token: string) => fetchSheet<Research>('Research', id, token),
  getFiles: (id: string, token: string) => fetchSheet<FileData>('Files', id, token),
  getGoals: (id: string, token: string) => fetchSheet<Goal>('Goals', id, token),
  getActivity: (id: string, token: string) => fetchSheet<Activity>('Activity', id, token),
  
  addTask: (taskValues: any[], id: string, token: string) => appendRow('Tasks', taskValues, id, token),
};
