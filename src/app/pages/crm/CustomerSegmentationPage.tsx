/**
 * Customer Segmentation — Phân khúc khách hàng AI Clustering
 * RFM Analysis, AI clusters, segment rules, audience builder,
 * segment overlap, growth tracking, export audiences.
 */
import { useState, useMemo } from "react";
import {
  PieChart,
  Users,
  Target,
  Sparkles,
  Bot,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  BarChart3,
  Eye,
  Search,
  Plus,
  Download,
  RefreshCw,
  Star,
  Crown,
  Clock,
  DollarSign,
  ShoppingCart,
  UserMinus,
  UserPlus,
  Heart,
  Flame,
  Snowflake,
  Gem,
  X,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
 * Types
 * ============================================================ */
type SegmentType = "ai-cluster" | "rfm" | "custom" | "behavioral";

interface Segment {
  id: string;
  name: string;
  description: string;
  type: SegmentType;
  color: string;
  bgColor: string;
  icon: React.ComponentType<{ className?: string }>;
  customerCount: number;
  percentOfTotal: number;
  avgRevenue: number;
  avgLifetimeValue: number;
  avgDealSize: number;
  churnRisk: number;
  growthRate: number;
  topCharacteristics: string[];
  recommendedActions: string[];
}

interface RFMCell {
  recency: string;
  frequency: string;
  monetary: string;
  label: string;
  count: number;
  color: string;
}

/* ============================================================
 * Constants & Helpers
 * ============================================================ */
const TYPE_LABELS: Record<SegmentType, string> = {
  "ai-cluster": "AI Cluster",
  rfm: "RFM Analysis",
  custom: "Tuỳ chỉnh",
  behavioral: "Hành vi",
};

const fmtMoney = (n: number) => {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  return n.toLocaleString("vi-VN");
};

/* ============================================================
 * Mock Data
 * ============================================================ */
const MOCK_SEGMENTS: Segment[] = [
  {
    id: "seg_001", name: "Champions", description: "Khách hàng VIP — mua thường xuyên, giá trị cao, tương tác tích cực",
    type: "ai-cluster", color: "text-amber-700", bgColor: "bg-amber-50 border-amber-200",
    icon: Crown, customerCount: 124, percentOfTotal: 8.2, avgRevenue: 45000000, avgLifetimeValue: 380000000,
    avgDealSize: 85000000, churnRisk: 5, growthRate: 12.5,
    topCharacteristics: ["Mua > 6 lần/năm", "ARPU top 10%", "NPS 9-10", "Dùng > 80% tính năng", "Giới thiệu > 2 khách"],
    recommendedActions: ["Loyalty reward tier cao nhất", "Early access tính năng mới", "Mời làm case study", "Dedicated account manager"],
  },
  {
    id: "seg_002", name: "Loyal Customers", description: "Khách trung thành — gắn bó lâu dài, mua đều đặn",
    type: "ai-cluster", color: "text-green-700", bgColor: "bg-green-50 border-green-200",
    icon: Heart, customerCount: 287, percentOfTotal: 19.0, avgRevenue: 22000000, avgLifetimeValue: 195000000,
    avgDealSize: 42000000, churnRisk: 12, growthRate: 8.3,
    topCharacteristics: ["Tenure > 18 tháng", "CSAT > 4.5", "Renewal rate 95%", "Support tickets thấp"],
    recommendedActions: ["Upsell gói cao hơn", "Cross-sell add-ons", "Referral program invitation", "Quarterly business review"],
  },
  {
    id: "seg_003", name: "Potential Loyalists", description: "Khách mới có tiềm năng — đang tăng tương tác, cần nurture",
    type: "ai-cluster", color: "text-blue-700", bgColor: "bg-blue-50 border-blue-200",
    icon: Star, customerCount: 412, percentOfTotal: 27.3, avgRevenue: 12000000, avgLifetimeValue: 85000000,
    avgDealSize: 28000000, churnRisk: 22, growthRate: 15.8,
    topCharacteristics: ["Tenure 3-12 tháng", "Tăng usage 30%/tháng", "Đã mua 2-3 lần", "Mở email > 60%"],
    recommendedActions: ["Onboarding coaching intensif", "Feature adoption campaign", "Loyalty program enrollment", "Success milestone celebration"],
  },
  {
    id: "seg_004", name: "At Risk", description: "Có nguy cơ rời bỏ — giảm tương tác, cần can thiệp ngay",
    type: "ai-cluster", color: "text-red-700", bgColor: "bg-red-50 border-red-200",
    icon: Flame, customerCount: 156, percentOfTotal: 10.3, avgRevenue: 18000000, avgLifetimeValue: 145000000,
    avgDealSize: 35000000, churnRisk: 68, growthRate: -8.5,
    topCharacteristics: ["Login giảm 50%+", "Support tickets tăng", "NPS < 7", "Không upgrade/renew đúng hạn"],
    recommendedActions: ["Rescue call trong 48h", "Special retention offer", "Escalate lên CS Manager", "Root cause analysis meeting"],
  },
  {
    id: "seg_005", name: "Hibernating", description: "Ngủ đông — không hoạt động lâu, revenue giảm mạnh",
    type: "ai-cluster", color: "text-gray-600", bgColor: "bg-gray-50 border-gray-200",
    icon: Snowflake, customerCount: 198, percentOfTotal: 13.1, avgRevenue: 3500000, avgLifetimeValue: 42000000,
    avgDealSize: 15000000, churnRisk: 85, growthRate: -22.3,
    topCharacteristics: ["Không login > 30 ngày", "Không mua > 6 tháng", "Không mở email", "Zero API calls"],
    recommendedActions: ["Win-back email sequence", "Special comeback offer 50%", "Survey lý do rời bỏ", "Chuyển sang re-engagement campaign"],
  },
  {
    id: "seg_006", name: "High-Value New", description: "Khách mới chi tiêu cao — onboard nhanh, tiềm năng Champion",
    type: "ai-cluster", color: "text-violet-700", bgColor: "bg-violet-50 border-violet-200",
    icon: Gem, customerCount: 89, percentOfTotal: 5.9, avgRevenue: 35000000, avgLifetimeValue: 0,
    avgDealSize: 72000000, churnRisk: 18, growthRate: 45.2,
    topCharacteristics: ["Tenure < 3 tháng", "Deal size top 15%", "Dùng > 5 tính năng trong tuần đầu", "Enterprise plan"],
    recommendedActions: ["White-glove onboarding", "Executive sponsor meeting", "Custom integration support", "Fast-track lên Champions"],
  },
  {
    id: "seg_007", name: "Price Sensitive", description: "Nhạy cảm về giá — downgrade hoặc chờ promotion",
    type: "behavioral", color: "text-orange-700", bgColor: "bg-orange-50 border-orange-200",
    icon: DollarSign, customerCount: 245, percentOfTotal: 16.2, avgRevenue: 5800000, avgLifetimeValue: 52000000,
    avgDealSize: 12000000, churnRisk: 35, growthRate: -3.1,
    topCharacteristics: ["Xem pricing page > 3 lần/tháng", "Downgrade 1+ lần", "Chỉ mua khi có promotion", "So sánh đối thủ active"],
    recommendedActions: ["Value-focused communication", "ROI calculator personalized", "Annual plan discount", "Feature bundling thay vì giảm giá"],
  },
];

const MOCK_RFM: RFMCell[] = [
  { recency: "Gần đây", frequency: "Rất thường xuyên", monetary: "Cao", label: "Champions", count: 124, color: "bg-amber-400" },
  { recency: "Gần đây", frequency: "Thường xuyên", monetary: "Cao", label: "Loyal", count: 175, color: "bg-green-400" },
  { recency: "Gần đây", frequency: "Thường xuyên", monetary: "TB", label: "Potential", count: 268, color: "bg-blue-400" },
  { recency: "Gần đây", frequency: "Ít", monetary: "Cao", label: "New High-Value", count: 89, color: "bg-violet-400" },
  { recency: "Gần đây", frequency: "Ít", monetary: "Thấp", label: "New", count: 144, color: "bg-cyan-300" },
  { recency: "Lâu", frequency: "Thường xuyên", monetary: "Cao", label: "At Risk", count: 112, color: "bg-red-400" },
  { recency: "Lâu", frequency: "Ít", monetary: "TB", label: "Needs Attention", count: 156, color: "bg-orange-400" },
  { recency: "Rất lâu", frequency: "Ít", monetary: "Thấp", label: "Hibernating", count: 198, color: "bg-gray-400" },
  { recency: "Rất lâu", frequency: "TB", monetary: "TB", label: "About to Sleep", count: 45, color: "bg-yellow-400" },
];

type Tab = "segments" | "rfm" | "overlap";

/* ============================================================
 * Donut Segment (CSS-based)
 * ============================================================ */
function SegmentDonut({ segments }: { segments: Segment[] }) {
  const total = segments.reduce((s, seg) => s + seg.customerCount, 0);
  const colors = ["#f59e0b", "#22c55e", "#3b82f6", "#ef4444", "#6b7280", "#8b5cf6", "#f97316"];
  let accumulatedPercent = 0;
  const gradientParts = segments.map((seg, i) => {
    const pct = (seg.customerCount / total) * 100;
    const start = accumulatedPercent;
    accumulatedPercent += pct;
    return `${colors[i % colors.length]} ${start}% ${accumulatedPercent}%`;
  });
  const bg = `conic-gradient(${gradientParts.join(", ")})`;

  return (
    <div className="flex items-center gap-4">
      <div className="w-28 h-28 rounded-full flex-shrink-0 relative" style={{ background: bg }}>
        <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-gray-900">{fmtMoney(total)}</p>
            <p className="text-[8px] text-gray-400">Khách hàng</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {segments.map((seg, i) => (
          <div key={seg.id} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
            <span className="text-[9px] text-gray-500 truncate">{seg.name} ({seg.percentOfTotal}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
 * Create Segment Modal
 * ============================================================ */
function CreateSegmentModal({ onClose, onCreated }: { onClose: () => void; onCreated: (seg: Segment) => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<SegmentType>("custom");
  const [ruleInput, setRuleInput] = useState("");
  const [rules, setRules] = useState<string[]>([]);
  const [actionInput, setActionInput] = useState("");
  const [actions, setActions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const addRule = () => {
    const r = ruleInput.trim();
    if (r && !rules.includes(r)) { setRules((prev) => [...prev, r]); setRuleInput(""); }
  };
  const addAction = () => {
    const a = actionInput.trim();
    if (a && !actions.includes(a)) { setActions((prev) => [...prev, a]); setActionInput(""); }
  };

  const colorPairs = [
    { color: "text-blue-700", bgColor: "bg-blue-50 border-blue-200" },
    { color: "text-purple-700", bgColor: "bg-purple-50 border-purple-200" },
    { color: "text-teal-700", bgColor: "bg-teal-50 border-teal-200" },
    { color: "text-orange-700", bgColor: "bg-orange-50 border-orange-200" },
    { color: "text-pink-700", bgColor: "bg-pink-50 border-pink-200" },
  ];

  const handleSave = () => {
    if (!name.trim()) { toast.error("Vui lòng nhập tên segment"); return; }
    if (rules.length === 0) { toast.error("Vui lòng thêm ít nhất 1 đặc điểm/điều kiện"); return; }
    setSaving(true);
    const pair = colorPairs[Math.floor(Math.random() * colorPairs.length)];
    const newSeg: Segment = {
      id: `seg_${Date.now()}`, name, description: description || name,
      type, color: pair.color, bgColor: pair.bgColor, icon: Target,
      customerCount: 0, percentOfTotal: 0, avgRevenue: 0, avgLifetimeValue: 0,
      avgDealSize: 0, churnRisk: 0, growthRate: 0,
      topCharacteristics: rules, recommendedActions: actions.length > 0 ? actions : ["Cần thiết lập hành động"],
    };
    onCreated(newSeg);
    toast.success(`Đã tạo segment "${name}" — AI đang phân tích và gán khách hàng`);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Tạo Segment mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3 max-h-[65vh] overflow-y-auto">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tên Segment *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Enterprise Active Users"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-xs text-gray-500 mb-1 block">Mô tả</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Mô tả segment..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Loại</label>
              <select value={type} onChange={(e) => setType(e.target.value as SegmentType)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          {/* Rules / Characteristics */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Đặc điểm / Điều kiện ({rules.length}) *</label>
            <div className="flex items-center gap-2 mb-2">
              <input type="text" value={ruleInput} onChange={(e) => setRuleInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRule())}
                placeholder="VD: ARPU > 10M/tháng"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <button type="button" onClick={addRule} className="px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg border border-indigo-200">Thêm</button>
            </div>
            {rules.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {rules.map((r) => (
                  <span key={r} className="text-[9px] px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-200 flex items-center gap-1">
                    {r} <button type="button" onClick={() => setRules((prev) => prev.filter((x) => x !== r))} className="text-indigo-400 hover:text-indigo-700">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
          {/* Recommended Actions */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Hành động đề xuất ({actions.length})</label>
            <div className="flex items-center gap-2 mb-2">
              <input type="text" value={actionInput} onChange={(e) => setActionInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAction())}
                placeholder="VD: Gửi email upsell"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <button type="button" onClick={addAction} className="px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg border border-indigo-200">Thêm</button>
            </div>
            {actions.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {actions.map((a) => (
                  <span key={a} className="text-[9px] px-2 py-1 bg-green-50 text-green-600 rounded-lg border border-green-200 flex items-center gap-1">
                    {a} <button type="button" onClick={() => setActions((prev) => prev.filter((x) => x !== a))} className="text-green-400 hover:text-green-700">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
            <p className="text-[10px] text-indigo-700 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Sau khi tạo, AI sẽ tự động phân tích database và gán khách hàng phù hợp vào segment. Kết quả trong vài phút.</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Tạo Segment"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Main Page
 * ============================================================ */
export function CustomerSegmentationPage() {
  const [activeTab, setActiveTab] = useState<Tab>("segments");
  const [expandedId, setExpandedId] = useState<string | null>("seg_001");
  const [segments, setSegments] = useState(MOCK_SEGMENTS);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const stats = useMemo(() => {
    const total = segments.reduce((s, seg) => s + seg.customerCount, 0);
    const totalRevenue = segments.reduce((s, seg) => s + seg.avgRevenue * seg.customerCount, 0);
    const atRisk = segments.filter((s) => s.churnRisk >= 50).reduce((s, seg) => s + seg.customerCount, 0);
    const growing = segments.filter((s) => s.growthRate > 0).length;
    return { total, totalRevenue, atRisk, growing };
  }, [segments]);

  const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "segments", label: "AI Segments", icon: PieChart },
    { key: "rfm", label: "RFM Analysis", icon: BarChart3 },
    { key: "overlap", label: "Segment Overlap", icon: Target },
  ];

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <PieChart className="w-6 h-6 text-indigo-600" /> Customer Segmentation
          </h1>
          <p className="text-gray-500 mt-0.5">
            Phân khúc khách hàng bằng AI — RFM analysis, clustering, behavioral segments
          </p>
        </div>
        <button type="button" onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 self-start">
          <Plus className="w-4 h-4" /> Tạo Segment
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-white rounded-xl border border-gray-100 p-2.5 text-center">
          <p className="text-lg text-gray-900">{fmtMoney(stats.total)}</p>
          <p className="text-[9px] text-gray-400">Tổng khách hàng</p>
        </div>
        <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-2.5 text-center">
          <p className="text-lg text-indigo-600">{segments.length}</p>
          <p className="text-[9px] text-indigo-700">Segments</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-2.5 text-center">
          <p className="text-lg text-red-600">{stats.atRisk}</p>
          <p className="text-[9px] text-red-700">At Risk + Hibernating</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-2.5 text-center">
          <p className="text-lg text-green-600">{stats.growing}/{segments.length}</p>
          <p className="text-[9px] text-green-700">Segments tăng trưởng</p>
        </div>
      </div>

      {/* Donut */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <h3 className="text-sm text-gray-900 mb-3">Phân bố Phân khúc</h3>
        <SegmentDonut segments={segments} />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              activeTab === t.key ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* === Tab: AI Segments === */}
      {activeTab === "segments" && (
        <div className="space-y-3">
          {segments.map((seg) => {
            const SegIcon = seg.icon;
            const isExpanded = expandedId === seg.id;
            return (
              <div key={seg.id} className={`bg-white rounded-xl border overflow-hidden ${seg.churnRisk >= 50 ? "border-red-200" : "border-gray-100"}`}>
                <button type="button" onClick={() => setExpandedId(isExpanded ? null : seg.id)}
                  className="w-full p-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${seg.bgColor}`}>
                      <SegIcon className={`w-5 h-5 ${seg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-gray-900">{seg.name}</span>
                        <span className="text-[8px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{TYPE_LABELS[seg.type]}</span>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded border ${seg.bgColor} ${seg.color}`}>{seg.customerCount} KH ({seg.percentOfTotal}%)</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">{seg.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`text-xs flex items-center gap-0.5 ${seg.growthRate >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {seg.growthRate >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(seg.growthRate)}%
                      </span>
                      <span className="text-[8px] text-gray-400">ARPU: {fmtMoney(seg.avgRevenue)}đ</span>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
                    {/* Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      <div className="p-2 bg-gray-50 rounded-lg text-center">
                        <p className="text-sm text-gray-900">{fmtMoney(seg.avgRevenue)}đ</p>
                        <p className="text-[8px] text-gray-400">ARPU/tháng</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg text-center">
                        <p className="text-sm text-gray-900">{seg.avgLifetimeValue > 0 ? `${fmtMoney(seg.avgLifetimeValue)}đ` : "—"}</p>
                        <p className="text-[8px] text-gray-400">LTV</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg text-center">
                        <p className="text-sm text-gray-900">{fmtMoney(seg.avgDealSize)}đ</p>
                        <p className="text-[8px] text-gray-400">TB Deal Size</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg text-center">
                        <p className={`text-sm ${seg.churnRisk >= 50 ? "text-red-600" : seg.churnRisk >= 25 ? "text-amber-600" : "text-green-600"}`}>{seg.churnRisk}%</p>
                        <p className="text-[8px] text-gray-400">Churn Risk</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg text-center">
                        <p className={`text-sm ${seg.growthRate >= 0 ? "text-green-600" : "text-red-600"}`}>{seg.growthRate > 0 ? "+" : ""}{seg.growthRate}%</p>
                        <p className="text-[8px] text-gray-400">Tăng trưởng</p>
                      </div>
                    </div>

                    {/* Characteristics */}
                    <div>
                      <p className="text-[9px] text-gray-400 mb-1">Đặc trưng chính:</p>
                      <div className="flex flex-wrap gap-1">
                        {seg.topCharacteristics.map((c) => (
                          <span key={c} className="text-[8px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-200">{c}</span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div>
                      <p className="text-[9px] text-gray-400 mb-1">Hành động đề xuất:</p>
                      <div className="flex flex-wrap gap-1">
                        {seg.recommendedActions.map((a) => (
                          <span key={a} className="text-[8px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">{a}</span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => toast.success(`Tạo campaign cho ${seg.name}`)}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        <Zap className="w-3 h-3" /> Tạo Campaign
                      </button>
                      <button type="button" onClick={() => toast.success(`Xuất danh sách ${seg.name}`)}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200">
                        <Download className="w-3 h-3" /> Xuất danh sách
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* === Tab: RFM Analysis === */}
      {activeTab === "rfm" && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm text-gray-900 mb-3">RFM Matrix</h3>
            <p className="text-[10px] text-gray-400 mb-3">
              <strong>R</strong>ecency (Gần đây) × <strong>F</strong>requency (Tần suất) × <strong>M</strong>onetary (Giá trị) — phân loại khách hàng theo hành vi mua.
            </p>
            <div className="space-y-2">
              {MOCK_RFM.map((cell) => (
                <div key={cell.label} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-8 rounded-full flex-shrink-0 ${cell.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-900">{cell.label}</span>
                      <span className="text-[8px] text-gray-400">{cell.count} khách hàng</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[8px] text-gray-500">
                      <span>R: {cell.recency}</span>
                      <span>F: {cell.frequency}</span>
                      <span>M: {cell.monetary}</span>
                    </div>
                  </div>
                  <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                    <div className={`h-full rounded-full ${cell.color}`}
                      style={{ width: `${(cell.count / 300) * 100}%` }} />
                  </div>
                  <span className="text-[9px] text-gray-400 w-8 text-right">{cell.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* === Tab: Overlap === */}
      {activeTab === "overlap" && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-4">
          <h3 className="text-sm text-gray-900">Segment Overlap Analysis</h3>
          <p className="text-[10px] text-gray-400">Phân tích khách hàng thuộc nhiều segment — giúp tinh chỉnh targeting và tránh spam.</p>

          {[
            { seg1: "Loyal Customers", seg2: "Price Sensitive", overlap: 34, pct: 12, insight: "34 khách loyal nhưng nhạy cảm giá — cần value-focused messaging thay vì giảm giá" },
            { seg1: "At Risk", seg2: "Champions (cũ)", overlap: 18, pct: 12, insight: "18 Champions cũ đang ở trạng thái At Risk — ưu tiên rescue cao nhất, LTV rất lớn" },
            { seg1: "Potential Loyalists", seg2: "High-Value New", overlap: 52, pct: 13, insight: "52 khách mới chi tiêu cao đang chuyển dần sang loyal — đúng hướng, tiếp tục nurture" },
            { seg1: "Hibernating", seg2: "Price Sensitive", overlap: 78, pct: 32, insight: "78 khách ngủ đông do giá — thử win-back offer đặc biệt hoặc plan giá rẻ hơn" },
          ].map((item) => (
            <div key={`${item.seg1}-${item.seg2}`} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-900">{item.seg1}</span>
                <span className="text-[8px] text-gray-400">∩</span>
                <span className="text-xs text-gray-900">{item.seg2}</span>
                <span className="text-[8px] px-1.5 py-0.5 bg-violet-100 text-violet-600 rounded ml-auto">
                  {item.overlap} KH ({item.pct}%)
                </span>
              </div>
              <p className="text-[10px] text-gray-500">{item.insight}</p>
            </div>
          ))}
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl border border-indigo-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <h4 className="text-sm text-indigo-900">AI Segmentation Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-indigo-800">
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Segment <strong>High-Value New</strong> tăng trưởng <strong>+45.2%</strong> — nhanh nhất. AI phát hiện pattern: enterprise customers từ kênh LinkedIn Ads có conversion cao nhất.</span>
          </p>
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span><strong>354 khách hàng</strong> (23.4%) trong At Risk + Hibernating. Tổng MRR at risk: <strong>{fmtMoney(3_360_000_000)}đ/năm</strong>. Rescue campaign có thể cứu 40% nếu triển khai trong 2 tuần.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>AI clustering mới phát hiện sub-segment <strong>"Power Users nhưng NPS thấp"</strong> (67 KH) — họ dùng nhiều nhưng không hài lòng. Cần UX research interview ngay.</span>
          </p>
        </div>
      </div>

      {showCreateModal && <CreateSegmentModal onClose={() => setShowCreateModal(false)} onCreated={(seg) => setSegments((prev) => [seg, ...prev])} />}
    </div>
  );
}