/**
 * A/B Testing Manager — Quản lý thử nghiệm A/B
 * Experiment creation, variant management, traffic allocation,
 * statistical significance, winner declaration, conversion tracking.
 */
import { useState, useMemo } from "react";
import {
  FlaskConical,
  Play,
  Pause,
  Trophy,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  Sparkles,
  Bot,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  Eye,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Plus,
  Copy,
  MoreHorizontal,
  X,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
 * Types
 * ============================================================ */
type ExperimentStatus = "draft" | "running" | "paused" | "completed" | "winner-declared";
type MetricType = "conversion" | "revenue" | "engagement" | "retention";

interface Variant {
  id: string;
  name: string;
  description: string;
  trafficPercent: number;
  visitors: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  avgSessionDuration: number;
  bounceRate: number;
  isControl: boolean;
  isWinner: boolean;
}

interface Experiment {
  id: string;
  name: string;
  description: string;
  status: ExperimentStatus;
  type: string;
  page: string;
  primaryMetric: MetricType;
  variants: Variant[];
  startDate: string;
  endDate: string | null;
  totalVisitors: number;
  statisticalSignificance: number;
  confidenceLevel: number;
  minimumDetectableEffect: number;
  createdBy: string;
  tags: string[];
}

/* ============================================================
 * Constants
 * ============================================================ */
const STATUS_CFG: Record<ExperimentStatus, { label: string; color: string; bg: string; icon: typeof Play }> = {
  draft: { label: "Nháp", color: "text-gray-500", bg: "bg-gray-50 border-gray-200", icon: Clock },
  running: { label: "Đang chạy", color: "text-green-600", bg: "bg-green-50 border-green-200", icon: Play },
  paused: { label: "Tạm dừng", color: "text-amber-600", bg: "bg-amber-50 border-amber-200", icon: Pause },
  completed: { label: "Hoàn thành", color: "text-blue-600", bg: "bg-blue-50 border-blue-200", icon: CheckCircle2 },
  "winner-declared": { label: "Có kết quả", color: "text-violet-600", bg: "bg-violet-50 border-violet-200", icon: Trophy },
};

const METRIC_LABELS: Record<MetricType, string> = {
  conversion: "Tỷ lệ chuyển đổi",
  revenue: "Doanh thu",
  engagement: "Tương tác",
  retention: "Giữ chân",
};

/* ============================================================
 * Mock Data
 * ============================================================ */
const MOCK_EXPERIMENTS: Experiment[] = [
  {
    id: "exp_001",
    name: "CTA Button — Pricing Page",
    description: "Thử nghiệm màu sắc và text CTA trên trang Pricing để tăng conversion rate đăng ký trial",
    status: "running",
    type: "UI Element",
    page: "/pricing",
    primaryMetric: "conversion",
    startDate: "2026-02-15T00:00:00Z",
    endDate: null,
    totalVisitors: 12450,
    statisticalSignificance: 94.2,
    confidenceLevel: 95,
    minimumDetectableEffect: 5,
    createdBy: "Trần Đức Anh",
    tags: ["Pricing", "CTA", "Conversion"],
    variants: [
      {
        id: "v_001a", name: "Control (Xanh)", description: "Nút xanh dương \"Dùng thử miễn phí\"",
        trafficPercent: 34, visitors: 4233, conversions: 338, conversionRate: 7.99,
        revenue: 0, avgSessionDuration: 185, bounceRate: 42.3, isControl: true, isWinner: false,
      },
      {
        id: "v_001b", name: "Variant A (Tím)", description: "Nút tím gradient \"Bắt đầu ngay — Miễn phí 14 ngày\"",
        trafficPercent: 33, visitors: 4108, conversions: 411, conversionRate: 10.0,
        revenue: 0, avgSessionDuration: 210, bounceRate: 38.1, isControl: false, isWinner: false,
      },
      {
        id: "v_001c", name: "Variant B (Cam)", description: "Nút cam \"Khám phá AI-CRM — Không cần thẻ\"",
        trafficPercent: 33, visitors: 4109, conversions: 370, conversionRate: 9.0,
        revenue: 0, avgSessionDuration: 195, bounceRate: 40.5, isControl: false, isWinner: false,
      },
    ],
  },
  {
    id: "exp_002",
    name: "Onboarding Flow — New Users",
    description: "So sánh onboarding 3 bước vs 5 bước chi tiết để tối ưu activation rate",
    status: "winner-declared",
    type: "User Flow",
    page: "/onboarding",
    primaryMetric: "engagement",
    startDate: "2026-01-10T00:00:00Z",
    endDate: "2026-02-28T00:00:00Z",
    totalVisitors: 8920,
    statisticalSignificance: 98.7,
    confidenceLevel: 95,
    minimumDetectableEffect: 3,
    createdBy: "Nguyễn Thị Mai",
    tags: ["Onboarding", "UX", "Activation"],
    variants: [
      {
        id: "v_002a", name: "Control (5 bước)", description: "Flow onboarding 5 bước đầy đủ",
        trafficPercent: 50, visitors: 4460, conversions: 2676, conversionRate: 60.0,
        revenue: 0, avgSessionDuration: 420, bounceRate: 25.0, isControl: true, isWinner: false,
      },
      {
        id: "v_002b", name: "Variant (3 bước)", description: "Flow rút gọn 3 bước + optional deep-dive",
        trafficPercent: 50, visitors: 4460, conversions: 3346, conversionRate: 75.0,
        revenue: 0, avgSessionDuration: 280, bounceRate: 15.2, isControl: false, isWinner: true,
      },
    ],
  },
  {
    id: "exp_003",
    name: "Email Subject Line — Newsletter",
    description: "Thử nghiệm subject line cho email newsletter hàng tuần",
    status: "completed",
    type: "Email",
    page: "Newsletter #47",
    primaryMetric: "conversion",
    startDate: "2026-02-25T00:00:00Z",
    endDate: "2026-03-01T00:00:00Z",
    totalVisitors: 15200,
    statisticalSignificance: 97.3,
    confidenceLevel: 95,
    minimumDetectableEffect: 2,
    createdBy: "Phạm Thuỳ Linh",
    tags: ["Email", "Newsletter", "Open Rate"],
    variants: [
      {
        id: "v_003a", name: "Control", description: "\"AI-CRM Weekly: Tính năng mới tháng 3\"",
        trafficPercent: 33, visitors: 5067, conversions: 1216, conversionRate: 24.0,
        revenue: 0, avgSessionDuration: 0, bounceRate: 0, isControl: true, isWinner: false,
      },
      {
        id: "v_003b", name: "Emoji + Urgency", description: "\"🚀 Đừng bỏ lỡ: 3 tính năng AI sẽ thay đổi cách bạn bán hàng\"",
        trafficPercent: 33, visitors: 5067, conversions: 1570, conversionRate: 31.0,
        revenue: 0, avgSessionDuration: 0, bounceRate: 0, isControl: false, isWinner: true,
      },
      {
        id: "v_003c", name: "Personalized", description: "\"[Tên], đây là những gì đội sales hàng đầu đang dùng\"",
        trafficPercent: 34, visitors: 5066, conversions: 1418, conversionRate: 28.0,
        revenue: 0, avgSessionDuration: 0, bounceRate: 0, isControl: false, isWinner: false,
      },
    ],
  },
  {
    id: "exp_004",
    name: "Pricing Tier Layout",
    description: "So sánh layout 3 cột vs layout so sánh bảng cho trang pricing",
    status: "draft",
    type: "Page Layout",
    page: "/pricing",
    primaryMetric: "revenue",
    startDate: "",
    endDate: null,
    totalVisitors: 0,
    statisticalSignificance: 0,
    confidenceLevel: 95,
    minimumDetectableEffect: 5,
    createdBy: "Trần Đức Anh",
    tags: ["Pricing", "Layout", "Revenue"],
    variants: [
      {
        id: "v_004a", name: "Control (3 cột)", description: "Layout card 3 cột hiện tại",
        trafficPercent: 50, visitors: 0, conversions: 0, conversionRate: 0,
        revenue: 0, avgSessionDuration: 0, bounceRate: 0, isControl: true, isWinner: false,
      },
      {
        id: "v_004b", name: "Comparison Table", description: "Layout bảng so sánh chi tiết tất cả features",
        trafficPercent: 50, visitors: 0, conversions: 0, conversionRate: 0,
        revenue: 0, avgSessionDuration: 0, bounceRate: 0, isControl: false, isWinner: false,
      },
    ],
  },
];

const fmtNum = (n: number) => n.toLocaleString("vi-VN");

/* ============================================================
 * Variant Bar Chart (simple inline)
 * ============================================================ */
function VariantBar({ variant, maxRate, controlRate }: { variant: Variant; maxRate: number; controlRate: number }) {
  const lift = controlRate > 0 ? ((variant.conversionRate - controlRate) / controlRate * 100) : 0;
  const barWidth = maxRate > 0 ? (variant.conversionRate / maxRate * 100) : 0;
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-28 flex-shrink-0">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-700">{variant.name}</span>
          {variant.isControl && <span className="text-[7px] px-1 py-0.5 bg-gray-200 text-gray-500 rounded">Control</span>}
          {variant.isWinner && <Trophy className="w-3 h-3 text-amber-500" />}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="h-6 bg-gray-100 rounded-full overflow-hidden relative">
          <div
            className={`h-full rounded-full transition-all ${
              variant.isWinner ? "bg-gradient-to-r from-green-400 to-emerald-500" :
              variant.isControl ? "bg-blue-300" : "bg-violet-400"
            }`}
            style={{ width: `${barWidth}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-[9px] text-gray-700">
            {variant.conversionRate.toFixed(1)}% ({fmtNum(variant.conversions)}/{fmtNum(variant.visitors)})
          </span>
        </div>
      </div>
      <div className="w-16 text-right flex-shrink-0">
        {!variant.isControl && variant.conversionRate > 0 && (
          <span className={`text-xs flex items-center justify-end gap-0.5 ${lift >= 0 ? "text-green-600" : "text-red-600"}`}>
            {lift >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(lift).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * Create Experiment Modal
 * ============================================================ */
function CreateExperimentModal({ onClose, onCreated }: { onClose: () => void; onCreated: (exp: Experiment) => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("UI Element");
  const [page, setPage] = useState("/pricing");
  const [primaryMetric, setPrimaryMetric] = useState<MetricType>("conversion");
  const [variantCount, setVariantCount] = useState(2);
  const [confidenceLevel, setConfidenceLevel] = useState(95);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!name.trim()) { toast.error("Vui lòng nhập tên experiment"); return; }
    setSaving(true);
    const variants: Variant[] = [
      { id: `v_${Date.now()}_ctrl`, name: "Control", description: "Phiên bản hiện tại (control)", trafficPercent: Math.floor(100 / variantCount), visitors: 0, conversions: 0, conversionRate: 0, revenue: 0, avgSessionDuration: 0, bounceRate: 0, isControl: true, isWinner: false },
      ...Array.from({ length: variantCount - 1 }, (_, i) => ({
        id: `v_${Date.now()}_${i}`, name: `Variant ${String.fromCharCode(65 + i)}`, description: `Phiên bản thử nghiệm ${String.fromCharCode(65 + i)}`, trafficPercent: Math.floor(100 / variantCount), visitors: 0, conversions: 0, conversionRate: 0, revenue: 0, avgSessionDuration: 0, bounceRate: 0, isControl: false, isWinner: false,
      })),
    ];
    const newExp: Experiment = {
      id: `exp_${Date.now()}`, name, description: description || name, status: "draft", type, page,
      primaryMetric, variants, startDate: "", endDate: null, totalVisitors: 0,
      statisticalSignificance: 0, confidenceLevel, minimumDetectableEffect: 5,
      createdBy: "Người dùng hiện tại", tags: [],
    };
    onCreated(newExp);
    toast.success(`Đã tạo experiment "${name}" (bản nháp)`);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Tạo Experiment mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tên experiment *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: CTA Button — Landing Page"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Mô tả</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Mô tả mục tiêu thử nghiệm..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Loại thử nghiệm</label>
              <select value={type} onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="UI Element">UI Element</option>
                <option value="User Flow">User Flow</option>
                <option value="Pricing">Pricing</option>
                <option value="Email">Email</option>
                <option value="Landing Page">Landing Page</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Trang mục tiêu</label>
              <input type="text" value={page} onChange={(e) => setPage(e.target.value)} placeholder="/pricing"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Metric chính</label>
              <select value={primaryMetric} onChange={(e) => setPrimaryMetric(e.target.value as MetricType)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                {Object.entries(METRIC_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Số variants</label>
              <select value={variantCount} onChange={(e) => setVariantCount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value={2}>2 (A/B)</option>
                <option value={3}>3 (A/B/C)</option>
                <option value={4}>4 (A/B/C/D)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Tin cậy</label>
              <select value={confidenceLevel} onChange={(e) => setConfidenceLevel(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value={90}>90%</option>
                <option value={95}>95%</option>
                <option value={99}>99%</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Tạo Experiment"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Main Page
 * ============================================================ */
export function ABTestingPage() {
  const [statusFilter, setStatusFilter] = useState<ExperimentStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>("exp_001");
  const [experiments, setExperiments] = useState(MOCK_EXPERIMENTS);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateExperiment = (exp: Experiment) => {
    setExperiments((prev) => [exp, ...prev]);
    setExpandedId(exp.id);
  };

  const filtered = useMemo(() => {
    let result = experiments;
    if (statusFilter !== "all") result = result.filter((e) => e.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((e) => e.name.toLowerCase().includes(q) || e.tags.some((t) => t.toLowerCase().includes(q)));
    }
    return result;
  }, [experiments, statusFilter, search]);

  const stats = useMemo(() => ({
    total: experiments.length,
    running: experiments.filter((e) => e.status === "running").length,
    completed: experiments.filter((e) => e.status === "completed" || e.status === "winner-declared").length,
    avgSignificance: experiments.filter((e) => e.statisticalSignificance > 0).reduce((s, e) => s + e.statisticalSignificance, 0) /
      (experiments.filter((e) => e.statisticalSignificance > 0).length || 1),
  }), [experiments]);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-gray-900 flex items-center gap-2">
          <FlaskConical className="w-6 h-6 text-orange-600" /> A/B Testing Manager
        </h1>
        <p className="text-gray-500 mt-0.5">
          Quản lý thử nghiệm — tạo experiment, phân bổ traffic, theo dõi statistical significance
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-white rounded-xl border border-gray-100 p-2.5 text-center">
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-[9px] text-gray-400">Experiments</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-2.5 text-center">
          <p className="text-lg text-green-600">{stats.running}</p>
          <p className="text-[9px] text-green-700">Đang chạy</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-2.5 text-center">
          <p className="text-lg text-blue-600">{stats.completed}</p>
          <p className="text-[9px] text-blue-700">Hoàn thành</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-2.5 text-center">
          <p className="text-lg text-violet-600">{stats.avgSignificance.toFixed(1)}%</p>
          <p className="text-[9px] text-violet-700">TB Statistical Significance</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[150px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Tìm experiment..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ExperimentStatus | "all")}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
          <option value="all">Tất cả trạng thái</option>
          {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <button type="button" onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1 px-3 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700">
          <Plus className="w-4 h-4" /> Tạo mới
        </button>
      </div>

      {/* Experiment Cards */}
      <div className="space-y-3">
        {filtered.map((exp) => {
          const stCfg = STATUS_CFG[exp.status];
          const StIcon = stCfg.icon;
          const isExpanded = expandedId === exp.id;
          const controlRate = exp.variants.find((v) => v.isControl)?.conversionRate ?? 0;
          const maxRate = Math.max(...exp.variants.map((v) => v.conversionRate), 1);
          const winner = exp.variants.find((v) => v.isWinner);

          return (
            <div key={exp.id} className={`bg-white rounded-xl border overflow-hidden ${
              exp.status === "running" ? "border-green-200" :
              exp.status === "winner-declared" ? "border-violet-200" : "border-gray-100"
            }`}>
              {/* Header */}
              <button type="button" onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                className="w-full p-4 text-left">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${stCfg.bg}`}>
                    <StIcon className={`w-5 h-5 ${stCfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-gray-900">{exp.name}</span>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded border ${stCfg.bg} ${stCfg.color}`}>{stCfg.label}</span>
                      <span className="text-[8px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{exp.type}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5 truncate">{exp.description}</p>
                    <div className="flex items-center gap-3 mt-1 text-[9px] text-gray-400 flex-wrap">
                      <span>{exp.variants.length} variants</span>
                      <span>{fmtNum(exp.totalVisitors)} visitors</span>
                      <span>{METRIC_LABELS[exp.primaryMetric]}</span>
                      {exp.statisticalSignificance > 0 && (
                        <span className={exp.statisticalSignificance >= 95 ? "text-green-600" : "text-amber-600"}>
                          Significance: {exp.statisticalSignificance}%
                        </span>
                      )}
                      {winner && (
                        <span className="text-violet-600 flex items-center gap-0.5">
                          <Trophy className="w-2.5 h-2.5" /> {winner.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {exp.tags.map((t) => (
                      <span key={t} className="text-[7px] px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded border border-orange-200">{t}</span>
                    ))}
                  </div>
                </div>
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
                  {/* Variant Comparison */}
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1">So sánh Variants</p>
                    {exp.variants.map((v) => (
                      <VariantBar key={v.id} variant={v} maxRate={maxRate} controlRate={controlRate} />
                    ))}
                  </div>

                  {/* Details Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-[9px]">
                      <thead>
                        <tr className="text-gray-400 border-b border-gray-100">
                          <th className="text-left py-1.5 pr-2">Variant</th>
                          <th className="text-right py-1.5 px-2">Traffic</th>
                          <th className="text-right py-1.5 px-2">Visitors</th>
                          <th className="text-right py-1.5 px-2">Conversions</th>
                          <th className="text-right py-1.5 px-2">Rate</th>
                          <th className="text-right py-1.5 px-2">Session (s)</th>
                          <th className="text-right py-1.5 pl-2">Bounce</th>
                        </tr>
                      </thead>
                      <tbody>
                        {exp.variants.map((v) => (
                          <tr key={v.id} className={`border-b border-gray-50 ${v.isWinner ? "bg-green-50" : ""}`}>
                            <td className="py-1.5 pr-2 text-gray-700 flex items-center gap-1">
                              {v.name}
                              {v.isWinner && <Trophy className="w-2.5 h-2.5 text-amber-500" />}
                            </td>
                            <td className="text-right py-1.5 px-2 text-gray-500">{v.trafficPercent}%</td>
                            <td className="text-right py-1.5 px-2 text-gray-500">{fmtNum(v.visitors)}</td>
                            <td className="text-right py-1.5 px-2 text-gray-700">{fmtNum(v.conversions)}</td>
                            <td className={`text-right py-1.5 px-2 ${v.isWinner ? "text-green-600" : "text-gray-700"}`}>
                              {v.conversionRate.toFixed(1)}%
                            </td>
                            <td className="text-right py-1.5 px-2 text-gray-500">{v.avgSessionDuration > 0 ? `${v.avgSessionDuration}s` : "—"}</td>
                            <td className="text-right py-1.5 pl-2 text-gray-500">{v.bounceRate > 0 ? `${v.bounceRate}%` : "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Significance Bar */}
                  {exp.statisticalSignificance > 0 && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] text-gray-400">Statistical Significance</span>
                        <span className={`text-xs ${exp.statisticalSignificance >= 95 ? "text-green-600" : "text-amber-600"}`}>
                          {exp.statisticalSignificance}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${
                          exp.statisticalSignificance >= 95 ? "bg-green-400" : "bg-amber-400"
                        }`} style={{ width: `${exp.statisticalSignificance}%` }} />
                      </div>
                      <p className="text-[8px] text-gray-400 mt-1">
                        Ngưỡng tin cậy: {exp.confidenceLevel}% • MDE: {exp.minimumDetectableEffect}%
                        {exp.statisticalSignificance >= 95
                          ? " • ✅ Đủ dữ liệu để đưa ra kết luận"
                          : " • ⏳ Cần thêm dữ liệu"}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-wrap">
                    {exp.status === "running" && (
                      <>
                        <button type="button" onClick={() => toast.success("Đã tạm dừng experiment")}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-amber-600 hover:bg-amber-50 rounded-lg border border-amber-200">
                          <Pause className="w-3 h-3" /> Tạm dừng
                        </button>
                        {exp.statisticalSignificance >= 95 && (
                          <button type="button" onClick={() => toast.success("Đã chọn winner!")}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] bg-violet-600 text-white rounded-lg hover:bg-violet-700">
                            <Trophy className="w-3 h-3" /> Chọn Winner
                          </button>
                        )}
                      </>
                    )}
                    {exp.status === "paused" && (
                      <button type="button" onClick={() => toast.success("Đã tiếp tục experiment")}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-green-600 hover:bg-green-50 rounded-lg border border-green-200">
                        <Play className="w-3 h-3" /> Tiếp tục
                      </button>
                    )}
                    {exp.status === "draft" && (
                      <button type="button" onClick={() => toast.success("Đã khởi chạy experiment!")}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] bg-green-600 text-white rounded-lg hover:bg-green-700">
                        <Play className="w-3 h-3" /> Khởi chạy
                      </button>
                    )}
                    <span className="text-[8px] text-gray-400 ml-auto">
                      Bởi {exp.createdBy} • {exp.startDate ? new Date(exp.startDate).toLocaleDateString("vi-VN") : "Chưa bắt đầu"}
                      {exp.endDate && ` → ${new Date(exp.endDate).toLocaleDateString("vi-VN")}`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-orange-600" />
          <h4 className="text-sm text-orange-900">AI A/B Testing Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-orange-800">
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>CTA experiment đang cho thấy <strong>Variant A (Tím)</strong> vượt trội với lift <strong>+25.2%</strong>. Significance 94.2% — cần thêm ~500 visitors để đạt 95%.</span>
          </p>
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span>Onboarding 3 bước giảm thời gian activation <strong>33%</strong> và tăng completion rate <strong>+15%</strong>. Đề xuất roll out 100% traffic ngay.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>AI gợi ý test tiếp theo: <strong>Social proof section</strong> trên landing page — dự đoán potential uplift <strong>8-12%</strong> dựa trên industry benchmarks.</span>
          </p>
        </div>
      </div>
      {showCreateModal && <CreateExperimentModal onClose={() => setShowCreateModal(false)} onCreated={handleCreateExperiment} />}
    </div>
  );
}