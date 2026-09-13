import { useCallback, useEffect, useState } from 'react';
import { DATA_URLS } from '../lib/config';

type DataKey = keyof typeof DATA_URLS;

interface UseDataResult<T> {
  data: T;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useData<T>(key: DataKey, fallback: T): UseDataResult<T> {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const url = `${DATA_URLS[key]}?t=${Date.now()}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = (await response.json()) as T;
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setData(fallback);
    } finally {
      setLoading(false);
    }
  }, [fallback, key]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
