/**
 * Typography Utility Classes & Helpers
 * Provides consistent typography presets across the application
 * 
 * @module utils/typography
 * @version 2.0
 */

/* ============================================================
 * TYPOGRAPHY PRESET CLASSES (as className strings)
 * ============================================================ */

/**
 * Display text classes - For hero sections and large headings
 */
export const display = {
  '2xl': 'text-[4.5rem] leading-[1.1] font-bold tracking-tight',      // 72px
  xl: 'text-[3.75rem] leading-[1.1] font-bold tracking-tight',        // 60px
  lg: 'text-[3rem] leading-[1.2] font-bold tracking-tight',           // 48px
} as const;

/**
 * Heading classes - For section headings and page titles
 */
export const heading = {
  xl: 'text-[2.25rem] leading-[1.25] font-semibold',                   // 36px
  lg: 'text-[1.875rem] leading-[1.3] font-semibold',                  // 30px
  md: 'text-[1.5rem] leading-[1.35] font-semibold',                   // 24px
  sm: 'text-[1.25rem] leading-[1.4] font-semibold',                   // 20px
  xs: 'text-[1.125rem] leading-[1.45] font-semibold',                 // 18px
} as const;

/**
 * Body text classes - For main content and paragraphs
 */
export const body = {
  lg: 'text-[1.125rem] leading-[1.625] font-normal',                  // 18px
  md: 'text-base leading-normal font-normal',                         // 16px (default)
  sm: 'text-sm leading-normal font-normal',                           // 14px
  xs: 'text-xs leading-normal font-normal',                           // 12px
} as const;

/**
 * Label classes - For form labels and UI labels
 */
export const label = {
  lg: 'text-sm leading-normal font-medium',                           // 14px
  md: 'text-[0.8125rem] leading-normal font-medium',                 // 13px
  sm: 'text-xs leading-normal font-medium',                           // 12px
} as const;

/**
 * Code/Mono classes - For code snippets and technical text
 */
export const code = {
  base: 'text-sm leading-[1.7] font-normal font-mono',                // 14px
  inline: 'text-sm font-mono bg-muted px-1 py-0.5 rounded',
  block: 'text-sm font-mono bg-muted p-4 rounded-lg overflow-x-auto',
} as const;

/**
 * Helper text classes - For captions, hints, metadata
 */
export const helper = {
  lg: 'text-sm leading-normal text-muted-foreground',                 // 14px
  md: 'text-xs leading-normal text-muted-foreground',                 // 12px
  sm: 'text-[0.6875rem] leading-normal text-muted-foreground',       // 11px
} as const;

/* ============================================================
 * FONT WEIGHT UTILITIES
 * ============================================================ */

export const fontWeight = {
  thin: 'font-thin',              // 100
  extralight: 'font-extralight',  // 200
  light: 'font-light',            // 300
  normal: 'font-normal',          // 400
  medium: 'font-medium',          // 500
  semibold: 'font-semibold',      // 600
  bold: 'font-bold',              // 700
  extrabold: 'font-extrabold',    // 800
  black: 'font-black',            // 900
} as const;

/* ============================================================
 * FONT FAMILY UTILITIES
 * ============================================================ */

export const fontFamily = {
  sans: 'font-sans',
  mono: 'font-mono',
} as const;

/* ============================================================
 * TEXT DECORATION UTILITIES
 * ============================================================ */

export const textDecoration = {
  underline: 'underline underline-offset-[0.2em]',
  overline: 'overline',
  lineThrough: 'line-through',
  noUnderline: 'no-underline',
} as const;

/* ============================================================
 * LETTER SPACING UTILITIES
 * ============================================================ */

export const tracking = {
  tighter: 'tracking-tighter',    // -0.05em
  tight: 'tracking-tight',        // -0.025em
  normal: 'tracking-normal',      // 0em
  wide: 'tracking-wide',          // 0.025em
  wider: 'tracking-wider',        // 0.05em
  widest: 'tracking-widest',      // 0.1em
} as const;

/* ============================================================
 * LINE HEIGHT UTILITIES
 * ============================================================ */

export const leading = {
  none: 'leading-none',           // 1
  tight: 'leading-tight',         // 1.25
  snug: 'leading-snug',           // 1.375
  normal: 'leading-normal',       // 1.5
  relaxed: 'leading-relaxed',     // 1.625
  loose: 'leading-loose',         // 2
} as const;

/* ============================================================
 * TEXT ALIGNMENT UTILITIES
 * ============================================================ */

export const textAlign = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
} as const;

/* ============================================================
 * TEXT TRANSFORM UTILITIES
 * ============================================================ */

export const textTransform = {
  uppercase: 'uppercase',
  lowercase: 'lowercase',
  capitalize: 'capitalize',
  normalCase: 'normal-case',
} as const;

/* ============================================================
 * TEXT OVERFLOW UTILITIES
 * ============================================================ */

export const textOverflow = {
  truncate: 'truncate',
  ellipsis: 'text-ellipsis',
  clip: 'text-clip',
} as const;

/* ============================================================
 * PRESET COMBINATIONS - Common Typography Patterns
 * ============================================================ */

/**
 * Page title preset - For main page headings
 */
export const pageTitle = `${heading.xl} tracking-tight`;

/**
 * Section title preset - For section headings within pages
 */
export const sectionTitle = `${heading.lg} tracking-tight`;

/**
 * Card title preset - For card headings
 */
export const cardTitle = `${heading.sm}`;

/**
 * Subheading preset - For subsections
 */
export const subheading = `${heading.xs} text-muted-foreground`;

/**
 * Paragraph preset - For main body text
 */
export const paragraph = `${body.md} text-foreground`;

/**
 * Caption preset - For image captions, metadata
 */
export const caption = `${helper.md}`;

/**
 * Badge text preset - For badges and pills
 */
export const badgeText = `${label.sm} uppercase ${tracking.wide}`;

/**
 * Button text preset - For button labels
 */
export const buttonText = `${body.sm} font-medium`;

/**
 * Link preset - For inline links
 */
export const link = `${body.md} text-primary hover:underline ${textDecoration.underline}`;

/**
 * Muted text preset - For less important text
 */
export const muted = `${body.sm} text-muted-foreground`;

/* ============================================================
 * RESPONSIVE TYPOGRAPHY HELPERS
 * ============================================================ */

/**
 * Responsive display - Scales down on mobile
 */
export const displayResponsive = {
  '2xl': `${heading.lg} md:${display['2xl']}`,
  xl: `${heading.lg} md:${display.xl}`,
  lg: `${heading.md} md:${display.lg}`,
} as const;

/**
 * Responsive heading - Scales down on mobile
 */
export const headingResponsive = {
  xl: `${heading.md} md:${heading.xl}`,
  lg: `${heading.sm} md:${heading.lg}`,
  md: `${heading.xs} md:${heading.md}`,
} as const;

/* ============================================================
 * TYPOGRAPHY COMPONENT HELPERS
 * ============================================================ */

/**
 * Get typography class for a specific variant
 * @param variant - Typography variant to use
 * @returns className string
 * 
 * @example
 * ```tsx
 * <h1 className={getTypography('display', '2xl')}>Hero Title</h1>
 * <p className={getTypography('body', 'md')}>Paragraph text</p>
 * ```
 */
export function getTypography(
  type: 'display' | 'heading' | 'body' | 'label' | 'code' | 'helper',
  size: string
): string {
  const typeMap = { display, heading, body, label, code, helper };
  const typeObj = typeMap[type];
  
  if (!typeObj || !(size in typeObj)) {
    console.warn(`Typography variant not found: ${type}.${size}`);
    return body.md; // fallback to default
  }
  
  return (typeObj as Record<string, string>)[size];
}

/**
 * Combine multiple typography classes
 * @param classes - Array of class strings to combine
 * @returns Combined className string
 * 
 * @example
 * ```tsx
 * <h2 className={combineTypography([heading.lg, tracking.tight, textAlign.center])}>
 *   Centered Title
 * </h2>
 * ```
 */
export function combineTypography(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Truncate text with ellipsis after N lines
 * @param lines - Number of lines to show before truncating
 * @returns className string
 * 
 * @example
 * ```tsx
 * <p className={truncateLines(3)}>Long text that will be truncated after 3 lines...</p>
 * ```
 */
export function truncateLines(lines: number): string {
  return `overflow-hidden text-ellipsis line-clamp-${lines}`;
}

/* ============================================================
 * TYPE DEFINITIONS
 * ============================================================ */

export type DisplaySize = keyof typeof display;
export type HeadingSize = keyof typeof heading;
export type BodySize = keyof typeof body;
export type LabelSize = keyof typeof label;
export type CodeVariant = keyof typeof code;
export type HelperSize = keyof typeof helper;

export type TypographyType = 'display' | 'heading' | 'body' | 'label' | 'code' | 'helper';
export type FontWeight = keyof typeof fontWeight;
export type FontFamily = keyof typeof fontFamily;
export type Tracking = keyof typeof tracking;
export type Leading = keyof typeof leading;
export type TextAlign = keyof typeof textAlign;

/* ============================================================
 * DEFAULT EXPORTS
 * ============================================================ */

export default {
  display,
  heading,
  body,
  label,
  code,
  helper,
  fontWeight,
  fontFamily,
  textDecoration,
  tracking,
  leading,
  textAlign,
  textTransform,
  textOverflow,
  // Presets
  pageTitle,
  sectionTitle,
  cardTitle,
  subheading,
  paragraph,
  caption,
  badgeText,
  buttonText,
  link,
  muted,
  // Responsive
  displayResponsive,
  headingResponsive,
  // Helpers
  getTypography,
  combineTypography,
  truncateLines,
};
