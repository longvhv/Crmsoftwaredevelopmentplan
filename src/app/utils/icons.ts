/**
 * Icon System Utilities
 * Centralized icon management with lucide-react
 * 
 * @module utils/icons
 * @version 2.0
 */

import type { LucideIcon } from 'lucide-react';
import {
  // Navigation & UI
  Home, LayoutDashboard, Menu, X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  MoreVertical, MoreHorizontal, Settings, Bell, Search, Filter, SortAsc, SortDesc,
  
  // CRM - Leads & Contacts
  Users, User, UserPlus, UserCheck, UserX, UserCog, Contact, Briefcase,
  Mail, Phone, MapPin, Globe, Calendar, Clock, Tag, Star, StarOff,
  
  // CRM - Deals & Opportunities
  TrendingUp, TrendingDown, DollarSign, BarChart3, PieChart, Target, Zap,
  Award, Trophy, Medal, Flame, ThumbsUp, ThumbsDown, Heart, Flag,
  
  // CRM - Activities & Tasks
  CheckCircle2, Circle, Square, CheckSquare, XCircle, AlertCircle, Info,
  MessageSquare, MessageCircle, Send, PhoneCall, Video, FileText, Clipboard,
  
  // Actions
  Plus, Minus, Edit, Trash2, Copy, Download, Upload, Share2, Link2,
  Eye, EyeOff, Lock, Unlock, Save, RefreshCw, ArrowLeft, ArrowRight,
  
  // AI & Automation
  Sparkles, Bot, Wand2, Cpu, Zap as Lightning, Brain, Lightbulb, Layers,
  
  // Data & Files
  Database, File, Folder, FolderOpen, FileText as Document, Image, Paperclip,
  Archive, Inbox, Send as SendIcon, Import, ExternalLink,
  
  // Status & Indicators
  Check, X as XIcon, AlertTriangle, HelpCircle, Loader2, Ban, Shield,
  
  // Charts & Analytics
  BarChart, LineChart, Activity, TrendingUp as Growth, Percent,
  
  // Social & Communication
  AtSign, Hash, Smile, ThumbsUp as Like, MessageSquare as Comment,
  
  // Misc
  Sun, Moon, Monitor, Palette, Code, Terminal, Package, Boxes,
} from 'lucide-react';

/* ============================================================
 * ICON SIZE PRESETS
 * ============================================================ */

export const iconSize = {
  xs: 'w-3 h-3',           // 12px
  sm: 'w-4 h-4',           // 16px
  md: 'w-5 h-5',           // 20px (default)
  lg: 'w-6 h-6',           // 24px
  xl: 'w-8 h-8',           // 32px
  '2xl': 'w-10 h-10',      // 40px
  '3xl': 'w-12 h-12',      // 48px
} as const;

/**
 * Icon size in pixels (for direct use)
 */
export const iconSizePx = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
} as const;

/* ============================================================
 * ICON COLOR PRESETS
 * ============================================================ */

export const iconColor = {
  // Semantic
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  primary: 'text-[var(--brand-primary)]',
  secondary: 'text-[var(--brand-secondary)]',
  accent: 'text-[var(--brand-accent)]',
  
  // Status
  success: 'text-[var(--success)]',
  warning: 'text-[var(--warning)]',
  error: 'text-[var(--error)]',
  info: 'text-[var(--info)]',
  
  // AI
  ai: 'text-[var(--ai-primary)]',
  
  // Special
  inherit: 'text-inherit',
  current: 'text-current',
} as const;

/* ============================================================
 * ICON ANIMATIONS
 * ============================================================ */

export const iconAnimation = {
  spin: 'animate-spin',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
  ping: 'animate-ping',
  wiggle: 'animate-[wiggle_500ms_ease-in-out]',
  shake: 'animate-[shake_500ms_ease-in-out]',
  glow: 'animate-[glow_2s_ease-in-out_infinite]',
} as const;

/* ============================================================
 * ICON COLLECTIONS - CRM Specific
 * ============================================================ */

/**
 * Navigation Icons
 */
export const navigationIcons = {
  home: Home,
  dashboard: LayoutDashboard,
  menu: Menu,
  close: X,
  settings: Settings,
  notifications: Bell,
  search: Search,
  filter: Filter,
  sort: SortAsc,
} as const;

/**
 * Lead Management Icons
 */
export const leadIcons = {
  leads: Users,
  lead: User,
  newLead: UserPlus,
  qualified: UserCheck,
  unqualified: UserX,
  contact: Contact,
  company: Briefcase,
  star: Star,
  unstar: StarOff,
} as const;

/**
 * Deal & Opportunity Icons
 */
export const dealIcons = {
  deal: TrendingUp,
  lost: TrendingDown,
  value: DollarSign,
  pipeline: BarChart3,
  forecast: PieChart,
  target: Target,
  hot: Flame,
  won: Trophy,
  award: Medal,
} as const;

/**
 * Activity & Task Icons
 */
export const activityIcons = {
  task: CheckCircle2,
  pending: Circle,
  completed: CheckSquare,
  failed: XCircle,
  call: PhoneCall,
  meeting: Video,
  email: Mail,
  message: MessageSquare,
  note: FileText,
  reminder: Clock,
} as const;

/**
 * Contact Information Icons
 */
export const contactIcons = {
  email: Mail,
  phone: Phone,
  mobile: Phone,
  address: MapPin,
  website: Globe,
  calendar: Calendar,
  tag: Tag,
  link: Link2,
} as const;

/**
 * AI & Automation Icons
 */
export const aiIcons = {
  ai: Sparkles,
  bot: Bot,
  magic: Wand2,
  smart: Brain,
  insight: Lightbulb,
  automated: Lightning,
  prediction: Cpu,
  layers: Layers,
} as const;

/**
 * Action Icons
 */
export const actionIcons = {
  add: Plus,
  remove: Minus,
  edit: Edit,
  delete: Trash2,
  copy: Copy,
  download: Download,
  upload: Upload,
  share: Share2,
  view: Eye,
  hide: EyeOff,
  lock: Lock,
  unlock: Unlock,
  save: Save,
  refresh: RefreshCw,
  back: ArrowLeft,
  forward: ArrowRight,
  send: Send,
  link: Link2,
  external: ExternalLink,
} as const;

/**
 * Status Icons
 */
export const statusIcons = {
  success: Check,
  error: XIcon,
  warning: AlertTriangle,
  info: AlertCircle,
  help: HelpCircle,
  loading: Loader2,
  blocked: Ban,
  verified: Shield,
} as const;

/**
 * Data & File Icons
 */
export const dataIcons = {
  database: Database,
  file: File,
  folder: Folder,
  folderOpen: FolderOpen,
  document: Document,
  image: Image,
  attachment: Paperclip,
  archive: Archive,
  inbox: Inbox,
  import: Import,
} as const;

/**
 * Chart & Analytics Icons
 */
export const chartIcons = {
  bar: BarChart,
  line: LineChart,
  pie: PieChart,
  activity: Activity,
  growth: Growth,
  percent: Percent,
  trending: TrendingUp,
} as const;

/**
 * Chevron Icons (Directional)
 */
export const chevronIcons = {
  down: ChevronDown,
  up: ChevronUp,
  left: ChevronLeft,
  right: ChevronRight,
} as const;

/**
 * More Options Icons
 */
export const moreIcons = {
  vertical: MoreVertical,
  horizontal: MoreHorizontal,
} as const;

/**
 * Theme Icons
 */
export const themeIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} as const;

/* ============================================================
 * CRM STATUS ICON MAPPING
 * ============================================================ */

/**
 * Lead Status Icons
 */
export const leadStatusIcons: Record<string, LucideIcon> = {
  new: UserPlus,
  contacted: Phone,
  qualified: UserCheck,
  unqualified: UserX,
  converted: Trophy,
  lost: TrendingDown,
};

/**
 * Deal Status Icons
 */
export const dealStatusIcons: Record<string, LucideIcon> = {
  prospecting: Search,
  qualification: UserCheck,
  proposal: FileText,
  negotiation: MessageSquare,
  'closed-won': Trophy,
  'closed-lost': TrendingDown,
};

/**
 * Task Priority Icons
 */
export const priorityIcons: Record<string, LucideIcon> = {
  critical: AlertTriangle,
  high: Flame,
  medium: Flag,
  low: Circle,
};

/**
 * Activity Type Icons
 */
export const activityTypeIcons: Record<string, LucideIcon> = {
  call: PhoneCall,
  meeting: Video,
  email: Mail,
  task: CheckCircle2,
  note: FileText,
  deadline: Calendar,
};

/* ============================================================
 * ICON WRAPPER UTILITIES
 * ============================================================ */

/**
 * Get icon component class names
 */
export function getIconClass(
  size: keyof typeof iconSize = 'md',
  color: keyof typeof iconColor = 'default',
  animated?: keyof typeof iconAnimation
): string {
  const classes = [iconSize[size], iconColor[color]];
  
  if (animated) {
    classes.push(iconAnimation[animated]);
  }
  
  return classes.join(' ');
}

/**
 * Get icon by status
 */
export function getStatusIcon(
  type: 'lead' | 'deal' | 'priority' | 'activity',
  status: string
): LucideIcon | undefined {
  const iconMaps = {
    lead: leadStatusIcons,
    deal: dealStatusIcons,
    priority: priorityIcons,
    activity: activityTypeIcons,
  };
  
  return iconMaps[type]?.[status.toLowerCase()];
}

/**
 * Icon with props helper
 */
export interface IconProps {
  size?: keyof typeof iconSize;
  color?: keyof typeof iconColor;
  animated?: keyof typeof iconAnimation;
  className?: string;
}

export function createIconProps(props: IconProps = {}): {
  className: string;
  size?: number;
} {
  const { size = 'md', color = 'default', animated, className = '' } = props;
  
  return {
    className: `${getIconClass(size, color, animated)} ${className}`.trim(),
    size: iconSizePx[size],
  };
}

/* ============================================================
 * ICON BADGE UTILITIES
 * ============================================================ */

/**
 * Icon with badge (notification count)
 */
export function iconWithBadge(count?: number): {
  hasBadge: boolean;
  badgeContent: string;
} {
  return {
    hasBadge: count !== undefined && count > 0,
    badgeContent: count && count > 99 ? '99+' : String(count || ''),
  };
}

/* ============================================================
 * CONSOLIDATED ICON EXPORT
 * ============================================================ */

/**
 * All CRM icons in one object
 */
export const icons = {
  // Collections
  navigation: navigationIcons,
  lead: leadIcons,
  deal: dealIcons,
  activity: activityIcons,
  contact: contactIcons,
  ai: aiIcons,
  action: actionIcons,
  status: statusIcons,
  data: dataIcons,
  chart: chartIcons,
  chevron: chevronIcons,
  more: moreIcons,
  theme: themeIcons,
  
  // Individual common icons
  home: Home,
  dashboard: LayoutDashboard,
  users: Users,
  user: User,
  settings: Settings,
  bell: Bell,
  search: Search,
  filter: Filter,
  plus: Plus,
  edit: Edit,
  trash: Trash2,
  mail: Mail,
  phone: Phone,
  calendar: Calendar,
  check: Check,
  x: XIcon,
  loader: Loader2,
  sparkles: Sparkles,
} as const;

/* ============================================================
 * TYPE EXPORTS
 * ============================================================ */

export type IconSize = keyof typeof iconSize;
export type IconColor = keyof typeof iconColor;
export type IconAnimation = keyof typeof iconAnimation;

export type { LucideIcon };

/* ============================================================
 * DEFAULT EXPORT
 * ============================================================ */

export default {
  icons,
  iconSize,
  iconSizePx,
  iconColor,
  iconAnimation,
  getIconClass,
  getStatusIcon,
  createIconProps,
  iconWithBadge,
};
