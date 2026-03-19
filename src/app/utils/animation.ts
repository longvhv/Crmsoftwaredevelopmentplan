/**
 * Animation & Transition Utility Classes
 * Provides consistent motion design across the application
 * 
 * @module utils/animation
 * @version 2.0
 */

/* ============================================================
 * TRANSITION DURATIONS
 * ============================================================ */

export const duration = {
  instant: 'duration-0',          // 0ms
  fast: 'duration-150',           // 150ms
  normal: 'duration-200',         // 200ms (default)
  moderate: 'duration-300',       // 300ms
  slow: 'duration-500',           // 500ms
  slower: 'duration-700',         // 700ms
  slowest: 'duration-1000',       // 1000ms
} as const;

/* ============================================================
 * EASING FUNCTIONS
 * ============================================================ */

export const easing = {
  linear: 'ease-linear',
  in: 'ease-in',
  out: 'ease-out',
  inOut: 'ease-in-out',
  // Custom easing with cubic-bezier
  smooth: '[transition-timing-function:cubic-bezier(0.25,0.46,0.45,0.94)]',
  bounce: '[transition-timing-function:cubic-bezier(0.68,-0.55,0.265,1.55)]',
  elastic: '[transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)]',
  sharp: '[transition-timing-function:cubic-bezier(0.4,0,0.6,1)]',
} as const;

/* ============================================================
 * TRANSITION PRESETS
 * ============================================================ */

export const transition = {
  all: 'transition-all duration-200 ease-in-out',
  colors: 'transition-colors duration-200 ease-in-out',
  opacity: 'transition-opacity duration-200 ease-in-out',
  transform: 'transition-transform duration-200 ease-in-out',
  shadow: 'transition-shadow duration-200 ease-in-out',
  none: 'transition-none',
} as const;

/* ============================================================
 * ANIMATION KEYFRAMES - Use with animate-* classes
 * ============================================================ */

export const animation = {
  // Fade
  fadeIn: 'animate-[fadeIn_300ms_ease-in-out]',
  fadeOut: 'animate-[fadeOut_300ms_ease-in-out]',
  
  // Slide
  slideInUp: 'animate-[slideInUp_300ms_ease-out]',
  slideInDown: 'animate-[slideInDown_300ms_ease-out]',
  slideInLeft: 'animate-[slideInLeft_300ms_ease-out]',
  slideInRight: 'animate-[slideInRight_300ms_ease-out]',
  
  // Scale
  scaleIn: 'animate-[scaleIn_200ms_ease-out]',
  scaleOut: 'animate-[scaleOut_200ms_ease-in]',
  zoomIn: 'animate-[zoomIn_300ms_ease-out]',
  zoomOut: 'animate-[zoomOut_300ms_ease-in]',
  
  // Spin & Rotate
  spin: 'animate-spin',                          // Tailwind built-in
  spinSlow: 'animate-[spin_3s_linear_infinite]',
  
  // Pulse & Ping
  pulse: 'animate-pulse',                        // Tailwind built-in
  ping: 'animate-ping',                          // Tailwind built-in
  
  // Bounce
  bounce: 'animate-bounce',                      // Tailwind built-in
  bounceSlow: 'animate-[bounce_2s_ease-in-out_infinite]',
  
  // Micro-interactions
  shake: 'animate-[shake_500ms_ease-in-out]',
  wiggle: 'animate-[wiggle_500ms_ease-in-out]',
  
  // Loading states
  shimmer: 'animate-[shimmer_2s_linear_infinite]',
  progress: 'animate-[progress_2s_ease-in-out_infinite]',
  
  // Effects
  ripple: 'animate-[ripple_600ms_ease-out]',
  glow: 'animate-[glow_2s_ease-in-out_infinite]',
  gradient: 'animate-[gradient_3s_ease_infinite]',
} as const;

/* ============================================================
 * ANIMATION DELAYS
 * ============================================================ */

export const delay = {
  0: 'delay-0',           // 0ms
  50: 'delay-50',         // 50ms
  100: 'delay-100',       // 100ms
  150: 'delay-150',       // 150ms
  200: 'delay-200',       // 200ms
  300: 'delay-300',       // 300ms
  500: 'delay-500',       // 500ms
  700: 'delay-700',       // 700ms
  1000: 'delay-1000',     // 1000ms
} as const;

/* ============================================================
 * HOVER EFFECTS
 * ============================================================ */

export const hover = {
  // Scale
  scaleUp: 'hover:scale-105 transition-transform duration-200',
  scaleDown: 'hover:scale-95 transition-transform duration-200',
  
  // Translate
  liftUp: 'hover:-translate-y-1 transition-transform duration-200',
  pushDown: 'hover:translate-y-0.5 transition-transform duration-200',
  
  // Opacity
  fadeIn: 'hover:opacity-100 transition-opacity duration-200',
  fadeOut: 'hover:opacity-70 transition-opacity duration-200',
  
  // Brightness
  brighten: 'hover:brightness-110 transition-[filter] duration-200',
  dim: 'hover:brightness-90 transition-[filter] duration-200',
  
  // Glow
  glow: 'hover:shadow-lg hover:shadow-primary/50 transition-shadow duration-200',
  glowAi: 'hover:shadow-lg hover:shadow-[var(--ai-primary)]/50 transition-shadow duration-200',
} as const;

/* ============================================================
 * FOCUS ANIMATIONS
 * ============================================================ */

export const focus = {
  ring: 'focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200',
  scale: 'focus:scale-105 transition-transform duration-200',
  glow: 'focus:shadow-lg focus:shadow-primary/50 transition-shadow duration-200',
} as const;

/* ============================================================
 * LOADING STATES
 * ============================================================ */

export const loading = {
  spinner: animation.spin,
  pulse: animation.pulse,
  shimmer: animation.shimmer,
  progress: animation.progress,
  
  // Skeleton loading
  skeleton: 'animate-pulse bg-gradient-to-r from-muted via-muted-foreground/10 to-muted',
} as const;

/* ============================================================
 * ENTRANCE ANIMATIONS - Stagger for lists
 * ============================================================ */

export const entrance = {
  fadeIn: animation.fadeIn,
  slideUp: animation.slideInUp,
  slideDown: animation.slideInDown,
  slideLeft: animation.slideInLeft,
  slideRight: animation.slideInRight,
  scaleIn: animation.scaleIn,
  zoomIn: animation.zoomIn,
} as const;

/* ============================================================
 * EXIT ANIMATIONS
 * ============================================================ */

export const exit = {
  fadeOut: animation.fadeOut,
  scaleOut: animation.scaleOut,
  zoomOut: animation.zoomOut,
  slideUp: 'animate-[slideUp_200ms_ease-in]',
  slideDown: 'animate-[slideDown_200ms_ease-in]',
} as const;

/* ============================================================
 * MICRO-INTERACTIONS
 * ============================================================ */

export const microInteraction = {
  shake: animation.shake,
  wiggle: animation.wiggle,
  bounce: animation.bounce,
  pulse: animation.pulse,
  ping: animation.ping,
} as const;

/* ============================================================
 * PRESET COMBINATIONS
 * ============================================================ */

export const presets = {
  // Card hover
  cardHover: `${hover.liftUp} ${hover.glow}`,
  
  // Button press
  buttonPress: 'active:scale-95 transition-transform duration-100',
  
  // Loading button
  buttonLoading: `${loading.spinner} opacity-70 pointer-events-none`,
  
  // Smooth fade
  smoothFade: `${transition.opacity} ${duration.moderate} ${easing.smooth}`,
  
  // Modal entrance
  modalEntrance: `${animation.fadeIn} ${animation.scaleIn}`,
  
  // Toast notification
  toastEntrance: `${animation.slideInRight} ${duration.moderate}`,
  toastExit: `${exit.slideUp} ${duration.fast}`,
  
  // Dropdown menu
  dropdownEntrance: `${animation.slideInDown} ${duration.fast}`,
  dropdownExit: `${exit.fadeOut} ${duration.fast}`,
  
  // Skeleton pulse
  skeletonPulse: loading.skeleton,
} as const;

/* ============================================================
 * HELPER FUNCTIONS
 * ============================================================ */

/**
 * Create custom animation with duration and easing
 */
export function createAnimation(
  keyframe: keyof typeof animation,
  durationMs: number = 300,
  easingFn: keyof typeof easing = 'inOut'
): string {
  return `animate-[${keyframe}_${durationMs}ms_${easing[easingFn]}]`;
}

/**
 * Create staggered animation for list items
 */
export function staggerAnimation(index: number, baseDelay: number = 50): string {
  const delayMs = index * baseDelay;
  return `${animation.fadeIn} delay-[${delayMs}ms]`;
}

/**
 * Combine transition properties
 */
export function combineTransitions(...properties: string[]): string {
  return properties.join(' ');
}

/* ============================================================
 * TYPE DEFINITIONS
 * ============================================================ */

export type Duration = keyof typeof duration;
export type Easing = keyof typeof easing;
export type Animation = keyof typeof animation;
export type Delay = keyof typeof delay;
export type HoverEffect = keyof typeof hover;

/* ============================================================
 * DEFAULT EXPORT
 * ============================================================ */

export default {
  duration,
  easing,
  transition,
  animation,
  delay,
  hover,
  focus,
  loading,
  entrance,
  exit,
  microInteraction,
  presets,
  createAnimation,
  staggerAnimation,
  combineTransitions,
};
