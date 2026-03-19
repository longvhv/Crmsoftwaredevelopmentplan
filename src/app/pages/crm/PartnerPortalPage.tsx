/**
 * Trang Partner Portal — Cổng thông tin đối tác / channel partners.
 * Partner tiers, deal registration, co-sell pipeline,
 * commission tracking, certification, AI partner scoring.
 * Phase 1: Mock data + interactive cards + detail modal.
 */
import { useState, useMemo } from "react";
import {
  Handshake,
  Search,
  X,
  Bot,
  Sparkles,
  Users,
  User,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Award,
  Star,
  Crown,
  Shield,
  Globe,
  Mail,
  Phone,
  Building2,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  FileCheck,
  BookOpen,
  Zap,
  Target,
  ExternalLink,
  BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

/* ============================================================
 * Types
 * ============================================================ */
type PartnerTier = "platinum" | "gold" | "silver" | "registered";
type PartnerType = "reseller" | "si" | "technology" | "referral";
type PartnerStatus = "active" | "probation" | "onboarding" | "inactive";

interface DealRegistration {
  dealName: string;
  client: string;
  value: number;
  status: "approved" | "pending" | "closed-won" | "expired";
  registeredDate: string;
}

interface Certification {
  name: string;
  level: "basic" | "advanced" | "expert";
  certifiedReps: number;
  expiresAt: string;
}

interface Partner {
  id: string;
  name: string;
  logo: string;
  tier: PartnerTier;
  type: PartnerType;
  status: PartnerStatus;
  country: string;
  flag: string;
  contactName: string;
  contactEmail: string;
  joinedDate: string;
  revenue: number;
  target: number;
  attainment: number;
  commission: number;
  commissionRate: number;
  activeDeals: number;
  dealsWon: number;
  pipeline: number;
  certifications: Certification[];
  dealRegistrations: DealRegistration[];
  partnerScore: number;
  trend: "up" | "down" | "stable";
  specializations: string[];
  aiInsight: string;
  scoreBreakdown: { metric: string; score: number }[];
}

/* ============================================================
 * Constants
 * ============================================================ */
const TIER_CONFIG: Record<PartnerTier, { label: string; icon: React.ReactNode; color: string; bgColor: string }> = {
  platinum: { label: "Platinum", icon: <Crown className="w-3.5 h-3.5" />, color: "#8b5cf6", bgColor: "bg-violet-50 text-violet-700 border-violet-200" },
  gold: { label: "Gold", icon: <Award className="w-3.5 h-3.5" />, color: "#f59e0b", bgColor: "bg-amber-50 text-amber-700 border-amber-200" },
  silver: { label: "Silver", icon: <Star className="w-3.5 h-3.5" />, color: "#6b7280", bgColor: "bg-gray-100 text-gray-700 border-gray-300" },
  registered: { label: "Registered", icon: <BadgeCheck className="w-3.5 h-3.5" />, color: "#3b82f6", bgColor: "bg-blue-50 text-blue-700 border-blue-200" },
};

const TYPE_CONFIG: Record<PartnerType, { label: string }> = {
  reseller: { label: "Reseller" },
  si: { label: "System Integrator" },
  technology: { label: "Technology Partner" },
  referral: { label: "Referral Partner" },
};

const STATUS_CONFIG: Record<PartnerStatus, { label: string; color: string }> = {
  active: { label: "Hoạt động", color: "text-green-600 bg-green-50" },
  probation: { label: "Thử thách", color: "text-amber-600 bg-amber-50" },
  onboarding: { label: "Đang onboard", color: "text-blue-600 bg-blue-50" },
  inactive: { label: "Tạm ngừng", color: "text-gray-500 bg-gray-100" },
};

/* ============================================================
 * Mock Data — 8 partners
 * ============================================================ */
const PARTNERS: Partner[] = [
  {
    id: "p1", name: "CloudStack Asia", logo: "☁️", tier: "platinum", type: "reseller", status: "active",
    country: "Australia", flag: "🇦🇺", contactName: "Alex Wong", contactEmail: "alex@cloudstack.asia",
    joinedDate: "2024-01-15", revenue: 385000, target: 400000, attainment: 96,
    commission: 57750, commissionRate: 15, activeDeals: 8, dealsWon: 22, pipeline: 280000,
    certifications: [
      { name: "CRM Platform", level: "expert", certifiedReps: 5, expiresAt: "2026-12-31" },
      { name: "AI Integration", level: "advanced", certifiedReps: 3, expiresAt: "2026-09-30" },
    ],
    dealRegistrations: [
      { dealName: "MiningCorp ERP Integration", client: "MiningCorp", value: 85000, status: "approved", registeredDate: "2026-02-15" },
      { dealName: "HealthFirst Cloud Migration", client: "HealthFirst", value: 62000, status: "closed-won", registeredDate: "2025-11-20" },
      { dealName: "UniSys CRM Deployment", client: "UniSys", value: 45000, status: "pending", registeredDate: "2026-03-01" },
    ],
    partnerScore: 92, trend: "up", specializations: ["Cloud", "Healthcare", "Mining"],
    aiInsight: "Top partner. 96% attainment, pipeline $280K strong. Propose Platinum Plus tier với exclusive territory rights ANZ.",
    scoreBreakdown: [
      { metric: "Revenue", score: 95 }, { metric: "Pipeline", score: 88 },
      { metric: "Certifications", score: 90 }, { metric: "CSAT", score: 92 },
      { metric: "Deal Reg", score: 85 }, { metric: "Training", score: 95 },
    ],
  },
  {
    id: "p2", name: "NeuralWave ME", logo: "🧠", tier: "gold", type: "si", status: "active",
    country: "UAE", flag: "🇦🇪", contactName: "Omar Al-Hassan", contactEmail: "omar@neuralwave.me",
    joinedDate: "2025-03-01", revenue: 145000, target: 200000, attainment: 73,
    commission: 21750, commissionRate: 15, activeDeals: 4, dealsWon: 8, pipeline: 165000,
    certifications: [
      { name: "CRM Platform", level: "advanced", certifiedReps: 3, expiresAt: "2026-12-31" },
    ],
    dealRegistrations: [
      { dealName: "PetroCorp CRM Suite", client: "PetroCorp", value: 95000, status: "approved", registeredDate: "2026-02-01" },
      { dealName: "DubaiFintech KYC Module", client: "DubaiFintech", value: 42000, status: "pending", registeredDate: "2026-02-28" },
    ],
    partnerScore: 78, trend: "up", specializations: ["Oil & Gas", "Fintech", "Arabic Localization"],
    aiInsight: "Growing fast in ME. Pipeline $165K promising. Cần thêm expert certification. Arabic localization là key differentiator.",
    scoreBreakdown: [
      { metric: "Revenue", score: 73 }, { metric: "Pipeline", score: 82 },
      { metric: "Certifications", score: 65 }, { metric: "CSAT", score: 85 },
      { metric: "Deal Reg", score: 78 }, { metric: "Training", score: 80 },
    ],
  },
  {
    id: "p3", name: "TechBridge VN", logo: "🌉", tier: "gold", type: "si", status: "active",
    country: "Việt Nam", flag: "🇻🇳", contactName: "Nguyễn Hữu Thắng", contactEmail: "thang@techbridge.vn",
    joinedDate: "2024-06-01", revenue: 210000, target: 250000, attainment: 84,
    commission: 25200, commissionRate: 12, activeDeals: 6, dealsWon: 15, pipeline: 180000,
    certifications: [
      { name: "CRM Platform", level: "expert", certifiedReps: 4, expiresAt: "2026-12-31" },
      { name: "Data Integration", level: "advanced", certifiedReps: 2, expiresAt: "2026-06-30" },
    ],
    dealRegistrations: [
      { dealName: "VietBank Core Integration", client: "VietBank", value: 78000, status: "approved", registeredDate: "2026-01-20" },
      { dealName: "SaigonRetail POS+CRM", client: "SaigonRetail", value: 35000, status: "closed-won", registeredDate: "2025-10-15" },
    ],
    partnerScore: 85, trend: "stable", specializations: ["Banking", "Retail", "Integration"],
    aiInsight: "Strong VN partner. Expert certified. Data Integration cert sắp hết hạn 30/6 — nhắc renew. Có thể nâng Platinum nếu đạt $250K.",
    scoreBreakdown: [
      { metric: "Revenue", score: 84 }, { metric: "Pipeline", score: 80 },
      { metric: "Certifications", score: 88 }, { metric: "CSAT", score: 87 },
      { metric: "Deal Reg", score: 82 }, { metric: "Training", score: 85 },
    ],
  },
  {
    id: "p4", name: "SeoDigital Korea", logo: "🇰🇷", tier: "silver", type: "referral", status: "active",
    country: "South Korea", flag: "🇰🇷", contactName: "Kim Soo-jin", contactEmail: "soojin@seodigital.kr",
    joinedDate: "2025-06-15", revenue: 65000, target: 100000, attainment: 65,
    commission: 6500, commissionRate: 10, activeDeals: 3, dealsWon: 5, pipeline: 85000,
    certifications: [
      { name: "CRM Platform", level: "basic", certifiedReps: 2, expiresAt: "2026-12-31" },
    ],
    dealRegistrations: [
      { dealName: "KoreaTech SaaS Bundle", client: "KoreaTech", value: 55000, status: "approved", registeredDate: "2026-02-10" },
    ],
    partnerScore: 68, trend: "up", specializations: ["Digital Marketing", "SaaS", "Korea"],
    aiInsight: "Referral partner đang grow. Upgrade lên SI model sẽ tăng commission 12%→15%. Cần advanced certification để handle larger deals.",
    scoreBreakdown: [
      { metric: "Revenue", score: 65 }, { metric: "Pipeline", score: 70 },
      { metric: "Certifications", score: 45 }, { metric: "CSAT", score: 80 },
      { metric: "Deal Reg", score: 72 }, { metric: "Training", score: 60 },
    ],
  },
  {
    id: "p5", name: "InnoSoft Japan", logo: "🗾", tier: "silver", type: "reseller", status: "probation",
    country: "Japan", flag: "🇯🇵", contactName: "Tanaka Hiroshi", contactEmail: "tanaka@innosoft.jp",
    joinedDate: "2025-01-01", revenue: 42000, target: 120000, attainment: 35,
    commission: 4200, commissionRate: 10, activeDeals: 2, dealsWon: 3, pipeline: 40000,
    certifications: [
      { name: "CRM Platform", level: "basic", certifiedReps: 1, expiresAt: "2026-06-30" },
    ],
    dealRegistrations: [
      { dealName: "TokyoMfg CRM Lite", client: "TokyoMfg", value: 28000, status: "expired", registeredDate: "2025-09-01" },
    ],
    partnerScore: 42, trend: "down", specializations: ["Manufacturing", "Japan"],
    aiInsight: "⚠️ Probation: 35% attainment. 1 certified rep không đủ. Deal reg expired. Cần recovery plan hoặc terminate Q2.",
    scoreBreakdown: [
      { metric: "Revenue", score: 35 }, { metric: "Pipeline", score: 40 },
      { metric: "Certifications", score: 30 }, { metric: "CSAT", score: 55 },
      { metric: "Deal Reg", score: 25 }, { metric: "Training", score: 40 },
    ],
  },
  {
    id: "p6", name: "DataFlow Singapore", logo: "🔄", tier: "gold", type: "technology", status: "active",
    country: "Singapore", flag: "🇸🇬", contactName: "Rachel Tan", contactEmail: "rachel@dataflow.sg",
    joinedDate: "2024-09-01", revenue: 180000, target: 180000, attainment: 100,
    commission: 18000, commissionRate: 10, activeDeals: 5, dealsWon: 12, pipeline: 150000,
    certifications: [
      { name: "API Integration", level: "expert", certifiedReps: 6, expiresAt: "2027-03-31" },
      { name: "Data Pipeline", level: "expert", certifiedReps: 4, expiresAt: "2026-12-31" },
    ],
    dealRegistrations: [
      { dealName: "SGFinance Data Lake", client: "SGFinance", value: 72000, status: "approved", registeredDate: "2026-02-20" },
      { dealName: "AsiaLogistics ETL", client: "AsiaLogistics", value: 48000, status: "closed-won", registeredDate: "2025-12-10" },
    ],
    partnerScore: 88, trend: "up", specializations: ["Data Integration", "ETL", "API"],
    aiInsight: "100% attainment! Technology partner mạnh nhất. Propose Platinum upgrade + co-sell data platform deals trong APAC.",
    scoreBreakdown: [
      { metric: "Revenue", score: 100 }, { metric: "Pipeline", score: 85 },
      { metric: "Certifications", score: 95 }, { metric: "CSAT", score: 90 },
      { metric: "Deal Reg", score: 80 }, { metric: "Training", score: 92 },
    ],
  },
  {
    id: "p7", name: "MekongTech", logo: "🌊", tier: "registered", type: "referral", status: "onboarding",
    country: "Việt Nam", flag: "🇻🇳", contactName: "Lê Hoàng Phúc", contactEmail: "phuc@mekongtech.vn",
    joinedDate: "2026-02-15", revenue: 0, target: 50000, attainment: 0,
    commission: 0, commissionRate: 8, activeDeals: 1, dealsWon: 0, pipeline: 35000,
    certifications: [],
    dealRegistrations: [
      { dealName: "CanTho University LMS", client: "CanTho University", value: 22000, status: "pending", registeredDate: "2026-03-01" },
    ],
    partnerScore: 25, trend: "up", specializations: ["Education", "Government", "Mekong Delta"],
    aiInsight: "New partner đang onboarding. 1 deal registered — promising start. Cần complete basic certification trước 15/4 để activate.",
    scoreBreakdown: [
      { metric: "Revenue", score: 0 }, { metric: "Pipeline", score: 35 },
      { metric: "Certifications", score: 0 }, { metric: "CSAT", score: 0 },
      { metric: "Deal Reg", score: 40 }, { metric: "Training", score: 20 },
    ],
  },
  {
    id: "p8", name: "Nordic Solutions", logo: "❄️", tier: "registered", type: "referral", status: "inactive",
    country: "Sweden", flag: "🇸🇪", contactName: "Erik Lindgren", contactEmail: "erik@nordic.se",
    joinedDate: "2025-04-01", revenue: 15000, target: 80000, attainment: 19,
    commission: 1200, commissionRate: 8, activeDeals: 0, dealsWon: 1, pipeline: 0,
    certifications: [
      { name: "CRM Platform", level: "basic", certifiedReps: 1, expiresAt: "2025-12-31" },
    ],
    dealRegistrations: [],
    partnerScore: 15, trend: "down", specializations: ["Nordic", "SaaS"],
    aiInsight: "Inactive 4 tháng, certification expired. Revenue $15K duy nhất 1 deal. Recommend: terminate hoặc last-chance reactivation call.",
    scoreBreakdown: [
      { metric: "Revenue", score: 19 }, { metric: "Pipeline", score: 0 },
      { metric: "Certifications", score: 10 }, { metric: "CSAT", score: 20 },
      { metric: "Deal Reg", score: 0 }, { metric: "Training", score: 15 },
    ],
  },
];

/* ============================================================
 * Chart Data
 * ============================================================ */
const REVENUE_BY_PARTNER = PARTNERS
  .filter((p) => p.revenue > 0)
  .map((p) => ({ name: p.name.length > 12 ? p.name.slice(0, 12) + "…" : p.name, revenue: p.revenue / 1000, target: p.target / 1000 }))
  .sort((a, b) => b.revenue - a.revenue);

const TIER_DIST = Object.entries(TIER_CONFIG).map(([key, cfg]) => ({
  name: cfg.label, value: PARTNERS.filter((p) => p.tier === key).length, color: cfg.color,
})).filter((d) => d.value > 0);

const COMMISSION_TREND = [
  { month: "T10", amount: 18 }, { month: "T11", amount: 22 },
  { month: "T12", amount: 25 }, { month: "T1", amount: 28 },
  { month: "T2", amount: 30 }, { month: "T3", amount: 22 },
];

/* ============================================================
 * Detail Modal
 * ============================================================ */
function PartnerDetailModal({ partner, onClose }: { partner: Partner; onClose: () => void }) {
  const tCfg = TIER_CONFIG[partner.tier];
  const sCfg = STATUS_CONFIG[partner.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>

        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{partner.logo}</span>
            <div>
              <h3 className="text-gray-900">{partner.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[8px] px-1.5 py-0.5 rounded border ${tCfg.bgColor} flex items-center gap-0.5`}>{tCfg.icon} {tCfg.label}</span>
                <span className={`text-[8px] px-1.5 py-0.5 rounded ${sCfg.color}`}>{sCfg.label}</span>
                <span className="text-[9px] text-gray-400">{partner.flag} {partner.country}</span>
              </div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {/* Revenue & Score */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className={`rounded-lg p-2.5 ${partner.attainment >= 80 ? "bg-green-50" : partner.attainment >= 50 ? "bg-amber-50" : "bg-red-50"}`}>
              <p className={`text-xl ${partner.attainment >= 80 ? "text-green-600" : partner.attainment >= 50 ? "text-amber-600" : "text-red-600"}`}>{partner.attainment}%</p>
              <p className="text-[8px] text-gray-400">Attainment</p>
            </div>
            <div className="bg-violet-50 rounded-lg p-2.5">
              <p className="text-lg text-violet-600">{partner.partnerScore}</p>
              <p className="text-[8px] text-gray-400">Partner Score</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2.5">
              <p className="text-lg text-gray-900">${(partner.commission / 1000).toFixed(1)}K</p>
              <p className="text-[8px] text-gray-400">Commission</p>
            </div>
          </div>

          {/* Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-2.5">
              <p className="text-[9px] text-gray-400">Liên hệ</p>
              <p className="text-xs text-gray-800">{partner.contactName}</p>
              <p className="text-[9px] text-gray-400 truncate">{partner.contactEmail}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2.5">
              <p className="text-[9px] text-gray-400">Loại · Rate</p>
              <p className="text-xs text-gray-800">{TYPE_CONFIG[partner.type].label}</p>
              <p className="text-[9px] text-gray-400">Commission {partner.commissionRate}%</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-gray-50 rounded p-1.5">
              <p className="text-xs text-gray-900">${(partner.revenue / 1000).toFixed(0)}K</p>
              <p className="text-[7px] text-gray-400">Revenue</p>
            </div>
            <div className="bg-gray-50 rounded p-1.5">
              <p className="text-xs text-gray-900">{partner.dealsWon}</p>
              <p className="text-[7px] text-gray-400">Won</p>
            </div>
            <div className="bg-gray-50 rounded p-1.5">
              <p className="text-xs text-gray-900">{partner.activeDeals}</p>
              <p className="text-[7px] text-gray-400">Active</p>
            </div>
            <div className="bg-gray-50 rounded p-1.5">
              <p className="text-xs text-gray-900">${(partner.pipeline / 1000).toFixed(0)}K</p>
              <p className="text-[7px] text-gray-400">Pipeline</p>
            </div>
          </div>

          {/* Radar */}
          <div>
            <h4 className="text-xs text-gray-500 mb-1">Partner Scorecard</h4>
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={partner.scoreBreakdown} outerRadius={60}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 8 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 7 }} />
                <Radar dataKey="score" stroke="#8b5cf6" fill="#8b5cf640" strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Certifications */}
          {partner.certifications.length > 0 && (
            <div>
              <h4 className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> Chứng chỉ ({partner.certifications.length})
              </h4>
              <div className="space-y-1.5">
                {partner.certifications.map((c) => (
                  <div key={c.name} className="bg-gray-50 rounded-lg p-2 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-800">{c.name}</p>
                      <p className="text-[8px] text-gray-400">{c.certifiedReps} reps · Hết hạn: {new Date(c.expiresAt).toLocaleDateString("vi-VN")}</p>
                    </div>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                      c.level === "expert" ? "bg-violet-50 text-violet-600" :
                      c.level === "advanced" ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"
                    }`}>{c.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deal Registrations */}
          {partner.dealRegistrations.length > 0 && (
            <div>
              <h4 className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5" /> Deal Registrations ({partner.dealRegistrations.length})
              </h4>
              <div className="space-y-1.5">
                {partner.dealRegistrations.map((dr) => (
                  <div key={dr.dealName} className="bg-gray-50 rounded-lg p-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-800">{dr.dealName}</p>
                      <span className={`text-[7px] px-1 py-0.5 rounded ${
                        dr.status === "closed-won" ? "bg-green-50 text-green-600" :
                        dr.status === "approved" ? "bg-blue-50 text-blue-600" :
                        dr.status === "pending" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                      }`}>{dr.status}</span>
                    </div>
                    <p className="text-[8px] text-gray-400">{dr.client} · ${(dr.value / 1000).toFixed(0)}K · {new Date(dr.registeredDate).toLocaleDateString("vi-VN")}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specializations */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {partner.specializations.map((s) => (
              <span key={s} className="text-[9px] px-2 py-0.5 rounded bg-gray-100 text-gray-600">{s}</span>
            ))}
          </div>

          {/* AI Insight */}
          <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-lg border border-violet-100 p-3">
            <p className="text-xs text-violet-800 flex items-start gap-1.5">
              <Bot className="w-3.5 h-3.5 text-violet-500 mt-0.5 flex-shrink-0" />
              <span>{partner.aiInsight}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end p-4 border-t border-gray-100 flex-shrink-0">
          <button type="button" onClick={onClose}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">Đóng</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function PartnerPortalPage() {
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [search, setSearch] = useState("");
  const [filterTier, setFilterTier] = useState<PartnerTier | "">("");

  const stats = useMemo(() => {
    const activePartners = PARTNERS.filter((p) => p.status === "active" || p.status === "onboarding");
    const totalRevenue = PARTNERS.reduce((s, p) => s + p.revenue, 0);
    const totalCommission = PARTNERS.reduce((s, p) => s + p.commission, 0);
    const totalPipeline = PARTNERS.reduce((s, p) => s + p.pipeline, 0);
    const avgScore = Math.round(PARTNERS.filter((p) => p.status !== "inactive").reduce((s, p) => s + p.partnerScore, 0) / PARTNERS.filter((p) => p.status !== "inactive").length);
    return { active: activePartners.length, totalRevenue, totalCommission, totalPipeline, avgScore };
  }, []);

  const filtered = useMemo(() => {
    let result = [...PARTNERS];
    if (filterTier) result = result.filter((p) => p.tier === filterTier);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.country.toLowerCase().includes(q));
    }
    return result.sort((a, b) => b.partnerScore - a.partnerScore);
  }, [filterTier, search]);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-gray-900 flex items-center gap-2">
          <Handshake className="w-6 h-6 text-violet-600" /> Cổng Đối tác
        </h1>
        <p className="text-gray-500 mt-0.5">
          Partner tiers, deal registration, co-sell pipeline, certifications, AI scoring
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <Handshake className="w-4 h-4 text-violet-500 mb-1" />
          <p className="text-lg text-gray-900">{stats.active}</p>
          <p className="text-xs text-gray-500">Đối tác hoạt động</p>
        </div>
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl border border-violet-200 p-3">
          <p className="text-lg text-violet-600">${(stats.totalRevenue / 1000000).toFixed(2)}M</p>
          <p className="text-xs text-violet-700">Tổng doanh thu</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-3">
          <p className="text-lg text-green-600">${(stats.totalCommission / 1000).toFixed(0)}K</p>
          <p className="text-xs text-green-700">Tổng commission</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-3">
          <p className="text-lg text-blue-600">${(stats.totalPipeline / 1000).toFixed(0)}K</p>
          <p className="text-xs text-blue-700">Pipeline</p>
        </div>
        <div className={`rounded-xl border p-3 col-span-2 lg:col-span-1 ${stats.avgScore >= 70 ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
          <p className="text-lg text-gray-900">{stats.avgScore}</p>
          <p className="text-xs text-gray-600">Score TB</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 lg:col-span-2">
          <h3 className="text-sm text-gray-800 mb-3">Revenue vs Target ($K)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={REVENUE_BY_PARTNER}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 8 }} angle={-15} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}K`} />
              <Tooltip formatter={(v: number) => [`$${v}K`]} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="revenue" name="Revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" name="Target" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3">Partner Tiers</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={TIER_DIST} dataKey="value" nameKey="name" cx="50%" cy="50%"
                outerRadius={70} innerRadius={28}
                label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {TIER_DIST.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            {(["", ...Object.keys(TIER_CONFIG)] as (PartnerTier | "")[]).map((t) => (
              <button key={t} type="button" onClick={() => setFilterTier(t)}
                className={`px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                  filterTier === t ? "bg-violet-600 text-white" : "text-gray-500 hover:bg-gray-100"
                }`}>
                {t === "" ? "Tất cả" : TIER_CONFIG[t].label}
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-[150px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Tìm đối tác, quốc gia..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
        </div>
      </div>

      {/* Partner Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {filtered.map((p) => {
          const tCfg = TIER_CONFIG[p.tier];
          const sCfg = STATUS_CONFIG[p.status];
          return (
            <div key={p.id}
              className={`bg-white rounded-xl border p-4 hover:shadow-md transition-shadow cursor-pointer ${
                p.status === "probation" ? "border-amber-200" : p.status === "inactive" ? "border-gray-200 opacity-70" : "border-gray-100"
              }`}
              onClick={() => setSelectedPartner(p)}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{p.logo}</span>
                  <div>
                    <h4 className="text-sm text-gray-900 line-clamp-1">{p.name}</h4>
                    <span className="text-[8px] text-gray-400">{p.flag} {p.country}</span>
                  </div>
                </div>
                {p.trend === "up" && <ArrowUpRight className="w-4 h-4 text-green-500" />}
                {p.trend === "down" && <ArrowDownRight className="w-4 h-4 text-red-500" />}
              </div>

              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className={`text-[7px] px-1.5 py-0.5 rounded border ${tCfg.bgColor} flex items-center gap-0.5`}>{tCfg.icon} {tCfg.label}</span>
                <span className={`text-[7px] px-1 py-0.5 rounded ${sCfg.color}`}>{sCfg.label}</span>
                <span className="text-[7px] text-gray-400">{TYPE_CONFIG[p.type].label}</span>
              </div>

              <div className={`text-center rounded-lg p-2 mb-2 ${
                p.partnerScore >= 80 ? "bg-green-50" : p.partnerScore >= 50 ? "bg-amber-50" : "bg-red-50"
              }`}>
                <p className={`text-xl ${
                  p.partnerScore >= 80 ? "text-green-600" : p.partnerScore >= 50 ? "text-amber-600" : "text-red-600"
                }`}>{p.partnerScore}</p>
                <p className="text-[8px] text-gray-400">Partner Score</p>
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-center text-[9px]">
                <div className="bg-gray-50 rounded p-1">
                  <p className="text-gray-900">${(p.revenue / 1000).toFixed(0)}K</p>
                  <p className="text-gray-400">Revenue</p>
                </div>
                <div className="bg-gray-50 rounded p-1">
                  <p className="text-gray-900">{p.dealsWon}</p>
                  <p className="text-gray-400">Won</p>
                </div>
                <div className="bg-gray-50 rounded p-1">
                  <p className="text-gray-900">{p.certifications.length}</p>
                  <p className="text-gray-400">Certs</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Handshake className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Không tìm thấy đối tác phù hợp</p>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI Partner Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            DataFlow SG đạt 100% attainment + score 88. Recommend upgrade Platinum — top technology partner APAC.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            InnoSoft Japan probation: 35% attainment, 1 cert only. Nếu không recover Q2, recommend terminate partnership.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            Partner pipeline $935K. CloudStack ANZ ($280K) + NeuralWave ME ($165K) chiếm 48%. Focus support 2 partner này.
          </p>
        </div>
      </div>

      {selectedPartner && <PartnerDetailModal partner={selectedPartner} onClose={() => setSelectedPartner(null)} />}
    </div>
  );
}
