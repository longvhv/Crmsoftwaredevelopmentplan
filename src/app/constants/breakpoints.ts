/* ============================================================
 * Breakpoints Constants
 * Centralized responsive breakpoints matching theme.css
 * Step 112 - Phase 1.9 Final Polish
 * ============================================================ */

export const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

/** Media query strings for use in JS (e.g., matchMedia) */
export const MEDIA_QUERIES = {
  xs: `(min-width: ${BREAKPOINTS.xs}px)`,
  sm: `(min-width: ${BREAKPOINTS.sm}px)`,
  md: `(min-width: ${BREAKPOINTS.md}px)`,
  lg: `(min-width: ${BREAKPOINTS.lg}px)`,
  xl: `(min-width: ${BREAKPOINTS.xl}px)`,
  "2xl": `(min-width: ${BREAKPOINTS["2xl"]}px)`,
  /** Detect mobile (below md) */
  mobile: `(max-width: ${BREAKPOINTS.md - 1}px)`,
  /** Detect tablet (md to lg) */
  tablet: `(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`,
  /** Detect desktop (lg and above) */
  desktop: `(min-width: ${BREAKPOINTS.lg}px)`,
  /** Detect touch device */
  touch: "(hover: none) and (pointer: coarse)",
  /** Reduced motion preference */
  reducedMotion: "(prefers-reduced-motion: reduce)",
  /** Dark mode preference */
  darkMode: "(prefers-color-scheme: dark)",
} as const;

/** Column counts per breakpoint for responsive grids */
export const GRID_COLUMNS = {
  xs: 1,
  sm: 2,
  md: 2,
  lg: 3,
  xl: 4,
  "2xl": 4,
} as const;

/** Sidebar behavior per breakpoint */
export const SIDEBAR_BEHAVIOR = {
  xs: "hidden",
  sm: "hidden",
  md: "overlay",
  lg: "collapsed",
  xl: "expanded",
  "2xl": "expanded",
} as const;
