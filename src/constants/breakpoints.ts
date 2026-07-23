export const BREAKPOINTS = {
  xs: 320,
  sm: 390,
  md: 480,
  lg: 768,
  xl: 1024,
  '2xl': 1280,
  '3xl': 1440,
  '4xl': 1920,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;
