/**
 * Predictive Analytics — Phân tích dự báo AI/ML
 * Churn prediction, deal win probability, lead scoring,
 * upsell/cross-sell opportunities, revenue forecasting, anomaly detection.
 */
import { useState, useMemo } from "react";
import {
  BrainCircuit,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  Bot,
  Users,
  DollarSign,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  Zap,
  BarChart3,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  RefreshCw,
  Search,
  Building2,
  Star,
  ThumbsUp,
  UserMinus,
  ShoppingCart,
  Lightbulb,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
 * Types
 * ============================================================ */
type PredictionType = "churn" | "win" | "upsell" | "lead-score";
type RiskLevel = "critical" | "high" | "medium" | "low";

interface ChurnPrediction {
  id: string;
  accountName: string;
  accountCompany: string;
  mrr: number;
  churnProbability: number;
  riskLevel: RiskLevel;
  topFactors: string[];
  recommendedActions: string[];
  lastActivity: string;
  contractEndDate: string;
  healthScore: number;
}

interface DealPrediction {
  id: string;
  dealName: string;
  company: string;
  value: number;
  stage: string;
  winProbability: number;
  daysInPipeline: number;
  nextBestAction: string;
  topSignals: string[];
  expectedCloseDate: string;
}

interface UpsellOpportunity {
  id: string;
  accountName: string;
  company: string;
  currentPlan: string;
  recommendedPlan: string;
  upsellProbability: number;
  potentialRevenue: number;
  signals: string[];
  bestTiming: string;
}

interface LeadScoreEntry {
  id: string;
  name: string;
  company: string;
  email: string;
  score: number;
  grade: "A" | "B" | "C" | "D";
  factors: { factor: string; impact: number }[];
  predictedConversion: number;
  bestChannel: string;
}

/* ============================================================
 * Constants
 * ============================================================ */
const RISK_CFG: Record<RiskLevel, { label: string; color: string; bg: string }> = {
  critical: { label: "Nguy hiểm", color: "text-red-600", bg: "bg-red-50 border-red-200" },
  high: { label: "Cao", color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
  medium: { label: "Trung bình", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  low: { label: "Thấp", color: "text-green-600", bg: "bg-green-50 border-green-200" },
};

const GRADE_CFG: Record<string, { color: string; bg: string }> = {
  A: { color: "text-green-700", bg: "bg-green-100" },
  B: { color: "text-blue-700", bg: "bg-blue-100" },
  C: { color: "text-amber-700", bg: "bg-amber-100" },
  D: { color: "text-red-700", bg: "bg-red-100" },
};

/* ============================================================
 * Mock Data
 * ============================================================ */
const MOCK_CHURN: ChurnPrediction[] = [
  {
    id: "ch_001", accountName: "Vũ Thanh Hà", accountCompany: "Big Retail Group", mrr: 15000000,
    churnProbability: 87, riskLevel: "critical",
    topFactors: ["Không đăng nhập 14 ngày", "3 ticket chưa giải quyết", "Giảm 60% API calls"],
    recommendedActions: ["Gọi điện trực tiếp từ CS Manager", "Tặng 1 tháng miễn phí", "Ưu tiên xử lý ticket #2847"],
    lastActivity: "2026-02-17T10:00:00Z", contractEndDate: "2026-04-30", healthScore: 18,
  },
  {
    id: "ch_002", accountName: "Trần Minh Đức", accountCompany: "LogiTech Express", mrr: 8500000,
    churnProbability: 72, riskLevel: "high",
    topFactors: ["Support satisfaction giảm liên tục", "Chỉ dùng 2/8 tính năng", "Đã xem trang pricing đối thủ"],
    recommendedActions: ["Book onboarding session cho tính năng chưa dùng", "Gửi case study ngành logistics", "Offer training 1-1 miễn phí"],
    lastActivity: "2026-02-25T14:00:00Z", contractEndDate: "2026-06-30", healthScore: 35,
  },
  {
    id: "ch_003", accountName: "Phạm Thuỳ Linh", accountCompany: "Saigon Creative", mrr: 5200000,
    churnProbability: 45, riskLevel: "medium",
    topFactors: ["Giảm 20% active users", "Không upgrade sau trial AI Coach", "NPS score: 6"],
    recommendedActions: ["Gửi email highlight giá trị AI Coach", "Mời tham gia webinar tính năng mới", "Giảm 15% nếu upgrade tháng này"],
    lastActivity: "2026-03-01T09:00:00Z", contractEndDate: "2026-09-30", healthScore: 55,
  },
  {
    id: "ch_004", accountName: "Lê Quốc Anh", accountCompany: "FinServe Pro", mrr: 25000000,
    churnProbability: 12, riskLevel: "low",
    topFactors: ["Tất cả metrics ổn định", "Mới mua add-on API", "CSAT 4.8/5"],
    recommendedActions: ["Tiếp tục nurture", "Gợi ý referral program"],
    lastActivity: "2026-03-03T08:00:00Z", contractEndDate: "2027-01-31", healthScore: 92,
  },
];

const MOCK_DEALS: DealPrediction[] = [
  {
    id: "dp_001", dealName: "Enterprise Package — DataViet", company: "DataViet Corp", value: 450000000,
    stage: "Negotiation", winProbability: 78, daysInPipeline: 34,
    nextBestAction: "Gửi proposal chỉnh sửa theo feedback CTO",
    topSignals: ["CTO đã approve budget", "Đã demo 3 lần", "Champion push nội bộ mạnh"],
    expectedCloseDate: "2026-03-20",
  },
  {
    id: "dp_002", dealName: "Scale Plan — MedTech", company: "MedTech Solutions", value: 280000000,
    stage: "Proposal Sent", winProbability: 55, daysInPipeline: 21,
    nextBestAction: "Follow-up call với VP Sales về ROI analysis",
    topSignals: ["Email open rate cao", "Downloaded whitepaper", "Competitor evaluation song song"],
    expectedCloseDate: "2026-04-05",
  },
  {
    id: "dp_003", dealName: "Starter Pack — EduTech", company: "EduTech Pro", value: 65000000,
    stage: "Discovery", winProbability: 32, daysInPipeline: 8,
    nextBestAction: "Book discovery call để hiểu pain points cụ thể",
    topSignals: ["Mới sign up trial", "Chỉ 1 contact point", "Budget chưa rõ"],
    expectedCloseDate: "2026-05-15",
  },
];

const MOCK_UPSELL: UpsellOpportunity[] = [
  {
    id: "up_001", accountName: "Nguyễn Minh Tuấn", company: "DataViet Corp",
    currentPlan: "Professional", recommendedPlan: "Enterprise AI",
    upsellProbability: 82, potentialRevenue: 12000000,
    signals: ["API usage gần limit (95%)", "Team size tăng 40% trong 3 tháng", "Đã hỏi về AI features"],
    bestTiming: "Tuần tới — khi API usage chạm limit",
  },
  {
    id: "up_002", accountName: "Hoàng Thị Thuỷ", company: "MedTech Solutions",
    currentPlan: "Business", recommendedPlan: "Enterprise",
    upsellProbability: 68, potentialRevenue: 18000000,
    signals: ["Đã thêm 15 users mới", "Sử dụng 92% tính năng hiện tại", "Request custom reporting"],
    bestTiming: "Cuối tháng 3 — trùng review period",
  },
  {
    id: "up_003", accountName: "Cao Thị Ngọc", company: "Fashion Forward",
    currentPlan: "Starter", recommendedPlan: "Professional",
    upsellProbability: 55, potentialRevenue: 6500000,
    signals: ["Bắt đầu dùng automation", "Hỏi về email sequences", "Marketing team muốn landing page builder"],
    bestTiming: "Khi hoàn thành campaign Q1",
  },
];

const MOCK_LEADS: LeadScoreEntry[] = [
  {
    id: "ls_001", name: "Nguyễn Minh Tuấn", company: "DataViet Corp", email: "tuan@dataviet.com",
    score: 94, grade: "A", predictedConversion: 85, bestChannel: "Direct Call",
    factors: [{ factor: "Visited pricing page 5 lần", impact: 25 }, { factor: "Downloaded enterprise whitepaper", impact: 20 }, { factor: "CTO title match ICP", impact: 18 }, { factor: "Company size 51-200", impact: 15 }, { factor: "Tech stack match", impact: 16 }],
  },
  {
    id: "ls_002", name: "Hoàng Thị Thuỷ", company: "MedTech Solutions", email: "thuy@medtech.vn",
    score: 82, grade: "A", predictedConversion: 72, bestChannel: "Email Sequence + Call",
    factors: [{ factor: "VP Sales — decision maker", impact: 22 }, { factor: "Company revenue $10M+", impact: 18 }, { factor: "Attended webinar", impact: 15 }, { factor: "Healthcare vertical match", impact: 12 }, { factor: "LinkedIn engagement", impact: 15 }],
  },
  {
    id: "ls_003", name: "Bùi Văn Đạt", company: "EduTech Pro", email: "dat@edutech.io",
    score: 58, grade: "C", predictedConversion: 35, bestChannel: "Content Nurture",
    factors: [{ factor: "CEO title", impact: 15 }, { factor: "Small company (11-50)", impact: -5 }, { factor: "Low budget indicator", impact: -10 }, { factor: "Opened 3 emails", impact: 8 }, { factor: "Education vertical", impact: 10 }],
  },
  {
    id: "ls_004", name: "Đinh Quốc Bảo", company: "Smart Manufacturing", email: "bao@smartmfg.vn",
    score: 41, grade: "D", predictedConversion: 15, bestChannel: "Automated Nurture",
    factors: [{ factor: "COO title match", impact: 12 }, { factor: "No website visit", impact: -15 }, { factor: "No email engagement", impact: -12 }, { factor: "Manufacturing vertical", impact: 8 }, { factor: "Cold lead", impact: -8 }],
  },
];

type Tab = "churn" | "deals" | "upsell" | "leads";

/* ============================================================
 * Probability Bar
 * ============================================================ */
function ProbBar({ value, label, colorFn }: { value: number; label?: string; colorFn?: (v: number) => string }) {
  const color = colorFn ? colorFn(value) : value >= 70 ? "bg-green-400" : value >= 40 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-[10px] text-gray-500 w-8 text-right">{value}%</span>
      {label && <span className="text-[9px] text-gray-400">{label}</span>}
    </div>
  );
}

/* ============================================================
 * Main Page
 * ============================================================ */
export function PredictiveAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("churn");
  const [selectedChurn, setSelectedChurn] = useState<ChurnPrediction | null>(null);

  const churnStats = useMemo(() => {
    const atRisk = MOCK_CHURN.filter((c) => c.churnProbability >= 50).length;
    const totalMrr = MOCK_CHURN.reduce((s, c) => s + c.mrr, 0);
    const atRiskMrr = MOCK_CHURN.filter((c) => c.churnProbability >= 50).reduce((s, c) => s + c.mrr, 0);
    return { atRisk, totalMrr, atRiskMrr, totalAccounts: MOCK_CHURN.length };
  }, []);

  const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { key: "churn", label: "Churn Risk", icon: UserMinus, badge: churnStats.atRisk },
    { key: "deals", label: "Deal Predictions", icon: Target },
    { key: "upsell", label: "Upsell/Cross-sell", icon: ShoppingCart },
    { key: "leads", label: "Lead Scoring AI", icon: Star },
  ];

  const fmtMoney = (n: number) => {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    return n.toLocaleString("vi-VN");
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-gray-900 flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-violet-600" /> Predictive Analytics
        </h1>
        <p className="text-gray-500 mt-0.5">
          AI/ML dự báo — churn prediction, deal win probability, lead scoring, upsell intelligence
        </p>
      </header>

      {/* Top Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-red-50 rounded-xl border border-red-200 p-3 text-center">
          <p className="text-xl text-red-600">{churnStats.atRisk}</p>
          <p className="text-[9px] text-red-700">Tài khoản nguy cơ churn</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-3 text-center">
          <p className="text-xl text-amber-600">{fmtMoney(churnStats.atRiskMrr)}đ</p>
          <p className="text-[9px] text-amber-700">MRR có nguy cơ</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-3 text-center">
          <p className="text-xl text-green-600">{fmtMoney(MOCK_DEALS.reduce((s, d) => s + d.value * d.winProbability / 100, 0))}đ</p>
          <p className="text-[9px] text-green-700">Weighted Pipeline</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-3 text-center">
          <p className="text-xl text-violet-600">{MOCK_UPSELL.length}</p>
          <p className="text-[9px] text-violet-700">Cơ hội Upsell</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              activeTab === t.key ? "bg-violet-600 text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>
            <t.icon className="w-4 h-4" /> {t.label}
            {t.badge != null && t.badge > 0 && (
              <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${activeTab === t.key ? "bg-white/20" : "bg-red-100 text-red-600"}`}>{t.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* === Tab: Churn Risk === */}
      {activeTab === "churn" && (
        <div className="space-y-3">
          {MOCK_CHURN.map((c) => {
            const rCfg = RISK_CFG[c.riskLevel];
            return (
              <div key={c.id} className={`bg-white rounded-xl border overflow-hidden ${c.riskLevel === "critical" ? "border-red-200" : "border-gray-100"}`}>
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      c.riskLevel === "critical" ? "bg-red-100" : c.riskLevel === "high" ? "bg-orange-100" : c.riskLevel === "medium" ? "bg-amber-100" : "bg-green-100"
                    }`}>
                      {c.riskLevel === "critical" || c.riskLevel === "high"
                        ? <ShieldAlert className={`w-5 h-5 ${rCfg.color}`} />
                        : <CheckCircle2 className={`w-5 h-5 ${rCfg.color}`} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-gray-900">{c.accountCompany}</span>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded border ${rCfg.bg} ${rCfg.color}`}>{rCfg.label}</span>
                        <span className="text-[8px] text-gray-400">MRR: {fmtMoney(c.mrr)}đ</span>
                      </div>
                      <p className="text-[10px] text-gray-400">{c.accountName} • Health Score: {c.healthScore}/100 • Hợp đồng hết: {c.contractEndDate}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-lg ${c.churnProbability >= 70 ? "text-red-600" : c.churnProbability >= 40 ? "text-amber-600" : "text-green-600"}`}>{c.churnProbability}%</p>
                      <p className="text-[8px] text-gray-400">Xác suất churn</p>
                    </div>
                  </div>

                  <ProbBar value={c.churnProbability}
                    colorFn={(v) => v >= 70 ? "bg-red-400" : v >= 40 ? "bg-amber-400" : "bg-green-400"} />

                  {/* Risk Factors */}
                  <div className="mt-2">
                    <p className="text-[9px] text-gray-400 mb-1">Yếu tố rủi ro:</p>
                    <div className="flex flex-wrap gap-1">
                      {c.topFactors.map((f) => (
                        <span key={f} className="text-[8px] px-1.5 py-0.5 bg-red-50 text-red-600 rounded border border-red-200">{f}</span>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="mt-2">
                    <p className="text-[9px] text-gray-400 mb-1">Hành động đề xuất:</p>
                    <div className="flex flex-wrap gap-1">
                      {c.recommendedActions.map((a) => (
                        <span key={a} className="text-[8px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">{a}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 px-4 py-2 bg-gray-50 border-t border-gray-100">
                  <button type="button" onClick={() => toast.success(`Đang tạo rescue plan cho ${c.accountCompany}`)}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-violet-600 hover:bg-violet-50 rounded-lg">
                    <Zap className="w-3 h-3" /> Tạo Rescue Plan
                  </button>
                  <button type="button" onClick={() => toast.success("Đang gọi...")}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Users className="w-3 h-3" /> Liên hệ ngay
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* === Tab: Deal Predictions === */}
      {activeTab === "deals" && (
        <div className="space-y-3">
          {MOCK_DEALS.map((d) => (
            <div key={d.id} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  d.winProbability >= 70 ? "bg-green-50 border border-green-200" : d.winProbability >= 40 ? "bg-amber-50 border border-amber-200" : "bg-red-50 border border-red-200"
                }`}>
                  <Target className={`w-5 h-5 ${d.winProbability >= 70 ? "text-green-600" : d.winProbability >= 40 ? "text-amber-600" : "text-red-600"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm text-gray-900">{d.dealName}</h3>
                  <p className="text-[10px] text-gray-400">{d.company} • {d.stage} • {d.daysInPipeline} ngày trong pipeline</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm text-gray-900">{fmtMoney(d.value)}đ</p>
                  <p className={`text-lg ${d.winProbability >= 70 ? "text-green-600" : d.winProbability >= 40 ? "text-amber-600" : "text-red-600"}`}>{d.winProbability}%</p>
                </div>
              </div>

              <ProbBar value={d.winProbability} />

              <div className="mt-2 p-2.5 bg-violet-50 rounded-lg border border-violet-200">
                <div className="flex items-center gap-1 mb-1">
                  <Sparkles className="w-3 h-3 text-violet-600" />
                  <span className="text-[9px] text-violet-600">Next Best Action</span>
                </div>
                <p className="text-xs text-violet-800">{d.nextBestAction}</p>
              </div>

              <div className="mt-2">
                <p className="text-[9px] text-gray-400 mb-1">Tín hiệu AI phát hiện:</p>
                <div className="flex flex-wrap gap-1">
                  {d.topSignals.map((s) => (
                    <span key={s} className="text-[8px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-200">{s}</span>
                  ))}
                </div>
              </div>

              <p className="text-[9px] text-gray-400 mt-2">Dự kiến đóng: {d.expectedCloseDate}</p>
            </div>
          ))}
        </div>
      )}

      {/* === Tab: Upsell === */}
      {activeTab === "upsell" && (
        <div className="space-y-3">
          {MOCK_UPSELL.map((u) => (
            <div key={u.id} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm text-gray-900">{u.company}</h3>
                  <p className="text-[10px] text-gray-400">{u.accountName} • {u.currentPlan} → {u.recommendedPlan}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm text-emerald-600">+{fmtMoney(u.potentialRevenue)}đ/th</p>
                  <p className={`text-lg ${u.upsellProbability >= 70 ? "text-green-600" : "text-amber-600"}`}>{u.upsellProbability}%</p>
                </div>
              </div>

              <ProbBar value={u.upsellProbability} />

              <div className="mt-2">
                <p className="text-[9px] text-gray-400 mb-1">Tín hiệu upsell:</p>
                <div className="flex flex-wrap gap-1">
                  {u.signals.map((s) => (
                    <span key={s} className="text-[8px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">{s}</span>
                  ))}
                </div>
              </div>

              <div className="mt-2 p-2.5 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-1 mb-0.5">
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span className="text-[9px] text-amber-700">Thời điểm tốt nhất</span>
                </div>
                <p className="text-xs text-amber-800">{u.bestTiming}</p>
              </div>

              <div className="flex items-center gap-1 mt-2">
                <button type="button" onClick={() => toast.success(`Tạo upsell campaign cho ${u.company}`)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                  <Zap className="w-3 h-3" /> Tạo Campaign
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* === Tab: Lead Scoring === */}
      {activeTab === "leads" && (
        <div className="space-y-3">
          {MOCK_LEADS.map((l) => {
            const gCfg = GRADE_CFG[l.grade];
            return (
              <div key={l.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${gCfg.bg}`}>
                    <span className={`text-sm ${gCfg.color}`}>{l.grade}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-gray-900">{l.name}</span>
                      <span className="text-[8px] text-gray-400">{l.company}</span>
                    </div>
                    <p className="text-[10px] text-gray-400">{l.email} • Kênh tốt nhất: {l.bestChannel}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-xl ${l.score >= 80 ? "text-green-600" : l.score >= 50 ? "text-amber-600" : "text-red-600"}`}>{l.score}</p>
                    <p className="text-[8px] text-gray-400">AI Score</p>
                  </div>
                </div>

                <ProbBar value={l.predictedConversion} label="Conversion" />

                <div className="mt-2 space-y-1">
                  {l.factors.map((f) => (
                    <div key={f.factor} className="flex items-center gap-2">
                      <span className={`text-[8px] w-7 text-right ${f.impact >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {f.impact >= 0 ? "+" : ""}{f.impact}
                      </span>
                      <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${f.impact >= 0 ? "bg-green-300" : "bg-red-300"}`}
                          style={{ width: `${Math.abs(f.impact) * 4}%` }} />
                      </div>
                      <span className="text-[8px] text-gray-500 flex-1">{f.factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI Predictive Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Model accuracy <strong>89.3%</strong> trên dữ liệu 6 tháng gần nhất. Churn prediction F1-score: <strong>0.87</strong>. Top feature importance: login frequency &amp; support tickets.</span>
          </p>
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span><strong>2 accounts</strong> có xác suất churn {">"} 70%, tổng MRR <strong>{fmtMoney(23500000)}đ</strong>. Nếu rescue thành công, giữ lại <strong>{fmtMoney(282000000)}đ ARR</strong>.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>AI phát hiện <strong>3 cơ hội upsell</strong> tổng giá trị <strong>{fmtMoney(36500000)}đ/tháng</strong>. DataViet Corp có xác suất cao nhất (82%) — API usage sắp chạm limit.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
