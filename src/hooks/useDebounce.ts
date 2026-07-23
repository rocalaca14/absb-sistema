import { useEffect, useState } from 'react';

const DEFAULT_DELAY = 300;

export function useDebounce<T>(value: T, delay: number = DEFAULT_DELAY): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
