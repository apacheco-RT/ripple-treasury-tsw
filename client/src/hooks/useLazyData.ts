import { useState, useEffect } from "react";

export function useLazyData<T>(loader: () => Promise<T>): T | null {
  const [data, setData] = useState<T | null>(null);
  useEffect(() => {
    let cancelled = false;
    loader().then((result) => {
      if (!cancelled) setData(result);
    });
    return () => { cancelled = true; };
  }, []);
  return data;
}
