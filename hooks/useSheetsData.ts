import { useState, useEffect, useCallback } from 'react';
import { useGoogleAuth } from '../context/GoogleAuthContext';
import { googleSheetsAPI } from '../lib/googleSheets';
import { toast } from 'sonner';

export function useSheetsData<T>(
  fetchFunction: (id: string, token: string) => Promise<T[]>,
  sheetNameHint?: string
) {
  const { spreadsheetId, accessToken, isReady } = useGoogleAuth();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!isReady) return;
    if (!spreadsheetId || !accessToken) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await fetchFunction(spreadsheetId, accessToken);
      setData(result || []);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || 'Failed to fetch data';
      setError(errorMessage);
      if (errorMessage.includes('Unable to parse range') || errorMessage.includes('Failed to fetch')) {
        toast.error(`Missing or empty tab: Make sure your spreadsheet has the exact tabs required (Tasks, Research, Files, Goals, Activity).`);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [spreadsheetId, accessToken, isReady, fetchFunction]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
