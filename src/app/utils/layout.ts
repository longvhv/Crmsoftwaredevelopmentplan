/**
 * Layout Utility Classes & Helpers
 * Provides consistent spacing, containers, and layout patterns
 * 
 * @module utils/layout
 * @version 2.0
 */

/* ============================================================
 * CONTAINER UTILITIES
 * ============================================================ */

/**
 * Container size classes - Max-width responsive containers
 */
export const container = {
  xs: 'max-w-[20rem]',      // 320px - Mobile
  sm: 'max-w-[24rem]',      // 384px - Small mobile
  md: 'max-w-[28rem]',      // 448px - Large mobile
  lg: 'max-w-[32rem]',      // 512px - Tablet
  xl: 'max-w-[36rem]',      // 576px - Small desktop
  '2xl': 'max-w-[42rem]',   // 672px - Desktop
  '3xl': 'max-w-[48rem]',   // 768px - Large desktop
  '4xl': 'max-w-[56rem]',   // 896px - XL desktop
  '5xl': 'max-w-[64rem]',   // 1024px - 2XL desktop
  '6xl': 'max-w-[72rem]',   // 1152px - 3XL desktop
  '7xl': 'max-w-[80rem]',   // 1280px - Full HD
  full: 'max-w-full',
  prose: 'max-w-prose',     // 65ch - Optimal reading
} as const;

/**
 * Centered container with horizontal padding
 */
export const containerCentered = {
  xs: `${container.xs} mx-auto px-4`,
  sm: `${container.sm} mx-auto px-4`,
  md: `${container.md} mx-auto px-4`,
  lg: `${container.lg} mx-auto px-6`,
  xl: `${container.xl} mx-auto px-6`,
  '2xl': `${container['2xl']} mx-auto px-8`,
  '3xl': `${container['3xl']} mx-auto px-8`,
  '4xl': `${container['4xl']} mx-auto px-8`,
  '5xl': `${container['5xl']} mx-auto px-8`,
  '6xl': `${container['6xl']} mx-auto px-8`,
  '7xl': `${container['7xl']} mx-auto px-8`,
} as const;

/* ============================================================
 * SPACING UTILITIES
 * ============================================================ */

/**
 * Stack spacing - Vertical spacing between elements
 */
export const stack = {
  xs: 'space-y-2',    // 8px
  sm: 'space-y-4',    // 16px
  md: 'space-y-6',    // 24px
  lg: 'space-y-8',    // 32px
  xl: 'space-y-12',   // 48px
} as const;

/**
 * Inline spacing - Horizontal spacing between elements
 */
export const inline = {
  xs: 'space-x-2',    // 8px
  sm: 'space-x-3',    // 12px
  md: 'space-x-4',    // 16px
  lg: 'space-x-6',    // 24px
  xl: 'space-x-8',    // 32px
} as const;

/**
 * Gap spacing - For flex/grid layouts
 */
export const gap = {
  xs: 'gap-2',       // 8px
  sm: 'gap-4',       // 16px
  md: 'gap-6',       // 24px
  lg: 'gap-8',       // 32px
  xl: 'gap-12',      // 48px
} as const;

/**
 * Section spacing - Vertical spacing between major sections
 */
export const section = {
  sm: 'py-12',       // 48px
  md: 'py-16',       // 64px
  lg: 'py-24',       // 96px
  xl: 'py-32',       // 128px
} as const;

/**
 * Card padding - Internal padding for cards
 */
export const cardPadding = {
  sm: 'p-4',         // 16px
  md: 'p-6',         // 24px
  lg: 'p-8',         // 32px
  xl: 'p-10',        // 40px
} as const;

/**
 * Page padding - Standard page padding
 */
export const pagePadding = {
  mobile: 'px-4 py-6',              // 16px horizontal, 24px vertical
  tablet: 'px-6 py-8',              // 24px horizontal, 32px vertical
  desktop: 'px-8 py-10',            // 32px horizontal, 40px vertical
  responsive: 'px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10',
} as const;

/* ============================================================
 * GRID UTILITIES
 * ============================================================ */

/**
 * Grid column templates
 */
export const gridCols = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  12: 'grid-cols-12',
} as const;

/**
 * Responsive grid layouts - Common patterns
 */
export const gridResponsive = {
  // 1 col mobile → 2 cols tablet → 3 cols desktop
  '1-2-3': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  
  // 1 col mobile → 2 cols tablet → 4 cols desktop
  '1-2-4': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  
  // 1 col mobile → 3 cols desktop
  '1-3': 'grid grid-cols-1 lg:grid-cols-3',
  
  // 1 col mobile → 2 cols desktop
  '1-2': 'grid grid-cols-1 md:grid-cols-2',
  
  // 2 cols mobile → 4 cols desktop
  '2-4': 'grid grid-cols-2 lg:grid-cols-4',
  
  // Auto-fit with min size
  autoFit: 'grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))]',
  autoFill: 'grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))]',
} as const;

/**
 * Grid with gap presets
 */
export const gridWithGap = {
  sm: 'grid gap-4',      // 16px
  md: 'grid gap-6',      // 24px
  lg: 'grid gap-8',      // 32px
  xl: 'grid gap-12',     // 48px
} as const;

/* ============================================================
 * FLEX UTILITIES
 * ============================================================ */

/**
 * Flex layouts - Common patterns
 */
export const flex = {
  row: 'flex flex-row',
  col: 'flex flex-col',
  center: 'flex items-center justify-center',
  between: 'flex items-center justify-between',
  start: 'flex items-start justify-start',
  end: 'flex items-end justify-end',
  wrap: 'flex flex-wrap',
} as const;

/**
 * Flex with gap
 */
export const flexWithGap = {
  xs: 'flex gap-2',      // 8px
  sm: 'flex gap-4',      // 16px
  md: 'flex gap-6',      // 24px
  lg: 'flex gap-8',      // 32px
} as const;

/* ============================================================
 * Z-INDEX UTILITIES
 * ============================================================ */

/**
 * Z-index layers - Consistent stacking order
 */
export const zIndex = {
  base: 'z-0',
  dropdown: 'z-[1000]',
  sticky: 'z-[1100]',
  fixed: 'z-[1200]',
  modalBackdrop: 'z-[1300]',
  modal: 'z-[1400]',
  popover: 'z-[1500]',
  tooltip: 'z-[1600]',
  notification: 'z-[1700]',
  max: 'z-[9999]',
} as const;

/* ============================================================
 * ASPECT RATIO UTILITIES
 * ============================================================ */

/**
 * Aspect ratio classes
 */
export const aspectRatio = {
  square: 'aspect-square',        // 1:1
  video: 'aspect-video',          // 16:9
  photo: 'aspect-[4/3]',          // 4:3
  portrait: 'aspect-[3/4]',       // 3:4
  wide: 'aspect-[21/9]',          // 21:9
  ultrawide: 'aspect-[32/9]',     // 32:9
} as const;

/* ============================================================
 * POSITION UTILITIES
 * ============================================================ */

/**
 * Common positioning patterns
 */
export const position = {
  absolute: 'absolute',
  relative: 'relative',
  fixed: 'fixed',
  sticky: 'sticky',
  
  // Absolute positioning helpers
  topLeft: 'absolute top-0 left-0',
  topRight: 'absolute top-0 right-0',
  bottomLeft: 'absolute bottom-0 left-0',
  bottomRight: 'absolute bottom-0 right-0',
  center: 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  
  // Fixed positioning helpers
  fixedTop: 'fixed top-0 left-0 right-0',
  fixedBottom: 'fixed bottom-0 left-0 right-0',
  
  // Full coverage
  fullCover: 'absolute inset-0',
} as const;

/* ============================================================
 * OVERFLOW UTILITIES
 * ============================================================ */

/**
 * Overflow handling
 */
export const overflow = {
  hidden: 'overflow-hidden',
  scroll: 'overflow-scroll',
  auto: 'overflow-auto',
  xScroll: 'overflow-x-scroll',
  yScroll: 'overflow-y-scroll',
  xAuto: 'overflow-x-auto',
  yAuto: 'overflow-y-auto',
} as const;

/* ============================================================
 * DISPLAY UTILITIES
 * ============================================================ */

/**
 * Display classes
 */
export const display = {
  block: 'block',
  inline: 'inline',
  inlineBlock: 'inline-block',
  flex: 'flex',
  inlineFlex: 'inline-flex',
  grid: 'grid',
  inlineGrid: 'inline-grid',
  hidden: 'hidden',
  none: 'hidden',
} as const;

/* ============================================================
 * RESPONSIVE VISIBILITY
 * ============================================================ */

/**
 * Responsive show/hide utilities
 */
export const responsive = {
  mobileOnly: 'block md:hidden',
  tabletUp: 'hidden md:block',
  desktopOnly: 'hidden lg:block',
  tabletOnly: 'hidden md:block lg:hidden',
} as const;

/* ============================================================
 * LAYOUT PRESETS - Common Patterns
 * ============================================================ */

/**
 * Page layout - Standard page container
 */
export const pageLayout = `${containerCentered['7xl']} ${pagePadding.responsive}`;

/**
 * Card layout - Standard card with padding
 */
export const cardLayout = `bg-card rounded-lg border ${cardPadding.md}`;

/**
 * Section layout - Content section with spacing
 */
export const sectionLayout = `${section.md} ${containerCentered['6xl']}`;

/**
 * Sidebar layout - Two-column layout with sidebar
 */
export const sidebarLayout = {
  container: 'flex gap-6',
  sidebar: 'w-64 flex-shrink-0',
  main: 'flex-1 min-w-0',
} as const;

/**
 * Dashboard grid - Responsive dashboard layout
 */
export const dashboardGrid = `${gridResponsive['1-2-3']} ${gap.md}`;

/**
 * Form layout - Standard form spacing
 */
export const formLayout = {
  container: `${stack.md}`,
  field: `${stack.xs}`,
  group: `${gridWithGap.md} ${gridResponsive['1-2']}`,
} as const;

/* ============================================================
 * HELPER FUNCTIONS
 * ============================================================ */

/**
 * Combine multiple layout classes
 * @param classes - Array of class strings to combine
 * @returns Combined className string
 * 
 * @example
 * ```tsx
 * <div className={combineLayout([flex.between, gap.md, cardPadding.lg])}>
 *   Content
 * </div>
 * ```
 */
export function combineLayout(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Get responsive container class
 * @param size - Container size
 * @param centered - Whether to center the container
 * @returns className string
 * 
 * @example
 * ```tsx
 * <div className={getContainer('7xl', true)}>
 *   Centered content with max-width
 * </div>
 * ```
 */
export function getContainer(
  size: keyof typeof container,
  centered: boolean = false
): string {
  return centered ? containerCentered[size] : container[size];
}

/**
 * Create custom grid with specified columns and gap
 * @param cols - Number of columns (1-12)
 * @param gapSize - Gap size (xs, sm, md, lg, xl)
 * @returns className string
 * 
 * @example
 * ```tsx
 * <div className={createGrid(3, 'md')}>
 *   Grid items
 * </div>
 * ```
 */
export function createGrid(
  cols: keyof typeof gridCols,
  gapSize: keyof typeof gap = 'md'
): string {
  return `grid ${gridCols[cols]} ${gap[gapSize]}`;
}

/**
 * Create flex layout with alignment and gap
 * @param direction - Flex direction
 * @param alignment - Alignment preset
 * @param gapSize - Gap size
 * @returns className string
 * 
 * @example
 * ```tsx
 * <div className={createFlex('row', 'between', 'sm')}>
 *   Flex items
 * </div>
 * ```
 */
export function createFlex(
  direction: 'row' | 'col',
  alignment: 'start' | 'center' | 'end' | 'between' = 'start',
  gapSize?: keyof typeof gap
): string {
  const directionClass = direction === 'row' ? 'flex-row' : 'flex-col';
  
  const alignmentMap = {
    start: 'items-start justify-start',
    center: 'items-center justify-center',
    end: 'items-end justify-end',
    between: 'items-center justify-between',
  };
  
  const gapClass = gapSize ? gap[gapSize] : '';
  
  return combineLayout('flex', directionClass, alignmentMap[alignment], gapClass);
}

/**
 * Generate responsive padding classes
 * @param mobile - Mobile padding value (Tailwind spacing)
 * @param desktop - Desktop padding value (Tailwind spacing)
 * @returns className string
 * 
 * @example
 * ```tsx
 * <div className={responsivePadding('4', '8')}>
 *   Content with responsive padding
 * </div>
 * ```
 */
export function responsivePadding(mobile: string, desktop: string): string {
  return `p-${mobile} lg:p-${desktop}`;
}

/* ============================================================
 * TYPE DEFINITIONS
 * ============================================================ */

export type ContainerSize = keyof typeof container;
export type StackSize = keyof typeof stack;
export type GapSize = keyof typeof gap;
export type SectionSize = keyof typeof section;
export type GridCols = keyof typeof gridCols;
export type AspectRatio = keyof typeof aspectRatio;
export type ZIndexLayer = keyof typeof zIndex;

/* ============================================================
 * DEFAULT EXPORTS
 * ============================================================ */

export default {
  container,
  containerCentered,
  stack,
  inline,
  gap,
  section,
  cardPadding,
  pagePadding,
  gridCols,
  gridResponsive,
  gridWithGap,
  flex,
  flexWithGap,
  zIndex,
  aspectRatio,
  position,
  overflow,
  display,
  responsive,
  // Presets
  pageLayout,
  cardLayout,
  sectionLayout,
  sidebarLayout,
  dashboardGrid,
  formLayout,
  // Helpers
  combineLayout,
  getContainer,
  createGrid,
  createFlex,
  responsivePadding,
};
