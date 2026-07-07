import { useState, useEffect, useCallback } from 'react';
import { useGoogleAuth } from '../context/GoogleAuthContext';
import { googleSheetsAPI } from '../lib/googleSheets';

export function useSheetsData<T>(
  fetchFunction: (id: string, token: string) => Promise<T[]>
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
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [spreadsheetId, accessToken, isReady, fetchFunction]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
