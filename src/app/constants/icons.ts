/* ============================================================
 * Icon Constants - Lucide React Icon Mappings
 * Centralized icon names for consistent UI
 * ============================================================ */

/* ============================================================
 * Entity Icons
 * ============================================================ */

export const ENTITY_ICONS = {
  // CRM Core
  contact: "User",
  deal: "DollarSign",
  lead: "UserPlus",
  employee: "Users",
  activity: "Activity",
  task: "CheckSquare",

  // Products & Finance
  product: "Package",
  quotation: "FileText",
  contract: "FileCheck",
  invoice: "Receipt",
  payment: "CreditCard",

  // Support
  ticket: "AlertCircle",
  vendor: "Building2",
  partner: "Handshake",

  // Customer Success
  customerHealth: "Heart",
  nps: "ThumbsUp",
  churnRisk: "AlertTriangle",
  renewal: "RefreshCw",

  // Marketing
  campaign: "Megaphone",
  form: "FormInput",
  survey: "ClipboardList",
  landingPage: "Layout",
  email: "Mail",

  // Analytics
  dashboard: "LayoutDashboard",
  report: "BarChart3",
  metric: "TrendingUp",
  forecast: "LineChart",

  // Settings
  settings: "Settings",
  user: "User",
  role: "Shield",
  team: "Users",
  department: "Briefcase",

  // AI & Automation
  ai: "Bot",
  automation: "Zap",
  workflow: "GitBranch",
  chatbot: "MessageSquare",

  // Documents
  document: "FileText",
  folder: "Folder",
  knowledge: "BookOpen",
  dealRoom: "FolderOpen",
} as const;

/* ============================================================
 * Action Icons
 * ============================================================ */

export const ACTION_ICONS = {
  // CRUD operations
  create: "Plus",
  edit: "Edit",
  delete: "Trash2",
  save: "Save",
  cancel: "X",
  copy: "Copy",
  duplicate: "Copy",

  // Navigation
  back: "ArrowLeft",
  forward: "ArrowRight",
  up: "ArrowUp",
  down: "ArrowDown",
  home: "Home",
  menu: "Menu",
  close: "X",

  // Data operations
  search: "Search",
  filter: "Filter",
  sort: "ArrowUpDown",
  refresh: "RefreshCw",
  download: "Download",
  upload: "Upload",
  export: "Download",
  import: "Upload",

  // View controls
  view: "Eye",
  hide: "EyeOff",
  expand: "Maximize2",
  collapse: "Minimize2",
  fullscreen: "Maximize",
  exitFullscreen: "Minimize",

  // Selection
  select: "Check",
  selectAll: "CheckSquare",
  deselect: "Square",

  // Communication
  send: "Send",
  reply: "Reply",
  forward: "Forward",
  share: "Share2",

  // Status changes
  approve: "CheckCircle",
  reject: "XCircle",
  archive: "Archive",
  restore: "RotateCcw",
  lock: "Lock",
  unlock: "Unlock",

  // Other
  info: "Info",
  help: "HelpCircle",
  warning: "AlertTriangle",
  error: "AlertCircle",
  success: "CheckCircle",
  settings: "Settings",
  more: "MoreVertical",
  moreHorizontal: "MoreHorizontal",
} as const;

/* ============================================================
 * Status Icons (from statuses.ts)
 * Re-exported here for convenience
 * ============================================================ */

export const STATUS_ICONS = {
  // Task statuses
  planned: "Clock",
  inProgress: "Loader",
  completed: "CheckCircle",
  cancelled: "XCircle",

  // Approval statuses
  pending: "Clock",
  approved: "CheckCircle",
  rejected: "XCircle",

  // Ticket statuses
  open: "AlertCircle",
  resolved: "CheckCircle",
  closed: "XCircle",

  // Generic
  active: "CheckCircle",
  inactive: "Circle",
  draft: "FileText",
  archived: "Archive",
} as const;

/* ============================================================
 * Priority Icons (from priorities.ts)
 * ============================================================ */

export const PRIORITY_ICONS_MAP = {
  low: "ArrowDown",
  medium: "Minus",
  high: "ArrowUp",
  urgent: "AlertTriangle",
} as const;

/* ============================================================
 * Communication Channel Icons
 * ============================================================ */

export const CHANNEL_ICONS = {
  email: "Mail",
  phone: "Phone",
  sms: "MessageSquare",
  chat: "MessageCircle",
  meeting: "Video",
  social: "Share2",
  whatsapp: "MessageCircle",
  slack: "MessageSquare",
  teams: "Users",
} as const;

/* ============================================================
 * File Type Icons
 * ============================================================ */

export const FILE_TYPE_ICONS = {
  // Documents
  pdf: "FileText",
  doc: "FileText",
  docx: "FileText",
  txt: "FileText",

  // Spreadsheets
  xls: "Table",
  xlsx: "Table",
  csv: "Table",

  // Presentations
  ppt: "Presentation",
  pptx: "Presentation",

  // Images
  jpg: "Image",
  jpeg: "Image",
  png: "Image",
  gif: "Image",
  svg: "Image",

  // Archives
  zip: "Archive",
  rar: "Archive",
  "7z": "Archive",

  // Code
  js: "Code",
  ts: "Code",
  jsx: "Code",
  tsx: "Code",
  json: "Code",
  xml: "Code",

  // Other
  unknown: "File",
} as const;

/* ============================================================
 * Social Media Icons
 * ============================================================ */

export const SOCIAL_ICONS = {
  facebook: "Facebook",
  twitter: "Twitter",
  linkedin: "Linkedin",
  instagram: "Instagram",
  youtube: "Youtube",
  github: "Github",
  website: "Globe",
} as const;

/* ============================================================
 * Calendar & Time Icons
 * ============================================================ */

export const TIME_ICONS = {
  calendar: "Calendar",
  calendarDays: "CalendarDays",
  clock: "Clock",
  timer: "Timer",
  alarm: "AlarmClock",
  today: "CalendarCheck",
  schedule: "CalendarClock",
} as const;

/* ============================================================
 * Data Visualization Icons
 * ============================================================ */

export const CHART_ICONS = {
  line: "LineChart",
  bar: "BarChart3",
  pie: "PieChart",
  area: "AreaChart",
  scatter: "ScatterChart",
  trend: "TrendingUp",
  trendDown: "TrendingDown",
  trendFlat: "TrendingFlat",
} as const;

/* ============================================================
 * Navigation Menu Icons
 * ============================================================ */

export const MENU_ICONS = {
  // Main sections
  home: "Home",
  dashboard: "LayoutDashboard",
  crm: "Users",
  sales: "DollarSign",
  marketing: "Megaphone",
  support: "HeadphonesIcon",
  analytics: "BarChart3",
  settings: "Settings",

  // CRM subsections
  contacts: "User",
  deals: "DollarSign",
  leads: "UserPlus",
  activities: "Activity",
  tasks: "CheckSquare",

  // Sales subsections
  quotations: "FileText",
  contracts: "FileCheck",
  invoices: "Receipt",
  products: "Package",

  // Marketing subsections
  campaigns: "Megaphone",
  forms: "FormInput",
  emails: "Mail",
  landing: "Layout",

  // Support subsections
  tickets: "AlertCircle",
  knowledgeBase: "BookOpen",
  faq: "HelpCircle",
} as const;

/* ============================================================
 * Utility Functions
 * ============================================================ */

/** Get entity icon name */
export function getEntityIcon(entityType: string): string {
  return ENTITY_ICONS[entityType as keyof typeof ENTITY_ICONS] || "Circle";
}

/** Get action icon name */
export function getActionIcon(action: string): string {
  return ACTION_ICONS[action as keyof typeof ACTION_ICONS] || "Circle";
}

/** Get file type icon */
export function getFileTypeIcon(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  return FILE_TYPE_ICONS[ext as keyof typeof FILE_TYPE_ICONS] || FILE_TYPE_ICONS.unknown;
}

/** Get channel icon */
export function getChannelIcon(channel: string): string {
  return CHANNEL_ICONS[channel as keyof typeof CHANNEL_ICONS] || "MessageSquare";
}

/** Get social media icon */
export function getSocialIcon(platform: string): string {
  return SOCIAL_ICONS[platform as keyof typeof SOCIAL_ICONS] || "Globe";
}

/** Get chart icon */
export function getChartIcon(chartType: string): string {
  return CHART_ICONS[chartType as keyof typeof CHART_ICONS] || "BarChart3";
}

/** Get menu icon */
export function getMenuIcon(menuItem: string): string {
  return MENU_ICONS[menuItem as keyof typeof MENU_ICONS] || "Circle";
}

/* ============================================================
 * Icon Size Presets (Tailwind classes)
 * ============================================================ */

export const ICON_SIZES = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
  "2xl": "w-10 h-10",
  "3xl": "w-12 h-12",
} as const;

/** Get icon size class */
export function getIconSize(size: keyof typeof ICON_SIZES = "md"): string {
  return ICON_SIZES[size];
}

/* ============================================================
 * Icon Collections (for icon pickers)
 * ============================================================ */

/** All available icons grouped by category */
export const ICON_CATEGORIES = {
  entities: Object.values(ENTITY_ICONS),
  actions: Object.values(ACTION_ICONS),
  status: Object.values(STATUS_ICONS),
  channels: Object.values(CHANNEL_ICONS),
  files: Object.values(FILE_TYPE_ICONS),
  social: Object.values(SOCIAL_ICONS),
  time: Object.values(TIME_ICONS),
  charts: Object.values(CHART_ICONS),
  menu: Object.values(MENU_ICONS),
} as const;

/** Get all unique icon names */
export function getAllIconNames(): string[] {
  const allIcons = [
    ...Object.values(ENTITY_ICONS),
    ...Object.values(ACTION_ICONS),
    ...Object.values(STATUS_ICONS),
    ...Object.values(CHANNEL_ICONS),
    ...Object.values(TIME_ICONS),
    ...Object.values(CHART_ICONS),
    ...Object.values(MENU_ICONS),
  ];
  return [...new Set(allIcons)];
}
