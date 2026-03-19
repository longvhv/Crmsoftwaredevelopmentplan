/**
 * Data Enrichment — Tự động làm giàu dữ liệu
 * Enrich contacts & companies: social profiles, company info,
 * technographics, firmographics, AI scoring, bulk enrichment.
 */
import { useState, useMemo } from "react";
import {
  Database,
  Search,
  Sparkles,
  Bot,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Building2,
  Globe,
  Mail,
  Phone,
  Linkedin,
  MapPin,
  DollarSign,
  Layers,
  RefreshCw,
  Zap,
  BarChart3,
  ArrowUpRight,
  Eye,
  X,
  Play,
  Settings,
  FileDown,
  Star,
  Shield,
  Briefcase,
  Hash,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
 * Types
 * ============================================================ */
type EnrichStatus = "enriched" | "partial" | "pending" | "failed" | "stale";
type DataProvider = "clearbit" | "zoominfo" | "linkedin" | "hunter" | "ai-internal";

interface EnrichedContact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  title: string | null;
  company: string;
  linkedinUrl: string | null;
  location: string | null;
  enrichStatus: EnrichStatus;
  enrichedFields: number;
  totalFields: number;
  lastEnriched: string | null;
  provider: DataProvider;
  confidence: number; // 0-100
  // Enriched data
  companySize: string | null;
  industry: string | null;
  revenue: string | null;
  techStack: string[];
  socialProfiles: { platform: string; url: string }[];
}

interface EnrichmentJob {
  id: string;
  name: string;
  type: "contact" | "company" | "both";
  status: "running" | "completed" | "failed" | "queued";
  totalRecords: number;
  enrichedRecords: number;
  failedRecords: number;
  startedAt: string;
  completedAt: string | null;
  provider: DataProvider;
}

/* ============================================================
 * Constants
 * ============================================================ */
const STATUS_CFG: Record<EnrichStatus, { label: string; color: string; bg: string }> = {
  enriched: { label: "Đầy đủ", color: "text-green-600", bg: "bg-green-50 border-green-200" },
  partial: { label: "Một phần", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  pending: { label: "Chờ xử lý", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  failed: { label: "Thất bại", color: "text-red-600", bg: "bg-red-50 border-red-200" },
  stale: { label: "Đã cũ", color: "text-gray-500", bg: "bg-gray-50 border-gray-200" },
};

const PROVIDER_CFG: Record<DataProvider, { label: string; color: string }> = {
  clearbit: { label: "Clearbit", color: "text-blue-600" },
  zoominfo: { label: "ZoomInfo", color: "text-violet-600" },
  linkedin: { label: "LinkedIn", color: "text-blue-700" },
  hunter: { label: "Hunter.io", color: "text-orange-600" },
  "ai-internal": { label: "AI Internal", color: "text-emerald-600" },
};

/* ============================================================
 * Mock Data
 * ============================================================ */
const MOCK_CONTACTS: EnrichedContact[] = [
  {
    id: "ec_001", name: "Nguyễn Minh Tuấn", email: "tuan@dataviet.com", phone: "0967890123",
    title: "CTO", company: "DataViet Corp", linkedinUrl: "https://linkedin.com/in/tuannm",
    location: "Hồ Chí Minh", enrichStatus: "enriched", enrichedFields: 18, totalFields: 20,
    lastEnriched: "2026-03-03T06:00:00Z", provider: "clearbit", confidence: 95,
    companySize: "51-200", industry: "Phần mềm & Công nghệ", revenue: "$2M-$10M",
    techStack: ["React", "Node.js", "AWS", "PostgreSQL", "Redis"],
    socialProfiles: [{ platform: "LinkedIn", url: "#" }, { platform: "Twitter", url: "#" }, { platform: "GitHub", url: "#" }],
  },
  {
    id: "ec_002", name: "Hoàng Thị Thuỷ", email: "thuy@medtech.vn", phone: "0978901234",
    title: "VP Sales", company: "MedTech Solutions", linkedinUrl: "https://linkedin.com/in/thuyhth",
    location: "Hà Nội", enrichStatus: "enriched", enrichedFields: 16, totalFields: 20,
    lastEnriched: "2026-03-02T12:00:00Z", provider: "zoominfo", confidence: 88,
    companySize: "201-500", industry: "Y tế & Công nghệ", revenue: "$10M-$50M",
    techStack: ["Java", "Azure", "Oracle", "Kubernetes"],
    socialProfiles: [{ platform: "LinkedIn", url: "#" }],
  },
  {
    id: "ec_003", name: "Bùi Văn Đạt", email: "dat@edutech.io", phone: null,
    title: "CEO", company: "EduTech Pro", linkedinUrl: null,
    location: "Đà Nẵng", enrichStatus: "partial", enrichedFields: 8, totalFields: 20,
    lastEnriched: "2026-02-28T10:00:00Z", provider: "hunter", confidence: 62,
    companySize: "11-50", industry: "Giáo dục & Công nghệ", revenue: "<$1M",
    techStack: ["Vue.js", "Firebase"],
    socialProfiles: [],
  },
  {
    id: "ec_004", name: "Cao Thị Ngọc", email: "ngoc@fashionfw.com", phone: "0990123456",
    title: "Marketing Director", company: "Fashion Forward", linkedinUrl: null,
    location: null, enrichStatus: "partial", enrichedFields: 10, totalFields: 20,
    lastEnriched: "2026-02-25T15:00:00Z", provider: "ai-internal", confidence: 55,
    companySize: "11-50", industry: "Thời trang & Bán lẻ", revenue: "$1M-$5M",
    techStack: ["Shopify", "Google Analytics"],
    socialProfiles: [{ platform: "Instagram", url: "#" }, { platform: "Facebook", url: "#" }],
  },
  {
    id: "ec_005", name: "Đinh Quốc Bảo", email: "bao@smartmfg.vn", phone: null,
    title: null, company: "Smart Manufacturing", linkedinUrl: null,
    location: null, enrichStatus: "pending", enrichedFields: 3, totalFields: 20,
    lastEnriched: null, provider: "clearbit", confidence: 0,
    companySize: null, industry: null, revenue: null, techStack: [], socialProfiles: [],
  },
  {
    id: "ec_006", name: "Lý Thanh Tùng", email: "tung@oldfirm.com", phone: "0901111222",
    title: "Sales Manager", company: "OldFirm Ltd", linkedinUrl: "https://linkedin.com/in/tunglt",
    location: "Hồ Chí Minh", enrichStatus: "stale", enrichedFields: 14, totalFields: 20,
    lastEnriched: "2025-06-15T10:00:00Z", provider: "clearbit", confidence: 40,
    companySize: "201-500", industry: "Sản xuất", revenue: "$5M-$20M",
    techStack: ["SAP", "Oracle ERP"], socialProfiles: [{ platform: "LinkedIn", url: "#" }],
  },
];

const MOCK_JOBS: EnrichmentJob[] = [
  { id: "job_001", name: "Enrich Q1 New Leads", type: "both", status: "completed", totalRecords: 450, enrichedRecords: 412, failedRecords: 38, startedAt: "2026-03-03T06:00:00Z", completedAt: "2026-03-03T06:45:00Z", provider: "clearbit" },
  { id: "job_002", name: "Re-enrich Stale Contacts", type: "contact", status: "running", totalRecords: 200, enrichedRecords: 134, failedRecords: 8, startedAt: "2026-03-03T10:00:00Z", completedAt: null, provider: "zoominfo" },
  { id: "job_003", name: "Company Firmographics Update", type: "company", status: "queued", totalRecords: 120, enrichedRecords: 0, failedRecords: 0, startedAt: "2026-03-03T11:00:00Z", completedAt: null, provider: "clearbit" },
];

type Tab = "contacts" | "jobs" | "providers";

/* ============================================================
 * Detail Modal
 * ============================================================ */
function ContactEnrichModal({ contact, onClose }: { contact: EnrichedContact; onClose: () => void }) {
  const stCfg = STATUS_CFG[contact.enrichStatus];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] shadow-xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs text-white ${contact.confidence >= 80 ? "bg-green-500" : contact.confidence >= 50 ? "bg-amber-500" : "bg-gray-400"}`}>
              {contact.name.split(" ").pop()?.[0]}
            </div>
            <div>
              <h3 className="text-sm text-gray-900">{contact.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[8px] px-1.5 py-0.5 rounded border ${stCfg.bg} ${stCfg.color}`}>{stCfg.label}</span>
                <span className="text-[8px] text-gray-400">{contact.enrichedFields}/{contact.totalFields} fields</span>
                <span className={`text-[8px] ${PROVIDER_CFG[contact.provider].color}`}>{PROVIDER_CFG[contact.provider].label}</span>
              </div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-4 space-y-3">
          {/* Completeness bar */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-gray-400">Data Completeness</span>
              <span className="text-[10px] text-gray-600">{Math.round((contact.enrichedFields / contact.totalFields) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${contact.confidence >= 80 ? "bg-green-400" : contact.confidence >= 50 ? "bg-amber-400" : "bg-red-400"}`}
                style={{ width: `${(contact.enrichedFields / contact.totalFields) * 100}%` }} />
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-gray-50 rounded-lg">
              <p className="text-[8px] text-gray-400 mb-0.5 flex items-center gap-0.5"><Mail className="w-2.5 h-2.5" /> Email</p>
              <p className="text-xs text-gray-700">{contact.email}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">
              <p className="text-[8px] text-gray-400 mb-0.5 flex items-center gap-0.5"><Phone className="w-2.5 h-2.5" /> Phone</p>
              <p className="text-xs text-gray-700">{contact.phone || "—"}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">
              <p className="text-[8px] text-gray-400 mb-0.5 flex items-center gap-0.5"><Briefcase className="w-2.5 h-2.5" /> Chức danh</p>
              <p className="text-xs text-gray-700">{contact.title || "—"}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">
              <p className="text-[8px] text-gray-400 mb-0.5 flex items-center gap-0.5"><Building2 className="w-2.5 h-2.5" /> Công ty</p>
              <p className="text-xs text-gray-700">{contact.company}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">
              <p className="text-[8px] text-gray-400 mb-0.5 flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" /> Vị trí</p>
              <p className="text-xs text-gray-700">{contact.location || "—"}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">
              <p className="text-[8px] text-gray-400 mb-0.5 flex items-center gap-0.5"><Linkedin className="w-2.5 h-2.5" /> LinkedIn</p>
              <p className="text-xs text-blue-600 truncate">{contact.linkedinUrl ? "Có" : "—"}</p>
            </div>
          </div>

          {/* Company Info */}
          <div className="border-t border-gray-100 pt-3">
            <p className="text-[10px] text-gray-400 mb-2">Thông tin Công ty (Firmographics)</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 bg-blue-50 rounded-lg text-center">
                <p className="text-xs text-blue-700">{contact.companySize || "—"}</p>
                <p className="text-[8px] text-blue-500">Quy mô</p>
              </div>
              <div className="p-2 bg-violet-50 rounded-lg text-center">
                <p className="text-xs text-violet-700">{contact.industry || "—"}</p>
                <p className="text-[8px] text-violet-500">Ngành</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg text-center">
                <p className="text-xs text-green-700">{contact.revenue || "—"}</p>
                <p className="text-[8px] text-green-500">Doanh thu</p>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          {contact.techStack.length > 0 && (
            <div>
              <p className="text-[10px] text-gray-400 mb-1.5">Tech Stack (Technographics)</p>
              <div className="flex flex-wrap gap-1">
                {contact.techStack.map((t) => (
                  <span key={t} className="text-[9px] px-2 py-0.5 bg-cyan-50 text-cyan-700 rounded border border-cyan-200">{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Social Profiles */}
          {contact.socialProfiles.length > 0 && (
            <div>
              <p className="text-[10px] text-gray-400 mb-1.5">Social Profiles</p>
              <div className="flex flex-wrap gap-1">
                {contact.socialProfiles.map((sp) => (
                  <span key={sp.platform} className="text-[9px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-200">{sp.platform}</span>
                ))}
              </div>
            </div>
          )}

          {/* Re-enrich button */}
          <button type="button" onClick={() => toast.success("Đang enrich lại dữ liệu...")}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">
            <RefreshCw className="w-4 h-4" /> Enrich lại
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Main Page
 * ============================================================ */
export function DataEnrichmentPage() {
  const [activeTab, setActiveTab] = useState<Tab>("contacts");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EnrichStatus | "all">("all");
  const [selectedContact, setSelectedContact] = useState<EnrichedContact | null>(null);

  const filteredContacts = useMemo(() => {
    let result = MOCK_CONTACTS;
    if (statusFilter !== "all") result = result.filter((c) => c.enrichStatus === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.company.toLowerCase().includes(q));
    }
    return result;
  }, [statusFilter, search]);

  const stats = useMemo(() => {
    const total = MOCK_CONTACTS.length;
    const enriched = MOCK_CONTACTS.filter((c) => c.enrichStatus === "enriched").length;
    const partial = MOCK_CONTACTS.filter((c) => c.enrichStatus === "partial").length;
    const avgConfidence = Math.round(MOCK_CONTACTS.reduce((s, c) => s + c.confidence, 0) / total);
    const avgCompleteness = Math.round(MOCK_CONTACTS.reduce((s, c) => s + (c.enrichedFields / c.totalFields) * 100, 0) / total);
    return { total, enriched, partial, pending: total - enriched - partial, avgConfidence, avgCompleteness };
  }, []);

  const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "contacts", label: "Contacts", icon: Users },
    { key: "jobs", label: "Enrichment Jobs", icon: Zap },
    { key: "providers", label: "Providers", icon: Settings },
  ];

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-gray-900 flex items-center gap-2">
          <Database className="w-6 h-6 text-cyan-600" /> Data Enrichment
        </h1>
        <p className="text-gray-500 mt-0.5">
          Tự động làm giàu dữ liệu — firmographics, technographics, social profiles, AI scoring
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        <div className="bg-white rounded-xl border border-gray-100 p-2.5 text-center">
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-[9px] text-gray-400">Contacts</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-2.5 text-center">
          <p className="text-lg text-green-600">{stats.enriched}</p>
          <p className="text-[9px] text-green-700">Đầy đủ</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-2.5 text-center">
          <p className="text-lg text-amber-600">{stats.partial}</p>
          <p className="text-[9px] text-amber-700">Một phần</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-2.5 text-center">
          <p className="text-lg text-blue-600">{stats.pending}</p>
          <p className="text-[9px] text-blue-700">Chờ xử lý</p>
        </div>
        <div className={`rounded-xl border p-2.5 text-center ${stats.avgConfidence >= 70 ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
          <p className={`text-lg ${stats.avgConfidence >= 70 ? "text-green-600" : "text-amber-600"}`}>{stats.avgConfidence}%</p>
          <p className="text-[9px] text-gray-500">TB Confidence</p>
        </div>
        <div className="bg-cyan-50 rounded-xl border border-cyan-200 p-2.5 text-center">
          <p className="text-lg text-cyan-600">{stats.avgCompleteness}%</p>
          <p className="text-[9px] text-cyan-700">TB Hoàn thiện</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              activeTab === t.key ? "bg-cyan-600 text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
        <div className="flex-1" />
        <button type="button" onClick={() => toast.success("Bắt đầu bulk enrichment...")}
          className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700">
          <Zap className="w-4 h-4" /> Enrich hàng loạt
        </button>
      </div>

      {/* === Tab: Contacts === */}
      {activeTab === "contacts" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[150px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Tìm contact..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as EnrichStatus | "all")}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
              <option value="all">Tất cả</option>
              {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            {filteredContacts.map((contact) => {
              const stCfg = STATUS_CFG[contact.enrichStatus];
              const completeness = Math.round((contact.enrichedFields / contact.totalFields) * 100);
              return (
                <div key={contact.id} className="bg-white rounded-xl border border-gray-100 p-3 hover:border-cyan-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0 ${
                      contact.confidence >= 80 ? "bg-green-500" : contact.confidence >= 50 ? "bg-amber-500" : "bg-gray-400"
                    }`}>
                      {contact.name.split(" ").pop()?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-gray-900">{contact.name}</span>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded border ${stCfg.bg} ${stCfg.color}`}>{stCfg.label}</span>
                        <span className={`text-[8px] ${PROVIDER_CFG[contact.provider].color}`}>{PROVIDER_CFG[contact.provider].label}</span>
                      </div>
                      <p className="text-[10px] text-gray-400">{contact.title || "N/A"} • {contact.company} • {contact.email}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex-1 max-w-[150px]">
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${completeness >= 80 ? "bg-green-400" : completeness >= 50 ? "bg-amber-400" : "bg-red-400"}`}
                              style={{ width: `${completeness}%` }} />
                          </div>
                        </div>
                        <span className="text-[9px] text-gray-400">{contact.enrichedFields}/{contact.totalFields} fields ({completeness}%)</span>
                        {contact.confidence > 0 && <span className="text-[9px] text-gray-400">Confidence: {contact.confidence}%</span>}
                        {contact.techStack.length > 0 && (
                          <span className="text-[9px] text-cyan-500">{contact.techStack.length} tech detected</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button type="button" onClick={() => setSelectedContact(contact)}
                        className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => toast.success(`Đang enrich ${contact.name}...`)}
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* === Tab: Jobs === */}
      {activeTab === "jobs" && (
        <div className="space-y-3">
          {MOCK_JOBS.map((job) => {
            const progress = job.totalRecords > 0 ? Math.round((job.enrichedRecords / job.totalRecords) * 100) : 0;
            return (
              <div key={job.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    job.status === "completed" ? "bg-green-50 border border-green-200" :
                    job.status === "running" ? "bg-blue-50 border border-blue-200" :
                    job.status === "failed" ? "bg-red-50 border border-red-200" :
                    "bg-gray-50 border border-gray-200"
                  }`}>
                    {job.status === "completed" && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                    {job.status === "running" && <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />}
                    {job.status === "failed" && <XCircle className="w-4 h-4 text-red-600" />}
                    {job.status === "queued" && <Clock className="w-4 h-4 text-gray-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-900">{job.name}</span>
                      <span className={`text-[8px] ${PROVIDER_CFG[job.provider].color}`}>{PROVIDER_CFG[job.provider].label}</span>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      {job.type === "both" ? "Contacts + Companies" : job.type === "contact" ? "Contacts" : "Companies"} •
                      {job.totalRecords} records • Bắt đầu: {new Date(job.startedAt).toLocaleTimeString("vi-VN")}
                    </p>
                  </div>
                  <span className={`text-[9px] px-2 py-1 rounded ${
                    job.status === "completed" ? "bg-green-100 text-green-600" :
                    job.status === "running" ? "bg-blue-100 text-blue-600" :
                    job.status === "failed" ? "bg-red-100 text-red-600" :
                    "bg-gray-100 text-gray-500"
                  }`}>{job.status}</span>
                </div>

                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${job.status === "completed" ? "bg-green-400" : "bg-blue-400"}`}
                    style={{ width: `${progress}%` }} />
                </div>
                <div className="flex items-center justify-between mt-1 text-[9px] text-gray-400">
                  <span>{job.enrichedRecords}/{job.totalRecords} enriched</span>
                  {job.failedRecords > 0 && <span className="text-red-400">{job.failedRecords} failed</span>}
                  <span>{progress}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* === Tab: Providers === */}
      {activeTab === "providers" && (
        <div className="space-y-3">
          {[
            { provider: "clearbit" as DataProvider, desc: "Company & person enrichment. Email → full profile.", fields: "25+ fields", credits: "8,500/10,000", icon: Globe },
            { provider: "zoominfo" as DataProvider, desc: "B2B contact database. Direct dials, org charts.", fields: "30+ fields", credits: "3,200/5,000", icon: Users },
            { provider: "linkedin" as DataProvider, desc: "Professional network data. Title, skills, connections.", fields: "15+ fields", credits: "Unlimited", icon: Linkedin },
            { provider: "hunter" as DataProvider, desc: "Email finder & verification. Domain search.", fields: "8+ fields", credits: "450/1,000", icon: Mail },
            { provider: "ai-internal" as DataProvider, desc: "AI-CRM built-in enrichment. Web scraping + NLP.", fields: "20+ fields", credits: "Unlimited", icon: Bot },
          ].map((p) => {
            const cfg = PROVIDER_CFG[p.provider];
            return (
              <div key={p.provider} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0">
                  <p.icon className={`w-5 h-5 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${cfg.color}`}>{cfg.label}</span>
                    <span className="text-[8px] px-1.5 py-0.5 bg-green-100 text-green-600 rounded">Connected</span>
                  </div>
                  <p className="text-[10px] text-gray-400">{p.desc}</p>
                  <div className="flex items-center gap-3 mt-1 text-[9px] text-gray-400">
                    <span>{p.fields}</span>
                    <span>Credits: {p.credits}</span>
                  </div>
                </div>
                <button type="button" onClick={() => toast.success(`Cấu hình ${cfg.label}`)}
                  className="p-2 text-gray-400 hover:text-gray-600">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl border border-cyan-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-cyan-600" />
          <h4 className="text-sm text-cyan-900">AI Enrichment Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-cyan-800">
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Sau enrichment, <strong>lead scoring accuracy tăng +34%</strong>. Contacts có đầy đủ firmographics convert <strong>2.8x</strong> cao hơn.</span>
          </p>
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span><strong>1 contact "stale"</strong> (&gt;6 tháng không update). Dữ liệu có thể đã thay đổi. Đề xuất re-enrich ngay.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>AI phát hiện <strong>3 contacts dùng React + AWS</strong> → match ICP "Tech-forward companies". Auto-tag <strong>"High Priority"</strong> và gán cho team Enterprise.</span>
          </p>
        </div>
      </div>

      {selectedContact && <ContactEnrichModal contact={selectedContact} onClose={() => setSelectedContact(null)} />}
    </div>
  );
}