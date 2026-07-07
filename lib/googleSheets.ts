import Papa from 'papaparse';

// You will need to provide your Google Spreadsheet ID here or in an env variable
const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID || 'YOUR_SPREADSHEET_ID';

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

async function fetchSheetData<T>(sheetName: string): Promise<T[]> {
  if (SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID') {
    console.warn('Google Sheet ID not set. Please set VITE_GOOGLE_SHEET_ID in your .env file.');
    return [];
  }

  // To use this, the Google Sheet MUST be published to the web as CSV:
  // File -> Share -> Publish to web -> Select the specific sheet -> Comma-separated values (.csv)
  // Or, you can use the gviz URL format if the sheet is public to "Anyone with the link"
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;

  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data as T[]);
      },
      error: (error) => {
        console.error(`Error fetching data for sheet ${sheetName}:`, error);
        reject(error);
      }
    });
  });
}

export const googleSheets = {
  getTasks: () => fetchSheetData<Task>('Tasks'),
  getResearch: () => fetchSheetData<Research>('Research'),
  getFiles: () => fetchSheetData<FileData>('Files'),
  getGoals: () => fetchSheetData<Goal>('Goals'),
  getActivity: () => fetchSheetData<Activity>('Activity'),
};
