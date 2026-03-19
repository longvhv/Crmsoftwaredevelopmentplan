/**
 * Elevation Utilities
 * Shadow and elevation presets from design system
 * 
 * @module utils/elevation
 * @version 2.0
 */

/* ============================================================
 * ELEVATION LEVELS
 * ============================================================ */

export const elevation = {
  none: 'shadow-none',
  xs: 'shadow-[var(--shadow-xs)]',
  sm: 'shadow-[var(--shadow-sm)]',
  md: 'shadow-[var(--shadow-md)]',
  lg: 'shadow-[var(--shadow-lg)]',
  xl: 'shadow-[var(--shadow-xl)]',
  '2xl': 'shadow-[var(--shadow-2xl)]',
} as const;

/* ============================================================
 * ELEVATION WITH HOVER
 * ============================================================ */

export const elevationHover = {
  none: 'hover:shadow-none',
  xs: 'hover:shadow-[var(--shadow-xs)]',
  sm: 'hover:shadow-[var(--shadow-sm)]',
  md: 'hover:shadow-[var(--shadow-md)]',
  lg: 'hover:shadow-[var(--shadow-lg)]',
  xl: 'hover:shadow-[var(--shadow-xl)]',
  '2xl': 'hover:shadow-[var(--shadow-2xl)]',
} as const;

/* ============================================================
 * COMPONENT-SPECIFIC ELEVATIONS
 * ============================================================ */

export const cardElevation = {
  default: elevation.sm,
  hover: 'hover:shadow-[var(--shadow-md)]',
  active: 'active:shadow-[var(--shadow-xs)]',
} as const;

export const buttonElevation = {
  default: elevation.sm,
  hover: 'hover:shadow-[var(--shadow-md)]',
  active: 'active:shadow-none',
} as const;

export const inputElevation = {
  default: 'shadow-[var(--shadow-input)]',
  focus: 'focus:shadow-[var(--shadow-input-focus)]',
} as const;

export const modalElevation = {
  default: elevation.xl,
} as const;

export const dropdownElevation = {
  default: elevation.lg,
} as const;

export const tooltipElevation = {
  default: elevation.md,
} as const;

/* ============================================================
 * AI-SPECIFIC ELEVATIONS
 * ============================================================ */

export const aiElevation = {
  glow: 'shadow-[var(--shadow-ai-glow)]',
  strong: 'shadow-[var(--shadow-ai-strong)]',
  subtle: 'shadow-[var(--shadow-ai-subtle)]',
} as const;

/* ============================================================
 * INNER SHADOWS
 * ============================================================ */

export const innerShadow = {
  sm: 'shadow-[var(--shadow-inner-sm)]',
  md: 'shadow-[var(--shadow-inner-md)]',
  lg: 'shadow-[var(--shadow-inner-lg)]',
} as const;

/* ============================================================
 * COLORED SHADOWS
 * ============================================================ */

export const coloredShadow = {
  primary: 'shadow-[0_4px_12px_rgba(59,130,246,0.3)]',
  success: 'shadow-[0_4px_12px_rgba(34,197,94,0.3)]',
  warning: 'shadow-[0_4px_12px_rgba(251,146,60,0.3)]',
  error: 'shadow-[0_4px_12px_rgba(239,68,68,0.3)]',
  ai: 'shadow-[0_8px_16px_rgba(139,92,246,0.4)]',
} as const;

/* ============================================================
 * HELPER FUNCTIONS
 * ============================================================ */

/**
 * Get elevation class by level
 */
export function getElevation(level: keyof typeof elevation = 'md'): string {
  return elevation[level];
}

/**
 * Combine elevation with hover
 */
export function elevationWithHover(
  base: keyof typeof elevation = 'sm',
  hover: keyof typeof elevation = 'md'
): string {
  return `${elevation[base]} ${elevationHover[hover]}`;
}

/* ============================================================
 * DEFAULT EXPORT
 * ============================================================ */

export default {
  elevation,
  elevationHover,
  cardElevation,
  buttonElevation,
  inputElevation,
  modalElevation,
  dropdownElevation,
  tooltipElevation,
  aiElevation,
  innerShadow,
  coloredShadow,
  getElevation,
  elevationWithHover,
};
