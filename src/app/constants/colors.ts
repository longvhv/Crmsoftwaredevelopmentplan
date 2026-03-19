/* ============================================================
 * Color Constants - Design System Colors
 * Tailwind CSS color mappings and theme colors
 * ============================================================ */

/* ============================================================
 * Base Color Palette
 * ============================================================ */

export const COLORS = {
  // Status colors
  success: "#10b981", // green-500
  warning: "#f59e0b", // amber-500
  error: "#ef4444", // red-500
  info: "#3b82f6", // blue-500

  // Semantic colors
  primary: "#6366f1", // indigo-500
  secondary: "#8b5cf6", // violet-500
  accent: "#ec4899", // pink-500

  // Neutral colors
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },

  // Brand colors (customize for your brand)
  brand: {
    primary: "#6366f1", // indigo-500
    secondary: "#8b5cf6", // violet-500
    light: "#c7d2fe", // indigo-200
    dark: "#4338ca", // indigo-700
  },
} as const;

/* ============================================================
 * Status Color Mapping
 * ============================================================ */

export const STATUS_COLOR_MAP: Record<string, string> = {
  // Generic statuses
  active: "green",
  inactive: "gray",
  pending: "yellow",
  approved: "green",
  rejected: "red",
  cancelled: "gray",
  draft: "gray",
  archived: "orange",

  // Contact statuses
  churned: "red",

  // Deal stages
  qualification: "gray",
  discovery: "blue",
  proposal: "purple",
  negotiation: "orange",
  "closed-won": "green",
  "closed-lost": "red",

  // Lead statuses
  new: "purple",
  contacted: "blue",
  qualified: "cyan",
  nurturing: "orange",
  converted: "green",
  lost: "red",

  // Task statuses
  planned: "gray",
  "in-progress": "blue",
  completed: "green",

  // Quotation/Contract statuses
  sent: "blue",
  accepted: "green",
  expired: "orange",
  terminated: "red",
  renewed: "blue",

  // Ticket statuses
  open: "red",
  resolved: "green",
  closed: "gray",

  // Health scores
  healthy: "green",
  "at-risk": "orange",

  // Priority colors
  low: "gray",
  medium: "blue",
  high: "orange",
  urgent: "red",

  // Temperature/Priority
  hot: "red",
  warm: "orange",
  cold: "blue",
};

/* ============================================================
 * Tailwind CSS Class Mappings
 * ============================================================ */

/** Background color classes */
export const BG_COLORS: Record<string, string> = {
  gray: "bg-gray-100",
  red: "bg-red-100",
  orange: "bg-orange-100",
  yellow: "bg-yellow-100",
  green: "bg-green-100",
  blue: "bg-blue-100",
  indigo: "bg-indigo-100",
  purple: "bg-purple-100",
  pink: "bg-pink-100",
  cyan: "bg-cyan-100",
};

/** Text color classes */
export const TEXT_COLORS: Record<string, string> = {
  gray: "text-gray-700",
  red: "text-red-700",
  orange: "text-orange-700",
  yellow: "text-yellow-700",
  green: "text-green-700",
  blue: "text-blue-700",
  indigo: "text-indigo-700",
  purple: "text-purple-700",
  pink: "text-pink-700",
  cyan: "text-cyan-700",
};

/** Border color classes */
export const BORDER_COLORS: Record<string, string> = {
  gray: "border-gray-300",
  red: "border-red-300",
  orange: "border-orange-300",
  yellow: "border-yellow-300",
  green: "border-green-300",
  blue: "border-blue-300",
  indigo: "border-indigo-300",
  purple: "border-purple-300",
  pink: "border-pink-300",
  cyan: "border-cyan-300",
};

/** Ring color classes (focus states) */
export const RING_COLORS: Record<string, string> = {
  gray: "ring-gray-500",
  red: "ring-red-500",
  orange: "ring-orange-500",
  yellow: "ring-yellow-500",
  green: "ring-green-500",
  blue: "ring-blue-500",
  indigo: "ring-indigo-500",
  purple: "ring-purple-500",
  pink: "ring-pink-500",
  cyan: "ring-cyan-500",
};

/* ============================================================
 * Badge Variant Classes
 * ============================================================ */

export const BADGE_VARIANTS: Record<
  string,
  {
    bg: string;
    text: string;
    border: string;
  }
> = {
  gray: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-300",
  },
  red: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-300",
  },
  orange: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-300",
  },
  yellow: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-300",
  },
  green: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-300",
  },
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-300",
  },
  indigo: {
    bg: "bg-indigo-100",
    text: "text-indigo-700",
    border: "border-indigo-300",
  },
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-300",
  },
  pink: {
    bg: "bg-pink-100",
    text: "text-pink-700",
    border: "border-pink-300",
  },
  cyan: {
    bg: "bg-cyan-100",
    text: "text-cyan-700",
    border: "border-cyan-300",
  },
};

/* ============================================================
 * Button Variant Classes
 * ============================================================ */

export const BUTTON_VARIANTS: Record<
  string,
  {
    base: string;
    hover: string;
    active: string;
  }
> = {
  primary: {
    base: "bg-indigo-600 text-white",
    hover: "hover:bg-indigo-700",
    active: "active:bg-indigo-800",
  },
  secondary: {
    base: "bg-gray-200 text-gray-900",
    hover: "hover:bg-gray-300",
    active: "active:bg-gray-400",
  },
  success: {
    base: "bg-green-600 text-white",
    hover: "hover:bg-green-700",
    active: "active:bg-green-800",
  },
  danger: {
    base: "bg-red-600 text-white",
    hover: "hover:bg-red-700",
    active: "active:bg-red-800",
  },
  warning: {
    base: "bg-orange-600 text-white",
    hover: "hover:bg-orange-700",
    active: "active:bg-orange-800",
  },
  ghost: {
    base: "bg-transparent text-gray-700",
    hover: "hover:bg-gray-100",
    active: "active:bg-gray-200",
  },
};

/* ============================================================
 * Chart Colors (for data visualization)
 * ============================================================ */

export const CHART_COLORS = [
  "#6366f1", // indigo-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#f59e0b", // amber-500
  "#10b981", // green-500
  "#3b82f6", // blue-500
  "#f97316", // orange-500
  "#14b8a6", // teal-500
  "#a855f7", // purple-500
  "#06b6d4", // cyan-500
] as const;

/** Chart color palette for multi-series */
export const CHART_COLOR_PALETTE = {
  primary: CHART_COLORS,
  pastel: [
    "#c7d2fe", // indigo-200
    "#ddd6fe", // violet-200
    "#fbcfe8", // pink-200
    "#fde68a", // amber-200
    "#a7f3d0", // green-200
    "#bfdbfe", // blue-200
    "#fed7aa", // orange-200
    "#99f6e4", // teal-200
    "#e9d5ff", // purple-200
    "#a5f3fc", // cyan-200
  ],
  gradient: [
    { start: "#6366f1", end: "#4f46e5" }, // indigo
    { start: "#8b5cf6", end: "#7c3aed" }, // violet
    { start: "#ec4899", end: "#db2777" }, // pink
    { start: "#f59e0b", end: "#d97706" }, // amber
    { start: "#10b981", end: "#059669" }, // green
  ],
} as const;

/* ============================================================
 * Score Colors (for AI scores, health scores, etc.)
 * ============================================================ */

/** Get color based on score (0-100) */
export function getScoreColor(score: number): string {
  if (score >= 80) return "green";
  if (score >= 60) return "blue";
  if (score >= 40) return "yellow";
  if (score >= 20) return "orange";
  return "red";
}

/** Get gradient color for score */
export function getScoreGradient(score: number): string {
  if (score >= 80) return "from-green-500 to-green-600";
  if (score >= 60) return "from-blue-500 to-blue-600";
  if (score >= 40) return "from-yellow-500 to-yellow-600";
  if (score >= 20) return "from-orange-500 to-orange-600";
  return "from-red-500 to-red-600";
}

/* ============================================================
 * Utility Functions
 * ============================================================ */

/** Get background color class for status */
export function getBgColor(color: string): string {
  return BG_COLORS[color] || BG_COLORS.gray;
}

/** Get text color class for status */
export function getTextColor(color: string): string {
  return TEXT_COLORS[color] || TEXT_COLORS.gray;
}

/** Get border color class for status */
export function getBorderColor(color: string): string {
  return BORDER_COLORS[color] || BORDER_COLORS.gray;
}

/** Get badge variant for color */
export function getBadgeVariant(color: string): {
  bg: string;
  text: string;
  border: string;
} {
  return BADGE_VARIANTS[color] || BADGE_VARIANTS.gray;
}

/** Get color for status type */
export function getStatusColorClass(status: string): string {
  const color = STATUS_COLOR_MAP[status] || "gray";
  return color;
}

/** Get complete badge classes for status */
export function getStatusBadgeClasses(status: string): string {
  const color = STATUS_COLOR_MAP[status] || "gray";
  const variant = BADGE_VARIANTS[color];
  return `${variant.bg} ${variant.text} ${variant.border} border rounded-full px-2.5 py-0.5 text-xs font-medium`;
}

/** Generate random color from palette */
export function getRandomChartColor(index?: number): string {
  if (index !== undefined) {
    return CHART_COLORS[index % CHART_COLORS.length];
  }
  return CHART_COLORS[Math.floor(Math.random() * CHART_COLORS.length)];
}

/** Lighten color (for hover states) */
export function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

/** Darken color (for active states) */
export function darkenColor(hex: string, percent: number): string {
  return lightenColor(hex, -percent);
}

/** Convert hex to RGB */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/** Convert RGB to hex */
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/** Get contrasting text color (black or white) for background */
export function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#000000";

  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

  return luminance > 0.5 ? "#000000" : "#ffffff";
}
