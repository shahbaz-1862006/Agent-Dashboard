import { useEffect, useState } from "react";

export function useAsync<T>(fn: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fn()
      .then((res) => {
        if (!active) return;
        setData(res);
      })
      .catch((e) => {
        if (!active) return;
        setError(e?.message ?? "Something went wrong");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error, loading, setData };
}
