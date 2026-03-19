/**
 * Trang Subscription Management — Quản lý gói subscription/license.
 * Plan tiers, billing cycles, usage metering, renewal tracking,
 * upgrade/downgrade flow, churn prevention, AI recommendations.
 * Phase 1: Mock data + interactive cards + detail modal.
 */
import { useState, useMemo, useCallback } from "react";
import {
  CreditCard,
  Search,
  X,
  Bot,
  Sparkles,
  Users,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Crown,
  Shield,
  RefreshCw,
  DollarSign,
  CalendarCheck,
  Package,
  BarChart3,
  Minus,
  ChevronDown,
  ChevronUp,
  Star,
  Plus,
  Eye,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "../../components/crm/DataTable";
import { ViewToggle } from "../../components/crm/ViewToggle";
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";
import { useViewMode } from "../../hooks/useViewMode";
import type { ColumnDef } from "../../types/dataTable";
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
  AreaChart,
  Area,
} from "recharts";

/* ============================================================
 * Types
 * ============================================================ */
type PlanTier = "starter" | "professional" | "enterprise" | "custom";
type SubStatus = "active" | "trial" | "past-due" | "churned" | "pending-renewal";
type BillingCycle = "monthly" | "annual" | "multi-year";

interface UsageMetric {
  name: string;
  current: number;
  limit: number;
  unit: string;
}

interface Subscription {
  id: string;
  client: string;
  clientLogo: string;
  plan: PlanTier;
  status: SubStatus;
  billing: BillingCycle;
  mrr: number;
  arr: number;
  seats: number;
  seatsUsed: number;
  startDate: string;
  renewalDate: string;
  daysToRenewal: number;
  usage: UsageMetric[];
  lastPayment: string;
  paymentMethod: string;
  discount: number;
  trend: "up" | "down" | "stable";
  expansionOpportunity: number;
  churnRisk: number;
  aiRecommendation: string;
  history: { date: string; event: string }[];
}

/* ============================================================
 * Constants
 * ============================================================ */
const PLAN_CONFIG: Record<PlanTier, { label: string; icon: React.ReactNode; color: string; bgColor: string }> = {
  starter: { label: "Starter", icon: <Package className="w-3.5 h-3.5" />, color: "#6b7280", bgColor: "bg-gray-50 text-gray-700 border-gray-200" },
  professional: { label: "Professional", icon: <Star className="w-3.5 h-3.5" />, color: "#3b82f6", bgColor: "bg-blue-50 text-blue-700 border-blue-200" },
  enterprise: { label: "Enterprise", icon: <Crown className="w-3.5 h-3.5" />, color: "#8b5cf6", bgColor: "bg-violet-50 text-violet-700 border-violet-200" },
  custom: { label: "Custom", icon: <Zap className="w-3.5 h-3.5" />, color: "#f59e0b", bgColor: "bg-amber-50 text-amber-700 border-amber-200" },
};

const STATUS_CONFIG: Record<SubStatus, { label: string; color: string }> = {
  active: { label: "Đang hoạt động", color: "text-green-600 bg-green-50" },
  trial: { label: "Dùng thử", color: "text-blue-600 bg-blue-50" },
  "past-due": { label: "Quá hạn thanh toán", color: "text-red-600 bg-red-50" },
  churned: { label: "Đã huỷ", color: "text-gray-500 bg-gray-100" },
  "pending-renewal": { label: "Chờ gia hạn", color: "text-amber-600 bg-amber-50" },
};

const BILLING_LABELS: Record<BillingCycle, string> = {
  monthly: "Hàng tháng",
  annual: "Hàng năm",
  "multi-year": "Đa năm",
};

/* ============================================================
 * Mock Data — 10 subscriptions
 * ============================================================ */
const SUBSCRIPTIONS: Subscription[] = [
  {
    id: "sub1", client: "TechCorp Inc.", clientLogo: "🏢", plan: "enterprise", status: "active", billing: "annual",
    mrr: 10000, arr: 120000, seats: 50, seatsUsed: 47, startDate: "2025-04-01", renewalDate: "2026-04-01", daysToRenewal: 29,
    usage: [
      { name: "API Calls", current: 850000, limit: 1000000, unit: "calls/tháng" },
      { name: "Storage", current: 42, limit: 100, unit: "GB" },
      { name: "AI Credits", current: 7500, limit: 10000, unit: "credits" },
    ],
    lastPayment: "2026-03-01", paymentMethod: "Wire Transfer", discount: 15, trend: "up",
    expansionOpportunity: 35000, churnRisk: 5,
    aiRecommendation: "Usage 85% API — sắp cần upgrade. Đề xuất Enterprise Plus với unlimited API. Expansion $35K nếu add AI Agent module.",
    history: [
      { date: "2025-04-01", event: "Bắt đầu Enterprise Annual" },
      { date: "2025-10-15", event: "Thêm 20 seats ($4,000/tháng)" },
      { date: "2026-01-10", event: "Kích hoạt AI Credits add-on" },
    ],
  },
  {
    id: "sub2", client: "MediSys", clientLogo: "🏥", plan: "professional", status: "pending-renewal", billing: "annual",
    mrr: 4500, arr: 54000, seats: 25, seatsUsed: 22, startDate: "2025-03-15", renewalDate: "2026-03-15", daysToRenewal: 12,
    usage: [
      { name: "API Calls", current: 280000, limit: 500000, unit: "calls/tháng" },
      { name: "Storage", current: 18, limit: 50, unit: "GB" },
      { name: "AI Credits", current: 2100, limit: 5000, unit: "credits" },
    ],
    lastPayment: "2026-02-15", paymentMethod: "Thẻ tín dụng", discount: 10, trend: "up",
    expansionOpportunity: 15000, churnRisk: 15,
    aiRecommendation: "Renewal 12 ngày nữa. Usage healthy. Đề xuất upgrade Enterprise để unlock HIPAA compliance module — fit cho healthcare.",
    history: [
      { date: "2025-03-15", event: "Bắt đầu Professional Annual" },
      { date: "2025-08-20", event: "Thêm 10 seats" },
      { date: "2026-02-28", event: "Gửi renewal quote" },
    ],
  },
  {
    id: "sub3", client: "FinServe Korea", clientLogo: "🏦", plan: "enterprise", status: "active", billing: "multi-year",
    mrr: 8500, arr: 102000, seats: 40, seatsUsed: 38, startDate: "2025-01-01", renewalDate: "2027-01-01", daysToRenewal: 304,
    usage: [
      { name: "API Calls", current: 920000, limit: 1000000, unit: "calls/tháng" },
      { name: "Storage", current: 65, limit: 100, unit: "GB" },
      { name: "AI Credits", current: 9200, limit: 10000, unit: "credits" },
    ],
    lastPayment: "2026-03-01", paymentMethod: "Wire Transfer", discount: 20, trend: "stable",
    expansionOpportunity: 48000, churnRisk: 25,
    aiRecommendation: "⚠️ API usage 92%, AI credits 92% — sắp hit limit. Cần upgrade ngay. Churn risk 25% vì support tickets tăng.",
    history: [
      { date: "2025-01-01", event: "Bắt đầu Enterprise 2-Year" },
      { date: "2025-06-15", event: "Escalation: response time chậm" },
      { date: "2025-12-01", event: "Issue resolved, satisfaction survey 7/10" },
    ],
  },
  {
    id: "sub4", client: "EduTech", clientLogo: "📚", plan: "professional", status: "active", billing: "monthly",
    mrr: 2200, arr: 26400, seats: 12, seatsUsed: 10, startDate: "2025-09-01", renewalDate: "2026-04-01", daysToRenewal: 29,
    usage: [
      { name: "API Calls", current: 120000, limit: 500000, unit: "calls/tháng" },
      { name: "Storage", current: 8, limit: 50, unit: "GB" },
      { name: "AI Credits", current: 1800, limit: 5000, unit: "credits" },
    ],
    lastPayment: "2026-03-01", paymentMethod: "Thẻ tín dụng", discount: 0, trend: "up",
    expansionOpportunity: 8000, churnRisk: 8,
    aiRecommendation: "Usage thấp — offer annual billing với 15% discount sẽ tăng commitment và giảm churn risk. LTV potential: $72K.",
    history: [
      { date: "2025-09-01", event: "Bắt đầu Professional Monthly" },
      { date: "2025-11-15", event: "Thêm 4 seats" },
    ],
  },
  {
    id: "sub5", client: "RetailMax", clientLogo: "🛒", plan: "starter", status: "active", billing: "monthly",
    mrr: 990, arr: 11880, seats: 8, seatsUsed: 7, startDate: "2025-11-01", renewalDate: "2026-04-01", daysToRenewal: 29,
    usage: [
      { name: "API Calls", current: 85000, limit: 100000, unit: "calls/tháng" },
      { name: "Storage", current: 4, limit: 10, unit: "GB" },
    ],
    lastPayment: "2026-03-01", paymentMethod: "Thẻ tín dụng", discount: 0, trend: "up",
    expansionOpportunity: 12000, churnRisk: 12,
    aiRecommendation: "API usage 85% — sắp vượt limit. Upgrade Professional sẽ unlock 5x API + AI Credits. Revenue opportunity $1,200/tháng.",
    history: [
      { date: "2025-11-01", event: "Bắt đầu Starter Monthly" },
      { date: "2026-01-10", event: "API throttled — hit 100% limit" },
      { date: "2026-02-01", event: "Request upgrade quote" },
    ],
  },
  {
    id: "sub6", client: "GlobalSoft", clientLogo: "🌐", plan: "enterprise", status: "past-due", billing: "annual",
    mrr: 7200, arr: 86400, seats: 35, seatsUsed: 28, startDate: "2025-05-01", renewalDate: "2026-05-01", daysToRenewal: 59,
    usage: [
      { name: "API Calls", current: 320000, limit: 1000000, unit: "calls/tháng" },
      { name: "Storage", current: 25, limit: 100, unit: "GB" },
      { name: "AI Credits", current: 1500, limit: 10000, unit: "credits" },
    ],
    lastPayment: "2026-01-01", paymentMethod: "Wire Transfer", discount: 12, trend: "down",
    expansionOpportunity: 0, churnRisk: 65,
    aiRecommendation: "🔴 CRITICAL: 2 tháng quá hạn thanh toán. Usage giảm 40%. SSO integration chưa fix. Churn risk 65%. Escalate CSM ngay.",
    history: [
      { date: "2025-05-01", event: "Bắt đầu Enterprise Annual" },
      { date: "2025-09-01", event: "SSO integration issue reported" },
      { date: "2026-01-01", event: "Thanh toán cuối cùng" },
      { date: "2026-02-01", event: "Invoice overdue — reminder sent" },
      { date: "2026-03-01", event: "2nd reminder — no response" },
    ],
  },
  {
    id: "sub7", client: "NeuralWave AI", clientLogo: "🧠", plan: "custom", status: "active", billing: "multi-year",
    mrr: 15000, arr: 180000, seats: 60, seatsUsed: 55, startDate: "2025-06-01", renewalDate: "2027-06-01", daysToRenewal: 455,
    usage: [
      { name: "API Calls", current: 2500000, limit: 5000000, unit: "calls/tháng" },
      { name: "Storage", current: 180, limit: 500, unit: "GB" },
      { name: "AI Credits", current: 45000, limit: 50000, unit: "credits" },
      { name: "Custom Models", current: 3, limit: 5, unit: "models" },
    ],
    lastPayment: "2026-03-01", paymentMethod: "Wire Transfer", discount: 25, trend: "up",
    expansionOpportunity: 60000, churnRisk: 3,
    aiRecommendation: "Top account. AI Credits 90% — cần add-on gói $5K/tháng. Custom Models 3/5 — next model dự kiến Q2. Expansion $60K.",
    history: [
      { date: "2025-06-01", event: "Bắt đầu Custom 2-Year" },
      { date: "2025-09-15", event: "Deploy Custom Model #2" },
      { date: "2026-01-20", event: "Upgrade storage 200→500 GB" },
      { date: "2026-02-10", event: "Deploy Custom Model #3" },
    ],
  },
  {
    id: "sub8", client: "CloudStack Asia", clientLogo: "☁️", plan: "professional", status: "active", billing: "annual",
    mrr: 3800, arr: 45600, seats: 20, seatsUsed: 18, startDate: "2025-07-01", renewalDate: "2026-07-01", daysToRenewal: 120,
    usage: [
      { name: "API Calls", current: 310000, limit: 500000, unit: "calls/tháng" },
      { name: "Storage", current: 22, limit: 50, unit: "GB" },
      { name: "AI Credits", current: 3200, limit: 5000, unit: "credits" },
    ],
    lastPayment: "2026-03-01", paymentMethod: "Thẻ tín dụng", discount: 10, trend: "stable",
    expansionOpportunity: 18000, churnRisk: 10,
    aiRecommendation: "Stable account, renewal Q3. Usage 62% API — room to grow. Propose Enterprise upgrade kèm 3-year renewal deal $135K.",
    history: [
      { date: "2025-07-01", event: "Bắt đầu Professional Annual" },
      { date: "2025-12-01", event: "Channel partner agreement signed" },
    ],
  },
  {
    id: "sub9", client: "SeoulTech", clientLogo: "🇰🇷", plan: "professional", status: "pending-renewal", billing: "annual",
    mrr: 3200, arr: 38400, seats: 18, seatsUsed: 12, startDate: "2025-03-20", renewalDate: "2026-03-20", daysToRenewal: 17,
    usage: [
      { name: "API Calls", current: 150000, limit: 500000, unit: "calls/tháng" },
      { name: "Storage", current: 10, limit: 50, unit: "GB" },
      { name: "AI Credits", current: 800, limit: 5000, unit: "credits" },
    ],
    lastPayment: "2026-02-20", paymentMethod: "Wire Transfer", discount: 5, trend: "down",
    expansionOpportunity: 0, churnRisk: 55,
    aiRecommendation: "⚠️ Renewal 17 ngày. Usage giảm 35%. 6 seats unused. Churn risk 55%. Gọi điện CTO ngay — offer downgrade thay vì mất hẳn.",
    history: [
      { date: "2025-03-20", event: "Bắt đầu Professional Annual" },
      { date: "2025-08-01", event: "Giảm sử dụng bắt đầu" },
      { date: "2026-02-15", event: "Renewal quote gửi — chưa phản hồi" },
    ],
  },
  {
    id: "sub10", client: "BankPro", clientLogo: "🏧", plan: "starter", status: "trial", billing: "monthly",
    mrr: 0, arr: 0, seats: 5, seatsUsed: 4, startDate: "2026-02-20", renewalDate: "2026-03-20", daysToRenewal: 17,
    usage: [
      { name: "API Calls", current: 45000, limit: 50000, unit: "calls/tháng" },
      { name: "Storage", current: 2, limit: 5, unit: "GB" },
    ],
    lastPayment: "—", paymentMethod: "Chưa có", discount: 0, trend: "up",
    expansionOpportunity: 25000, churnRisk: 30,
    aiRecommendation: "Trial kết thúc 17 ngày. Usage 90% API — tín hiệu tốt. Offer Professional với compliance module — fit banking. Target $2.5K/tháng.",
    history: [
      { date: "2026-02-20", event: "Bắt đầu Trial 30 ngày" },
      { date: "2026-02-25", event: "Onboarding call completed" },
      { date: "2026-03-01", event: "Added 3 team members" },
    ],
  },
];

/* ============================================================
 * Chart Data
 * ============================================================ */
const MRR_TREND = [
  { month: "T10", mrr: 42 }, { month: "T11", mrr: 45 },
  { month: "T12", mrr: 48 }, { month: "T1", mrr: 52 },
  { month: "T2", mrr: 55 }, { month: "T3", mrr: 55.4 },
];

const PLAN_DIST = Object.entries(PLAN_CONFIG).map(([key, cfg]) => ({
  name: cfg.label, value: SUBSCRIPTIONS.filter((s) => s.plan === key && s.status !== "churned").length, color: cfg.color,
})).filter((d) => d.value > 0);

const STATUS_DIST = Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
  name: cfg.label, value: SUBSCRIPTIONS.filter((s) => s.status === key).length,
})).filter((d) => d.value > 0);
const STATUS_COLORS = ["#22c55e", "#3b82f6", "#ef4444", "#9ca3af", "#f59e0b"];

/* ============================================================
 * Detail Modal
 * ============================================================ */
function SubDetailModal({ sub, onClose }: { sub: Subscription; onClose: () => void }) {
  const pCfg = PLAN_CONFIG[sub.plan];
  const sCfg = STATUS_CONFIG[sub.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>

        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{sub.clientLogo}</span>
            <div>
              <h3 className="text-gray-900">{sub.client}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[8px] px-1.5 py-0.5 rounded border ${pCfg.bgColor} flex items-center gap-0.5`}>{pCfg.icon} {pCfg.label}</span>
                <span className={`text-[8px] px-1.5 py-0.5 rounded ${sCfg.color}`}>{sCfg.label}</span>
              </div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {/* Revenue */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-lg p-2.5">
              <p className="text-lg text-violet-600">${(sub.mrr / 1000).toFixed(1)}K</p>
              <p className="text-[8px] text-gray-400">MRR</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2.5">
              <p className="text-lg text-gray-900">${(sub.arr / 1000).toFixed(0)}K</p>
              <p className="text-[8px] text-gray-400">ARR</p>
            </div>
            <div className={`rounded-lg p-2.5 ${sub.churnRisk >= 40 ? "bg-red-50" : sub.churnRisk >= 20 ? "bg-amber-50" : "bg-green-50"}`}>
              <p className={`text-lg ${sub.churnRisk >= 40 ? "text-red-600" : sub.churnRisk >= 20 ? "text-amber-600" : "text-green-600"}`}>{sub.churnRisk}%</p>
              <p className="text-[8px] text-gray-400">Churn Risk</p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-2.5">
              <p className="text-[9px] text-gray-400">Billing</p>
              <p className="text-xs text-gray-800">{BILLING_LABELS[sub.billing]}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2.5">
              <p className="text-[9px] text-gray-400">Giảm giá</p>
              <p className="text-xs text-gray-800">{sub.discount > 0 ? `${sub.discount}%` : "Không"}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2.5">
              <p className="text-[9px] text-gray-400">Seats</p>
              <p className="text-xs text-gray-800">{sub.seatsUsed}/{sub.seats} đang dùng</p>
            </div>
            <div className={`rounded-lg p-2.5 ${sub.daysToRenewal <= 30 ? "bg-amber-50" : "bg-gray-50"}`}>
              <p className="text-[9px] text-gray-400">Gia hạn sau</p>
              <p className={`text-xs ${sub.daysToRenewal <= 30 ? "text-amber-700" : "text-gray-800"}`}>{sub.daysToRenewal} ngày</p>
            </div>
          </div>

          {/* Usage */}
          <div>
            <h4 className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5" /> Mức sử dụng
            </h4>
            <div className="space-y-2">
              {sub.usage.map((u) => {
                const pct = Math.round((u.current / u.limit) * 100);
                return (
                  <div key={u.name}>
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-0.5">
                      <span>{u.name}</span>
                      <span className={pct >= 90 ? "text-red-600" : pct >= 70 ? "text-amber-600" : "text-green-600"}>{pct}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full transition-all" style={{
                        width: `${Math.min(pct, 100)}%`,
                        backgroundColor: pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "#22c55e"
                      }} />
                    </div>
                    <p className="text-[8px] text-gray-400 mt-0.5">{u.current.toLocaleString()} / {u.limit.toLocaleString()} {u.unit}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* History */}
          <div>
            <h4 className="text-xs text-gray-500 mb-2">Lịch sử</h4>
            <div className="space-y-1.5">
              {sub.history.map((h, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-800">{h.event}</p>
                    <p className="text-[9px] text-gray-400">{new Date(h.date).toLocaleDateString("vi-VN")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-lg border border-violet-100 p-3">
            <p className="text-xs text-violet-800 flex items-start gap-1.5">
              <Bot className="w-3.5 h-3.5 text-violet-500 mt-0.5 flex-shrink-0" />
              <span>{sub.aiRecommendation}</span>
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
 * Create Subscription Modal
 * ============================================================ */
function CreateSubscriptionModal({ onClose, onCreated }: { onClose: () => void; onCreated: (sub: Subscription) => void }) {
  const [client, setClient] = useState("");
  const [plan, setPlan] = useState<PlanTier>("professional");
  const [billing, setBilling] = useState<BillingCycle>("annual");
  const [seats, setSeats] = useState(10);
  const [mrr, setMrr] = useState(2000);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!client.trim()) { toast.error("Vui lòng nhập tên khách hàng"); return; }
    setSaving(true);
    const newSub: Subscription = {
      id: `sub_${Date.now()}`, client, clientLogo: "🏢",
      plan, status: "trial", billing, mrr, arr: mrr * 12,
      seats, seatsUsed: 0,
      startDate: new Date().toISOString().slice(0, 10),
      renewalDate: new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10),
      daysToRenewal: 365,
      usage: [
        { name: "API Calls", current: 0, limit: 100000, unit: "calls/tháng" },
        { name: "Storage", current: 0, limit: 50, unit: "GB" },
        { name: "AI Credits", current: 0, limit: 5000, unit: "credits/tháng" },
      ],
      lastPayment: "—", paymentMethod: "Credit Card",
      discount: 0, trend: "stable", expansionOpportunity: 0,
      churnRisk: 0, aiRecommendation: "Khách hàng mới — theo dõi onboarding và usage trong 30 ngày đầu.",
      history: [{ date: new Date().toISOString().slice(0, 10), event: `Tạo subscription ${PLAN_CONFIG[plan].label}` }],
    };
    onCreated(newSub);
    toast.success(`Đã tạo subscription cho "${client}" — ${PLAN_CONFIG[plan].label}`);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Tạo Subscription mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Khách hàng *</label>
            <input type="text" value={client} onChange={(e) => setClient(e.target.value)} placeholder="VD: Công ty ABC"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Gói dịch vụ</label>
              <select value={plan} onChange={(e) => setPlan(e.target.value as PlanTier)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                {Object.entries(PLAN_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Chu kỳ thanh toán</label>
              <select value={billing} onChange={(e) => setBilling(e.target.value as BillingCycle)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                {Object.entries(BILLING_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Số seats</label>
              <input type="number" value={seats} onChange={(e) => setSeats(Number(e.target.value))} min={1}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">MRR ($)</label>
              <input type="number" value={mrr} onChange={(e) => setMrr(Number(e.target.value))} min={0}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>
          <div className="bg-violet-50 rounded-lg p-3 border border-violet-100">
            <p className="text-[10px] text-violet-700 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Subscription mới sẽ bắt đầu ở trạng thái Trial. AI sẽ tự động theo dõi usage và gợi ý upgrade khi phù hợp.</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Tạo Subscription"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function SubscriptionManagementPage() {
  const [subscriptions, setSubscriptions] = useState(SUBSCRIPTIONS);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState<PlanTier | "">("");
  const [filterStatus, setFilterStatus] = useState<SubStatus | "">("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ ids: string[]; label: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { mode, setMode } = useViewMode("subscription-mgmt", "list");

  const stats = useMemo(() => {
    const activeSubs = subscriptions.filter((s) => s.status !== "churned");
    const totalMRR = activeSubs.reduce((s, sub) => s + sub.mrr, 0);
    const totalARR = activeSubs.reduce((s, sub) => s + sub.arr, 0);
    const renewingSoon = subscriptions.filter((s) => s.daysToRenewal <= 30 && s.status !== "churned").length;
    const highChurn = subscriptions.filter((s) => s.churnRisk >= 40).length;
    const totalExpansion = subscriptions.reduce((s, sub) => s + sub.expansionOpportunity, 0);
    return { totalMRR, totalARR, renewingSoon, highChurn, totalExpansion };
  }, [subscriptions]);

  const filtered = useMemo(() => {
    let result = [...subscriptions];
    if (filterPlan) result = result.filter((s) => s.plan === filterPlan);
    if (filterStatus) result = result.filter((s) => s.status === filterStatus);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((s) => s.client.toLowerCase().includes(q));
    }
    return result.sort((a, b) => b.mrr - a.mrr);
  }, [subscriptions, filterPlan, filterStatus, search]);

  const columns: ColumnDef<Subscription>[] = [
    {
      key: "client", header: "Khách hàng", sortable: true, minWidth: 180,
      render: (s) => (
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg flex-shrink-0">{s.clientLogo}</span>
          <div className="min-w-0">
            <p className="text-gray-900 truncate">{s.client}</p>
            <p className="text-[10px] text-gray-400">{BILLING_LABELS[s.billing]} · {s.seatsUsed}/{s.seats} seats</p>
          </div>
        </div>
      ),
    },
    {
      key: "plan", header: "Gói", sortable: true, minWidth: 110, editable: true,
      render: (s) => {
        const pCfg = PLAN_CONFIG[s.plan];
        return <span className={`text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-0.5 ${pCfg.bgColor}`}>{pCfg.icon} {pCfg.label}</span>;
      },
      renderEdit: (_item, _v, onChange, onSave) => (
        <select defaultValue={_item.plan} onChange={(e) => { onChange(e.target.value); onSave(); }}
          onBlur={onSave} autoFocus
          className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
          {Object.entries(PLAN_CONFIG).map(([k, cfg]) => <option key={k} value={k}>{cfg.label}</option>)}
        </select>
      ),
    },
    {
      key: "status", header: "Trạng thái", sortable: true, minWidth: 130, editable: true,
      render: (s) => {
        const sCfg = STATUS_CONFIG[s.status];
        return <span className={`text-[9px] px-1.5 py-0.5 rounded ${sCfg.color}`}>{sCfg.label}</span>;
      },
      renderEdit: (_item, _v, onChange, onSave) => (
        <select defaultValue={_item.status} onChange={(e) => { onChange(e.target.value); onSave(); }}
          onBlur={onSave} autoFocus
          className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
          {Object.entries(STATUS_CONFIG).map(([k, cfg]) => <option key={k} value={k}>{cfg.label}</option>)}
        </select>
      ),
    },
    {
      key: "mrr", header: "MRR", sortable: true, minWidth: 80,
      render: (s) => <span className="text-gray-900">${(s.mrr / 1000).toFixed(1)}K</span>,
      sortValue: (s) => s.mrr,
    },
    {
      key: "churnRisk", header: "Churn Risk", sortable: true, minWidth: 90,
      render: (s) => (
        <span className={`text-xs ${s.churnRisk >= 40 ? "text-red-600" : s.churnRisk >= 20 ? "text-amber-600" : "text-green-600"}`}>
          {s.churnRisk}%
        </span>
      ),
      sortValue: (s) => s.churnRisk,
    },
    {
      key: "daysToRenewal", header: "Gia hạn", sortable: true, minWidth: 80,
      render: (s) => (
        <span className={`text-xs ${s.daysToRenewal <= 30 ? "text-amber-600" : "text-gray-500"}`}>
          {s.daysToRenewal}d
        </span>
      ),
      sortValue: (s) => s.daysToRenewal,
    },
  ];

  const handleInlineEdit = useCallback((rowId: string, field: string, value: unknown) => {
    setSubscriptions((prev) => prev.map((s) => s.id === rowId ? { ...s, [field]: value } : s));
    toast.success("Đã cập nhật subscription");
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 400));
    setSubscriptions((prev) => prev.filter((s) => !deleteTarget.ids.includes(s.id)));
    toast.success(`Đã xóa ${deleteTarget.ids.length > 1 ? deleteTarget.ids.length + " subscriptions" : "\"" + deleteTarget.label + "\""}`);
    setDeleteTarget(null);
    setDeleting(false);
  }, [deleteTarget]);

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-violet-600" /> Quản lý Subscription
          </h1>
          <p className="text-gray-500 mt-0.5">
            Plan tiers, billing, usage metering, renewal tracking, AI churn prevention
          </p>
        </div>
        <button type="button" onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1 px-3 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 self-start">
          <Plus className="w-4 h-4" /> Tạo Subscription
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl border border-violet-200 p-3">
          <DollarSign className="w-4 h-4 text-violet-500 mb-1" />
          <p className="text-lg text-violet-600">${(stats.totalMRR / 1000).toFixed(1)}K</p>
          <p className="text-xs text-violet-700">MRR</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <p className="text-lg text-gray-900">${(stats.totalARR / 1000).toFixed(0)}K</p>
          <p className="text-xs text-gray-500">ARR</p>
        </div>
        <div className={`rounded-xl border p-3 ${stats.renewingSoon > 0 ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"}`}>
          <CalendarCheck className="w-4 h-4 text-amber-500 mb-1" />
          <p className="text-lg text-gray-900">{stats.renewingSoon}</p>
          <p className="text-xs text-gray-600">Gia hạn ≤ 30 ngày</p>
        </div>
        <div className={`rounded-xl border p-3 ${stats.highChurn > 0 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
          <AlertTriangle className="w-4 h-4 text-red-500 mb-1" />
          <p className="text-lg text-red-600">{stats.highChurn}</p>
          <p className="text-xs text-gray-600">Churn risk cao</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-3 col-span-2 lg:col-span-1">
          <TrendingUp className="w-4 h-4 text-green-500 mb-1" />
          <p className="text-lg text-green-600">${(stats.totalExpansion / 1000).toFixed(0)}K</p>
          <p className="text-xs text-green-700">Expansion opportunity</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3">MRR Trend ($K)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={MRR_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}K`} />
              <Tooltip formatter={(v: number) => [`$${v}K`, "MRR"]} />
              <Area type="monotone" dataKey="mrr" stroke="#8b5cf6" fill="#8b5cf640" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3">Phân bổ Plan</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={PLAN_DIST} dataKey="value" nameKey="name" cx="50%" cy="50%"
                outerRadius={65} innerRadius={25}
                label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {PLAN_DIST.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3">Trạng thái</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={STATUS_DIST} dataKey="value" nameKey="name" cx="50%" cy="50%"
                outerRadius={65} innerRadius={25}
                label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {STATUS_DIST.map((_, i) => <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />)}
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
            {(["", ...Object.keys(PLAN_CONFIG)] as (PlanTier | "")[]).map((p) => (
              <button key={p} type="button" onClick={() => setFilterPlan(p)}
                className={`px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                  filterPlan === p ? "bg-violet-600 text-white" : "text-gray-500 hover:bg-gray-100"
                }`}>
                {p === "" ? "Tất cả" : PLAN_CONFIG[p].label}
              </button>
            ))}
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as SubStatus | "")}
            className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm">
            <option value="">Tất cả trạng thái</option>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>
          <div className="relative flex-1 min-w-[150px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Tìm khách hàng..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <ViewToggle mode={mode} onSetMode={setMode} modes={["table", "list"]} />
        </div>
      </div>

      {mode === "table" ? (
        <DataTable<Subscription>
          data={filtered}
          columns={columns}
          storageKey="subscription-table"
          selectable
          onRowClick={setSelectedSub}
          onInlineEdit={handleInlineEdit}
          onBulkDelete={(ids) => setDeleteTarget({ ids, label: `${ids.length} subscriptions được chọn` })}
          renderRowActions={(item) => (
            <div className="flex items-center gap-0.5">
              <button type="button" onClick={() => setSelectedSub(item)} className="p-1 text-gray-400 hover:text-blue-600 rounded" title="Xem"><Eye className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => setDeleteTarget({ ids: [item.id], label: item.client })} className="p-1 text-gray-400 hover:text-red-600 rounded" title="Xóa"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          )}
          emptyMessage="Không tìm thấy subscription phù hợp"
        />
      ) : (
        <>
          {/* Subscription Cards */}
          <div className="space-y-2">
            {filtered.map((sub) => {
              const pCfg = PLAN_CONFIG[sub.plan];
              const sCfg = STATUS_CONFIG[sub.status];
              return (
                <div key={sub.id}
                  className={`bg-white rounded-xl border p-4 hover:shadow-sm transition-shadow cursor-pointer ${
                    sub.churnRisk >= 40 ? "border-red-200" : sub.daysToRenewal <= 30 && sub.status !== "churned" ? "border-amber-200" : "border-gray-100"
                  }`}
                  onClick={() => setSelectedSub(sub)}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{sub.clientLogo}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className={`text-[8px] px-1.5 py-0.5 rounded border ${pCfg.bgColor} flex items-center gap-0.5`}>{pCfg.icon} {pCfg.label}</span>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded ${sCfg.color}`}>{sCfg.label}</span>
                        <span className="text-[8px] text-gray-300">{BILLING_LABELS[sub.billing]}</span>
                        {sub.churnRisk >= 40 && (
                          <span className="text-[8px] px-1.5 py-0.5 rounded bg-red-50 text-red-600">Churn {sub.churnRisk}%</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-900">{sub.client}</p>
                      <div className="flex items-center gap-4 mt-1 text-[10px] text-gray-400">
                        <span>{sub.seatsUsed}/{sub.seats} seats</span>
                        <span>Gia hạn: {sub.daysToRenewal}d</span>
                        {sub.discount > 0 && <span className="text-green-500">-{sub.discount}%</span>}
                      </div>
                      {/* Usage mini bars */}
                      <div className="flex items-center gap-2 mt-1.5">
                        {sub.usage.slice(0, 3).map((u) => {
                          const pct = Math.round((u.current / u.limit) * 100);
                          return (
                            <div key={u.name} className="flex-1 min-w-0">
                              <div className="w-full bg-gray-100 rounded-full h-1">
                                <div className="h-1 rounded-full" style={{
                                  width: `${Math.min(pct, 100)}%`,
                                  backgroundColor: pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "#22c55e"
                                }} />
                              </div>
                              <p className="text-[7px] text-gray-300 mt-0.5">{u.name} {pct}%</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm text-gray-900">${(sub.mrr / 1000).toFixed(1)}K</p>
                      <p className="text-[8px] text-gray-400">MRR</p>
                      <div className="flex items-center justify-end mt-0.5">
                        {sub.trend === "up" && <ArrowUpRight className="w-3 h-3 text-green-500" />}
                        {sub.trend === "down" && <ArrowDownRight className="w-3 h-3 text-red-500" />}
                        {sub.trend === "stable" && <Minus className="w-3 h-3 text-gray-400" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Không tìm thấy subscription phù hợp</p>
            </div>
          )}
        </>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI Subscription Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            GlobalSoft quá hạn 2 tháng, churn risk 65%. SSO chưa fix là root cause. Escalate CEO-level meeting ngay.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            3 subscriptions cần gia hạn ≤30 ngày. MediSys & BankPro tích cực. SeoulTech cần intervention — offer downgrade.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            $221K expansion opportunity. Top: NeuralWave ($60K AI credits), TechCorp ($35K AI Agent), BankPro ($25K conversion).
          </p>
        </div>
      </div>

      {selectedSub && <SubDetailModal sub={selectedSub} onClose={() => setSelectedSub(null)} />}
      {showCreateModal && <CreateSubscriptionModal onClose={() => setShowCreateModal(false)} onCreated={(sub) => setSubscriptions((prev) => [sub, ...prev])} />}
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.label ?? ""}
        entityType="subscription"
        description="Thao tác này không thể hoàn tác."
        loading={deleting}
      />
    </div>
  );
}