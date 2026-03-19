/**
 * Sidebar — Thanh điều hướng chính (Light theme)
 * - Group headers là label tĩnh, không collapse
 * - Menu items có thể có menu con (sub-items) với chevron
 * - Search/filter real-time + persist localStorage
 * - Mobile responsive
 */
import {
  LayoutDashboard,
  Boxes,
  Bot,
  BarChart3,
  Wrench,
  Users,
  CalendarClock,
  Database,
  Shield,
  ChevronDown,
  ListChecks,
  Gauge,
  Contact2,
  Kanban,
  UsersRound,
  Menu,
  X,
  Activity,
  Settings,
  PieChart,
  MailPlus,
  Inbox,
  Calendar,
  Zap,
  Map,
  Puzzle,
  LayoutGrid,
  Package,
  BookOpen,
  FileSpreadsheet,
  ShieldCheck,
  Trophy,
  FileCheck,
  Calculator,
  MessageSquareHeart,
  LineChart,
  Swords,
  SlidersHorizontal,
  Megaphone,
  Building2,
  Ticket,
  ClipboardCheck,
  HeartPulse,
  ArrowDownToLine,
  GitBranch,
  ScrollText,
  Target,
  MapPin,
  FolderOpen,
  CreditCard,
  Handshake,
  Gamepad2,
  Mic,
  Workflow,
  Lock,
  Layers,
  BellRing,
  Code2,
  Webhook,
  Import,
  User,
  ClipboardList,
  MessageSquare,
  FormInput,
  Rss,
  LayoutTemplate,
  UserCircle,
  PhoneCall,
  DatabaseZap,
  BrainCircuit,
  Gift,
  MessageCircle,
  FlaskConical,
  CircleDot,
  BadgeDollarSign,
  CalendarRange,
  ShoppingBag,
  Warehouse,
  MessageSquarePlus,
  BrainCog,
  Banknote,
  Scale,
  FileCode2,
  CircleGauge,
  ClipboardPlus,
  ShieldAlert,
  Droplets,
  RotateCw,
  WandSparkles,
  SlidersVertical,
  Scan,
  ChartPie,
  ThumbsDown,
  Milestone,
  Award,
  Crosshair,
  ArrowDownWideNarrow,
  ShieldBan,
  BookMarked,
  MapPinned,
  PartyPopper,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  DollarSign,
  Mail,
  Headphones,
  ShieldHalf,
} from "lucide-react";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { NavLink, useLocation } from "react-router";

/* ============================================================
 * Types
 * ============================================================ */
interface NavChild {
  to: string;
  label: string;
}

interface NavItem {
  to?: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children?: NavChild[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

/* ============================================================
 * localStorage helpers
 * ============================================================ */
const STORAGE_KEY_MENUS = "ai-crm-sidebar-menus";
const STORAGE_KEY_COLLAPSED = "ai-crm-sidebar-collapsed";

function loadMenuState(): Record<string, boolean> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MENUS);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : null;
  } catch { return null; }
}

function saveMenuState(state: Record<string, boolean>) {
  try { localStorage.setItem(STORAGE_KEY_MENUS, JSON.stringify(state)); }
  catch { /* bỏ qua */ }
}

function loadCollapsed(): boolean {
  try { return localStorage.getItem(STORAGE_KEY_COLLAPSED) === "true"; }
  catch { return false; }
}

function saveCollapsed(val: boolean) {
  try { localStorage.setItem(STORAGE_KEY_COLLAPSED, String(val)); }
  catch { /* bỏ qua */ }
}

/* ============================================================
 * Normalize tiếng Việt → không dấu + lowercase (cho search)
 * ============================================================ */
function normalize(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
}

/* ============================================================
 * Navigation Data — Cấu trúc cha-con
 * ============================================================ */
const navData: NavGroup[] = [
  /* ---- TỔNG QUAN ---- */
  {
    title: "TỔNG QUAN",
    items: [
      { to: "/crm", icon: Gauge, label: "Dashboard" },
      { to: "/crm/custom-dashboard", icon: SlidersHorizontal, label: "Dashboard Tuỳ chỉnh" },
    ],
  },

  /* ---- BÁN HÀNG ---- */
  {
    title: "BÁN HÀNG",
    items: [
      {
        icon: Contact2, label: "Liên hệ & Lead",
        children: [
          { to: "/crm/contacts", label: "Liên hệ" },
          { to: "/crm/leads", label: "Lead Inbox" },
          { to: "/crm/customer-360", label: "Customer 360°" },
        ],
      },
      {
        icon: Kanban, label: "Pipeline & Deals",
        children: [
          { to: "/crm/pipeline", label: "Sales Pipeline" },
          { to: "/crm/deal-room", label: "Deal Room" },
          { to: "/crm/sales-playbook", label: "Sales Playbook" },
          { to: "/crm/account-planning", label: "Account Planning" },
        ],
      },
      {
        icon: FileSpreadsheet, label: "Báo giá & Hợp đồng",
        children: [
          { to: "/crm/quotations", label: "Báo giá" },
          { to: "/crm/cpq", label: "CPQ" },
          { to: "/crm/contracts", label: "Hợp đồng" },
          { to: "/crm/subscriptions", label: "Subscription" },
        ],
      },
      {
        icon: DollarSign, label: "Doanh thu",
        children: [
          { to: "/crm/forecast", label: "Dự báo Doanh thu" },
          { to: "/crm/commissions", label: "Hoa hồng Sales" },
          { to: "/crm/revenue-intelligence", label: "Revenue Intelligence" },
          { to: "/crm/revenue-waterfall", label: "Revenue Waterfall" },
          { to: "/crm/revenue-leakage", label: "Revenue Leakage" },
          { to: "/crm/attribution", label: "Phân bổ Doanh thu" },
          { to: "/crm/quotas", label: "Quota Management" },
          { to: "/crm/win-loss", label: "Win/Loss Analysis" },
        ],
      },
      {
        icon: Swords, label: "Đối thủ & Lãnh thổ",
        children: [
          { to: "/crm/competitors", label: "Phân tích Đối thủ" },
          { to: "/crm/territories", label: "Vùng lãnh thổ" },
        ],
      },
      {
        icon: Handshake, label: "Đối tác",
        children: [
          { to: "/crm/partners", label: "Cổng Đối tác" },
          { to: "/crm/marketplace", label: "Partner Marketplace" },
          { to: "/crm/partner-scorecard", label: "Partner Scorecard" },
        ],
      },
    ],
  },

  /* ---- MARKETING ---- */
  {
    title: "MARKETING",
    items: [
      {
        icon: Megaphone, label: "Chiến dịch",
        children: [
          { to: "/crm/marketing", label: "Chiến dịch Marketing" },
          { to: "/crm/sms-campaigns", label: "SMS Campaigns" },
          { to: "/crm/campaign-roi", label: "Campaign ROI" },
          { to: "/crm/ab-testing", label: "A/B Testing" },
        ],
      },
      {
        icon: Mail, label: "Email & Nội dung",
        children: [
          { to: "/crm/email-sequences", label: "Email Sequences" },
          { to: "/crm/email-templates", label: "Email Templates" },
          { to: "/crm/content-calendar", label: "Content Calendar" },
        ],
      },
      {
        icon: Gift, label: "Thu hút KH",
        children: [
          { to: "/crm/form-builder", label: "Form Builder" },
          { to: "/crm/landing-pages", label: "Landing Pages" },
          { to: "/crm/referral-program", label: "Referral Program" },
          { to: "/crm/event-manager", label: "Event Manager" },
        ],
      },
      { to: "/crm/social-monitor", icon: Rss, label: "Social Media Monitor" },
    ],
  },

  /* ---- KHÁCH HÀNG ---- */
  {
    title: "KHÁCH HÀNG",
    items: [
      {
        icon: Scan, label: "Hồ sơ KH",
        children: [
          { to: "/crm/journey", label: "Customer Journey" },
          { to: "/crm/customer-health", label: "Sức khỏe KH" },
          { to: "/crm/segmentation", label: "Customer Segmentation" },
        ],
      },
      {
        icon: Headphones, label: "Hỗ trợ",
        children: [
          { to: "/crm/tickets", label: "Hỗ trợ Khách hàng" },
          { to: "/crm/customer-portal", label: "Customer Portal" },
          { to: "/crm/live-chat-config", label: "Live Chat Config" },
          { to: "/crm/knowledge-base", label: "Knowledge Base" },
        ],
      },
      {
        icon: ShieldHalf, label: "Giữ chân KH",
        children: [
          { to: "/crm/onboarding", label: "Onboarding" },
          { to: "/crm/nps", label: "NPS & Phản hồi" },
          { to: "/crm/surveys", label: "Survey Builder" },
          { to: "/crm/churn-prediction", label: "Churn Prediction" },
          { to: "/crm/renewals", label: "Renewal Pipeline" },
          { to: "/crm/sla", label: "SLA Tracking" },
        ],
      },
      { to: "/crm/feedback-wall", icon: MessageSquarePlus, label: "Feedback Wall" },
    ],
  },

  /* ---- AI & TỰ ĐỘNG ---- */
  {
    title: "AI & TỰ ĐỘNG",
    items: [
      {
        icon: BrainCircuit, label: "AI Phân tích",
        children: [
          { to: "/crm/ai-insights", label: "AI Insights" },
          { to: "/crm/predictive-analytics", label: "Predictive Analytics" },
          { to: "/crm/data-enrichment", label: "Data Enrichment" },
          { to: "/crm/meetings", label: "Meeting Intelligence" },
        ],
      },
      {
        icon: BrainCog, label: "AI Huấn luyện",
        children: [
          { to: "/crm/ai-training", label: "AI Training" },
          { to: "/crm/chatbot-training", label: "AI Chatbot Training" },
          { to: "/crm/ai-copilot", label: "AI Copilot Settings" },
        ],
      },
      {
        icon: Zap, label: "Tự động hóa",
        children: [
          { to: "/crm/automations", label: "Quy trình tự động" },
          { to: "/crm/workflow-builder", label: "Workflow Builder" },
        ],
      },
    ],
  },

  /* ---- VẬN HÀNH ---- */
  {
    title: "VẬN HÀNH",
    items: [
      {
        icon: UsersRound, label: "Nhân sự & Đội ngũ",
        children: [
          { to: "/crm/team", label: "Nhân sự" },
          { to: "/crm/team-capacity", label: "Capacity Planner" },
          { to: "/crm/leaderboard", label: "Bảng xếp hạng" },
          { to: "/crm/gamification", label: "Game hoá Sales" },
        ],
      },
      {
        icon: ClipboardCheck, label: "Công việc",
        children: [
          { to: "/crm/activities", label: "Hoạt động" },
          { to: "/crm/calendar", label: "Lịch hẹn" },
          { to: "/crm/tasks", label: "Bảng Công việc" },
          { to: "/crm/approvals", label: "Phê duyệt" },
          { to: "/crm/goals", label: "Mục tiêu & OKR" },
        ],
      },
      {
        icon: Package, label: "Kho & Sản phẩm",
        children: [
          { to: "/crm/products", label: "Sản phẩm & Dịch vụ" },
          { to: "/crm/inventory", label: "Quản lý Kho" },
          { to: "/crm/vendors", label: "Nhà cung cấp" },
          { to: "/crm/multi-currency", label: "Đa Tiền tệ" },
        ],
      },
      { to: "/crm/documents", icon: FolderOpen, label: "Tài liệu & E-Sign" },
      { to: "/crm/voip-dialer", icon: PhoneCall, label: "VoIP Dialer" },
    ],
  },

  /* ---- QUẢN TRỊ ---- */
  {
    title: "QUẢN TRỊ",
    items: [
      {
        icon: Settings, label: "Cấu hình",
        children: [
          { to: "/crm/settings", label: "Cài đặt chung" },
          { to: "/crm/custom-fields", label: "Trường Tuỳ chỉnh" },
          { to: "/crm/rbac", label: "Phân quyền (RBAC)" },
          { to: "/crm/notifications", label: "Cài đặt Thông báo" },
        ],
      },
      {
        icon: Code2, label: "Nhà phát triển",
        children: [
          { to: "/crm/api-explorer", label: "API Explorer" },
          { to: "/crm/webhooks", label: "Webhook Manager" },
          { to: "/crm/dev-portal", label: "Developer Portal" },
          { to: "/crm/integrations", label: "Tích hợp" },
          { to: "/crm/dependency-graph", label: "Dependency Graph" },
        ],
      },
      {
        icon: ArrowDownToLine, label: "Dữ liệu",
        children: [
          { to: "/crm/import-wizard", label: "Import Wizard" },
          { to: "/crm/data-center", label: "Nhập / Xuất DL" },
          { to: "/crm/reports", label: "Báo cáo" },
        ],
      },
      {
        icon: ScrollText, label: "Kiểm toán",
        children: [
          { to: "/crm/audit-trail", label: "Audit Trail" },
          { to: "/crm/audit-log", label: "Nhật ký Kiểm toán" },
          { to: "/crm/compliance", label: "Compliance" },
          { to: "/crm/trust-center", label: "Trust Center" },
        ],
      },
      { to: "/crm/profile", icon: User, label: "Hồ sơ & API Keys" },
    ],
  },

  /* ---- BẢN THIẾT KẾ ---- */
  {
    title: "BẢN THIẾT KẾ",
    items: [
      {
        icon: LayoutDashboard, label: "Kiến trúc",
        children: [
          { to: "/", label: "Tổng quan kiến trúc" },
          { to: "/modules", label: "Hệ thống Module" },
          { to: "/data-architecture", label: "Kiến trúc dữ liệu" },
        ],
      },
      {
        icon: Bot, label: "AI & Nhân sự",
        children: [
          { to: "/ai-agents", label: "AI Agent & Tự động hóa" },
          { to: "/evaluation", label: "Đánh giá nhân viên" },
          { to: "/ai-tools", label: "Công cụ AI" },
          { to: "/organization", label: "Tổ chức nhân sự" },
        ],
      },
      {
        icon: CalendarClock, label: "Kế hoạch",
        children: [
          { to: "/detailed-plan", label: "Kế hoạch chi tiết" },
          { to: "/dev-plan", label: "Kế hoạch phát triển CRM" },
          { to: "/roadmap", label: "Lộ trình triển khai" },
          { to: "/security", label: "Bảo mật & Tuân thủ" },
        ],
      },
    ],
  },
];

/* ============================================================
 * Flatten all routes for search
 * ============================================================ */
interface FlatItem {
  groupTitle: string;
  parentLabel?: string;
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const flatItems: FlatItem[] = [];
for (const group of navData) {
  for (const item of group.items) {
    if (item.children) {
      for (const child of item.children) {
        flatItems.push({
          groupTitle: group.title,
          parentLabel: item.label,
          to: child.to,
          label: child.label,
          icon: item.icon,
        });
      }
    } else if (item.to) {
      flatItems.push({
        groupTitle: group.title,
        to: item.to,
        label: item.label,
        icon: item.icon,
      });
    }
  }
}

/* ============================================================
 * Component
 * ============================================================ */
export function Sidebar() {
  const location = useLocation();
  const searchRef = useRef<HTMLInputElement>(null);

  /* Collapsed (persist) */
  const [collapsed, setCollapsed] = useState(loadCollapsed);
  const handleCollapse = useCallback(() => {
    setCollapsed((prev) => { const n = !prev; saveCollapsed(n); return n; });
  }, []);

  /* Mobile */
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Search */
  const [searchQuery, setSearchQuery] = useState("");
  const isSearching = searchQuery.trim().length > 0;
  const normalizedQ = useMemo(() => normalize(searchQuery.trim()), [searchQuery]);

  /* Open menus (persist) — key = parent label */
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const saved = loadMenuState();
    if (saved) return saved;
    /* Mặc định mở menu chứa route hiện tại */
    const initial: Record<string, boolean> = {};
    for (const group of navData) {
      for (const item of group.items) {
        if (item.children?.some((c) => location.pathname === c.to)) {
          initial[item.label] = true;
        }
      }
    }
    return initial;
  });

  useEffect(() => { saveMenuState(openMenus); }, [openMenus]);

  /* Auto-mở menu chứa route active khi navigate */
  useEffect(() => {
    for (const group of navData) {
      for (const item of group.items) {
        if (item.children?.some((c) => location.pathname === c.to)) {
          setOpenMenus((prev) => prev[item.label] ? prev : { ...prev, [item.label]: true });
        }
      }
    }
  }, [location.pathname]);

  const toggleMenu = useCallback((label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  }, []);

  /* Search results */
  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    return flatItems.filter((fi) => {
      const ln = normalize(fi.label);
      const pn = normalize(fi.to);
      const parent = fi.parentLabel ? normalize(fi.parentLabel) : "";
      return ln.includes(normalizedQ) || pn.includes(normalizedQ) || parent.includes(normalizedQ);
    });
  }, [isSearching, normalizedQ]);

  /* Keyboard shortcut: Ctrl+K */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* Kiểm tra item hoặc children có active không */
  const isItemActive = useCallback((item: NavItem): boolean => {
    if (item.to) {
      if (item.to === "/" || item.to === "/crm") return location.pathname === item.to;
      return location.pathname === item.to || location.pathname.startsWith(item.to + "/");
    }
    return item.children?.some((c) => location.pathname === c.to) ?? false;
  }, [location.pathname]);

  return (
    <>
      {/* Nút mở sidebar mobile */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
        aria-label="Mở menu"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>

      {/* Overlay mobile */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/30" onClick={() => setMobileOpen(false)} />
      )}

      {/* ====== Sidebar ====== */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          ${collapsed ? "w-[60px]" : "w-[252px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          bg-white border-r border-gray-200
          min-h-screen flex flex-col
          transition-all duration-300
        `}
      >
        {/* ---- Header ---- */}
        <div className="h-[52px] flex items-center justify-between px-3 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2.5 px-1">
            <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <p className="text-sm text-gray-800">AI-CRM</p>
                <p className="text-[10px] text-gray-400">Enterprise Platform</p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-600 p-1"
            aria-label="Đóng menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ---- Search ---- */}
        {!collapsed && (
          <div className="px-3 pt-3 pb-1 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm... (Ctrl+K)"
                className="w-full pl-8 pr-8 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg
                  text-gray-700 placeholder-gray-400
                  focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-1 focus:ring-blue-100
                  transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(""); searchRef.current?.focus(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {isSearching && (
              <p className="text-[10px] text-gray-400 mt-1 px-0.5">
                {searchResults.length > 0 ? `${searchResults.length} kết quả` : "Không tìm thấy"}
              </p>
            )}
          </div>
        )}

        {/* ====== Navigation ====== */}
        <nav className="flex-1 py-1 overflow-y-auto">
          {/* --- Search Results Mode --- */}
          {isSearching ? (
            searchResults.length > 0 ? (
              <div className="px-2 pt-1">
                {searchResults.map((r) => (
                  <NavLink
                    key={r.to}
                    to={r.to}
                    end={r.to === "/" || r.to === "/crm"}
                    onClick={() => { setMobileOpen(false); setSearchQuery(""); }}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg transition-colors
                      ${isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`
                    }
                  >
                    <r.icon className="w-[16px] h-[16px] flex-shrink-0 text-gray-400" />
                    <div className="min-w-0">
                      <span className="text-[13px] truncate block">
                        {highlightMatch(r.label, searchQuery)}
                      </span>
                      <span className="text-[10px] text-gray-400 truncate block">
                        {r.groupTitle}{r.parentLabel ? ` › ${r.parentLabel}` : ""}
                      </span>
                    </div>
                  </NavLink>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Search className="w-8 h-8 mb-2 text-gray-300" />
                <p className="text-sm">Không tìm thấy</p>
                <p className="text-[11px] mt-0.5">Thử từ khóa khác</p>
              </div>
            )
          ) : (
            /* --- Normal Navigation Mode --- */
            navData.map((group) => (
              <div key={group.title} className="mb-1">
                {/* Group Title (label tĩnh, không collapse) */}
                {!collapsed && (
                  <div className="px-4 pt-4 pb-1">
                    <span className="text-[11px] tracking-widest text-gray-400 select-none">
                      {group.title}
                    </span>
                  </div>
                )}
                {collapsed && <div className="h-px bg-gray-100 my-2 mx-2" />}

                {/* Items */}
                <div className="px-2">
                  {group.items.map((item) => (
                    <MenuItem
                      key={item.label}
                      item={item}
                      collapsed={collapsed}
                      isOpen={openMenus[item.label] ?? false}
                      isActive={isItemActive(item)}
                      currentPath={location.pathname}
                      onToggle={() => toggleMenu(item.label)}
                      onNavigate={() => setMobileOpen(false)}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </nav>

        {/* ---- Thu gọn ---- */}
        <button
          type="button"
          onClick={handleCollapse}
          className="hidden lg:flex items-center justify-center gap-2 px-3 py-3
            border-t border-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
        >
          {collapsed
            ? <PanelLeftOpen className="w-4 h-4" />
            : <><PanelLeftClose className="w-4 h-4" /><span className="text-[13px]">Thu gọn</span></>
          }
        </button>
      </aside>
    </>
  );
}

/* ============================================================
 * MenuItem — Item có thể có children
 * ============================================================ */
interface MenuItemProps {
  item: NavItem;
  collapsed: boolean;
  isOpen: boolean;
  isActive: boolean;
  currentPath: string;
  onToggle: () => void;
  onNavigate: () => void;
}

function MenuItem({ item, collapsed, isOpen, isActive, currentPath, onToggle, onNavigate }: MenuItemProps) {
  const hasChildren = Boolean(item.children && item.children.length > 0);
  const Icon = item.icon;

  /* Item đơn (không có children) → NavLink */
  if (!hasChildren && item.to) {
    return (
      <NavLink
        to={item.to}
        end={item.to === "/" || item.to === "/crm"}
        onClick={onNavigate}
        className={({ isActive: active }) =>
          `flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg transition-colors
          ${active
            ? "bg-blue-50 text-blue-700 border-l-[3px] border-blue-600 pl-[7px]"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-[3px] border-transparent pl-[7px]"
          }`
        }
      >
        <Icon className="w-[18px] h-[18px] flex-shrink-0" />
        {!collapsed && <span className="text-[13px] truncate">{item.label}</span>}
      </NavLink>
    );
  }

  /* Item có children → button toggle + danh sách con */
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg transition-colors
          ${isActive
            ? "text-blue-700 bg-blue-50/50"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }
          border-l-[3px] pl-[7px]
          ${isActive ? "border-blue-400" : "border-transparent"}
        `}
      >
        <Icon className="w-[18px] h-[18px] flex-shrink-0" />
        {!collapsed && (
          <>
            <span className="text-[13px] truncate flex-1 text-left">{item.label}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? "" : "-rotate-90"}`}
            />
          </>
        )}
      </button>

      {/* Children (sub-items) */}
      {!collapsed && isOpen && item.children && (
        <div className="ml-[18px] pl-3 border-l border-gray-100 mt-0.5 mb-1">
          {item.children.map((child) => {
            const childActive = currentPath === child.to;
            return (
              <NavLink
                key={child.to}
                to={child.to}
                onClick={onNavigate}
                className={`flex items-center px-2.5 py-[6px] rounded-md text-[13px] transition-colors
                  ${childActive
                    ? "text-blue-700 bg-blue-50"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
              >
                <span className="truncate">{child.label}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * Highlight matched text trong kết quả search
 * ============================================================ */
function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const normalizedText = normalize(text);
  const normalizedQry = normalize(query.trim());
  const idx = normalizedText.indexOf(normalizedQry);
  if (idx === -1) return text;

  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + query.trim().length);
  const after = text.slice(idx + query.trim().length);

  return (
    <>
      {before}
      <span className="text-blue-700 bg-blue-100 rounded-sm px-0.5">{match}</span>
      {after}
    </>
  );
}