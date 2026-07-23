import { useEffect, useState } from 'react';

import { BREAKPOINTS, type BreakpointKey } from '@/constants/breakpoints';

export function useMediaQuery(breakpoint: BreakpointKey): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(`(min-width: ${BREAKPOINTS[breakpoint]}px)`).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const query = `(min-width: ${BREAKPOINTS[breakpoint]}px)`;
    const mql = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [breakpoint]);

  return matches;
}
